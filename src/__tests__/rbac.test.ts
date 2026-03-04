/**
 * RBAC Utilities Unit Tests
 * Tests for role-based access control logic
 */

import { Permission, User, UserRole } from '../lib/models';

// Helper functions to test
const hasPermission = (user: User | null, resource: string, action: string): boolean => {
  if (!user?.role?.permissions) return false;
  return user.role.permissions.some(
    (p: Permission) => p.resource === resource && p.action === action
  );
};

const hasRole = (user: User | null, roles: UserRole | UserRole[]): boolean => {
  if (!user?.role) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role.name);
};

const isAdmin = (user: User | null): boolean => {
  if (!user?.role) return false;
  return ['SUPER_ADMIN', 'ADMIN'].includes(user.role.name);
};

// Mock user factory
const createMockUser = (role: UserRole, permissions: Permission[] = []): User => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: {
    id: '1',
    name: role,
    displayName: role,
    description: `${role} role`,
    permissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  status: 'ACTIVE',
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('RBAC Utilities', () => {
  describe('hasPermission', () => {
    it('should return false for null user', () => {
      expect(hasPermission(null, 'users', 'view')).toBe(false);
    });

    it('should return false when user has no permissions', () => {
      const user = createMockUser('USER', []);
      expect(hasPermission(user, 'users', 'view')).toBe(false);
    });

    it('should return true when user has the permission', () => {
      const user = createMockUser('USER', [
        { id: '1', resource: 'users', action: 'view' },
      ]);
      expect(hasPermission(user, 'users', 'view')).toBe(true);
    });

    it('should return false for different action on same resource', () => {
      const user = createMockUser('USER', [
        { id: '1', resource: 'users', action: 'view' },
      ]);
      expect(hasPermission(user, 'users', 'delete')).toBe(false);
    });

    it('should return false for different resource', () => {
      const user = createMockUser('USER', [
        { id: '1', resource: 'users', action: 'view' },
      ]);
      expect(hasPermission(user, 'files', 'view')).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return false for null user', () => {
      expect(hasRole(null, 'ADMIN')).toBe(false);
    });

    it('should return true when user has the role', () => {
      const user = createMockUser('ADMIN');
      expect(hasRole(user, 'ADMIN')).toBe(true);
    });

    it('should return false when user has different role', () => {
      const user = createMockUser('USER');
      expect(hasRole(user, 'ADMIN')).toBe(false);
    });

    it('should return true when user has one of multiple roles', () => {
      const user = createMockUser('MANAGER');
      expect(hasRole(user, ['ADMIN', 'MANAGER', 'USER'])).toBe(true);
    });

    it('should return false when user has none of the roles', () => {
      const user = createMockUser('GUEST');
      expect(hasRole(user, ['ADMIN', 'MANAGER'])).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return false for null user', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('should return true for SUPER_ADMIN', () => {
      const user = createMockUser('SUPER_ADMIN');
      expect(isAdmin(user)).toBe(true);
    });

    it('should return true for ADMIN', () => {
      const user = createMockUser('ADMIN');
      expect(isAdmin(user)).toBe(true);
    });

    it('should return false for MANAGER', () => {
      const user = createMockUser('MANAGER');
      expect(isAdmin(user)).toBe(false);
    });

    it('should return false for USER', () => {
      const user = createMockUser('USER');
      expect(isAdmin(user)).toBe(false);
    });

    it('should return false for GUEST', () => {
      const user = createMockUser('GUEST');
      expect(isAdmin(user)).toBe(false);
    });
  });
});

describe('Role Hierarchy', () => {
  const roleHierarchy: Record<UserRole, number> = {
    SUPER_ADMIN: 5,
    ADMIN: 4,
    MANAGER: 3,
    USER: 2,
    GUEST: 1,
  };

  it('should have correct hierarchy levels', () => {
    expect(roleHierarchy.SUPER_ADMIN).toBeGreaterThan(roleHierarchy.ADMIN);
    expect(roleHierarchy.ADMIN).toBeGreaterThan(roleHierarchy.MANAGER);
    expect(roleHierarchy.MANAGER).toBeGreaterThan(roleHierarchy.USER);
    expect(roleHierarchy.USER).toBeGreaterThan(roleHierarchy.GUEST);
  });
});
