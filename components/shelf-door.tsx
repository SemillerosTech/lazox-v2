import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ShelfDoor({
  href,
  name,
  shelfCode,
  size = "default",
}: {
  href: string;
  name: string;
  shelfCode?: string | undefined;
  size?: "default" | "small";
}) {
  return (
    <Link
      href={href}
      data-shelf-code={shelfCode}
      className={`group flex flex-col justify-between rounded-3xl border-2 border-border bg-background transition hover:-translate-y-1 hover:border-brand-pink hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
        size === "small" ? "min-h-32 p-5" : "min-h-48 p-6"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold text-muted-foreground">Para el niño o la niña que</span>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-brand-pink"
          aria-hidden="true"
        />
      </div>
      <p
        className={`mt-6 font-display font-extrabold leading-tight text-brand-ink ${
          size === "small" ? "text-xl" : "text-2xl"
        }`}
      >
        {name}
      </p>
    </Link>
  );
}
