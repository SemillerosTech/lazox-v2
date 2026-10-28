import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

import { Logo } from "@/components/logo";
import { catalog } from "@/lib/catalog";
import { buttonClasses } from "@/lib/styles";

export const dynamicParams = false;

export async function generateStaticParams() {
  const guides = await catalog.listGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await catalog.getGuide(slug);

  if (!guide) {
    return { title: "Guía no encontrada", robots: { index: false, follow: false } };
  }

  return {
    title: `Guía de ${guide.title}`,
    description: "Guía para conversar en familia.",
    robots: { index: false, follow: false },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await catalog.getGuide(slug);

  if (!guide) notFound();

  const book = await catalog.getBook(guide.bookSlug);

  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <header className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-6">
        <Link href="/" aria-label="Lazox — Inicio">
          <Logo className="h-8 w-auto" priority />
        </Link>
        {book && (
          <Link
            href={`/libros/${book.slug}`}
            className="text-sm font-bold text-brand-pink hover:underline"
          >
            Volver al libro
          </Link>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
          Guía para conversar en familia
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-brand-ink md:text-5xl">{guide.title}</h1>
        <p className="mt-3 text-lg font-semibold text-brand-ink">{guide.author}</p>
        <p className="text-sm text-muted-foreground">Ilustraciones de {guide.illustrator}</p>
        <p className="mt-3 text-sm font-semibold text-muted-foreground">{guide.ageSuggestion}</p>

        <div
          role="note"
          className="mt-6 rounded-2xl border border-brand-yellow bg-brand-yellow/20 px-4 py-3 text-sm text-brand-ink"
        >
          Esta guía se muestra en el borrador de la tienda. La licencia con Semilleros de Sentido
          A.C. todavía debe confirmarse como firmada antes de publicarla.
        </div>

        <article className="mt-10 space-y-10" data-tour="guide-content">
          <section aria-labelledby="guide-synopsis">
            <h2 id="guide-synopsis" className="font-display text-3xl font-extrabold text-brand-ink">
              Sinopsis
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-brand-ink">{guide.synopsis}</p>
          </section>

          <section aria-labelledby="guide-question">
            <h2 id="guide-question" className="font-display text-3xl font-extrabold text-brand-ink">
              Pregunta para conversar
            </h2>
            <p className="mt-3 font-display text-2xl font-extrabold leading-tight text-brand-pink md:text-3xl">
              {guide.conversationQuestion}
            </p>
            <p className="mt-4 rounded-2xl bg-brand-mint px-4 py-3 text-sm font-semibold text-brand-ink">
              {guide.conversationRule}
            </p>
          </section>

          {guide.sections.map((section, index) => (
            <section key={section.heading ?? index} aria-label={section.heading}>
              {section.heading && (
                <h2 className="font-display text-3xl font-extrabold text-brand-ink">
                  {section.heading}
                </h2>
              )}
              <div className="mt-3 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed text-brand-ink">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="guide-schools">
            <h2 id="guide-schools" className="sr-only">
              Escuelas
            </h2>
            <p className="text-lg leading-relaxed text-brand-ink">
              Estas preguntas nacieron en salones de escuelas públicas de la Ciudad de México. Si
              alguien quiere abrir la puerta de su escuela, aquí se conversa.
            </p>
          </section>
        </article>

        <div className="mt-10">
          <Link
            href={`/guias/${guide.slug}/descargar`}
            className={buttonClasses("outline", "w-full sm:w-auto")}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Descargar la guía · sin registro
          </Link>
        </div>

        <footer className="mt-12 border-t border-border pt-6">
          <p className="text-sm font-semibold text-brand-ink">{guide.license.attribution}</p>
        </footer>
      </main>
    </div>
  );
}
