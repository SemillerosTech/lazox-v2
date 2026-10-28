import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  robots: { index: false, follow: false },
};

export default function FaqPage() {
  return (
    <ComingSoon title="Preguntas frecuentes" description="Estamos preparando esta información." />
  );
}
