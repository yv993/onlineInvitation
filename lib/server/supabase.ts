import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// SUPABASE — the store that survives a deploy.
//
// WHY THIS EXISTS. Everything else in lib/server/store.ts is append-only JSONL
// on disk, which is honest and dependency-free and works perfectly on a box
// you own. It does NOT work on Vercel: the filesystem is read-only and /tmp is
// wiped between invocations (DEPLOY.md says so at the top). A manage key in a
// file that disappears is worse than no account at all, because a couple would
// trust it with their wedding. Accounts therefore need a real database.
//
// THE GUARD, and it is the same one robots.ts / sitemap.ts / Jsonld.tsx use:
// without credentials these return NULL rather than throwing. A KNIQ with no
// Supabase project keeps working exactly as it does today — the manage-key
// link (/guests/<id>?k=…) is untouched — and simply has no sign-in. Nothing
// half-configured ever pretends to store an account.
//
// THREE KEYS, and the difference matters:
//   · NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY — safe in the browser. Row Level
//     Security is what protects the data, not the secrecy of this key.
//   · SUPABASE_SERVICE_ROLE_KEY — BYPASSES RLS. Server only, and it must never
//     be given the NEXT_PUBLIC_ prefix or Next will inline it into the client
//     bundle and publish it to the world. It exists for exactly one job: a
//     GUEST has no account, so their RSVP insert cannot be done as them.
// ============================================================================

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Is there a project to talk to at all? Every caller checks this first. */
export const authReady = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * The request-scoped client: reads and writes the session cookie, so
 * `auth.uid()` is the signed-in couple and RLS does the rest.
 *
 * Returns null when unconfigured. Callers must handle that — it is the
 * difference between "no account system here" and a 500.
 */
export async function serverClient(): Promise<SupabaseClient | null> {
  if (!authReady) return null;
  const jar = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => {
        // In a Server COMPONENT the cookie jar is read-only and this throws.
        // That is expected and harmless: the middleware and the route handlers
        // are what refresh the session, so a failed write here means "someone
        // else already did it", not "the session is lost".
        try {
          for (const { name, value, options } of list) jar.set(name, value, options);
        } catch {}
      },
    },
  });
}

/**
 * The service-role client. RLS does not apply to it, so it is used ONLY where
 * an anonymous guest must write to a couple's data — the RSVP insert — and
 * every field is sanitised before it gets here.
 */
export function adminClient(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

/** The signed-in user, or null. Never throws, so a page can just ask. */
export async function currentUser(): Promise<{ id: string; email: string } | null> {
  const sb = await serverClient();
  if (!sb) return null;
  // getUser() re-validates against the auth server; getSession() trusts the
  // cookie, which is forgeable. Always getUser() on the server.
  const { data, error } = await sb.auth.getUser();
  if (error || !data.user?.email) return null;
  return { id: data.user.id, email: data.user.email };
}
