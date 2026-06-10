import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/services-page";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI automation, data analytics dashboards, SAP/ERP integrations, custom software, and process optimization for enterprise businesses.",
};

export default function Page() {
  return <ServicesPage />;
}
