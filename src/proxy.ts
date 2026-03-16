import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  } catch { return null; }
}

function isTokenExpired(token: string): boolean {
  const p = decodeJwtPayload(token);
  if (!p?.exp) return true;
  return Date.now() >= p.exp * 1000;
}

function hasUserRole(token: string): boolean {
  const p = decodeJwtPayload(token);
  if (!p) return false;
  const roles: string[] = p.roles ?? p.authorities ?? [];
  // Usuarios normales (no admins)
  return roles.includes("ROLE_USER") && !roles.includes("ROLE_ADMIN");
}

export function proxy(request: NextRequest) {
  const token    = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/signin", "/register"];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  // Sin token → signin
  if (!token && !isPublic) {
    const res = NextResponse.redirect(new URL("/signin", request.url));
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  }

  if (token) {
    // Token expirado
    if (isTokenExpired(token)) {
      const res = NextResponse.redirect(new URL("/signin", request.url));
      res.cookies.delete("token");
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return res;
    }

    // Token válido pero es admin → no puede entrar aquí
    if (!isPublic && !hasUserRole(token)) {
      const res = NextResponse.redirect(new URL("/signin?error=unauthorized", request.url));
      res.cookies.delete("token");
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return res;
    }

    // Ya logueado intentando ir a signin
    if (isPublic && hasUserRole(token)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons|assets).*)"],
};