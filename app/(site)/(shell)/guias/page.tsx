import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Guías",
  description: "Guías para conversar en familia después de leer.",
};

export default async function GuidesPage() {
  const guides = await catalog.listGuides();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Guías" }]} />

      <header className="mt-6">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Guías</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Cada libro viene con preguntas para conversarlo en casa.
        </p>
      </header>

      <ul className="mt-8 space-y-4">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guias/${guide.slug}`}
              className="block rounded-3xl border-2 border-border bg-background p-6 transition hover:border-brand-pink hover:shadow-lg"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
                Guía para conversar en familia
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-brand-ink">{guide.title}</h2>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">{guide.author}</p>
              <p className="mt-4 font-display text-xl font-extrabold leading-tight text-brand-ink">
                {guide.conversationQuestion}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
