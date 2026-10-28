import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { WHATSAPP_SCHOOL_MESSAGE, WHATSAPP_SCHOOL_OPTIONS } from "@/lib/whatsapp";
import { PageWhatsApp } from "@/lib/whatsapp-context";

export const metadata: Metadata = {
  title: "Para escuelas",
  robots: { index: false, follow: false },
};

const SCHOOL_OPTIONS = [
  {
    id: "ferias",
    label: "Ferias",
    description:
      "Una feria de libros en su escuela. Llevamos los libros; cada uno trae sus preguntas.",
    message: WHATSAPP_SCHOOL_OPTIONS[0].message,
  },
  {
    id: "acervos",
    label: "Acervos",
    description: "",
    message: WHATSAPP_SCHOOL_OPTIONS[1].message,
  },
  {
    id: "renta",
    label: "Renta",
    description: "",
    message: WHATSAPP_SCHOOL_OPTIONS[2].message,
  },
  {
    id: "equipamiento",
    label: "Equipamiento",
    description: "",
    message: WHATSAPP_SCHOOL_OPTIONS[3].message,
  },
];

export default function SchoolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <PageWhatsApp message={WHATSAPP_SCHOOL_MESSAGE} />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Para escuelas" }]} />

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Para escuelas</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Elija lo que le interesa y escríbanos por WhatsApp.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {SCHOOL_OPTIONS.map((option) => (
          <section
            key={option.id}
            id={option.id}
            aria-labelledby={`school-${option.id}`}
            className="scroll-mt-24 rounded-3xl border-2 border-border bg-background p-6"
          >
            <h2 id={`school-${option.id}`} className="text-2xl font-extrabold text-brand-ink">
              {option.label}
            </h2>
            {option.description && (
              <p className="mt-3 text-sm font-semibold text-brand-ink">{option.description}</p>
            )}
            <div className="mt-4">
              <WhatsAppInquiry
                message={option.message}
                label="Escríbanos por WhatsApp"
                showSampleReply={false}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
