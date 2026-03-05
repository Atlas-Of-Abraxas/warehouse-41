import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const { auth } = NextAuth(authConfig);

// These routes require admin role for ALL methods (GET included) — contain PII
const ADMIN_FULL_PREFIXES = [
  "/api/killteam/bookings",
  "/api/mtg/bookings",
];

// Session bookings: GET (list) is admin-only; POST (create) is public
const BOOKINGS_PATH = "/api/bookings";

// These routes require admin role for mutations only
const ADMIN_API_PREFIXES = [
  "/api/products",
  "/api/events",
  "/api/sessions",
  "/api/admin",
];

const MUTATION_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const userRole = (req.auth?.user as { role?: string } | undefined)?.role;
  const isMutation = MUTATION_METHODS.includes(req.method);

  // Protect admin pages — require admin role
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Session bookings: GET requires admin (list contains PII), POST is public for creating bookings
  if (pathname.startsWith(BOOKINGS_PATH) && req.method === "GET") {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
    }
  }

  // Admin-only API routes (all methods) — other booking endpoints contain PII
  if (ADMIN_FULL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
    }
  }

  // Admin-only API mutations (products, events, sessions, admin settings)
  if (
    isMutation &&
    ADMIN_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
    }
  }

  // CSRF protection: validate Origin on all API mutations
  if (isMutation && pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin") || req.headers.get("referer");
    const host = req.headers.get("host");
    if (!origin || !host) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Centralized rate limiting for all API mutations
  if (isMutation && pathname.startsWith("/api/")) {
    const ip = getClientIp(req);
    const { success } = rateLimit(ip, { windowMs: 60_000, max: 10 });
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
