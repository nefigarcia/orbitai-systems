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
    <footer className="bg-graphite border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border border-teal/40" />
                <div className="absolute inset-1.5 rounded-full bg-teal/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-semibold text-sm tracking-tight">OrbitAI Systems</span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Intelligent Business Automation</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              We design AI agents, data dashboards, and enterprise integrations that help businesses
              automate work, connect systems, and scale operations.
            </p>
            <div className="mt-6">
              <a
                href={AURIVA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-teal border border-teal/30 rounded-lg px-3 py-2 hover:bg-teal/10 transition-colors"
              >
                <span>Try Auriva — Free AI Audit</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-teal transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-teal transition-colors"
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

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OrbitAI Systems. All rights reserved.
          </p>
          <Link
            href="/contact"
            className="text-xs text-teal hover:text-teal/80 transition-colors"
          >
            Book a Consultation →
          </Link>
        </div>
      </div>
    </footer>
  );
}
