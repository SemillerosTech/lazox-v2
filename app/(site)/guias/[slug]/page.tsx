import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";

import { Badge } from "@/components/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { catalog } from "@/lib/catalog";
import { guides } from "@/lib/data/guides";
import { hasGuideAccess, isGuidePublicDemo } from "@/lib/guide-access";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
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
    description: isGuidePublicDemo()
      ? "Guía para conversar en familia. Acceso temporal de demostración."
      : "Guía para conversar en familia. Contenido privado de demostración.",
    robots: { index: false, follow: false },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await catalog.getGuide(slug);

  if (!guide) notFound();

  const guideIsPublicDemo = isGuidePublicDemo();

  if (!guideIsPublicDemo && !(await hasGuideAccess())) {
    redirect(`/guias/acceso?next=${encodeURIComponent(`/guias/${slug}`)}`);
  }

  const book = await catalog.getBook(guide.bookSlug);
  const shelfSlug = book?.shelfCode.toLowerCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Estantes", href: "/estantes" },
          ...(book && shelfSlug ? [{ label: book.shelfCode, href: `/estantes/${shelfSlug}` }] : []),
          { label: book?.title ?? guide.title },
          { label: "Guía" },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {guideIsPublicDemo ? (
          <Badge tone="demo">Acceso temporal de demostración</Badge>
        ) : (
          <Badge tone="private">
            <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" /> Contenido privado
          </Badge>
        )}
        <Badge tone="provisional">Licencia pendiente de confirmación</Badge>
      </div>

      <header className="mt-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
          Guía para conversar en familia
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-brand-ink md:text-5xl">{guide.title}</h1>
        <p className="mt-3 text-lg font-semibold text-brand-ink">{guide.author}</p>
        <p className="text-sm text-muted-foreground">Ilustraciones de {guide.illustrator}</p>
        <p className="mt-3 text-sm font-semibold text-muted-foreground">{guide.ageSuggestion}</p>
      </header>

      <div
        role="note"
        className="mt-6 rounded-2xl border border-brand-yellow bg-brand-yellow/20 px-4 py-3 text-sm text-brand-ink"
      >
        {guideIsPublicDemo
          ? "Esta guía tiene acceso temporal para la demostración. La licencia con Semilleros de Sentido A.C. todavía debe confirmarse como firmada antes de publicarla."
          : "Esta guía se muestra únicamente en el entorno privado de demostración. La licencia con Semilleros de Sentido A.C. todavía debe confirmarse como firmada antes de publicarla."}
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

        {guide.sections.length === 0 && (
          <section className="rounded-2xl border border-dashed border-border bg-background px-4 py-6">
            <h2 className="font-display text-2xl font-extrabold text-brand-ink">
              Contenido completo en preparación
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta versión reúne el contenido aprobado de la tarjeta del libro. El texto editorial
              extenso se incorporará más adelante desde Shopify, sin reconstruir esta página.
            </p>
          </section>
        )}
      </article>

      <footer className="mt-12 border-t border-border pt-6">
        <p className="text-sm font-semibold text-brand-ink">{guide.license.attribution}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-brand-pink">
          {book && (
            <Link href={`/libros/${book.slug}`} className="hover:underline">
              ← Volver a {book.title}
            </Link>
          )}
          {book && shelfSlug && (
            <Link href={`/estantes/${shelfSlug}`} className="hover:underline">
              Ver estante {book.shelfCode}
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
