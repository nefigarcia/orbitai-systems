import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a free strategy session with Orbit DataWorks. Tell us about your business challenge and we'll outline how AI automation can help.",
};

export default function Page() {
  return <ContactPage />;
}
