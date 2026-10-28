import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Nosotros",
  robots: { index: false, follow: false },
};

export default function AboutPage() {
  return <ComingSoon title="Nosotros" />;
}
