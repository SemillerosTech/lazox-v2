"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { Logo } from "@/components/logo";
import { useCart } from "@/lib/cart/cart-context";
import { SITE_NAV } from "@/lib/site-nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount, isHydrated } = useCart();
  const count = isHydrated ? itemCount : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="LAZOX — Inicio">
          <Logo priority />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold lg:flex" aria-label="Principal">
          {SITE_NAV.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.label} href={item.href} className="hover:text-brand-pink">
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="hover:text-brand-pink">
                {item.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-4">
          <Search className="h-5 w-5" aria-hidden="true" />
          <User className="hidden h-5 w-5 sm:block" aria-hidden="true" />
          <Link
            href="/carrito"
            className="relative rounded-full p-1 transition hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            aria-label={count === 1 ? "Carrito, 1 artículo" : `Carrito, ${count} artículos`}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-brand-green text-[10px] font-bold text-primary-foreground"
            >
              {count}
            </span>
          </Link>
          <button
            type="button"
            className="rounded-md p-1 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="flex flex-col gap-3 border-t border-border px-4 py-4 font-bold lg:hidden"
          aria-label="Menú móvil"
        >
          {SITE_NAV.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-1 hover:text-brand-pink"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-1 hover:text-brand-pink"
              >
                {item.label}
              </a>
            ),
          )}
          <Link
            href="/carrito"
            onClick={() => setOpen(false)}
            className="py-1 hover:text-brand-pink"
          >
            Carrito {count > 0 ? `(${count})` : ""}
          </Link>
        </nav>
      )}
    </header>
  );
}
