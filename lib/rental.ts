import type { Book } from "@/lib/types";

/** Apagado al abrir; se comparte entre UI y validaciones de carrito. */
export function isRentalOnly(book: Pick<Book, "rentalOnly">): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_RENTAL_ONLY === "true" && book.rentalOnly === true;
}

export function canPurchaseBook(book: Book): boolean {
  return !isRentalOnly(book) && book.availability !== "out_of_stock";
}

/** El acceso escolar no se activa sin el convenio y el flujo de El patio 2.0. */
export const SCHOOL_ACCESS_ENABLED = false;
