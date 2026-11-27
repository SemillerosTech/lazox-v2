import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { WHATSAPP_SCHOOLS_GENERAL_MESSAGE } from "@/lib/whatsapp";
import { PageWhatsApp } from "@/lib/whatsapp-context";
import { buttonClasses } from "@/lib/styles";

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
  },
  {
    id: "acervos",
    label: "Acervos",
    description:
      "Libros para la biblioteca de su escuela. Conversemos sobre lo que necesitan sus lectores.",
  },
  {
    id: "renta",
    label: "Renta",
    description: "",
  },
  {
    id: "equipamiento",
    label: "Equipamiento",
    description:
      "Un espacio para que los libros estén al alcance de sus lectores. Cuéntenos qué necesita su escuela.",
  },
];

export default function SchoolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <PageWhatsApp message={WHATSAPP_SCHOOLS_GENERAL_MESSAGE} />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Para escuelas" }]} />

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Para escuelas</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Conozca las opciones para su escuela y escríbanos por WhatsApp.
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
            {option.id === "renta" && (
              <div className="mt-4">
                <ButtonLink href="/renta-escolar" variant="outline">
                  Así funciona la renta escolar
                </ButtonLink>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 flex justify-start">
        <WhatsAppInquiry
          message={WHATSAPP_SCHOOLS_GENERAL_MESSAGE}
          label="Escríbanos por WhatsApp"
          showSampleReply={false}
          containerClassName="max-w-full"
          className={buttonClasses("whatsapp")}
        />
      </div>
    </div>
  );
}
