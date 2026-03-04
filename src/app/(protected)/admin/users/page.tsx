/**
 * Admin Users Page
 */

import { Metadata } from "next";
import { UsersView } from "@/components/views/users-view";

export const metadata: Metadata = {
  title: "User Management",
  description: "Administer platform users",
};

export default function AdminUsersPage() {
  return <UsersView />;
}
