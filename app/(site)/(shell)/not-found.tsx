import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-brand-ink md:text-4xl">
        Esta página no está. Los estantes sí.
      </h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/estantes">Ver los libros</ButtonLink>
        <ButtonLink href="/cinco-preguntas" variant="outline">
          Descargar las cinco preguntas
        </ButtonLink>
      </div>
    </div>
  );
}
