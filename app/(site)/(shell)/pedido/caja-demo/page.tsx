import type { Metadata } from "next";
import Image from "next/image";
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-cream">
          <Image
            src="/images/c1-caja-abierta.webp"
            alt="La caja de Lazox abierta con el libro y sus materiales."
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
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
