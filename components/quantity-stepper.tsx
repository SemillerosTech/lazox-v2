"use client";

import { Minus, Plus } from "lucide-react";

import { clampQuantity } from "@/lib/cart/cart-storage";

export function QuantityStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background">
      <button
        type="button"
        onClick={() => onChange(clampQuantity(value - 1))}
        disabled={value <= 1}
        className="grid h-11 w-11 place-items-center rounded-full text-brand-ink transition hover:bg-brand-soft-pink disabled:opacity-40"
        aria-label={`Quitar una unidad de ${label}`}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span aria-live="polite" className="w-8 text-center text-sm font-extrabold">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(clampQuantity(value + 1))}
        disabled={value >= 99}
        className="grid h-11 w-11 place-items-center rounded-full text-brand-ink transition hover:bg-brand-soft-pink disabled:opacity-40"
        aria-label={`Agregar una unidad de ${label}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
