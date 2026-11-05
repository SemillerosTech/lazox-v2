#!/usr/bin/env node
/**
 * Comprobación de la configuración de Shopify sin arrancar la aplicación.
 *
 * Uso:
 *   node --env-file=.env.local scripts/check-shopify.mjs
 *
 * Nunca imprime el token ni el identificador del carrito. Solo confirma
 * variables presentes, conexión, colecciones visibles y las claves de los
 * metaobjetos que Storefront expone al canal Headless.
 */

const STORE_DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;
const API_VERSION_PATTERN = /^\d{4}-\d{2}$/;

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || "2026-10";

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`✓ ${message}`);
}

if (!storeDomain) {
  fail("Falta SHOPIFY_STORE_DOMAIN.");
} else if (!STORE_DOMAIN_PATTERN.test(storeDomain)) {
  fail("SHOPIFY_STORE_DOMAIN debe ser el hostname *.myshopify.com.");
} else {
  ok(`SHOPIFY_STORE_DOMAIN presente (${storeDomain}).`);
}

if (!privateToken) {
  fail("Falta SHOPIFY_STOREFRONT_PRIVATE_TOKEN.");
} else {
  ok("SHOPIFY_STOREFRONT_PRIVATE_TOKEN presente (valor oculto).");
}

if (!API_VERSION_PATTERN.test(apiVersion)) {
  fail("SHOPIFY_STOREFRONT_API_VERSION debe tener el formato YYYY-MM.");
} else {
  ok(`Versión de API: ${apiVersion}.`);
}

if (process.env.LAZOX_CATALOG_SOURCE !== "shopify") {
  console.warn(
    "· LAZOX_CATALOG_SOURCE no es 'shopify'. La comprobación sigue, pero el sitio no usará Shopify.",
  );
}

if (process.exitCode === 1) process.exit(1);

const endpoint = `https://${storeDomain.toLowerCase()}/api/${apiVersion}/graphql.json`;

async function query(queryText, variables) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": privateToken,
    },
    body: JSON.stringify({ query: queryText, variables }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  if (!payload) {
    throw new Error("Respuesta vacía o inválida.");
  }
  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Error de GraphQL.");
  }

  return payload.data;
}

const SHOP_QUERY = /* GraphQL */ `
  query ShopInfo {
    shop {
      name
      primaryDomain {
        host
      }
    }
  }
`;

const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections {
    collections(first: 50) {
      nodes {
        handle
        title
        metafields(
          identifiers: [
            { namespace: "lazox", key: "estante_codigo" }
            { namespace: "lazox", key: "estante_orden" }
          ]
        ) {
          key
          value
        }
      }
    }
  }
`;

const METAOBJECTS_QUERY = /* GraphQL */ `
  query Metaobjects($type: String!) {
    metaobjects(type: $type, first: 5) {
      nodes {
        handle
        type
        fields {
          key
          type
          value
        }
      }
    }
  }
`;

try {
  const shop = await query(SHOP_QUERY);
  ok(`Conexión correcta con “${shop.shop.name}” (${shop.shop.primaryDomain.host}).`);

  const collections = await query(COLLECTIONS_QUERY);
  const shelfRows = collections.collections.nodes;

  if (shelfRows.length === 0) {
    console.warn(
      "· Storefront no devuelve colecciones. Publíquelas en el canal Headless de Shopify.",
    );
  } else {
    ok(`${shelfRows.length} colecciones visibles.`);
    for (const collection of shelfRows) {
      const fields = new Map(
        (collection.metafields ?? []).map((field) => [field.key, field.value]),
      );
      const code = fields.get("estante_codigo") ?? "sin código";
      const order = fields.get("estante_orden") ?? "sin orden";
      console.log(`    ${collection.handle} → ${code} · orden ${order}`);
    }
  }

  for (const type of ["guia_de_lectura", "recomendacion_lazox", "contenido_de_portada_lazox"]) {
    const data = await query(METAOBJECTS_QUERY, { type });
    const nodes = data.metaobjects.nodes;

    if (nodes.length === 0) {
      console.warn(`· ${type}: sin entradas visibles para Storefront.`);
      continue;
    }

    ok(`${type}: ${nodes.length} entrada(s) visible(s).`);
    for (const node of nodes) {
      console.log(`    ${node.handle}`);
      for (const field of node.fields) {
        const value = field.value ? "con valor" : "vacío";
        console.log(`      ${field.key} (${field.type}) · ${value}`);
      }
    }
  }
} catch (error) {
  fail(`No fue posible completar la comprobación: ${error.message}`);
}
