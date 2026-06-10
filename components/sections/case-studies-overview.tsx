"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2 } from "lucide-react";
import { CASE_STUDIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CaseStudiesSection() {
  const featured = CASE_STUDIES.find((c) => c.featured);
  const rest = CASE_STUDIES.filter((c) => !c.featured).slice(0, 3);

  return (
    <section className="py-24 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/25 bg-teal/5 text-teal text-xs font-medium mb-6">
            <span>Results We've Delivered</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Client Case Studies
            </h2>
            <Link
              href="/case-studies"
              className="flex items-center gap-2 text-sm text-teal hover:text-teal/80 transition-colors"
            >
              All case studies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link
                href={`/case-studies/${featured.slug}`}
                className="group block rounded-xl border border-white/8 bg-navy p-8 hover:border-teal/30 transition-all duration-300 h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{featured.client}</p>
                      <p className="text-xs text-muted-foreground">{featured.industry}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">
                    Featured
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal transition-colors">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  {featured.summary}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {featured.metrics.map((m) => (
                    <div key={m.label} className="rounded-lg border border-white/8 bg-white/3 p-3">
                      <div className="text-teal text-xl font-bold">{m.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-teal group-hover:gap-3 transition-all">
                  <span>View case study</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          )}

          {/* Rest */}
          <div className="flex flex-col gap-6">
            {rest.map((study, i) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/case-studies/${study.slug}`}
                  className={cn(
                    "group block rounded-xl border border-white/8 bg-navy p-5 hover:border-teal/25 transition-all duration-300"
                  )}
                >
                  <div className="text-xs text-muted-foreground mb-2">{study.industry}</div>
                  <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-teal transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {study.summary}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-teal/70 group-hover:text-teal transition-colors">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
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
