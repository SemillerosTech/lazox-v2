import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/badge";
import { BookCard } from "@/components/book-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";
import { EmptyState } from "@/components/empty-state";
import { catalog } from "@/lib/catalog";
import { shelves } from "@/lib/data/shelves";

export const dynamicParams = false;

export function generateStaticParams() {
  return shelves.map((shelf) => ({ slug: shelf.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shelf = await catalog.getShelf(slug);

  if (!shelf) return { title: "Estante no encontrado" };

  return {
    title: `Para el niño o la niña que ${shelf.name}`,
    description: `Estante ${shelf.code} de LAZOX: libros y materiales para el niño o la niña que ${shelf.name}.`,
  };
}

export default async function ShelfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shelf = await catalog.getShelf(slug);

  if (!shelf) notFound();

  const books = await catalog.listBooksByShelf(shelf.code);
  const recommendation = await catalog.getRecommendation(shelf.code);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Estantes", href: "/estantes" },
          { label: shelf.code },
        ]}
      />

      <header className="mt-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="neutral">{shelf.code}</Badge>
          {recommendation?.status === "provisional" && (
            <Badge tone="provisional">Recomendación provisional</Badge>
          )}
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-brand-ink md:text-5xl">
          Para el niño o la niña que {shelf.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {books.length > 0
            ? "Esta es la selección disponible por ahora para este estante."
            : "Todavía estamos preparando la selección de este estante."}
        </p>
      </header>

      {recommendation && (
        <p
          role="note"
          className="mt-6 max-w-3xl rounded-2xl border border-brand-yellow bg-brand-yellow/20 px-4 py-3 text-sm font-semibold text-brand-ink"
        >
          {recommendation.note}
        </p>
      )}

      <section aria-labelledby="shelf-books-title" className="mt-10">
        <h2 id="shelf-books-title" className="sr-only">
          Libros de este estante
        </h2>
        {books.length > 0 ? (
          <div className="grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Selección en preparación"
            description="Estamos preparando la selección de este estante. Mientras tanto, puede explorar los demás estantes."
          >
            <ButtonLink href="/estantes" variant="outline">
              Ver todos los estantes
            </ButtonLink>
          </EmptyState>
        )}
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <Link href="/estantes" className="text-sm font-bold text-brand-pink hover:underline">
          ← Volver a los estantes
        </Link>
        <Link
          href="/libros/inseparables"
          className="text-sm font-bold text-brand-pink hover:underline"
        >
          Ver Inseparables
        </Link>
      </div>
    </div>
  );
}
