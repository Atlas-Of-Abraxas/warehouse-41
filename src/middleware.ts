import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PROTECTED_API_PREFIXES = [
  "/api/products",
  "/api/events",
  "/api/sessions",
  "/api/bookings",
  "/api/admin",
];

const MUTATION_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const userRole = (req.auth?.user as { role?: string } | undefined)?.role;

  // Protect admin pages — require admin role
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect mutation API routes (leave GET and /api/checkout and /api/auth public)
  if (
    MUTATION_METHODS.includes(req.method) &&
    PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
    !isLoggedIn
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Protect admin API routes — require admin role
  if (
    pathname.startsWith("/api/admin") &&
    MUTATION_METHODS.includes(req.method) &&
    userRole !== "admin"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
