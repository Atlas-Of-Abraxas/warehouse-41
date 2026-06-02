"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

const PLACEHOLDER = "/images/placeholder.jpg";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ id: string; total: number } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          notes: notes || undefined,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone({ id: data.id, total: data.total });
        clearCart();
      } else {
        setError(data.error || "Order failed");
      }
    } catch {
      setError("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-20 text-center">
        <div className="rounded-md border border-green-400/30 bg-[var(--color-bg-card)] p-8">
          <div className="text-3xl mb-2">&#10003;</div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text-primary)]">
            Order received
          </h1>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Order <span className="text-[var(--color-accent)]">#{done.id.slice(-6).toUpperCase()}</span>{" "}
            — total <span className="text-[var(--color-text-primary)]">{formatPrice(done.total)}</span>,
            payable in store at pickup. A confirmation has been sent to your email.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)] transition-colors rounded-sm"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Continue shopping
      </Link>

      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--color-text-primary)]">
        Your cart
      </h1>

      {items.length === 0 ? (
        <div className="mt-12 text-center text-[var(--color-text-secondary)]">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Your cart is empty.</p>
          <Link href="/shop" className="mt-2 inline-block text-[var(--color-accent)] hover:underline">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-10">
          {/* Items */}
          <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {items.map((item) => {
              const hasImage = item.image && item.image !== PLACEHOLDER;
              return (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="w-16 h-16 shrink-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-elevated)] flex items-center justify-center overflow-hidden">
                    {hasImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-[var(--color-text-muted)] opacity-30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--color-text-primary)] leading-tight truncate">{item.name}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded-sm border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm text-[var(--color-text-primary)]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded-sm border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="w-20 text-right text-[var(--color-text-primary)] hidden sm:block">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Reserve for pickup */}
          <div>
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span className="text-[var(--color-text-primary)]">{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Reserve for in-store pickup — pay at the counter. We&rsquo;ll email a confirmation.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                {error && (
                  <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
                    {error}
                  </div>
                )}
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                />
                <textarea
                  placeholder="Notes (optional)"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-[var(--color-bg-primary)] py-3 rounded-sm font-medium transition-colors"
                >
                  {loading ? "Placing order…" : "Reserve for pickup"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
