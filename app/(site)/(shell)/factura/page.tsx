import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Solicitar factura",
  robots: { index: false, follow: false },
};

export default function InvoicePage() {
  return (
    <ComingSoon
      title="Solicitar factura"
      description="La facturación estará disponible cuando se integre Shopify."
      breadcrumb="Factura"
    />
  );
}
