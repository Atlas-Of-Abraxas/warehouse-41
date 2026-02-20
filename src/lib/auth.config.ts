import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "customer";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      if (isAdmin && !isLoggedIn) return false;
      return true;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [], // added in auth.ts with full server-side providers
} satisfies NextAuthConfig;
