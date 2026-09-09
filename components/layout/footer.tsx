import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AURIVA_URL } from "@/lib/constants";

const FOOTER_LINKS = {
  Services: [
    { label: "AI Automation", href: "/services#ai-automation" },
    { label: "Data & Analytics", href: "/services#data-analytics" },
    { label: "Enterprise Integrations", href: "/services#enterprise-integrations" },
    { label: "Custom Software", href: "/services#custom-software" },
    { label: "Process Optimization", href: "/services#process-optimization" },
  ],
  Products: [
    { label: "Auriva", href: AURIVA_URL, external: true },
    { label: "HealthAI", href: "/products#healthai" },
    { label: "WoodCraft OS", href: "/products#woodcraft-os" },
  ],
  Company: [
    { label: "Case Studies", href: "/case-studies" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-graphite">
      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/Orbit.png"
                alt="Orbit DataWorks"
                width={32}
                height={32}
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-white font-semibold text-[13px] tracking-tight">Orbit DataWorks</span>
                <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">Intelligent Business Automation</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px] mb-6">
              We design AI agents, data dashboards, and enterprise integrations that help businesses
              automate work, connect systems, and scale operations.
            </p>

            <a
              href={AURIVA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-teal/25 text-teal text-xs font-medium hover:bg-teal/8 transition-all duration-200"
            >
              Try Auriva — Free AI Audit
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase mb-4">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-teal transition-colors duration-200 flex items-center gap-1.5"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Orbit DataWorks. All rights reserved.
          </p>
          <Link
            href="/contact"
            className="text-xs text-teal/70 hover:text-teal transition-colors duration-200"
          >
            Book a Consultation →
          </Link>
        </div>
      </div>
    </footer>
  );
}
