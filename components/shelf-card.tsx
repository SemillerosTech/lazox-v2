import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Shelf } from "@/lib/types";

export function ShelfCard({ shelf }: { shelf: Shelf }) {
  const bookCount = shelf.bookSlugs.length;

  return (
    <Link
      href={`/estantes/${shelf.slug}`}
      className="group flex min-h-56 flex-col justify-between rounded-3xl border-2 border-border bg-background p-6 transition hover:-translate-y-1 hover:border-brand-pink hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-brand-soft-pink px-3 py-1 text-[11px] font-extrabold tracking-wide text-brand-pink">
          {shelf.code}
        </span>
        <ArrowUpRight
          className="h-5 w-5 text-muted-foreground transition group-hover:text-brand-pink"
          aria-hidden="true"
        />
      </div>
      <p className="mt-8 font-display text-2xl font-extrabold leading-tight text-brand-ink">
        <span className="block text-sm font-bold text-muted-foreground">
          Para el niño o la niña que
        </span>
        {shelf.name}
      </p>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {bookCount > 0
          ? `${bookCount} ${bookCount === 1 ? "libro" : "libros"}`
          : "Selección en preparación"}
      </p>
    </Link>
  );
}
