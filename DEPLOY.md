# Putting KNIQ online

The repository is at **github.com/yv993/onlineInvitation** (branch `main`).

---

## Read this before pointing a domain at Vercel

The app **writes files** to keep what couples and guests create:

| What | Where it is written |
|---|---|
| Minted invitation links | `data/links.jsonl` |
| Guests' RSVP answers | `data/rsvp.jsonl` |
| Orders | `data/orders.jsonl` |
| Guests' wishes | `data/wishes.jsonl` |
| Uploaded photographs | `data/photo/…` |
| Uploaded music | `data/audio/…` |

**Vercel's filesystem is read-only**, and its `/tmp` is wiped between
invocations. On Vercel, as the code stands today:

- creating an invitation link **fails**,
- a guest's RSVP is **not stored** (the guest is told honestly that it was not
  saved — `appendLine` returns false and the form says so),
- uploaded photographs and music **do not survive**.

Everything else — the landing, the catalogue, the editor, every template
preview, the film pages — works on Vercel exactly as it does locally, because
none of it touches the disk.

So there are two honest ways to go live.

---

## Path A — Vercel for the showcase, today

Good for: a public link for clients, your portfolio, sharing the work.
Not for: real weddings, until storage moves (Path B or C).

1. In the Vercel dashboard → **Add New… → Project → Import Git Repository**,
   pick `yv993/onlineInvitation`. Framework is detected as Next.js; no build
   settings need changing.
2. Add one Environment Variable, then redeploy:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` (no trailing slash) |

   Until this is set, `robots.txt` disallows everything and `sitemap.xml` is
   empty **on purpose** — the site refuses to invite crawlers to a domain it
   cannot name. Setting it also makes QR codes and share cards print the real
   domain instead of the placeholder.
3. For a custom domain (e.g. `kniq.am`): Project → **Settings → Domains → Add**,
   then set the two DNS records Vercel shows you at your registrar. Afterwards
   change `NEXT_PUBLIC_SITE_URL` to that domain and redeploy.

**Say plainly on any demo you share that RSVPs are not being kept yet.**

---

## Path B — a host with a real disk (no code change)

Railway, Render, Fly.io, or any VPS. The app runs as it does on your machine:

```bash
npm ci && npm run build && npx next start -p 3000
```

Mount a persistent volume at the project's `data/` directory and everything —
links, RSVPs, uploads — is kept. This is the shortest road to accepting real
customers.

---

## Path C — stay on Vercel, move storage (the eventual answer)

Swap the six writes above for managed storage:

- `links / rsvp / orders / wishes` → Vercel Postgres (or Neon, Supabase). Each
  `.jsonl` file becomes one table; the read/write helpers already sit behind
  `lib/server/store.ts`, so this is one adapter, not a rewrite.
- `photo / audio` → Vercel Blob (or S3/R2). `app/api/photo` and
  `app/api/audio` write the bytes and hand back a path — the same shape a blob
  URL has.

Ask me when you want this; it is a contained piece of work.

---

## Environment variables

| Name | Needed for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | SEO, QR codes, share cards | Without it robots/sitemap stay locked |
| `TELEGRAM_BOT_TOKEN` | RSVP notifications to Telegram | See README |
| `TELEGRAM_CHAT_ID` | RSVP notifications to Telegram | See README |
| `RSVP_WEBHOOK_URL` | Optional: POST each answer onward | |

`.env.local` and `data/` are gitignored and must never be committed.
