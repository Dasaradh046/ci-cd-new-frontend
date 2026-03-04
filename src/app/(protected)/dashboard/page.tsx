/**
 * Dashboard Page
 */

import { Metadata } from "next";
import { DashboardView } from "@/components/views/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your DevSecOps platform",
};

export default function DashboardPage() {
  return <DashboardView />;
}
