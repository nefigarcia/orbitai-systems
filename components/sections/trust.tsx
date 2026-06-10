"use client";

import { motion } from "framer-motion";

const SERVICE_PILLS = [
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
];

export function TrustSection() {
  return (
    <section className="py-20 bg-graphite border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From AI agents to SAP analytics, we build systems that solve{" "}
            <span className="text-white font-medium">real operational problems</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {SERVICE_PILLS.map((pill, i) => (
            <motion.span
              key={pill}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 + 0.2 }}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/3 text-sm text-muted-foreground hover:border-teal/30 hover:text-teal transition-all cursor-default"
            >
              {pill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
