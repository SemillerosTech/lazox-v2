import type { Metadata } from "next";

import { CartPage } from "./cart-page";

export const metadata: Metadata = {
  title: "Su carrito",
  robots: { index: false, follow: false },
};

export default function CartRoute() {
  return <CartPage />;
}
