import { NextResponse } from "next/server";
import { serverClient, authReady } from "@/lib/server/supabase";

// ============================================================================
// GET /auth/callback — the other end of the magic link.
//
// Supabase sends the couple here with a one-time `code`; exchanging it sets
// the session cookie. This route sits OUTSIDE the (hy)/(en)/(ru) groups on
// purpose: it renders nothing, so it wants no root layout and no language.
//
// `next` is validated against a path shape before use. A redirect target taken
// from a query string and followed blindly is an open redirect — and on this
// particular route it would be one that fires immediately after a session is
// minted, which is the worst moment to send someone to a stranger's page.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const raw = url.searchParams.get("next") ?? "/my";
  // one leading slash, no protocol, no "//host" — a same-origin path or nothing
  const next = /^\/[a-zA-Z0-9/_-]*$/.test(raw) && !raw.startsWith("//") ? raw : "/my";

  if (!authReady || !code) {
    return NextResponse.redirect(new URL("/login?e=link", url.origin));
  }

  const sb = await serverClient();
  if (!sb) return NextResponse.redirect(new URL("/login?e=link", url.origin));

  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) {
    // expired, already used, or meant for another browser — all the same to
    // the reader, who just needs the door and a way to ask for a new link
    return NextResponse.redirect(new URL("/login?e=link", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
