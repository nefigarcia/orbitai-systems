"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Zap } from "lucide-react";
import { OrbitVisual } from "./orbit-visual";
import { AURIVA_URL } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-teal/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-teal/3 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/25 bg-teal/5 text-teal text-xs font-medium mb-8">
                <Zap className="w-3 h-3" />
                <span>Enterprise AI Automation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Intelligent Business{" "}
                <span className="text-teal">Automation</span>{" "}
                for Modern Companies
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
                We design AI agents, data dashboards, and enterprise integrations that help
                businesses automate work, connect systems, and scale operations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal text-[oklch(0.08_0.01_240)] font-semibold hover:bg-teal/90 transition-all teal-glow text-sm"
                >
                  Book a Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={AURIVA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-white hover:border-teal/40 hover:bg-white/3 transition-all text-sm font-medium"
                >
                  Get a Free AI Audit
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-12 flex items-center gap-6">
                <div className="h-px flex-1 bg-white/5" />
                <div className="flex items-center gap-6">
                  {[
                    { value: "AI Agents", label: "Built & Deployed" },
                    { value: "SAP / ERP", label: "Integrations" },
                    { value: "Enterprise", label: "Grade Systems" },
                  ].map((stat) => (
                    <div key={stat.value} className="text-center">
                      <div className="text-teal text-sm font-semibold">{stat.value}</div>
                      <div className="text-muted-foreground text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="h-px flex-1 bg-white/5" />
              </div>
            </motion.div>
          </div>

          {/* Right: Orbit Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <OrbitVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
