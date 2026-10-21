import type { MetadataRoute } from "next";

import { books } from "@/lib/data/books";
import { shelves } from "@/lib/data/shelves";

/**
 * Solo rutas públicas. Las páginas privadas de demostración quedan fuera.
 * Se activa cuando NEXT_PUBLIC_SITE_URL esté configurado.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) return [];

  const paths = [
    "/",
    "/estantes",
    ...shelves.map((shelf) => `/estantes/${shelf.slug}`),
    ...books.map((book) => `/libros/${book.slug}`),
  ];

  return paths.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: new Date(),
  }));
}
