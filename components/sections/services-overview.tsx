"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, BarChart3, Network, Code2, GitBranch, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  Bot, BarChart3, Network, Code2, GitBranch,
};

const CARD_COLORS = [
  "from-teal-500/20 to-cyan-600/10",
  "from-blue-500/20 to-indigo-600/10",
  "from-violet-500/20 to-purple-600/10",
  "from-emerald-500/20 to-teal-600/10",
  "from-amber-500/20 to-orange-600/10",
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-navy relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="text-xs font-semibold text-teal tracking-[0.2em] uppercase mb-3">
                What We Build
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Enterprise AI Services
              </h2>
            </div>
            <Link
              href="/services"
              className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-teal transition-colors"
            >
              View all services
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Bot;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <Link
                  href={`/services#${service.id}`}
                  className="group relative flex flex-col h-full rounded-2xl border border-white/8 bg-graphite overflow-hidden hover:border-white/14 transition-all duration-300"
                >
                  {/* Top accent on hover */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Card number watermark */}
                  <div className="absolute top-4 right-5 text-5xl font-black text-white/4 leading-none select-none tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Icon */}
                  <div className="p-6 pb-0">
                    <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${CARD_COLORS[i] ?? CARD_COLORS[0]} flex items-center justify-center mb-5 border border-white/8`}>
                      <Icon className="w-5 h-5 text-teal" />
                    </div>

                    <h3 className="text-white font-semibold text-[1.05rem] mb-1 group-hover:text-teal transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-teal text-[11px] font-medium mb-3 tracking-wide">
                      {service.tagline}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature list */}
                  <div className="p-6 pt-4 mt-auto">
                    <div className="space-y-1.5 mb-5">
                      {service.features.slice(0, 4).map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-teal/50 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-teal/60 group-hover:text-teal transition-colors duration-200">
                      <span>Learn more</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Bottom hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${CARD_COLORS[i] ?? CARD_COLORS[0]} opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
