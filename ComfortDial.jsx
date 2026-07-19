"use client";

import { useEffect, useState } from "react";

const TINTS = [
  { id: "sand", label: "Sand", swatch: "#FAF8F5" },
  { id: "sage", label: "Soft Sage", swatch: "#F1F5F0" },
  { id: "warm", label: "Warm Linen", swatch: "#FAF3EC" },
  { id: "dusk", label: "Quiet Dusk", swatch: "#F4F1F0" },
];

const DENSITIES = [
  { id: "compact", label: "Compact" },
  { id: "comfortable", label: "Comfortable" },
  { id: "spacious", label: "Spacious" },
];

function setPreferenceCookie(name, value) {
  // 180-day cookie so the choice survives across visits, pre- or post-login.
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
}

export default function ComfortDial() {
  const [tint, setTint] = useState("sand");
  const [density, setDensity] = useState("comfortable");
  const [open, setOpen] = useState(false);

  // Sync from whatever the server already rendered onto <html>, so the
  // panel reflects a returning visitor's saved choice on mount.
  useEffect(() => {
    const root = document.documentElement;
    setTint(root.getAttribute("data-tint") || "sand");
    setDensity(root.getAttribute("data-density") || "comfortable");
  }, []);

  function applyTint(id) {
    setTint(id);
    document.documentElement.setAttribute("data-tint", id);
    setPreferenceCookie("ct_tint", id);
  }

  function applyDensity(id) {
    setDensity(id);
    document.documentElement.setAttribute("data-density", id);
    setPreferenceCookie("ct_density", id);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="comfort-dial-panel"
        className="flex items-center gap-2 rounded-full border border-slate/10 bg-white/60 px-4 py-2 text-sm font-medium text-slate-soft backdrop-blur-sm transition hover:border-sage hover:text-slate"
      >
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: TINTS.find((t) => t.id === tint)?.swatch, boxShadow: "0 0 0 1px rgba(44,51,45,0.15)" }}
        />
        Make this page feel like yours
      </button>

      {open && (
        <div
          id="comfort-dial-panel"
          role="dialog"
          aria-label="Reading comfort settings"
          className="absolute right-0 z-20 mt-3 w-[19rem] animate-rise rounded-card border border-slate/10 bg-white/95 p-5 shadow-xl shadow-slate/5 backdrop-blur-md sm:w-[21rem]"
        >
          <p className="font-display text-base text-slate">The Comfort Dial</p>
          <p className="mt-1 text-xs text-slate-soft">
            Set this before you sign in — it stays with you either way.
          </p>

          <fieldset className="mt-4">
            <legend className="text-xs font-semibold uppercase tracking-wide text-slate-soft">
              Background tint
            </legend>
            <div role="radiogroup" aria-label="Background tint" className="mt-2 grid grid-cols-4 gap-2">
              {TINTS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={tint === t.id}
                  onClick={() => applyTint(t.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 transition ${
                    tint === t.id ? "border-sage-deep ring-2 ring-sage/40" : "border-slate/10 hover:border-sage"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-6 w-6 rounded-full border border-slate/10"
                    style={{ backgroundColor: t.swatch }}
                  />
                  <span className="text-[10px] text-slate-soft">{t.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-xs font-semibold uppercase tracking-wide text-slate-soft">
              Text layout density
            </legend>
            <div role="radiogroup" aria-label="Text layout density" className="mt-2 flex overflow-hidden rounded-full border border-slate/10">
              {DENSITIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={density === d.id}
                  onClick={() => applyDensity(d.id)}
                  className={`flex-1 px-2 py-2 text-xs font-medium transition ${
                    density === d.id ? "bg-sage text-white" : "text-slate-soft hover:bg-sage-mist"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </fieldset>

          <p className="mt-4 text-[11px] leading-relaxed text-slate-soft">
            These choices only change how the page looks and reads. Nothing here
            is saved to an account unless you create one.
          </p>
        </div>
      )}
    </div>
  );
}
