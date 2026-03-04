/**
 * Reset Password Page
 */

import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
};

export default function ResetPasswordPage() {
  return (
    <div className="animate-fade-in">
      <ResetPasswordForm />
    </div>
  );
}
