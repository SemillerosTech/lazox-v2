import type { ReactNode } from "react";
import Link from "next/link";

export function ShelfCardFrame({
  href,
  bookCount,
  shelfCode,
  dataTour,
  className,
  children,
}: {
  href: string;
  bookCount: number;
  shelfCode?: string | undefined;
  dataTour?: string | undefined;
  className: string;
  children: ReactNode;
}) {
  const base = `flex flex-col rounded-3xl border-2 border-border bg-background ${className}`;
  const content = (
    <>
      {children}
      <span className="mt-3 block text-right text-[11px] font-semibold text-muted-foreground">
        {bookCount} {bookCount === 1 ? "libro" : "libros"}
      </span>
    </>
  );

  if (bookCount === 0) {
    return (
      <div
        role="link"
        aria-disabled="true"
        data-tour={dataTour}
        data-shelf-code={shelfCode}
        className={`${base} cursor-default opacity-65`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      data-tour={dataTour}
      data-shelf-code={shelfCode}
      className={`${base} group transition hover:-translate-y-1 hover:border-brand-pink hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink`}
    >
      {content}
    </Link>
  );
}
