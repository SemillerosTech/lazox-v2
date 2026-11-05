"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { getBookUnitPrice, resolvePriceOption } from "@/lib/pricing";
import type { Book, CartLineItem, PriceOption } from "@/lib/types";

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
  /** Falso en el modo Shopify mientras el carrito real no esté habilitado. */
  isEnabled: boolean;
  add: (bookId: string, quantity?: number, priceOption?: PriceOption) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  setPriceOption: (bookId: string, priceOption: PriceOption) => void;
  remove: (bookId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  books,
  enabled = true,
}: {
  children: ReactNode;
  /** Índice mínimo que el servidor entrega al cliente. */
  books: Book[];
  enabled?: boolean;
}) {
  const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartServerSnapshot);

  const bookIndex = useMemo(() => new Map(books.map((book) => [book.id, book])), [books]);

  const items = useMemo<CartLineItem[]>(() => {
    if (!enabled) return [];

    return snapshot.items.flatMap((line) => {
      const book = bookIndex.get(line.bookId);
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
  }, [snapshot.items, bookIndex, enabled]);

  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.lineTotal, 0), [items]);

  const add = useCallback(
    (bookId: string, quantity?: number, priceOption?: PriceOption) => {
      if (!enabled) return;
      addToCart(bookId, quantity, priceOption);
    },
    [enabled],
  );

  const setQuantity = useCallback(
    (bookId: string, quantity: number) => {
      if (!enabled) return;
      setCartQuantity(bookId, quantity);
    },
    [enabled],
  );

  const setPriceOption = useCallback(
    (bookId: string, priceOption: PriceOption) => {
      if (!enabled) return;
      setCartPriceOption(bookId, priceOption);
    },
    [enabled],
  );

  const remove = useCallback(
    (bookId: string) => {
      if (!enabled) return;
      removeFromCart(bookId);
    },
    [enabled],
  );

  const clear = useCallback(() => {
    if (!enabled) return;
    clearCart();
  }, [enabled]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      isHydrated: snapshot.hydrated,
      isEnabled: enabled,
      add,
      setQuantity,
      setPriceOption,
      remove,
      clear,
    }),
    [
      items,
      itemCount,
      subtotal,
      snapshot.hydrated,
      enabled,
      add,
      setQuantity,
      setPriceOption,
      remove,
      clear,
    ],
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
