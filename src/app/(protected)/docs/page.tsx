/**
 * DevSecOps Documentation Page
 */

import { Metadata } from "next";
import { DevSecOpsView } from "@/components/views/devsecops-view";

export const metadata: Metadata = {
  title: "DevSecOps Documentation",
  description: "Tier-3 CI/CD Pipeline documentation",
};

export default function DocsPage() {
  return <DevSecOpsView />;
}
