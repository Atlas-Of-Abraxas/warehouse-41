"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Sword,
  Users,
  Crosshair,
  Sparkles,
  Settings,
  Menu,
  X,
} from "lucide-react";

// Products: route remains at /admin/products for future catalogue work (not linked here while the public shop is off).
const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/sessions", label: "Sessions", icon: Sword },
  { href: "/admin/bookings", label: "Bookings", icon: Users },
  { href: "/admin/killteam-bookings", label: "Kill Team", icon: Crosshair },
  { href: "/admin/mtg-bookings", label: "MTG", icon: Sparkles },
];

const bottomItems = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-[var(--color-accent)] text-white"
        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]"
    }`;

  const sidebar = (
    <nav className="flex flex-col h-full py-4 px-3">
      <div className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={linkClass(href)}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </Link>
        ))}
      </div>
      <div className="border-t border-[var(--color-border)] pt-3 mt-3 space-y-1">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={linkClass(href)}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 shrink-0 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]">
        {sidebar}
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--color-accent)] text-white p-3 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 w-56 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] z-40 mt-16">
            {sidebar}
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 px-4 py-8 md:px-8 max-w-7xl">{children}</div>
    </div>
  );
}
