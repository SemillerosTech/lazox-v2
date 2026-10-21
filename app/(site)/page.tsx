import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Heart,
  Sprout,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/badge";
import { BookCover } from "@/components/book-cover";
import { ButtonLink } from "@/components/button-link";
import { Price } from "@/components/price";
import { catalog } from "@/lib/catalog";

const shapes = [
  "rounded-2xl bg-brand-yellow",
  "rounded-full bg-brand-red",
  "rotate-12 rounded-lg bg-brand-blue",
  "rounded-t-full bg-brand-green",
  "rounded-full bg-brand-pink",
];

const tiles = ["bg-brand-soft-pink", "bg-brand-mint", "bg-brand-lavender", "bg-brand-yellow/40"];

const featured = [
  ["Cuentos con sentido", "Historias para imaginar y conversar."],
  ["Mi diario de emociones", "Herramientas para conocer y expresar lo que sentimos."],
  ["Crecer en familia", "Dinámicas para conectar en casa."],
  ["Kit creativo LAZOX", "Materiales para crear, explorar y aprender."],
];

const purposes = [
  ["Emociones", "bg-brand-yellow text-brand-ink"],
  ["Familia", "bg-brand-pink"],
  ["Juego y creatividad", "bg-brand-lavender text-brand-ink"],
  ["Valores", "bg-brand-blue border-2 border-primary-foreground"],
  ["Escuela", "bg-brand-green"],
  ["Naturaleza", "bg-brand-yellow text-brand-ink"],
  ["Primeros lectores", "bg-brand-soft-pink text-brand-ink"],
  ["Exploración", "bg-brand-mint text-brand-ink"],
  ["Rutinas", "bg-brand-yellow text-brand-ink"],
  ["Lectores curiosos", "bg-brand-pink"],
];

const news = [
  ["El poder de las preguntas", "Un libro para conversar en familia."],
  ["Tarjetas de emociones", "Para nombrar, reconocer y compartir."],
  ["Aventuras en familia", "Actividades para explorar juntos."],
  ["Bitácora de gratitud", "Pequeños momentos, grandes cambios."],
  ["Juego de conexiones", "Dinámicas para conocernos mejor."],
  ["Pequeños grandes exploradores", "Actividades para descubrir el mundo."],
  ["Talleres LAZOX", "Experiencias vivenciales para crecer juntos."],
  ["Kits creativos", "Materiales para crear, expresar y descubrir."],
];

const readers = [
  ["Primeros lectores", "Explorar y sorprenderse", shapes[0]],
  ["Lectores en exploración", "Historias que abren preguntas", shapes[3]],
  ["Lectores curiosos", "Para imaginar más allá", shapes[2]],
  ["Lectores profundos", "Para seguir conversando", "rounded-md bg-brand-red"],
];

const experiences: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
}> = [
  {
    icon: Sprout,
    title: "Por dónde empezar",
    description: "Recomendaciones para cada etapa",
    className: "bg-brand-yellow text-brand-ink",
  },
  {
    icon: Heart,
    title: "Nos recomiendan",
    description: "Historias de familias, escuelas y comunidades",
    className: "bg-brand-lavender text-brand-ink",
  },
  {
    icon: BookOpen,
    title: "¿Para quién?",
    description: "Familias, escuelas, empresas y comunidades",
    className: "bg-brand-blue text-primary-foreground",
  },
  {
    icon: Cloud,
    title: "Rutas emocionales",
    description: "Experiencias por tema",
    className: "bg-brand-pink text-primary-foreground",
  },
];

const testimonials = [
  ["“Los libros son hermosos y las actividades son muy significativas.”", "Mamá de 2 niños"],
  ["“Nos ha ayudado a conectar en familia de una forma diferente.”", "Papá de 7 años"],
  ["“Materiales de gran calidad y con mucho sentido.”", "Maestra de primaria"],
  ["“Una propuesta diferente, creativa y muy bonita.”", "Mamá de 6 años"],
];

function Pill({
  children,
  variant = "pink",
  href = "#",
}: {
  children: ReactNode;
  variant?: "pink" | "white" | "outline";
  href?: string;
}) {
  const styles = {
    pink: "bg-brand-pink text-primary-foreground hover:brightness-110",
    white: "bg-background text-brand-ink hover:bg-brand-cream",
    outline: "border-2 border-brand-pink bg-background text-brand-pink hover:bg-brand-soft-pink",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${styles}`}
    >
      {children} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function Placeholder({
  bg,
  shape,
  label,
}: {
  bg?: string | undefined;
  shape?: string | undefined;
  label?: string | undefined;
}) {
  return (
    <div
      className={`relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl ${bg}`}
    >
      {label && (
        <span className="absolute left-4 top-3 max-w-[60%] font-display text-lg font-bold leading-tight text-brand-ink">
          {label}
        </span>
      )}
      <div className={`h-16 w-16 ${shape} shadow-lg`} />
    </div>
  );
}

export default async function Home() {
  const book = await catalog.getBook("inseparables");

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
          <div>
            <h1 className="text-5xl font-extrabold md:text-6xl">
              Experiencias con sentido para crecer juntos
            </h1>
            <p className="mt-5 max-w-md text-lg">
              Talleres, cursos, materiales y experiencias para familias, escuelas, empresas y
              comunidades.
            </p>
            <div className="mt-6">
              <Pill href="/estantes">Ver experiencias</Pill>
            </div>
          </div>
          <Image
            src="/images/hero.jpg"
            alt="Personajes LAZOX sobre un arcoíris"
            width={1280}
            height={800}
            priority
            className="h-auto w-full rounded-3xl"
          />
        </div>
      </section>

      {/* Blue strip */}
      <div className="bg-brand-blue text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 text-sm font-bold md:flex-row">
          <span>Libros, talleres y recursos para familias, escuelas y comunidades</span>
          <Pill variant="white">Conozca LAZOX</Pill>
          <span className="flex items-center gap-2">
            Envíos a todo México <Truck className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Yellow intro */}
      <section className="bg-brand-yellow px-4 py-14 text-center">
        <h2 className="text-4xl font-extrabold text-brand-pink md:text-5xl">
          Para cada familia,
          <br />
          una experiencia
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-semibold">
          Descubra libros, materiales, talleres y recursos diseñados para jugar, crear, aprender y
          crecer juntos.
        </p>
        <div className="mt-6">
          <Pill variant="white" href="/estantes">
            Explorar todas las experiencias
          </Pill>
        </div>
      </section>

      {/* Aquí empieza */}
      <section className="mx-auto max-w-7xl px-4 py-14 text-center">
        <h2 className="text-3xl font-extrabold text-brand-pink">Aquí empieza</h2>
        <p className="mt-1 text-sm">Una selección para descubrir, jugar y conectar.</p>
        <div className="mt-8 grid grid-cols-2 gap-5 text-left md:grid-cols-4">
          {featured.map(([title, description], index) => (
            <div key={title}>
              <Placeholder bg={tiles[index]} shape={shapes[index]} label={title} />
              <h3 className="mt-3 font-sans text-base font-extrabold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Pill variant="outline" href="/estantes">
            Ver todos los productos
          </Pill>
        </div>
      </section>

      {/* Explora */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl bg-brand-blue px-6 py-10 text-center text-primary-foreground">
          <h2 className="text-3xl font-extrabold text-brand-yellow">Explora con intención</h2>
          <p className="mt-1 text-sm">Encuentre experiencias por lo que más le importa.</p>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
            {purposes.map(([title, className]) => (
              <span key={title} className={`rounded-full px-5 py-2 text-sm font-bold ${className}`}>
                {title}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <Pill variant="white" href="/estantes">
              Explorar por temática
            </Pill>
          </div>
        </div>
      </section>

      {/* Leer la práctica */}
      <section className="mt-14 bg-brand-soft-pink">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2">
          <div className="rounded-[3rem] bg-brand-yellow p-8 md:p-12">
            <h2 className="text-4xl font-extrabold text-brand-pink md:text-5xl">
              Leer la práctica
            </h2>
            <p className="mt-4 max-w-sm font-semibold">
              En LAZOX creemos en experiencias que se viven. Libros, juegos y materiales para
              acompañar la vida real de las familias.
            </p>
            <div className="mt-6">
              <Pill>Conozca más</Pill>
            </div>
          </div>
          <Image
            src="/images/reading.jpg"
            alt="Libro abierto con personajes"
            width={1024}
            height={768}
            loading="lazy"
            className="h-auto w-full rounded-3xl"
          />
        </div>
      </section>

      {/* Banda Inseparables */}
      {book && (
        <section aria-labelledby="inseparables-home-title" className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-8 rounded-[2.5rem] border border-border bg-background p-6 sm:p-8 md:grid-cols-[minmax(0,220px)_1fr] md:items-center md:p-10">
            <div className="mx-auto w-40 sm:w-48 md:w-full">
              <BookCover book={book} sizes="(max-width: 768px) 160px, 220px" />
            </div>
            <div>
              <Badge tone="provisional">Primer libro disponible</Badge>
              <h2
                id="inseparables-home-title"
                className="mt-3 text-4xl font-extrabold text-brand-pink md:text-5xl"
              >
                {book.title}
              </h2>
              <p className="mt-1 font-semibold text-muted-foreground">
                {book.author} · Ilustraciones de {book.illustrator}
              </p>
              <p className="mt-4 max-w-2xl">
                Dos zapatillas que iban juntas a todas partes, hasta que un día algo las separa.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Price price={book.price} />
                <ButtonLink href={`/libros/${book.slug}`}>Conocer el libro</ButtonLink>
                <ButtonLink href={`/estantes/${book.shelfCode.toLowerCase()}`} variant="outline">
                  Ver estante {book.shelfCode}
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Novedades */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-extrabold text-brand-pink">Novedades en LAZOX</h2>
          <a href="#" className="flex items-center gap-1 text-sm font-bold text-brand-pink">
            Ver todas <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {news.map(([title, description], index) => (
            <div key={title}>
              <Placeholder bg={tiles[(index + 1) % 4]} shape={shapes[index % 5]} />
              <h3 className="mt-3 font-sans text-sm font-extrabold">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Pill variant="outline">Ver todas las novedades</Pill>
        </div>
      </section>

      {/* Libros para cada lector */}
      <section className="bg-brand-pink px-4 py-14 text-center text-primary-foreground">
        <h2 className="text-3xl font-extrabold md:text-4xl">Libros para cada lector</h2>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {readers.map(([title, description, shape]) => (
            <div key={title} className="flex flex-col items-center">
              <div className={`h-20 w-20 ${shape} shadow-xl`} />
              <h3 className="mt-4 text-2xl font-extrabold">{title}</h3>
              <p className="text-sm opacity-90">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seleccione su experiencia */}
      <section className="bg-brand-mint px-4 py-14 text-center">
        <h2 className="text-2xl font-extrabold">Seleccione su experiencia</h2>
        <p className="text-sm">Libros, talleres, materiales y más.</p>
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          {experiences.map(({ icon: Icon, title, description, className }) => (
            <div key={title} className={`flex flex-col items-center rounded-2xl p-6 ${className}`}>
              <Icon className="h-12 w-12" strokeWidth={2.5} aria-hidden="true" />
              <h3 className="mt-3 font-sans text-sm font-extrabold uppercase">{title}</h3>
              <p className="mt-1 text-xs">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Opiniones */}
      <section className="bg-brand-yellow px-4 py-12 text-center">
        <h2 className="text-2xl font-extrabold text-brand-pink">— Lo que opinan las familias —</h2>
        <div className="mx-auto mt-8 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map(([quote, author]) => (
            <div key={author} className="rounded-2xl bg-background p-5 text-sm">
              <p>{quote}</p>
              <div className="mt-3 flex justify-center gap-0.5 text-brand-pink">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">— {author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <div className="bg-brand-blue text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 text-sm font-bold md:flex-row">
          <span>Libros, talleres y materiales para jugar, crear y aprender</span>
          <Pill variant="white" href="/libros/inseparables">
            Conocer Inseparables
          </Pill>
          <span className="flex items-center gap-2">
            Envíos a todo México <Truck className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </>
  );
}
