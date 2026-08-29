-- ============================================================================
-- KNIQ — the account store. Run this once in the Supabase SQL editor.
--
-- Supabase Auth already provides auth.users (id, email) and handles magic
-- links, expiry and single use. We add exactly two tables: who owns which
-- invitation, and the answers guests leave on it.
--
-- THE SECURITY MODEL, stated plainly because it is the whole point:
--   · A COUPLE is a signed-in auth.users row. RLS pins every read and write to
--     auth.uid(), so a couple cannot reach another couple's guest list even by
--     guessing an id. The database enforces it, not the application.
--   · A GUEST has no account and never gets one. Their RSVP is inserted by the
--     server using the SERVICE ROLE key, which bypasses RLS — that is why the
--     browser is never given that key.
--   · The existing manage-key link (/guests/<id>?k=…) keeps working alongside
--     this. Accounts are a second door to the same room, not a replacement:
--     couples who published before signing up must not lose their answers.
-- ============================================================================

-- ---------------------------------------------------------------- invitations
create table if not exists public.invitations (
  -- the six-character link id minted by lib/server/store.ts (newLinkId).
  -- Text, not uuid: it is read aloud and typed, and its alphabet excludes
  -- 0/o/1/l/i for exactly that reason.
  id          text primary key,
  owner       uuid not null references auth.users (id) on delete cascade,
  tpl         text not null,
  draft       text not null,                       -- the base64url ?p= blob
  lang        text not null default 'hy' check (lang in ('hy', 'en', 'ru')),
  -- kept so a link minted before its owner signed up can still be claimed by
  -- whoever holds the manage key; null once ownership is settled by account
  manage_key  text,
  created_at  timestamptz not null default now()
);

create index if not exists invitations_owner_idx on public.invitations (owner);

-- ---------------------------------------------------------------------- rsvps
create table if not exists public.rsvps (
  id            bigint generated always as identity primary key,
  invitation_id text not null references public.invitations (id) on delete cascade,
  name          text,
  coming        boolean,
  headcount     integer,
  side          text,                              -- bride's / groom's
  adults        integer,
  kids          integer,
  diet          text,
  allergy       text,
  message       text,
  -- the per-template custom questions, whose shape varies by design
  answers       jsonb,
  at            timestamptz not null default now()
);

create index if not exists rsvps_invitation_idx on public.rsvps (invitation_id, at desc);

-- ------------------------------------------------------------------------ RLS
alter table public.invitations enable row level security;
alter table public.rsvps       enable row level security;

-- A couple reads and writes only their own invitations.
drop policy if exists "invitations are the owner's" on public.invitations;
create policy "invitations are the owner's"
  on public.invitations for all
  using (auth.uid() = owner)
  with check (auth.uid() = owner);

-- A couple reads only the answers left on an invitation they own. There is no
-- insert policy here on purpose: guests are anonymous, so the server inserts
-- with the service role. Without a policy, RLS denies by default.
drop policy if exists "answers belong to the invitation's owner" on public.rsvps;
create policy "answers belong to the invitation's owner"
  on public.rsvps for select
  using (
    exists (
      select 1 from public.invitations i
      where i.id = rsvps.invitation_id
        and i.owner = auth.uid()
    )
  );
