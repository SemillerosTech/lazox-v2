import type { ReactNode } from "react";

import { DemoTourMount } from "@/features/demo-tour/demo-tour-mount";
import { CartProvider } from "@/lib/cart/cart-context";
import { catalog, catalogSource } from "@/lib/catalog";
import { WhatsAppProvider } from "@/lib/whatsapp-context";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const isLocalDraft = catalogSource === "local-draft";
  // El recorrido de demostración solo tiene sentido con el catálogo local.
  const demoTourEnabled = isLocalDraft && process.env.NEXT_PUBLIC_ENABLE_DEMO_TOUR === "true";
  const books = isLocalDraft ? await catalog.listBooks() : [];

  return (
    <CartProvider books={books} enabled={isLocalDraft}>
      <WhatsAppProvider>
        {children}
        <DemoTourMount enabled={demoTourEnabled} />
      </WhatsAppProvider>
    </CartProvider>
  );
}
