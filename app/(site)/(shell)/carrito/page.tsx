import type { Metadata } from "next";

import { CartPage } from "./cart-page";

export const metadata: Metadata = {
  title: "Su carrito",
  robots: { index: false, follow: false },
};

// La fuente de catálogo y el flag de compra se leen en servidor.
export const dynamic = "force-dynamic";

export default function CartRoute() {
  return <CartPage />;
}
