"use client";

import Link from "next/link";

import { ButtonLink } from "@/components/button-link";
import { CartLineItem } from "@/components/cart-line-item";
import { EmptyState } from "@/components/empty-state";
import { OrderSummary } from "@/components/order-summary";
import { useCart } from "@/lib/cart/cart-context";

export function CartPage() {
  const { items, subtotal, isHydrated, setQuantity, remove } = useCart();

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 md:py-14">
        <div className="h-10 w-56 rounded bg-border" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="h-64 rounded-3xl bg-border/70" />
          <div className="h-64 rounded-3xl bg-border/70" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Su carrito</h1>
        <div className="mt-8">
          <EmptyState
            title="Su carrito está vacío"
            description="Agregue Inseparables o siga explorando los estantes para encontrar una historia para conversar en familia."
          >
            <ButtonLink href="/libros/inseparables">Conocer Inseparables</ButtonLink>
            <ButtonLink href="/estantes" variant="outline">
              Explorar estantes
            </ButtonLink>
          </EmptyState>
        </div>
      </div>
    );
  }

  const summaryLines = items.map((item) => ({
    bookSlug: item.book.slug,
    title: item.book.title,
    quantity: item.quantity,
    unitPrice: item.book.price.amount,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
            Su compra
          </p>
          <h1 className="mt-1 text-4xl font-extrabold text-brand-ink md:text-5xl">Su carrito</h1>
        </div>
        <Link href="/estantes" className="text-sm font-bold text-brand-pink hover:underline">
          ← Continuar explorando
        </Link>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <section
          aria-label="Productos en su carrito"
          className="rounded-3xl border border-border bg-background p-5 md:p-6"
        >
          {items.map((item) => (
            <CartLineItem
              key={item.book.slug}
              item={item}
              onQuantityChange={(quantity) => setQuantity(item.book.slug, quantity)}
              onRemove={() => remove(item.book.slug)}
            />
          ))}
        </section>

        <div className="lg:sticky lg:top-24" data-tour="cart-summary">
          <OrderSummary lines={summaryLines} subtotal={subtotal}>
            <ButtonLink href="/compra/demo" className="w-full">
              Ir a la compra de demostración
            </ButtonLink>
            <Link
              href="/estantes"
              className="block text-center text-sm font-bold text-brand-pink hover:underline"
            >
              Seguir explorando
            </Link>
          </OrderSummary>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Los precios y la compra son de demostración. No se realizará ningún cargo.
          </p>
        </div>
      </div>
    </div>
  );
}
