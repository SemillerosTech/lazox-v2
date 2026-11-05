import type { MetadataRoute } from "next";

import { catalog } from "@/lib/catalog";

/**
 * Solo rutas públicas. Las páginas privadas de demostración quedan fuera.
 * Se activa cuando NEXT_PUBLIC_SITE_URL esté configurado.
 *
 * El sitemap depende del catálogo activo, así que se genera en cada petición.
 * Si Shopify falla, se conservan las rutas fijas para no tumbar el archivo.
 */
export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/estantes",
  "/guias",
  "/cinco-preguntas",
  "/trazaurus",
  "/para-escuelas",
  "/nosotros",
  "/que-es-silee",
  "/lo-que-esta-casa-promete",
  "/envios",
  "/devoluciones",
  "/factura",
  "/preguntas-frecuentes",
  "/privacidad",
  "/terminos",
];

async function catalogPaths(): Promise<string[]> {
  try {
    const [shelves, books, guides] = await Promise.all([
      catalog.listShelves(),
      catalog.listBooks(),
      catalog.listGuides(),
    ]);

    return [
      ...shelves.map((shelf) => `/estantes/${shelf.slug}`),
      ...books.map((book) => `/libros/${book.slug}`),
      ...guides.map((guide) => `/guias/${guide.slug}`),
    ];
  } catch {
    // Un catálogo caído no debe romper el sitemap. Se reporta en el
    // diagnóstico interno (/revision/catalogo), no aquí.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) return [];

  const paths = [...STATIC_PATHS, ...(await catalogPaths())];
  const lastModified = new Date();

  return paths.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified,
  }));
}
