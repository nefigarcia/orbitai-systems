"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, TrendingUp } from "lucide-react";
import { CASE_STUDIES } from "@/lib/constants";

export function CaseStudiesSection() {
  const featured = CASE_STUDIES.find((c) => c.featured);
  const rest = CASE_STUDIES.filter((c) => !c.featured).slice(0, 3);

  return (
    <section className="py-24 bg-graphite relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-divider absolute bottom-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase mb-3">
                Results We've Delivered
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Client Case Studies
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-teal transition-colors"
            >
              All case studies
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Featured card */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link
                href={`/case-studies/${featured.slug}`}
                className="group relative flex flex-col h-full rounded-2xl border border-white/8 bg-navy overflow-hidden hover:border-teal/25 transition-all duration-300"
              >
                {/* Teal top strip */}
                <div className="h-px bg-gradient-to-r from-transparent via-teal/50 to-transparent" />

                <div className="p-8 flex flex-col flex-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                        <Building2 className="w-4.5 h-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{featured.client}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{featured.industry}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/20 tracking-wide">
                      <TrendingUp className="w-2.5 h-2.5" /> Featured
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal transition-colors duration-200">
                    {featured.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                    {featured.summary}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-7">
                    {featured.metrics.map((m) => (
                      <div key={m.label} className="rounded-xl border border-white/6 bg-white/3 p-4">
                        <div className="text-2xl font-black text-teal leading-none mb-1">{m.value}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-teal/70 group-hover:text-teal group-hover:gap-3 transition-all duration-200">
                    <span>View case study</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Side cards */}
          <div className="flex flex-col gap-5">
            {rest.map((study, i) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-1"
              >
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-white/8 bg-navy p-5 hover:border-white/14 transition-all duration-300 overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="text-[10px] font-medium text-muted-foreground tracking-wide mb-1">{study.industry}</div>
                  <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-teal transition-colors duration-200 leading-snug">
                    {study.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{study.summary}</p>

                  {/* Compact metrics */}
                  <div className="flex gap-2 mt-auto">
                    {study.metrics.slice(0, 2).map((m) => (
                      <div key={m.label} className="flex-1 rounded-lg border border-white/6 bg-white/3 p-2.5 text-center">
                        <div className="text-teal text-sm font-bold">{m.value}</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
