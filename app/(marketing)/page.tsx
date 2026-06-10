import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero";
import { TrustSection } from "@/components/sections/trust";
import { ServicesSection } from "@/components/sections/services-overview";
import { CaseStudiesSection } from "@/components/sections/case-studies-overview";
import { ProductsSection } from "@/components/sections/products-overview";
import { ProcessSection } from "@/components/sections/process";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "OrbitAI Systems — Intelligent Business Automation",
  description:
    "We design AI agents, data dashboards, and enterprise integrations that help businesses automate operations, connect systems, and scale.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <CaseStudiesSection />
      <ProductsSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
