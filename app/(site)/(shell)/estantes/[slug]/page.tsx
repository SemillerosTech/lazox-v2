import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookCard } from "@/components/book-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";
import { EmptyState } from "@/components/empty-state";
import { PageWhatsApp } from "@/lib/whatsapp-context";
import { catalog } from "@/lib/catalog";
import { getShelfWhatsAppMessage } from "@/lib/whatsapp";

export const dynamicParams = false;

export async function generateStaticParams() {
  const shelves = await catalog.listShelves();
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
    description: `Libros de Lazox para el niño o la niña que ${shelf.name}.`,
  };
}

export default async function ShelfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shelf = await catalog.getShelf(slug);

  if (!shelf) notFound();

  const books = await catalog.listBooksByShelf(shelf.code);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <PageWhatsApp message={getShelfWhatsAppMessage(shelf.name)} />
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Libros", href: "/estantes" },
          { label: shelf.name },
        ]}
      />

      <header className="mt-6 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">
          Para el niño o la niña que {shelf.name}
        </h1>
        {shelf.line && (
          <p className="mt-4 max-w-2xl text-lg font-semibold text-muted-foreground">{shelf.line}</p>
        )}
      </header>

      <section aria-labelledby="shelf-books-title" className="mt-10">
        <h2 id="shelf-books-title" className="sr-only">
          Libros de este estante
        </h2>
        {books.length > 0 ? (
          <div className="grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                dataTour={book.slug === "inseparables" ? "inseparables-card" : undefined}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Este estante todavía no tiene libros"
            description="Mientras llega su selección, puede explorar los demás estantes."
          >
            <ButtonLink href="/estantes" variant="outline">
              Ver los diez estantes
            </ButtonLink>
          </EmptyState>
        )}
      </section>

      {shelf.slug === "est-02" && (
        <p className="mt-10 max-w-2xl text-lg font-semibold text-brand-ink">
          Si lo que no le sale es leer y escribir,{" "}
          <Link href="/trazaurus" className="text-brand-pink underline">
            Trazaurus vive aquí
          </Link>
          .
        </p>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <Link href="/estantes" className="text-sm font-bold text-brand-pink hover:underline">
          ← Volver a los libros
        </Link>
      </div>
    </div>
  );
}
