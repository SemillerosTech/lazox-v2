import assert from "node:assert/strict";
import { register } from "node:module";
import { after, beforeEach, test } from "node:test";

register("./typescript-loader.mjs", import.meta.url);

const { shopifyCatalog } = await import("../lib/catalog/shopify.ts");
const { localDraftCatalog } = await import("../lib/catalog/local-draft.ts");
const { mapGuide } = await import("../lib/shopify/mappers.ts");
const { indexGuideSlugs } = await import("../lib/shopify/guide-slugs.ts");
const { getMetaobjectKeysDiagnostics } = await import("../lib/shopify/diagnostics.ts");

// Fixtures sintéticos, solo en memoria. Nunca se cargan en Shopify ni en la UI.
function guide({ id = "1", handle = "handle-interno", slug = "guia-publica" } = {}) {
  return {
    id: `gid://shopify/Metaobject/${id}`,
    handle,
    type: "guia_de_lectura",
    fields: [
      { key: "slug", type: "single_line_text_field", value: slug },
      { key: "titulo", type: "single_line_text_field", value: "Fixture de guía; no publicar" },
      {
        key: "libro_relacionado",
        type: "product_reference",
        value: "gid://shopify/Product/1",
        reference: { __typename: "Product", handle: "libro-fixture" },
      },
    ],
  };
}

function product(reference = guide()) {
  return {
    id: "gid://shopify/Product/1",
    handle: "libro-fixture",
    title: "Fixture de libro; no publicar",
    description: "",
    descriptionHtml: "",
    availableForSale: false,
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: "435.00", currencyCode: "MXN" } },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/1",
          title: "Default Title",
          sku: null,
          availableForSale: false,
          price: { amount: "435.00", currencyCode: "MXN" },
          weight: null,
          weightUnit: null,
        },
      ],
    },
    metafields: [
      {
        namespace: "lazox",
        key: "guia",
        type: "metaobject_reference",
        value: reference?.id ?? null,
        reference: reference
          ? {
              __typename: "Metaobject",
              id: reference.id,
              handle: reference.handle,
              type: reference.type,
            }
          : null,
      },
    ],
  };
}

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
let entries;
let currentProduct;
let calls;
let failGuides;
let paginated;
let incomplete;

beforeEach(() => {
  process.env.LAZOX_CATALOG_SOURCE = "shopify";
  process.env.SHOPIFY_STORE_DOMAIN = "catalog-fixture.myshopify.com";
  process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN = "fixture-token-not-a-secret";
  process.env.LAZOX_TRUST_PROXY = "false";
  process.env.LAZOX_ENABLE_CART = "false";
  process.env.LAZOX_ENABLE_CHECKOUT = "false";
  entries = [guide()];
  currentProduct = product();
  calls = [];
  failGuides = false;
  paginated = false;
  incomplete = false;

  globalThis.fetch = async (url, options) => {
    // No se llama a la red, ni siquiera ante una operación desconocida.
    assert.equal(new URL(url).hostname, "catalog-fixture.myshopify.com");
    const { operationName, query, variables } = JSON.parse(options.body);
    assert.ok(!/\bmutation\b/.test(query), "Las pruebas no permiten mutaciones");
    calls.push({ operationName, variables });
    const connection = (nodes, hasNextPage = false, endCursor = null) => ({
      nodes,
      pageInfo: { hasNextPage, endCursor },
    });
    let data;
    switch (operationName) {
      case "Guides":
        if (failGuides)
          return Response.json({ errors: [{ message: "Fixture: fallo de lectura" }] });
        data = {
          metaobjects: incomplete
            ? connection(entries, true, incomplete === "cursor" ? null : "siguiente")
            : paginated && !variables.after
              ? connection(entries.slice(0, 1), true, "pagina-2")
              : connection(paginated ? entries.slice(1) : entries),
        };
        break;
      case "ProductByHandle":
        data = { product: variables.handle === currentProduct?.handle ? currentProduct : null };
        break;
      case "Shelves":
        data = {
          collections: connection([
            {
              id: "gid://shopify/Collection/1",
              handle: "estante-fixture",
              title: "Fixture de estante; no publicar",
              description: "",
              descriptionHtml: "",
              metafields: [
                { namespace: "lazox", key: "estante_codigo", value: "EST-03" },
                { namespace: "lazox", key: "estante_orden", value: "6" },
              ],
            },
          ]),
        };
        break;
      case "CollectionProducts":
        data = { collection: { products: connection([currentProduct]) } };
        break;
      case "Recommendations":
        data = { metaobjects: connection([]) };
        break;
      case "HomepageContent":
        data = { metaobject: null };
        break;
      default:
        assert.fail(`Operación inesperada: ${operationName}`);
    }
    return Response.json({ data });
  };
});

after(() => {
  globalThis.fetch = originalFetch;
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
});

test("la ruta usa el slug público aunque el handle sea diferente", async () => {
  assert.equal((await shopifyCatalog.getGuide("guia-publica"))?.slug, "guia-publica");
  assert.equal(await shopifyCatalog.getGuide("handle-interno"), null);
  assert.equal((await shopifyCatalog.listGuides())[0].slug, "guia-publica");
  assert.ok(calls.every((call) => call.operationName !== "GuideByHandle"));
});

test("la referencia lazox.guia se resuelve por ID al mismo slug del listado", async () => {
  // Ni siquiera el handle de la referencia debe usarse como dirección pública.
  currentProduct.metafields[0].reference.handle = "otro-handle-tecnico";
  const book = await shopifyCatalog.getBook("libro-fixture");
  const linked = await shopifyCatalog.getGuideForBook("libro-fixture");
  const listed = await shopifyCatalog.listGuides();
  assert.equal(book.guideSlug, "guia-publica");
  assert.equal(linked.slug, listed[0].slug);
  assert.equal((await shopifyCatalog.getGuide(linked.slug)).bookSlug, "libro-fixture");
});

test("los productos de un estante y listBooks también usan el slug público", async () => {
  assert.equal((await shopifyCatalog.listBooksByShelf("EST-03"))[0].guideSlug, "guia-publica");
  assert.equal((await shopifyCatalog.listBooks())[0].guideSlug, "guia-publica");
});

test("los duplicados se excluyen completos sin elegir una guía arbitraria", async () => {
  entries.push(guide({ id: "2", handle: "otro-handle" }));
  assert.deepEqual(await shopifyCatalog.listGuides(), []);
  assert.equal(await shopifyCatalog.getGuide("guia-publica"), null);
  assert.equal(await shopifyCatalog.getGuideForBook("libro-fixture"), null);
  assert.equal((await shopifyCatalog.getBook("libro-fixture")).guideSlug, undefined);
  assert.equal(indexGuideSlugs(entries).issues.length, 2);
});

test("detecta duplicados entre páginas diferentes de Shopify", async () => {
  paginated = true;
  entries.push(guide({ id: "2", handle: "otro-handle" }));
  assert.equal(await shopifyCatalog.getGuide("guia-publica"), null);
  assert.deepEqual(
    calls.filter((c) => c.operationName === "Guides").map((c) => c.variables.after),
    [null, "pagina-2"],
  );
});

test("una guía válida sigue disponible si otras tienen slugs ambiguos", async () => {
  entries.push(guide({ id: "2", slug: "repetido" }), guide({ id: "3", slug: "repetido" }));
  assert.deepEqual(
    (await shopifyCatalog.listGuides()).map((item) => item.slug),
    ["guia-publica"],
  );
});

test("un índice incompleto falla sin dar por únicos los slugs leídos", async () => {
  for (const reason of ["cursor", "limit"]) {
    incomplete = reason;
    await assert.rejects(shopifyCatalog.getGuide("guia-publica"), /índice completo de guías/);
  }
});

test("slugs vacíos o inseguros no caen al handle ni al slug del libro", async () => {
  for (const slug of [
    null,
    "",
    "  ",
    "../otra",
    "con/diagonal",
    "con espacios",
    "guia?x=1",
    "guia#seccion",
    "%2F",
    "MAYUSCULA",
  ]) {
    const entry = guide({ slug });
    entries = [entry];
    currentProduct = product(entry);
    assert.equal(mapGuide(entry), null);
    assert.deepEqual(await shopifyCatalog.listGuides(), []);
    assert.equal(await shopifyCatalog.getGuideForBook("libro-fixture"), null);
  }
});

test("acepta un slug válido con espacios exteriores sin cambiar su identidad", async () => {
  entries = [guide({ slug: "  guia-publica  " })];
  assert.equal((await shopifyCatalog.getGuide("guia-publica"))?.slug, "guia-publica");
});

test("una referencia a una guía no visible no genera enlaces inventados", async () => {
  entries = [];
  assert.equal(await shopifyCatalog.getGuideForBook("libro-fixture"), null);
  assert.equal((await shopifyCatalog.getBook("libro-fixture")).guideSlug, undefined);
});

test("sin lazox.guia no se deduce una relación por el título o el libro relacionado", async () => {
  currentProduct = product(null);
  assert.equal(await shopifyCatalog.getGuideForBook("libro-fixture"), null);
  assert.equal((await shopifyCatalog.getBook("libro-fixture")).guideSlug, undefined);
});

test("rechaza referencias a otro tipo de metaobjeto", async () => {
  currentProduct.metafields[0].reference.type = "otro_tipo";
  assert.equal(await shopifyCatalog.getGuideForBook("libro-fixture"), null);
});

test("el diagnóstico interno informa slugs ausentes, inválidos y duplicados", async () => {
  entries = [
    guide({ slug: "" }),
    guide({ id: "2", slug: "con/diagonal" }),
    guide({ id: "3" }),
    guide({ id: "4" }),
  ];
  const diagnostics = await getMetaobjectKeysDiagnostics();
  assert.deepEqual(
    diagnostics[0].guideSlugIssues.map((issue) => issue.reason),
    ["missing", "invalid", "duplicate", "duplicate"],
  );
});

test("los errores de Shopify se propagan sin usar el borrador local", async () => {
  failGuides = true;
  await assert.rejects(shopifyCatalog.getGuide("guia-publica"), { name: "ShopifyGraphQLError" });
});

test("el adaptador local conserva su guía y no consulta Shopify", async () => {
  assert.equal((await localDraftCatalog.getGuide("inseparables"))?.slug, "inseparables");
  assert.equal((await localDraftCatalog.getGuideForBook("inseparables"))?.slug, "inseparables");
  assert.deepEqual(calls, []);
});
