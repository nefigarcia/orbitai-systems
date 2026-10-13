import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "AI Audit Report",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const report = await db.aIReport.findUnique({
    where: { id },
    include: { session: { include: { lead: true } } },
  });

  if (!report) notFound();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0a0a0f" }}
      dangerouslySetInnerHTML={{ __html: report.htmlContent }}
    />
  );
}
