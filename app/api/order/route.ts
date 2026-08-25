import { appendOrder } from "@/lib/server/store";
import { findStyle } from "@/lib/styles";
import { findTemplate } from "@/lib/templates";
import { parseKidsTpl } from "@/lib/kids";
import { parseWTpl } from "@/lib/wcards";
import { parseLiveTpl } from "@/lib/invitations/styles";
import { decodeDraft, encodeDraft } from "@/lib/draft";

// ============================================================================
// POST /api/order — a couple asking for their invitation.
//
// The concierge intake both Armenian references run behind WhatsApp, as a
// real endpoint: validated, spam-trapped, appended to data/orders.jsonl
// before any transport, then optionally delivered (same Resend / webhook
// wiring as the RSVP). The response tells the truth about what happened —
// `stored` and `delivered` are facts, not hopes.
//
// Same fake-accept posture as the RSVP: bots get a warm 200 and the floor.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_MS = 3000; // this form is five fields; nobody real finishes in 3s

/** Control-character strip, escape-free (see the RSVP route's history). */
function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  let out = "";
  for (const ch of v) {
    const c = ch.codePointAt(0) ?? 0;
    // Newlines are ALLOWED here (the details field is multi-line prose);
    // everything else in the control ranges still dies. The subject line
    // below is built only from single-line fields that get the full strip.
    const control = (c < 32 && c !== 10) || c === 127 || (c >= 128 && c <= 159);
    out += control ? " " : ch;
  }
  return out.trim().slice(0, max);
}

const oneLine = (v: unknown, max: number) => clean(v, max).replace(/\n+/g, " ");

const ok = (delivered: boolean, stored = false) =>
  Response.json({ ok: true, delivered, stored }, { headers: { "cache-control": "no-store" } });

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (oneLine(b.website, 80)) return ok(false);
  if (typeof b.elapsed !== "number" || b.elapsed < MIN_MS) return ok(false);

  const lang = b.lang === "en" ? "en" : "hy";
  const names = oneLine(b.names, 120);
  const contact = oneLine(b.contact, 160);
  const date = oneLine(b.date, 20);
  const details = clean(b.details, 4000);
  // Unknown style ids collapse to the default rather than erroring — the
  // style is a preference, not a credential.
  const style = findStyle(String(b.style))?.id ?? findTemplate(String(b.style))?.id ?? (parseKidsTpl(String(b.style)) || parseWTpl(String(b.style)) || parseLiveTpl(String(b.style)) ? String(b.style) : "kniq");
  // The builder's draft, if any — validated by the same decoder the preview
  // uses, then RE-ENCODED, so the stored blob is the sanitised one, never the
  // raw client string. A bad blob stores as empty, not as an error.
  const parsed = decodeDraft(typeof b.draft === "string" ? b.draft : undefined);
  const draft = parsed ? encodeDraft(parsed) : "";

  const errors: Record<string, string> = {};
  if (names.length < 3)
    errors.names = lang === "hy" ? "Գրեք ձեր անունները" : "Please add your names";
  if (contact.length < 5)
    errors.contact = lang === "hy" ? "Գրեք կապի միջոց" : "Please add a way to reach you";
  if (Object.keys(errors).length) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const stored = await appendOrder({
    at: new Date().toISOString(),
    style,
    names,
    date,
    contact,
    details,
    lang,
    draft,
  });

  const subject = `Order — ${style} — ${names}`;
  const text = [
    `Ոճ՝ ${style}`,
    `Անուններ՝ ${names}`,
    date ? `Օր՝ ${date}` : "",
    `Կապ՝ ${contact}`,
    // The studio opens exactly what the couple saw.
    draft ? `Նախադիտում՝ /invitation/${style}?p=${draft}` : "",
    details ? `\n${details}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const key = process.env.RESEND_API_KEY;
  const to = process.env.RSVP_TO;
  const hook = process.env.RSVP_WEBHOOK;

  if (!hook && !(key && to)) {
    console.info("[order] no transport configured — not sent:\n" + text);
    return ok(false, stored);
  }

  try {
    if (hook) {
      const r = await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "order", style, names, date, contact, details, subject }),
      });
      return ok(r.ok, stored);
    }
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
    if (!r.ok) console.error("[order] resend rejected:", r.status);
    return ok(r.ok, stored);
  } catch (e) {
    console.error("[order] transport threw:", e);
    return ok(false, stored);
  }
}
