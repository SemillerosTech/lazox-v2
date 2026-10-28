import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Download } from "lucide-react";

import { BookCover } from "@/components/book-cover";
import { ButtonLink } from "@/components/button-link";
import { Price } from "@/components/price";
import { ShelfDoor } from "@/components/shelf-door";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { catalog } from "@/lib/catalog";
import { WHATSAPP_SCHOOL_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Lazox · Un libro para lo que le está pasando",
  description: "Cada uno viene con preguntas para conversarlo en casa.",
};

const ENTRY_SHELVES = [
  { href: "/estantes/est-10", name: "solo quiere reírse", code: "EST-10" },
  { href: "/estantes/est-09", name: "todavía no lee, pero ya lee", code: "EST-09" },
];

const OTHER_SHELVES = [
  { href: "/estantes/est-06", name: "está empezando de nuevo", code: "EST-06" },
  { href: "/estantes/est-04", name: "tiene miedo de algo", code: "EST-04" },
  { href: "/estantes/est-08", name: "pregunta cosas grandes", code: "EST-08" },
  { href: "/estantes/est-03", name: "teme perder lo que ama", code: "EST-03" },
  { href: "/estantes/est-02", name: "cree que no puede", code: "EST-02" },
  { href: "/estantes/est-05", name: "se siente distinto a todos", code: "EST-05" },
  { href: "/estantes/est-07", name: "vio algo que no le pareció justo", code: "EST-07" },
  { href: "/estantes/est-01", name: "siente que solo sabe romper", code: "EST-01" },
];

const BOX_ITEMS = [
  "El libro.",
  "La guía impresa: el mismo contenido de la descarga, en buen papel.",
  "La tarjeta del buen vecino: el libro que va al lado, y por qué.",
  "La tarjeta «Lo que dijo»: un lugar para anotar, con fecha, lo que dijo su hijo después de leer.",
];

export default async function Home() {
  const book = await catalog.getBook("inseparables");

  return (
    <>
      <section className="bg-brand-cream" data-tour="home-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
          <div>
            <h1 className="text-4xl font-extrabold text-brand-ink sm:text-5xl md:text-6xl">
              Un libro para lo que le está pasando.
            </h1>
            <p className="mt-5 max-w-md text-lg font-semibold text-brand-ink">
              Cada uno viene con preguntas para conversarlo en casa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/estantes">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Ver los libros
              </ButtonLink>
              <ButtonLink href="/cinco-preguntas" variant="outline">
                <Download className="h-4 w-4" aria-hidden="true" />
                Descargar las cinco preguntas
              </ButtonLink>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-cream">
            <Image
              src="/images/l1-inseparables-mesa.webp"
              alt="Inseparables sobre una mesa de madera, con luz de día."
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
            <Image
              src="/images/anfitrion-leyendo.webp"
              alt=""
              aria-hidden="true"
              width={1254}
              height={1254}
              sizes="(max-width: 768px) 96px, 128px"
              className="pointer-events-none absolute -bottom-8 -left-3 w-24 sm:w-28 md:w-32"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="por-donde-empezamos"
        data-tour="home-shelves"
        className="mx-auto max-w-7xl px-4 py-14 md:py-20"
      >
        <h2
          id="por-donde-empezamos"
          className="text-center text-4xl font-extrabold text-brand-pink md:text-5xl"
        >
          ¿Por dónde empezamos?
        </h2>
        <p className="mt-3 text-center text-sm font-bold text-muted-foreground">
          Para el niño o la niña que…
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
          {ENTRY_SHELVES.map((shelf) => (
            <ShelfDoor
              key={shelf.href}
              href={shelf.href}
              name={shelf.name}
              shelfCode={shelf.code}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm font-bold sm:flex-row">
          <Link href="/estantes" className="text-brand-pink hover:underline">
            Ver los diez estantes
          </Link>
          <span aria-hidden="true" className="hidden text-border sm:block">
            ·
          </span>
          <Link href="/cinco-preguntas" className="text-brand-pink hover:underline">
            Todavía no sé: descargar las cinco preguntas
          </Link>
        </div>
      </section>

      <section aria-labelledby="otros-estantes" className="bg-brand-soft-pink">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <h2 id="otros-estantes" className="sr-only">
            Los otros estantes
          </h2>
          <p className="text-sm font-bold text-muted-foreground">Para el niño o la niña que…</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OTHER_SHELVES.map((shelf) => (
              <ShelfDoor
                key={shelf.href}
                href={shelf.href}
                name={shelf.name}
                shelfCode={shelf.code}
                size="small"
              />
            ))}
          </div>
        </div>
      </section>

      {book && (
        <section aria-labelledby="inseparables-home-title" className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-8 rounded-[2.5rem] border border-border bg-background p-6 sm:p-8 md:grid-cols-[minmax(0,220px)_1fr] md:items-center md:p-10">
            <div className="mx-auto w-40 sm:w-48 md:w-full">
              <BookCover book={book} sizes="(max-width: 768px) 160px, 220px" />
            </div>
            <div>
              <h2
                id="inseparables-home-title"
                className="text-4xl font-extrabold text-brand-pink md:text-5xl"
              >
                {book.title}
              </h2>
              <p className="mt-3 font-display text-2xl font-extrabold leading-tight text-brand-ink">
                {book.conversationQuestion}
              </p>
              <p className="mt-2 font-semibold text-muted-foreground">
                {book.author} · Ilustraciones de {book.illustrator}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Price price={book.price} />
                <ButtonLink href={`/libros/${book.slug}`}>Conocer el libro</ButtonLink>
              </div>
              <Link
                href={`/estantes/${book.shelfCode.toLowerCase()}`}
                className="mt-4 inline-block text-sm font-bold text-brand-pink hover:underline"
              >
                Para el niño o la niña que teme perder lo que ama
              </Link>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="cinco-preguntas" className="bg-brand-yellow">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center md:py-20">
          <h2 id="cinco-preguntas" className="text-3xl font-extrabold text-brand-ink md:text-4xl">
            Cinco preguntas para después de leer.
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-semibold text-brand-ink">
            Sirven con cualquier libro, también con el que ya tiene en casa.
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/cinco-preguntas">
              <Download className="h-4 w-4" aria-hidden="true" />
              Descargar las cinco preguntas
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="que-trae-la-caja" className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-cream">
            <Image
              src="/images/c1-caja-abierta.webp"
              alt="La caja de Lazox abierta con el libro y sus materiales."
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2
              id="que-trae-la-caja"
              className="text-3xl font-extrabold text-brand-ink md:text-4xl"
            >
              Qué trae la caja
            </h2>
            <ul className="mt-6 space-y-4 text-lg font-semibold text-brand-ink">
              {BOX_ITEMS.map((item) => (
                <li key={item} className="border-b border-border pb-4 last:border-b-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="Trazaurus y escuelas" className="bg-brand-mint">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:py-16">
          <div className="max-w-md rounded-2xl bg-background p-5">
            <h2 className="text-xl font-extrabold text-brand-ink">
              Trazaurus: una serie para aprender a leer y escribir.
            </h2>
            <div className="mt-4">
              <ButtonLink href="/trazaurus" variant="outline">
                Conocer Trazaurus
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-3xl bg-background p-6 md:p-8">
            <h2 className="text-2xl font-extrabold text-brand-ink">
              Una feria de libros en su escuela. Llevamos los libros; cada uno trae sus preguntas.
            </h2>
            <div className="mt-4">
              <WhatsAppInquiry
                message={WHATSAPP_SCHOOL_MESSAGE}
                label="Escríbanos por WhatsApp"
                showSampleReply={false}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
