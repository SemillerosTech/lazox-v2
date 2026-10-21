import type { Metadata } from "next";

import { CheckoutDemo } from "./checkout-demo";

export const metadata: Metadata = {
  title: "Compra de demostración",
  robots: { index: false, follow: false },
};

export default function CheckoutDemoPage() {
  return <CheckoutDemo />;
}
