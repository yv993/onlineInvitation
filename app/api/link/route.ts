import { decodeDraft, encodeDraft } from "@/lib/draft";
import { appendLink, newLinkId, newManageKey } from "@/lib/server/store";
import { findTemplate } from "@/lib/templates";
import { findStyle } from "@/lib/styles";
import { parseKidsTpl } from "@/lib/kids";
import { parseWTpl } from "@/lib/wcards";
import { parseLiveTpl } from "@/lib/invitations/styles";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// ============================================================================
// POST /api/link — the wizard's "Generate Web Link".
//
// Body: { tpl, draft (blob), lang }. The blob is decoded through the same
// sanitiser the preview uses and RE-ENCODED, so what is stored is never the
// raw client string. A 6-character id is minted (no 0/o/1/l/i, so it can be
// read aloud over a phone), the entry is appended to data/links.jsonl, and
// /invitation/<id> serves it. Rate-limited per IP the same way the RSVP is.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();
function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  let b: { tpl?: unknown; draft?: unknown; lang?: unknown; photo?: unknown };
  try {
    b = (await req.json()) as typeof b;
  } catch {
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) return Response.json({ ok: false, error: "slow down" }, { status: 429 });

  // a live template (wedding-1 …) or one of the three catalog styles (kniq | luys | tuf)
  const tpl = typeof b.tpl === "string" && (findTemplate(b.tpl) || findStyle(b.tpl) || parseKidsTpl(b.tpl) || parseWTpl(b.tpl) || parseLiveTpl(b.tpl)) ? b.tpl : null;
  const parsed = decodeDraft(typeof b.draft === "string" ? b.draft : undefined);
  if (!tpl || !parsed) return Response.json({ ok: false, error: "invalid" }, { status: 422 });
  const lang = b.lang === "en" ? "en" : "hy";

  const id = newLinkId();

  // A kids' card photo, sent as a JPEG data URL (≤ 1.5 MB after the studio's
  // canvas downscale). Written under the link's own id; the stored draft then
  // points at /api/photo/<id>, which is the only photo path decodeDraft accepts.
  const photo = typeof b.photo === "string" && b.photo.startsWith("data:image/jpeg;base64,") && b.photo.length < 2_100_000 ? b.photo : "";
  if (photo) {
    try {
      const buf = Buffer.from(photo.slice("data:image/jpeg;base64,".length), "base64");
      // JPEG magic bytes — a renamed anything else is refused
      if (buf.length > 200 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        const dir = path.join(process.cwd(), "data", "photos");
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, `${id}.jpg`), buf);
        parsed.photo = `/api/photo/${id}`;
      }
    } catch (err) {
      console.error("[link] photo not saved:", err);
    }
  }

  // the MANAGE KEY rides the record and is returned ONCE — it gates the
  // couple's own answers page, /guests/<id>?k=<key>
  const key = newManageKey();
  const stored = await appendLink({ id, tpl, draft: encodeDraft(parsed), lang, at: new Date().toISOString(), key });
  return Response.json(
    {
      ok: true, id, stored,
      path: `${lang === "hy" ? "" : "/en"}/invitation/${id}`,
      // only meaningful when the record could be written — a read-only disk
      // stores nothing, so there is nothing the key would ever unlock
      guests: stored ? `/guests/${id}?k=${key}` : undefined,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
