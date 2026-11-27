"use client";

import { isRentalOnly } from "@/lib/rental";
import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Price } from "@/components/price";
import { PriceOptions } from "@/components/price-options";
import { getBookPriceOptions, isDualPricingEnabled } from "@/lib/pricing";
import { buttonClasses } from "@/lib/styles";
import type { Book, PriceOption } from "@/lib/types";

export function BookPurchase({
  book,
  guideSlug,
  purchasesEnabled = true,
}: {
  book: Book;
  guideSlug?: string | undefined;
  purchasesEnabled?: boolean;
}) {
  const [selected, setSelected] = useState<PriceOption>("normal");
  const options = getBookPriceOptions(book);
  const showTwoPrices = options.length > 1 && isDualPricingEnabled();

  if (isRentalOnly(book)) return null;

  return (
    <div className="mt-6">
      {showTwoPrices ? (
        <PriceOptions options={options} value={selected} onChange={setSelected} />
      ) : (
        <Price price={book.price} className="text-3xl" />
      )}

      <div className="mt-6 grid grid-cols-2 items-start gap-3">
        <AddToCartButton
          bookId={book.id}
          priceOption={showTwoPrices ? selected : "normal"}
          dataTour="product-add-cart"
          className="[&_button]:min-h-20 sm:[&_button]:min-h-11"
          enabled={purchasesEnabled}
        />
        {guideSlug && (
          <Link
            href={`/guias/${guideSlug}/descargar`}
            data-tour="product-guide"
            className={buttonClasses("outline", "min-h-20 w-full sm:min-h-11")}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Descargar la guía · sin registro
          </Link>
        )}
      </div>
    </div>
  );
}
