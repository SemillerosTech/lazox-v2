"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              No pudimos cargar esta página
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Algo salió mal de nuestro lado. Intenta recargar o volver al inicio.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Intentar de nuevo
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders without the app router */}
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
