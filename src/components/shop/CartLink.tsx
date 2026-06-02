"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CartLink() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-sm border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
      aria-label={`Cart (${itemCount} item${itemCount === 1 ? "" : "s"})`}
    >
      <ShoppingCart className="w-4 h-4" />
      Cart
      {itemCount > 0 && (
        <span className="ml-0.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] text-xs font-medium">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
