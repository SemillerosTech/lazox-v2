import "server-only";

import type { Book, EditorialRecommendation, Guide, HomepageContent, Shelf } from "@/lib/types";

import { shopifyFetch, type ShopifyFetchOptions } from "@/lib/shopify/client";
import { getBuyerIp } from "@/lib/shopify/request";
import {
  mapGuide,
  mapHomepageContent,
  mapProduct,
  mapRecommendation,
  mapShelf,
} from "@/lib/shopify/mappers";
import { APPROVED_RECOMMENDATION_STATUSES } from "@/lib/shopify/metaobject-fields";
import {
  COLLECTION_PRODUCTS_QUERY,
  GUIDE_BY_HANDLE_QUERY,
  GUIDES_QUERY,
  HOMEPAGE_CONTENT_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCT_METAFIELD_IDENTIFIERS,
  RECOMMENDATIONS_QUERY,
  SHELVES_QUERY,
  SHELF_METAFIELD_IDENTIFIERS,
} from "@/lib/shopify/queries";
import type {
  ShopifyCollection,
  ShopifyConnection,
  ShopifyMetaobject,
  ShopifyPageInfo,
  ShopifyProduct,
} from "@/lib/shopify/types";

import type { CatalogRepository } from "./types";

const PAGE_SIZE = 50;
const MAX_PAGES = 20;

async function read<T>(options: ShopifyFetchOptions): Promise<T> {
  const buyerIp = await getBuyerIp();
  return shopifyFetch<T>({ ...options, buyerIp });
}

async function collectConnection<T>(
  load: (after: string | null) => Promise<ShopifyConnection<T>>,
): Promise<T[]> {
  const items: T[] = [];
  let after: string | null = null;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const connection = await load(after);
    items.push(...connection.nodes);
    const pageInfo: ShopifyPageInfo = connection.pageInfo;
    if (!pageInfo.hasNextPage) break;
    after = pageInfo.endCursor;
    if (!after) break;
  }

  return items;
}

async function fetchAllShelves(): Promise<Shelf[]> {
  const collections = await collectConnection<ShopifyCollection>((after) =>
    read<{ collections: ShopifyConnection<ShopifyCollection> }>({
      query: SHELVES_QUERY,
      variables: {
        first: PAGE_SIZE,
        after,
        shelfIdentifiers: SHELF_METAFIELD_IDENTIFIERS,
      },
      operationName: "Shelves",
    }).then((data) => data.collections),
  );

  const shelves = collections
    .map(mapShelf)
    .filter((shelf): shelf is Shelf => shelf !== null)
    .sort((a, b) => a.order - b.order);

  // Un código duplicado no debe romper las rutas. El diagnóstico interno lo
  // reporta; aquí se conserva la primera aparición.
  const seen = new Set<string>();
  return shelves.filter((shelf) => {
    if (seen.has(shelf.code)) return false;
    seen.add(shelf.code);
    return true;
  });
}

async function fetchCollectionProducts(collectionId: string): Promise<Book[]> {
  const products = await collectConnection<ShopifyProduct>((after) =>
    read<{ collection: { products: ShopifyConnection<ShopifyProduct> } | null }>({
      query: COLLECTION_PRODUCTS_QUERY,
      variables: {
        id: collectionId,
        first: PAGE_SIZE,
        after,
        identifiers: PRODUCT_METAFIELD_IDENTIFIERS,
      },
      operationName: "CollectionProducts",
    }).then(
      (data) =>
        data.collection?.products ?? {
          pageInfo: { hasNextPage: false, endCursor: null },
          nodes: [],
        },
    ),
  );

  return products.map(mapProduct).filter((book): book is Book => book !== null);
}

async function fetchAllMetaobjects(
  query: string,
  operationName: string,
): Promise<ShopifyMetaobject[]> {
  return collectConnection<ShopifyMetaobject>((after) =>
    read<{ metaobjects: ShopifyConnection<ShopifyMetaobject> }>({
      query,
      variables: { first: PAGE_SIZE, after },
      operationName,
    }).then((data) => data.metaobjects),
  );
}

function dedupeBooks(books: Book[]): Book[] {
  const seen = new Set<string>();
  return books.filter((book) => {
    if (seen.has(book.slug)) return false;
    seen.add(book.slug);
    return true;
  });
}

function dedupeGuides(guides: Guide[]): Guide[] {
  const seen = new Set<string>();
  return guides.filter((guide) => {
    if (!guide.slug || seen.has(guide.slug)) return false;
    seen.add(guide.slug);
    return true;
  });
}

async function mapGuideWithBook(metaobject: ShopifyMetaobject): Promise<Guide | null> {
  const initial = mapGuide(metaobject);
  if (!initial) return null;

  const book = initial.bookSlug ? await shopifyGetBook(initial.bookSlug) : null;
  return mapGuide(metaobject, book);
}

async function shopifyGetBook(slug: string): Promise<Book | null> {
  const data = await read<{ product: ShopifyProduct | null }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle: slug, identifiers: PRODUCT_METAFIELD_IDENTIFIERS },
    operationName: "ProductByHandle",
  });

  return data.product ? mapProduct(data.product) : null;
}

export const shopifyCatalog: CatalogRepository = {
  async listBooks() {
    const shelves = await fetchAllShelves();
    const collections = shelves
      .map((shelf) => shelf.shopifyCollectionId)
      .filter((id): id is string => Boolean(id));

    const books = await Promise.all(collections.map(fetchCollectionProducts));
    return dedupeBooks(books.flat());
  },

  async listGuides() {
    const metaobjects = await fetchAllMetaobjects(GUIDES_QUERY, "Guides");
    const guides = await Promise.all(metaobjects.map(mapGuideWithBook));

    return dedupeGuides(guides.filter((guide): guide is Guide => guide !== null));
  },

  async listShelves() {
    return fetchAllShelves();
  },

  async getShelf(slug) {
    const code = slug.trim().toUpperCase();
    const shelves = await fetchAllShelves();
    return shelves.find((shelf) => shelf.code === code) ?? null;
  },

  async getShelfByCode(code) {
    const normalized = code.trim().toUpperCase();
    const shelves = await fetchAllShelves();
    return shelves.find((shelf) => shelf.code === normalized) ?? null;
  },

  async listBooksByShelf(shelfCode) {
    const shelf = await shopifyCatalog.getShelfByCode(shelfCode);
    if (!shelf?.shopifyCollectionId) return [];
    return fetchCollectionProducts(shelf.shopifyCollectionId);
  },

  async getBook(slug) {
    return shopifyGetBook(slug);
  },

  async getGuide(slug) {
    const data = await read<{ metaobject: ShopifyMetaobject | null }>({
      query: GUIDE_BY_HANDLE_QUERY,
      variables: { handle: slug },
      operationName: "GuideByHandle",
    });

    if (!data.metaobject) return null;
    return mapGuideWithBook(data.metaobject);
  },

  async getGuideForBook(bookSlug) {
    const book = await shopifyGetBook(bookSlug);
    if (!book?.guideSlug) return null;
    return shopifyCatalog.getGuide(book.guideSlug);
  },

  async getRecommendation(shelfCode) {
    const recommendations = await shopifyCatalog.getApprovedRecommendations("catalog", shelfCode);
    return recommendations[0] ?? null;
  },

  async getApprovedRecommendations(location, shelfCode) {
    if (APPROVED_RECOMMENDATION_STATUSES.size === 0) return [];

    const metaobjects = await fetchAllMetaobjects(RECOMMENDATIONS_QUERY, "Recommendations");
    const recommendations = metaobjects
      .map(mapRecommendation)
      .filter((recommendation): recommendation is EditorialRecommendation => {
        if (!recommendation || recommendation.status !== "confirmed") return false;
        if (shelfCode && recommendation.shelfCode !== shelfCode) return false;
        if (!location) return true;
        return recommendation.location?.trim().toLowerCase() === location.trim().toLowerCase();
      });

    return recommendations;
  },

  async getHomepageContent(): Promise<HomepageContent | null> {
    const data = await read<{ metaobject: ShopifyMetaobject | null }>({
      query: HOMEPAGE_CONTENT_QUERY,
      operationName: "HomepageContent",
    });

    return mapHomepageContent(data.metaobject);
  },
};
