"use client";

import { useEffect, useState } from "react";
import { formatDate, formatPrice, GAME_SYSTEMS } from "@/lib/utils";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Session {
  id: string;
  title: string;
  description: string;
  gameSystem: string;
  gmName: string;
  date: string;
  duration: number;
  price: number;
  maxPlayers: number;
  currentPlayers: number;
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editing, setEditing] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchSessions(); }, []);

  async function fetchSessions() {
    const res = await fetch("/api/sessions");
    setSessions(await res.json());
  }

  async function handleSave(data: Record<string, unknown>) {
    if (editing) {
      await fetch(`/api/sessions/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setEditing(null);
    setShowForm(false);
    fetchSessions();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    fetchSessions();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Sessions</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Session
        </button>
      </div>

      {showForm && (
        <SessionForm
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
              <th className="text-left p-4 text-[var(--color-text-secondary)]">System</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">GM</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Date</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Players</th>
              <th className="text-left p-4 text-[var(--color-text-secondary)]">Price</th>
              <th className="text-right p-4 text-[var(--color-text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-4 font-medium">{s.title}</td>
                <td className="p-4 text-[var(--color-text-secondary)]">{GAME_SYSTEMS[s.gameSystem] || s.gameSystem}</td>
                <td className="p-4 text-[var(--color-text-secondary)]">{s.gmName}</td>
                <td className="p-4 text-[var(--color-text-secondary)]">{formatDate(s.date)}</td>
                <td className="p-4">{s.currentPlayers}/{s.maxPlayers}</td>
                <td className="p-4 text-[var(--color-gold)]">{formatPrice(s.price)}</td>
                <td className="p-4 text-right">
                  <button onClick={() => { setEditing(s); setShowForm(true); }} className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mr-2">
                    <Pencil className="w-4 h-4 inline" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-[var(--color-text-secondary)] hover:text-red-400">
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

function SessionForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Session | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [gameSystem, setGameSystem] = useState(initial?.gameSystem || "DND");
  const [gmName, setGmName] = useState(initial?.gmName || "");
  const [date, setDate] = useState(initial?.date ? new Date(initial.date).toISOString().slice(0, 16) : "");
  const [duration, setDuration] = useState(initial?.duration?.toString() || "240");
  const [price, setPrice] = useState(initial?.price?.toString() || "10");
  const [maxPlayers, setMaxPlayers] = useState(initial?.maxPlayers?.toString() || "6");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      title, description, gameSystem, gmName,
      date: new Date(date).toISOString(),
      duration: parseInt(duration),
      price: parseFloat(price),
      maxPlayers: parseInt(maxPlayers),
    });
  }

  const inputClass = "w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{initial ? "Edit Session" : "New Session"}</h2>
        <button type="button" onClick={onCancel}><X className="w-5 h-5 text-[var(--color-text-secondary)]" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Game System</label>
          <select value={gameSystem} onChange={(e) => setGameSystem(e.target.value)} className={inputClass}>
            {Object.entries(GAME_SYSTEMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">GM Name</label>
          <input type="text" required value={gmName} onChange={(e) => setGmName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Date & Time</label>
          <input type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Duration (minutes)</label>
          <input type="number" required value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Price per seat</label>
          <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Max Players</label>
          <input type="number" required value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors">
        {initial ? "Update Session" : "Create Session"}
      </button>
    </form>
  );
}
