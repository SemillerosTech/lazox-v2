import assert from "node:assert/strict";
import { register } from "node:module";
import { after, beforeEach, test } from "node:test";

register("./typescript-loader.mjs", import.meta.url);
const { isRentalOnly, canPurchaseBook, SCHOOL_ACCESS_ENABLED } = await import("../lib/rental.ts");
const { mapProduct, mapHomepageContent } = await import("../lib/shopify/mappers.ts");
const { assertVariantPurchasable, assertCartPurchasable } =
  await import("../lib/shopify/rental-policy.ts");
const { addShopifyCartLineAction } = await import("../app/actions/cart.ts");
const { addToCart, clearCart, getCartSnapshot } = await import("../lib/cart/cart-store.ts");
const { localDraftCatalog } = await import("../lib/catalog/local-draft.ts");
const whatsapp = await import("../lib/whatsapp.ts");
const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;
let calls;
let rentalValue;
let missingVariant;

beforeEach(() => {
  process.env.LAZOX_CATALOG_SOURCE = "shopify";
  process.env.SHOPIFY_STORE_DOMAIN = "opening-fixture.myshopify.com";
  process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN = "fixture-not-a-secret";
  process.env.LAZOX_ENABLE_CART = "true";
  process.env.NEXT_PUBLIC_ENABLE_RENTAL_ONLY = "true";
  process.env.LAZOX_TRUST_PROXY = "false";
  calls = [];
  rentalValue = "true";
  missingVariant = false;
  clearCart();
  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).hostname, "opening-fixture.myshopify.com");
    const input = JSON.parse(options.body);
    assert.ok(!/\bmutation\b/.test(input.query), "No se permiten mutaciones ni red real");
    calls.push(input);
    assert.equal(input.operationName, "VariantRentalPolicy");
    return Response.json({
      data: {
        node: missingVariant
          ? null
          : { product: { rentalOnly: rentalValue === null ? null : { value: rentalValue } } },
      },
    });
  };
});
after(() => {
  globalThis.fetch = originalFetch;
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
});

test("solo renta exige campo y flag; permanece apagado al abrir", () => {
  assert.equal(isRentalOnly({ rentalOnly: true }), true);
  assert.equal(isRentalOnly({}), false);
  process.env.NEXT_PUBLIC_ENABLE_RENTAL_ONLY = "false";
  assert.equal(isRentalOnly({ rentalOnly: true }), false);
  assert.equal(SCHOOL_ACCESS_ENABLED, false);
});

test("la acción directa rechaza la variante de solo renta antes de acceder al carrito", async () => {
  const result = await addShopifyCartLineAction({ variantId: "gid://shopify/ProductVariant/1" });
  assert.equal(result.ok, false);
  assert.match(result.error, /solo se presta/);
  assert.equal(calls.length, 1);
});

test("el flag del carrito cerrado sigue impidiendo invocar mutaciones", async () => {
  process.env.LAZOX_ENABLE_CART = "false";
  assert.equal(
    (await addShopifyCartLineAction({ variantId: "gid://shopify/ProductVariant/1" })).ok,
    false,
  );
  assert.deepEqual(calls, []);
});

test("productos sin campo conservan la compra; variante inexistente falla cerrada", async () => {
  for (const value of [null, "false"]) {
    rentalValue = value;
    await assertVariantPurchasable("gid://shopify/ProductVariant/1");
  }
  missingVariant = true;
  await assert.rejects(assertVariantPurchasable("gid://shopify/ProductVariant/1"), /verificar/);
});

test("checkout rechaza líneas persistidas de renta y carritos incompletos", () => {
  const cart = {
    totalQuantity: 1,
    lines: {
      nodes: [{ quantity: 1, merchandise: { product: { rentalOnly: { value: "true" } } } }],
    },
  };
  assert.throws(() => assertCartPurchasable(cart), /solo se presta/);
  cart.lines.nodes[0].merchandise.product.rentalOnly = null;
  assert.doesNotThrow(() => assertCartPurchasable(cart));
  cart.totalQuantity = 2;
  assert.throws(() => assertCartPurchasable(cart), /todas las líneas/);
  cart.totalQuantity = 1;
  delete cart.lines.nodes[0].merchandise.product.rentalOnly;
  assert.throws(() => assertCartPurchasable(cart), /verificar/);
});

test("el carrito local rechaza renta y agotados incluso al invocar su función", async () => {
  const book = await localDraftCatalog.getBook("inseparables");
  addToCart({ ...book, rentalOnly: true });
  addToCart({ ...book, availability: "out_of_stock" });
  assert.deepEqual(getCartSnapshot().items, []);
  addToCart(book, 2);
  assert.equal(getCartSnapshot().items[0].quantity, 2);
  assert.equal(canPurchaseBook(book), true);
  assert.equal(book.year, 2021);
  assert.equal(book.pages, 48);
});

test("el adaptador mapea los campos nuevos sin cambiar productos existentes", () => {
  const product = {
    id: "gid://shopify/Product/1",
    handle: "fixture",
    title: "Fixture",
    description: "",
    descriptionHtml: "",
    availableForSale: true,
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: "435.00", currencyCode: "MXN" } },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/1",
          availableForSale: true,
          price: { amount: "435.00", currencyCode: "MXN" },
        },
      ],
    },
    metafields: [],
  };
  assert.equal(mapProduct(product).rentalOnly, false);
  assert.equal(mapProduct(product).coverImageAuthorized, false);
  product.metafields.push(
    { namespace: "lazox", key: "solo_renta_escolar", value: "true" },
    { namespace: "lazox", key: "portada_autorizada", value: "true" },
  );
  assert.equal(mapProduct(product).rentalOnly, true);
  assert.equal(mapProduct(product).coverImageAuthorized, true);
});

test("WhatsApp valida línea mexicana y codifica cada mensaje una vez", () => {
  for (const number of ["", "123", "15551234567", "5215512345678"]) {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = number;
    assert.equal(whatsapp.buildWhatsAppUrl(), undefined);
  }
  // Número sintético, solo para probar el constructor en memoria.
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "+52 00 0000 0000";
  for (const message of [
    whatsapp.WHATSAPP_RENTAL_MESSAGE,
    whatsapp.WHATSAPP_CONFIRMATION_MESSAGE,
    whatsapp.WHATSAPP_SCHOOL_MESSAGE,
    whatsapp.getBookWhatsAppMessage("Título & pregunta"),
    whatsapp.getShelfWhatsAppMessage("teme perder lo que ama"),
    ...whatsapp.WHATSAPP_SCHOOL_OPTIONS.map((option) => option.message),
  ]) {
    const url = new URL(whatsapp.buildWhatsAppUrl(message));
    assert.equal(url.hostname, "wa.me");
    assert.equal(url.searchParams.get("text"), message);
    assert.equal(url.pathname, "/520000000000");
  }
});

test("portada conecta las seis claves reales de Shopify y resuelve las referencias", () => {
  const image = (key, name) => ({
    key,
    value: "gid://shopify/MediaImage/1",
    reference: { __typename: "MediaImage", image: { url: `https://cdn.shopify.com/${name}.webp` } },
  });
  const mapped = mapHomepageContent({
    handle: "global",
    fields: [
      { key: "prefijo_editorial_de_estantes", value: "Para el niño o la niña que…" },
      {
        key: "libro_entrada",
        value: "gid://shopify/Product/1",
        reference: { __typename: "Product", handle: "seleccion-editorial" },
      },
      image("foto_entrada", "entrada"),
      { key: "foto_entrada_alt", value: "Libro abierto sobre una mesa con luz de día." },
      {
        key: "imagen_entrada_compartir",
        value: "gid://shopify/GenericFile/1",
        reference: { __typename: "GenericFile", url: "https://cdn.shopify.com/entrada-og.jpg" },
      },
      image("anfitrion_aprobado", "anfitrion"),
      image("foto_caja", "caja"),
    ],
  });
  assert.equal(mapped.entryBookSlug, "seleccion-editorial");
  assert.equal(mapped.entryImage, "https://cdn.shopify.com/entrada.webp");
  assert.equal(mapped.entryImageAlt, "Libro abierto sobre una mesa con luz de día.");
  assert.equal(mapped.entryOgImage, "https://cdn.shopify.com/entrada-og.jpg");
  assert.equal(mapped.hostImage, "https://cdn.shopify.com/anfitrion.webp");
  assert.equal(mapped.boxImage, "https://cdn.shopify.com/caja.webp");
});

test("los campos de portada vacíos u omitidos no inventan imágenes ni selección", () => {
  const fields = [{ key: "prefijo_editorial_de_estantes", value: "Para el niño o la niña que…" }];
  const expected = { id: "global", shelfPrefix: "Para el niño o la niña que…" };
  assert.deepEqual(mapHomepageContent({ handle: "global", fields }), expected);
  for (const key of [
    "libro_entrada",
    "foto_entrada",
    "foto_entrada_alt",
    "imagen_entrada_compartir",
    "anfitrion_aprobado",
    "foto_caja",
  ])
    fields.push({ key, value: "", reference: null });
  assert.deepEqual(mapHomepageContent({ handle: "global", fields }), expected);
  assert.equal(mapHomepageContent(null), null);
});

test("los contadores usan los libros del catálogo y conservan el orden de estantes", async () => {
  const { listShelvesWithBookCounts } = await import("../lib/catalog/shelf-counts.ts");
  const result = await listShelvesWithBookCounts({
    listShelves: async () => [
      { code: "EST-01", bookSlugs: ["dato-obsoleto"] },
      { code: "EST-03", bookSlugs: [] },
    ],
    listBooksByShelf: async (code) => (code === "EST-03" ? [{ id: "uno" }, { id: "dos" }] : []),
  });
  assert.deepEqual(
    result.map(({ code, bookCount }) => ({ code, bookCount })),
    [
      { code: "EST-01", bookCount: 0 },
      { code: "EST-03", bookCount: 2 },
    ],
  );
  const local = await listShelvesWithBookCounts(localDraftCatalog);
  assert.equal(local.find((shelf) => shelf.code === "EST-03").bookCount, 1);
  assert.equal(local.filter((shelf) => shelf.bookCount === 0).length, 9);
});

test("un error del catálogo no se presenta como un estante vacío", async () => {
  const { listShelvesWithBookCounts } = await import("../lib/catalog/shelf-counts.ts");
  await assert.rejects(
    listShelvesWithBookCounts({
      listShelves: async () => [{ code: "EST-01" }],
      listBooksByShelf: async () => {
        throw new Error("Lectura de catálogo fallida");
      },
    }),
    /Lectura de catálogo fallida/,
  );
});
