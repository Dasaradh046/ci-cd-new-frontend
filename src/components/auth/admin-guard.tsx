/**
 * Admin Guard Component
 * Protects admin-only routes with role-based access control
 */

'use client';

import { useIsAdmin, useIsAuthenticated, useAuthStore } from '@/lib/stores';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();

  // Loading state - wait for hydration
  if (!isInitialized) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground mt-2">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
