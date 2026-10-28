import type { CartItem, PriceOption } from "@/lib/types";

const STORAGE_KEY = "lazox:cart:v2";
const LEGACY_STORAGE_KEY = "lazox:cart:v1";
const MAX_QUANTITY = 99;

function isPriceOption(value: unknown): value is PriceOption {
  return value === "normal" || value === "economic";
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.bookId === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(quantity)));
}

function normalizeItem(item: CartItem): CartItem {
  return {
    bookId: item.bookId,
    quantity: clampQuantity(item.quantity),
    priceOption: isPriceOption(item.priceOption) ? item.priceOption : "normal",
  };
}

function readFrom(key: string): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isCartItem).map(normalizeItem);
  } catch {
    return [];
  }
}

export function readCart(): CartItem[] {
  const current = readFrom(STORAGE_KEY);
  if (current.length > 0) return current;

  const legacy = readFrom(LEGACY_STORAGE_KEY);
  if (legacy.length > 0) {
    writeCart(legacy);
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // La migración no es indispensable para seguir usando el carrito.
    }
  }

  return legacy;
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    if (items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(normalizeItem)));
  } catch {
    // Si el almacenamiento no está disponible, el carrito sigue funcionando en memoria.
  }
}
