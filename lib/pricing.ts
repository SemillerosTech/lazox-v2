import type { Book, PriceOption } from "@/lib/types";

export interface BookPriceOption {
  option: PriceOption;
  amount: number;
  currency: Book["price"]["currency"];
}

const PRICE_LIBRE_MONTHS = 36;
const ECONOMIC_FACTOR = 0.7;

export function isDualPricingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DUAL_PRICING === "true";
}

function monthsSince(isoDate: string, now: Date): number {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 0;

  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

  return date.getDate() > now.getDate() ? months - 1 : months;
}

export function isPriceLibre(book: Book, now = new Date()): boolean {
  if (book.priceMode === "libre") return true;
  if (!book.printedAt) return false;

  return monthsSince(book.printedAt, now) >= PRICE_LIBRE_MONTHS;
}

export function getBookPriceOptions(book: Book, now = new Date()): BookPriceOption[] {
  const normal: BookPriceOption = {
    option: "normal",
    amount: book.price.amount,
    currency: book.price.currency,
  };

  if (!isPriceLibre(book, now)) return [normal];

  return [
    normal,
    {
      option: "economic",
      amount: Math.round(book.price.amount * ECONOMIC_FACTOR),
      currency: book.price.currency,
    },
  ];
}

export function resolvePriceOption(book: Book, option?: PriceOption): PriceOption {
  if (option !== "economic") return "normal";

  return isDualPricingEnabled() && isPriceLibre(book) ? "economic" : "normal";
}

export function getBookUnitPrice(book: Book, option?: PriceOption): number {
  const selected = resolvePriceOption(book, option);
  const price = getBookPriceOptions(book).find((item) => item.option === selected);
  return price?.amount ?? book.price.amount;
}

export function isBookOutOfStock(book: Book): boolean {
  return book.availability === "out_of_stock";
}
