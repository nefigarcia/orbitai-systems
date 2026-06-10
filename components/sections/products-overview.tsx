"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PRODUCTS } from "@/lib/constants";

export function ProductsSection() {
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
            <span>Our Product Ecosystem</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Software Products
            </h2>
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm text-teal hover:text-teal/80 transition-colors"
            >
              Explore products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-xl border border-white/8 bg-graphite p-6 hover:border-white/15 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${product.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

              <div className="mb-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${product.color} bg-opacity-20 mb-4`}>
                  <span className="text-white font-bold text-sm">{product.name[0]}</span>
                </div>
                <h3 className="text-white font-bold text-xl">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{product.tagline}</p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              <ul className="space-y-1.5 mb-6">
                {product.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-teal/60" />
                    {f}
                  </li>
                ))}
              </ul>

              {product.url ? (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-teal hover:text-teal/80 transition-colors"
                >
                  <span>Visit {product.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  href={`/products#${product.id}`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-teal transition-colors"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
