import type { Metadata } from "next";

import { OrderConfirmation } from "./order-confirmation";

export const metadata: Metadata = {
  title: "Pedido confirmado (demostración)",
  robots: { index: false, follow: false },
};

export default function ConfirmationDemoPage() {
  return <OrderConfirmation />;
}
