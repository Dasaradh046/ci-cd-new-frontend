/**
 * Verify Email Content Component
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { verifyEmail } from '@/lib/api';

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'mock-token';
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
      }
    };
    
    verify();
  }, [token, router]);

  if (status === 'loading') {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying your email...</p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. Redirecting to login...
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/login">Continue to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl">Verification Failed</CardTitle>
          <CardDescription>
            The verification link may have expired or is invalid.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        <p>Please request a new verification email.</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" asChild>
          <Link href="/resend-email">Resend Verification Email</Link>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/login">Back to Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
