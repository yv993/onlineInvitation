// ============================================================================
// DURABLE STORAGE — the one thing standing between KNIQ and taking money.
//
// store.ts keeps the guest book, the order book and the short links in
// append-only JSONL files. That is honest and durable on anything with a disk
// (a VPS, `next start`, this dev server) and it is WRONG on Vercel, where the
// filesystem is per-instance and read-only: a minted link cannot be found by
// the next request, an RSVP is written into a void, and an uploaded photo is
// gone on redeploy. The site looked fine and quietly lost every lead.
//
// This is the durable half. It speaks Upstash Redis over its REST API, which
// is the right shape for three reasons: it is plain `fetch`, so the 5-dep
// budget is untouched; REST works from a serverless function with no
// connection pool to exhaust; and Vercel KV *is* Upstash, so the same code
// serves a Vercel KV store and a free Upstash one.
//
// THE CONTRACT IS UNCHANGED: every writer still returns a boolean that says
// what really happened, and store.ts still reports it as `stored`. Nothing
// here ever claims a write it did not make.
//
// TO TURN IT ON, set two env vars (either naming is accepted):
//   KV_REST_API_URL + KV_REST_API_TOKEN            (Vercel KV)
//   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN  (Upstash direct)
// Unset means OFF, and off means the files — so dev, a VPS and a laptop are
// all unchanged, and nothing about this file can break them.
// ============================================================================

const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "").replace(/\/+$/, "");
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

/** Configured? Unset means the filesystem path, exactly as before. */
export const kvOn = (): boolean => Boolean(url && token);

/** A guest waiting on an RSVP must never wait on a sulking network. */
const TIMEOUT_MS = 4000;

async function command<T>(args: (string | number)[]): Promise<{ ok: true; result: T } | { ok: false }> {
  if (!kvOn()) return { ok: false };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      // the token itself is never logged — only that it was refused
      console.error(`[kv] ${args[0]} failed: HTTP ${res.status}`);
      return { ok: false };
    }
    const body = (await res.json()) as { result?: T; error?: string };
    if (body.error) {
      console.error(`[kv] ${args[0]} error: ${body.error}`);
      return { ok: false };
    }
    return { ok: true, result: body.result as T };
  } catch (err) {
    console.error(`[kv] ${args[0]} threw:`, err instanceof Error ? err.message : err);
    return { ok: false };
  }
}

/** Append to a list — the JSONL line, without the file. */
export async function kvPush(list: string, value: unknown): Promise<boolean> {
  const r = await command<number>(["RPUSH", list, JSON.stringify(value)]);
  return r.ok;
}

/** The whole list, oldest first — the same order the files gave. */
export async function kvList<T>(list: string): Promise<T[]> {
  const r = await command<string[]>(["LRANGE", list, 0, -1]);
  if (!r.ok || !Array.isArray(r.result)) return [];
  const out: T[] = [];
  for (const line of r.result) {
    // one mangled row loses one row, never the list — the JSONL rule, kept
    try {
      out.push(typeof line === "string" ? (JSON.parse(line) as T) : (line as T));
    } catch {}
  }
  return out;
}

/** One record under its own key. A short link is a lookup, not a scan: the
 *  file version read every line of links.jsonl to answer one guest. */
export async function kvSet(key: string, value: unknown): Promise<boolean> {
  const r = await command<string>(["SET", key, JSON.stringify(value)]);
  return r.ok;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const r = await command<string | null>(["GET", key]);
  if (!r.ok || r.result === null || r.result === undefined) return null;
  try {
    return typeof r.result === "string" ? (JSON.parse(r.result) as T) : (r.result as T);
  } catch {
    return null;
  }
}
