"use client";

import { useState } from "react";
import { KILL_TEAMS, TERRAIN_SETS, TIME_SLOTS, TIME_SLOT_LABELS, SCHEDULE_DAYS } from "@/lib/killteam";

export default function KillTeamBookingForm() {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [terrain, setTerrain] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleTeamToggle(teamName: string) {
    setSelectedTeams((prev) => {
      if (prev.includes(teamName)) return prev.filter((t) => t !== teamName);
      if (prev.length >= 2) return prev;
      return [...prev, teamName];
    });
  }

  function validateDay(dateStr: string): boolean {
    if (!dateStr) return false;
    const d = new Date(dateStr + "T00:00:00Z");
    return (SCHEDULE_DAYS as readonly number[]).includes(d.getUTCDay());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateDay(date)) {
      setError("Kill Team tables are only available Monday, Tuesday, Wednesday, and Saturday.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/killteam/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(date + "T00:00:00Z").toISOString(),
          timeSlot,
          terrain,
          teams: selectedTeams,
          customerName: name,
          customerEmail: email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Booking failed");
      }
    } catch {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  if (success) {
    return (
      <div className="bg-[var(--color-bg-card)] border border-green-400/30 rounded-lg p-6 text-center">
        <div className="text-3xl mb-2">&#10003;</div>
        <h3 className="text-lg font-semibold text-green-400">Table Booked!</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Confirmation details will be sent to {email}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Book a Kill Team Table</h3>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Date */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Date <span className="text-xs">(Mon / Tue / Wed / Sat only)</span>
          </label>
          <input
            type="date"
            required
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
            Time Slot
          </label>
          <div className="flex gap-3">
            {TIME_SLOTS.map((slot) => (
              <label
                key={slot}
                className={`flex-1 text-center cursor-pointer border rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  timeSlot === slot
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]"
                }`}
              >
                <input
                  type="radio"
                  name="timeSlot"
                  value={slot}
                  required
                  checked={timeSlot === slot}
                  onChange={() => setTimeSlot(slot)}
                  className="sr-only"
                />
                {TIME_SLOT_LABELS[slot]}
              </label>
            ))}
          </div>
        </div>

        {/* Terrain */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
            Terrain Set
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TERRAIN_SETS.map((t) => (
              <label
                key={t.name}
                className={`cursor-pointer border rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  terrain === t.name
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]"
                }`}
              >
                <input
                  type="radio"
                  name="terrain"
                  value={t.name}
                  required
                  checked={terrain === t.name}
                  onChange={() => setTerrain(t.name)}
                  className="sr-only"
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>

        {/* Teams */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
            Kill Teams <span className="text-xs">(select up to 2)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {KILL_TEAMS.map((kt) => {
              const checked = selectedTeams.includes(kt.team);
              const disabled = !checked && selectedTeams.length >= 2;
              return (
                <label
                  key={kt.team}
                  className={`flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 text-sm transition-colors ${
                    checked
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : disabled
                      ? "border-[var(--color-border)] text-[var(--color-text-secondary)] opacity-40 cursor-not-allowed"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => handleTeamToggle(kt.team)}
                    className="accent-[var(--color-accent)]"
                  />
                  <span>
                    {kt.team}{" "}
                    <span className="text-xs text-[var(--color-text-secondary)]">({kt.faction})</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || selectedTeams.length === 0}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Booking..." : "Book Table"}
        </button>
      </div>
    </form>
  );
}
