import { couple, hero, occasions, programme } from "@/lib/content";
import { decodeDraft } from "@/lib/draft";
import { findTemplate } from "@/lib/templates";
import { buildIcs } from "@/lib/date";
import { t } from "@/lib/i18n";

// ============================================================================
// GET /api/ics — the wedding, as a calendar file.
//
// The most useful control on the whole card, and neither reference has one.
// The guest taps once and the day is in their phone with the address attached,
// on iPhone, Android, Outlook or Google alike, plus a reminder the day before.
//
// Built by hand in ~40 lines (lib/date.ts) rather than pulling a package: the
// format is a text file, and the only genuinely tricky part — folding lines at
// 75 OCTETS rather than 75 characters, which matters enormously here because
// every Armenian letter is two bytes — is handled there.
//
// The description carries all three stops, so a guest who later opens their
// calendar instead of the link still knows where to be and when.
// ============================================================================

export const dynamic = "force-dynamic"; // DTSTAMP must be generation time

export function GET(req: Request) {
  const lang = "hy" as const;

  const url = new URL(req.url);

  // ?p=<draft blob> — a couple's own details from the wizard. Sanitised by
  // decodeDraft; a bad blob falls through to the sample below, never a 500.
  const draft = decodeDraft(url.searchParams.get("p") ?? undefined);
  if (draft) {
    // A draft with no date yet is a valid draft (the wizard's empty state has
    // date: ""), and it used to reach buildIcs as "T12:00:00+04:00" — a
    // RangeError, and the 500 this route promises never to return. Say so
    // instead, in words a guest can read.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) {
      return new Response("This invitation has no date yet, so there is nothing to add to a calendar.", {
        status: 400, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
      });
    }
    const first = draft.stops[0]?.time || draft.time || "12:00";
    const occ = occasions[draft.occasion] ?? occasions.wedding;
    const where = [draft.venue, draft.address, draft.city].filter(Boolean).join(", ") || (draft.stops[0] ? [draft.stops[0].place, draft.stops[0].address].filter(Boolean).join(", ") : "");
    const ics = buildIcs({
      uid: `kniq-${draft.a}-${draft.b}-${draft.date}@invitation`.replace(/\s+/g, "-"),
      start: `${draft.date}T${first}:00+04:00`,
      end: `${draft.date}T23:59:00+04:00`,
      title: `${[draft.a, draft.b].filter(Boolean).join(" · ")} — ${t(lang, occ.calendarTitle)}`,
      description: draft.stops.map((x) => `${x.time}  ${x.name} — ${[x.place, x.address].filter(Boolean).join(", ")}`).join(String.fromCharCode(10)),
      location: where,
    });
    return new Response(ics, { headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": `attachment; filename="${draft.date}.ics"`, "cache-control": "no-store" } });
  }

  // ?t=<template id> — the live templates each carry their own event.
  const tId = url.searchParams.get("t");
  const tpl = tId ? findTemplate(tId) : undefined;
  if (tpl) {
    const ev = tpl.event;
    const ics = buildIcs({
      uid: `kniq-${tpl.id}-${ev.date}@invitation`,
      start: ev.date,
      end: ev.end,
      title: `${t(lang, ev.a)}${ev.b ? " · " + t(lang, ev.b) : ""} — ${t(lang, ev.kicker)}`,
      description: ev.stops.map((x) => `${x.time}  ${t(lang, x.name)} — ${t(lang, x.place)}`).join(String.fromCharCode(10)),
      location: `${t(lang, ev.venue)}, ${t(lang, ev.address)}, ${t(lang, ev.city)}`,
    });
    return new Response(ics, { headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": `attachment; filename="${tpl.id}.ics"`, "cache-control": "no-store" } });
  }

  const where = programme.stops[programme.stops.length - 1];
  const title = `${t(lang, couple.a)} և ${t(lang, couple.b)} — ${t(lang, hero.calendarTitle)}`;

  const description = programme.stops
    .map((s) => `${s.time}  ${t(lang, s.name)} — ${t(lang, s.place)}, ${t(lang, s.address)}`)
    .join("\n");

  const ics = buildIcs({
    // Stable UID: re-downloading updates the existing entry instead of adding
    // a second copy of the same wedding to the guest's calendar.
    uid: `kniq-${couple.date}@invitation`,
    start: couple.date,
    end: couple.end,
    title,
    description,
    location: `${t(lang, where.place)}, ${t(lang, where.address)}`,
  });

  return new Response(ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'attachment; filename="wedding.ics"',
      "cache-control": "no-store",
    },
  });
}
