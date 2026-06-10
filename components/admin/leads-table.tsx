"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter } from "lucide-react";
import { LeadStatusBadge } from "./status-badge";
import { formatDistanceToNow } from "@/lib/format";
import type { Lead } from "@/lib/types";

const STATUSES = ["ALL", "NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"];

interface Props {
  leads: Lead[];
  total: number;
}

export function LeadsTable({ leads, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const activeStatus = searchParams.get("status") || "ALL";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams("search", search);
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} total submissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-teal/50 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-teal/10 border border-teal/20 text-teal text-sm hover:bg-teal/20 transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateParams("status", s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeStatus === s
                    ? "bg-teal/15 text-teal border border-teal/25"
                    : "text-muted-foreground border border-transparent hover:border-white/10"
                }`}
              >
                {s === "ALL" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/8 bg-graphite overflow-hidden">
        {leads.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No leads found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Name", "Company", "Service Interest", "Budget", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs text-muted-foreground font-medium tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-5 py-4">
                      <Link href={`/admin/leads/${lead.id}`} className="block">
                        <p className="text-sm text-white font-medium group-hover:text-teal transition-colors">
                          {lead.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-muted-foreground">{lead.company || "—"}</p>
                      <p className="text-xs text-muted-foreground/60">{lead.industry || ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-muted-foreground max-w-[180px] truncate">
                        {lead.serviceInterest || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-muted-foreground">{lead.budgetRange || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(lead.createdAt)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
