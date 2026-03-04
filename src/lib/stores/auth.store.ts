/**
 * Authentication Store
 * Manages user authentication state using Zustand
 * For demo: Auto-authenticates with mock user
 */

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import type { User, UserRole, Permission, LoginCredentials, RegisterData } from '../models';
import * as authApi from '../api/auth.service';

// Demo mock user for development
const DEMO_USER: User = {
  id: '1',
  email: 'admin@devsecops.com',
  name: 'Admin User',
  avatar: undefined,
  role: {
    id: '1',
    name: 'ADMIN' as UserRole,
    displayName: 'Administrator',
    description: 'Full administrative access',
    permissions: [
      { id: '1', resource: 'users', action: 'view' },
      { id: '2', resource: 'users', action: 'create' },
      { id: '3', resource: 'users', action: 'edit' },
      { id: '4', resource: 'users', action: 'delete' },
      { id: '5', resource: 'roles', action: 'view' },
      { id: '6', resource: 'roles', action: 'manage' },
      { id: '7', resource: 'files', action: 'view' },
      { id: '8', resource: 'files', action: 'manage' },
    ] as Permission[],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  status: 'ACTIVE',
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isMockData: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setInitialized: (value: boolean) => void;
}

// Custom storage with hydration tracking
const customStorage: StateStorage = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    return str ? JSON.parse(str) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state - start with demo user for development
      user: DEMO_USER,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true, // Start as initialized since we have demo user
      error: null,
      isMockData: true,

      // Set initialized state
      setInitialized: (value: boolean) => set({ isInitialized: value }),

      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          if (response.data?.success && response.data?.data?.user) {
            set({
              user: response.data.data.user,
              isAuthenticated: true,
              isMockData: response.isMock,
            });
            return true;
          }
          // For demo, accept any credentials
          set({
            user: { ...DEMO_USER, email: credentials.email },
            isAuthenticated: true,
            isMockData: true,
          });
          return true;
        } catch {
          // For demo, accept any credentials even on error
          set({
            user: { ...DEMO_USER, email: credentials.email },
            isAuthenticated: true,
            isMockData: true,
          });
          return true;
        } finally {
          set({ isLoading: false });
        }
      },

      // Register action
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          if (response.data?.success && response.data?.data?.user) {
            set({
              user: response.data.data.user,
              isAuthenticated: true,
              isMockData: response.isMock,
            });
            return true;
          }
          // For demo, create a new user based on registration
          set({
            user: { ...DEMO_USER, email: data.email, name: data.name },
            isAuthenticated: true,
            isMockData: true,
          });
          return true;
        } catch {
          // For demo, accept registration even on error
          set({
            user: { ...DEMO_USER, email: data.email, name: data.name },
            isAuthenticated: true,
            isMockData: true,
          });
          return true;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } finally {
          // For demo, just reset to unauthenticated state
          set({
            user: null,
            isAuthenticated: false,
            isMockData: true,
            isLoading: false,
          });
        }
      },

      // Refresh user data
      refreshUser: async () => {
        try {
          const response = await authApi.getCurrentUser();
          if (response.data?.data) {
            const users = response.data as unknown as { data: User[] };
            const currentUser = Array.isArray(users.data) ? users.data[0] : response.data.data as unknown as User;
            set({
              user: currentUser,
              isMockData: response.isMock,
            });
          }
        } catch {
          // Silent fail on refresh
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Set user directly
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'devsecops-auth',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, mark as initialized
        if (state) {
          state.setInitialized(true);
        }
      },
    }
  )
);

// Hook to check if store is hydrated
export const useAuthHydration = () => {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return isInitialized;
};

// Selector hooks for common auth checks
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsMockData = () => useAuthStore((state) => state.isMockData);

// Permission check hook
export const useHasPermission = (resource: string, action: string): boolean => {
  const user = useAuthStore((state) => state.user);
  if (!user?.role?.permissions) return false;
  return user.role.permissions.some(
    (p: Permission) => p.resource === resource && p.action === action
  );
};

// Role check hook
export const useHasRole = (roles: UserRole | UserRole[]): boolean => {
  const user = useAuthStore((state) => state.user);
  if (!user?.role) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role.name);
};

// Admin check hook
export const useIsAdmin = (): boolean => {
  const user = useAuthStore((state) => state.user);
  if (!user?.role) return false;
  return ['SUPER_ADMIN', 'ADMIN'].includes(user.role.name);
};
