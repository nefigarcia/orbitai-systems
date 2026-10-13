import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reportGenerateSchema } from "@/lib/validations";
import { analyzeTranscript, generateReportHTML } from "@/services/audit";
import { sendAuditReport, sendConsultationInvite } from "@/services/email";
import type { Prisma } from "@prisma/client";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reportGenerateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { sessionId, internalSecret } = parsed.data;
  if (internalSecret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await db.auditSession.findUnique({
    where: { id: sessionId },
    include: { lead: true, transcript: true, report: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.report) {
    return NextResponse.json({ reportId: session.report.id, cached: true });
  }

  if (!session.transcript?.rawTranscript) {
    return NextResponse.json(
      { error: "No transcript available" },
      { status: 422 }
    );
  }

  const lead = session.lead;

  const analysis = await analyzeTranscript({
    transcript: session.transcript.rawTranscript,
    businessName: lead.company ?? lead.name,
    industry: lead.industry ?? "Unknown",
    companySize: lead.companySize ?? "Unknown",
    mainChallenge: lead.currentChallenge ?? "Not specified",
  });

  const htmlContent = generateReportHTML(
    analysis,
    lead.company ?? lead.name,
    lead.name
  );

  const report = await db.aIReport.create({
    data: {
      sessionId: session.id,
      executiveSummary: analysis.executiveSummary,
      bottlenecks: analysis.bottlenecks as unknown as Prisma.InputJsonValue,
      opportunities: analysis.opportunities as unknown as Prisma.InputJsonValue,
      estimatedROI: analysis.estimatedROI as unknown as Prisma.InputJsonValue,
      implementationRoadmap: analysis.implementationRoadmap as unknown as Prisma.InputJsonValue,
      recommendedSystems: analysis.recommendedSystems as unknown as Prisma.InputJsonValue,
      htmlContent,
      qualificationScore: analysis.qualificationScore,
    },
  });

  await Promise.all([
    db.lead.update({
      where: { id: lead.id },
      data: {
        status: "REPORT_GENERATED",
        qualificationScore: analysis.qualificationScore,
      },
    }),
    db.callTranscript.update({
      where: { sessionId: session.id },
      data: { extractedData: analysis as unknown as Prisma.InputJsonValue },
    }),
    db.activityLog.create({
      data: {
        leadId: lead.id,
        action: "REPORT_GENERATED",
        details: JSON.stringify({
          reportId: report.id,
          score: analysis.qualificationScore,
        }),
      },
    }),
  ]);

  const [reportEmail] = await Promise.allSettled([
    sendAuditReport({
      toEmail: lead.email,
      toName: lead.name,
      businessName: lead.company ?? lead.name,
      analysis,
      reportHtml: htmlContent,
      reportId: report.id,
    }),
  ]);

  if (reportEmail.status === "fulfilled") {
    await db.aIReport.update({
      where: { id: report.id },
      data: { sentAt: new Date() },
    });
    await db.lead.update({
      where: { id: lead.id },
      data: { status: "REPORT_SENT" },
    });
    await db.activityLog.create({
      data: {
        leadId: lead.id,
        action: "REPORT_SENT",
        details: `Report ${report.id} emailed to ${lead.email}`,
      },
    });
  } else {
    console.error("[reports/generate] Audit report email failed:", reportEmail.reason);
  }

  if (analysis.qualificationScore >= 50) {
    sendConsultationInvite({
      toEmail: lead.email,
      toName: lead.name,
      businessName: lead.company ?? lead.name,
    }).catch((err) =>
      console.error("[reports/generate] Consultation invite failed:", err)
    );
  }

  return NextResponse.json({
    reportId: report.id,
    score: analysis.qualificationScore,
  });
}
