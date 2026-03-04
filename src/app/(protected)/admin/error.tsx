/**
 * Admin Routes Error Boundary
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  const isPermissionError = error.message?.includes('403') || 
                            error.message?.includes('Forbidden') ||
                            error.message?.includes('Permission');

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            {isPermissionError ? (
              <Shield className="h-8 w-8 text-warning" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-destructive" />
            )}
          </div>
          <CardTitle>
            {isPermissionError ? 'Access Denied' : 'Admin Error'}
          </CardTitle>
          <CardDescription>
            {isPermissionError
              ? 'You don\'t have permission to access this admin area.'
              : 'An error occurred while loading admin content.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && !isPermissionError && (
            <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground font-mono break-all">
              {error.message}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {!isPermissionError && (
              <Button onClick={reset} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')} 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
