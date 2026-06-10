"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, BarChart3, Network, Code2, GitBranch, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  Bot,
  BarChart3,
  Network,
  Code2,
  GitBranch,
};

export function ServicesSection() {
  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal/25 bg-teal/5 text-teal text-xs font-medium mb-6">
            <span>What We Build</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Enterprise AI Services
            </h2>
            <Link
              href="/services"
              className="flex items-center gap-2 text-sm text-teal hover:text-teal/80 transition-colors"
            >
              View all services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Bot;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-xl border border-white/8 bg-graphite p-6 hover:border-teal/25 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-xl bg-teal/3 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                    <Icon className="w-5 h-5 text-teal" />
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-teal text-xs font-medium mb-3">{service.tagline}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <ul className="space-y-1.5">
                    {service.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-teal/60 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/services#${service.id}`}
                    className="inline-flex items-center gap-1 text-xs text-teal/70 hover:text-teal transition-colors mt-5"
                  >
                    Learn more <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
