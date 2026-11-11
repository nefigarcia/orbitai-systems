// Browser-side Meta Pixel helpers.
//
// Every function is a safe no-op when the Pixel is not configured, blocked,
// or running on the server — tracking must never break the page or the
// audit/AI-call workflow. Never pass personal information (name, email,
// phone, company) in event parameters.

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    /** Last pathname a PageView was sent for (shared with the inline init script). */
    __orbitLastPageView?: string;
  }
}

export const LEAD_EVENT_PARAMS = {
  content_name: "Orbit AI Business Audit",
  content_category: "Business Automation",
} as const;

/** Shared with the Conversions API so Meta deduplicates browser + server Leads. */
export function metaLeadEventId(leadId: string): string {
  return `lead_${leadId}`;
}

export function metaCallCompletedEventId(sessionId: string): string {
  return `audit_call_completed_${sessionId}`;
}

function getFbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  return typeof window.fbq === "function" ? window.fbq : null;
}

function send(...args: unknown[]): boolean {
  const fbq = getFbq();
  if (!fbq) return false;
  try {
    fbq(...args);
    return true;
  } catch {
    return false;
  }
}

// In-memory fallback for browsers where sessionStorage throws (private mode, blocked storage).
const claimedInMemory = new Set<string>();

/** Returns true only the first time `key` is claimed in this browser session. */
function claimOnce(key: string): boolean {
  if (claimedInMemory.has(key)) return false;
  claimedInMemory.add(key);
  try {
    if (window.sessionStorage.getItem(key)) return false;
    window.sessionStorage.setItem(key, "1");
  } catch {}
  return true;
}

/** One PageView per route change; repeated calls for the same path are ignored. */
export function trackPageView(pathname: string): boolean {
  if (!getFbq() || window.__orbitLastPageView === pathname) return false;
  window.__orbitLastPageView = pathname;
  return send("track", "PageView");
}

/**
 * Primary conversion. Call only after the backend confirms the audit request
 * was created. Deduplicated per lead for the browser session, and tagged with
 * an eventID that matches the server-side Conversions API event.
 */
export function trackLead(leadId: string | null | undefined): boolean {
  if (!leadId || !getFbq()) return false;
  if (!claimOnce(`orbit_meta_lead_${leadId}`)) return false;
  return send(
    "track",
    "Lead",
    { ...LEAD_EVENT_PARAMS },
    { eventID: metaLeadEventId(leadId) }
  );
}

/** Funnel step: first interaction with the audit form, once per browser session. */
export function trackAuditStarted(): boolean {
  if (!getFbq() || !claimOnce("orbit_meta_audit_started")) return false;
  return send("trackCustom", "AuditStarted", {
    content_name: LEAD_EVENT_PARAMS.content_name,
  });
}
