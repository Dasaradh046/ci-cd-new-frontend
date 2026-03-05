/**
 * Users API Service
 * Handles all user management API calls with fallback
 */

import {
  fetchPaginatedWithFallback,
  fetchWithFallback,
  putWithFallback,
  deleteWithFallback,
  FallbackResponse,
} from './client';
import type { User, PaginatedResponse, ApiResponse, UserStatus } from '../models';

/**
 * Get all users (admin only)
 */
export async function getUsers(
  page: number = 1,
  pageSize: number = 10,
  filters?: { status?: UserStatus; role?: string; search?: string }
): Promise<FallbackResponse<PaginatedResponse<User>>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.role && { role: filters.role }),
    ...(filters?.search && { search: filters.search }),
  });

  return fetchPaginatedWithFallback<User>(
    `/users?${params.toString()}`,
    'users.json'
  );
}

/**
 * Get user by ID
 */
export async function getUserById(
  id: string
): Promise<FallbackResponse<ApiResponse<User>>> {
  return fetchWithFallback(`/users/${id}`, 'users.json');
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<FallbackResponse<ApiResponse<User>>> {
  // For mock, return updated user
  const mockUser: User = {
    id,
    email: data.email || 'user@devsecops.com',
    name: data.name || 'Updated User',
    avatar: data.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Updated',
    bio: data.bio || '',
    role: data.role || {
      id: 'role_004',
      name: 'USER',
      description: 'Standard user',
      permissions: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    status: data.status || 'active',
    emailVerified: data.emailVerified ?? true,
    createdAt: data.createdAt || '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  };

  return putWithFallback(`/users/${id}`, data, { success: true, data: mockUser });
}

/**
 * Delete user (soft delete)
 */
export async function deleteUser(
  id: string
): Promise<FallbackResponse<ApiResponse<null>>> {
  return deleteWithFallback(`/users/${id}`, { success: true, data: null });
}

/**
 * Update user status
 */
export async function updateUserStatus(
  id: string,
  status: UserStatus
): Promise<FallbackResponse<ApiResponse<User | null>>> {
  return putWithFallback(
    `/users/${id}/status`,
    { status },
    { success: true, data: null }
  );
}

/**
 * Assign role to user
 */
export async function assignRole(
  userId: string,
  roleId: string
): Promise<FallbackResponse<ApiResponse<null>>> {
  return putWithFallback(
    `/users/${userId}/role`,
    { roleId },
    { success: true, data: null }
  );
}

/**
 * Get user profile
 */
export async function getProfile(): Promise<FallbackResponse<ApiResponse<User>>> {
  return fetchWithFallback('/auth/me', 'users.json');
}

/**
 * Update user profile
 */
export async function updateProfile(
  data: Partial<Pick<User, 'name' | 'bio' | 'avatar'>>
): Promise<FallbackResponse<ApiResponse<User | null>>> {
  return putWithFallback('/users/profile', data, { success: true, data: null });
}
