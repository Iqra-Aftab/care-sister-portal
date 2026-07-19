# Care Tracker — System Architecture

A premium, inclusive menstrual health ecosystem. This document is the map for
the whole system; two interfaces are fully implemented in this delivery
(**Welcome Landing** and **AI Diet & Product Remedy Generator**), and the
other three are specified in enough detail that they drop into the same
architecture without redesign.

---

## 1. Design tokens

| Token | Value | Use |
|---|---|---|
| `--sand` | `#FAF8F5` | App background |
| `--sand-deep` | `#F1ECE4` | Card/section alternation |
| `--sage` | `#8EAA90` | Primary accent, CTAs, active states |
| `--sage-deep` | `#6E8C71` | Hover/pressed states |
| `--sage-mist` | `#E4EBE2` | Chips, subtle fills |
| `--slate` | `#2C332D` | Primary text |
| `--slate-soft` | `#5B6459` | Secondary text, captions |
| `--warmth` | `#E7C3AC` | Single sparing "held-hand" accent — hero glow, sisterly quote mark only |

Type system (loaded via `next/font/google` in `app/layout.js`):
- **Display / voice** — `Fraunces` (variable, includes italic) — used for the
  direct-address greeting and section titles. Italic weight is reserved for
  the "elder sister speaking" moments only.
- **Body** — `Manrope` — humanist geometric sans, used for all UI copy.
- **Utility / data** — `IBM Plex Mono` — small caps, tracked-out, used for
  timestamps, cycle-day counters, and log metadata. Gives the health data a
  quiet "lab notebook" precision without feeling clinical.

Signature element: **the Breathing Canvas** — a soft radial-gradient field
behind the hero greeting that scales 1.0 → 1.04 → 1.0 on a 6s ease-in-out
loop, echoing a slow breath. It is the one animated flourish on the landing
page; everything else is still. `prefers-reduced-motion` disables it.

---

## 2. Stack & routing

```
Next.js 14 (App Router)
├─ app/
│  ├─ layout.js                 Root layout, fonts, <html> tint attribute
│  ├─ page.js                   ✅ Welcome Landing (this delivery)
│  ├─ globals.css                ✅ Design tokens, breathing animation
│  ├─ dashboard/page.js         Pocket Health Record (spec below)
│  ├─ insights/page.js          Taboo Insights & Media (spec below)
│  ├─ companion/page.js         AI Sister Companion Chat (spec below)
│  └─ remedy-hub/page.js        ✅ AI Diet & Product Remedy Generator
├─ components/
│  ├─ ComfortDial.jsx            ✅ Accessibility/customization panel
│  ├─ RemedyIntakeForm.jsx       ✅ Part A of remedy hub
│  └─ PrescriptionPanel.jsx      ✅ Part B of remedy hub
├─ lib/
│  ├─ supabaseClient.js          ✅ Browser + server Supabase clients
│  ├─ resend.js                  ✅ Transactional email helper
│  └─ remedyEngine.js            ✅ Rule-based remedy generation engine
└─ sanity/
   └─ schemas/                   ✅ CMS collections for blog + podcast
```

Auth, database, and email all run through small, swappable modules so the
UI code never talks to a vendor SDK directly.

---

## 3. Supabase schema (used by dashboard, remedy-hub, insights)

```sql
-- profiles: one row per authenticated user, created on signup trigger
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  tint_preference text default 'sand',       -- from the Comfort Dial
  density_preference text default 'comfortable', -- 'compact' | 'comfortable' | 'spacious'
  created_at timestamptz default now()
);

-- cycle_logs: the interactive logging matrix behind /dashboard
create table cycle_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  log_date date not null,
  phase text,                -- 'menstrual' | 'follicular' | 'ovulation' | 'luteal'
  flow text,                 -- 'spotting' | 'light' | 'medium' | 'heavy'
  symptoms text[],           -- e.g. {cramps, bloating, fatigue, headache}
  mood text,
  notes text,
  created_at timestamptz default now(),
  unique (user_id, log_date)
);

-- remedy_sessions: every Part A submission + generated Part B result
create table remedy_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  trigger_food text,
  phase text,
  symptoms text[],
  result jsonb,               -- serialized PrescriptionPanel output
  created_at timestamptz default now()
);

-- newsletter_subscribers: capture form on /insights
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now()
);
```

Row-Level Security: every table except `newsletter_subscribers` is scoped
with `user_id = auth.uid()` policies for `select`/`insert`/`update`. The
companion chat intentionally writes **nothing** to Supabase — see §6.

---

## 4. Sanity.io CMS schema (blog + podcast, feeds `/insights`)

See `/sanity/schemas/`. Summary:

- **`post`** — long-form articles. Fields: `title`, `slug`, `category`
  (reference to `category`), `heroImage`, `excerpt`, `body` (portable text),
  `readTime`, `publishedAt`.
- **`podcastEpisode`** — audio sessions. Fields: `title`, `slug`,
  `category`, `coverArt`, `audioFile` (Sanity file asset, or external URL
  for R2/S3-hosted MP3s), `durationSeconds`, `showNotes`, `publishedAt`.
- **`category`** — the four filter modules used on `/insights`:
  `Taboo Topics & Anatomy`, `Pads, Cups & Hygiene Product Science`,
  `Breathable Fabrics & Apparel`, `Podcast Audio Sessions`. Fields: `title`,
  `slug`, `tint` (maps to a sage-mist chip color).

`/insights` queries Sanity with GROQ at build time (`generateStaticParams`
+ ISR, `revalidate: 3600`) so new posts/episodes appear within the hour
without a redeploy.

---

## 5. Resend email flows

`lib/resend.js` exposes a single `sendCareEmail()` helper used in three
places:
1. **Newsletter welcome** — triggered by the `/insights` enrollment form.
2. **Monthly Sisterly Progress Update** — a scheduled Supabase Edge
   Function (cron, first of each month) renders the same summary shown on
   `/dashboard` and emails it, so the "elder sister" check-in reaches
   people even if they don't open the app that week.
3. **Account/auth transactional mail** — magic-link and password-reset
   copy is rewritten in Resend (Supabase auth emails are proxied through
   Resend's SMTP so tone stays consistent with the rest of the product).

---

## 6. Spec for the three interfaces not built in this delivery

### `/dashboard` — Pocket Health Record
- Server component fetches `profiles` + last 30 days of `cycle_logs` for
  `auth.uid()`.
- **Monthly Sisterly Progress Update** is a dedicated card at the top:
  computed baseline (average cycle length, most-logged symptom, flow
  trend) rendered through a template like *"This month your cycle ran
  close to your usual rhythm. Cramps showed up more than last month —
  here's one thing worth trying."* Never diagnostic language; always
  paired with one small, doable suggestion.
- Below it, the **cycle logging matrix**: a calendar grid
  (`components/CycleMatrix.jsx`, not included here) where each day is a
  tappable cell that opens a quick-log sheet (phase, flow, symptoms,
  mood). Writes to `cycle_logs` via a Supabase server action.

### `/insights` — Taboo Insights & Media Ecosystem
- Filter bar bound to the four Sanity `category` slugs; grid of `post` and
  `podcastEpisode` cards, sorted by `publishedAt`.
- Podcast cards use the native `<audio>` element styled to match the
  design tokens (no third-party player, keeps bundle light and avoids
  autoplay/tracking scripts).
- Newsletter form posts to `/api/newsletter`, which upserts into
  `newsletter_subscribers` and fires the Resend welcome email.

### `/companion` — Anonymous AI Sister Companion Chat
- **Zero-log by design**: messages live only in `useState` on the client
  and are never sent to Supabase. The API route `/api/companion` proxies
  to the Anthropic Messages API with a system prompt tuned for a warm,
  non-judgmental "older sister" voice, and the route itself does not log
  request bodies (no `console.log`, no DB write, `export const runtime =
  'edge'` with no persistence layer attached).
- Prompt chips (`"Awkward odor questions"`, `"Menstrual cup insertion
  anxiety"`, `"Discharge color meanings"`) just prefill the input; nothing
  is pre-tagged to the user's identity.
- A visible "This conversation is not saved" indicator stays pinned in the
  header so the zero-log promise is never just fine print.

---

## 7. What's fully implemented below

- `app/page.js` + `components/ComfortDial.jsx` — Welcome Landing with the
  tint/density customizer, the no-download-hassle explainer block, and the
  breathing hero.
- `app/remedy-hub/page.js` + `components/RemedyIntakeForm.jsx` +
  `components/PrescriptionPanel.jsx` + `lib/remedyEngine.js` — the full
  two-part Diet & Product Remedy Generator, wired end to end with working
  client-side state (swap `remedyEngine.js` for a server action calling an
  LLM whenever you want fully generative copy instead of the curated
  rule-based engine).
