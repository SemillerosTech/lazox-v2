import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/badge";
import { BookCover } from "@/components/book-cover";
import { Price } from "@/components/price";
import type { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="flex h-full flex-col">
      <Link href={`/libros/${book.slug}`} aria-label={`Ver la ficha de ${book.title}`}>
        <BookCover
          book={book}
          className="transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
          sizes="(max-width: 768px) 70vw, 280px"
        />
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        {book.status === "provisional" && (
          <div className="mb-2">
            <Badge tone="provisional">Recomendación provisional</Badge>
          </div>
        )}
        <h3 className="font-sans text-xl font-extrabold leading-tight">
          <Link href={`/libros/${book.slug}`} className="hover:text-brand-pink">
            {book.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Price price={book.price} />
          <Link
            href={`/libros/${book.slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-pink hover:underline"
          >
            Ver ficha <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
