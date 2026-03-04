/**
 * Admin RBAC Page
 */

import { Metadata } from "next";
import { RbacView } from "@/components/views/rbac-view";

export const metadata: Metadata = {
  title: "RBAC Management",
  description: "Manage roles and permissions",
};

export default function AdminRbacPage() {
  return <RbacView />;
}
