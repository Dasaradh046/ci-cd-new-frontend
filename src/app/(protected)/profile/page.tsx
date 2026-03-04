/**
 * Profile Page
 */

import { Metadata } from "next";
import { ProfileView } from "@/components/views/profile-view";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile information",
};

export default function ProfilePage() {
  return <ProfileView />;
}
