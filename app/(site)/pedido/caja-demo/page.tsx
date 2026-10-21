import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Gift, MessageSquare, StickyNote } from "lucide-react";

import { Badge } from "@/components/badge";
import { BookCover } from "@/components/book-cover";
import { ButtonLink } from "@/components/button-link";
import { DemoNotice } from "@/components/demo-notice";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "La caja de Inseparables (demostración)",
  robots: { index: false, follow: false },
};

export default async function BoxDemoPage() {
  const book = await catalog.getBook("inseparables");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <DemoNotice>
        Representación conceptual de la caja. No utiliza fotografías oficiales ni genera un envío
        real.
      </DemoNotice>

      <header className="mt-8 max-w-3xl">
        <Badge tone="demo">Demostración</Badge>
        <h1 className="mt-3 text-4xl font-extrabold text-brand-ink md:text-5xl">
          La caja de Inseparables
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Esto es lo que una familia encontraría al abrir la caja: el libro y los materiales para
          conversar y recordar lo que dijo.
        </p>
      </header>

      <section
        aria-label="Contenido de la caja"
        className="mt-10 rounded-[2.5rem] border-2 border-brand-yellow bg-brand-cream p-4 md:p-8"
      >
        <p className="mb-4 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-brand-ink/60">
          Caja abierta · composición de demostración
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {book && (
            <article className="rounded-3xl bg-background p-5">
              <div className="mx-auto w-36">
                <BookCover book={book} sizes="144px" />
              </div>
              <h2 className="mt-4 text-center font-display text-xl font-extrabold text-brand-ink">
                {book.title}
              </h2>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Libro · {book.author}
              </p>
            </article>
          )}

          <article className="rounded-3xl bg-brand-yellow p-5">
            <StickyNote className="h-6 w-6 text-brand-ink" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-extrabold text-brand-ink">
              Tarjeta impresa de Inseparables
            </h2>
            <p className="mt-2 text-sm text-brand-ink/80">
              Una tarjeta con el libro, su pregunta para conversar y la invitación a seguir hablando
              en familia.
            </p>
            <div className="mt-4 rounded-2xl bg-background/80 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand-ink/60">
                Pregunta para conversar
              </p>
              <p className="mt-1 font-display text-lg font-extrabold leading-tight text-brand-ink">
                ¿Hay algo o alguien que no te gustaría perder nunca?
              </p>
            </div>
          </article>

          <article className="rounded-3xl border-2 border-dashed border-border bg-background p-5">
            <Gift className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <div className="mt-3">
              <Badge tone="neutral">Pendiente de definición editorial</Badge>
            </div>
            <h2 className="mt-3 font-display text-xl font-extrabold text-brand-ink">
              Tarjeta del buen vecino
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              La selección del libro vecino todavía no está definida. Esta tarjeta se completará
              cuando Rossy apruebe la recomendación.
            </p>
          </article>

          <article className="rounded-3xl bg-brand-mint p-5">
            <MessageSquare className="h-6 w-6 text-brand-ink" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-extrabold text-brand-ink">
              Tarjeta «lo que dijo»
            </h2>
            <p className="mt-2 text-sm text-brand-ink/80">
              Un espacio para guardar una frase, una fecha y lo que la familia quiera recordar.
            </p>
            <div className="mt-4 rounded-2xl bg-background/80 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-ink/60">
                <CalendarDays className="h-4 w-4" aria-hidden="true" /> Fecha
                <span className="ml-2 flex-1 border-b border-dashed border-brand-ink/30" />
              </div>
              <div className="mt-5 space-y-4">
                <span className="block border-b border-dashed border-brand-ink/30" />
                <span className="block border-b border-dashed border-brand-ink/30" />
                <span className="block border-b border-dashed border-brand-ink/30" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <ButtonLink href="/pedido/confirmacion-demo" variant="outline">
          Volver a la confirmación
        </ButtonLink>
        <ButtonLink href="/guias/inseparables">Abrir la guía privada</ButtonLink>
        <Link
          href="/libros/inseparables"
          className="text-sm font-bold text-brand-pink hover:underline"
        >
          Ver la ficha del libro
        </Link>
      </div>
    </div>
  );
}
