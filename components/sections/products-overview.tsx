"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";

export function ProductsSection() {
  return (
    <section className="py-24 bg-navy relative">
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
                Our Product Ecosystem
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Software Products
              </h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-teal transition-colors"
            >
              Explore products
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              <div className="group relative flex flex-col h-full rounded-2xl border border-white/8 bg-graphite overflow-hidden hover:border-white/14 transition-all duration-300">
                {/* Color accent bar */}
                <div className={`h-px bg-gradient-to-r ${product.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Logo mark */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${product.color} opacity-80 flex items-center justify-center mb-5 shadow-[0_4px_16px_oklch(0_0_0/30%)]`}>
                    <span className="text-white font-black text-xl tracking-tight">{product.name[0]}</span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{product.tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {product.features.slice(0, 3).map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-teal/50" />
                        <span className="text-xs text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  {product.url ? (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal/80 transition-colors font-medium"
                    >
                      Visit {product.name} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={`/products#${product.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-teal transition-colors"
                    >
                      Learn more <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
