import type { Metadata } from "next";
import { ProductsPage } from "@/components/pages/products-page";

export const metadata: Metadata = {
  title: "Products",
  description:
    "OrbitAI Systems' product ecosystem: Auriva AI business audit, HealthAI healthcare platform, and WoodCraft OS manufacturing software.",
};

export default function Page() {
  return <ProductsPage />;
}
