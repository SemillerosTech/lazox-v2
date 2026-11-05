/**
 * Consultas y mutaciones de Storefront API.
 *
 * Los identificadores de metacampos viajan como variables GraphQL; nunca se
 * interpolan entradas del navegador dentro de una consulta.
 */

export const PRODUCT_METAFIELD_IDENTIFIERS = [
  { namespace: "lazox", key: "isbn" },
  { namespace: "lazox", key: "autora" },
  { namespace: "lazox", key: "ilustradora" },
  { namespace: "lazox", key: "traductor" },
  { namespace: "lazox", key: "editorial" },
  { namespace: "lazox", key: "anio" },
  { namespace: "lazox", key: "paginas" },
  { namespace: "lazox", key: "edad_sugerida" },
  { namespace: "lazox", key: "ficha_madre_id" },
  { namespace: "lazox", key: "estante_principal_codigo" },
  { namespace: "lazox", key: "estantes_vecinos" },
  { namespace: "lazox", key: "pregunta_conversar" },
  { namespace: "lazox", key: "libro_vecino" },
  { namespace: "lazox", key: "libro_vecino_motivo" },
  { namespace: "lazox", key: "guia" },
  { namespace: "lazox", key: "colofon_fecha" },
  { namespace: "lazox", key: "colofon_origen" },
  { namespace: "lazox", key: "estado_libro" },
  { namespace: "lazox", key: "condicion_precio" },
  { namespace: "lazox", key: "precio_reducido" },
  // Metacampos opcionales que la ficha usa si existen. Si no existen, se
  // renderiza la descripción nativa como bloque enriquecido.
  { namespace: "lazox", key: "para_quien" },
  { namespace: "lazox", key: "regla_conversacion" },
] as const;

export const SHELF_METAFIELD_IDENTIFIERS = [
  { namespace: "lazox", key: "estante_codigo" },
  { namespace: "lazox", key: "estante_orden" },
] as const;

const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

const REFERENCE_FRAGMENT = /* GraphQL */ `
  fragment MetafieldReferenceFields on MetafieldReference {
    __typename
    ... on Product {
      id
      handle
      title
    }
    ... on Collection {
      id
      handle
      title
    }
    ... on Metaobject {
      id
      handle
      type
    }
    ... on GenericFile {
      url
    }
    ... on MediaImage {
      image {
        url
        altText
      }
    }
  }
`;

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    featuredImage {
      ...ImageFields
    }
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
    }
    variants(first: 2) {
      nodes {
        id
        title
        sku
        availableForSale
        price {
          ...MoneyFields
        }
        weight
        weightUnit
      }
    }
    metafields(identifiers: $identifiers) {
      namespace
      key
      type
      value
      reference {
        ...MetafieldReferenceFields
      }
      references(first: 10) {
        nodes {
          ...MetafieldReferenceFields
        }
      }
    }
  }
`;

const SHELF_FRAGMENT = /* GraphQL */ `
  fragment ShelfFields on Collection {
    id
    handle
    title
    description
    descriptionHtml
    metafields(identifiers: $shelfIdentifiers) {
      namespace
      key
      type
      value
    }
  }
`;

const METAOBJECT_FRAGMENT = /* GraphQL */ `
  fragment MetaobjectFields on Metaobject {
    id
    handle
    type
    fields {
      key
      type
      value
      reference {
        ...MetafieldReferenceFields
      }
      references(first: 10) {
        nodes {
          ...MetafieldReferenceFields
        }
      }
    }
  }
`;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFields
      }
      totalAmount {
        ...MoneyFields
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            ...MoneyFields
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            sku
            price {
              ...MoneyFields
            }
            image {
              ...ImageFields
            }
            product {
              id
              handle
              title
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
  }
`;

export const SHELVES_QUERY = /* GraphQL */ `
  query Shelves($first: Int!, $after: String, $shelfIdentifiers: [HasMetafieldsIdentifier!]!) {
    collections(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...ShelfFields
      }
    }
  }
  ${SHELF_FRAGMENT}
`;

export const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query CollectionProducts(
    $id: ID!
    $first: Int!
    $after: String
    $identifiers: [HasMetafieldsIdentifier!]!
  ) {
    collection(id: $id) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...ProductFields
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${REFERENCE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!, $identifiers: [HasMetafieldsIdentifier!]!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${REFERENCE_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`;

export const GUIDES_QUERY = /* GraphQL */ `
  query Guides($first: Int!, $after: String) {
    metaobjects(type: "guia_de_lectura", first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${REFERENCE_FRAGMENT}
  ${METAOBJECT_FRAGMENT}
`;

export const GUIDE_BY_HANDLE_QUERY = /* GraphQL */ `
  query GuideByHandle($handle: String!) {
    metaobject(handle: { type: "guia_de_lectura", handle: $handle }) {
      ...MetaobjectFields
    }
  }
  ${REFERENCE_FRAGMENT}
  ${METAOBJECT_FRAGMENT}
`;

export const RECOMMENDATIONS_QUERY = /* GraphQL */ `
  query Recommendations($first: Int!, $after: String) {
    metaobjects(type: "recomendacion_lazox", first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...MetaobjectFields
      }
    }
  }
  ${REFERENCE_FRAGMENT}
  ${METAOBJECT_FRAGMENT}
`;

export const HOMEPAGE_CONTENT_QUERY = /* GraphQL */ `
  query HomepageContent {
    metaobject(handle: { type: "contenido_de_portada_lazox", handle: "global" }) {
      ...MetaobjectFields
    }
  }
  ${REFERENCE_FRAGMENT}
  ${METAOBJECT_FRAGMENT}
`;

export const CART_QUERY = /* GraphQL */ `
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${CART_FRAGMENT}
`;
