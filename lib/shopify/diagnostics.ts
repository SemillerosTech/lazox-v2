import "server-only";

import { indexGuideSlugs, type GuideSlugIssue } from "./guide-slugs";

import { shopifyFetch } from "./client";
import {
  getShopifyConfig,
  isCartEnabled,
  isCheckoutEnabled,
  isShopifyConfigured,
  type CatalogSource,
} from "./config";
import { mapShelf } from "./mappers";
import {
  GUIDE_FIELD_KEYS,
  HOMEPAGE_FIELD_KEYS,
  METAOBJECT_TYPES,
  RECOMMENDATION_FIELD_KEYS,
  type MetaobjectFieldKey,
} from "./metaobject-fields";
import {
  GUIDES_QUERY,
  HOMEPAGE_CONTENT_QUERY,
  RECOMMENDATIONS_QUERY,
  SHELVES_QUERY,
  SHELF_METAFIELD_IDENTIFIERS,
} from "./queries";
import type {
  ShopifyCollection,
  ShopifyConnection,
  ShopifyMetaobject,
  ShopifyPageInfo,
} from "./types";

const SHOP_INFO_QUERY = /* GraphQL */ `
  query ShopInfo {
    shop {
      name
      primaryDomain {
        host
      }
    }
  }
`;

const PAGE_SIZE = 50;

export interface ShopifyConnectionDiagnostic {
  ok: boolean;
  shopName?: string;
  shopHost?: string;
  error?: string;
}

export function describeDiagnosticError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return "Error desconocido.";
}

export async function checkShopifyConnection(): Promise<ShopifyConnectionDiagnostic> {
  try {
    const data = await shopifyFetch<{
      shop: { name: string; primaryDomain: { host: string } };
    }>({ query: SHOP_INFO_QUERY, operationName: "ShopInfo" });

    return {
      ok: true,
      shopName: data.shop.name,
      shopHost: data.shop.primaryDomain.host,
    };
  } catch (error) {
    return { ok: false, error: describeDiagnosticError(error) };
  }
}

async function fetchAllCollections(): Promise<ShopifyCollection[]> {
  const collections: ShopifyCollection[] = [];
  let after: string | null = null;

  do {
    const data = await shopifyFetch<{
      collections: ShopifyConnection<ShopifyCollection>;
    }>({
      query: SHELVES_QUERY,
      variables: {
        first: PAGE_SIZE,
        after,
        shelfIdentifiers: SHELF_METAFIELD_IDENTIFIERS,
      },
      operationName: "Shelves",
    });

    collections.push(...data.collections.nodes);
    const pageInfo: ShopifyPageInfo = data.collections.pageInfo;
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  return collections;
}

export interface ShelfDiagnostic {
  totalCollections: number;
  mappedShelves: number;
  codes: string[];
  orders: number[];
  missingCode: string[];
  missingOrder: string[];
  invalidCodes: Array<{ handle: string; value: string }>;
  duplicateCodes: string[];
  duplicateOrders: number[];
  missingOrderSequence: number[];
}

export async function getShelfDiagnostics(): Promise<ShelfDiagnostic> {
  const collections = await fetchAllCollections();
  const shelves = collections.map(mapShelf).filter((shelf) => shelf !== null);
  const codes = shelves.map((shelf) => shelf.code);
  const orders = shelves.map((shelf) => shelf.order);

  const missingCode: string[] = [];
  const missingOrder: string[] = [];
  const invalidCodes: Array<{ handle: string; value: string }> = [];

  for (const collection of collections) {
    const fields = new Map(
      (collection.metafields ?? [])
        .filter((field): field is NonNullable<typeof field> => Boolean(field))
        .map((field) => [field.key, field.value ?? ""]),
    );
    const code = fields.get("estante_codigo")?.trim();
    const order = fields.get("estante_orden")?.trim();

    if (!code) missingCode.push(collection.handle);
    else if (!/^EST-(0[1-9]|10)$/.test(code.toUpperCase())) {
      invalidCodes.push({ handle: collection.handle, value: code });
    }

    if (!order) missingOrder.push(collection.handle);
  }

  const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
  const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
  const expectedOrders = Array.from({ length: 10 }, (_, index) => index + 1);

  return {
    totalCollections: collections.length,
    mappedShelves: shelves.length,
    codes,
    orders,
    missingCode,
    missingOrder,
    invalidCodes,
    duplicateCodes: [...new Set(duplicateCodes)],
    duplicateOrders: [...new Set(duplicateOrders)],
    missingOrderSequence: expectedOrders.filter((order) => !orders.includes(order)),
  };
}

export interface MetaobjectKeysDiagnostic {
  type: string;
  configured: Record<string, MetaobjectFieldKey>;
  guideSlugIssues?: GuideSlugIssue[];
  entries: Array<{
    handle: string;
    keys: Array<{ key: string; type: string; hasValue: boolean }>;
  }>;
  error?: string;
}

function configuredKeysFor(type: string): Record<string, MetaobjectFieldKey> {
  if (type === METAOBJECT_TYPES.guide) return { ...GUIDE_FIELD_KEYS };
  if (type === METAOBJECT_TYPES.recommendation) return { ...RECOMMENDATION_FIELD_KEYS };
  return { ...HOMEPAGE_FIELD_KEYS };
}

function describeMetaobject(metaobject: ShopifyMetaobject) {
  return {
    handle: metaobject.handle,
    keys: metaobject.fields.map((field) => ({
      key: field.key,
      type: field.type,
      hasValue: Boolean(field.value?.trim()) || Boolean(field.reference),
    })),
  };
}

async function fetchAllMetaobjects(query: string, operationName: string) {
  const metaobjects: ShopifyMetaobject[] = [];
  let after: string | null = null;

  do {
    const data = await shopifyFetch<{
      metaobjects: ShopifyConnection<ShopifyMetaobject>;
    }>({
      query,
      variables: { first: PAGE_SIZE, after },
      operationName,
    });

    metaobjects.push(...data.metaobjects.nodes);
    const pageInfo: ShopifyPageInfo = data.metaobjects.pageInfo;
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  return metaobjects;
}

export async function getMetaobjectKeysDiagnostics(): Promise<MetaobjectKeysDiagnostic[]> {
  const results: MetaobjectKeysDiagnostic[] = [];

  for (const [type, query, operationName] of [
    [METAOBJECT_TYPES.guide, GUIDES_QUERY, "Guides"],
    [METAOBJECT_TYPES.recommendation, RECOMMENDATIONS_QUERY, "Recommendations"],
  ] as const) {
    try {
      const entries = await fetchAllMetaobjects(query, operationName);
      results.push({
        type,
        configured: configuredKeysFor(type),
        entries: entries.map(describeMetaobject),
        ...(type === METAOBJECT_TYPES.guide
          ? { guideSlugIssues: indexGuideSlugs(entries).issues }
          : {}),
      });
    } catch (error) {
      results.push({
        type,
        configured: configuredKeysFor(type),
        entries: [],
        error: describeDiagnosticError(error),
      });
    }
  }

  try {
    const data = await shopifyFetch<{ metaobject: ShopifyMetaobject | null }>({
      query: HOMEPAGE_CONTENT_QUERY,
      operationName: "HomepageContent",
    });

    results.push({
      type: METAOBJECT_TYPES.homepage,
      configured: configuredKeysFor(METAOBJECT_TYPES.homepage),
      entries: data.metaobject ? [describeMetaobject(data.metaobject)] : [],
    });
  } catch (error) {
    results.push({
      type: METAOBJECT_TYPES.homepage,
      configured: configuredKeysFor(METAOBJECT_TYPES.homepage),
      entries: [],
      error: describeDiagnosticError(error),
    });
  }

  return results;
}

export interface ShopifyDiagnostics {
  source: CatalogSource;
  configured: boolean;
  storeDomain?: string;
  apiVersion?: string;
  cartEnabled: boolean;
  checkoutEnabled: boolean;
  connection: ShopifyConnectionDiagnostic;
  shelves?: ShelfDiagnostic;
  shelvesError?: string;
  metaobjects: MetaobjectKeysDiagnostic[];
}

export async function getShopifyDiagnostics(): Promise<ShopifyDiagnostics> {
  const configured = isShopifyConfigured();
  let storeDomain: string | undefined;
  let apiVersion: string | undefined;

  if (configured) {
    try {
      const config = getShopifyConfig();
      storeDomain = config.storeDomain;
      apiVersion = config.apiVersion;
    } catch {
      // La comprobación de configuración ya reportó el problema.
    }
  }

  const base: ShopifyDiagnostics = {
    source: "shopify",
    configured,
    ...(storeDomain ? { storeDomain } : {}),
    ...(apiVersion ? { apiVersion } : {}),
    cartEnabled: isCartEnabled(),
    checkoutEnabled: isCheckoutEnabled(),
    connection: configured
      ? await checkShopifyConnection()
      : { ok: false, error: "Falta configuración de Shopify." },
    metaobjects: [],
  };

  if (!configured || !base.connection.ok) return base;

  try {
    base.shelves = await getShelfDiagnostics();
  } catch (error) {
    base.shelvesError = describeDiagnosticError(error);
  }

  try {
    base.metaobjects = await getMetaobjectKeysDiagnostics();
  } catch (error) {
    base.metaobjects = [
      {
        type: "metaobjetos",
        configured: {},
        entries: [],
        error: describeDiagnosticError(error),
      },
    ];
  }

  return base;
}
