import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vapiWebhookSchema } from "@/lib/validations";

export const maxDuration = 90;

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET ?? "";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = vapiWebhookSchema.safeParse(body);
  if (!parsed.success) {
    console.warn(
      "[Vapi webhook] Failed to parse body:",
      JSON.stringify(body).slice(0, 500)
    );
    return NextResponse.json({ received: true });
  }

  const { type, call, artifact } = parsed.data.message;
  console.log("[Vapi webhook] type:", type, "call.id:", call?.id);

  if (!call?.id) {
    console.warn("[Vapi webhook] No call.id in payload for type:", type);
    return NextResponse.json({ received: true });
  }

  const session = await db.auditSession.findUnique({
    where: { vapiCallId: call.id },
    include: { lead: true },
  });

  if (!session) {
    console.warn(`[Vapi webhook] No session for vapiCallId: ${call.id}`);
    return NextResponse.json({ received: true });
  }

  switch (type) {
    case "call.started":
    case "call-started":
      await db.auditSession.update({
        where: { id: session.id },
        data: { status: "IN_PROGRESS", startedAt: new Date() },
      });
      await db.lead.update({
        where: { id: session.leadId },
        data: { status: "CALL_IN_PROGRESS" },
      });
      break;

    case "end-of-call-report":
    case "call.ended":
    case "call-ended": {
      const transcript = artifact?.transcript ?? call.transcript ?? "";
      const duration = call.duration ?? null;
      const recordingUrl = artifact?.recordingUrl ?? call.recordingUrl ?? null;
      console.log(
        "[Vapi webhook] call-ended — transcript length:",
        transcript.length,
        "duration:",
        duration,
        "hasRecording:",
        !!recordingUrl
      );

      await db.auditSession.update({
        where: { id: session.id },
        data: { status: "COMPLETED", completedAt: new Date(), duration },
      });
      await db.lead.update({
        where: { id: session.leadId },
        data: { status: "CALL_COMPLETED" },
      });

      if (transcript) {
        await db.callTranscript.upsert({
          where: { sessionId: session.id },
          create: {
            sessionId: session.id,
            rawTranscript: transcript,
            summary: parsed.data.message.summary ?? call.summary ?? null,
            callDuration: duration,
            recordingUrl,
          },
          update: {
            rawTranscript: transcript,
            summary: parsed.data.message.summary ?? call.summary ?? null,
            callDuration: duration,
            recordingUrl,
          },
        });

        await db.activityLog.create({
          data: {
            leadId: session.leadId,
            action: "CALL_COMPLETED",
            details: JSON.stringify({ duration, hasTranscript: true }),
          },
        });

        const origin = req.nextUrl.origin;
        try {
          const reportRes = await fetch(`${origin}/api/reports/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: session.id,
              internalSecret: INTERNAL_SECRET,
            }),
          });
          const bodyText = await reportRes.text();
          console.log(
            "[Vapi webhook] Report generation triggered:",
            reportRes.status,
            bodyText.slice(0, 300)
          );
        } catch (err) {
          console.error(
            "[Vapi webhook] Failed to trigger report generation:",
            err
          );
        }
      }
      break;
    }

    case "call.failed":
    case "call-failed":
      await db.auditSession.update({
        where: { id: session.id },
        data: {
          status: "FAILED",
          errorMessage: call.endedReason ?? "Call failed",
        },
      });
      await db.activityLog.create({
        data: {
          leadId: session.leadId,
          action: "CALL_FAILED",
          details: call.endedReason ?? "unknown",
        },
      });
      break;
  }

  return NextResponse.json({ received: true });
}
