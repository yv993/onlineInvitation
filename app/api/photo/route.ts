import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { newLinkId } from "@/lib/server/store";

// ============================================================================
// POST /api/photo — the couple's own photograph, saved the moment they pick it.
//
// WHY EAGERLY, AND NOT AT LINK TIME. The wizard used to hold uploads as object
// URLs: instant in its own previews, meaningless anywhere else — so a guest
// link showed the template's stock plates and the couple's pictures only
// reached the studio by hand. A live preview is an IFRAME, and a blob: URL
// belongs to the document that made it, so even the preview on the same page
// could not show them. Saving here, at pick time, gives the photograph a plain
// same-origin path that the blob can carry, the iframe can load, and the guest
// page can render — with every effect the template already applies to its own
// plates (Ken Burns, the curtain reveal, the hover tilt, the lightbox).
//
// The same contract as every write here: nothing is trusted. Only a JPEG data
// URL is accepted, the magic bytes are checked (a renamed .exe is refused),
// the size is capped, and the id is the link alphabet — so /api/photo/<id>,
// which validates that alphabet, is the only path that can ever be produced.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREFIX = "data:image/jpeg;base64,";
const MAX_CHARS = 2_100_000; // ~1.5 MB of JPEG after the client's downscale

// One writer, one window: a script posting a thousand photographs would fill
// the disk. Same in-memory shape as the RSVP limiter, same trade.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, number[]>();
function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 500) {
    for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  let body: { photo?: unknown };
  try {
    body = (await req.json()) as { photo?: unknown };
  } catch {
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) return Response.json({ ok: false, error: "too many" }, { status: 429 });

  const raw = body.photo;
  if (typeof raw !== "string" || !raw.startsWith(PREFIX) || raw.length > MAX_CHARS) {
    return Response.json({ ok: false, error: "expected a jpeg data url" }, { status: 422 });
  }

  let buf: Buffer;
  try {
    buf = Buffer.from(raw.slice(PREFIX.length), "base64");
  } catch {
    return Response.json({ ok: false, error: "bad encoding" }, { status: 422 });
  }
  // JPEG magic bytes — the declared type is not evidence
  if (buf.length < 200 || buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) {
    return Response.json({ ok: false, error: "not a jpeg" }, { status: 422 });
  }

  const id = newLinkId();
  try {
    const dir = path.join(process.cwd(), "data", "photos");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${id}.jpg`), buf);
  } catch (err) {
    // A read-only disk is the demo's normal state on some hosts: say so
    // plainly rather than handing back a path that will 404.
    console.error("[photo] not saved:", err);
    return Response.json({ ok: false, stored: false, error: "not stored" }, { status: 503 });
  }

  return Response.json({ ok: true, stored: true, id, url: `/api/photo/${id}` }, { headers: { "cache-control": "no-store" } });
}
