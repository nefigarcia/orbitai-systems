"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Brain, Save, ExternalLink } from "lucide-react";
import { LeadStatusBadge } from "./status-badge";
import { updateLeadStatus, updateLeadNotes } from "@/actions/leads";
import { formatDate } from "@/lib/format";
import type { Lead } from "@/lib/types";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"];

interface LeadWithLogs extends Lead {
  activityLogs: { id: string; action: string; details: string | null; createdAt: Date }[];
}

export function LeadDetail({ lead }: { lead: LeadWithLogs }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(lead.aiSummary || "");
  const [aiOpps, setAiOpps] = useState(lead.aiOpportunities || "");

  async function handleStatusChange(newStatus: string) {
    setStatus(newStatus as Lead["status"]);
    await updateLeadStatus(lead.id, newStatus);
    router.refresh();
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    await updateLeadNotes(lead.id, notes);
    setSavingNotes(false);
  }

  async function handleAIAnalyze() {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/ai-analyze`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAiSummary(data.lead.aiSummary || "");
        setAiOpps(data.lead.aiOpportunities || "");
      }
    } catch {
      // silent fail
    }
    setAiLoading(false);
  }

  const fields = [
    { label: "Email", value: lead.email, href: `mailto:${lead.email}` },
    { label: "Phone", value: lead.phone },
    { label: "Company", value: lead.company },
    { label: "Website", value: lead.website, href: lead.website || undefined },
    { label: "Industry", value: lead.industry },
    { label: "Company Size", value: lead.companySize },
    { label: "Service Interest", value: lead.serviceInterest },
    { label: "Budget", value: lead.budgetRange },
    { label: "Contact Method", value: lead.preferredContactMethod },
    { label: "Source", value: lead.source },
    { label: "Submitted", value: formatDate(lead.createdAt) },
  ];

  return (
    <div className="p-8">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to leads
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
            <LeadStatusBadge status={status} />
          </div>
          <p className="text-muted-foreground text-sm">{lead.company || lead.email}</p>
        </div>

        {/* Status Selector */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-white/10 bg-graphite text-white text-sm focus:outline-none focus:border-teal/50 transition-all"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details + Challenge */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="rounded-xl border border-white/8 bg-graphite p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Lead Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(
                (f) =>
                  f.value && (
                    <div key={f.label}>
                      <dt className="text-xs text-muted-foreground mb-0.5">{f.label}</dt>
                      <dd className="text-sm text-white">
                        {f.href ? (
                          <a
                            href={f.href}
                            target={f.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-teal flex items-center gap-1 hover:underline"
                          >
                            {f.value}
                            {f.href.startsWith("http") && <ExternalLink className="w-3 h-3" />}
                          </a>
                        ) : (
                          f.value
                        )}
                      </dd>
                    </div>
                  )
              )}
            </dl>
          </div>

          {/* Challenge */}
          {lead.currentChallenge && (
            <div className="rounded-xl border border-white/8 bg-graphite p-6">
              <h2 className="text-sm font-semibold text-white mb-3">Current Challenge</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{lead.currentChallenge}</p>
            </div>
          )}

          {/* Notes */}
          <div className="rounded-xl border border-white/8 bg-graphite p-6">
            <h2 className="text-sm font-semibold text-white mb-3">Internal Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add notes about this lead..."
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-teal/50 transition-all resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal/10 border border-teal/20 text-teal text-sm hover:bg-teal/20 transition-all disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI + Logs */}
        <div className="space-y-6">
          {/* AI Analysis */}
          <div className="rounded-xl border border-teal/15 bg-teal/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-teal" />
                AI Analysis
              </h2>
              <button
                onClick={handleAIAnalyze}
                disabled={aiLoading}
                className="text-xs text-teal border border-teal/25 px-3 py-1.5 rounded-lg hover:bg-teal/10 transition-all disabled:opacity-60"
              >
                {aiLoading ? "Analyzing..." : "Analyze"}
              </button>
            </div>

            {aiSummary ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-teal mb-2">Summary</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{aiSummary}</p>
                </div>
                {aiOpps && (
                  <div>
                    <p className="text-xs font-medium text-teal mb-2">Opportunities</p>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{aiOpps}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Click Analyze to generate an AI summary and automation opportunity list for this lead.
              </p>
            )}
          </div>

          {/* Activity Log */}
          {lead.activityLogs.length > 0 && (
            <div className="rounded-xl border border-white/8 bg-graphite p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Activity Log</h2>
              <div className="space-y-3">
                {lead.activityLogs.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal/40 flex-shrink-0 mt-1.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{log.details || log.action}</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
