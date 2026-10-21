"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { Logo } from "@/components/logo";

const nav = [
  "Por edades",
  "Por experiencias",
  "Talleres y cursos",
  "Recursos",
  "Tienda",
  "Nosotros",
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="LAZOX — Inicio">
          <Logo priority />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold lg:flex">
          {nav.map((item, index) => (
            <a key={item} href="#" className="flex items-center gap-1 hover:text-brand-pink">
              {item}
              {index < 4 && <ChevronDown className="h-3.5 w-3.5" />}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Search className="h-5 w-5" aria-hidden="true" />
          <User className="hidden h-5 w-5 sm:block" aria-hidden="true" />
          <span className="relative">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-brand-green text-[10px] font-bold text-primary-foreground">
              0
            </span>
          </span>
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-3 border-t border-border px-4 py-4 font-bold lg:hidden">
          {nav.map((item) => (
            <a key={item} href="#" onClick={() => setOpen(false)}>
              {item}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
