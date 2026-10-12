import { NextRequest, NextResponse } from "next/server";
import { getVapiCall } from "@/services/vapi";

export async function GET(req: NextRequest) {
  const callId = req.nextUrl.searchParams.get("callId");
  if (!callId) {
    return NextResponse.json({ error: "callId required" }, { status: 400 });
  }

  try {
    const detail = await getVapiCall(callId);
    return NextResponse.json({
      id: detail.id,
      status: detail.status,
      endedReason: detail.endedReason,
      endedAt: detail.endedAt,
    });
  } catch (error) {
    console.error("[call-status] lookup failed:", error);
    return NextResponse.json({ error: "lookup failed" }, { status: 500 });
  }
}
