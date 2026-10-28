import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShelfCard } from "@/components/shelf-card";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Para el niño o la niña que…",
  description:
    "Diez estantes para encontrar el libro que acompaña lo que un niño o una niña está viviendo.",
};

export default async function ShelvesPage() {
  const shelves = await catalog.listShelves();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Libros" }]} />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
          Para el niño o la niña que…
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-brand-ink md:text-6xl">
          Elija el estante que mejor nombre lo que está viviendo.
        </h1>
      </header>

      <div
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        data-tour="shelves-grid"
      >
        {shelves.map((shelf) => (
          <ShelfCard
            key={shelf.code}
            shelf={shelf}
            dataTour={shelf.code === "EST-03" ? "shelf-est-03" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
