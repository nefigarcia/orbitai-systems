import type { Metadata } from "next";
import { LoginPage } from "@/components/admin/login";

export const metadata: Metadata = { title: "Admin Login | OrbitAI Systems" };

export default function Page() {
  return <LoginPage />;
}
