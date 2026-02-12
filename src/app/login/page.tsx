"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Warehouse } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect already-logged-in users
  useEffect(() => {
    if (session?.user) {
      const role = (session.user as { role?: string }).role;
      router.push(role === "admin" ? "/admin" : "/");
    }
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      // Refresh to get updated session, then redirect based on role
      router.refresh();
      // The useEffect above will handle the redirect once session updates
      // For immediate redirect, push to home (admins will be redirected by useEffect)
      router.push("/");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Warehouse className="w-10 h-10 text-[var(--color-accent)] mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Warehouse 41
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-accent)] text-white py-2 rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[var(--color-accent)] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
