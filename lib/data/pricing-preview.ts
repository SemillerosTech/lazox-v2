import type { Book } from "@/lib/types";

import { findBookBySlug } from "./books";

/**
 * Libro de prueba para revisar los dos precios sin publicar un producto nuevo.
 * Usa el contenido ya aprobado de Inseparables y solo cambia los campos de
 * precio. No forma parte del catálogo ni del carrito.
 */
export function getPriceLibrePreviewBook(): Book | undefined {
  const base = findBookBySlug("inseparables");
  if (!base) return undefined;

  return {
    ...base,
    id: "revision-precios",
    slug: "revision-precios",
    priceMode: "libre",
    printedAt: "2020-01-01",
  };
}
