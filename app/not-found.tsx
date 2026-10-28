import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-extrabold text-brand-ink md:text-4xl">
          Esta página no está. Los estantes sí.
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/estantes"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-pink px-5 py-2 text-sm font-bold text-primary-foreground transition hover:brightness-110"
          >
            Ver los libros
          </Link>
          <Link
            href="/cinco-preguntas"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-border bg-background px-5 py-2 text-sm font-bold text-foreground transition hover:border-brand-pink"
          >
            Descargar las cinco preguntas
          </Link>
        </div>
      </div>
    </div>
  );
}
