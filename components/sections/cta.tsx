"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AURIVA_URL } from "@/lib/constants";

export function CtaSection() {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 dot-bg opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-teal/5 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Ready to automate the work{" "}
            <span className="text-teal">slowing your business down?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Book a free strategy session and we'll map out exactly where AI automation
            can save your team time and reduce operational costs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-teal text-[oklch(0.08_0.01_240)] font-semibold hover:bg-teal/90 transition-all teal-glow text-base"
            >
              Book a Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={AURIVA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-white hover:border-teal/40 hover:bg-white/3 transition-all text-base font-medium"
            >
              Start Free AI Audit
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
