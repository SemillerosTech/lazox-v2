"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

import { findBookBySlug } from "@/lib/data/books";
import { getBookUnitPrice, resolvePriceOption } from "@/lib/pricing";
import type { CartLineItem, PriceOption } from "@/lib/types";

import {
  addToCart,
  clearCart,
  getCartServerSnapshot,
  getCartSnapshot,
  removeFromCart,
  setCartPriceOption,
  setCartQuantity,
  subscribeToCart,
} from "./cart-store";

interface CartContextValue {
  itemCount: number;
  items: CartLineItem[];
  subtotal: number;
  isHydrated: boolean;
  add: (bookId: string, quantity?: number, priceOption?: PriceOption) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  setPriceOption: (bookId: string, priceOption: PriceOption) => void;
  remove: (bookId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartServerSnapshot);

  const items = useMemo<CartLineItem[]>(() => {
    return snapshot.items.flatMap((line) => {
      const book = findBookBySlug(line.bookId);
      if (!book) return [];

      const priceOption = resolvePriceOption(book, line.priceOption);
      const unitPrice = getBookUnitPrice(book, priceOption);

      return [
        {
          ...line,
          book,
          priceOption,
          unitPrice,
          lineTotal: unitPrice * line.quantity,
        },
      ];
    });
  }, [snapshot.items]);

  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.lineTotal, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      isHydrated: snapshot.hydrated,
      add: addToCart,
      setQuantity: setCartQuantity,
      setPriceOption: setCartPriceOption,
      remove: removeFromCart,
      clear: clearCart,
    }),
    [items, itemCount, subtotal, snapshot.hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }
  return context;
}
