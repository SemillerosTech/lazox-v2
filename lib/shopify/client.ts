import "server-only";

import { getShopifyConfig, ShopifyConfigError } from "./config";
import type { ShopifyGraphQLResponse } from "./types";

const REQUEST_TIMEOUT_MS = 8_000;

export class ShopifyTransportError extends Error {
  readonly code = "SHOPIFY_TRANSPORT";
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ShopifyTransportError";
    this.status = status;
  }
}

export class ShopifyGraphQLError extends Error {
  readonly code = "SHOPIFY_GRAPHQL";
  readonly graphqlCodes: string[];

  constructor(message: string, graphqlCodes: string[] = []) {
    super(message);
    this.name = "ShopifyGraphQLError";
    this.graphqlCodes = graphqlCodes;
  }
}

/**
 * Los mensajes de Shopify pueden repetir identificadores. El token nunca se
 * incluye en un error, pero sí conviene redactar el secreto del carrito.
 */
function sanitizeMessage(message: string): string {
  return message
    .replace(/gid:\/\/shopify\/Cart\/[^\s"']+/gi, "gid://shopify/Cart/[redactado]")
    .replace(/Shopify-Storefront-(Private-Token|Buyer-IP)/gi, "[header redactado]")
    .slice(0, 300);
}

export interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  buyerIp?: string | undefined;
}

/**
 * Transporte GraphQL de servidor. No cachea: el catálogo y el carrito priorizan
 * frescura durante la integración. Producción podrá añadir revalidación e
 * invalidación por webhooks en una fase posterior.
 */
export async function shopifyFetch<T>({
  query,
  variables,
  operationName,
  buyerIp,
}: ShopifyFetchOptions): Promise<T> {
  let config: ReturnType<typeof getShopifyConfig>;

  try {
    config = getShopifyConfig();
  } catch (error) {
    if (error instanceof ShopifyConfigError) throw error;
    throw new ShopifyConfigError("La configuración de Shopify no es válida.");
  }

  const endpoint = `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`;
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": config.privateToken,
  };

  if (buyerIp) {
    requestHeaders["Shopify-Storefront-Buyer-IP"] = buyerIp;
  }

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ query, variables, operationName }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const message =
      name === "TimeoutError" || name === "AbortError"
        ? "La solicitud a Shopify excedió el tiempo de espera."
        : "No fue posible conectar con Shopify.";

    throw new ShopifyTransportError(message);
  }

  let payload: ShopifyGraphQLResponse<T> | null = null;

  try {
    payload = (await response.json()) as ShopifyGraphQLResponse<T>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ShopifyTransportError(
      `Shopify respondió con HTTP ${response.status}.`,
      response.status,
    );
  }

  if (!payload) {
    throw new ShopifyTransportError("Shopify devolvió una respuesta vacía o inválida.");
  }

  if (payload.errors?.length) {
    const graphqlCodes = payload.errors
      .map((error) => error.extensions?.code)
      .filter((code): code is string => typeof code === "string" && code.length > 0);
    const firstMessage = payload.errors[0]?.message ?? "Error de GraphQL";

    throw new ShopifyGraphQLError(sanitizeMessage(firstMessage), graphqlCodes);
  }

  if (!payload.data) {
    throw new ShopifyTransportError("Shopify no devolvió datos.");
  }

  return payload.data;
}
