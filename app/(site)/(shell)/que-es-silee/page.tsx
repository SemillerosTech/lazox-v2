import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "Qué es SILEE",
  description:
    "Conozca SILEE, un proyecto educativo centrado en la reflexión, el diálogo y la búsqueda de sentido.",
  robots: { index: false, follow: false },
};

// Fuente: https://silee.semillerosdesentido.org/ (27 de noviembre de 2026).
// Por decisión del usuario, se muestra solo SILEE, sin desarrollar las siglas.
const SILEE_WEBSITE = "https://silee.semillerosdesentido.org/";
const PILLARS = [
  {
    title: "Reflexionar",
    description:
      "Detenerse a pensar sobre lo que vivimos, las decisiones que tomamos y lo que nos importa.",
    background: "bg-brand-mint",
  },
  {
    title: "Conocerse",
    description:
      "Abrir espacio al conocimiento de uno mismo y a las preguntas sobre el propósito personal.",
    background: "bg-brand-soft-pink",
  },
  {
    title: "Dialogar",
    description:
      "Compartir preguntas y miradas en espacios de conversación y reflexión con otras personas.",
    background: "bg-brand-lavender/40",
  },
];

export default function SileePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Qué es SILEE" }]} />

      <header className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_260px]">
        <div>
          <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Qué es SILEE</h1>
          <p className="mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-brand-ink">
            SILEE es un proyecto educativo que propone aprender a partir de la reflexión, el
            conocimiento de uno mismo y la búsqueda de sentido.
          </p>
        </div>
        <Image
          src="/images/silee-logo.svg"
          alt="Logotipo de SILEE y Semilleros de Sentido."
          width={150}
          height={67}
          priority
          className="h-auto w-full max-w-64"
        />
      </header>

      <section aria-labelledby="silee-learning" className="mt-10">
        <h2 id="silee-learning" className="text-3xl font-extrabold text-brand-ink">
          Aprender con sentido
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          La propuesta sitúa el propósito personal en el centro del aprendizaje. Invita a pensar
          sobre nuestras decisiones y a dar lugar a las preguntas que aparecen en la vida cotidiana.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <article key={pillar.title} className={`rounded-3xl p-6 ${pillar.background}`}>
              <h3 className="text-2xl font-extrabold text-brand-ink">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="silee-programs"
        className="mt-10 rounded-3xl border-2 border-border bg-background p-6 md:p-8"
      >
        <h2 id="silee-programs" className="text-3xl font-extrabold text-brand-ink">
          Formación y encuentros
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-brand-ink">
          Su sitio presenta cursos introductorios, seminarios y espacios de diálogo. Allí puede
          consultar información sobre sus propuestas y ponerse en contacto con el equipo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={SILEE_WEBSITE} target="_blank" rel="noopener noreferrer">
            Conocer SILEE
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">(abre en otra pestaña)</span>
          </ButtonLink>
          <ButtonLink
            href={`${SILEE_WEBSITE}#contacto`}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
          >
            Contactar al equipo
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">(abre en otra pestaña)</span>
          </ButtonLink>
        </div>
      </section>

      <p className="mt-8 border-t border-border pt-6 text-sm font-semibold text-muted-foreground">
        Lazox apoya el proyecto SILEE® de Semilleros de Sentido A.C.
      </p>
    </div>
  );
}
