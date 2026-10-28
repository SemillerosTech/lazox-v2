import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/button-link";
import { DemoNotice } from "@/components/demo-notice";

export const metadata: Metadata = {
  title: "La caja (demostración)",
  robots: { index: false, follow: false },
};

const BOX_ITEMS = [
  "El libro.",
  "La guía impresa: el mismo contenido de la descarga, en buen papel.",
  "La tarjeta del buen vecino: el libro que va al lado, y por qué.",
  "La tarjeta «Lo que dijo»: un lugar para anotar, con fecha, lo que dijo su hijo después de leer.",
];

export default function BoxDemoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <DemoNotice>
        Representación conceptual de la caja. No utiliza fotografías oficiales ni genera un envío
        real.
      </DemoNotice>

      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-brand-ink md:text-5xl">Qué trae la caja</h1>
      </header>

      <section
        aria-label="Contenido de la caja"
        data-tour="unboxing"
        className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center"
      >
        <div className="grid aspect-[4/3] place-items-center rounded-3xl border-2 border-dashed border-border bg-brand-cream p-6 text-center">
          <p className="max-w-xs text-sm font-bold text-muted-foreground">
            Toma C1 · La caja abierta con sus tres piezas
          </p>
        </div>

        <ul className="space-y-4 text-lg font-semibold text-brand-ink">
          {BOX_ITEMS.map((item) => (
            <li key={item} className="border-b border-border pb-4 last:border-b-0">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <ButtonLink href="/guias/inseparables">Abrir la guía</ButtonLink>
        <Link
          href="/pedido/confirmacion-demo"
          className="text-sm font-bold text-brand-pink hover:underline"
        >
          Volver a la confirmación
        </Link>
      </div>
    </div>
  );
}
