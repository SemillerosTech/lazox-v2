import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Cinco preguntas para después de leer",
  robots: { index: false, follow: false },
};

export default function FiveQuestionsPage() {
  return (
    <ComingSoon
      title="Cinco preguntas para después de leer"
      description="La tarjeta todavía no está disponible. Estamos preparando su contenido."
      breadcrumb="Cinco preguntas"
    />
  );
}
