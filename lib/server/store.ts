import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// ============================================================================
// THE GUEST BOOK — where RSVP answers actually live.
//
// iStudio sells this exact thing as its 5,000֏ add-on: «Հյուրերի մասնակցության
// հաստատում… տվյալները ավտոմատ պահպանվում են Excel աղյուսակում» — answers
// auto-saved to a spreadsheet. Every global platform (Greenvelope, WithJoy,
// Paperless Post) treats RSVP TRACKING as the core product, because an
// invitation that collects answers the couple cannot see has only done half
// its job. This file is that feature, without the surcharge and without a
// database.
//
// STORAGE IS ONE APPEND-ONLY JSONL FILE — data/rsvp.jsonl. Appending a line
// is atomic enough for this write rate (a wedding's guest list arrives over
// weeks, not milliseconds), corruption of one line cannot eat the file, and
// the couple's data is a text file they can copy, not rows locked in a DB.
//
// THE HONEST LIMIT, stated rather than hidden: this persists on anything with
// a disk — a VPS, a Raspberry Pi, `next start` anywhere, this dev server. On
// SERVERLESS (Vercel/Netlify) the filesystem is per-instance and evaporates
// on redeploy, so there the answers must ALSO go somewhere durable — set
// RSVP_WEBHOOK (a Google Apps Script bound to a Sheet is the usual choice)
// or Resend delivery, both already wired in the route. `stored` in the API
// response reports what actually happened, so the UI never claims persistence
// that didn't occur.
// ============================================================================

export type RsvpEntry = {
  at: string; // ISO, server clock
  name: string;
  guests: number;
  side: "bride" | "groom" | "both";
  coming: "yes" | "no";
  message: string;
  from: string; // the personalised-link name, when the guest came by one
  lang: "hy" | "en" | "ru";
  /** Optional, both — collected only from guests who are coming. Old rows
   *  written before these existed simply lack them; readers treat absent as
   *  empty. */
  plusOne?: string;
  diet?: string;
  /** Kids' cards ask what the parent chose to ask; a template or kids
   *  link tags its answers with the event id so one guest book serves all. */
  event?: string;
  adults?: number;
  kids?: number;
  allergy?: string;
};

const FILE = path.join(process.cwd(), "data", "rsvp.jsonl");
const ORDERS = path.join(process.cwd(), "data", "orders.jsonl");

async function appendLine(file: string, e: unknown, tag: string): Promise<boolean> {
  try {
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, JSON.stringify(e) + "\n", "utf8");
    return true;
  } catch (err) {
    // A full disk or a read-only filesystem must not fail the visitor's
    // submission — delivery may still have worked. Log and report the truth.
    console.error(`[${tag}] store failed:`, err);
    return false;
  }
}

export function appendRsvp(e: RsvpEntry): Promise<boolean> {
  return appendLine(FILE, e, "rsvp");
}

/** The service's order book — one line per couple who asked for an
 *  invitation. Same file discipline as the guest book. */
export type OrderEntry = {
  at: string;
  style: string;
  names: string;
  date: string;
  contact: string;
  details: string;
  lang: "hy" | "en" | "ru";
  /** The builder's sanitised draft blob — open /i/<style>?p=<draft> to see
   *  exactly what the couple previewed. Empty when they ordered without one. */
  draft?: string;
};

export function appendOrder(e: OrderEntry): Promise<boolean> {
  return appendLine(ORDERS, e, "order");
}

export async function readRsvps(): Promise<RsvpEntry[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        try {
          return JSON.parse(l) as RsvpEntry;
        } catch {
          return null; // one mangled line loses one line, never the list
        }
      })
      .filter((e): e is RsvpEntry => e !== null);
  } catch {
    return []; // no file yet = nobody has answered yet
  }
}

// ---------------------------------------------------------------------------
// THE COUPLE'S KEY
//
// /guests is the couple's page, not the guests'. It is gated on
// RSVP_ADMIN_KEY: unset means the dashboard is off (and says so), set means
// the couple opens /guests?key=… from the note we send them.
//
// The comparison hashes both sides first: timingSafeEqual demands equal
// lengths, and comparing digests instead of raw strings gives it that while
// keeping the comparison constant-time. A wedding guest list does not invite
// nation-state attackers, but constant-time costs nothing.
// ---------------------------------------------------------------------------

export function adminKeyOk(candidate: string | undefined | null): boolean {
  const real = process.env.RSVP_ADMIN_KEY;
  if (!real || real.length < 8 || !candidate) return false;
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(real).digest();
  return timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// SHORT LINKS — the wizard's "Generate Web Link". A draft blob is long; a
// guest link should be short. Each generated link is one JSONL line: a
// 6-character id, the template it opens, the SANITISED blob, when. Same disk
// discipline (and the same serverless caveat) as the guest book.
// ---------------------------------------------------------------------------

const LINKS = path.join(process.cwd(), "data", "links.jsonl");
export type LinkEntry = {
  id: string; tpl: string; draft: string; lang: "hy" | "en" | "ru"; at: string;
  /** the MANAGE KEY (2026-08-25): minted with the link, returned once to the
   *  couple, and the gate of their own /guests/<id> answers page. Links
   *  minted before this exist without one — their dashboard says so. */
  key?: string;
};

const ALPHA = "abcdefghjkmnpqrstuvwxyz23456789"; // no 0/o/1/l/i — read aloud safely
export function newLinkId(): string {
  const b = randomBytes(6);
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHA[b[i] % ALPHA.length];
  return s;
}

export function appendLink(e: LinkEntry): Promise<boolean> {
  return appendLine(LINKS, e, "link");
}

/** ten characters of the same read-aloud-safe alphabet — the couple's key */
export function newManageKey(): string {
  const b = randomBytes(10);
  let s = "";
  for (let i = 0; i < 10; i++) s += ALPHA[b[i] % ALPHA.length];
  return s;
}

/** the couple's key against the link's own — timing-safe, absent = never ok */
export function linkKeyOk(entry: LinkEntry | null, candidate: string | undefined | null): boolean {
  if (!entry?.key || !candidate) return false;
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(entry.key).digest();
  return timingSafeEqual(a, b);
}

/** every order, oldest first — the owner dashboard's second table */
export async function readOrders(): Promise<OrderEntry[]> {
  try {
    const raw = await readFile(ORDERS, "utf8");
    const out: OrderEntry[] = [];
    for (const l of raw.split(String.fromCharCode(10)).filter(Boolean)) {
      try { out.push(JSON.parse(l) as OrderEntry); } catch {}
    }
    return out;
  } catch {
    return [];
  }
}

export async function findLink(id: string): Promise<LinkEntry | null> {
  if (!/^[a-z2-9]{6}$/.test(id)) return null;
  try {
    const raw = await readFile(LINKS, "utf8");
    for (const l of raw.split(String.fromCharCode(10)).filter(Boolean)) {
      try {
        const e = JSON.parse(l) as LinkEntry;
        if (e.id === id) return e;
      } catch {}
    }
  } catch {}
  return null;
}
