"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { BookCover } from "@/components/book-cover";
import { QuantityStepper } from "@/components/quantity-stepper";
import { formatPrice } from "@/lib/format";
import type { CartLineItem } from "@/lib/types";

export function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartLineItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <article className="flex gap-4 border-b border-border py-5 first:pt-0 last:border-b-0">
      <Link
        href={`/libros/${item.book.slug}`}
        className="w-20 shrink-0"
        aria-label={`Ver ${item.book.title}`}
      >
        <BookCover book={item.book} sizes="80px" className="rounded-xl shadow-md" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-sans text-base font-extrabold leading-tight">
            <Link href={`/libros/${item.book.slug}`} className="hover:text-brand-pink">
              {item.book.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{item.book.author}</p>
          <p className="mt-2 text-sm font-bold">{formatPrice(item.unitPrice)}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">
          <QuantityStepper
            value={item.quantity}
            onChange={onQuantityChange}
            label={item.book.title}
          />
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-sm font-extrabold">
              {formatPrice(item.lineTotal)}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition hover:bg-brand-soft-pink hover:text-brand-pink"
              aria-label={`Eliminar ${item.book.title} del carrito`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
