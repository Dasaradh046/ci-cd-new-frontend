/**
 * Verify Email Page
 */

import { Metadata } from "next";
import { VerifyEmailContent } from "@/components/auth/verify-email-content";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <div className="animate-fade-in">
      <VerifyEmailContent />
    </div>
  );
}
