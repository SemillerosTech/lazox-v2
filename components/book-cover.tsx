import Image from "next/image";

import type { Book } from "@/lib/types";

type BookCoverBook = Pick<Book, "title" | "author" | "coverImage">;

export function BookCover({
  book,
  className = "",
  sizes = "(max-width: 768px) 80vw, 320px",
}: {
  book: BookCoverBook;
  className?: string;
  sizes?: string;
}) {
  if (book.coverImage) {
    return (
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-cream shadow-xl ${className}`}
      >
        <Image
          src={book.coverImage}
          alt={`Portada de ${book.title}`}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Portada de demostración de ${book.title}, de ${book.author}`}
      className={`book-cover relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-yellow shadow-xl ${className}`}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-pink/80" />
        <div className="absolute -left-10 top-1/3 h-28 w-28 rotate-12 rounded-3xl bg-brand-blue/60" />
        <div className="absolute bottom-20 right-6 h-16 w-16 rounded-full bg-brand-green/70" />
        <div className="absolute -bottom-6 left-1/3 h-24 w-24 rounded-t-full bg-brand-red/70" />
      </div>
      <div className="book-cover__content relative flex h-full flex-col justify-between">
        <span className="book-cover__eyebrow font-extrabold uppercase text-brand-ink/60">
          Lazox · Libro
        </span>
        <span
          aria-hidden="true"
          className="book-cover__mark font-display font-extrabold text-brand-ink"
        >
          L
        </span>
        <div>
          <p className="book-cover__title font-display font-extrabold text-brand-ink">
            {book.title}
          </p>
          <p className="book-cover__author mt-2 font-bold text-brand-ink/70">{book.author}</p>
        </div>
        <span className="book-cover__demo self-start rounded-full bg-background/85 px-3 py-1 font-bold text-brand-ink/70">
          Portada de demostración
        </span>
      </div>
    </div>
  );
}
