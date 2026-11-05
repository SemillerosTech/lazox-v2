import { getCatalogSource } from "@/lib/shopify/config";

import { localDraftCatalog } from "./local-draft";
import { shopifyCatalog } from "./shopify";
import type { CatalogRepository } from "./types";

export type { CatalogRepository } from "./types";

/**
 * Selección explícita de la fuente de catálogo.
 *
 * No hay fallback silencioso: si LAZOX_CATALOG_SOURCE=shopify y la
 * configuración falta, el error se propaga. Si la fuente es local-draft, los
 * datos viven en lib/data y la compra es de demostración.
 */
export const catalogSource = getCatalogSource();

export const catalog: CatalogRepository =
  catalogSource === "shopify" ? shopifyCatalog : localDraftCatalog;
