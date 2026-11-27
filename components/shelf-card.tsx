import { ArrowUpRight } from "lucide-react";

import { ShelfCardFrame } from "@/components/shelf-card-frame";
import { ShelfBooks } from "@/components/shelf-books";

import type { Shelf } from "@/lib/types";

export function ShelfCard({
  shelf,
  bookCount,
  dataTour,
}: {
  shelf: Shelf;
  bookCount: number;
  dataTour?: string | undefined;
}) {
  return (
    <ShelfCardFrame
      href={`/estantes/${shelf.slug}`}
      bookCount={bookCount}
      dataTour={dataTour}
      shelfCode={shelf.code}
      className="min-h-64 p-4 sm:min-h-88 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-bold sm:text-xs text-muted-foreground">
          Para el niño o la niña que
        </span>
        {bookCount > 0 && (
          <ArrowUpRight
            className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 text-muted-foreground transition group-hover:text-brand-pink"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="mt-4 font-display text-xl sm:mt-6 sm:text-2xl font-extrabold leading-tight text-brand-ink">
        {shelf.name}
      </p>
      <div className="mt-auto pt-7 sm:pt-8">
        <ShelfBooks variant={shelf.code} />
      </div>
    </ShelfCardFrame>
  );
}
