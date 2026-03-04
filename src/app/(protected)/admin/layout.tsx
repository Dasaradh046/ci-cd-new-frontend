/**
 * Admin Route Group Layout
 * Wraps admin pages with role-based access control
 */

import { AdminGuard } from '@/components/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
