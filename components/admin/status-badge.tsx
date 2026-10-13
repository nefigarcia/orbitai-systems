import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/types";

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  NEW: { label: "New", className: "bg-teal/10 text-teal border-teal/20" },
  CALL_SCHEDULED: { label: "Call Scheduled", className: "bg-sky-400/10 text-sky-400 border-sky-400/20" },
  CALL_IN_PROGRESS: { label: "Call In Progress", className: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20" },
  CALL_COMPLETED: { label: "Call Completed", className: "bg-indigo-400/10 text-indigo-400 border-indigo-400/20" },
  REPORT_GENERATED: { label: "Report Generated", className: "bg-fuchsia-400/10 text-fuchsia-400 border-fuchsia-400/20" },
  REPORT_SENT: { label: "Report Sent", className: "bg-teal/15 text-teal border-teal/30" },
  CONTACTED: { label: "Contacted", className: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  QUALIFIED: { label: "Qualified", className: "bg-violet-400/10 text-violet-400 border-violet-400/20" },
  PROPOSAL_SENT: { label: "Proposal Sent", className: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  WON: { label: "Won", className: "bg-green-400/10 text-green-400 border-green-400/20" },
  LOST: { label: "Lost", className: "bg-red-400/10 text-red-400 border-red-400/20" },
};

export function LeadStatusBadge({ status }: { status: LeadStatus | string }) {
  const config = STATUS_CONFIG[status as LeadStatus] || STATUS_CONFIG.NEW;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
