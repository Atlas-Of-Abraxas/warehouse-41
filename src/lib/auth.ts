import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        // Try DB lookup first
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          const valid = await bcrypt.compare(password, user.password);
          if (valid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
          return null;
        }

        return null;
      },
    }),
  ],
});
