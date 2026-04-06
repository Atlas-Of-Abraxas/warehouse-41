import NextAuth, { type NextAuthRequest } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { mergeSupabaseCookies, updateSession } from "@/utils/supabase/middleware";

const { auth } = NextAuth(authConfig);

const ADMIN_FULL_PREFIXES = [
  "/api/killteam/bookings",
  "/api/mtg/bookings",
];

const BOOKINGS_PATH = "/api/bookings";

const ADMIN_ORDERS_PATH = "/api/admin/orders";

const ADMIN_API_PREFIXES = [
  "/api/products",
  "/api/events",
  "/api/sessions",
  "/api/admin",
];

const MUTATION_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

function runAuthRules(req: NextAuthRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const userRole = (req.auth?.user as { role?: string } | undefined)?.role;
  const isMutation = MUTATION_METHODS.includes(req.method);

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith(BOOKINGS_PATH) && req.method === "GET") {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
    }
  }

  if (pathname.startsWith(ADMIN_ORDERS_PATH)) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
    }
  }

  // Product/inventory API: admin-only until a public shop is re-enabled.
  if (pathname.startsWith("/api/products")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
    }
  }

  if (ADMIN_FULL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
    }
  }

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

  if (isMutation && pathname.startsWith("/api/")) {
    const ip = getClientIp(req);
    if (pathname === "/api/admin/ai/chat") {
      const userId = (req.auth?.user as { id?: string } | undefined)?.id;
      const keyBase = userId ? `aiu:${userId}` : `aip:${ip}`;
      const hour = rateLimit(`${keyBase}:h`, { windowMs: 3_600_000, max: 40 });
      if (!hour.success) {
        return NextResponse.json(
          { error: "AI usage limit reached for this hour." },
          { status: 429 }
        );
      }
      const minute = rateLimit(`${keyBase}:m`, { windowMs: 60_000, max: 8 });
      if (!minute.success) {
        return NextResponse.json(
          { error: "Too many AI requests. Please wait a minute." },
          { status: 429 }
        );
      }
    } else {
      const { success } = rateLimit(ip, { windowMs: 60_000, max: 10 });
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }
  }

  return NextResponse.next();
}

export default auth(async (req) => {
  const supabaseResponse = await updateSession(req);
  const authResponse = runAuthRules(req);
  return mergeSupabaseCookies(supabaseResponse, authResponse);
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
