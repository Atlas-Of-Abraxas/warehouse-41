"use client";

import { useState } from "react";
import {
  KILL_TEAMS,
  TERRAIN_SETS,
  SCHEDULE_DAYS,
  TIME_SLOTS as KT_SLOTS,
  TIME_SLOT_LABELS as KT_LABELS,
} from "@/lib/killteam";
import {
  TIME_SLOTS as MTG_SLOTS,
  TIME_SLOT_LABELS as MTG_LABELS,
  REGULAR_SLOT_PRICE,
} from "@/lib/mtg";

const inputClass =
  "w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none";

function optionClass(active: boolean, disabled = false) {
  if (active)
    return "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]";
  if (disabled)
    return "border-[var(--color-border)] text-[var(--color-text-secondary)] opacity-40 cursor-not-allowed";
  return "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]";
}

export default function BookATableForm() {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [addKillTeam, setAddKillTeam] = useState(false);
  const [ktSlot, setKtSlot] = useState("");
  const [terrain, setTerrain] = useState("");
  const [teams, setTeams] = useState<string[]>([]);

  const [addMtg, setAddMtg] = useState(false);
  const [mtgSlot, setMtgSlot] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ktDone, setKtDone] = useState(false);
  const [mtgDone, setMtgDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function toggleTeam(teamName: string) {
    setTeams((prev) => {
      if (prev.includes(teamName)) return prev.filter((t) => t !== teamName);
      if (prev.length >= 2) return prev;
      return [...prev, teamName];
    });
  }

  function isKtDay(dateStr: string) {
    if (!dateStr) return false;
    const d = new Date(dateStr + "T00:00:00Z");
    return (SCHEDULE_DAYS as readonly number[]).includes(d.getUTCDay());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!addKillTeam && !addMtg) {
      setError("Add a Kill Team rental or an MTG session to your table.");
      return;
    }
    if (addKillTeam && !ktDone) {
      if (!isKtDay(date)) {
        setError("Kill Team rentals are only available Monday, Tuesday, Wednesday, and Saturday.");
        return;
      }
      if (!ktSlot) return setError("Choose a Kill Team time slot.");
      if (!terrain) return setError("Choose a terrain set for your Kill Team rental.");
      if (teams.length < 1) return setError("Choose 1–2 kill teams to borrow.");
    }
    if (addMtg && !mtgDone && !mtgSlot) {
      return setError("Choose an MTG time slot.");
    }

    setLoading(true);
    const iso = new Date(date + "T00:00:00Z").toISOString();
    let ktOk = ktDone;
    let mtgOk = mtgDone;
    const errors: string[] = [];

    if (addKillTeam && !ktOk) {
      try {
        const r = await fetch("/api/killteam/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: iso,
            timeSlot: ktSlot,
            terrain,
            teams,
            customerName: name,
            customerEmail: email,
          }),
        });
        const d = await r.json();
        if (r.ok) ktOk = true;
        else errors.push(`Kill Team rental: ${d.error || "booking failed"}`);
      } catch {
        errors.push("Kill Team rental: request failed, please try again.");
      }
    }

    if (addMtg && !mtgOk) {
      try {
        const r = await fetch("/api/mtg/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: iso,
            timeSlot: mtgSlot,
            customerName: name,
            customerEmail: email,
          }),
        });
        const d = await r.json();
        if (r.ok) mtgOk = true;
        else errors.push(`MTG session: ${d.error || "booking failed"}`);
      } catch {
        errors.push("MTG session: request failed, please try again.");
      }
    }

    setKtDone(ktOk);
    setMtgDone(mtgOk);
    setLoading(false);

    if ((!addKillTeam || ktOk) && (!addMtg || mtgOk)) {
      setSubmitted(true);
    } else {
      setError(errors.join("  ·  ") || "Booking failed.");
    }
  }

  if (submitted) {
    return (
      <div className="bg-[var(--color-bg-card)] border border-green-400/30 rounded-md p-6 md:p-8 text-center">
        <div className="text-3xl mb-2">&#10003;</div>
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text-primary)]">
          Your table is booked
        </h3>
        <ul className="mt-4 inline-block text-left text-sm text-[var(--color-text-secondary)] space-y-1">
          {addKillTeam && (
            <li>
              <span className="text-[var(--color-accent)]">Kill Team rental</span> — {KT_LABELS[ktSlot]},{" "}
              {terrain}, {teams.join(" & ")}
            </li>
          )}
          {addMtg && (
            <li>
              <span className="text-[var(--color-accent)]">MTG session</span> — {MTG_LABELS[mtgSlot]}{" "}
              (${REGULAR_SLOT_PRICE}/seat)
            </li>
          )}
        </ul>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Confirmation details will be sent to {email}. Payable at the store.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-md p-6 md:p-8"
    >
      {error && (
        <div className="mb-5 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-2">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Date</label>
          <input
            type="date"
            required
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
          {addKillTeam && date && !isKtDay(date) && (
            <p className="mt-1 text-xs text-red-400">
              Kill Team rentals are Mon, Tue, Wed & Sat only.
            </p>
          )}
        </div>

        {/* ---------- Add-ons ---------- */}
        <fieldset className="space-y-4">
          <legend className="eyebrow mb-1">Add to your table</legend>

          {/* Kill Team rental */}
          <div className="rounded-sm border border-[var(--color-border)] p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={addKillTeam}
                disabled={ktDone}
                onChange={(e) => setAddKillTeam(e.target.checked)}
                className="accent-[var(--color-accent)] w-4 h-4"
              />
              <span className="text-[var(--color-text-primary)] font-medium">
                Kill Team rental
              </span>
              {ktDone && <span className="text-xs text-green-400">✓ booked</span>}
              <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                Mon / Tue / Wed / Sat
              </span>
            </label>

            {addKillTeam && !ktDone && (
              <div className="mt-4 space-y-4">
                {/* KT time slot */}
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
                    Time slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {KT_SLOTS.map((slot) => (
                      <label
                        key={slot}
                        className={`text-center cursor-pointer border rounded-sm px-3 py-2 text-sm font-medium transition-colors ${optionClass(
                          ktSlot === slot
                        )}`}
                      >
                        <input
                          type="radio"
                          name="ktSlot"
                          value={slot}
                          checked={ktSlot === slot}
                          onChange={() => setKtSlot(slot)}
                          className="sr-only"
                        />
                        {KT_LABELS[slot]}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terrain */}
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
                    Terrain set
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TERRAIN_SETS.map((t) => (
                      <label
                        key={t.name}
                        className={`cursor-pointer border rounded-sm px-3 py-2 text-sm font-medium transition-colors ${optionClass(
                          terrain === t.name
                        )}`}
                      >
                        <input
                          type="radio"
                          name="terrain"
                          value={t.name}
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
                    Kill teams <span className="text-xs">(borrow up to 2)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {KILL_TEAMS.map((kt) => {
                      const checked = teams.includes(kt.team);
                      const disabled = !checked && teams.length >= 2;
                      return (
                        <label
                          key={kt.team}
                          className={`flex items-center gap-2 cursor-pointer border rounded-sm px-3 py-2 text-sm transition-colors ${optionClass(
                            checked,
                            disabled
                          )}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleTeam(kt.team)}
                            className="accent-[var(--color-accent)]"
                          />
                          <span>
                            {kt.team}{" "}
                            <span className="text-xs text-[var(--color-text-secondary)]">
                              ({kt.faction})
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MTG session */}
          <div className="rounded-sm border border-[var(--color-border)] p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={addMtg}
                disabled={mtgDone}
                onChange={(e) => setAddMtg(e.target.checked)}
                className="accent-[var(--color-accent)] w-4 h-4"
              />
              <span className="text-[var(--color-text-primary)] font-medium">MTG session</span>
              {mtgDone && <span className="text-xs text-green-400">✓ booked</span>}
              <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                ${REGULAR_SLOT_PRICE}/seat
              </span>
            </label>

            {addMtg && !mtgDone && (
              <div className="mt-4">
                <label className="block text-sm text-[var(--color-text-secondary)] mb-2">
                  Time slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MTG_SLOTS.map((slot) => (
                    <label
                      key={slot}
                      className={`text-center cursor-pointer border rounded-sm px-3 py-2 text-sm font-medium transition-colors ${optionClass(
                        mtgSlot === slot
                      )}`}
                    >
                      <input
                        type="radio"
                        name="mtgSlot"
                        value={slot}
                        checked={mtgSlot === slot}
                        onChange={() => setMtgSlot(slot)}
                        className="sr-only"
                      />
                      {MTG_LABELS[slot]}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </fieldset>

        {/* Name */}
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
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
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading || (!addKillTeam && !addMtg)}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-[var(--color-bg-primary)] py-3 rounded-sm font-medium transition-colors"
        >
          {loading ? "Booking..." : "Book table"}
        </button>
      </div>
    </form>
  );
}
