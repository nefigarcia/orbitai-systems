"use client";

const PILLS = [
  "AI Agents",
  "SAP Dashboards",
  "Workflow Automation",
  "CRM Integration",
  "Business Intelligence",
  "Voice AI",
  "Custom SaaS",
  "ERP Integration",
  "Process Optimization",
  "Data Pipelines",
  "Executive Dashboards",
  "API Development",
];

/* Double the array so the marquee loops seamlessly */
const ALL = [...PILLS, ...PILLS];

export function TrustSection() {
  return (
    <section className="py-16 bg-graphite relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-divider absolute bottom-0 left-0 right-0" />

      {/* Fade masks on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-graphite to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-graphite to-transparent z-10 pointer-events-none" />

      {/* Label */}
      <p className="text-center text-xs font-medium text-muted-foreground tracking-[0.2em] uppercase mb-8">
        What We Build
      </p>

      {/* Scrolling pills */}
      <div className="flex gap-3 animate-marquee whitespace-nowrap" style={{ width: "max-content" }}>
        {ALL.map((pill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/8 bg-white/3 text-sm text-muted-foreground flex-shrink-0 hover:border-teal/30 hover:text-teal transition-colors cursor-default"
          >
            <span className="w-1 h-1 rounded-full bg-teal/50" />
            {pill}
          </span>
        ))}
      </div>
    </section>
  );
}
