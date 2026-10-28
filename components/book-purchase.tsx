"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Price } from "@/components/price";
import { PriceOptions } from "@/components/price-options";
import { getBookPriceOptions, isDualPricingEnabled } from "@/lib/pricing";
import { buttonClasses } from "@/lib/styles";
import type { Book, PriceOption } from "@/lib/types";

export function BookPurchase({ book, guideSlug }: { book: Book; guideSlug?: string | undefined }) {
  const [selected, setSelected] = useState<PriceOption>("normal");
  const options = getBookPriceOptions(book);
  const showTwoPrices = options.length > 1 && isDualPricingEnabled();

  return (
    <div className="mt-6">
      {showTwoPrices ? (
        <PriceOptions options={options} value={selected} onChange={setSelected} />
      ) : (
        <Price price={book.price} className="text-3xl" />
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          bookId={book.id}
          priceOption={showTwoPrices ? selected : "normal"}
          dataTour="product-add-cart"
        />
        {guideSlug && (
          <Link
            href={`/guias/${guideSlug}/descargar`}
            data-tour="product-guide"
            className={buttonClasses("outline", "w-full")}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Descargar la guía · sin registro
          </Link>
        )}
      </div>
    </div>
  );
}
