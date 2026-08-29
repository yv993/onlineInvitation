# Accounts — what is built, and the four steps to switch them on

Sign-in is a **magic link**: the couple types their address, Supabase emails a
one-time link, clicking it makes a session. No password is stored, hashed,
reset or leaked — which suits a service someone signs into about twice in their
life (once to publish, once to read the answers).

**Nothing here is switched on until the environment variables below exist.**
Without them `/login` says so plainly and the rest of KNIQ behaves exactly as it
did before. That is deliberate: a half-configured account system that appears to
work would take a couple's wedding data and drop it.

---

## Why this needed a database at all

Everything else in `lib/server/store.ts` is append-only JSONL in `data/`. That is
honest, dependency-free, and works perfectly on a box you own. It does **not**
work on Vercel — the filesystem is read-only and `/tmp` is wiped between
invocations (see `DEPLOY.md`). Accounts stored that way would vanish on every
deploy, so accounts needed a real store. That is the only reason the dependency
count went from five to six (`@supabase/ssr`).

The existing **manage-key link** (`/guests/<id>?k=…`) is untouched and keeps
working. Accounts are a second door to the same room, not a replacement — a
couple who published before signing up must not lose their answers.

---

## The four steps

### 1. Create the project

<https://supabase.com/dashboard> → **New project**. Any region; Frankfurt is the
closest to Armenia of the European options.

### 2. Run the schema

Open **SQL Editor** and paste all of `supabase/schema.sql`. It creates two
tables — `invitations` and `rsvps` — and the Row Level Security policies that
pin every read to `auth.uid()`, so the *database* guarantees one couple can
never reach another's guest list. Not the application: the database.

### 3. Set the environment variables

From **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the anon / public key>
SUPABASE_SERVICE_ROLE_KEY=<the service_role key>
```

Locally these go in `.env.local` (gitignored). On Vercel they go in
**Settings → Environment Variables**.

> **The third one bypasses Row Level Security.** It must never be given a
> `NEXT_PUBLIC_` prefix — Next inlines those into the browser bundle, and that
> would publish a key that can read and write every couple's data. It exists for
> exactly one job: a guest has no account, so their RSVP insert cannot be
> performed as them.

### 4. Point the email at your own sender

**Authentication → URL Configuration**: set **Site URL** to your domain, and add
`https://<your-domain>/auth/callback` to **Redirect URLs**. Supabase refuses to
redirect anywhere not on that list, which is what stops a magic link being
turned into a way of handing someone else's session to an attacker.

**Authentication → Emails**: Supabase's built-in sender is rate-limited and
meant for development. Before real couples use this, point SMTP at your own
domain, or the links will arrive slowly and land in spam.

---

## What is built and verified

| Piece | File | Verified |
|---|---|---|
| Server + admin clients, env-guarded | `lib/server/supabase.ts` | returns `null` unconfigured, no throw |
| Schema + RLS policies | `supabase/schema.sql` | written, **not yet run** |
| Magic-link request | `app/api/auth/login/route.ts` | 503 unconfigured; malformed address rejected; every valid address gets the same neutral reply |
| Link callback | `app/auth/callback/route.ts` | redirects to `/login?e=link` without a code |
| Sign out | `app/api/auth/logout/route.ts` | POST only |
| Sign-in page, hy + en | `app/(hy)/login`, `app/(en)/en/login` | both states rendered and screenshotted |

Two security choices worth keeping when this is extended:

- **The login route never says whether an address has an account.** An endpoint
  that answers "no such user" is an account-enumeration oracle — anyone could
  learn which of their friends is planning a wedding here. Real failures go to
  the Supabase logs, not to the caller.
- **`next=` is validated against a path shape** before any redirect. A redirect
  target taken from a query string and followed blindly is an open redirect, and
  on the callback route it would fire at the exact moment a session is minted.

---

## What is NOT built yet

The sign-in works; the data wiring behind it does not exist, and could not be
tested against a project that has never been created:

1. **Claiming on publish** — writing an `invitations` row when a signed-in couple
   mints a link, so it is theirs.
2. **Reading answers by account** — `/guests` and `/my` still read the JSONL
   store and `localStorage`. They need a signed-in path that queries Supabase.
3. **Guest RSVPs into Postgres** — `/api/rsvp` still appends to `data/rsvp.jsonl`.
   This is the one that must use the service-role client.
4. **Session refresh middleware**, and a **sign-in entry in the nav**.
5. **Migrating existing JSONL rows** into the new tables.

Do these once steps 1–4 above are done, so each can be checked against a real
project rather than written blind.
