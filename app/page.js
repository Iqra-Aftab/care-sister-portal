import Link from "next/link";
import ComfortDial from "@/components/ComfortDial";

const PROMISES = [
  {
    label: "No app store",
    body: "Nothing to download, nothing sitting on your home screen for someone else to open.",
  },
  {
    label: "No digital footprint",
    body: "No push notifications, no account required just to read, no trace on a shared or borrowed phone.",
  },
  {
    label: "No shyness at checkout",
    body: "You never have to explain to anyone why this app is on your phone. It's a page, like any other.",
  },
];

const COMPANION_PREVIEW = [
  {
    title: "Your Pocket Health Record",
    body: "A private, month-by-month picture of your cycle — built from what you log, not what an algorithm assumes.",
    href: "/dashboard",
  },
  {
    title: "Taboo Insights & Media",
    body: "Real answers about anatomy, products, and fabric — written and recorded like you're being spoken to, not lectured.",
    href: "/insights",
  },
  {
    title: "The Companion Chat",
    body: "Ask the question you'd never type into a search bar. Nothing here is saved, not even to us.",
    href: "/companion",
  },
];

export default function WelcomeLandingPage() {
  return (
    <main className="min-h-screen">
      {/* ---------- Header ---------- */}
      <header className="content-column mx-auto flex items-center justify-between px-6 pt-8 sm:px-10">
        <span className="font-display text-lg tracking-tight text-slate">Care Tracker</span>
        <div className="flex items-center gap-3">
          <ComfortDial />
        </div>
      </header>

      {/* ---------- Hero: the Breathing Canvas ---------- */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:px-10 sm:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-10 h-[34rem] w-[34rem] -translate-x-1/2 animate-breathe rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(142,170,144,0.35), rgba(231,195,172,0.18) 55%, transparent 75%)",
          }}
        />

        <div className="content-column relative mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-soft">
            a letter, before anything else
          </p>

          <h1 className="mt-6 font-display text-4xl leading-[1.15] text-slate sm:text-5xl">
            <span className="italic text-sage-deep">I am here with you,</span>
            <br />
            whatever you are feeling.
          </h1>

          <div className="stack mx-auto mt-8 max-w-xl text-left sm:text-center">
            <p className="text-[1.05rem] text-slate-soft">
              Maybe today is an easy day. Maybe you're curled up wondering if
              what you're feeling is normal, or you have a question you've
              never said out loud to anyone. Either way — you don't have to
              perform being fine here, and you don't have to explain yourself
              before you're ready.
            </p>
            <p className="text-[1.05rem] text-slate-soft">
              Think of this less like an app, and more like a sister who
              happens to know a lot, keeps nothing from you, and keeps
              everything you say between the two of us.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-sage px-7 py-3.5 text-sm font-semibold text-white shadow-sm shadow-sage/30 transition hover:bg-sage-deep"
            >
              Start quietly, just for me
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate/15 px-7 py-3.5 text-sm font-semibold text-slate transition hover:border-sage hover:text-sage-deep"
            >
              I already have a space here
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-soft">
            No credit card. No app to install. Leave any time — your data leaves with you.
          </p>
        </div>
      </section>

      {/* ---------- No-download-hassle explainer block ---------- */}
      <section className="border-y border-slate/10 bg-sand-deep/60 px-6 py-16 sm:px-10">
        <div className="content-column mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-soft">
            why this lives in your browser, not your app store
          </p>
          <h2 className="mt-4 font-display text-2xl text-slate sm:text-3xl">
            A full pocket health companion, minus everything that made you hesitate before.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-soft">
            Most period-tracking apps ask you to download something, create an
            account before you can read a single article, and hand over more
            of your data than the moment calls for. Care Tracker was built
            the other way around.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PROMISES.map((p) => (
              <div
                key={p.label}
                className="rounded-card border border-slate/10 bg-sand p-6 transition hover:border-sage/60 hover:shadow-sm"
              >
                <p className="font-display text-lg text-sage-deep">{p.label}</p>
                <p className="mt-2 text-sm text-slate-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What's waiting for you, once you're ready ---------- */}
      <section className="px-6 py-16 sm:px-10">
        <div className="content-column mx-auto">
          <h2 className="font-display text-2xl text-slate sm:text-3xl">
            When you're ready — not before.
          </h2>
          <p className="mt-3 max-w-xl text-slate-soft">
            Everything below is here whenever you want it. Nothing unlocks by
            surprise, and nothing is required to read the parts that are open
            to everyone.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {COMPANION_PREVIEW.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group rounded-card border border-slate/10 bg-white/70 p-6 transition hover:-translate-y-0.5 hover:border-sage hover:shadow-md"
              >
                <p className="font-display text-lg text-slate group-hover:text-sage-deep">
                  {c.title}
                </p>
                <p className="mt-2 text-sm text-slate-soft">{c.body}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-sage-deep opacity-0 transition group-hover:opacity-100">
                  Take a look →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing reassurance ---------- */}
      <section className="px-6 pb-24 pt-8 sm:px-10">
        <div className="content-column mx-auto rounded-card border border-slate/10 bg-sage-mist/60 p-10 text-center">
          <p className="font-display text-xl italic text-slate">
            "Whatever brought you here today — you're allowed to just look around first."
          </p>
          <div className="mt-6">
            <Link
              href="/signup"
              className="rounded-full bg-sage px-7 py-3.5 text-sm font-semibold text-white shadow-sm shadow-sage/30 transition hover:bg-sage-deep"
            >
              Create my quiet space
            </Link>
          </div>
        </div>
      </section>

      <footer className="content-column mx-auto px-6 pb-10 text-center text-xs text-slate-soft sm:px-10">
        Care Tracker. Private by default. You can delete everything, anytime, from Settings.
      </footer>
    </main>
  );
}
