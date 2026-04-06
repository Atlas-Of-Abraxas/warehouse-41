"use client";

import { formatDate, formatPrice } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type SessionBookingRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  seats: number;
  status: string;
  paymentStatus: string;
  paidInStore: boolean;
  notes: string | null;
  createdAt: string;
  sessionTitle: string;
  sessionPrice: number;
};

const BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "no_show"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "refunded"] as const;

export default function SessionBookingsClient({
  initial,
}: {
  initial: SessionBookingRow[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initial.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (paymentFilter !== "all" && b.paymentStatus !== paymentFilter) return false;
      if (!q) return true;
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.sessionTitle.toLowerCase().includes(q)
      );
    });
  }, [initial, search, statusFilter, paymentFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end">
        <label className="text-sm">
          <span className="text-[var(--color-text-secondary)] block mb-1">Search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, session…"
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm min-w-[200px]"
          />
        </label>
        <label className="text-sm">
          <span className="text-[var(--color-text-secondary)] block mb-1">Booking status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-[var(--color-text-secondary)] block mb-1">Payment</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <span className="text-sm text-[var(--color-text-secondary)] pb-2">
          Showing {filtered.length} of {initial.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No bookings match filters.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Customer</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Session</th>
                <th className="text-right p-3 text-[var(--color-text-secondary)]">Seats / Total</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Booking</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Payment</th>
                <th className="text-center p-3 text-[var(--color-text-secondary)]">In store</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Notes</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Booked</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <SessionRow key={b.id} row={b} onSaved={() => router.refresh()} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SessionRow({
  row,
  onSaved,
}: {
  row: SessionBookingRow;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState(row.status);
  const [paymentStatus, setPaymentStatus] = useState(row.paymentStatus);
  const [paidInStore, setPaidInStore] = useState(row.paidInStore);
  const [notes, setNotes] = useState(row.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          status,
          paymentStatus,
          paidInStore,
          notes: notes.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? "Save failed");
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 align-top">
      <td className="p-3">
        <div className="font-medium">{row.customerName}</div>
        <div className="text-[var(--color-text-secondary)] text-xs">{row.customerEmail}</div>
      </td>
      <td className="p-3">{row.sessionTitle}</td>
      <td className="p-3 text-right whitespace-nowrap">
        {row.seats} × {formatPrice(row.sessionPrice)}
        <div className="text-[var(--color-gold)] font-medium">{formatPrice(row.seats * row.sessionPrice)}</div>
      </td>
      <td className="p-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full max-w-[130px] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-2 py-1 text-xs"
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="p-3">
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full max-w-[120px] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-2 py-1 text-xs"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="p-3 text-center">
        <input
          type="checkbox"
          checked={paidInStore}
          onChange={(e) => setPaidInStore(e.target.checked)}
          className="accent-[var(--color-accent)]"
        />
      </td>
      <td className="p-3 min-w-[140px]">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-2 py-1 text-xs"
        />
      </td>
      <td className="p-3 text-[var(--color-text-secondary)] whitespace-nowrap text-xs">
        {formatDate(row.createdAt)}
      </td>
      <td className="p-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="text-xs bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white px-3 py-1.5 rounded"
        >
          {saving ? "…" : "Save"}
        </button>
        {err && <div className="text-red-400 text-xs mt-1 max-w-[100px]">{err}</div>}
      </td>
    </tr>
  );
}
