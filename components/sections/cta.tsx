"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AURIVA_URL } from "@/lib/constants";

export function CtaSection() {
  return (
    <section className="py-20 bg-navy relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-teal/5 blur-[80px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bordered frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-3xl border border-white/8 bg-graphite overflow-hidden p-10 sm:p-16 text-center"
        >
          {/* Corner teal glow accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-teal/50 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-teal/25 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-teal/30 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-32 bg-gradient-to-b from-teal/30 to-transparent" />

          {/* Dot pattern */}
          <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" />

          <div className="relative">
            <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase mb-6">
              Start Today
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 max-w-3xl mx-auto">
              Ready to automate the work{" "}
              <span className="text-gradient-teal">slowing your business down?</span>
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Book a free strategy session and we'll map out exactly where AI automation
              can save your team time and reduce operational costs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-teal text-[oklch(0.08_0.01_240)] font-semibold text-[0.9rem] hover:bg-[oklch(0.78_0.18_195)] transition-all duration-200 teal-glow shadow-[0_1px_0_oklch(1_0_0/25%)_inset]"
              >
                Book a Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={AURIVA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/12 bg-white/3 text-white hover:bg-white/6 hover:border-white/20 transition-all duration-200 text-[0.9rem] font-medium"
              >
                Start Free AI Audit
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
