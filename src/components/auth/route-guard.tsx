/**
 * Route Guard Component
 * Client-side route protection using auth state
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function RouteGuard({ 
  children, 
  requireAuth = true,
  requireAdmin = false,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, isLoading, initialize, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      // If auth is required and user is not authenticated
      if (requireAuth && !isAuthenticated) {
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
        return;
      }

      // If admin is required and user is not admin
      if (requireAdmin && user) {
        const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(user.role?.name || '');
        if (!isAdmin) {
          router.push('/dashboard');
          return;
        }
      }

      // If user is authenticated and trying to access auth pages
      if (!requireAuth && isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, requireAuth, requireAdmin, router, pathname, user]);

  // Show loading state while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if redirecting
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAdmin && user) {
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(user.role?.name || '');
    if (!isAdmin) {
      return null;
    }
  }

  return <>{children}</>;
}
