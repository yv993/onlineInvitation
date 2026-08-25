import { couple as sample, programme as sampleProgramme } from "./content";
import type { Stop, T } from "./content";

// ============================================================================
// THE DRAFT — a couple's own details, carried INTO the real card.
//
// This is the piece every builder in the world has and neither Armenian
// reference does: the couple types their names and watches the actual
// invitation change. iStudio sells from JPEG thumbnails; you order blind and
// see your card in four days. Here the preview IS the product — the same
// component, the same envelope, the same programme, wearing your names.
//
// HOW IT TRAVELS: as a compact base64url JSON blob in `?p=` on the preview
// route. No account, no database, no session — the couple can copy the URL
// out of the address bar and send it to their mother before they've paid a
// dram, which is exactly the moment a sale is made. The order form submits
// the same blob, so what the couple saw is what the studio receives.
//
// EVERYTHING IN A DRAFT IS HOSTILE INPUT: names go through the same
// letters-only sanitiser as the guest greeting, times are validated to HH:MM,
// the date must parse, lengths are capped, and it is only ever rendered as
// text nodes. A malformed blob falls back to the sample couple rather than
// crashing the page — a bad link opens the demo, never a 500.
// ============================================================================

export type DraftStop = { time: string; name: string; place: string; address: string };

export type Draft = {
  a: string; // first name, in whichever alphabet the couple typed
  b: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM of the first stop
  city: string;
  stops: DraftStop[];
  /** the occasion, which changes the kicker and the calendar summary */
  occasion: "wedding" | "engagement" | "baptism" | "birthday" | "corporate";
  // ---- the wizard's extras (all optional; older blobs decode unchanged) ----
  venue?: string;
  address?: string;
  /** a maps URL the couple pasted — https only, host allow-listed */
  map?: string;
  rsvpBy?: string; // YYYY-MM-DD
  dress?: string[]; // up to 5 #RRGGBB
  music?: string; // an uploaded /api/audio/<id> path, or an https URL to a track
  video?: boolean; // ambient loop on/off
  godA?: string; // godfather (baptism)
  godB?: string; // godmother (baptism)
  born?: number; // birth year (birthday age countdown)
  tpl?: string; // the live template id chosen (wedding-1 …, kids-<card>-<variant>)
  // ---- the kids' cards (lib/kids.ts) ------------------------------------
  age?: number; // the birthday child's age, 1–120
  note?: string; // «Join us for cake & games» — the parent's line, ≤200
  host?: string; // «Anna & Aram» — the parents, ≤60
  /** which extra RSVP questions the guest link asks: adult/child headcounts, allergies */
  ask?: Array<"counts" | "allergy">;
  /** a photo the studio saved at link time — only ever a same-origin /api/photo/<id> path */
  photo?: string;
  /** THE COUPLE'S OWN PHOTOGRAPHS, saved at pick time (POST /api/photo).
   *  Same-origin paths only, so the blob can carry them into the guest page,
   *  where the template lays them into its cover and its gallery and every
   *  effect it already applies to its own plates applies to these. */
  photos?: string[];
  // ---- the wedding cards (lib/wcards.ts) — the envelope the guest opens ---
  envCover?: string;
  envLiner?: string;
  envStamp?: string;
  envSeal?: string;
  envBack?: string;
};

/** The card's view of a couple: everything Card.tsx reads, resolved. */
export type Couple = {
  a: T;
  b: T;
  monogram: { a: string; b: string };
  date: string; // ISO with +04:00
  end: string;
  rsvpBy: string;
  city: T;
  stops: Stop[];
  occasion: Draft["occasion"];
  /** true = the sample couple; drives the honesty footer */
  sample: boolean;
  /** true = a couple's own draft, not yet ordered; drives the preview ribbon */
  draft: boolean;
};

const NAME_OK = /[^\p{L}\p{M}\s'’.-]/gu;
const cleanName = (s: unknown, max = 30) =>
  typeof s === "string" ? s.replace(NAME_OK, "").replace(/\s+/g, " ").trim().slice(0, max) : "";
const stripControls = (s: string) => {
  // Escape-free on purpose: a regex character class for the control range
  // has twice reached disk with its escapes collapsed in this project. A
  // codePointAt comparison cannot be mangled by anything in the pipeline.
  let out = "";
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0;
    out += c < 32 || c === 127 || (c >= 128 && c <= 159) ? " " : ch;
  }
  return out;
};
const cleanText = (s: unknown, max = 80) =>
  typeof s === "string" ? stripControls(s).split(" ").filter(Boolean).join(" ").slice(0, max) : "";
const cleanTime = (s: unknown) =>
  typeof s === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s) ? s : "";
const cleanDate = (s: unknown) =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z"))
    ? s
    : "";

const OCCASIONS = ["wedding", "engagement", "baptism", "birthday", "corporate"] as const;

const MAP_HOSTS = ["www.google.com", "google.com", "maps.google.com", "maps.app.goo.gl", "goo.gl", "yandex.com", "yandex.ru", "www.yandex.com", "maps.apple.com"];
const cleanUrl = (s: unknown, hosts?: string[]) => {
  if (typeof s !== "string" || s.length > 400) return "";
  try {
    const u = new URL(s.trim());
    if (u.protocol !== "https:") return "";
    if (hosts && !hosts.includes(u.hostname)) return "";
    return u.toString();
  } catch {
    return "";
  }
};
const cleanHex = (s: unknown) => (typeof s === "string" && /^#[0-9a-fA-F]{6}$/.test(s) ? s.toUpperCase() : "");
const cleanYear = (v: unknown) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1900 && n <= 2030 ? n : undefined;
};
const cleanAge = (v: unknown) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 120 ? n : undefined;
};
const cleanAsk = (v: unknown): Array<"counts" | "allergy"> | undefined => {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x): x is "counts" | "allergy" => x === "counts" || x === "allergy");
  return out.length ? [...new Set(out)] : undefined;
};
// Escape-free on purpose (see stripControls): the path is checked by prefix
// and by the id's own alphabet, no slash ever needs escaping.
const cleanId = (v: unknown, max = 24) => (typeof v === "string" && v.length <= max && [...v].every((ch) => "abcdefghijklmnopqrstuvwxyz0123456789-".includes(ch)) ? v : undefined);
const PHOTO_PREFIX = "/api/photo/";
const cleanPhoto = (v: unknown) => {
  if (typeof v !== "string" || !v.startsWith(PHOTO_PREFIX)) return undefined;
  const id = v.slice(PHOTO_PREFIX.length);
  return id.length === 6 && [...id].every((ch) => "abcdefghjkmnpqrstuvwxyz23456789".includes(ch)) ? v : undefined;
};

/** the couple's own uploaded track: the same prefix-and-alphabet check as a
 *  photo — /api/audio/<id> is the only same-origin shape the blob may carry */
const AUDIO_PREFIX = "/api/audio/";
const cleanOwnTrack = (v: unknown) => {
  if (typeof v !== "string" || !v.startsWith(AUDIO_PREFIX)) return undefined;
  const id = v.slice(AUDIO_PREFIX.length);
  return id.length === 6 && [...id].every((ch) => "abcdefghjkmnpqrstuvwxyz23456789".includes(ch)) ? v : undefined;
};

/** the couple's gallery: every entry through the same prefix-and-alphabet
 *  check as the single photo, deduped, and capped at eight — the blob rides
 *  in a URL, and a gallery longer than that is a slideshow, not an invitation */
const cleanPhotos = (v: unknown): string[] | undefined => {
  if (!Array.isArray(v)) return undefined;
  const out = [...new Set(v.map(cleanPhoto).filter((x): x is string => Boolean(x)))].slice(0, 8);
  return out.length ? out : undefined;
};

/** Both languages get the same typed string — a couple types their names
 *  once, in their own alphabet, and that is what prints on both routes. */
const same = (s: string): T => ({ hy: s, en: s });

// ---------------------------------------------------------------------------
// encode / decode — base64url of JSON, URL-safe, no padding
// ---------------------------------------------------------------------------

export function encodeDraft(d: Draft): string {
  const json = JSON.stringify(d);
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(json, "utf8").toString("base64")
      : btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeDraft(p: string | string[] | undefined): Draft | null {
  if (typeof p !== "string" || !p || p.length > 4000) return null;
  try {
    const b64 = p.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof Buffer !== "undefined"
        ? Buffer.from(b64, "base64").toString("utf8")
        : decodeURIComponent(escape(atob(b64)));
    const raw = JSON.parse(json) as Partial<Draft>;

    const a = cleanName(raw.a);
    const b = cleanName(raw.b);
    const date = cleanDate(raw.date);
    const occ = OCCASIONS.includes(raw.occasion as never) ? (raw.occasion as Draft["occasion"]) : "wedding";
    // Two people need two names; a birthday or a company event may carry a
    // single line (the second is the age or the event, optional).
    const single = occ === "birthday" || occ === "corporate";
    if (!a || !date || (!b && !single)) return null;

    const stops = (Array.isArray(raw.stops) ? raw.stops : [])
      .slice(0, 5)
      .map((s) => ({
        time: cleanTime(s?.time),
        name: cleanText(s?.name, 40),
        place: cleanText(s?.place, 60),
        address: cleanText(s?.address, 80),
      }))
      .filter((s) => s.time && s.name)
      .sort((x, y) => x.time.localeCompare(y.time));

    return {
      a,
      b,
      date,
      time: cleanTime(raw.time) || stops[0]?.time || "12:00",
      city: cleanText(raw.city, 40),
      stops,
      occasion: occ,
      venue: cleanText(raw.venue, 60) || undefined,
      address: cleanText(raw.address, 80) || undefined,
      map: cleanUrl(raw.map, MAP_HOSTS) || undefined,
      rsvpBy: cleanDate(raw.rsvpBy) || undefined,
      dress: Array.isArray(raw.dress) ? raw.dress.map(cleanHex).filter(Boolean).slice(0, 5) : undefined,
      music: cleanOwnTrack(raw.music) ?? (cleanUrl(raw.music) || undefined),
      video: raw.video === true ? true : undefined,
      godA: cleanName(raw.godA) || undefined,
      godB: cleanName(raw.godB) || undefined,
      born: cleanYear(raw.born),
      tpl: typeof raw.tpl === "string" && /^[a-z0-9]+(?:-[a-z0-9]+){1,4}$/.test(raw.tpl) && raw.tpl.length <= 48 ? raw.tpl : undefined,
      age: cleanAge(raw.age),
      note: cleanText(raw.note, 200) || undefined,
      host: cleanText(raw.host, 60) || undefined,
      ask: cleanAsk(raw.ask),
      photo: cleanPhoto(raw.photo),
      photos: cleanPhotos(raw.photos),
      envCover: cleanId(raw.envCover),
      envLiner: cleanId(raw.envLiner),
      envStamp: cleanId(raw.envStamp),
      envSeal: cleanId(raw.envSeal),
      envBack: cleanId(raw.envBack),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// resolve — a Draft (or nothing) into what the card renders
// ---------------------------------------------------------------------------

/** The sample couple, exactly as content.ts describes them. */
export function sampleCouple(): Couple {
  return {
    a: sample.a,
    b: sample.b,
    monogram: sample.monogram,
    date: sample.date,
    end: sample.end,
    rsvpBy: sample.rsvpBy,
    city: { hy: "Երևան", en: "Yerevan" },
    stops: sampleProgramme.stops,
    occasion: "wedding",
    sample: true,
    draft: false,
  };
}

/** A couple's draft, resolved onto the card. Armenia time throughout. */
export function draftCouple(d: Draft): Couple {
  const first = d.stops[0]?.time ?? d.time;
  const iso = `${d.date}T${first}:00+04:00`;
  // End of the day: midnight after. RSVP: three weeks before, a sane default
  // the studio adjusts with the couple.
  const end = `${d.date}T23:59:00+04:00`;
  const rsvpBy = d.rsvpBy ? `${d.rsvpBy}T23:59:00+04:00` : new Date(new Date(iso).getTime() - 21 * 86400_000).toISOString();
  const mapUrl = d.map || "https://yandex.com/maps/10262/yerevan/";
  const stops = d.stops.length
    ? d.stops
    : [{ time: first, name: d.venue || d.city || "—", place: d.address || "", address: d.address || "" }];

  return {
    a: same(d.a),
    b: same(d.b),
    // The seal takes the first grapheme of each name — works for Armenian,
    // Latin and Cyrillic alike, and never splits a surrogate pair.
    monogram: { a: [...d.a][0] ?? "", b: [...d.b][0] ?? "" },
    date: iso,
    end,
    rsvpBy,
    city: same(d.city || "Երևան"),
    stops: stops.map((s) => ({
      time: s.time,
      name: same(s.name),
      place: same(s.place),
      address: same(s.address),
      map: mapUrl,
    })),
    occasion: d.occasion,
    sample: false,
    draft: true,
  };
}

/** Human date "10 · 10 · 2026" from an ISO string, Armenia-local fields. */
export function stampFromIso(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 4 * 3600_000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())} · ${p(d.getUTCMonth() + 1)} · ${d.getUTCFullYear()}`;
}

/** Weekday name in both languages, computed — never typed by hand, because a
 *  typed weekday is the first thing to go wrong when a date changes. */
export function weekdayFromIso(iso: string): T {
  const d = new Date(new Date(iso).getTime() + 4 * 3600_000).getUTCDay();
  const hy = ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"];
  const en = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const ru = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  return { hy: hy[d], en: en[d], ru: ru[d] };
}
