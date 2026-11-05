/**
 * Tipos mínimos de las respuestas GraphQL que consume la integración.
 *
 * No se usa codegen para no agregar herramientas ni pasos de build. Cada tipo
 * refleja exactamente los campos solicitados en `queries.ts`.
 */

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifyReference {
  __typename: string;
  id?: string | null;
  handle?: string | null;
  title?: string | null;
  type?: string | null;
  url?: string | null;
  image?: ShopifyImage | null;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  type: string;
  value: string | null;
  reference?: ShopifyReference | null;
  references?: { nodes: ShopifyReference[] } | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: ShopifyMoney;
  weight: number | null;
  weightUnit: string | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  priceRange: { minVariantPrice: ShopifyMoney };
  variants: { nodes: ShopifyVariant[] };
  metafields: Array<ShopifyMetafield | null>;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  metafields: Array<ShopifyMetafield | null>;
}

export interface ShopifyMetaobjectField {
  key: string;
  type: string;
  value: string | null;
  reference?: ShopifyReference | null;
  references?: { nodes: ShopifyReference[] } | null;
}

export interface ShopifyMetaobject {
  id: string;
  handle: string;
  type: string;
  fields: ShopifyMetaobjectField[];
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ShopifyConnection<T> {
  pageInfo: ShopifyPageInfo;
  nodes: T[];
}

export interface ShopifyGraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
}

export interface ShopifyGraphQLResponse<T> {
  data?: T | null;
  errors?: ShopifyGraphQLError[];
}

export interface ShopifyCartLineMerchandise {
  id: string;
  title: string;
  sku: string | null;
  price: ShopifyMoney;
  image: ShopifyImage | null;
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage: ShopifyImage | null;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: ShopifyMoney };
  merchandise: ShopifyCartLineMerchandise | null;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: { nodes: ShopifyCartLine[] };
}

export interface ShopifyUserError {
  field?: string[] | null;
  message: string;
  code?: string | null;
}

export interface ShopifyCartMutationPayload {
  cart: ShopifyCart | null;
  userErrors: ShopifyUserError[];
}
