import type { Book, EditorialRecommendation, Guide, HomepageContent, Shelf } from "@/lib/types";

/**
 * Contrato de catálogo independiente de la fuente de datos.
 *
 * `catalog` (lib/catalog/index.ts) elige explícitamente entre `local-draft` y
 * `shopify`. Las páginas y componentes no conocen el origen.
 */
export interface CatalogRepository {
  listBooks(): Promise<Book[]>;
  listGuides(): Promise<Guide[]>;
  listShelves(): Promise<Shelf[]>;
  getShelf(slug: string): Promise<Shelf | null>;
  getShelfByCode(code: string): Promise<Shelf | null>;
  listBooksByShelf(shelfCode: string): Promise<Book[]>;
  getBook(slug: string): Promise<Book | null>;
  getGuide(slug: string): Promise<Guide | null>;
  getGuideForBook(bookSlug: string): Promise<Guide | null>;
  getRecommendation(shelfCode: string): Promise<EditorialRecommendation | null>;
  getApprovedRecommendations(
    location: string,
    shelfCode?: string,
  ): Promise<EditorialRecommendation[]>;
  getHomepageContent(): Promise<HomepageContent | null>;
}
