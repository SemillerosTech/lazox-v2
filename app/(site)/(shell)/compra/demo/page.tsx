import type { Metadata } from "next";

import { CheckoutDemo } from "./checkout-demo";

export const metadata: Metadata = {
  title: "Compra de demostración",
  robots: { index: false, follow: false },
};

// La fuente de catálogo y el flag de compra se leen en servidor.
export const dynamic = "force-dynamic";

export default function CheckoutDemoPage() {
  return <CheckoutDemo />;
}
