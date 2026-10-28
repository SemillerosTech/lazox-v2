import type { ReactNode } from "react";

import { formatPrice } from "@/lib/format";
import type { DemoOrderLine } from "@/lib/types";

export function OrderSummary({
  lines,
  subtotal,
  children,
  title = "Resumen del pedido",
}: {
  lines: DemoOrderLine[];
  subtotal: number;
  children?: ReactNode;
  title?: string;
}) {
  return (
    <section
      aria-labelledby="order-summary-title"
      className="rounded-3xl border border-border bg-background p-6 shadow-sm"
    >
      <h2 id="order-summary-title" className="font-display text-2xl font-extrabold text-brand-ink">
        {title}
      </h2>
      <ul className="mt-4 divide-y divide-border">
        {lines.map((line) => (
          <li key={line.bookSlug} className="flex items-start justify-between gap-4 py-3 text-sm">
            <span>
              <span className="font-bold">{line.title}</span>
              <span className="block text-xs text-muted-foreground">Cantidad: {line.quantity}</span>
            </span>
            <span className="whitespace-nowrap font-bold">
              {formatPrice(line.unitPrice * line.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="font-bold">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-2 text-base">
          <dt className="font-extrabold">Total de la demostración</dt>
          <dd className="font-extrabold text-brand-pink">{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      {children && <div className="mt-5 space-y-3">{children}</div>}
    </section>
  );
}
