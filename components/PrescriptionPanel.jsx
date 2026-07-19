"use client";

const SECTIONS = [
  { key: "meals", title: "Hormone-balancing meals", eyebrow: "eat toward this", empty: "Log a symptom to see meal ideas." },
  { key: "avoid", title: "Foods to avoid right now", eyebrow: "ease off this", empty: "Nothing flagged yet." },
  { key: "products", title: "Anatomy-safe pad & cup matches", eyebrow: "product fit", empty: "No specific match needed today." },
  { key: "clothing", title: "Relaxed, breathable fabric picks", eyebrow: "wear this", empty: "Anything soft and familiar works today." },
];

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-card border border-dashed border-slate/15 bg-white/40 p-10 text-center">
      <p className="font-display text-lg text-slate">Your prescription panel is waiting</p>
      <p className="mt-2 max-w-xs text-sm text-slate-soft">
        Fill in Part A and I'll put together something specific to today — not
        a generic list.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-card border border-slate/10 bg-white/70 p-8">
      <div className="stack animate-pulse">
        <div className="h-4 w-2/3 rounded bg-sage-mist" />
        <div className="h-3 w-full rounded bg-sage-mist" />
        <div className="h-3 w-5/6 rounded bg-sage-mist" />
        <div className="h-3 w-4/6 rounded bg-sage-mist" />
      </div>
    </div>
  );
}

export default function PrescriptionPanel({ result, isEvaluating }) {
  if (isEvaluating) return <LoadingState />;
  if (!result) return <EmptyState />;

  return (
    <div className="rounded-card border border-slate/10 bg-white/70 p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-soft">Part B — your prescription</p>
      <h2 className="mt-3 font-display text-2xl text-slate">
        For your {result.phaseLabel.toLowerCase()} phase
      </h2>
      <p className="mt-2 text-sm text-slate-soft">
        Right now your body benefits most from {result.phaseFocus}.
      </p>

      {result.triggerNote && (
        <div className="mt-5 rounded-xl border border-warmth/50 bg-warmth/15 p-4 text-sm text-slate">
          {result.triggerNote}
        </div>
      )}

      <div className="stack mt-7">
        {SECTIONS.map((section) => {
          const items = result[section.key];
          return (
            <div key={section.key} className="border-t border-slate/10 pt-6 first:border-t-0 first:pt-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-deep">{section.eyebrow}</p>
              <p className="mt-1 font-display text-lg text-slate">{section.title}</p>
              {items && items.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-soft">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-soft">{section.empty}</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-slate-soft">
        This is guidance, not a diagnosis. If anything feels severe or
        unusual for you, it's worth a real conversation with a clinician —
        I'll never be a substitute for that.
      </p>
    </div>
  );
}
