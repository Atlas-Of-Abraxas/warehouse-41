"use client";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)] opacity-30" />
        <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Browse our shop to find something you&apos;ll love.
        </p>
        <Link
          href="/shop"
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-[var(--color-bg-secondary)] rounded flex items-center justify-center shrink-0">
              <ShoppingCart className="w-6 h-6 text-[var(--color-text-secondary)] opacity-30" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-[var(--color-gold)] font-semibold">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <span className="text-[var(--color-gold)] font-bold w-24 text-right">
              {formatPrice(item.price * item.quantity)}
            </span>

            <button
              onClick={() => removeItem(item.id)}
              className="text-[var(--color-text-secondary)] hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg">Total</span>
          <span className="text-2xl font-bold text-[var(--color-gold)]">
            {formatPrice(total)}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </button>

        <div className="flex items-center justify-between mt-4">
          <Link
            href="/shop"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            Continue Shopping
          </Link>
          <button
            onClick={clearCart}
            className="text-sm text-[var(--color-text-secondary)] hover:text-red-400"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
