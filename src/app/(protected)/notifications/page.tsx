/**
 * Notifications Page
 */

import { Metadata } from "next";
import { NotificationsView } from "@/components/views/notifications-view";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage your notifications",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
