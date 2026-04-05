"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Warehouse, LogIn, LogOut, UserPlus } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/killteam", label: "Kill Team" },
  { href: "/mtg", label: "MTG" },
  { href: "/mtg#book", label: "Book a Table" },
  { href: "/booking", label: "Book a Session" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = role === "admin";

  return (
    <nav className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--color-accent)]">
            <Warehouse className="w-6 h-6" />
            Warehouse 41
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
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
            className="md:hidden text-[var(--color-text-secondary)]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              {session.user?.name && (
                <div className="px-4 py-2 text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border)]">
                  Signed in as {session.user.name}
                </div>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)]"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }}
                className="block w-full text-left px-4 py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-4 py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)]"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-4 py-3 text-[var(--color-accent)] hover:bg-[var(--color-bg-card)]"
                onClick={() => setOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
