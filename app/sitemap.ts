import type { MetadataRoute } from "next";

import { catalog } from "@/lib/catalog";

/**
 * Solo rutas públicas. Las páginas privadas de demostración quedan fuera.
 * Se activa cuando NEXT_PUBLIC_SITE_URL esté configurado.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) return [];

  const [shelves, books, guides] = await Promise.all([
    catalog.listShelves(),
    catalog.listBooks(),
    catalog.listGuides(),
  ]);

  const paths = [
    "/",
    "/estantes",
    ...shelves.map((shelf) => `/estantes/${shelf.slug}`),
    ...books.map((book) => `/libros/${book.slug}`),
    "/guias",
    ...guides.map((guide) => `/guias/${guide.slug}`),
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

  return paths.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: new Date(),
  }));
}
