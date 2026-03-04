/**
 * Files Page
 */

import { Metadata } from "next";
import { FilesView } from "@/components/views/files-view";

export const metadata: Metadata = {
  title: "Files",
  description: "Manage your files and documents",
};

export default function FilesPage() {
  return <FilesView />;
}
