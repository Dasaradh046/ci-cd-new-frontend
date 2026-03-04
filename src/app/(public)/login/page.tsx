/**
 * Login Page
 * User authentication with email/password
 */

import { Suspense } from "react";
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your DevSecOps account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <div className="animate-fade-in">
        <LoginForm />
      </div>
    </Suspense>
  );
}
