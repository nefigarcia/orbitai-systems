import type { Metadata } from "next";
import { getLeads } from "@/actions/leads";
import { LeadsTable } from "@/components/admin/leads-table";

export const metadata: Metadata = { title: "Leads | Admin | OrbitAI Systems" };

interface Props {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

export default async function LeadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { leads, total } = await getLeads({
    status: params.status,
    search: params.search,
    limit: 25,
    offset: ((Number(params.page) || 1) - 1) * 25,
  });

  return <LeadsTable leads={leads} total={total} />;
}
