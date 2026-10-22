import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/badge";
import { BookCover } from "@/components/book-cover";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Price } from "@/components/price";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { catalog } from "@/lib/catalog";
import { books } from "@/lib/data/books";
import { neighborBook } from "@/lib/data/recommendations";
import { buttonClasses } from "@/lib/styles";

export const dynamicParams = false;

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await catalog.getBook(slug);

  if (!book) return { title: "Libro no encontrado" };

  return {
    title: `${book.title} — ${book.author}`,
    description: book.synopsis,
    openGraph: {
      title: `${book.title} — ${book.author}`,
      description: book.synopsis,
      type: "book",
    },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await catalog.getBook(slug);

  if (!book) notFound();

  const guide = await catalog.getGuideForBook(book.slug);
  const shelfSlug = book.shelfCode.toLowerCase();
  const shelf = await catalog.getShelf(shelfSlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Estantes", href: "/estantes" },
          { label: book.shelfCode, href: `/estantes/${shelfSlug}` },
          { label: book.title },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
        <div className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
          <BookCover book={book} sizes="(max-width: 1024px) 320px, 380px" />
        </div>

        <div data-tour="product-info">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{book.shelfCode}</Badge>
            {book.status === "provisional" && (
              <Badge tone="provisional">Recomendación provisional</Badge>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-extrabold text-brand-ink md:text-6xl">{book.title}</h1>
          <p className="mt-3 text-lg font-semibold text-brand-ink">{book.author}</p>
          <p className="text-sm text-muted-foreground">Ilustraciones de {book.illustrator}</p>

          <div className="mt-6">
            <Price price={book.price} className="text-3xl" />
            <p className="mt-1 text-xs text-muted-foreground">Precio único.</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <AddToCartButton bookId={book.id} dataTour="product-add-cart" />
            {guide && (
              <Link
                href={`/guias/${guide.slug}`}
                data-tour="product-guide"
                className={buttonClasses("outline", "w-full")}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Descargar la guía · sin registro
              </Link>
            )}
          </div>

          <div className="mt-3" data-tour="product-whatsapp">
            <WhatsAppInquiry />
          </div>

          <dl className="mt-8 grid gap-x-6 gap-y-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-muted-foreground">Editorial</dt>
              <dd>{book.publisher}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted-foreground">Año</dt>
              <dd>{book.year}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted-foreground">ISBN</dt>
              <dd>{book.isbn}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted-foreground">Edad sugerida</dt>
              <dd>{book.ageSuggestion}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted-foreground">Estante</dt>
              <dd>
                <Link
                  href={`/estantes/${shelfSlug}`}
                  className="font-bold text-brand-pink hover:underline"
                >
                  {book.shelfCode}
                  {shelf ? ` · Para el niño o la niña que ${shelf.name}` : ""}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-14 grid gap-8 border-t border-border pt-10 lg:grid-cols-2">
        <section aria-labelledby="synopsis-title">
          <h2 id="synopsis-title" className="font-display text-3xl font-extrabold text-brand-ink">
            Sinopsis
          </h2>
          <p className="mt-3 max-w-prose text-lg leading-relaxed text-brand-ink">{book.synopsis}</p>
        </section>
        <section aria-labelledby="for-whom-title">
          <h2 id="for-whom-title" className="font-display text-3xl font-extrabold text-brand-ink">
            Para el niño o la niña que…
          </h2>
          <p className="mt-3 max-w-prose text-lg leading-relaxed text-brand-ink">{book.forWhom}</p>
        </section>
      </div>

      <section
        aria-labelledby="conversation-title"
        data-tour="product-question"
        className="mt-10 rounded-[2.5rem] bg-brand-yellow p-6 md:p-10"
      >
        <h2
          id="conversation-title"
          className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-ink/70"
        >
          Pregunta para conversar
        </h2>
        <p className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight text-brand-ink md:text-4xl">
          {book.conversationQuestion}
        </p>
        <p className="mt-5 max-w-2xl text-sm font-semibold text-brand-ink/80">
          {book.conversationRule}
        </p>
      </section>

      <section
        aria-labelledby="neighbor-title"
        className="mt-8 rounded-3xl border-2 border-dashed border-border bg-background p-6 md:p-8"
      >
        <Badge tone="neutral">Pendiente de definición editorial</Badge>
        <h2
          id="neighbor-title"
          className="mt-3 font-display text-2xl font-extrabold text-brand-ink"
        >
          {neighborBook.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{neighborBook.note}</p>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <Link
          href={`/estantes/${shelfSlug}`}
          className="text-sm font-bold text-brand-pink hover:underline"
        >
          ← Volver a {book.shelfCode}
        </Link>
        <Link href="/estantes" className="text-sm font-bold text-brand-pink hover:underline">
          Ver todos los estantes
        </Link>
      </div>
    </div>
  );
}
