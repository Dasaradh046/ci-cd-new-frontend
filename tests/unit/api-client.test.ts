/**
 * Unit Tests for API Client
 * Tests for HTTP client and request/response handling
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock fetch globally
const mockFetch = jest.fn() as jest.Mock;
global.fetch = mockFetch;

// API Client implementation
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, error.message || 'Request failed');
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient('/api');
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with default base URL', () => {
      const defaultClient = new ApiClient();
      expect(defaultClient).toBeInstanceOf(ApiClient);
    });

    it('should set custom base URL', () => {
      const customClient = new ApiClient('/custom-api');
      expect(customClient).toBeInstanceOf(ApiClient);
    });
  });

  describe('setAuthToken', () => {
    it('should add Authorization header when token is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      client.setAuthToken('test-token');
      await client.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should remove Authorization header when token is null', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      client.setAuthToken('test-token');
      client.setAuthToken(null);
      await client.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        })
      );
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.get('/users/1');

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should throw ApiError on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      });

      await expect(client.get('/users/999')).rejects.toThrow(ApiError);
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request with data', async () => {
      const inputData = { name: 'New User' };
      const mockResponse = { id: 1, ...inputData };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.post('/users', inputData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(inputData),
        })
      );
    });

    it('should make POST request without data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await client.post('/action');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/action',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const updateData = { name: 'Updated Name' };
      const mockResponse = { id: 1, name: 'Updated Name' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.put('/users/1', updateData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );
    });
  });

  describe('PATCH requests', () => {
    it('should make successful PATCH request', async () => {
      const patchData = { status: 'inactive' };
      const mockResponse = { id: 1, status: 'inactive' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.patch('/users/1', patchData);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await client.delete('/users/1');

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle 400 Bad Request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid input' }),
      });

      await expect(client.post('/users', {})).rejects.toThrow('Invalid input');
    });

    it('should handle 401 Unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      });

      await expect(client.get('/protected')).rejects.toThrow(ApiError);
    });

    it('should handle 500 Server Error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal server error' }),
      });

      await expect(client.get('/error')).rejects.toThrow('Internal server error');
    });

    it('should handle JSON parse error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(client.get('/error')).rejects.toThrow('Unknown error');
    });
  });
});

describe('ApiError', () => {
  it('should create error with status and message', () => {
    const error = new ApiError(404, 'Not found');

    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.name).toBe('ApiError');
  });

  it('should be instance of Error', () => {
    const error = new ApiError(500, 'Server error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });
});

describe('Request Interceptors', () => {
  it('should include Content-Type header by default', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const testClient = new ApiClient('/api');
    await testClient.get('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should allow overriding headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const testClient = new ApiClient('/api');
    await testClient.request('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/upload',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'multipart/form-data',
        }),
      })
    );
  });
});
