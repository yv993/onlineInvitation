import { NextResponse } from "next/server";
import { serverClient } from "@/lib/server/supabase";

// POST /api/auth/logout — end the session and come back to the front door.
// POST, not GET: a link that logs you out can be embedded in someone else's
// page and fired by an <img> tag.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sb = await serverClient();
  if (sb) await sb.auth.signOut();
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(new URL("/", origin), { status: 303 });
}
