import "server-only";
import { shopifyFetch } from "./client";
import { isRentalOnly } from "@/lib/rental";
import type { ShopifyCart } from "./types";

export class ShopifyRentalOnlyError extends Error {
  constructor() {
    super("Este libro no está a la venta: aquí solo se presta, por renta escolar.");
    this.name = "ShopifyRentalOnlyError";
  }
}

export async function assertVariantPurchasable(variantId: string): Promise<void> {
  if (process.env.NEXT_PUBLIC_ENABLE_RENTAL_ONLY !== "true") return;
  const data = await shopifyFetch<{
    node: { product: { rentalOnly: { value: string | null } | null } } | null;
  }>({
    query: `query VariantRentalPolicy($id: ID!) {
      node(id: $id) { ... on ProductVariant {
        product { rentalOnly: metafield(namespace: "lazox", key: "solo_renta_escolar") { value } }
      } }
    }`,
    variables: { id: variantId },
    operationName: "VariantRentalPolicy",
  });
  if (!data.node?.product) throw new Error("No fue posible verificar el producto.");
  if (isRentalOnly({ rentalOnly: data.node.product.rentalOnly?.value === "true" })) {
    throw new ShopifyRentalOnlyError();
  }
}

export function assertCartPurchasable(cart: ShopifyCart): void {
  if (process.env.NEXT_PUBLIC_ENABLE_RENTAL_ONLY !== "true") return;
  // No permitir que una página incompleta de líneas o un producto ilegible eluda la validación.
  if (cart.lines.nodes.reduce((sum, line) => sum + line.quantity, 0) !== cart.totalQuantity) {
    throw new Error("No fue posible verificar todas las líneas del carrito.");
  }
  for (const line of cart.lines.nodes) {
    if (!line.merchandise?.product || line.merchandise.product.rentalOnly === undefined) {
      throw new Error("No fue posible verificar el producto.");
    }
    if (isRentalOnly({ rentalOnly: line.merchandise.product.rentalOnly?.value === "true" })) {
      throw new ShopifyRentalOnlyError();
    }
  }
}
