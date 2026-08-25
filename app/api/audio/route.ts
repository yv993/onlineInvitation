import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { newLinkId } from "@/lib/server/store";

// ============================================================================
// POST /api/audio — the couple's own song, saved the moment they pick it.
//
// The same contract, and the same reason, as /api/photo: the wizard's music
// slot used to take only an https URL, which quietly assumed a couple who
// hosts mp3 files somewhere — nobody does. Now they hand over the file
// itself; it gets a plain same-origin path the blob can carry, the preview
// iframe can load, and the guest page can play — and because the path is
// same-origin, the dock's AnalyserNode reads a REAL waveform (a foreign URL
// only ever got the CSS pulse).
//
// Nothing is trusted: only an audio data URL is accepted, the MAGIC BYTES
// are checked (MP3 = ID3 tag or a raw MPEG frame sync; M4A = an `ftyp` box),
// the size is capped, and the id is the link alphabet — /api/audio/<id>,
// which validates that alphabet, is the only path this can ever mint.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREFIXES = ["data:audio/mpeg;base64,", "data:audio/mp3;base64,", "data:audio/mp4;base64,", "data:audio/x-m4a;base64,"];
const MAX_CHARS = 13_000_000; // ~9.5 MB of audio — a 4-minute track at 320 kbps

// one writer, one window — same shape as the photo limiter
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
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

/** the declared type is not evidence — read the bytes */
function sniff(buf: Buffer): "mp3" | "m4a" | null {
  if (buf.length < 4096) return null;
  // ID3v2 tag, or a bare MPEG audio frame sync (0xFFEx)
  if (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) return "mp3";
  if (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0) return "mp3";
  // ISO-BMFF: [4-byte size]"ftyp" — M4A/AAC in an MP4 box
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) return "m4a";
  return null;
}

export async function POST(req: Request) {
  let body: { audio?: unknown };
  try {
    body = (await req.json()) as { audio?: unknown };
  } catch {
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) return Response.json({ ok: false, error: "too many" }, { status: 429 });

  const raw = body.audio;
  const prefix = typeof raw === "string" ? PREFIXES.find((p) => raw.startsWith(p)) : undefined;
  if (typeof raw !== "string" || !prefix || raw.length > MAX_CHARS) {
    return Response.json({ ok: false, error: "expected an mp3/m4a data url" }, { status: 422 });
  }

  let buf: Buffer;
  try {
    buf = Buffer.from(raw.slice(prefix.length), "base64");
  } catch {
    return Response.json({ ok: false, error: "bad encoding" }, { status: 422 });
  }
  const kind = sniff(buf);
  if (!kind) return Response.json({ ok: false, error: "not an mp3 or m4a" }, { status: 422 });

  const id = newLinkId();
  try {
    const dir = path.join(process.cwd(), "data", "audio");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${id}.${kind}`), buf);
  } catch (err) {
    // a read-only disk is the demo's normal state on some hosts: say so
    console.error("[audio] not saved:", err);
    return Response.json({ ok: false, stored: false, error: "not stored" }, { status: 503 });
  }

  return Response.json({ ok: true, stored: true, id, url: `/api/audio/${id}` }, { headers: { "cache-control": "no-store" } });
}
