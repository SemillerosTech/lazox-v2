import type { CartItem } from "@/lib/types";

import { clampQuantity, readCart, writeCart } from "./cart-storage";

export interface CartSnapshot {
  items: CartItem[];
  hydrated: boolean;
}

const EMPTY_SNAPSHOT: CartSnapshot = { items: [], hydrated: false };

let currentSnapshot: CartSnapshot = EMPTY_SNAPSHOT;
let hasLoaded = false;
const listeners = new Set<() => void>();

function loadFromStorage(): void {
  if (hasLoaded || typeof window === "undefined") return;

  hasLoaded = true;
  currentSnapshot = { items: readCart(), hydrated: true };
}

function commit(items: CartItem[]): void {
  currentSnapshot = { items, hydrated: true };
  hasLoaded = true;
  writeCart(items);
  listeners.forEach((listener) => listener());
}

export function subscribeToCart(listener: () => void): () => void {
  loadFromStorage();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): CartSnapshot {
  loadFromStorage();
  return currentSnapshot;
}

/**
 * El servidor siempre parte de un carrito vacío. React usa este snapshot
 * durante la hidratación y después cambia al snapshot real de localStorage.
 */
export function getCartServerSnapshot(): CartSnapshot {
  return EMPTY_SNAPSHOT;
}

export function addToCart(bookId: string, quantity = 1): void {
  loadFromStorage();

  const existing = currentSnapshot.items.find((line) => line.bookId === bookId);
  const items = existing
    ? currentSnapshot.items.map((line) =>
        line.bookId === bookId
          ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
          : line,
      )
    : [...currentSnapshot.items, { bookId, quantity: clampQuantity(quantity) }];

  commit(items);
}

export function setCartQuantity(bookId: string, quantity: number): void {
  loadFromStorage();

  commit(
    currentSnapshot.items.map((line) =>
      line.bookId === bookId ? { ...line, quantity: clampQuantity(quantity) } : line,
    ),
  );
}

export function removeFromCart(bookId: string): void {
  loadFromStorage();
  commit(currentSnapshot.items.filter((line) => line.bookId !== bookId));
}

export function clearCart(): void {
  commit([]);
}
