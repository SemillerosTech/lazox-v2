import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conozca Lazox: un espacio para fortalecer los vínculos familiares a través del juego, la lectura y la conversación.",
  robots: { index: false, follow: false },
};

// Síntesis del sitio institucional: https://www.lazox.com.mx/ (27 de noviembre de 2026).
const VALUES = [
  {
    title: "Conexión y empatía",
    description: "Escuchar a los demás y dar espacio a sus emociones y puntos de vista.",
    background: "bg-brand-mint",
    accent: "bg-brand-green",
  },
  {
    title: "Pensamiento crítico",
    description: "Hacer preguntas, reflexionar y construir un criterio propio.",
    background: "bg-brand-soft-pink",
    accent: "bg-brand-pink",
  },
  {
    title: "Discernimiento y proactividad",
    description: "Tomar decisiones con reflexión y participar en lo que podemos transformar.",
    background: "bg-brand-yellow/20",
    accent: "bg-brand-yellow",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Nosotros" }]} />

      <header className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_240px] md:gap-12">
        <div>
          <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Nosotros</h1>
          <p className="mt-5 text-xl font-semibold leading-relaxed text-brand-ink">
            Lazox es un espacio para que las familias se encuentren a través del juego y fortalezcan
            sus vínculos.
          </p>
        </div>
        <Image
          src="/images/yelli-intelectual.png"
          alt="Yelli con lentes redondos y un libro, pensando con sorpresa."
          width={1024}
          height={1536}
          sizes="(min-width: 768px) 240px, 176px"
          priority
          className="mx-auto h-auto w-44 md:w-60"
        />
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="about-purpose" className="rounded-3xl bg-brand-yellow p-6 md:p-8">
          <h2 id="about-purpose" className="text-3xl font-extrabold text-brand-ink">
            Nuestra razón de ser
          </h2>
          <p className="mt-4 leading-relaxed text-brand-ink">
            Nuestro propósito es favorecer el entorno social y emocional de las familias. Damos
            lugar a la creatividad, la convivencia y la expresión de emociones, deseos e ideas.
          </p>
        </section>
        <section
          aria-labelledby="about-mission"
          className="rounded-3xl border-2 border-border bg-background p-6 md:p-8"
        >
          <h2 id="about-mission" className="text-3xl font-extrabold text-brand-ink">
            Nuestra misión
          </h2>
          <p className="mt-4 leading-relaxed text-brand-ink">
            Promovemos la autonomía, la reflexión y el pensamiento propio para desenvolverse en la
            familia y en la comunidad.
          </p>
        </section>
      </div>

      <section aria-labelledby="about-values" className="mt-12">
        <h2 id="about-values" className="text-3xl font-extrabold text-brand-ink">
          Nuestros valores
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {VALUES.map((value) => (
            <article key={value.title} className={`rounded-3xl p-6 ${value.background}`}>
              <span aria-hidden="true" className={`block h-2 w-10 rounded-full ${value.accent}`} />
              <h3 className="mt-5 text-2xl font-extrabold text-brand-ink">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-reading" className="mt-12 border-t border-border pt-8">
        <h2 id="about-reading" className="text-3xl font-extrabold text-brand-ink">
          Un libro para conversar en casa
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          En esta tienda, ese propósito toma forma en libros y preguntas para compartir en familia.
          Cada lectura puede abrir un momento para escuchar lo que un niño o una niña tiene que
          decir.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/estantes">Ver los libros</ButtonLink>
          <ButtonLink href="/para-escuelas" variant="outline">
            Para escuelas
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
