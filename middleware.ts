import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { verifySessionToken } from "@/lib/session";

const SESSION_COOKIE = "bubt_ai_session";
const protectedRoutes = ["/profile", "/membership", "/dashboard", "/executive"];
const adminRoutes = ["/admin"];
const mutationMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function hasTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  const protocol = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
  return origin === `${protocol}://${host}`;
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "connect-src 'self'",
      "object-src 'none'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  return response;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const pathname = request.nextUrl.pathname;
  const isApiMutation = pathname.startsWith("/api/") && mutationMethods.has(request.method);

  if (isApiMutation && !hasTrustedOrigin(request)) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Unauthorized request." }, { status: 403 })
    );
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected && !isAdmin) {
    return applySecurityHeaders(NextResponse.next());
  }

  const payload = token ? await verifySessionToken(token) : null;
  const nextAuthToken = payload
    ? null
    : await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      });

  if (!payload && !nextAuthToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  const resolvedRole = payload?.role ?? nextAuthToken?.role;

  if (isAdmin && resolvedRole !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
