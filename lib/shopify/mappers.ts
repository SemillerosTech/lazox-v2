import "server-only";

import sanitizeHtml from "sanitize-html";

import type {
  Book,
  BookPrice,
  Currency,
  EditorialRecommendation,
  Guide,
  HomepageContent,
  Shelf,
} from "@/lib/types";

import {
  APPROVED_RECOMMENDATION_STATUSES,
  GUIDE_ATTRIBUTION,
  GUIDE_FIELD_KEYS,
  HOMEPAGE_FIELD_KEYS,
  RECOMMENDATION_FIELD_KEYS,
  SHELF_CODE_PATTERN,
  readMetaobjectField,
} from "./metaobject-fields";
import type {
  ShopifyCollection,
  ShopifyImage,
  ShopifyMetaobject,
  ShopifyMetafield,
  ShopifyMoney,
  ShopifyProduct,
  ShopifyReference,
  ShopifyVariant,
} from "./types";

const RICH_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "a",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel"],
    span: [],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, rel: "noopener noreferrer" },
    }),
  },
  disallowedTagsMode: "discard",
};

/** HTML controlado por Shopify, saneado antes de llegar al navegador. */
export function sanitizeRichHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, RICH_HTML_OPTIONS).trim();
}

export function plainTextFromHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}

/** Convierte el monto decimal de Shopify a centavos sin punto flotante. */
export function moneyToCents(amount: string): number | null {
  const match = /^(-?)(\d+)(?:\.(\d{1,}))?$/.exec(amount.trim());
  if (!match) return null;

  const sign = match[1] === "-" ? -1 : 1;
  const whole = Number(match[2]);
  const fraction = (match[3] ?? "").padEnd(2, "0").slice(0, 2);

  if (!Number.isSafeInteger(whole)) return null;

  return sign * (whole * 100 + Number(fraction));
}

export function mapMoney(money: ShopifyMoney | null | undefined): BookPrice | null {
  if (!money) return null;
  const amount = moneyToCents(money.amount);
  if (amount === null) return null;

  return { amount, currency: money.currencyCode as Currency };
}

function metafieldMap(
  metafields: Array<ShopifyMetafield | null> | null | undefined,
): Map<string, ShopifyMetafield> {
  const map = new Map<string, ShopifyMetafield>();

  for (const metafield of metafields ?? []) {
    if (!metafield) continue;
    map.set(`${metafield.namespace}.${metafield.key}`, metafield);
  }

  return map;
}

function readMetafield(
  map: Map<string, ShopifyMetafield>,
  key: string,
): ShopifyMetafield | undefined {
  return map.get(`lazox.${key}`);
}

function readText(map: Map<string, ShopifyMetafield>, key: string): string | undefined {
  const value = readMetafield(map, key)?.value?.trim();
  return value ? value : undefined;
}

function readInteger(map: Map<string, ShopifyMetafield>, key: string): number | undefined {
  const value = readText(map, key);
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readReference(
  map: Map<string, ShopifyMetafield>,
  key: string,
): ShopifyReference | undefined {
  return readMetafield(map, key)?.reference ?? undefined;
}

function readReferences(map: Map<string, ShopifyMetafield>, key: string): ShopifyReference[] {
  return readMetafield(map, key)?.references?.nodes ?? [];
}

function normalizeShelfCode(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  return SHELF_CODE_PATTERN.test(normalized) ? normalized : undefined;
}

function shelfCodeFromHandle(handle: string | null | undefined): string | undefined {
  if (!handle) return undefined;
  const match = /^est-(\d{2})$/i.exec(handle);
  if (!match) return undefined;
  return normalizeShelfCode(`EST-${match[1]}`);
}

function imageFields(image: ShopifyImage | null | undefined): {
  coverImage?: string;
  coverImageAlt?: string;
} {
  if (!image?.url) return {};
  return {
    coverImage: image.url,
    ...(image.altText ? { coverImageAlt: image.altText } : {}),
  };
}

function weightInGrams(variant: ShopifyVariant): number | null {
  if (variant.weight === null || variant.weight === undefined) return null;

  const factor = {
    GRAMS: 1,
    KILOGRAMS: 1000,
    OUNCES: 28.3495,
    POUNDS: 453.592,
  }[variant.weightUnit?.toUpperCase() ?? "GRAMS"];

  if (!factor) return null;
  return Math.round(variant.weight * factor);
}

/**
 * El modo Shopify no calcula la condición de precio con la fecha del colofón.
 * Solo usa `lazox.condicion_precio`; si falta, el valor seguro es "single".
 * Los dos precios siguen apagados para el público.
 */
function priceModeFromCondition(condition: string | undefined): "single" | "libre" {
  return condition && /libre/i.test(condition) ? "libre" : "single";
}

export function mapProduct(product: ShopifyProduct): Book | null {
  const variant = product.variants.nodes[0];
  if (!variant) return null;

  const price = mapMoney(variant.price) ?? mapMoney(product.priceRange.minVariantPrice);
  if (!price) return null;

  const fields = metafieldMap(product.metafields);
  const descriptionHtml = sanitizeRichHtml(product.descriptionHtml);
  const shelfCode = normalizeShelfCode(readText(fields, "estante_principal_codigo"));
  const guideReference = readReference(fields, "guia");
  const neighborReference = readReference(fields, "libro_vecino");
  const neighborReason = readText(fields, "libro_vecino_motivo");
  const neighborShelfCodes = readReferences(fields, "estantes_vecinos")
    .map((reference) => shelfCodeFromHandle(reference.handle))
    .filter((code): code is string => Boolean(code));

  const book: Book = {
    id: product.handle,
    slug: product.handle,
    title: product.title,
    author: readText(fields, "autora") ?? "",
    price,
    ageSuggestion: readText(fields, "edad_sugerida") ?? "",
    synopsis: plainTextFromHtml(product.descriptionHtml) || product.description,
    conversationQuestion: readText(fields, "pregunta_conversar") ?? "",
    status: "published",
    ...(readText(fields, "ilustradora") ? { illustrator: readText(fields, "ilustradora") } : {}),
    ...(readText(fields, "traductor") ? { translator: readText(fields, "traductor") } : {}),
    ...(readText(fields, "editorial") ? { publisher: readText(fields, "editorial") } : {}),
    ...(readInteger(fields, "anio") !== undefined ? { year: readInteger(fields, "anio") } : {}),
    ...(readText(fields, "isbn") ? { isbn: readText(fields, "isbn") } : {}),
    ...(readInteger(fields, "paginas") !== undefined
      ? { pages: readInteger(fields, "paginas") }
      : {}),
    ...(shelfCode ? { shelfCode } : {}),
    ...(descriptionHtml ? { descriptionHtml } : {}),
    ...(readText(fields, "para_quien") ? { forWhom: readText(fields, "para_quien") } : {}),
    ...(readText(fields, "regla_conversacion")
      ? { conversationRule: readText(fields, "regla_conversacion") }
      : {}),
    ...imageFields(product.featuredImage),
    ...(guideReference?.__typename === "Metaobject" && guideReference.handle
      ? { guideSlug: guideReference.handle }
      : {}),
    ...(variant.sku ? { sku: variant.sku } : {}),
    shopifyProductId: product.id,
    variantId: variant.id,
    ...(variant.title ? { variantTitle: variant.title } : {}),
    weightGrams: weightInGrams(variant),
    inventoryQuantity: null,
    ...(readText(fields, "condicion_precio")
      ? { priceCondition: readText(fields, "condicion_precio") }
      : {}),
    ...(readText(fields, "estado_libro") ? { bookStatus: readText(fields, "estado_libro") } : {}),
    ...(readText(fields, "colofon_origen")
      ? { colophonOrigin: readText(fields, "colofon_origen") }
      : {}),
    ...(readText(fields, "colofon_fecha") ? { printedAt: readText(fields, "colofon_fecha") } : {}),
    priceMode: priceModeFromCondition(readText(fields, "condicion_precio")),
    availability:
      product.availableForSale && variant.availableForSale ? "available" : "out_of_stock",
    ...(neighborReference?.__typename === "Product" && neighborReference.handle
      ? {
          neighborBook: {
            title: neighborReference.title ?? "",
            slug: neighborReference.handle,
            ...(neighborReason ? { reason: neighborReason } : {}),
          },
        }
      : {}),
    ...(neighborShelfCodes.length > 0 ? { neighborShelfCodes } : {}),
  };

  return book;
}

export function mapShelf(collection: ShopifyCollection): Shelf | null {
  const fields = metafieldMap(collection.metafields);
  const code = normalizeShelfCode(readText(fields, "estante_codigo"));
  const order = readInteger(fields, "estante_orden");

  if (!code || order === undefined) return null;

  const descriptionHtml = sanitizeRichHtml(collection.descriptionHtml);
  const line = collection.description?.trim() || plainTextFromHtml(collection.descriptionHtml);

  return {
    code,
    slug: code.toLowerCase(),
    name: collection.title,
    order,
    bookSlugs: [],
    shopifyCollectionId: collection.id,
    ...(line ? { line } : {}),
    ...(descriptionHtml ? { descriptionHtml } : {}),
  };
}

function referenceUrl(reference: ShopifyReference | null | undefined): string | undefined {
  if (!reference) return undefined;
  if (reference.url) return reference.url;
  if (reference.image?.url) return reference.image.url;
  return undefined;
}

function guideField(
  fields: Array<{ key: string; value: string | null }>,
  key: string | null,
): string | undefined {
  return readMetaobjectField(fields, key) ?? undefined;
}

export function mapGuide(metaobject: ShopifyMetaobject, book?: Book | null): Guide | null {
  const title = guideField(metaobject.fields, GUIDE_FIELD_KEYS.title);
  const contentHtml = sanitizeRichHtml(guideField(metaobject.fields, GUIDE_FIELD_KEYS.content));
  const introHtml = sanitizeRichHtml(guideField(metaobject.fields, GUIDE_FIELD_KEYS.intro));
  const questionsHtml = sanitizeRichHtml(guideField(metaobject.fields, GUIDE_FIELD_KEYS.questions));

  if (!title && !contentHtml) return null;

  const bookReference = GUIDE_FIELD_KEYS.book
    ? metaobject.fields.find((field) => field.key === GUIDE_FIELD_KEYS.book)?.reference
    : undefined;
  const bookSlug =
    bookReference?.__typename === "Product" && bookReference.handle
      ? bookReference.handle
      : (book?.slug ?? "");
  const downloadReference = GUIDE_FIELD_KEYS.download
    ? metaobject.fields.find((field) => field.key === GUIDE_FIELD_KEYS.download)?.reference
    : undefined;
  const downloadUrl = referenceUrl(downloadReference);

  return {
    slug:
      guideField(metaobject.fields, GUIDE_FIELD_KEYS.slug) ?? metaobject.handle ?? book?.slug ?? "",
    bookSlug,
    title: title ?? book?.title ?? "",
    author: book?.author ?? "",
    ...(book?.illustrator ? { illustrator: book.illustrator } : {}),
    ageSuggestion: book?.ageSuggestion ?? "",
    synopsis: book?.synopsis ?? plainTextFromHtml(contentHtml),
    conversationQuestion: book?.conversationQuestion ?? "",
    ...(book?.conversationRule ? { conversationRule: book.conversationRule } : {}),
    ...(book?.descriptionHtml ? { descriptionHtml: book.descriptionHtml } : {}),
    ...(introHtml ? { introHtml } : {}),
    ...(contentHtml ? { contentHtml } : {}),
    ...(questionsHtml ? { questionsHtml } : {}),
    ...(downloadUrl ? { downloadUrl } : {}),
    ...(guideField(metaobject.fields, GUIDE_FIELD_KEYS.credits)
      ? { credits: guideField(metaobject.fields, GUIDE_FIELD_KEYS.credits) }
      : {}),
    ...(guideField(metaobject.fields, GUIDE_FIELD_KEYS.status)
      ? { status: guideField(metaobject.fields, GUIDE_FIELD_KEYS.status) }
      : {}),
    sections: [],
    license: {
      attribution: GUIDE_ATTRIBUTION,
      status: "pending",
    },
  };
}

export function mapHomepageContent(
  metaobject: ShopifyMetaobject | null | undefined,
): HomepageContent | null {
  if (!metaobject) return null;

  const shelfPrefix = guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.shelfPrefix);
  if (!shelfPrefix) return null;

  const contentHtml = sanitizeRichHtml(guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.content));
  const orderValue = guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.order);
  const order = orderValue ? Number.parseInt(orderValue, 10) : undefined;

  return {
    id: guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.identifier) ?? metaobject.handle,
    shelfPrefix,
    ...(guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.title)
      ? { title: guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.title) }
      : {}),
    ...(guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.message)
      ? { message: guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.message) }
      : {}),
    ...(contentHtml ? { contentHtml } : {}),
    ...(order !== undefined && Number.isFinite(order) ? { order } : {}),
    ...(guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.status)
      ? { editorialStatus: guideField(metaobject.fields, HOMEPAGE_FIELD_KEYS.status) }
      : {}),
  };
}

export function mapRecommendation(metaobject: ShopifyMetaobject): EditorialRecommendation | null {
  const bookReference = RECOMMENDATION_FIELD_KEYS.book
    ? metaobject.fields.find((field) => field.key === RECOMMENDATION_FIELD_KEYS.book)?.reference
    : undefined;
  const shelfReference = RECOMMENDATION_FIELD_KEYS.shelf
    ? metaobject.fields.find((field) => field.key === RECOMMENDATION_FIELD_KEYS.shelf)?.reference
    : undefined;

  const bookSlug =
    bookReference?.__typename === "Product" && bookReference.handle
      ? bookReference.handle
      : undefined;
  const shelfCode =
    normalizeShelfCode(guideField(metaobject.fields, RECOMMENDATION_FIELD_KEYS.shelf)) ??
    shelfCodeFromHandle(shelfReference?.handle);

  if (!bookSlug || !shelfCode) return null;

  const statusValue = guideField(metaobject.fields, RECOMMENDATION_FIELD_KEYS.status);
  const approved = statusValue
    ? APPROVED_RECOMMENDATION_STATUSES.has(statusValue.trim().toLowerCase())
    : false;

  return {
    shelfCode,
    bookSlug,
    status: approved ? "confirmed" : "provisional",
    note: guideField(metaobject.fields, RECOMMENDATION_FIELD_KEYS.reason) ?? "",
    ...(guideField(metaobject.fields, RECOMMENDATION_FIELD_KEYS.location)
      ? { location: guideField(metaobject.fields, RECOMMENDATION_FIELD_KEYS.location) }
      : {}),
    ...(guideField(metaobject.fields, RECOMMENDATION_FIELD_KEYS.approvedBy)
      ? { approvedBy: guideField(metaobject.fields, RECOMMENDATION_FIELD_KEYS.approvedBy) }
      : {}),
  };
}
