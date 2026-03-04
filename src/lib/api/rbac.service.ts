/**
 * RBAC API Service
 * Handles all role and permission management API calls with fallback
 */

import {
  fetchPaginatedWithFallback,
  fetchWithFallback,
  putWithFallback,
  postWithFallback,
  deleteWithFallback,
  FallbackResponse,
} from './client';
import type { Role, Permission, PaginatedResponse, ApiResponse } from '../models';

/**
 * Get all roles
 */
export async function getRoles(): Promise<FallbackResponse<PaginatedResponse<Role>>> {
  return fetchPaginatedWithFallback<Role>('/rbac/roles', 'roles.json');
}

/**
 * Get role by ID
 */
export async function getRoleById(
  id: string
): Promise<FallbackResponse<ApiResponse<Role>>> {
  return fetchWithFallback(`/rbac/roles/${id}`, 'roles.json');
}

/**
 * Create new role
 */
export async function createRole(
  data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>
): Promise<FallbackResponse<ApiResponse<Role>>> {
  const mockRole: Role = {
    ...data,
    id: `role_${Date.now()}`,
    userCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return postWithFallback('/rbac/roles', 'roles.json', data, { success: true, data: mockRole });
}

/**
 * Update role
 */
export async function updateRole(
  id: string,
  data: Partial<Role>
): Promise<FallbackResponse<ApiResponse<Role>>> {
  return putWithFallback(`/rbac/roles/${id}`, data, { success: true, data: null });
}

/**
 * Delete role
 */
export async function deleteRole(
  id: string
): Promise<FallbackResponse<ApiResponse<null>>> {
  return deleteWithFallback(`/rbac/roles/${id}`, { success: true, data: null });
}

/**
 * Get all permissions
 */
export async function getPermissions(): Promise<FallbackResponse<ApiResponse<Permission[]>>> {
  const mockPermissions: Permission[] = [
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
  ];

  return fetchWithFallback('/rbac/permissions', 'roles.json');
}

/**
 * Assign permissions to role
 */
export async function assignPermissions(
  roleId: string,
  permissionIds: string[]
): Promise<FallbackResponse<ApiResponse<null>>> {
  return putWithFallback(
    `/rbac/roles/${roleId}/permissions`,
    { permissionIds },
    { success: true, data: null }
  );
}

/**
 * Check if user has permission
 */
export function hasPermission(
  userPermissions: Permission[],
  resource: string,
  action: string
): boolean {
  return userPermissions.some(
    (p) => p.resource === resource && p.action === action
  );
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  permissions: string[]
): boolean {
  return permissions.some((perm) =>
    userPermissions.some((p) => p.name === perm)
  );
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  permissions: string[]
): boolean {
  return permissions.every((perm) =>
    userPermissions.some((p) => p.name === perm)
  );
}

/**
 * Get role hierarchy level
 */
export function getRoleLevel(roleName: string): number {
  const levels: Record<string, number> = {
    SUPER_ADMIN: 100,
    ADMIN: 80,
    MANAGER: 60,
    USER: 40,
    GUEST: 20,
  };
  return levels[roleName] || 0;
}

/**
 * Check if role A is higher than role B
 */
export function isHigherRole(roleA: string, roleB: string): boolean {
  return getRoleLevel(roleA) > getRoleLevel(roleB);
}
