"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart/cart-context";
import { buttonClasses } from "@/lib/styles";
import type { PriceOption } from "@/lib/types";

export function AddToCartButton({
  bookId,
  priceOption = "normal",
  className = "",
  dataTour,
}: {
  bookId: string;
  priceOption?: PriceOption;
  className?: string;
  dataTour?: string | undefined;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        type="button"
        data-tour={dataTour}
        className={buttonClasses("primary", "w-full")}
        onClick={() => {
          add(bookId, 1, priceOption);
          setAdded(true);
        }}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" /> Agregado al carrito
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Agregar al carrito
          </>
        )}
      </button>
      <p aria-live="polite" className="min-h-5 text-center text-xs font-semibold text-brand-green">
        {added ? (
          <Link href="/carrito" className="underline">
            Ver carrito
          </Link>
        ) : null}
      </p>
    </div>
  );
}
