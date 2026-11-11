// Server-only Meta Conversions API sender.
//
// Disabled unless META_CAPI_ACCESS_TOKEN is set. Events reuse the browser
// Pixel's eventID (see lib/meta-pixel.ts) so Meta deduplicates them instead
// of counting two conversions. Personal data is SHA-256 hashed before it
// leaves the server. Never throws — call it from `after()` so it cannot
// delay or break the request that triggered it.
import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

type ActionSource = "website" | "phone_call";

export interface MetaRequestContext {
  clientIp?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  eventSourceUrl?: string | null;
}

export interface MetaServerEvent {
  eventName: string;
  eventId: string;
  actionSource: ActionSource;
  user: { email?: string | null; phone?: string | null; externalId?: string | null };
  context?: MetaRequestContext;
  customData?: Record<string, string | number>;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return null;
  // Same assumption as services/vapi.ts: bare 10-digit numbers are US.
  return digits.length === 10 ? `1${digits}` : digits;
}

/** Captures the browser signals Meta uses for matching. Read before the response is sent. */
export function getMetaRequestContext(req: NextRequest): MetaRequestContext {
  return {
    clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: req.headers.get("user-agent"),
    fbp: req.cookies.get("_fbp")?.value ?? null,
    fbc: req.cookies.get("_fbc")?.value ?? null,
    eventSourceUrl: req.headers.get("referer"),
  };
}

export async function sendMetaServerEvent(event: MetaServerEvent): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.replace(/\D/g, "");
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const apiVersion = process.env.META_GRAPH_API_VERSION || "v24.0";
  const { user, context = {} } = event;
  const phone = user.phone ? normalizePhone(user.phone) : null;

  const userData: Record<string, unknown> = {};
  if (user.email) userData.em = [sha256(user.email.trim().toLowerCase())];
  if (phone) userData.ph = [sha256(phone)];
  if (user.externalId) userData.external_id = [sha256(user.externalId)];
  if (context.clientIp) userData.client_ip_address = context.clientIp;
  if (context.userAgent) userData.client_user_agent = context.userAgent;
  if (context.fbp) userData.fbp = context.fbp;
  if (context.fbc) userData.fbc = context.fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: event.actionSource,
        ...(context.eventSourceUrl && { event_source_url: context.eventSourceUrl }),
        user_data: userData,
        ...(event.customData && { custom_data: event.customData }),
      },
    ],
    access_token: accessToken,
  };
  if (process.env.META_CAPI_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${apiVersion}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(
        `[Meta CAPI] ${event.eventName} rejected:`,
        res.status,
        (await res.text()).slice(0, 300)
      );
    }
  } catch (err) {
    console.error(
      `[Meta CAPI] ${event.eventName} failed:`,
      err instanceof Error ? err.message : String(err)
    );
  }
}
