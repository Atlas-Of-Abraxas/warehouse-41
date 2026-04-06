"use client";

import { useState } from "react";
import { formatDate, formatPrice } from "@/lib/utils";

export type OrderAdminRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  posReference: string | null;
  notes: string | null;
  stripePaymentId: string | null;
  createdAt: string;
  items: { id: string; quantity: number; price: number; product: { name: string } }[];
};

const STATUSES = ["pending", "paid", "fulfilled", "cancelled"] as const;

export default function OrdersTable({ initial }: { initial: OrderAdminRow[] }) {
  return (
    <div className="space-y-8">
      {initial.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">
          No orders yet. Orders can be created when you wire POS or manual entry later.
        </p>
      ) : (
        initial.map((order) => <OrderRow key={order.id} order={order} />)
      )}
    </div>
  );
}

function OrderRow({ order }: { order: OrderAdminRow }) {
  const [status, setStatus] = useState(order.status);
  const [posReference, setPosReference] = useState(order.posReference ?? "");
  const [notes, setNotes] = useState(order.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          status,
          posReference: posReference.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const lineItems = order.items
    .map((i) => `${i.quantity}× ${i.product.name} (${formatPrice(i.price)})`)
    .join(" · ");

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-semibold text-lg">{order.customerName}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{order.customerEmail}</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {formatDate(order.createdAt)} · Total {formatPrice(order.total)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[var(--color-gold)] font-bold">{formatPrice(order.total)}</p>
          {order.stripePaymentId && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Legacy ref: {order.stripePaymentId}
            </p>
          )}
        </div>
      </div>

      {lineItems && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-4 border-b border-[var(--color-border)] pb-3">
          {lineItems}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <label className="block text-sm">
          <span className="text-[var(--color-text-secondary)]">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="text-[var(--color-text-secondary)]">POS / receipt ref</span>
          <input
            type="text"
            value={posReference}
            onChange={(e) => setPosReference(e.target.value)}
            placeholder="Receipt # or POS id"
            className="mt-1 w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block text-sm mb-4">
        <span className="text-[var(--color-text-secondary)]">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-sm text-green-400">Saved</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </div>
  );
}
