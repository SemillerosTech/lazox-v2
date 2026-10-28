"use client";

import { formatPrice } from "@/lib/format";
import type { BookPriceOption } from "@/lib/pricing";
import type { PriceOption } from "@/lib/types";

export function PriceOptions({
  options,
  value,
  onChange,
}: {
  options: BookPriceOption[];
  value: PriceOption;
  onChange: (option: PriceOption) => void;
}) {
  return (
    <>
      <p className="max-w-xl text-sm font-semibold leading-relaxed text-brand-ink">
        Este libro tiene dos precios. Escoja el que le acomode; no tiene que explicarnos nada.
      </p>
      <div className="mt-4 grid max-w-md grid-cols-2 gap-3" role="group" aria-label="Precio">
        {options.map((option) => {
          const isSelected = value === option.option;

          return (
            <button
              key={option.option}
              type="button"
              onClick={() => onChange(option.option)}
              aria-pressed={isSelected}
              aria-label={`Elegir ${formatPrice(option.amount, option.currency)}`}
              className={`min-h-14 rounded-2xl border-2 px-4 py-3 text-xl font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
                isSelected
                  ? "border-brand-pink bg-brand-soft-pink text-brand-ink"
                  : "border-border bg-background text-brand-ink hover:border-brand-pink"
              }`}
            >
              {formatPrice(option.amount, option.currency)}
            </button>
          );
        })}
      </div>
    </>
  );
}
