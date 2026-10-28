import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

import { BookCover } from "@/components/book-cover";
import { BookPurchase } from "@/components/book-purchase";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { catalog } from "@/lib/catalog";
import { isBookOutOfStock } from "@/lib/pricing";
import { getBookWhatsAppMessage } from "@/lib/whatsapp";
import { PageWhatsApp } from "@/lib/whatsapp-context";

export const dynamicParams = false;

export async function generateStaticParams() {
  const books = await catalog.listBooks();
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
    title: `${book.title} · Lazox`,
    description: book.conversationQuestion,
    openGraph: {
      title: `${book.title} · Lazox`,
      description: book.conversationQuestion,
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
  const outOfStock = isBookOutOfStock(book);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <PageWhatsApp message={getBookWhatsAppMessage(book.title)} />
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Libros", href: "/estantes" },
          ...(shelf ? [{ label: shelf.name, href: `/estantes/${shelfSlug}` }] : []),
          { label: book.title },
        ]}
      />

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,260px)_1fr] md:items-start md:gap-10">
        <div className="mx-auto w-full max-w-[220px] md:mx-0 md:max-w-none">
          <BookCover book={book} sizes="(max-width: 768px) 220px, 260px" />
        </div>

        <div data-tour="product-info">
          <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">{book.title}</h1>
          <p className="mt-3 text-lg font-semibold text-brand-ink">{book.author}</p>
          <p className="text-sm text-muted-foreground">
            Ilustraciones de {book.illustrator} · {book.publisher}
          </p>
        </div>
      </div>

      <section aria-labelledby="synopsis-title" className="mt-10">
        <h2 id="synopsis-title" className="font-display text-3xl font-extrabold text-brand-ink">
          De qué trata
        </h2>
        <p className="mt-3 max-w-prose text-lg leading-relaxed text-brand-ink">{book.synopsis}</p>
      </section>

      <section aria-labelledby="for-whom-title" className="mt-8">
        <h2 id="for-whom-title" className="font-display text-3xl font-extrabold text-brand-ink">
          Para el niño o la niña que…
        </h2>
        <p className="mt-3 max-w-prose text-lg leading-relaxed text-brand-ink">{book.forWhom}</p>
      </section>

      <section
        aria-labelledby="conversation-title"
        data-tour="product-question"
        className="mt-10 rounded-[2.5rem] bg-brand-yellow p-6 md:p-10"
      >
        <h2
          id="conversation-title"
          className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-ink/70"
        >
          La pregunta que trae
        </h2>
        <p className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight text-brand-ink md:text-4xl">
          {book.conversationQuestion}
        </p>
        <p className="mt-5 max-w-2xl text-sm font-semibold text-brand-ink/80">
          {book.conversationRule}
        </p>
      </section>

      {outOfStock ? (
        <section className="mt-8 rounded-3xl border-2 border-border bg-background p-6">
          <p className="text-lg font-bold text-brand-ink">
            Este libro se agotó por ahora. Su guía sigue disponible.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {guide && (
              <ButtonLink href={`/guias/${guide.slug}`} variant="outline">
                <Download className="h-4 w-4" aria-hidden="true" />
                Descargar la guía
              </ButtonLink>
            )}
            <WhatsAppInquiry
              label="Avisarme cuando vuelva"
              message={getBookWhatsAppMessage(book.title)}
            />
          </div>
        </section>
      ) : (
        <BookPurchase book={book} guideSlug={guide?.slug} />
      )}

      <div className="mt-3" data-tour="product-whatsapp">
        <WhatsAppInquiry message={getBookWhatsAppMessage(book.title)} />
      </div>

      {shelf && (
        <section aria-labelledby="shelves-title" className="mt-10">
          <h2
            id="shelves-title"
            className="text-sm font-extrabold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Vive en este estante
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/estantes/${shelfSlug}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-border px-4 py-2 text-sm font-bold text-brand-ink transition hover:border-brand-pink hover:text-brand-pink"
            >
              Para el niño o la niña que {shelf.name}
            </Link>
          </div>
        </section>
      )}

      <dl className="mt-10 grid gap-x-6 gap-y-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-bold text-muted-foreground">Edad sugerida</dt>
          <dd>{book.ageSuggestion}</dd>
        </div>
        {typeof book.pages === "number" && (
          <div>
            <dt className="font-bold text-muted-foreground">Páginas</dt>
            <dd>{book.pages}</dd>
          </div>
        )}
        {book.format && (
          <div>
            <dt className="font-bold text-muted-foreground">Formato</dt>
            <dd>{book.format}</dd>
          </div>
        )}
        {book.binding && (
          <div>
            <dt className="font-bold text-muted-foreground">Encuadernación</dt>
            <dd>{book.binding}</dd>
          </div>
        )}
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
      </dl>

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <Link href="/estantes" className="text-sm font-bold text-brand-pink hover:underline">
          ← Volver a los libros
        </Link>
      </div>
    </div>
  );
}
