"use client";

import { motion } from "framer-motion";
import { PROCESS_STEPS } from "@/lib/constants";

export function ProcessSection() {
  return (
    <section className="py-24 bg-graphite relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase mb-3">How We Work</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From Discovery to Optimization
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            A structured engagement model that delivers measurable results — not just software.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden lg:block absolute top-[2.25rem] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="group relative"
              >
                <div className="rounded-2xl border border-white/8 bg-navy p-6 h-full hover:border-white/14 transition-all duration-300">
                  {/* Step number with teal dot */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="relative flex-shrink-0">
                      <div className="w-[2.25rem] h-[2.25rem] rounded-full border border-white/10 bg-white/4 flex items-center justify-center">
                        <span className="text-xs font-bold text-muted-foreground">{step.step}</span>
                      </div>
                      {/* Teal ring on hover */}
                      <div className="absolute inset-0 rounded-full border border-teal/30 opacity-0 group-hover:opacity-100 transition-opacity scale-110" />
                    </div>
                    {/* Connector dot for lg */}
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="hidden lg:block flex-1 h-px bg-transparent" />
                    )}
                  </div>

                  <h3 className="text-white font-semibold text-base mb-2 group-hover:text-teal transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
