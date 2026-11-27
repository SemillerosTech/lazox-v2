import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { BookOpen, Download } from "lucide-react";

import { BookCover } from "@/components/book-cover";
import { ButtonLink } from "@/components/button-link";
import { Price } from "@/components/price";
import { ShelfDoor } from "@/components/shelf-door";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { catalog } from "@/lib/catalog";
import { listShelvesWithBookCounts } from "@/lib/catalog/shelf-counts";
import { isRentalOnly } from "@/lib/rental";
import { WHATSAPP_SCHOOL_MESSAGE } from "@/lib/whatsapp";

import griny from "@/public/images/Mascota Griny verde menta kawaii-1.png";
import bolin from "@/public/images/Bolin kawaii con sonrisa rosada-2.png";
import triani from "@/public/images/Triángulo Coral Sonriente-3.png";
import senti from "@/public/images/Senti, la cápsula turquesa sonriente-4.png";
import trazaurusDinosaur from "@/public/images/trazaurus-rino.png";
import yelli from "@/public/images/Yelli, la cápsula amarilla kawaii-6.png";

function HomeCharacter({ image, className }: { image: StaticImageData; className: string }) {
  return (
    <Image
      src={image}
      alt=""
      aria-hidden="true"
      sizes="128px"
      className={`pointer-events-none h-auto shrink-0 select-none ${className}`}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await catalog.getHomepageContent();
  return {
    title: { absolute: "Lazox · Un libro para lo que le está pasando" },
    description: "Cada uno viene con preguntas para conversarlo en casa.",
    openGraph: {
      title: "Lazox · Un libro para lo que le está pasando",
      description: "Cada uno viene con preguntas para conversarlo en casa.",
      images: homepage?.entryOgImage
        ? [{ url: homepage.entryOgImage, width: 1200, height: 630, alt: homepage.entryImageAlt }]
        : [],
    },
  };
}

export const dynamic = "force-dynamic";

const BOX_ITEMS = [
  "El libro.",
  "La guía impresa: el mismo contenido de la descarga, en buen papel.",
  "La tarjeta del buen vecino: el libro que va al lado, y por qué.",
  "La tarjeta «Lo que dijo»: un lugar para anotar, con fecha, lo que dijo su hijo después de leer.",
];

export default async function Home() {
  const [shelves, homepage] = await Promise.all([
    listShelvesWithBookCounts(catalog),
    catalog.getHomepageContent(),
  ]);

  const book = await catalog.getBook(homepage?.entryBookSlug ?? "inseparables");
  const showBox =
    process.env.LAZOX_BOX_PRINTED_CONFIRMED === "true" ||
    (process.env.NODE_ENV === "development" && process.env.LAZOX_PREVIEW_BOX === "true");
  const entryShelves = shelves.slice(0, 2);
  const otherShelves = shelves.slice(2);
  const shelfPrefix = homepage?.shelfPrefix ?? "Para el niño o la niña que…";
  const bookShelf = book?.shelfCode
    ? shelves.find((shelf) => shelf.code === book.shelfCode)
    : undefined;

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

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-200">
            {homepage?.entryImage && homepage.entryImageAlt ? (
              <Image
                src={homepage.entryImage}
                alt={homepage.entryImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center font-semibold text-brand-ink">
                Toma L1 · {book?.title ?? "Inseparables"} abierto sobre una mesa
              </div>
            )}
            {homepage?.hostImage && (
              <Image
                src={homepage.hostImage}
                alt=""
                aria-hidden="true"
                width={128}
                height={128}
                className="pointer-events-none absolute -bottom-3 left-0 w-20 md:w-24"
              />
            )}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="por-donde-empezamos"
        data-tour="home-shelves"
        className="mx-auto max-w-7xl px-4 py-14 md:py-20"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 sm:gap-6">
          <HomeCharacter image={griny} className="w-10 -rotate-6 sm:w-16 md:w-20" />
          <div className="min-w-0 text-center">
            <h2
              id="por-donde-empezamos"
              className="text-3xl font-extrabold text-brand-pink sm:text-4xl md:text-5xl"
            >
              ¿Por dónde empezamos?
            </h2>
            <p className="mt-3 text-sm font-bold text-muted-foreground">{shelfPrefix}</p>
          </div>
          <HomeCharacter image={bolin} className="w-14 rotate-6 sm:w-20 md:w-28" />
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
          {entryShelves.map((shelf) => (
            <ShelfDoor
              key={shelf.slug}
              href={`/estantes/${shelf.slug}`}
              name={shelf.name}
              shelfCode={shelf.code}
              bookCount={shelf.bookCount}
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
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-muted-foreground">{shelfPrefix}</p>
            <HomeCharacter image={triani} className="w-20 -rotate-6 md:w-28" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherShelves.map((shelf) => (
              <ShelfDoor
                key={shelf.slug}
                href={`/estantes/${shelf.slug}`}
                name={shelf.name}
                shelfCode={shelf.code}
                bookCount={shelf.bookCount}
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
              {book.conversationQuestion && (
                <p className="mt-3 font-display text-2xl font-extrabold leading-tight text-brand-ink">
                  {book.conversationQuestion}
                </p>
              )}
              <p className="mt-2 font-semibold text-muted-foreground">
                {[book.author, book.illustrator ? `Ilustraciones de ${book.illustrator}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {isRentalOnly(book) ? (
                  <span className="font-bold">Solo en renta escolar</span>
                ) : (
                  <Price price={book.price} />
                )}
                <ButtonLink href={`/libros/${book.slug}`}>Conocer el libro</ButtonLink>
              </div>
              {bookShelf && (
                <Link
                  href={`/estantes/${bookShelf.slug}`}
                  className="mt-4 inline-block text-sm font-bold text-brand-pink hover:underline"
                >
                  {shelfPrefix.replace(/…$/, "")} {bookShelf.name}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="cinco-preguntas" className="bg-brand-yellow">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center md:py-20">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <h2 id="cinco-preguntas" className="text-3xl font-extrabold text-brand-ink md:text-4xl">
              Cinco preguntas para después de leer.
            </h2>
            <HomeCharacter image={yelli} className="w-10 rotate-6 md:w-16" />
          </div>
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

      {showBox && (
        <section
          aria-labelledby="que-trae-la-caja"
          className="mx-auto max-w-7xl px-4 py-14 md:py-20"
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-cream">
              {homepage?.boxImage ? (
                <Image
                  src={homepage.boxImage}
                  alt="La caja de Lazox abierta con sus piezas."
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200 p-8 text-center font-semibold text-brand-ink">
                  Toma C1 · La caja abierta con sus tres piezas
                </div>
              )}
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
      )}

      <section aria-label="Trazaurus y escuelas" className="bg-brand-mint">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:py-16">
          <div className="max-w-md rounded-2xl bg-background p-5">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-extrabold text-brand-ink">
                Trazaurus: una serie para aprender a leer y escribir.
              </h2>
              <HomeCharacter image={trazaurusDinosaur} className="w-16 md:w-20" />
            </div>
            <div className="mt-4">
              <ButtonLink href="/trazaurus" variant="outline">
                Conocer Trazaurus
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-3xl bg-background p-6 md:p-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-extrabold text-brand-ink">
                Una feria de libros en su escuela. Llevamos los libros; cada uno trae sus preguntas.
              </h2>
              <HomeCharacter image={senti} className="w-10 rotate-6 md:w-14" />
            </div>
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
