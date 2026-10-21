import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-brand-pink">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que busca no existe o fue movida.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/estantes"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-pink px-5 py-2 text-sm font-bold text-primary-foreground transition hover:brightness-110"
          >
            Ver los estantes
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-border bg-background px-5 py-2 text-sm font-bold text-foreground transition hover:border-brand-pink"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
