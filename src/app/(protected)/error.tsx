/**
 * Protected Routes Error Boundary
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/lib/stores';

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Protected route error:', error);
  }, [error]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isAuthError = error.message?.includes('401') || 
                      error.message?.includes('Unauthorized') ||
                      error.message?.includes('session');

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>
            {isAuthError ? 'Session Expired' : 'Something went wrong'}
          </CardTitle>
          <CardDescription>
            {isAuthError
              ? 'Your session has expired. Please sign in again.'
              : 'An unexpected error occurred. Please try again.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && !isAuthError && (
            <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground font-mono break-all">
              {error.message}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {isAuthError ? (
              <Button onClick={handleLogout} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sign in again
              </Button>
            ) : (
              <Button onClick={reset} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
