import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardContactSchema } from "@/lib/validations";
import { initiateConsultationCall } from "@/services/vapi";
import { sendLeadNotificationEmail, sendLeadConfirmationEmail } from "@/services/email";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = wizardContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const challengeSummary = data.challenges.join(", ");
  const challengeText = data.challengeDetail
    ? `${challengeSummary}. Detail: ${data.challengeDetail}`
    : challengeSummary;

  try {
    const lead = await db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        industry: data.industry,
        companySize: data.companySize,
        serviceInterest: "AI Automation & Agents",
        currentChallenge: challengeText,
        status: "NEW",
        source: "website-wizard",
      },
    });

    await db.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        industry: data.industry,
        companySize: data.companySize,
        serviceInterest: "AI Automation & Agents",
        currentChallenge: challengeText,
        ipAddress:
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      },
    });

    await db.activityLog.create({
      data: {
        leadId: lead.id,
        action: "LEAD_CREATED",
        details: "Wizard submission — Vapi call pending",
      },
    });

    const [vapiResult, notifyResult, confirmResult] = await Promise.allSettled([
      initiateConsultationCall({
        phoneNumber: data.phone,
        leadId: lead.id,
        leadName: data.name,
        company: data.company,
        industry: data.industry,
        mainChallenge: challengeText,
      }),
      sendLeadNotificationEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        industry: data.industry,
        companySize: data.companySize,
        serviceInterest: "AI Automation & Agents",
        currentChallenge: challengeText,
        id: lead.id,
      }),
      sendLeadConfirmationEmail({ name: data.name, email: data.email }),
    ]);

    let callScheduled = false;
    let vapiCallId: string | null = null;
    if (vapiResult.status === "fulfilled") {
      callScheduled = true;
      vapiCallId = vapiResult.value.id;
      await db.auditSession.create({
        data: {
          leadId: lead.id,
          vapiCallId: vapiResult.value.id,
          status: "CALL_INITIATED",
        },
      });
      await db.lead.update({
        where: { id: lead.id },
        data: { status: "CALL_SCHEDULED" },
      });
      await db.activityLog.create({
        data: {
          leadId: lead.id,
          action: "CALL_INITIATED",
          details: `Vapi call id: ${vapiResult.value.id}`,
        },
      });
    } else {
      console.error("[Vapi] Call initiation failed:", vapiResult.reason);
      await db.activityLog.create({
        data: {
          leadId: lead.id,
          action: "CALL_FAILED",
          details: String(vapiResult.reason).slice(0, 500),
        },
      });
    }

    if (notifyResult.status === "rejected") {
      const err = notifyResult.reason;
      console.error("[Resend] Lead notification failed:", {
        message: err instanceof Error ? err.message : String(err),
        raw: JSON.stringify(err),
      });
    } else {
      console.log("[Resend] Lead notification sent");
    }
    if (confirmResult.status === "rejected") {
      const err = confirmResult.reason;
      console.error("[Resend] Lead confirmation failed:", {
        message: err instanceof Error ? err.message : String(err),
        raw: JSON.stringify(err),
      });
    } else {
      console.log("[Resend] Lead confirmation sent");
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      callScheduled,
      vapiCallId,
    });
  } catch (error) {
    console.error("[contact/initiate-call] fatal:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
