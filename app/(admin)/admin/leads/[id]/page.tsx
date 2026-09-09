import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLeadById } from "@/actions/leads";
import { LeadDetail } from "@/components/admin/lead-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Lead Detail | Admin | Orbit DataWorks" };

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();
  return <LeadDetail lead={lead} />;
}
