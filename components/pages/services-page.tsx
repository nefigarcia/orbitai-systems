"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, BarChart3, Network, Code2, GitBranch, Check, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { CtaSection } from "@/components/sections/cta";

const ICON_MAP: Record<string, React.ElementType> = {
  Bot,
  BarChart3,
  Network,
  Code2,
  GitBranch,
};

export function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-teal/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/25 bg-teal/5 text-teal text-xs font-medium mb-6">
              <span>Enterprise Services</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              AI Systems Built for
              <span className="text-teal"> Real Business Operations</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              We don't build demos. We architect, integrate, and deploy AI automation
              systems that connect to your existing stack and deliver measurable ROI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Bot;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Content */}
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-teal" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">{service.title}</h2>
                  <p className="text-teal text-sm font-medium mb-4">{service.tagline}</p>
                  <p className="text-muted-foreground leading-relaxed mb-8">{service.description}</p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-teal" />
                        </div>
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal/10 border border-teal/25 text-teal text-sm font-medium hover:bg-teal/20 transition-all"
                  >
                    Discuss this service
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Visual card */}
                <div className="rounded-2xl border border-white/8 bg-graphite p-8">
                  <div className="text-3xl font-black text-teal/10 mb-4">0{i + 1}</div>
                  <h3 className="text-xl font-bold text-white mb-6">{service.title}</h3>
                  <div className="space-y-3">
                    {service.features.map((f, fi) => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: fi * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/2 hover:border-teal/15 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
