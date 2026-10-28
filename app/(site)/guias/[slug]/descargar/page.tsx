import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Logo } from "@/components/logo";
import { PrintGuideButton } from "@/components/print-guide-button";
import { catalog } from "@/lib/catalog";

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
    title: `Descargar la guía de ${guide.title}`,
    robots: { index: false, follow: false },
  };
}

export default async function GuideDownloadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await catalog.getGuide(slug);

  if (!guide) notFound();

  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <header className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-6 print:hidden">
        <Link href="/" aria-label="Lazox — Inicio">
          <Logo className="h-8 w-auto" priority />
        </Link>
        <Link
          href={`/guias/${guide.slug}`}
          className="text-sm font-bold text-brand-pink hover:underline"
        >
          Volver a la guía
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-16">
        <div className="print:hidden">
          <PrintGuideButton />
        </div>

        <article className="mt-8 space-y-8">
          <p className="rounded-2xl border border-brand-yellow bg-brand-yellow/20 px-4 py-3 text-sm text-brand-ink print:border-0 print:bg-transparent print:p-0">
            Esta guía se muestra en el borrador de la tienda. La licencia con Semilleros de Sentido
            A.C. todavía debe confirmarse como firmada antes de publicarla.
          </p>

          <header>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
              Guía para conversar en familia
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-brand-ink">{guide.title}</h1>
            <p className="mt-2 text-lg font-semibold text-brand-ink">{guide.author}</p>
            <p className="text-sm text-muted-foreground">Ilustraciones de {guide.illustrator}</p>
          </header>

          <section>
            <h2 className="font-display text-2xl font-extrabold text-brand-ink">Sinopsis</h2>
            <p className="mt-2 text-lg leading-relaxed text-brand-ink">{guide.synopsis}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold text-brand-ink">
              Pregunta para conversar
            </h2>
            <p className="mt-2 font-display text-2xl font-extrabold leading-tight text-brand-pink">
              {guide.conversationQuestion}
            </p>
            <p className="mt-3 rounded-2xl bg-brand-mint px-4 py-3 text-sm font-semibold text-brand-ink print:bg-transparent print:p-0">
              {guide.conversationRule}
            </p>
          </section>

          {guide.sections.map((section, index) => (
            <section key={section.heading ?? index}>
              {section.heading && (
                <h2 className="font-display text-2xl font-extrabold text-brand-ink">
                  {section.heading}
                </h2>
              )}
              <div className="mt-2 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed text-brand-ink">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <p className="text-lg leading-relaxed text-brand-ink">
              Estas preguntas nacieron en salones de escuelas públicas de la Ciudad de México. Si
              alguien quiere abrir la puerta de su escuela, aquí se conversa.
            </p>
          </section>

          <footer className="border-t border-border pt-6">
            <p className="text-sm font-semibold text-brand-ink">{guide.license.attribution}</p>
          </footer>
        </article>
      </main>
    </div>
  );
}
