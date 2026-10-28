import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Trazaurus",
  robots: { index: false, follow: false },
};

export default function TrazaurusPage() {
  return (
    <ComingSoon
      title="Trazaurus"
      description="Una serie para aprender a leer y escribir."
      breadcrumb="Trazaurus"
    />
  );
}
