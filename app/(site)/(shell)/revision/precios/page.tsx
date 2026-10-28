import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { DualPricePreview } from "@/components/dual-price-preview";
import { getPriceLibrePreviewBook } from "@/lib/data/pricing-preview";

export const metadata: Metadata = {
  title: "Revisión de precios",
  robots: { index: false, follow: false },
};

export default function PricingReviewPage() {
  const book = getPriceLibrePreviewBook();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Revisión de precios" }]} />

      <header className="mt-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
          Vista interna
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-brand-ink md:text-5xl">
          Dos precios para revisar
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Este libro de prueba usa el contenido de Inseparables y está marcado como de precio libre.
          La vista no aparece en el menú ni en el catálogo. Los dos precios siguen apagados para el
          público hasta que abogado y contador cierren la cuenta del 30 %.
        </p>
      </header>

      {book ? (
        <section
          aria-labelledby="preview-title"
          className="mt-8 rounded-3xl border border-border bg-background p-6"
        >
          <h2 id="preview-title" className="font-display text-2xl font-extrabold text-brand-ink">
            {book.title}
          </h2>
          <div className="mt-4">
            <DualPricePreview book={book} />
          </div>
        </section>
      ) : (
        <p className="mt-8 text-lg font-semibold text-brand-ink">
          No se encontró el libro de prueba.
        </p>
      )}

      <Link
        href="/libros/inseparables"
        className="mt-8 inline-block text-sm font-bold text-brand-pink hover:underline"
      >
        ← Volver a Inseparables
      </Link>
    </div>
  );
}
