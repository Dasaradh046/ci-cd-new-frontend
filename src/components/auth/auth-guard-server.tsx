/**
 * Server-side Auth Guard Component
 * Wraps protected content and handles server-side authentication
 */

import { getServerAuthStatus } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';

interface AuthGuardServerProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export async function AuthGuardServer({ 
  children, 
  requireAdmin = false,
  redirectTo = '/login'
}: AuthGuardServerProps) {
  const authStatus = await getServerAuthStatus();
  
  // Redirect to login if not authenticated
  if (!authStatus.isAuthenticated) {
    redirect(redirectTo);
  }
  
  // Check admin role if required
  if (requireAdmin && authStatus.user) {
    const adminRoles = ['SUPER_ADMIN', 'ADMIN'];
    if (!adminRoles.includes(authStatus.user.role)) {
      redirect('/dashboard');
    }
  }
  
  return <>{children}</>;
}
