import type { Metadata } from "next";
import { getDashboardStats } from "@/actions/leads";
import { AdminDashboard } from "@/components/admin/dashboard";

export const metadata: Metadata = { title: "Admin Dashboard | OrbitAI Systems" };

export default async function AdminPage() {
  const stats = await getDashboardStats();
  return <AdminDashboard stats={stats} />;
}
