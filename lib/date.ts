// ============================================================================
// DATES — the calendar grid, the countdown and the .ics all read ONE constant
// (`couple.date` in content.ts). Move the wedding and all three move with it.
//
// EVERY CALCULATION HERE IS DONE IN ARMENIA TIME (+04:00, and Armenia has had
// no DST since 2012, so the offset is a constant — this is one of the rare
// cases where a fixed offset is correct rather than lazy). The reason matters:
// a guest opening this in Los Angeles is thirteen hours behind, and a naive
// `new Date()` would show them the wedding on the ninth of October and a
// countdown half a day out. The date on the card must be the date in Yerevan
// for everybody who opens it.
// ============================================================================

export const TZ_OFFSET_MIN = 4 * 60; // Armenia, UTC+4, no DST

/** Shift a UTC instant into Armenia's wall clock, as a Date whose UTC fields
 *  read as Yerevan local time. Only ever used for FIELD EXTRACTION. */
function toYerevanFields(d: Date): Date {
  return new Date(d.getTime() + TZ_OFFSET_MIN * 60_000);
}

export function ymdInYerevan(iso: string): { y: number; m: number; d: number } {
  const f = toYerevanFields(new Date(iso));
  return { y: f.getUTCFullYear(), m: f.getUTCMonth(), d: f.getUTCDate() };
}

// ---------------------------------------------------------------------------
// MONTH GRID — Monday-first
// ---------------------------------------------------------------------------

export type GridCell = { day: number | null; isWedding: boolean };

/**
 * The month containing `iso`, as rows of seven, MONDAY FIRST.
 *
 * Both references start the week on Sunday, which is the US convention. In
 * Armenia — and everywhere else this card will be opened — the week starts on
 * Monday, and a calendar that disagrees with the one in the guest's phone is
 * a small but real thing to trip over while checking a date.
 */
export function monthGrid(iso: string): GridCell[][] {
  const { y, m, d: wedding } = ymdInYerevan(iso);

  // getUTCDay() is 0=Sunday. Monday-first column index = (day + 6) % 7.
  const firstCol = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

  const cells: GridCell[] = [];
  for (let i = 0; i < firstCol; i++) cells.push({ day: null, isWedding: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, isWedding: d === wedding });
  while (cells.length % 7 !== 0) cells.push({ day: null, isWedding: false });

  const rows: GridCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

// ---------------------------------------------------------------------------
// COUNTDOWN
// ---------------------------------------------------------------------------

export type Remaining = { d: number; h: number; m: number; s: number; done: boolean };

export function remaining(targetIso: string, now: number): Remaining {
  const ms = new Date(targetIso).getTime() - now;
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
    done: false,
  };
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

// ---------------------------------------------------------------------------
// .ics — add to calendar
//
// Neither reference offers this, and it is the single most USEFUL thing on a
// wedding invitation: the guest presses it once and the day is in their phone
// with the address attached, whether they use iPhone, Android, Outlook or
// Google. A hand-rolled file is ~40 lines and needs no dependency.
// ---------------------------------------------------------------------------

/** RFC 5545 escaping: backslash, semicolon, comma and newline. Order matters —
 *  the backslash has to go first or it escapes the escapes. */
function esc(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** UTC stamp, "YYYYMMDDTHHMMSSZ". */
function stamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Fold to 75 OCTETS, not 75 characters.
 *
 * This is the trap in every hand-written .ics generator and it bites hardest
 * on exactly this content: Armenian letters are 2 bytes each in UTF-8, so a
 * line that looks 70 characters long is 140 octets, and folding by character
 * count produces a file some parsers reject. Worse, a naive fold can split a
 * multi-byte character in half. This walks code points and measures bytes.
 */
function fold(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    // 75 for the first line; continuation lines start with a space, so 74.
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + n > limit) {
      out.push(cur);
      cur = ch;
      bytes = n;
    } else {
      cur += ch;
      bytes += n;
    }
  }
  out.push(cur);
  return out.join("\r\n ");
}

export function buildIcs(opts: {
  uid: string;
  start: string;
  end: string;
  title: string;
  description: string;
  location: string;
  url?: string;
}): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KNIQ//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    // DTSTAMP must be the moment the file was generated, in UTC.
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(opts.start)}`,
    `DTEND:${stamp(opts.end)}`,
    `SUMMARY:${esc(opts.title)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    `LOCATION:${esc(opts.location)}`,
    ...(opts.url ? [`URL:${esc(opts.url)}`] : []),
    // One reminder, the day before. More than one is spam.
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(opts.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // CRLF throughout — RFC 5545 is explicit, and Outlook enforces it.
  return lines.map(fold).join("\r\n") + "\r\n";
}
