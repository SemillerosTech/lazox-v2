import type { Book, HomepageContent } from "@/lib/types";

import { books, findBookBySlug } from "../data/books";
import { findGuideByBookSlug, findGuideBySlug, guides } from "../data/guides";
import { findRecommendation } from "../data/recommendations";
import { findShelfBySlug, shelves } from "../data/shelves";
import type { CatalogRepository } from "./types";

/**
 * Copia local identificada como borrador.
 *
 * Es el modo predeterminado mientras el catálogo real no está publicado en
 * Shopify. No simula una respuesta de Shopify ni permite compras reales.
 */
export const localDraftCatalog: CatalogRepository = {
  async listBooks() {
    return [...books];
  },

  async listGuides() {
    return [...guides];
  },

  async listShelves() {
    return [...shelves].sort((a, b) => a.order - b.order);
  },

  async getShelf(slug) {
    return findShelfBySlug(slug) ?? null;
  },

  async getShelfByCode(code) {
    return shelves.find((shelf) => shelf.code === code) ?? null;
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

  async getApprovedRecommendations(_location, shelfCode) {
    // La única recomendación local es provisional y no debe mostrarse.
    const recommendation = shelfCode ? findRecommendation(shelfCode) : undefined;
    return recommendation?.status === "confirmed" ? [recommendation] : [];
  },

  async getHomepageContent(): Promise<HomepageContent> {
    return {
      id: "local-draft-global",
      shelfPrefix: "Para el niño o la niña que…",
    };
  },
};
