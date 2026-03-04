/**
 * Auth Store Unit Tests
 * Tests for authentication state management
 */

import { act, renderHook } from '@testing-library/react';
import { useAuthStore, useIsAdmin, useIsAuthenticated, useHasPermission, useHasRole } from '../lib/stores/auth.store';

// Mock user for testing
const mockAdminUser = {
  id: '1',
  email: 'admin@devsecops.com',
  name: 'Admin User',
  avatar: undefined,
  role: {
    id: '1',
    name: 'ADMIN' as const,
    displayName: 'Administrator',
    description: 'Full administrative access',
    permissions: [
      { id: '1', resource: 'users', action: 'view' },
      { id: '2', resource: 'users', action: 'create' },
      { id: '3', resource: 'users', action: 'edit' },
      { id: '4', resource: 'users', action: 'delete' },
      { id: '5', resource: 'roles', action: 'view' },
      { id: '6', resource: 'roles', action: 'manage' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  status: 'ACTIVE' as const,
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockRegularUser = {
  ...mockAdminUser,
  id: '2',
  email: 'user@devsecops.com',
  name: 'Regular User',
  role: {
    ...mockAdminUser.role,
    name: 'USER' as const,
    displayName: 'User',
    description: 'Standard user',
    permissions: [
      { id: '1', resource: 'profile', action: 'view' },
      { id: '2', resource: 'files', action: 'read' },
    ],
  },
};

// Reset store before each test
beforeEach(() => {
  useAuthStore.setState({
    user: mockAdminUser,
    isAuthenticated: true,
    isLoading: false,
    isInitialized: true,
    error: null,
    isMockData: true,
  });
});

describe('Auth Store', () => {
  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();
      
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(true);
      expect(state.error).toBeNull();
      expect(state.isMockData).toBe(true);
    });

    it('should have a demo user with ADMIN role', () => {
      const state = useAuthStore.getState();
      
      expect(state.user).not.toBeNull();
      expect(state.user?.email).toBe('admin@devsecops.com');
      expect(state.user?.role?.name).toBe('ADMIN');
    });
  });

  describe('Login Action', () => {
    it('should login successfully with demo credentials', async () => {
      const { login } = useAuthStore.getState();
      
      await act(async () => {
        const result = await login({ email: 'newuser@example.com', password: 'password' });
        expect(result).toBe(true);
      });
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      // Login should authenticate the user
      expect(state.user).not.toBeNull();
    });
  });

  describe('Logout Action', () => {
    it('should logout successfully', async () => {
      const { logout } = useAuthStore.getState();
      
      await act(async () => {
        await logout();
      });
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('Set User Action', () => {
    it('should set user correctly', () => {
      const { setUser } = useAuthStore.getState();
      
      act(() => {
        setUser(mockRegularUser);
      });
      
      const state = useAuthStore.getState();
      expect(state.user?.email).toBe('user@devsecops.com');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear user when set to null', () => {
      const { setUser } = useAuthStore.getState();
      
      act(() => {
        setUser(null);
      });
      
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Clear Error Action', () => {
    it('should clear error', () => {
      const { clearError } = useAuthStore.getState();
      
      act(() => {
        useAuthStore.setState({ error: 'Test error' });
      });
      
      act(() => {
        clearError();
      });
      
      const state = useAuthStore.getState();
      expect(state.error).toBeNull();
    });
  });
});

describe('Auth Selector Hooks', () => {
  describe('useIsAuthenticated', () => {
    it('should return true when authenticated', () => {
      const { result } = renderHook(() => useIsAuthenticated());
      expect(result.current).toBe(true);
    });

    it('should return false when not authenticated', () => {
      act(() => {
        useAuthStore.setState({ isAuthenticated: false, user: null });
      });
      
      const { result } = renderHook(() => useIsAuthenticated());
      expect(result.current).toBe(false);
    });
  });

  describe('useIsAdmin', () => {
    it('should return true for ADMIN role', () => {
      const { result } = renderHook(() => useIsAdmin());
      expect(result.current).toBe(true);
    });

    it('should return false for USER role', () => {
      act(() => {
        useAuthStore.setState({ user: mockRegularUser });
      });
      
      const { result } = renderHook(() => useIsAdmin());
      expect(result.current).toBe(false);
    });
  });

  describe('useHasPermission', () => {
    it('should return true when user has permission', () => {
      const { result } = renderHook(() => useHasPermission('users', 'view'));
      expect(result.current).toBe(true);
    });

    it('should return false when user lacks permission', () => {
      const { result } = renderHook(() => useHasPermission('nonexistent', 'view'));
      expect(result.current).toBe(false);
    });
  });

  describe('useHasRole', () => {
    it('should return true when user has role', () => {
      const { result } = renderHook(() => useHasRole('ADMIN'));
      expect(result.current).toBe(true);
    });

    it('should return true when user has one of multiple roles', () => {
      const { result } = renderHook(() => useHasRole(['SUPER_ADMIN', 'ADMIN']));
      expect(result.current).toBe(true);
    });

    it('should return false when user lacks role', () => {
      const { result } = renderHook(() => useHasRole('SUPER_ADMIN'));
      expect(result.current).toBe(false);
    });
  });
});
