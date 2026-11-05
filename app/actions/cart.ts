"use server";

import {
  addShopifyCartLine,
  getShopifyCart,
  getShopifyCheckoutUrl,
  removeShopifyCartLine,
  updateShopifyCartLine,
  type ShopifyCartView,
} from "@/lib/shopify/cart";

export type ShopCartActionResult =
  { ok: true; cart: ShopifyCartView | null } | { ok: false; error: string };

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.name.startsWith("Shopify")) {
    return error.message;
  }
  return "No fue posible actualizar el carrito.";
}

export async function readShopifyCartAction(): Promise<ShopCartActionResult> {
  try {
    return { ok: true, cart: await getShopifyCart() };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function addShopifyCartLineAction(input: {
  variantId: string;
  quantity?: number;
}): Promise<ShopCartActionResult> {
  try {
    return { ok: true, cart: await addShopifyCartLine(input) };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function updateShopifyCartLineAction(input: {
  lineId: string;
  quantity: number;
}): Promise<ShopCartActionResult> {
  try {
    return { ok: true, cart: await updateShopifyCartLine(input) };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function removeShopifyCartLineAction(input: {
  lineId: string;
}): Promise<ShopCartActionResult> {
  try {
    return { ok: true, cart: await removeShopifyCartLine(input.lineId) };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function requestShopifyCheckoutAction(): Promise<
  { ok: true; checkoutUrl: string | null } | { ok: false; error: string }
> {
  try {
    return { ok: true, checkoutUrl: await getShopifyCheckoutUrl() };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}
