import { readFile } from "node:fs/promises";
import path from "node:path";

// ============================================================================
// GET /api/audio/<id> — the couple's own track, written by /api/audio into
// data/audio/<id>.mp3|m4a (same disk, same serverless caveat as the guest
// book); served whole, with a long cache. No `accept-ranges` is CLAIMED —
// this handler does not honour Range requests, and advertising bytes it
// won't serve breaks seeking; a whole-body 200 downloads and plays fine.
// The id is the link alphabet — nothing else reaches the filesystem; the
// extension is whichever the sniffer stored, tried in order.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALPHA = "abcdefghjkmnpqrstuvwxyz23456789";
const TYPES = { mp3: "audio/mpeg", m4a: "audio/mp4" } as const;

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (id.length !== 6 || ![...id].every((ch) => ALPHA.includes(ch))) return new Response("not found", { status: 404 });
  for (const ext of ["mp3", "m4a"] as const) {
    try {
      const buf = await readFile(path.join(process.cwd(), "data", "audio", `${id}.${ext}`));
      return new Response(new Uint8Array(buf), {
        headers: {
          "content-type": TYPES[ext],
          "cache-control": "public, max-age=31536000, immutable",
          "x-content-type-options": "nosniff",
        },
      });
    } catch {
      /* try the other extension */
    }
  }
  return new Response("not found", { status: 404 });
}
