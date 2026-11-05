import "server-only";

/**
 * Configuración de servidor de la integración con Shopify.
 *
 * Este módulo nunca debe importarse desde un componente cliente. El token
 * privado de Storefront API vive únicamente en el proceso de servidor.
 */

export type CatalogSource = "local-draft" | "shopify";

export const DEFAULT_API_VERSION = "2026-10";
export const DEFAULT_CATALOG_SOURCE: CatalogSource = "local-draft";

const STORE_DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;
const API_VERSION_PATTERN = /^\d{4}-\d{2}$/;

export class ShopifyConfigError extends Error {
  readonly code = "SHOPIFY_CONFIG";

  constructor(message: string) {
    super(message);
    this.name = "ShopifyConfigError";
  }
}

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function isDeployedEnvironment(): boolean {
  return process.env.VERCEL === "1" || process.env.LAZOX_DEPLOY_ENV === "production";
}

function assertLocalDraftAllowed(source: CatalogSource): void {
  if (source !== "local-draft") return;
  if (!isDeployedEnvironment()) return;
  if (process.env.LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL === "true") return;

  throw new ShopifyConfigError(
    "LAZOX_CATALOG_SOURCE=local-draft no puede usarse en un despliegue. " +
      "Configure LAZOX_CATALOG_SOURCE=shopify o, mientras la tienda siga cerrada, " +
      "LAZOX_ALLOW_LOCAL_DRAFT_ON_VERCEL=true.",
  );
}

/** Fuente de catálogo activa. Falla cerrado ante valores desconocidos. */
export function getCatalogSource(): CatalogSource {
  const raw = readEnv("LAZOX_CATALOG_SOURCE") ?? DEFAULT_CATALOG_SOURCE;

  if (raw !== "local-draft" && raw !== "shopify") {
    throw new ShopifyConfigError(
      "LAZOX_CATALOG_SOURCE debe ser exactamente 'local-draft' o 'shopify'.",
    );
  }

  assertLocalDraftAllowed(raw);
  return raw;
}

export function isShopifySource(): boolean {
  return getCatalogSource() === "shopify";
}

export interface ShopifyConfig {
  storeDomain: string;
  apiVersion: string;
  privateToken: string;
}

/**
 * Lee y valida la configuración de Shopify.
 *
 * El mensaje de error solo nombra variables; nunca incluye valores, headers ni
 * el token. El hostname debe ser el dominio canónico `*.myshopify.com`, no el
 * identificador del administrador (`lazox-2`) ni el dominio comercial.
 */
export function getShopifyConfig(): ShopifyConfig {
  const storeDomain = readEnv("SHOPIFY_STORE_DOMAIN");
  const privateToken = readEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN");
  const apiVersion = readEnv("SHOPIFY_STOREFRONT_API_VERSION") ?? DEFAULT_API_VERSION;

  if (!storeDomain) {
    throw new ShopifyConfigError(
      "Falta SHOPIFY_STORE_DOMAIN. Use el hostname canónico *.myshopify.com de Shopify.",
    );
  }

  if (!STORE_DOMAIN_PATTERN.test(storeDomain)) {
    throw new ShopifyConfigError(
      "SHOPIFY_STORE_DOMAIN no tiene el formato de un hostname *.myshopify.com.",
    );
  }

  if (!privateToken) {
    throw new ShopifyConfigError(
      "Falta SHOPIFY_STOREFRONT_PRIVATE_TOKEN. Debe vivir solo en el servidor.",
    );
  }

  if (!API_VERSION_PATTERN.test(apiVersion)) {
    throw new ShopifyConfigError(
      "SHOPIFY_STOREFRONT_API_VERSION debe tener el formato YYYY-MM (por ejemplo 2026-10).",
    );
  }

  return {
    storeDomain: storeDomain.toLowerCase(),
    apiVersion,
    privateToken,
  };
}

export function isShopifyConfigured(): boolean {
  try {
    getShopifyConfig();
    return true;
  } catch {
    return false;
  }
}

/** Los flags comerciales son de servidor y se encienden solo con "true". */
export function isCartEnabled(): boolean {
  return process.env.LAZOX_ENABLE_CART === "true";
}

export function isCheckoutEnabled(): boolean {
  return process.env.LAZOX_ENABLE_CHECKOUT === "true";
}

/** Permite reenviar la IP del comprador solo si el proxy es de confianza. */
export function isTrustedProxyConfigured(): boolean {
  return process.env.LAZOX_TRUST_PROXY === "true";
}

/** True cuando la compra de demostración local está disponible. */
export function isLocalDraftPurchasingEnabled(): boolean {
  return getCatalogSource() === "local-draft";
}
