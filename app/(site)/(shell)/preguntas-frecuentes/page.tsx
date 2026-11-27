import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { buttonClasses } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre los libros, las guías, Trazaurus y las propuestas de Lazox para escuelas.",
  robots: { index: false, follow: false },
};

const QUESTIONS = [
  {
    question: "¿Qué es Lazox?",
    answer:
      "Lazox acompaña a las familias a fortalecer sus vínculos a través del juego y la conversación. En esta tienda encontrará libros y preguntas para compartir lecturas en casa.",
    href: "/nosotros",
    linkLabel: "Conocer Lazox",
  },
  {
    question: "¿Cómo elijo un libro?",
    answer:
      "Empiece por los estantes: están organizados por lo que está viviendo un niño o una niña. Elija el que mejor nombre ese momento y explore los libros que contiene.",
    href: "/estantes",
    linkLabel: "Explorar los estantes",
  },
  {
    question: "¿Dónde encuentro los datos de cada libro?",
    answer:
      "En su ficha puede consultar de qué trata y los datos disponibles, como autoría, ilustraciones, editorial, edad sugerida, páginas e ISBN. Allí también aparece la pregunta para conversar cuando el libro la tiene.",
    href: "/estantes",
    linkLabel: "Ver los libros",
  },
  {
    question: "¿Qué es una guía de sentido?",
    answer:
      "Es un recurso con preguntas para conversar en familia después de leer. Puede encontrar las guías publicadas en la sección Guías y en la ficha de cada libro que tenga una vinculada.",
    href: "/guias",
    linkLabel: "Ver las guías disponibles",
  },
  {
    question: "¿Necesito registrarme para consultar una guía?",
    answer:
      "No. Las guías disponibles en Lazox se pueden abrir sin crear una cuenta. Dentro de cada una encontrará las opciones de descarga o impresión que estén habilitadas.",
    href: "/guias",
    linkLabel: "Consultar las guías",
  },
  {
    question: "¿Puedo consultar la guía de un libro agotado?",
    answer:
      "Sí, si su guía está publicada. Que un libro esté agotado no impide consultar su guía: el enlace se mantiene en la ficha cuando está disponible.",
    href: "/guias",
    linkLabel: "Buscar una guía",
  },
  {
    question: "¿Qué son las cinco preguntas para después de leer?",
    answer:
      "Son un recurso general para conversar después de leer cualquier libro, incluido uno que ya tenga en casa. La tarjeta todavía está en preparación; por ahora su página no ofrece una descarga.",
    href: "/cinco-preguntas",
    linkLabel: "Ver la sección Cinco preguntas",
  },
  {
    question: "¿Qué es Trazaurus y dónde consulto su material?",
    answer:
      "Trazaurus es una serie para aprender a leer y escribir. Su sección en Lazox enlaza al portal de Semilleros de Sentido, donde se solicita un registro para acceder al material complementario del libro.",
    href: "/trazaurus",
    linkLabel: "Conocer Trazaurus",
  },
  {
    question: "¿Qué opciones ofrece Lazox para las escuelas?",
    answer:
      "Puede consultar las propuestas de ferias de libros, acervos, renta escolar y equipamiento. En la página Para escuelas encontrará un botón de WhatsApp para conversar sobre lo que necesita su escuela.",
    href: "/para-escuelas",
    linkLabel: "Ver las opciones para escuelas",
  },
  {
    question: "¿Cómo funciona la renta escolar?",
    answer:
      "La propuesta es mensual: la familia elige un libro y lo devuelve el siguiente día de entrega de su escuela, cuando recibe el siguiente que haya escogido. Requiere un acuerdo con la escuela o con un grupo de familias; no está disponible automáticamente en todos los planteles.",
    href: "/renta-escolar",
    linkLabel: "Así funciona la renta escolar",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Preguntas frecuentes" }]} />

      <header className="mt-6">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Preguntas frecuentes</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Sobre los libros, las guías y las opciones para su familia o su escuela.
        </p>
      </header>

      <div className="mt-10 space-y-3">
        {QUESTIONS.map((item) => (
          <details
            key={item.question}
            className="group rounded-3xl border-2 border-border bg-background"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-3xl px-5 py-5 font-bold text-brand-ink hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink sm:px-6 [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <Plus
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-pink group-open:rotate-45 motion-safe:transition-transform"
                aria-hidden="true"
              />
            </summary>
            <div className="px-5 pb-6 sm:px-6">
              <p className="max-w-prose leading-relaxed text-brand-ink">{item.answer}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-brand-pink underline underline-offset-4"
              >
                {item.linkLabel}
              </Link>
            </div>
          </details>
        ))}
      </div>

      <section aria-labelledby="faq-contact" className="mt-10 border-t border-border pt-8">
        <h2 id="faq-contact" className="text-2xl font-extrabold text-brand-ink">
          Conversemos
        </h2>
        <p className="mt-3 text-muted-foreground">
          Si tiene otra duda, puede usar el contacto de WhatsApp.
        </p>
        <div className="mt-5">
          <WhatsAppInquiry
            label="Escríbanos por WhatsApp"
            showSampleReply={false}
            className={buttonClasses("whatsapp")}
          />
        </div>
      </section>
    </div>
  );
}
