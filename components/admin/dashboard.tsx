"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, UserCheck, TrendingUp, Trophy, ArrowRight } from "lucide-react";
import type { Lead } from "@/lib/types";
import { LeadStatusBadge } from "./status-badge";
import { formatDistanceToNow } from "@/lib/format";

interface Stats {
  total: number;
  newLeads: number;
  qualified: number;
  won: number;
  recent: Lead[];
}

interface Props {
  stats: Stats;
}

export function AdminDashboard({ stats }: Props) {
  const cards = [
    { label: "Total Leads", value: stats.total, icon: Users, color: "text-white" },
    { label: "New", value: stats.newLeads, icon: TrendingUp, color: "text-teal" },
    { label: "Qualified", value: stats.qualified, icon: UserCheck, color: "text-blue-400" },
    { label: "Won", value: stats.won, icon: Trophy, color: "text-green-400" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of leads and activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/8 bg-graphite p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="rounded-xl border border-white/8 bg-graphite">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Recent Submissions</h2>
          <Link
            href="/admin/leads"
            className="text-xs text-teal hover:text-teal/80 transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No leads yet. Contact form submissions will appear here.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {stats.recent.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center">
                    <span className="text-teal text-xs font-semibold">
                      {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium group-hover:text-teal transition-colors">
                      {lead.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.company || lead.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <LeadStatusBadge status={lead.status} />
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {formatDistanceToNow(lead.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
