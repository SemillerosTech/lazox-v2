import type { Book, EditorialRecommendation, Guide, Shelf } from "@/lib/types";

import { findBookBySlug } from "../data/books";
import { findGuideByBookSlug, findGuideBySlug } from "../data/guides";
import { findRecommendation } from "../data/recommendations";
import { findShelfBySlug, shelves } from "../data/shelves";

/**
 * Contrato de catálogo independiente de la fuente de datos.
 *
 * Hoy se resuelve con datos locales; mañana puede implementarse con
 * Shopify Storefront API sin cambiar las páginas ni los componentes.
 */
export interface CatalogRepository {
  listShelves(): Promise<Shelf[]>;
  getShelf(slug: string): Promise<Shelf | null>;
  listBooksByShelf(shelfCode: string): Promise<Book[]>;
  getBook(slug: string): Promise<Book | null>;
  getGuide(slug: string): Promise<Guide | null>;
  getGuideForBook(bookSlug: string): Promise<Guide | null>;
  getRecommendation(shelfCode: string): Promise<EditorialRecommendation | null>;
}

export const localCatalog: CatalogRepository = {
  async listShelves() {
    return [...shelves].sort((a, b) => a.order - b.order);
  },

  async getShelf(slug) {
    return findShelfBySlug(slug) ?? null;
  },

  async listBooksByShelf(shelfCode) {
    const shelf = shelves.find((item) => item.code === shelfCode);
    if (!shelf) return [];
    return shelf.bookSlugs
      .map((slug) => findBookBySlug(slug))
      .filter((book): book is Book => book !== undefined);
  },

  async getBook(slug) {
    return findBookBySlug(slug) ?? null;
  },

  async getGuide(slug) {
    return findGuideBySlug(slug) ?? null;
  },

  async getGuideForBook(bookSlug) {
    return findGuideByBookSlug(bookSlug) ?? null;
  },

  async getRecommendation(shelfCode) {
    return findRecommendation(shelfCode) ?? null;
  },
};

export const catalog: CatalogRepository = localCatalog;
