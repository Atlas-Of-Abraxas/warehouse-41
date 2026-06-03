"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair, X } from "lucide-react";
import { KILL_TEAMS } from "@/lib/killteam";

type Team = (typeof KILL_TEAMS)[number];

export default function KillTeamRoster() {
  const [active, setActive] = useState<Team | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    if (active) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      // Move focus into the modal so Esc works without an extra tap.
      closeRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {KILL_TEAMS.map((kt) => (
          <button
            key={kt.team}
            type="button"
            onClick={() => setActive(kt)}
            className="group relative text-left rounded-md overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)] focus:outline-none focus-visible:border-[var(--color-accent)] transition-colors bg-[var(--color-bg-card)]"
            aria-label={`Read about ${kt.team}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-elevated)]">
              {kt.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={kt.image}
                    alt={`${kt.team} — ${kt.faction}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(14,11,10,0.92) 0%, rgba(14,11,10,0.25) 45%, transparent 70%)",
                    }}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)]">
                  <Crosshair className="w-8 h-8 text-[var(--color-accent)] opacity-60" />
                  <span className="text-xs uppercase tracking-[0.18em]">Photo coming</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <p className="eyebrow">{kt.faction}</p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-base sm:text-xl text-[var(--color-text-primary)] leading-tight">
                  {kt.team}
                </h3>
                <span className="mt-1 inline-block text-xs text-[var(--color-accent)] sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  Read bio →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${active.team} bio`}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-lg sm:rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 p-3 sm:p-2 rounded-sm bg-[var(--color-bg-primary)]/70 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {active.image ? (
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt={`${active.team} — ${active.faction}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, var(--color-bg-card) 2%, rgba(29,23,20,0.2) 50%, transparent 75%)",
                  }}
                />
              </div>
            ) : (
              <div className="aspect-[4/3] flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)]">
                <Crosshair className="w-10 h-10 text-[var(--color-accent)] opacity-60" />
                <span className="text-xs uppercase tracking-[0.18em]">Photo coming</span>
              </div>
            )}

            <div className="p-6">
              <p className="eyebrow">{active.faction}</p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text-primary)]">
                {active.team}
              </h3>
              <p className="mt-4 text-[var(--color-text-secondary)] leading-relaxed">
                {active.blurb}
              </p>
              <a
                href="#book"
                onClick={() => setActive(null)}
                className="mt-6 flex sm:inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-3 sm:py-2.5 text-sm font-medium border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)] transition-colors rounded-sm"
              >
                Borrow this team
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
