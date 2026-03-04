/**
 * Update Password Page
 * Allows authenticated users to change their password
 */

import { UpdatePasswordForm } from '@/components/auth';

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Update Password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your current password and choose a new one
          </p>
        </div>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
