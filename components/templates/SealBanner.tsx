"use client";

import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE WAX-SEAL BANNER — the hero of the «Կնիք և ժապավեն» template, measured
// from priglasi.pro's wax-seal invitation (pinterest.com/pin/1014576622302916830):
// a sheet of textured cream paper hanging over a plaster ground, cut to a
// pennant point at the foot, carrying the monogram over a hairline, the date in
// letterspaced caps, the names in a handwriting script — and a wax seal, poured
// over the point, with a floral relief pressed into it.
//
// Everything here is drawn, not photographed: the paper is a gradient + grain,
// the wax is an irregular blob with its own highlight and shadow, the relief is
// a line-art sprig. No asset, no licence, no third-party request.
// ============================================================================

const L = {
  wax: { hy: "Մոմե կնիք", en: "A wax seal", ru: "Сургучная печать" },
  months: {
    hy: ["ՀՈՒՆՎԱՐԻ", "ՓԵՏՐՎԱՐԻ", "ՄԱՐՏԻ", "ԱՊՐԻԼԻ", "ՄԱՅԻՍԻ", "ՀՈՒՆԻՍԻ", "ՀՈՒԼԻՍԻ", "ՕԳՈՍՏՈՍԻ", "ՍԵՊՏԵՄԲԵՐԻ", "ՀՈԿՏԵՄԲԵՐԻ", "ՆՈՅԵՄԲԵՐԻ", "ԴԵԿՏԵՄԲԵՐԻ"],
    en: ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
    // the genitive, as a date is spoken: «14 НОЯБРЯ 2026»
    ru: ["ЯНВАРЯ", "ФЕВРАЛЯ", "МАРТА", "АПРЕЛЯ", "МАЯ", "ИЮНЯ", "ИЮЛЯ", "АВГУСТА", "СЕНТЯБРЯ", "ОКТЯБРЯ", "НОЯБРЯ", "ДЕКАБРЯ"],
  },
};

/** «30 ՀՈԿՏԵՄԲԵՐԻ 2026» — the reference sets the day, the month and the year
 *  in letterspaced caps, nothing else */
export function capsDate(lang: Lang, iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return Number(m[3]) + " " + L.months[lang][Number(m[2]) - 1] + " " + m[1];
}

/** the wax's edge: a circle nudged out of true at twelve fixed points and
 *  smoothed — deterministic, so the server and the browser pour the same seal */
const WOBBLE = [1, 0.965, 1.03, 0.98, 1.045, 0.96, 1.02, 0.985, 1.04, 0.97, 1.015, 0.99];
function waxPath(cx: number, cy: number, r0: number): string {
  const pts = WOBBLE.map((k, i) => {
    const t = (i / WOBBLE.length) * Math.PI * 2;
    return { x: cx + Math.cos(t) * r0 * k, y: cy + Math.sin(t) * r0 * k };
  });
  const at = (i: number) => pts[(i + pts.length) % pts.length];
  let d = "M" + at(0).x.toFixed(1) + " " + at(0).y.toFixed(1);
  for (let i = 0; i < pts.length; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += "C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
  }
  return d + "Z";
}

/** the poured wax: an uneven disc, a pressed sprig, the couple's initials */
function WaxSeal({ a, b }: { a: string; b: string }) {
  return (
    <svg viewBox="0 0 100 100" className="kn-sb__sealSvg" role="img" aria-label={`${a} ${b}`}>
      <defs>
        <radialGradient id="kn-wax-g" cx="38%" cy="32%" r="72%">
          <stop offset="0" stopColor="#E3A567" />
          <stop offset="0.45" stopColor="#C07C36" />
          <stop offset="1" stopColor="#8A5324" />
        </radialGradient>
      </defs>
      {/* the poured edge, and the pool it sits in */}
      <path className="kn-sb__waxPool" d={waxPath(50, 51, 45)} fill="#7A4A20" opacity="0.35" />
      <path className="kn-sb__wax" d={waxPath(50, 50, 43)} fill="url(#kn-wax-g)" />
      <path className="kn-sb__waxRim" d={waxPath(50, 50, 34)} fill="none" stroke="#5E3212" strokeWidth="1" opacity="0.35" />
      <g className="kn-sb__press" fill="none" stroke="#5E3212" strokeWidth="1.7" strokeLinecap="round" opacity="0.62">
        {/* the sprig pressed into the wax */}
        <path d="M50 70V30" />
        <path d="M50 60c-7-1-11-5-12-12 6 0 11 4 12 12zM50 60c7-1 11-5 12-12-6 0-11 4-12 12z" />
        <path d="M50 48c-6-1-9-4-10-10 5 0 9 4 10 10zM50 48c6-1 9-4 10-10-5 0-9 4-10 10z" />
        <path d="M50 37c-4-1-7-4-7-8 4 0 7 3 7 8zM50 37c4-1 7-4 7-8-4 0-7 3-7 8z" />
        <circle cx="50" cy="28" r="2.6" />
      </g>
      <text className="kn-sb__sealTxt" x="50" y="88" textAnchor="middle">{a}{b ? ` · ${b}` : ""}</text>
    </svg>
  );
}

/** the line-art sprig the reference sets between its bands */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 46" className={`kn-sb__sprig${className ? ` ${className}` : ""}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <path d="M4 40C30 40 66 34 116 12" />
      <path d="M26 38c-3-8 0-14 7-18 2 8-1 14-7 18zM48 34c-3-8 1-14 8-18 2 8-2 14-8 18zM70 28c-2-8 2-14 9-17 1 8-3 14-9 17zM92 21c-1-8 3-13 10-15 1 8-4 13-10 15z" />
      <path d="M34 41c5-6 12-7 19-4-5 5-12 6-19 4zM56 36c5-6 12-7 19-4-5 5-12 6-19 4zM78 30c5-5 12-6 18-3-5 5-11 5-18 3z" />
    </svg>
  );
}

export default function SealBanner({ lang, a, b, iso, kicker, compact = false, embed = false }: {
  lang: Lang;
  a: string;
  b: string;
  /** the event ISO — spelled here, in caps, the reference way */
  iso: string;
  kicker: T | string;
  compact?: boolean;
  /** an embedded preview must not plant an <h1> in the host document */
  embed?: boolean;
}) {
  const H = compact || embed ? ("div" as const) : ("h1" as const);
  const date = capsDate(lang, iso);
  const ini = (x: string) => [...x][0] ?? "";
  const amp = lang === "hy" ? "և" : "and";
  return (
    <div className={`kn-sb${compact ? " kn-sb--compact" : ""}`}>
      {/* the seal lives OUTSIDE the pennant: the paper is clipped to its point,
          and a clip-path clips its children too — a seal inside it loses its
          lower half exactly where it should overhang */}
      <div className="kn-sb__hang">
      <div className="kn-sb__pennant">
        <p className="kn-sb__mono" aria-hidden="true"><span>{ini(a)}</span><i /><span>{ini(b)}</span></p>
        <p className="kn-sb__date" data-track>{date}</p>
        <H className="kn-sb__names">
          <span className="kn-sb__name" data-letters={compact ? undefined : true}>{a}</span>
          {b && <i className="kn-sb__amp">{amp}</i>}
          {b && <span className="kn-sb__name" data-letters={compact ? undefined : true}>{b}</span>}
        </H>
      </div>
        <span className="kn-sb__seal" title={t(lang, L.wax)} data-stamp={compact ? undefined : true}>
          <WaxSeal a={ini(a)} b={ini(b)} />
        </span>
      </div>
      <p className="kn-sb__kick" data-track>{typeof kicker === "string" ? kicker : t(lang, kicker)}</p>
      <span className="kn-sb__sprigWrap" aria-hidden="true" data-float="6"><Sprig /></span>
    </div>
  );
}
