"use client";

import { REMEDY_PHASES, REMEDY_SYMPTOMS } from "@/lib/remedyEngine";

const SYMPTOM_LABELS = {
  cramps: "Cramps",
  bloating: "Bloating",
  fatigue: "Fatigue",
  headache: "Headache",
  moodSwings: "Mood swings",
  acne: "Acne flare-up",
  nausea: "Nausea",
};

export default function RemedyIntakeForm({ value, onChange, onSubmit, isEvaluating }) {
  const { triggerFood, phase, symptoms } = value;

  function toggleSymptom(id) {
    const next = symptoms.includes(id)
      ? symptoms.filter((s) => s !== id)
      : [...symptoms, id];
    onChange({ ...value, symptoms: next });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="rounded-card border border-slate/10 bg-white/70 p-6 sm:p-8"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-soft">Part A — tell me what's going on</p>
      <h2 className="mt-3 font-display text-2xl text-slate">A quick check-in first</h2>
      <p className="mt-2 text-sm text-slate-soft">
        Nothing here needs to be precise. A sentence is enough — I just need a sense of what you're working with.
      </p>

      <div className="stack mt-7">
        <div>
          <label htmlFor="triggerFood" className="block text-sm font-semibold text-slate">
            What did you eat that disturbed your system?
          </label>
          <textarea
            id="triggerFood"
            rows={3}
            value={triggerFood}
            onChange={(e) => onChange({ ...value, triggerFood: e.target.value })}
            placeholder="e.g. iced coffee and a fried lunch"
            className="mt-2 w-full rounded-xl border border-slate/15 bg-sand px-4 py-3 text-sm text-slate placeholder:text-slate-soft/60 focus:border-sage focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="phase" className="block text-sm font-semibold text-slate">
            Current phase
          </label>
          <select
            id="phase"
            value={phase}
            onChange={(e) => onChange({ ...value, phase: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate/15 bg-sand px-4 py-3 text-sm text-slate focus:border-sage focus:outline-none"
          >
            {Object.entries(REMEDY_PHASES).map(([id, p]) => (
              <option key={id} value={id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-soft">Not sure? Menstrual = currently bleeding is the safest default.</p>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-slate">Active symptom flare-ups</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {REMEDY_SYMPTOMS.map((s) => {
              const active = symptoms.includes(s);
              return (
                <button
                  type="button"
                  key={s}
                  aria-pressed={active}
                  onClick={() => toggleSymptom(s)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    active
                      ? "border-sage-deep bg-sage text-white"
                      : "border-slate/15 bg-sand text-slate-soft hover:border-sage"
                  }`}
                >
                  {SYMPTOM_LABELS[s]}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={isEvaluating}
        className="mt-8 w-full rounded-full bg-sage px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-sage/30 transition hover:bg-sage-deep disabled:opacity-60"
      >
        {isEvaluating ? "Reading your signs…" : "Show me what might help"}
      </button>
    </form>
  );
}
