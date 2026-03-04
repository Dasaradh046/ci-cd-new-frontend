/**
 * Application UI Store
 * Manages global UI state (sidebar, theme, modals, etc.)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ViewMode = 'dashboard' | 'users' | 'rbac' | 'files' | 'profile' | 'settings' | 'notifications' | 'docs';

interface AppState {
  // Navigation state
  currentView: ViewMode;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modal state
  activeModal: string | null;
  modalData: Record<string, unknown> | null;

  // Theme state
  theme: 'light' | 'dark' | 'system';

  // Loading states
  globalLoading: boolean;

  // Actions
  setCurrentView: (view: ViewMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentView: 'dashboard',
      sidebarOpen: true,
      sidebarCollapsed: false,
      activeModal: null,
      modalData: null,
      theme: 'dark',
      globalLoading: false,

      // Actions
      setCurrentView: (view) => set({ currentView: view }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      openModal: (modalId, data = {}) => set({ activeModal: modalId, modalData: data }),

      closeModal: () => set({ activeModal: null, modalData: null }),

      setTheme: (theme) => set({ theme }),

      setGlobalLoading: (loading) => set({ globalLoading: loading }),
    }),
    {
      name: 'devsecops-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentView: state.currentView,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);

// Selector hooks
export const useCurrentView = () => useAppStore((state) => state.currentView);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
export const useActiveModal = () => useAppStore((state) => state.activeModal);
export const useTheme = () => useAppStore((state) => state.theme);
