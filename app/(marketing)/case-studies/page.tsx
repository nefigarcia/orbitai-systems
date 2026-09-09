import type { Metadata } from "next";
import { CaseStudiesPage } from "@/components/pages/case-studies-page";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "See how Orbit DataWorks helps businesses automate operations with AI agents, SAP dashboards, and custom software.",
};

export default function Page() {
  return <CaseStudiesPage />;
}
