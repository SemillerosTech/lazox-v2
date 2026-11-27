import { ArrowUpRight } from "lucide-react";

import { ShelfCardFrame } from "@/components/shelf-card-frame";
import { ShelfBooks } from "@/components/shelf-books";

export function ShelfDoor({
  href,
  name,
  bookCount,
  shelfCode,
  size = "default",
}: {
  href: string;
  name: string;
  bookCount: number;
  shelfCode?: string | undefined;
  size?: "default" | "small";
}) {
  return (
    <ShelfCardFrame
      href={href}
      bookCount={bookCount}
      shelfCode={shelfCode}
      className={`${size === "small" ? "min-h-72 p-5" : "min-h-80 p-6"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold text-muted-foreground">Para el niño o la niña que</span>
        {bookCount > 0 && (
          <ArrowUpRight
            className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-brand-pink"
            aria-hidden="true"
          />
        )}
      </div>
      <p
        className={`mt-6 font-display font-extrabold leading-tight text-brand-ink ${
          size === "small" ? "text-xl" : "text-2xl"
        }`}
      >
        {name}
      </p>
      <div className={`mx-auto mt-auto w-full pt-7 ${size === "small" ? "max-w-64" : "max-w-80"}`}>
        <ShelfBooks variant={shelfCode ?? name} />
      </div>
    </ShelfCardFrame>
  );
}
