"use client";

import { formatDate } from "@/lib/utils";
import { TIME_SLOT_LABELS } from "@/lib/openplay";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type OpenPlayBookingRow = {
  id: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paidInStore: boolean;
  notes: string | null;
};

const STATUSES = ["confirmed", "cancelled", "no_show"] as const;

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function OpenPlayBookingsClient({ initial }: { initial: OpenPlayBookingRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [whenFilter, setWhenFilter] = useState<"all" | "upcoming" | "past">("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const t0 = startOfToday();
    return initial.filter((b) => {
      const day = new Date(b.date).getTime();
      if (whenFilter === "upcoming" && day < t0) return false;
      if (whenFilter === "past" && day >= t0) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q) return true;
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        formatDate(b.date).toLowerCase().includes(q)
      );
    });
  }, [initial, search, statusFilter, whenFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end">
        <label className="text-sm">
          <span className="text-[var(--color-text-secondary)] block mb-1">Search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, date…"
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm min-w-[200px]"
          />
        </label>
        <label className="text-sm">
          <span className="text-[var(--color-text-secondary)] block mb-1">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-[var(--color-text-secondary)] block mb-1">Date</span>
          <select
            value={whenFilter}
            onChange={(e) => setWhenFilter(e.target.value as "all" | "upcoming" | "past")}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
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
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Date</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Slot</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Customer</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Status</th>
                <th className="text-center p-3 text-[var(--color-text-secondary)]">In store</th>
                <th className="text-left p-3 text-[var(--color-text-secondary)]">Notes</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <OpenPlayRow key={b.id} row={b} onSaved={() => router.refresh()} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function OpenPlayRow({ row, onSaved }: { row: OpenPlayBookingRow; onSaved: () => void }) {
  const [status, setStatus] = useState(row.status);
  const [paidInStore, setPaidInStore] = useState(row.paidInStore);
  const [notes, setNotes] = useState(row.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/openplay/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          status,
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

  const slotLabel = TIME_SLOT_LABELS[row.timeSlot] ?? row.timeSlot;

  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 align-top">
      <td className="p-3 whitespace-nowrap">{formatDate(row.date)}</td>
      <td className="p-3">{slotLabel}</td>
      <td className="p-3">
        <div className="font-medium">{row.customerName}</div>
        <div className="text-[var(--color-text-secondary)] text-xs">{row.customerEmail}</div>
      </td>
      <td className="p-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full max-w-[130px] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-2 py-1 text-xs"
        >
          {STATUSES.map((s) => (
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
      <td className="p-3 min-w-[120px]">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-2 py-1 text-xs"
        />
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
        {err && <div className="text-red-400 text-xs mt-1 max-w-[80px]">{err}</div>}
      </td>
    </tr>
  );
}
