"use client";

import { Printer } from "lucide-react";

import { buttonClasses } from "@/lib/styles";

export function PrintGuideButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClasses("primary")}>
      <Printer className="h-4 w-4" aria-hidden="true" />
      Imprimir o guardar como PDF
    </button>
  );
}
