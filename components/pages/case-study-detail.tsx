"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import type { CaseStudyCard } from "@/lib/types";
import { CtaSection } from "@/components/sections/cta";

const DETAIL_CONTENT: Record<string, {
  challenge: string;
  solution: string;
  results: string;
  tags: string[];
}> = {
  "kingspan-roofing": {
    challenge:
      "Kingspan Roofing's operations team was manually extracting data from SAP to build reports in spreadsheets. This process took days per reporting cycle, introduced errors, and left leadership without real-time visibility into production and sales performance.",
    solution:
      "Orbit DataWorks designed a data integration architecture concept connecting SAP data sources to a centralized analytics layer, with executive dashboards delivering live KPI tracking, production throughput visibility, and automated reporting distribution.",
    results:
      "The proposed dashboard architecture reduced reporting cycle time from days to real-time. Leadership gained access to three unified dashboards covering operations, sales pipeline, and production throughput — with data automatically refreshed from the source SAP system.",
    tags: ["SAP Integration", "Data Analytics", "Executive Dashboards", "Business Intelligence"],
  },
  "healthcare-ai-assistant": {
    challenge:
      "A healthcare provider was spending significant administrative time on patient intake, appointment follow-ups, and manual communication workflows — pulling clinical staff away from patient care.",
    solution:
      "We built an AI-powered patient communication system that automated intake forms, appointment reminders, post-visit follow-ups, and escalation routing. Voice AI was integrated for appointment scheduling and basic triage queries.",
    results:
      "Administrative overhead was reduced by 60%. Patient satisfaction scores improved 34% due to faster response times and proactive communication. Staff recaptured hours weekly for direct patient care.",
    tags: ["AI Automation", "Voice AI", "Healthcare", "Workflow Automation"],
  },
  "woodcraft-manufacturing": {
    challenge:
      "A cabinet manufacturing company was running its entire operations on spreadsheets — quoting, material ordering, production tracking, and client communication. Errors were frequent, and jobs were being lost due to slow quote turnaround.",
    solution:
      "WoodCraft OS — a complete operations platform — was built to replace the manual workflow. It includes a quoting engine with material cost calculation, a production board for job tracking, material procurement automation, and a client portal for order visibility.",
    results:
      "Quote generation time dropped 70%. Material order errors were reduced 45%. For the first time, management had 100% visibility into production status across all active jobs simultaneously.",
    tags: ["Custom Software", "Manufacturing", "SaaS Platform", "Workflow Automation"],
  },
  "ai-business-audit": {
    challenge:
      "Businesses consulting with Orbit DataWorks often needed weeks of discovery to identify automation opportunities. This manual audit process was a bottleneck that slowed the path from first contact to actionable insights.",
    solution:
      "Auriva — the AI Business Audit tool — was built to automate the discovery phase. It analyzes a company's described workflows, identifies automation opportunities, scores them by ROI potential, and generates a prioritized action plan.",
    results:
      "Audit time was reduced by 95%. Average clients now receive 12+ automation opportunities per audit session. Client satisfaction with the audit experience sits at 4.9/5.",
    tags: ["AI Automation", "Process Optimization", "SaaS Product", "Business Intelligence"],
  },
};

interface Props {
  study: CaseStudyCard;
}

export function CaseStudyDetailPage({ study }: Props) {
  const detail = DETAIL_CONTENT[study.slug] || {
    challenge: study.summary,
    solution: "Solution details coming soon.",
    results: "Results details coming soon.",
    tags: [study.service],
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-16 bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to case studies
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {detail.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-teal/20 bg-teal/5 text-teal">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-6">
              {study.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-white font-semibold">{study.client}</p>
                <p className="text-sm text-muted-foreground">{study.industry}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {study.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/8 bg-graphite p-5">
                  <div className="text-3xl font-black text-teal mb-1">{m.value}</div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {[
                { label: "The Challenge", content: detail.challenge },
                { label: "Our Solution", content: detail.solution },
                { label: "Results & Impact", content: detail.results },
              ].map((section, i) => (
                <motion.div
                  key={section.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-teal text-sm font-mono">0{i + 1}</span>
                    {section.label}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-xl border border-white/8 bg-graphite p-6">
                <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">Project Details</h3>
                <dl className="space-y-3">
                  {[
                    { label: "Client", value: study.client },
                    { label: "Industry", value: study.industry },
                    { label: "Service", value: study.service },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs text-muted-foreground">{item.label}</dt>
                      <dd className="text-sm text-white mt-0.5">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-xl border border-teal/20 bg-teal/5 p-6">
                <h3 className="text-sm font-semibold text-white mb-3">Start a similar project</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Tell us about your challenge and we'll outline how we can help.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal/80 transition-colors"
                >
                  Book consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
