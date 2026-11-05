import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Printer } from "lucide-react";

import { Logo } from "@/components/logo";
import { catalog, catalogSource } from "@/lib/catalog";
import { buttonClasses } from "@/lib/styles";

export const dynamic = "force-dynamic";

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

  const book = guide.bookSlug ? await catalog.getBook(guide.bookSlug) : null;
  const downloadHref = guide.downloadUrl;
  const printableHref = `/guias/${guide.slug}/descargar`;
  const canPrint = catalogSource === "local-draft" || Boolean(guide.contentHtml);

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
        {guide.author && (
          <p className="mt-3 text-lg font-semibold text-brand-ink">{guide.author}</p>
        )}
        {guide.illustrator && (
          <p className="text-sm text-muted-foreground">Ilustraciones de {guide.illustrator}</p>
        )}
        {guide.ageSuggestion && (
          <p className="mt-3 text-sm font-semibold text-muted-foreground">{guide.ageSuggestion}</p>
        )}

        <div
          role="note"
          className="mt-6 rounded-2xl border border-brand-yellow bg-brand-yellow/20 px-4 py-3 text-sm text-brand-ink"
        >
          Esta guía se muestra en el borrador de la tienda. La licencia con Semilleros de Sentido
          A.C. todavía debe confirmarse como firmada antes de publicarla.
        </div>

        {guide.introHtml && (
          <div
            className="rich-text mt-8 text-lg leading-relaxed text-brand-ink"
            // HTML saneado en el adaptador de servidor.
            dangerouslySetInnerHTML={{ __html: guide.introHtml }}
          />
        )}

        <article className="mt-10 space-y-10" data-tour="guide-content">
          {guide.synopsis && (
            <section aria-labelledby="guide-synopsis">
              <h2
                id="guide-synopsis"
                className="font-display text-3xl font-extrabold text-brand-ink"
              >
                Sinopsis
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-brand-ink">{guide.synopsis}</p>
            </section>
          )}

          {guide.conversationQuestion && (
            <section aria-labelledby="guide-question">
              <h2
                id="guide-question"
                className="font-display text-3xl font-extrabold text-brand-ink"
              >
                Pregunta para conversar
              </h2>
              <p className="mt-3 font-display text-2xl font-extrabold leading-tight text-brand-pink md:text-3xl">
                {guide.conversationQuestion}
              </p>
              {guide.conversationRule && (
                <p className="mt-4 rounded-2xl bg-brand-mint px-4 py-3 text-sm font-semibold text-brand-ink">
                  {guide.conversationRule}
                </p>
              )}
            </section>
          )}

          {guide.contentHtml && (
            <section aria-labelledby="guide-content">
              <h2
                id="guide-content"
                className="font-display text-3xl font-extrabold text-brand-ink"
              >
                Para conversar
              </h2>
              <div
                className="rich-text mt-3 text-lg leading-relaxed text-brand-ink"
                dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
              />
            </section>
          )}

          {guide.questionsHtml && (
            <section aria-labelledby="guide-questions">
              <h2
                id="guide-questions"
                className="font-display text-3xl font-extrabold text-brand-ink"
              >
                Preguntas
              </h2>
              <div
                className="rich-text mt-3 text-lg leading-relaxed text-brand-ink"
                dangerouslySetInnerHTML={{ __html: guide.questionsHtml }}
              />
            </section>
          )}

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

        {(downloadHref || canPrint) && (
          <div className="mt-10">
            <Link
              href={downloadHref ?? printableHref}
              {...(downloadHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={buttonClasses("outline", "w-full sm:w-auto")}
            >
              {downloadHref ? (
                <>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Descargar la guía
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Imprimir la guía · sin registro
                </>
              )}
            </Link>
          </div>
        )}

        <footer className="mt-12 border-t border-border pt-6">
          <p className="text-sm font-semibold text-brand-ink">{guide.license.attribution}</p>
          {guide.credits && <p className="mt-2 text-sm text-muted-foreground">{guide.credits}</p>}
        </footer>
      </main>
    </div>
  );
}
