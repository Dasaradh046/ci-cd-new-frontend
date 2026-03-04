/**
 * Register Page
 * New user registration
 */

import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new DevSecOps account",
};

export default function RegisterPage() {
  return (
    <div className="animate-fade-in">
      <RegisterForm />
    </div>
  );
}
