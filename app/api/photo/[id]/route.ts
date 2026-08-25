import { readFile } from "node:fs/promises";
import path from "node:path";

// ============================================================================
// GET /api/photo/<id> — the child's photo a parent attached when the studio
// minted a short link. Written by /api/link into data/photos/<id>.jpg (same
// disk, same serverless caveat as the guest book); served here with a long
// cache. The id is the link's own 6-character alphabet — nothing else reaches
// the filesystem.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALPHA = "abcdefghjkmnpqrstuvwxyz23456789";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (id.length !== 6 || ![...id].every((ch) => ALPHA.includes(ch))) return new Response("not found", { status: 404 });
  try {
    const buf = await readFile(path.join(process.cwd(), "data", "photos", `${id}.jpg`));
    return new Response(new Uint8Array(buf), {
      headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" },
    });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
