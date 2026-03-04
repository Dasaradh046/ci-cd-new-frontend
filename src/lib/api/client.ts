/**
 * API Client with Fallback Mechanism
 * Implements the Strategy pattern for graceful degradation from API to mock data
 */

import type { ApiResponse, PaginatedResponse } from '../models';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch with timeout and error handling
 */
async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include', // Include cookies for JWT auth
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.code || 'UNKNOWN_ERROR',
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData.details
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('TIMEOUT', 'Request timed out');
    }
    throw new ApiError('NETWORK_ERROR', 'Network request failed');
  }
}

/**
 * Load mock data from public directory
 */
async function loadMockData<T>(filename: string): Promise<T> {
  const response = await fetch(`/dummy-data/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load mock data: ${filename}`);
  }
  return response.json();
}

/**
 * API Response with mock indicator
 */
export interface FallbackResponse<T> {
  data: T;
  isMock: boolean;
  error?: string;
}

/**
 * Fetch with automatic fallback to mock data
 * Primary strategy: Try API first
 * Fallback strategy: Use local mock data
 */
export async function fetchWithFallback<T>(
  endpoint: string,
  mockFile: string,
  options: RequestInit = {}
): Promise<FallbackResponse<T>> {
  try {
    // Attempt API call
    const url = `${API_BASE_URL}${endpoint}`;
    const data = await fetchWithTimeout<T>(url, options);
    return { data, isMock: false };
  } catch (error) {
    // Log the fallback (in development)
    if (process.env.NODE_ENV === 'development') {
      console.warn(`API call failed for ${endpoint}, falling back to mock data:`, error);
    }

    // Fallback to mock data
    try {
      const mockData = await loadMockData<T>(mockFile);
      return { data: mockData, isMock: true };
    } catch (mockError) {
      // Both API and mock failed
      return {
        data: null as T,
        isMock: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Fetch with fallback for paginated responses
 */
export async function fetchPaginatedWithFallback<T>(
  endpoint: string,
  mockFile: string,
  options: RequestInit = {}
): Promise<FallbackResponse<PaginatedResponse<T>>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const data = await fetchWithTimeout<PaginatedResponse<T>>(url, options);
    return { data: { ...data, isMock: false }, isMock: false };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`API call failed for ${endpoint}, falling back to mock data:`, error);
    }

    try {
      const mockData = await loadMockData<PaginatedResponse<T>>(mockFile);
      return { data: { ...mockData, isMock: true }, isMock: true };
    } catch (mockError) {
      return {
        data: { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0, isMock: true },
        isMock: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * POST request with fallback
 */
export async function postWithFallback<T, R>(
  endpoint: string,
  mockFile: string,
  body: T,
  mockResponse?: R
): Promise<FallbackResponse<R>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const data = await fetchWithTimeout<R>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return { data, isMock: false };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`POST failed for ${endpoint}, using mock response:`, error);
    }

    // For POST requests, we may want to return a predefined mock response
    if (mockResponse) {
      return { data: mockResponse, isMock: true };
    }

    // Or load from mock file
    try {
      const mockData = await loadMockData<R>(mockFile);
      return { data: mockData, isMock: true };
    } catch {
      return {
        data: null as R,
        isMock: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * DELETE request with fallback
 */
export async function deleteWithFallback<R>(
  endpoint: string,
  mockResponse: R
): Promise<FallbackResponse<R>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const data = await fetchWithTimeout<R>(url, { method: 'DELETE' });
    return { data, isMock: false };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`DELETE failed for ${endpoint}, using mock response:`, error);
    }
    return { data: mockResponse, isMock: true };
  }
}

/**
 * PUT request with fallback
 */
export async function putWithFallback<T, R>(
  endpoint: string,
  body: T,
  mockResponse: R
): Promise<FallbackResponse<R>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const data = await fetchWithTimeout<R>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return { data, isMock: false };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`PUT failed for ${endpoint}, using mock response:`, error);
    }
    return { data: mockResponse, isMock: true };
  }
}

export { fetchWithTimeout };
