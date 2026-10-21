import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-background px-6 py-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-mint">
        <BookOpen className="h-7 w-7 text-brand-ink" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold text-brand-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
