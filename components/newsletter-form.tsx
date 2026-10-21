"use client";

import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
  return (
    <form
      className="mt-2 flex items-center rounded-full border border-border p-1"
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        type="email"
        placeholder="Tu correo"
        aria-label="Tu correo"
        className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
      />
      <button
        type="submit"
        className="grid h-9 w-9 place-items-center rounded-full bg-brand-red text-primary-foreground"
        aria-label="Suscribirme"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
