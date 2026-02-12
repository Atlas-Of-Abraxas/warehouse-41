"use client";

import { useEffect, useState } from "react";
import { formatDate, formatPrice, EVENT_TYPES } from "@/lib/utils";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  capacity: number;
  registered: number;
  price: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    const res = await fetch("/api/events");
    setEvents(await res.json());
  }

  async function handleSave(data: Record<string, unknown>) {
    if (editing) {
      await fetch(`/api/events/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setEditing(null);
    setShowForm(false);
    fetchEvents();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    fetchEvents();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {showForm && (
        <EventForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Title</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Type</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Date</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Capacity</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Price</th>
              <th className="text-right p-4 text-[var(--color-text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-4 font-medium">{e.title}</td>
                <td className="p-4 text-[var(--color-text-secondary)]">{EVENT_TYPES[e.type] || e.type}</td>
                <td className="p-4 text-[var(--color-text-secondary)]">{formatDate(e.date)}</td>
                <td className="p-4">{e.registered}/{e.capacity}</td>
                <td className="p-4 text-[var(--color-gold)]">{e.price > 0 ? formatPrice(e.price) : "Free"}</td>
                <td className="p-4 text-right">
                  <button onClick={() => { setEditing(e); setShowForm(true); }} className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mr-2">
                    <Pencil className="w-4 h-4 inline" />
                  </button>
                  <button onClick={() => handleDelete(e.id)} className="text-[var(--color-text-secondary)] hover:text-red-400">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Event | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [date, setDate] = useState(initial?.date ? new Date(initial.date).toISOString().slice(0, 16) : "");
  const [type, setType] = useState(initial?.type || "MTG_TOURNAMENT");
  const [capacity, setCapacity] = useState(initial?.capacity?.toString() || "32");
  const [price, setPrice] = useState(initial?.price?.toString() || "0");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      title,
      description,
      date: new Date(date).toISOString(),
      type,
      capacity: parseInt(capacity),
      price: parseFloat(price),
    });
  }

  const inputClass = "w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{initial ? "Edit Event" : "New Event"}</h2>
        <button type="button" onClick={onCancel}><X className="w-5 h-5 text-[var(--color-text-secondary)]" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {Object.entries(EVENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Date & Time</label>
          <input type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Capacity</label>
          <input type="number" required value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Price (0 for free)</label>
          <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors">
        {initial ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
}
