"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { AURIVA_URL } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[oklch(0.09_0.01_240/85%)] backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_oklch(0.72_0.18_195/8%)]"
          : "bg-transparent"
      )}
    >
      {/* Teal top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.72_0.18_195/40%)] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <Image
              src="/Orbit.png"
              alt="Orbit DataWorks"
              width={32}
              height={32}
              priority
              className="w-8 h-8 object-contain group-hover:opacity-90 transition-opacity duration-300"
            />
            <div className="flex flex-col leading-none gap-0.5">
              <span className="text-white font-semibold text-[13px] tracking-tight">Orbit</span>
              <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">DataWorks</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "text-teal"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-teal rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={AURIVA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-teal hover:bg-white/4 transition-all duration-200"
            >
              Free AI Audit
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal text-[oklch(0.08_0.01_240)] text-sm font-semibold hover:bg-[oklch(0.78_0.18_195)] transition-all duration-200 teal-glow-xs shadow-[0_1px_0_oklch(1_0_0/20%)_inset]"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden glass-heavy border-b border-white/5"
          >
            <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-teal/10 text-teal border border-teal/15"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
                <a
                  href={AURIVA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-teal transition-colors flex items-center gap-2"
                >
                  Free AI Audit <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-teal text-[oklch(0.08_0.01_240)] text-sm font-semibold"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
