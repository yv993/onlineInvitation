import { findLink, readRsvps } from "@/lib/server/store";

// ============================================================================
// GET /api/wishes?event=<minted-id> — the guests' words, given back to the
// guests (2026-08-26). The RSVP store keeps far more than a wall may show:
// sides, headcounts, diets, contact traces. This route strips each entry to
// NAME · DATE · MESSAGE, drops empty messages, unwraps the machine tag the
// form prepends («[id] · meal …»), and answers ONLY for ids that are real
// minted links — /invitations/wedding-5 is a template id, not a link, so the
// demos can never grow a wall of somebody's real words.
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const event = url.searchParams.get("event") ?? "";
  // only a minted link id opens a wall — the alphabet check lives in findLink
  const link = await findLink(event);
  if (!link) return Response.json({ ok: false }, { status: 404 });

  const rows = (await readRsvps()).filter((r) => r.event === event);
  const wishes = rows
    .map((r) => ({
      name: r.name,
      at: r.at,
      // the form joins its machine extras before the guest's words:
      // «meal: X · [id] their message» — everything through the last
      // bracketed tag is the machine's, the rest is the person's
      message: r.message.replace(/^[^\]]*\]\s*/, "").trim(),
    }))
    .filter((w) => w.message.length > 0)
    .map((w) => ({ ...w, message: w.message.slice(0, 240) }))
    .reverse()
    .slice(0, 40);

  return Response.json({ ok: true, wishes }, { headers: { "cache-control": "no-store" } });
}
