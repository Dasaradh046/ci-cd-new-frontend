/**
 * Authentication API Service
 * Handles all authentication-related API calls with fallback
 */

import {
  fetchWithFallback,
  postWithFallback,
  FallbackResponse,
} from './client';
import type {
  User,
  LoginCredentials,
  RegisterData,
  PasswordResetRequest,
  PasswordResetData,
  ApiResponse,
} from '../models';

// Mock successful responses
const mockSuccessResponse = { success: true, message: 'Operation completed (mock)' };
const mockUser: User = {
  id: 'usr_001',
  email: 'admin@devsecops.com',
  name: 'Alex Johnson',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  bio: 'System Administrator with 10+ years of experience',
  role: {
    id: 'role_001',
    name: 'SUPER_ADMIN',
    description: 'Full system access including RBAC management',
    permissions: [
      { id: 'perm_001', name: 'users.create', description: 'Create new users', resource: 'users', action: 'create' },
      { id: 'perm_002', name: 'users.read', description: 'View user details', resource: 'users', action: 'read' },
      { id: 'perm_003', name: 'users.update', description: 'Update user information', resource: 'users', action: 'update' },
      { id: 'perm_004', name: 'users.delete', description: 'Delete users', resource: 'users', action: 'delete' },
      { id: 'perm_005', name: 'roles.create', description: 'Create new roles', resource: 'roles', action: 'create' },
      { id: 'perm_006', name: 'roles.read', description: 'View roles', resource: 'roles', action: 'read' },
      { id: 'perm_007', name: 'roles.update', description: 'Update roles', resource: 'roles', action: 'update' },
      { id: 'perm_008', name: 'roles.delete', description: 'Delete roles', resource: 'roles', action: 'delete' },
      { id: 'perm_009', name: 'permissions.read', description: 'View permissions', resource: 'permissions', action: 'read' },
      { id: 'perm_010', name: 'permissions.assign', description: 'Assign permissions', resource: 'permissions', action: 'assign' },
      { id: 'perm_011', name: 'files.upload', description: 'Upload files', resource: 'files', action: 'create' },
      { id: 'perm_012', name: 'files.read', description: 'View files', resource: 'files', action: 'read' },
      { id: 'perm_013', name: 'files.delete', description: 'Delete files', resource: 'files', action: 'delete' },
      { id: 'perm_014', name: 'settings.read', description: 'View settings', resource: 'settings', action: 'read' },
      { id: 'perm_015', name: 'settings.update', description: 'Update settings', resource: 'settings', action: 'update' },
    ],
    userCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  status: 'active',
  emailVerified: true,
  lastLoginAt: '2025-01-15T10:30:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2025-01-15T10:30:00Z',
};

/**
 * Login with email and password
 */
export async function login(
  credentials: LoginCredentials
): Promise<FallbackResponse<ApiResponse<{ user: User }>>> {
  return postWithFallback(
    '/auth/login',
    'users.json',
    credentials,
    { success: true, data: { user: mockUser } }
  );
}

/**
 * Register new user
 */
export async function register(
  data: RegisterData
): Promise<FallbackResponse<ApiResponse<{ user: User }>>> {
  return postWithFallback(
    '/auth/register',
    'users.json',
    data,
    { success: true, data: { user: { ...mockUser, id: 'usr_new', email: data.email, name: data.name } } }
  );
}

/**
 * Logout current user
 */
export async function logout(): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    '/auth/logout',
    'users.json',
    {},
    { success: true, data: null }
  );
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<FallbackResponse<ApiResponse<User>>> {
  return fetchWithFallback('/auth/me', 'users.json');
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
  data: PasswordResetRequest
): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    '/auth/forgot-password',
    'users.json',
    data,
    { success: true, data: null, message: 'Password reset email sent (mock)' }
  );
}

/**
 * Reset password with token
 */
export async function resetPassword(
  data: PasswordResetData
): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    '/auth/reset-password',
    'users.json',
    data,
    { success: true, data: null, message: 'Password reset successfully (mock)' }
  );
}

/**
 * Update password (authenticated)
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    '/auth/update-password',
    'users.json',
    { currentPassword, newPassword },
    { success: true, data: null, message: 'Password updated successfully (mock)' }
  );
}

/**
 * Verify email with token
 */
export async function verifyEmail(
  token: string
): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    '/auth/verify-email',
    'users.json',
    { token },
    { success: true, data: null, message: 'Email verified successfully (mock)' }
  );
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    '/auth/resend-email',
    'users.json',
    {},
    { success: true, data: null, message: 'Verification email sent (mock)' }
  );
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<FallbackResponse<ApiResponse<null>>> {
  return postWithFallback(
    '/auth/refresh',
    'users.json',
    {},
    { success: true, data: null }
  );
}
