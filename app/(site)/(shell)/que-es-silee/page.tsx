import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Qué es SILEE",
  robots: { index: false, follow: false },
};

export default function SileePage() {
  return <ComingSoon title="Qué es SILEE" description="Estamos preparando esta información." />;
}
