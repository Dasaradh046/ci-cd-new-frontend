/**
 * Resend Email Page
 */

import { Metadata } from "next";
import { ResendEmailForm } from "@/components/auth/resend-email-form";

export const metadata: Metadata = {
  title: "Resend Verification Email",
  description: "Request a new verification email",
};

export default function ResendEmailPage() {
  return (
    <div className="animate-fade-in">
      <ResendEmailForm />
    </div>
  );
}
