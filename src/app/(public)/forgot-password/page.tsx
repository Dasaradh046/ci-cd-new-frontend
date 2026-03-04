/**
 * Forgot Password Page
 */

import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your DevSecOps account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="animate-fade-in">
      <ForgotPasswordForm />
    </div>
  );
}
