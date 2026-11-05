import "server-only";

import { cookies } from "next/headers";

import { getCatalogSource, isCartEnabled, isCheckoutEnabled, type CatalogSource } from "./config";
import { shopifyFetch } from "./client";
import { moneyToCents } from "./mappers";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "./queries";
import { getBuyerIp } from "./request";
import type {
  ShopifyCart,
  ShopifyCartMutationPayload,
  ShopifyImage,
  ShopifyUserError,
} from "./types";

export const CART_COOKIE_NAME = "lazox_shopify_cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const MAX_QUANTITY = 99;
const CART_ID_PATTERN = /^gid:\/\/shopify\/Cart\/[^?]+\?key=.+$/;
const VARIANT_ID_PATTERN = /^gid:\/\/shopify\/ProductVariant\/\d+$/;
const LINE_ID_PATTERN = /^gid:\/\/shopify\/CartLine\/.+/;

export class ShopifyCartDisabledError extends Error {
  readonly code = "SHOPIFY_CART_DISABLED";

  constructor(message = "El carrito de Shopify está cerrado.") {
    super(message);
    this.name = "ShopifyCartDisabledError";
  }
}

export class ShopifyCartError extends Error {
  readonly code = "SHOPIFY_CART";

  constructor(message: string) {
    super(message);
    this.name = "ShopifyCartError";
  }
}

export interface ShopifyCartLineView {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  productSlug: string;
  sku: string | null;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  image?: { url: string; alt?: string };
}

export interface ShopifyCartView {
  totalQuantity: number;
  subtotal: number;
  currency: string;
  lines: ShopifyCartLineView[];
  checkoutUrl?: string;
}

function assertShopifySource(source: CatalogSource): void {
  if (source !== "shopify") {
    throw new ShopifyCartDisabledError("El carrito de Shopify no aplica al borrador local.");
  }
}

function assertCartReady(source: CatalogSource): void {
  assertShopifySource(source);
  if (!isCartEnabled()) {
    throw new ShopifyCartDisabledError(
      "LAZOX_ENABLE_CART no está encendido. Ninguna mutación se ejecuta.",
    );
  }
}

function normalizeQuantity(quantity: number): number {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    throw new ShopifyCartError(`La cantidad debe ser un entero entre 1 y ${MAX_QUANTITY}.`);
  }
  return quantity;
}

function assertVariantId(variantId: string): string {
  if (!VARIANT_ID_PATTERN.test(variantId)) {
    throw new ShopifyCartError("El identificador de variante no es válido.");
  }
  return variantId;
}

function assertLineId(lineId: string): string {
  if (!LINE_ID_PATTERN.test(lineId)) {
    throw new ShopifyCartError("El identificador de línea no es válido.");
  }
  return lineId;
}

function sanitizeUserError(error: ShopifyUserError): string {
  return error.message
    .replace(/gid:\/\/shopify\/Cart\/[^\s"']+/gi, "gid://shopify/Cart/[redactado]")
    .slice(0, 200);
}

function assertNoUserErrors(userErrors: ShopifyUserError[] | undefined): void {
  if (!userErrors?.length) return;
  throw new ShopifyCartError(sanitizeUserError(userErrors[0] as ShopifyUserError));
}

async function readCartId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(CART_COOKIE_NAME)?.value;
  return value && CART_ID_PATTERN.test(value) ? value : null;
}

async function writeCartId(cartId: string): Promise<void> {
  if (!CART_ID_PATTERN.test(cartId)) {
    throw new ShopifyCartError("Shopify devolvió un identificador de carrito no válido.");
  }

  const store = await cookies();
  store.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

async function clearCartId(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE_NAME);
}

function mapCart(cart: ShopifyCart, includeCheckoutUrl: boolean): ShopifyCartView {
  const currency = cart.cost.subtotalAmount.currencyCode;
  const subtotal = moneyToCents(cart.cost.subtotalAmount.amount) ?? 0;

  const lines = cart.lines.nodes.flatMap((line) => {
    const merchandise = line.merchandise;
    if (!merchandise) return [];

    const unitPrice = moneyToCents(merchandise.price.amount) ?? 0;
    const lineTotal = moneyToCents(line.cost.totalAmount.amount) ?? unitPrice * line.quantity;
    const image: ShopifyImage | null = merchandise.image ?? merchandise.product.featuredImage;

    return [
      {
        id: line.id,
        quantity: line.quantity,
        variantId: merchandise.id,
        variantTitle: merchandise.title,
        productTitle: merchandise.product.title,
        productSlug: merchandise.product.handle,
        sku: merchandise.sku,
        unitPrice,
        lineTotal,
        currency: merchandise.price.currencyCode,
        ...(image?.url
          ? { image: { url: image.url, ...(image.altText ? { alt: image.altText } : {}) } }
          : {}),
      },
    ];
  });

  return {
    totalQuantity: cart.totalQuantity,
    subtotal,
    currency,
    lines,
    ...(includeCheckoutUrl && isCheckoutEnabled() ? { checkoutUrl: cart.checkoutUrl } : {}),
  };
}

async function fetchCart(cartId: string): Promise<ShopifyCart | null> {
  const buyerIp = await getBuyerIp();
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: CART_QUERY,
    variables: { id: cartId },
    operationName: "Cart",
    buyerIp,
  });

  return data.cart;
}

export async function getShopifyCart(): Promise<ShopifyCartView | null> {
  const source = getCatalogSource();
  assertShopifySource(source);

  const cartId = await readCartId();
  if (!cartId) return null;

  const cart = await fetchCart(cartId);
  if (!cart) {
    await clearCartId();
    return null;
  }

  return mapCart(cart, true);
}

export async function addShopifyCartLine({
  variantId,
  quantity = 1,
}: {
  variantId: string;
  quantity?: number;
}): Promise<ShopifyCartView> {
  const source = getCatalogSource();
  assertCartReady(source);
  assertVariantId(variantId);
  const normalizedQuantity = normalizeQuantity(quantity);
  const buyerIp = await getBuyerIp();
  const cartId = await readCartId();

  if (!cartId) {
    const data = await shopifyFetch<{ cartCreate: ShopifyCartMutationPayload }>({
      query: CART_CREATE_MUTATION,
      variables: {
        lines: [{ merchandiseId: variantId, quantity: normalizedQuantity }],
      },
      operationName: "CartCreate",
      buyerIp,
    });

    assertNoUserErrors(data.cartCreate.userErrors);
    if (!data.cartCreate.cart) {
      throw new ShopifyCartError("Shopify no devolvió el carrito creado.");
    }

    await writeCartId(data.cartCreate.cart.id);
    return mapCart(data.cartCreate.cart, true);
  }

  const data = await shopifyFetch<{ cartLinesAdd: ShopifyCartMutationPayload }>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: normalizedQuantity }],
    },
    operationName: "CartLinesAdd",
    buyerIp,
  });

  assertNoUserErrors(data.cartLinesAdd.userErrors);
  if (!data.cartLinesAdd.cart) {
    await clearCartId();
    throw new ShopifyCartError("El carrito ya no está disponible. Vuelva a intentarlo.");
  }

  return mapCart(data.cartLinesAdd.cart, true);
}

export async function updateShopifyCartLine({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}): Promise<ShopifyCartView> {
  const source = getCatalogSource();
  assertCartReady(source);
  assertLineId(lineId);
  const normalizedQuantity = normalizeQuantity(quantity);
  const cartId = await readCartId();

  if (!cartId) {
    throw new ShopifyCartError("No hay un carrito activo.");
  }

  const buyerIp = await getBuyerIp();
  const data = await shopifyFetch<{ cartLinesUpdate: ShopifyCartMutationPayload }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity: normalizedQuantity }],
    },
    operationName: "CartLinesUpdate",
    buyerIp,
  });

  assertNoUserErrors(data.cartLinesUpdate.userErrors);
  if (!data.cartLinesUpdate.cart) {
    await clearCartId();
    throw new ShopifyCartError("El carrito ya no está disponible.");
  }

  return mapCart(data.cartLinesUpdate.cart, true);
}

export async function removeShopifyCartLine(lineId: string): Promise<ShopifyCartView | null> {
  const source = getCatalogSource();
  assertCartReady(source);
  assertLineId(lineId);
  const cartId = await readCartId();

  if (!cartId) return null;

  const buyerIp = await getBuyerIp();
  const data = await shopifyFetch<{ cartLinesRemove: ShopifyCartMutationPayload }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds: [lineId] },
    operationName: "CartLinesRemove",
    buyerIp,
  });

  assertNoUserErrors(data.cartLinesRemove.userErrors);
  if (!data.cartLinesRemove.cart) {
    await clearCartId();
    return null;
  }

  return mapCart(data.cartLinesRemove.cart, true);
}

/**
 * El checkoutUrl solo se entrega cuando LAZOX_ENABLE_CHECKOUT=true. Un botón
 * deshabilitado no basta: esta función es la barrera de servidor.
 */
export async function getShopifyCheckoutUrl(): Promise<string | null> {
  const source = getCatalogSource();
  assertShopifySource(source);

  if (!isCheckoutEnabled()) {
    throw new ShopifyCartDisabledError(
      "LAZOX_ENABLE_CHECKOUT no está encendido. No se devuelve checkoutUrl.",
    );
  }

  const cartId = await readCartId();
  if (!cartId) return null;

  const cart = await fetchCart(cartId);
  return cart?.checkoutUrl ?? null;
}
