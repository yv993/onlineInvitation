import { serverClient, authReady } from "@/lib/server/supabase";
import { site } from "@/lib/content";

// ============================================================================
// POST /api/auth/login — ask Supabase to email a magic link.
//
// No password is stored, hashed, leaked or reset, which for a service someone
// signs into twice (once to publish, once to read their answers) is the right
// trade. Supabase Auth owns the token: single use, expiring, and compared on
// their side — three things that are easy to get subtly wrong by hand.
//
// TWO DELIBERATE BEHAVIOURS:
//   · The reply is the SAME whether or not the address has an account. An
//     endpoint that says "no such user" is an account-enumeration oracle:
//     anyone could learn which of their friends is planning a wedding here.
//   · It is rate limited per address AND per IP. Without that, this route is a
//     free way to send mail from the studio's domain to anyone.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 15 * 60 * 1000;
const PER_KEY = 5;
const hits = new Map<string, number[]>();

function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  // the map is per-instance and unbounded otherwise; keep it small
  if (hits.size > 4000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > PER_KEY;
}

/** Deliberately strict: one @, a dot in the domain, no spaces, sane length. */
function looksLikeEmail(v: unknown): v is string {
  return typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  if (!authReady) {
    return Response.json({ ok: false, reason: "unconfigured" }, { status: 503, headers: { "cache-control": "no-store" } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const email = (body as { email?: unknown })?.email;
  const next = (body as { next?: unknown })?.next;

  // Shape errors CAN be reported — they are not about whether an account
  // exists, so they leak nothing.
  if (!looksLikeEmail(email)) {
    return Response.json({ ok: false, reason: "email" }, { status: 400, headers: { "cache-control": "no-store" } });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(`e:${email.toLowerCase()}`) || limited(`i:${ip}`)) {
    // still the neutral shape — a rate-limited attacker learns nothing either
    return Response.json({ ok: true, sent: true }, { status: 429, headers: { "cache-control": "no-store" } });
  }

  const sb = await serverClient();
  if (!sb) return Response.json({ ok: false, reason: "unconfigured" }, { status: 503 });

  // Where Supabase sends them back to. Only ever our own origin: an
  // attacker-supplied redirect here would turn the magic link into an open
  // redirect that hands the session code to someone else's host.
  const origin = site.url || new URL(req.url).origin;
  const safeNext = typeof next === "string" && /^\/[a-zA-Z0-9/_-]*$/.test(next) ? next : "/my";

  await sb.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      // a wedding service should not silently create accounts for addresses
      // typed by mistake — but it also must not reveal which exist, so this
      // stays true and the neutral reply covers both cases
      shouldCreateUser: true,
    },
  });

  // NOTE the missing error check: it is on purpose. Reporting Supabase's
  // error verbatim would distinguish "unknown address" from "sent", which is
  // the enumeration leak this route is written to avoid. Real failures are
  // visible in the Supabase logs, not to the caller.
  return Response.json({ ok: true, sent: true }, { headers: { "cache-control": "no-store" } });
}
