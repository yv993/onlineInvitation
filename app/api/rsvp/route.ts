import { couple } from "@/lib/content";
import { appendRsvp } from "@/lib/server/store";

// ============================================================================
// POST /api/rsvp — zero dependencies, env-gated delivery, honest response.
//
// THE CONTRACT, carried from every project in this stack: the browser is told
// `delivered: true` ONLY when a mail provider actually accepted the message.
// With nothing configured (the default, and what runs on the demo) it returns
// `delivered: false` and the form says so in plain words. A green tick over a
// message that went nowhere is the one failure a wedding RSVP cannot have —
// the guest thinks they answered and the couple sets no chair.
//
// SPAM HANDLING IS FAKE-ACCEPT, NOT REJECT. A bot that is told "no" retries
// with a different shape; a bot that is told "thank you" goes away. Both the
// honeypot and the too-fast submission return a normal 200 and drop the
// payload on the floor.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: unknown;
  guests?: unknown;
  side?: unknown;
  coming?: unknown;
  message?: unknown;
  lang?: unknown;
  from?: unknown;
  plusOne?: unknown;
  diet?: unknown;
  event?: unknown;
  deadline?: unknown;
  adults?: unknown;
  kids?: unknown;
  allergy?: unknown;
  website?: unknown;
  elapsed?: unknown;
};

const MIN_MS = 2000; // nobody reads and fills this form in under two seconds
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

// In-memory and therefore per-instance: it resets on deploy and does not span
// serverless workers. That is the right trade here — it costs nothing, stops
// the only attack this endpoint realistically sees (one script hammering one
// box), and the alternative is a database for a form that a hundred people
// will submit once each.
const hits = new Map<string, number[]>();

function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  // Unbounded growth is the quiet bug in every in-memory limiter. Once the map
  // is large, drop every key whose newest hit has aged out.
  if (hits.size > 500) {
    for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

/**
 * Strip control characters and cap the length.
 *
 * The control characters are the point: CR and LF inside a value that later
 * becomes an email Subject line are header injection, and this endpoint puts
 * the guest's own name straight into one.
 *
 * WRITTEN WITHOUT A SINGLE ESCAPE SEQUENCE, and that is not stylistic. Three
 * attempts to express this as a regex character class reached disk with the
 * escapes collapsed — the class became a literal "-" and the whitespace class
 * became a literal "s". That version stripped nothing (an injected CRLF sailed
 * through into the Subject) AND corrupted ordinary input: "Sasun
 * Ter-Petrosyan" came out as "Sa un Ter Petro yan". A comparison against
 * codePointAt cannot be silently mangled by anything in the pipeline.
 *
 * Both failures were caught by posting the hostile string at the running
 * endpoint and reading what the server logged. Neither was visible in review.
 */
function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  let out = "";
  for (const ch of v) {
    const c = ch.codePointAt(0) ?? 0;
    // C0 controls, DEL, and the C1 range. CR and LF live in here and they
    // are the whole point: this value becomes an email Subject line.
    const control = c < 32 || c === 127 || (c >= 128 && c <= 159);
    out += control ? " " : ch;
  }
  // Collapse runs of spaces without a regex escape in sight.
  return out.split(" ").filter(Boolean).join(" ").slice(0, max);
}

const ok = (delivered: boolean, stored = false) =>
  Response.json({ ok: true, delivered, stored }, { headers: { "cache-control": "no-store" } });

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, errors: { name: "Bad request" } }, { status: 400 });
  }

  // --- the two silent traps ------------------------------------------------
  if (clean(body.website, 80)) return ok(false);
  if (typeof body.elapsed !== "number" || body.elapsed < MIN_MS) return ok(false);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (limited(ip)) return ok(false);

  // --- the deadline, enforced here and not only in the UI ------------------
  // The sample couple's deadline applies to the sample card only. A template
  // or a kids' link names its own event (and, if the parent set one, its own
  // deadline); without that tag every other invitation on the site would
  // have gone dark the day the sample wedding's RSVP closed.
  const event = clean(body.event, 40);
  const ownDeadline = typeof body.deadline === "string" && !Number.isNaN(Date.parse(body.deadline)) ? Date.parse(body.deadline) : null;
  if (!event && Date.now() > new Date(couple.rsvpBy).getTime()) {
    return Response.json({ ok: false, closed: true }, { status: 409 });
  }
  if (event && ownDeadline !== null && Date.now() > ownDeadline) {
    return Response.json({ ok: false, closed: true }, { status: 409 });
  }

  // --- validation ----------------------------------------------------------
  const lang = body.lang === "en" ? "en" : body.lang === "ru" ? "ru" : "hy";
  const name = clean(body.name, 80);
  const guests = Number(body.guests);
  const coming = body.coming === "yes" || body.coming === "no" ? body.coming : null;
  const side =
    body.side === "bride" || body.side === "groom" || body.side === "both" ? body.side : "both";
  const message = clean(body.message, 1000);
  const from = clean(body.from, 40);
  const plusOne = coming === "yes" ? clean(body.plusOne, 160) : "";
  const diet = coming === "yes" ? clean(body.diet, 160) : "";
  const cnt = (v: unknown) => { const x = Number(v); return Number.isInteger(x) && x >= 0 && x <= 20 ? x : undefined; };
  const adults = coming === "yes" ? cnt(body.adults) : undefined;
  const kids = coming === "yes" ? cnt(body.kids) : undefined;
  const allergy = coming === "yes" ? clean(body.allergy, 160) : "";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = lang === "hy" ? "Գրեք ձեր անունը" : lang === "ru" ? "Напишите ваше имя" : "Please add your name";
  if (!Number.isFinite(guests) || guests < 1 || guests > 20)
    errors.guests = lang === "hy" ? "1-ից 20" : lang === "ru" ? "От 1 до 20" : "Between 1 and 20";
  if (!coming) errors.coming = lang === "hy" ? "Ընտրեք պատասխանը" : lang === "ru" ? "Выберите ответ" : "Please choose an answer";

  // `!coming` is already an entry in `errors`, so this adds nothing for the
  // client — it exists so the compiler can see that past this point `coming`
  // is a real answer, not null.
  if (Object.keys(errors).length || !coming) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  // --- the guest book, before any transport --------------------------------
  // The couple's own record. Appended first so a transport failure can never
  // lose an answer that reached us; `stored` goes back to the browser so the
  // done screen can tell the truth about where the answer now lives.
  const stored = await appendRsvp({
    at: new Date().toISOString(),
    name,
    guests,
    side,
    coming,
    message,
    from,
    lang,
    plusOne,
    diet,
    event: event || undefined,
    adults,
    kids,
    allergy: allergy || undefined,
  });

  const sideWord = { bride: "հարսի", groom: "փեսայի", both: "երկուսի" }[side];
  const lines = [
    `${coming === "yes" ? "✓ ԳԱԼԻՍ Է" : "✗ ՉԻ ԳԱԼԻՍ"}`,
    `Անուն՝ ${name}`,
    `Հյուրեր՝ ${guests}`,
    `Կողմ՝ ${sideWord}`,
    plusOne ? `Ուղեկցող՝ ${plusOne}` : "",
    diet ? `Սնունդ՝ ${diet}` : "",
    adults !== undefined || kids !== undefined ? `Մեծահասակ՝ ${adults ?? 0} · Երեխա՝ ${kids ?? 0}` : "",
    allergy ? `Ալերգիա՝ ${allergy}` : "",
    event ? `Միջոցառում՝ ${event}` : "",
    from ? `Հրավերը՝ ${from}` : "",
    message ? `\n${message}` : "",
  ].filter(Boolean);
  const text = lines.join("\n");
  const subject = `RSVP — ${name} (${guests}) — ${coming === "yes" ? "yes" : "no"}`;

  // --- delivery, entirely optional ----------------------------------------
  // Three transports, each env-gated, EVERY configured one is tried:
  //   · a webhook             (RSVP_WEBHOOK)
  //   · email via Resend      (RESEND_API_KEY + RSVP_TO)
  //   · Telegram, to the couple's own chat or channel
  //                           (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID)
  // `delivered` is true when AT LEAST ONE transport actually accepted the
  // message — the same honesty contract as before: a green tick over a
  // message that went nowhere is the one failure an RSVP cannot have.
  const key = process.env.RESEND_API_KEY;
  const to = process.env.RSVP_TO;
  const hook = process.env.RSVP_WEBHOOK;
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  const haveTg = Boolean(tgToken && tgChat);

  // Nothing configured: this is the demo's normal path. Log it so it is
  // visible while developing, and tell the truth to the browser.
  if (!hook && !(key && to) && !haveTg) {
    console.info("[rsvp] no transport configured — not sent:\n" + text);
    return ok(false, stored);
  }

  // A transport that throws must never look like a delivered message —
  // each one fails alone, and only an actual acceptance counts.
  let delivered = false;

  if (hook) {
    try {
      const r = await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, guests, side, coming, message, from, subject }),
      });
      delivered = r.ok || delivered;
    } catch (e) { console.error("[rsvp] webhook threw:", e); }
  }

  if (key && to) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: process.env.RSVP_FROM ?? "invitation@resend.dev",
          to: [to],
          subject,
          text,
        }),
      });
      if (!r.ok) console.error("[rsvp] resend rejected:", r.status, await r.text().catch(() => ""));
      delivered = r.ok || delivered;
    } catch (e) { console.error("[rsvp] resend threw:", e); }
  }

  if (haveTg) {
    try {
      // the Bot API answers 200 with { ok: true } only when the message is in
      // the chat — that, and nothing weaker, is what counts as delivered
      const r = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: tgChat, text }),
      });
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean };
      if (!r.ok || d.ok !== true) console.error("[rsvp] telegram rejected:", r.status);
      delivered = (r.ok && d.ok === true) || delivered;
    } catch (e) { console.error("[rsvp] telegram threw:", e); }
  }

  return ok(delivered, stored);
}
