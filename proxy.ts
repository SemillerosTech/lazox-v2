import { NextResponse, type NextRequest } from "next/server";

import { GUIDE_ACCESS_COOKIE, isValidGuideToken } from "@/lib/guide-access-token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // La página de acceso debe quedar siempre disponible.
  if (pathname === "/guias/acceso" || pathname.startsWith("/guias/acceso/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(GUIDE_ACCESS_COOKIE)?.value;
  if (isValidGuideToken(token)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/guias/acceso";
  url.search = `?next=${encodeURIComponent(pathname)}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/guias/:path*"],
};
