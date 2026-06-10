"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Check, ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";
import { CtaSection } from "@/components/sections/cta";

export function ProductsPage() {
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
              <span>Product Ecosystem</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              Software Products Built by
              <span className="text-teal"> OrbitAI Systems</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Beyond consulting, we build our own software products — each one solving a specific
              operational problem for a distinct industry vertical.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {PRODUCTS.map((product, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={product.id}
                id={product.id}
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
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} mb-6 opacity-90`}>
                    <span className="text-white font-black text-xl">{product.name[0]}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                  <p className="text-teal text-sm font-medium mb-4">{product.tagline}</p>
                  <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

                  <ul className="space-y-3 mb-8">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-teal" />
                        </div>
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {product.url ? (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal text-[oklch(0.08_0.01_240)] font-semibold text-sm hover:bg-teal/90 transition-all teal-glow-sm"
                    >
                      Visit {product.name}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-white font-medium text-sm hover:border-teal/30 transition-all"
                    >
                      Request Access
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {/* Feature card */}
                <div className="relative rounded-2xl border border-white/8 bg-graphite overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${product.color}`} />
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-white mb-6">{product.name} Features</h3>
                    <div className="space-y-3">
                      {product.features.map((f, fi) => (
                        <motion.div
                          key={f}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: fi * 0.06 }}
                          className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                          <span className="text-sm text-muted-foreground">{f}</span>
                        </motion.div>
                      ))}
                    </div>

                    {product.id === "auriva" && (
                      <div className="mt-6 p-4 rounded-lg border border-teal/20 bg-teal/5">
                        <p className="text-xs text-teal font-medium mb-1">Free to try</p>
                        <p className="text-xs text-muted-foreground">
                          Start your free AI business audit at auriva.im — no credit card required.
                        </p>
                      </div>
                    )}
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
