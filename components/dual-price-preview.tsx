"use client";

import { useState } from "react";

import { PriceOptions } from "@/components/price-options";
import { getBookPriceOptions } from "@/lib/pricing";
import type { Book, PriceOption } from "@/lib/types";

export function DualPricePreview({ book }: { book: Book }) {
  const [selected, setSelected] = useState<PriceOption>("normal");
  const options = getBookPriceOptions(book);

  return <PriceOptions options={options} value={selected} onChange={setSelected} />;
}
