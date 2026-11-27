import Image from "next/image";

import { ButtonLink } from "@/components/button-link";

export function NotFoundContent() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <h1
          aria-label="Error 404"
          className="font-display text-[clamp(6rem,24vw,11rem)] font-extrabold leading-none tracking-tight text-brand-ink"
        >
          404
        </h1>
        <Image
          src="/images/yelly-surprise.svg"
          alt="Personaje amarillo con expresión de sorpresa."
          width={263}
          height={518}
          priority
          className="h-44 w-auto shrink-0 sm:h-60"
        />
      </div>
      <h2 className="mt-8 text-3xl font-extrabold text-brand-ink md:text-4xl">
        Esta página no está. Los estantes sí.
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/estantes">Ver los libros</ButtonLink>
        <ButtonLink href="/cinco-preguntas" variant="outline">
          Descargar las cinco preguntas
        </ButtonLink>
      </div>
    </section>
  );
}
