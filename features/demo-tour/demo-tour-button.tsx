"use client";

import { Play } from "lucide-react";

export function DemoTourButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
      data-demo-tour-start
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-11 max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border-2 border-brand-pink bg-background px-4 py-2 text-xs font-extrabold text-brand-pink shadow-lg transition hover:bg-brand-soft-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-wait disabled:opacity-70 sm:bottom-6 sm:right-6"
    >
      <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      {loading ? "Preparando recorrido…" : "Iniciar recorrido de muestra"}
    </button>
  );
}
