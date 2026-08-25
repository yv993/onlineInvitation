import { adminKeyOk, findLink, linkKeyOk, readRsvps } from "@/lib/server/store";
import { xlsx } from "@/lib/server/xlsx";

// ============================================================================
// GET /api/rsvp/export?key=… — the guest list, as a file Excel opens cleanly.
//
// This is the deliverable behind iStudio's 5,000֏ add-on («տվյալները ավտոմատ
// պահպանվում են Excel աղյուսակում»), done properly:
//
// THE BOM IS THE WHOLE TRICK. Excel on Windows opens a .csv in the SYSTEM
// codepage unless the file starts with the UTF-8 byte-order mark — without
// it, every Armenian name in the list renders as mojibake and the feature is
// worthless to exactly its audience.  first, then the data.
//
// Quoting: RFC 4180 — every field wrapped, quotes doubled. A guest whose
// message contains a comma, a quote or a newline must not be able to shift
// columns (the CSV cousin of the header injection the RSVP route already
// strips).
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  // TWO DOORS (2026-08-25): the owner's key opens everything; a couple's
  // MANAGE KEY (?link=<id>&k=<key>) opens exactly that link's answers.
  const key = url.searchParams.get("key");
  const linkId = url.searchParams.get("link");
  const manage = url.searchParams.get("k");
  let scope: string | null = null;
  if (linkId) {
    const entry = await findLink(linkId);
    if (!linkKeyOk(entry, manage)) return new Response("Not authorized", { status: 401 });
    scope = linkId;
  } else if (!adminKeyOk(key)) {
    return new Response("Not authorized", { status: 401 });
  }

  const all = await readRsvps();
  const rows = scope ? all.filter((r) => r.event === scope) : all;

  // ---- ?fmt=xlsx — the real workbook (lib/server/xlsx.ts) -----------------
  // Two worksheets: every answer, and a summary the couple actually reads —
  // totals, the yes/no split, how the sides balance, per-event counts.
  if (url.searchParams.get("fmt") === "xlsx") {
    const sideHy = { bride: "Հարսի", groom: "Փեսայի", both: "Երկուսի" } as const;
    const answers: Array<Array<string | number>> = [
      ["Ամսաթիվ", "Անուն", "Հյուրեր", "Կողմ", "Գալիս է", "Ուղեկցողներ", "Սնունդ", "Խոսք", "Հրավերի անունը", "Մեծահասակ", "Երեխա", "Ալերգիա", "Միջոցառում"],
      ...rows.map((r) => [
        r.at.replace("T", " ").slice(0, 16), r.name, r.guests, sideHy[r.side] ?? r.side,
        r.coming === "yes" ? "Այո" : "Ոչ", r.plusOne ?? "", r.diet ?? "", r.message, r.from,
        r.adults ?? "", r.kids ?? "", r.allergy ?? "", r.event ?? "",
      ]),
    ];

    const yes = rows.filter((r) => r.coming === "yes");
    const bySide = (s: "bride" | "groom" | "both") => yes.filter((r) => r.side === s);
    const sum = (xs: typeof rows) => xs.reduce((n, r) => n + (Number(r.guests) || 0), 0);
    const events = [...new Set(rows.map((r) => r.event ?? ""))];
    const summary: Array<Array<string | number>> = [
      ["Ամփոփում", ""],
      ["Պատասխաններ", rows.length],
      ["Գալիս են", yes.length],
      ["Չեն գալիս", rows.length - yes.length],
      ["Հյուրեր (գալիս են)", sum(yes)],
      ["", ""],
      ["Կողմ", "Հյուրեր"],
      ["Հարսի", sum(bySide("bride"))],
      ["Փեսայի", sum(bySide("groom"))],
      ["Երկուսի", sum(bySide("both"))],
      ["", ""],
      ["Միջոցառում", "Պատասխաններ"],
      ...events.map((e): Array<string | number> => [e || "—", rows.filter((r) => (r.event ?? "") === e).length]),
    ];

    return new Response(new Uint8Array(xlsx([
      { name: "Պատասխաններ", rows: answers, widths: [17, 22, 8, 10, 9, 16, 14, 30, 16, 11, 8, 16, 14] },
      { name: "Ամփոփում", rows: summary, widths: [24, 14] },
    ])), {
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "content-disposition": 'attachment; filename="guests.xlsx"',
        "cache-control": "no-store",
      },
    });
  }

  const head = [
    "Ամսաթիվ",
    "Անուն",
    "Հյուրեր",
    "Կողմ",
    "Գալիս է",
    "Ուղեկցողներ",
    "Սնունդ",
    "Խոսք",
    "Հրավերի անունը",
    "Մեծահասակ",
    "Երեխա",
    "Ալերգիա",
    "Միջոցառում",
  ];
  const side = { bride: "Հարսի", groom: "Փեսայի", both: "Երկուսի" } as const;

  const body = rows.map((r) =>
    [
      q(r.at.replace("T", " ").slice(0, 16)),
      q(r.name),
      q(r.guests),
      q(side[r.side] ?? r.side),
      q(r.coming === "yes" ? "Այո" : "Ոչ"),
      q(r.plusOne ?? ""),
      q(r.diet ?? ""),
      q(r.message),
      q(r.from),
      q(r.adults ?? ""),
      q(r.kids ?? ""),
      q(r.allergy ?? ""),
      q(r.event ?? ""),
    ].join(","),
  );

  //  written as an escape, never as the literal invisible character —
  // an invisible byte in source is exactly the kind of thing that silently
  // disappears in an edit, and losing it breaks the feature for its audience.
  const csv = "\uFEFF" + [head.map(q).join(","), ...body].join("\r\n") + "\r\n";

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="guests.csv"',
      "cache-control": "no-store",
    },
  });
}
