/**
 * Settings Page
 */

import { Metadata } from "next";
import { SettingsView } from "@/components/views/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
};

export default function SettingsPage() {
  return <SettingsView />;
}
