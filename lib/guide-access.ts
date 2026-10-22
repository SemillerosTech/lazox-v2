import { cookies } from "next/headers";

import { GUIDE_ACCESS_COOKIE, isValidGuideToken } from "./guide-access-token";

export {
  GUIDE_ACCESS_COOKIE,
  GUIDE_ACCESS_MAX_AGE,
  hashGuidePassword,
  isGuidePublicDemo,
  isValidGuideToken,
} from "./guide-access-token";

export async function hasGuideAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidGuideToken(cookieStore.get(GUIDE_ACCESS_COOKIE)?.value);
}

/** Evita redirecciones abiertas: solo rutas internas de la guía. */
export function safeGuideRedirect(value: string | undefined): string {
  if (!value) return "/guias/inseparables";
  if (!value.startsWith("/guias/") || value.startsWith("/guias/acceso")) {
    return "/guias/inseparables";
  }
  return value;
}
