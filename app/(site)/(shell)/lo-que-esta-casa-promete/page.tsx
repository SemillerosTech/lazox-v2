import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Lo que esta casa promete",
  robots: { index: false, follow: false },
};

export default function PromisesPage() {
  return (
    <ComingSoon
      title="Lo que esta casa promete"
      description="Estamos preparando esta información."
    />
  );
}
