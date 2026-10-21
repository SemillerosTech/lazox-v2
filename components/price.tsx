import { formatPrice } from "@/lib/format";
import type { BookPrice } from "@/lib/types";

export function Price({ price, className = "" }: { price: BookPrice; className?: string }) {
  return (
    <span className={`font-sans text-xl font-extrabold text-brand-ink ${className}`}>
      {formatPrice(price.amount, price.currency)}
    </span>
  );
}
