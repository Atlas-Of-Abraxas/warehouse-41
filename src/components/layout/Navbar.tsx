"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogIn, LogOut, UserPlus } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/killteam", label: "Kill Team" },
  { href: "/mtg", label: "MTG" },
  { href: "/shop", label: "Shop" },
  { href: "/book-a-table", label: "Book a Table" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = role === "admin";

  return (
    <nav className="bg-[var(--color-bg-primary)]/85 backdrop-blur-md border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="Warehouse 41 — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Warehouse 41" className="h-9 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                {session.user?.name && (
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {session.user.name}
                  </span>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1 text-[var(--color-accent)] hover:opacity-80 transition-opacity"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden -mr-2 p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="px-4 py-3 space-y-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-sm px-3 py-3 text-base text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)] transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="px-4 pb-5 pt-3 border-t border-[var(--color-border)]">
            {session ? (
              <>
                {session.user?.name && (
                  <p className="px-3 pb-3 text-xs text-[var(--color-text-muted)]">
                    Signed in as {session.user.name}
                  </p>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block rounded-sm px-3 py-3 text-base text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm border border-[var(--color-border-bright)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-sm border border-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 rounded-sm bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-hover)] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <UserPlus className="w-4 h-4" /> Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
