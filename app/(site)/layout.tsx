import type { ReactNode } from "react";

import { DemoTourMount } from "@/features/demo-tour/demo-tour-mount";
import { CartProvider } from "@/lib/cart/cart-context";
import { WhatsAppProvider } from "@/lib/whatsapp-context";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const demoTourEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_TOUR === "true";

  return (
    <CartProvider>
      <WhatsAppProvider>
        {children}
        <DemoTourMount enabled={demoTourEnabled} />
      </WhatsAppProvider>
    </CartProvider>
  );
}
