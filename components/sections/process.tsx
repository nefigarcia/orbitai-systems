"use client";

import { motion } from "framer-motion";
import { PROCESS_STEPS } from "@/lib/constants";

export function ProcessSection() {
  return (
    <section className="py-24 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/25 bg-teal/5 text-teal text-xs font-medium mb-6">
            <span>How We Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            From Discovery to Optimization
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A structured engagement model that delivers measurable results — not just software.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < PROCESS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-6 h-px bg-teal/20 z-10" />
              )}

              <div className="rounded-xl border border-white/8 bg-navy p-6 hover:border-teal/20 transition-all duration-300 h-full">
                <div className="text-3xl font-black text-teal/15 mb-4 group-hover:text-teal/25 transition-colors">
                  {step.step}
                </div>
                <h3 className="text-white font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
