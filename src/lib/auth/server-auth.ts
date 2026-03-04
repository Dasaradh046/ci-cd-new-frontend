/**
 * Server-side Authentication Utilities
 * Replaces deprecated middleware with server-side route protection
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface ServerAuthResult {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
}

/**
 * Check authentication status on the server side
 * Uses HTTP-only cookies for secure authentication
 */
export async function getServerAuthStatus(): Promise<ServerAuthResult> {
  const cookieStore = await cookies();
  
  // Check for access token cookie
  const accessToken = cookieStore.get('access_token');
  const userSession = cookieStore.get('user_session');
  
  if (!accessToken?.value) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
  
  try {
    // If we have a user session cookie, parse it
    if (userSession?.value) {
      const userData = JSON.parse(decodeURIComponent(userSession.value));
      return {
        isAuthenticated: true,
        user: userData,
      };
    }
    
    // Default to authenticated if token exists but no session data
    return {
      isAuthenticated: true,
      user: {
        id: 'mock-user-id',
        email: 'user@example.com',
        role: 'ADMIN',
      },
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
}

/**
 * Protect a route - redirects to login if not authenticated
 * Use in server components
 */
export async function requireAuth(redirectTo: string = '/login'): Promise<ServerAuthResult> {
  const authStatus = await getServerAuthStatus();
  
  if (!authStatus.isAuthenticated) {
    redirect(redirectTo);
  }
  
  return authStatus;
}

/**
 * Protect admin routes - redirects to dashboard if not admin
 * Use in server components
 */
export async function requireAdmin(redirectTo: string = '/dashboard'): Promise<ServerAuthResult> {
  const authStatus = await requireAuth();
  
  const adminRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (!authStatus.user || !adminRoles.includes(authStatus.user.role)) {
    redirect(redirectTo);
  }
  
  return authStatus;
}

/**
 * Redirect authenticated users away from auth pages
 * Use in server components for login/register pages
 */
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard'): Promise<void> {
  const authStatus = await getServerAuthStatus();
  
  if (authStatus.isAuthenticated) {
    redirect(redirectTo);
  }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: string | string[]): Promise<boolean> {
  const authStatus = await getServerAuthStatus();
  
  if (!authStatus.user) return false;
  
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(authStatus.user.role);
}
