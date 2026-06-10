import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { summarizeLeadChallenge, generateAutomationOpportunities } from "@/services/ai";
import type { Lead } from "@/lib/types";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  try {
    const [summary, opportunities] = await Promise.all([
      summarizeLeadChallenge(lead as Lead),
      generateAutomationOpportunities(lead as Lead),
    ]);

    const updated = await db.lead.update({
      where: { id },
      data: { aiSummary: summary, aiOpportunities: opportunities },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("AI analysis failed:", error);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
