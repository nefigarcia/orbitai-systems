import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OrbitAI Systems — Intelligent Business Automation",
    template: "%s | OrbitAI Systems",
  },
  description:
    "OrbitAI Systems designs AI agents, data dashboards, and enterprise integrations that help businesses automate operations, connect systems, and scale.",
  keywords: [
    "AI automation",
    "AI agents",
    "enterprise integrations",
    "SAP analytics",
    "workflow automation",
    "business intelligence",
    "custom SaaS",
  ],
  openGraph: {
    type: "website",
    siteName: "OrbitAI Systems",
    title: "OrbitAI Systems — Intelligent Business Automation",
    description:
      "We design AI agents, data dashboards, and enterprise integrations that help businesses automate work and scale operations.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-navy antialiased">{children}
      <Analytics />
      </body>
    </html>
  );
}
