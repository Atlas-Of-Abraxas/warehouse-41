"use client";

import { useState } from "react";
import { TIME_SLOTS, TIME_SLOT_LABELS, REGULAR_SLOT_PRICE } from "@/lib/mtg";

export default function MTGBookingForm() {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/mtg/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(date + "T00:00:00Z").toISOString(),
          timeSlot,
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
        <h3 className="text-lg font-semibold text-green-400">Time Slot Booked!</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Confirmation details will be sent to {email}.
          <span className="block mt-1 text-[var(--color-gold)]">
            ${REGULAR_SLOT_PRICE} per seat — payable at the store.
          </span>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Book a Time Slot</h3>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Date */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Date <span className="text-xs">(every day)</span>
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
          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot) => (
              <label
                key={slot}
                className={`text-center cursor-pointer border rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            ${REGULAR_SLOT_PRICE} per seat
          </p>
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
          disabled={loading}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Booking..." : `Book Slot — $${REGULAR_SLOT_PRICE}/seat`}
        </button>
      </div>
    </form>
  );
}
