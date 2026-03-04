/**
 * Admin Permissions Page
 * Permission matrix management for RBAC
 */

import { Metadata } from "next";
import { PermissionsView } from "@/components/views/permissions-view";

export const metadata: Metadata = {
  title: "Permission Matrix | Admin",
  description: "Manage role-based permissions",
};

export default function PermissionsPage() {
  return <PermissionsView />;
}
