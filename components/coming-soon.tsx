import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "En preparación",
  robots: { index: false, follow: false },
};

export function ComingSoon({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: breadcrumb ?? title }]} />

      <header className="mt-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-pink">
          En preparación
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-brand-ink md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {description ??
            "Esta página todavía no está disponible. Estamos preparando su contenido."}
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/estantes">Ver los libros</ButtonLink>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-brand-pink hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
