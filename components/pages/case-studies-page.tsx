"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2 } from "lucide-react";
import { CASE_STUDIES } from "@/lib/constants";
import { CtaSection } from "@/components/sections/cta";

export function CaseStudiesPage() {
  const featured = CASE_STUDIES.find((c) => c.featured);
  const others = CASE_STUDIES.filter((c) => !c.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/25 bg-teal/5 text-teal text-xs font-medium mb-6">
              <span>Client Results</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              Real Systems.
              <span className="text-teal"> Real Results.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Each engagement starts with a business problem. We end with automation,
              integration, or data intelligence that delivers measurable operational value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="py-12 bg-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/case-studies/${featured.slug}`}
                className="group block rounded-2xl border border-teal/20 bg-graphite overflow-hidden hover:border-teal/40 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-3 p-10">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xs px-2 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">
                        Featured
                      </span>
                      <span className="text-xs text-muted-foreground">{featured.industry}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{featured.client}</p>
                        <p className="text-xs text-muted-foreground">{featured.service}</p>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-teal transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-8">{featured.summary}</p>
                    <div className="flex items-center gap-2 text-teal">
                      <span className="text-sm font-medium">View full case study</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-white/5 p-10 flex flex-col justify-center">
                    <h3 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-6">
                      Key Results
                    </h3>
                    <div className="space-y-6">
                      {featured.metrics.map((m) => (
                        <div key={m.label}>
                          <div className="text-3xl font-black text-teal mb-1">{m.value}</div>
                          <div className="text-sm text-muted-foreground">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Other case studies */}
      <section className="py-12 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white mb-8">More Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((study, i) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group block rounded-xl border border-white/8 bg-graphite p-6 hover:border-teal/25 transition-all duration-300 h-full"
                >
                  <div className="text-xs text-muted-foreground mb-1">{study.industry}</div>
                  <p className="text-xs text-teal/70 mb-3">{study.service}</p>
                  <h3 className="text-white font-semibold mb-3 group-hover:text-teal transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                    {study.summary}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {study.metrics.map((m) => (
                      <div key={m.label} className="text-center p-2 rounded-lg bg-white/3 border border-white/5">
                        <div className="text-teal text-sm font-bold">{m.value}</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-teal/70 group-hover:text-teal transition-colors">
                    <span>View project</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
