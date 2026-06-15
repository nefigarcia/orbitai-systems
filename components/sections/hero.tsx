"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { OrbitVisual } from "./orbit-visual";
import { AURIVA_URL } from "@/lib/constants";

const METRICS = [
  { value: "AI Agents", sub: "Deployed" },
  { value: "SAP/ERP", sub: "Integrated" },
  { value: "Enterprise", sub: "Grade" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Layered backgrounds */}
      <div className="absolute inset-0 grid-bg" />

      {/* Radial ambient lights */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[oklch(0.72_0.18_195/6%)] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[oklch(0.60_0.20_220/5%)] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-[oklch(0.72_0.18_195/5%)] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-36 lg:pt-44">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Copy ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/20 bg-teal/5 text-teal text-xs font-medium mb-8 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                <span>Enterprise AI Automation</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold leading-[1.08] tracking-tight mb-6">
                <span className="text-white">Intelligent </span>
                <span className="text-gradient-teal">Business&nbsp;Automation</span>
                <br />
                <span className="text-white">for Modern Companies</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                We design AI agents, data dashboards, and enterprise integrations that help
                businesses automate work, connect systems, and scale operations.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal text-[oklch(0.08_0.01_240)] font-semibold text-sm hover:bg-[oklch(0.78_0.18_195)] transition-all duration-200 teal-glow shadow-[0_1px_0_oklch(1_0_0/25%)_inset]"
                >
                  Book a Consultation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href={AURIVA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/12 bg-white/3 text-white hover:bg-white/6 hover:border-white/20 transition-all duration-200 text-sm font-medium"
                >
                  Get a Free AI Audit
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              </div>

              {/* Metrics strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-12 flex items-center gap-8"
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/8" />
                {METRICS.map((m, i) => (
                  <div key={i} className="text-center">
                    <div className="text-teal font-bold text-sm">{m.value}</div>
                    <div className="text-muted-foreground text-[10px] tracking-wide mt-0.5">{m.sub}</div>
                  </div>
                ))}
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/8" />
              </motion.div>
            </motion.div>
          </div>

          {/* ── Right: Orbit Visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex justify-center relative"
          >
            {/* Ambient glow behind visual */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full bg-teal/6 blur-[60px]" />
            </div>
            <OrbitVisual />
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.08_0.01_240)] to-transparent pointer-events-none" />
    </section>
  );
}
