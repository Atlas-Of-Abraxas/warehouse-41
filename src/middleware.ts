import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// These routes require admin role for mutations (POST/PUT/DELETE/PATCH)
const ADMIN_API_PREFIXES = [
  "/api/products",
  "/api/events",
  "/api/sessions",
  "/api/admin",
];

// These routes require any authenticated user for mutations
const AUTH_API_PREFIXES = [
  "/api/bookings",
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

  // Auth-required API mutations (bookings — any logged-in user)
  if (
    isMutation &&
    AUTH_API_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
    !isLoggedIn
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
