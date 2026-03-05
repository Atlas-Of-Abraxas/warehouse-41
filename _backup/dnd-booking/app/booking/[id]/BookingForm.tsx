"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface BookingFormProps {
  sessionId: string;
  price: number;
  spotsLeft: number;
}

export default function BookingForm({ sessionId, price, spotsLeft }: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, customerName: name, customerEmail: email, seats }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        alert(data.error || "Booking failed");
      }
    } catch {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-[var(--color-bg-card)] border border-green-400/30 rounded-lg p-6 text-center">
        <div className="text-3xl mb-2">&#10003;</div>
        <h3 className="text-lg font-semibold text-green-400">Booking Confirmed!</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          A confirmation has been sent to {email}.
        </p>
      </div>
    );
  }

  if (spotsLeft <= 0) {
    return (
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-400">Session Full</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          This session has no available spots.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Book Your Seat</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
            Seats (max {spotsLeft})
          </label>
          <select
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          >
            {Array.from({ length: Math.min(spotsLeft, 4) }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-[var(--color-border)] pt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--color-text-secondary)]">
              {seats} seat(s) x {formatPrice(price)}
            </span>
            <span className="text-[var(--color-gold)] font-bold">
              {formatPrice(seats * price)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Booking..." : `Book Now - ${formatPrice(seats * price)}`}
        </button>
      </div>
    </form>
  );
}
