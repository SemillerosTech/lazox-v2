import "server-only";

import { headers } from "next/headers";
import { isIP } from "node:net";

import { isTrustedProxyConfigured } from "./config";

/**
 * La IP del comprador solo se reenvía cuando el despliegue declara un proxy de
 * confianza. Nunca se toma un header arbitrario del cliente sin esa decisión.
 */
export async function getBuyerIp(): Promise<string | undefined> {
  if (!isTrustedProxyConfigured()) return undefined;

  try {
    const requestHeaders = await headers();
    const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = requestHeaders.get("x-real-ip")?.trim();
    const candidate = forwarded || realIp;

    return candidate && isIP(candidate) !== 0 ? candidate : undefined;
  } catch {
    // Fuera de una petición de Next (por ejemplo, un script de diagnóstico).
    return undefined;
  }
}
