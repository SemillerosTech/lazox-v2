import type { ReactNode } from "react";

import { DefaultWhatsApp } from "@/components/default-whatsapp";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppDock } from "@/components/whatsapp-dock";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip text-brand-ink">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-brand-pink px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <DefaultWhatsApp />
      <SiteHeader />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppDock />
    </div>
  );
}
