import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Shelf } from "@/lib/types";

export function ShelfCard({ shelf, dataTour }: { shelf: Shelf; dataTour?: string | undefined }) {
  return (
    <Link
      href={`/estantes/${shelf.slug}`}
      data-tour={dataTour}
      data-shelf-code={shelf.code}
      className="group flex min-h-48 flex-col justify-between rounded-3xl border-2 border-border bg-background p-6 transition hover:-translate-y-1 hover:border-brand-pink hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold text-muted-foreground">Para el niño o la niña que</span>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-brand-pink"
          aria-hidden="true"
        />
      </div>
      <p className="mt-6 font-display text-2xl font-extrabold leading-tight text-brand-ink">
        {shelf.name}
      </p>
    </Link>
  );
}
