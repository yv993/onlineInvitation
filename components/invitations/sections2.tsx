"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";
import { qrMatrix } from "@/lib/qr";
import { t } from "@/lib/i18n";
import type { RenderCtx, ScheduleBlock } from "@/types/invitation";
import { VenueMapButton, hostsLine, inYerevan, longDate } from "./sections";

// ============================================================================
// THE SECOND SECTION SET — the parts the AreOne «Wedding Ticket», AreOne
// «Pearls» and the Ewedlab «Dusty Blue» reveal add to the engine's vocabulary.
// Same contract as sections.tsx: every part reads RenderCtx, every string is
// bilingual, nothing fetches. Measured from the references (a 375px column):
//
//   TICKET    cream card on navy, perforated ends (Ø12 holes, 16px pitch),
//             «WEDDING TICKET» letterspaced, plane, line globe ~90px, names
//             34px serif caps + script «and», 2×2 table (7px labels, 11px
//             values), round stamp Ø64 with text on the path, postmark waves,
//             «BOARDING FOR LOVE», vertical «DEPARTURE»; dashed flight path
//             between sections; luggage tag; VENUE ticket with «HOW TO GET
//             THERE» and the photo; dotted timeline with the times right.
//   PEARLS    logo + date top bar; names 64px sans stacked; script sub-line;
//             B&W photo; note card (white, −2°, paper clip) on a kraft
//             envelope with the monogram; three-day strip; VENUE on a silver
//             tray (ceremony · banquet, «View on map»); taupe PROGRAM band
//             with the hours along a pearl string; fabric circles; «Our
//             channel»; «Wishes».
//   DUSTY     gatefold envelope, embossed; butterfly card; arched photo with
//             the date block; script «timeline» list with thin rules; «THE
//             details» (QR · hearts · hotel); «please RSVP»; navy end card
//             with an ornate oval frame.
// ============================================================================

const L = {
  ticket: { hy: "Հարսանեկան տոմս", en: "Wedding ticket" },
  flight: { hy: "Թռիչք և օր", en: "Flight & date" },
  cls: { hy: "Դաս", en: "Class" },
  first: { hy: "Առաջին դաս", en: "First class" },
  dest: { hy: "Ուղղություն", en: "Destination" },
  loc: { hy: "Հարսանիքի վայրը", en: "Wedding location" },
  boarding: { hy: "Նստեցում՝ հանուն սիրո", en: "Boarding for love" },
  departure: { hy: "Մեկնում", en: "Departure" },
  home: { hy: "Տուն", en: "Home" },
  venue: { hy: "Վայրը", en: "Venue" },
  getThere: { hy: "Ինչպես հասնել", en: "How to get there" },
  waiting: { hy: "Սպասում ենք Ձեզ", en: "We are waiting for you" },
  saveDate: { hy: "Save the date", en: "Save the date" },
  ceremony: { hy: "Արարողություն", en: "Ceremony" },
  banquet: { hy: "Խնջույք", en: "Banquet" },
  viewMap: { hy: "Դիտել քարտեզում", en: "View on map" },
  savePlace: { hy: "Հիշեք վայրը", en: "Save the place!" },
  join: { hy: "Միանալ", en: "Join" },
  joinSoon: { hy: "Հղումը կավելացվի պատվերի ժամանակ", en: "The link is set at order time" },
  hotel: { hy: "Առաջարկվող հյուրանոց", en: "Recommended hotel" },
  details: { hy: "Մանրամասներ", en: "details" },
  the: { hy: "", en: "The" },
  qr: { hy: "Այս հրավերը", en: "This invitation" },
  qrHint: { hy: "Սկանավորեք՝ պահելու կամ փոխանցելու համար", en: "Scan to keep or forward" },
  please: { hy: "խնդրում ենք", en: "please" },
  rsvp: { hy: "Պատասխանել", en: "RSVP" },
  by: { hy: "մինչև", en: "By" },
  in: { hy: "", en: "In the celebration of their love" },
  at: { hy: "ժամը", en: "at" },
  weekday: { hy: ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"] },
  months: { hy: ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"], en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"] },
  monthsShort: { hy: ["ՀՆՎ", "ՓՏՎ", "ՄՐՏ", "ԱՊՐ", "ՄՅՍ", "ՀՆՍ", "ՀԼՍ", "ՕԳՍ", "ՍԵՊ", "ՀՈԿ", "ՆՈՅ", "ԴԵԿ"], en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], ru: ["ЯНВ", "ФЕВ", "МАР", "АПР", "МАЙ", "ИЮН", "ИЮЛ", "АВГ", "СЕН", "ОКТ", "НОЯ", "ДЕК"] },
};
const pad2 = (n: number) => String(n).padStart(2, "0");
const dotted = (iso: string) => { const x = inYerevan(iso); return `${pad2(x.d)}.${pad2(x.m + 1)}.${x.y}`; };
const firstVenueBlock = (ctx: RenderCtx): ScheduleBlock | undefined => ctx.data.schedule.blocks.find((b) => b.mapUrl) ?? ctx.data.schedule.blocks[0];

// ---------------------------------------------------------------- glyphs
export function Plane({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M21 15.5v-1.7l-8-4.9V3.6a1.3 1.3 0 0 0-2.6 0v5.3l-8 4.9v1.7l8-2.5v4.5l-2 1.5v1.3l3.3-1 3.3 1V19l-2-1.5V13l8 2.5z" fill="currentColor" />
    </svg>
  );
}
export function Globe({ size = 90, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="50" cy="50" r="40" />
      <ellipse cx="50" cy="50" rx="16" ry="40" />
      <ellipse cx="50" cy="50" rx="30" ry="40" />
      <path d="M10 50h80M16 30h68M16 70h68" />
      <path d="M28 36c4-4 10-5 14-2s2 8 7 9 9-3 13 1 2 8-2 10-10-1-14 2-4 7-9 6-9-6-8-11 3-11-1-15z" fill="currentColor" stroke="none" opacity="0.18" />
      <path d="M58 62c3-3 8-2 10 1s1 7-2 8-8-1-9-4 0-4 1-5z" fill="currentColor" stroke="none" opacity="0.18" />
    </svg>
  );
}
export function Heart({ size = 14, className = "" }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.1C.8 8.2 3 4.5 6.6 4.5c2 0 3.6 1.1 4.4 2.7.8-1.6 2.4-2.7 4.4-2.7 3.6 0 5.8 3.7 4.2 7.4C19.5 16.4 12 21 12 21z" fill="currentColor" /></svg>;
}
export function Butterfly({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M60 48C44 18 8 8 10 36c2 18 30 20 50 12z" opacity="0.92" />
        <path d="M60 48C44 78 10 88 12 62c2-18 30-22 48-14z" opacity="0.78" />
        <path d="M60 48c16-30 52-40 50-12-2 18-30 20-50 12z" opacity="0.92" />
        <path d="M60 48c16 30 50 40 48 14-2-18-30-22-48-14z" opacity="0.78" />
      </g>
      <g fill="none" stroke="var(--iv-bg)" strokeWidth="0.8" opacity="0.55">
        <path d="M60 48C46 30 28 22 18 30M60 48C44 62 26 70 18 64M60 48c14-18 32-26 42-18M60 48c16 14 34 22 42 16" />
      </g>
      <ellipse cx="60" cy="50" rx="3" ry="15" fill="var(--iv-ink)" opacity="0.85" />
      <path d="M58 36c-3-5-6-8-10-10M62 36c3-5 6-8 10-10" fill="none" stroke="var(--iv-ink)" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
/** a string of pearls along a cubic bezier — deterministic placement, so the
 *  server and the browser draw the same beads */
export function PearlString({ d, n = 34, r = 5, className = "", width = 120, height = 420 }: { d: [number, number, number, number, number, number, number, number]; n?: number; r?: number; className?: string; width?: number; height?: number }) {
  const gid = useId().replace(/[:]/g, "");
  const pts = useMemo(() => {
    const [x0, y0, x1, y1, x2, y2, x3, y3] = d;
    const out: Array<[number, number]> = [];
    for (let i = 0; i <= n; i++) {
      const tt = i / n, u = 1 - tt;
      const x = u * u * u * x0 + 3 * u * u * tt * x1 + 3 * u * tt * tt * x2 + tt * tt * tt * x3;
      const y = u * u * u * y0 + 3 * u * u * tt * y1 + 3 * u * tt * tt * y2 + tt * tt * tt * y3;
      out.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
    }
    return out;
  }, [d, n]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={gid} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f1ebe0" />
          <stop offset="1" stopColor="#b9ae9c" />
        </radialGradient>
      </defs>
      <g data-pop>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={`url(#${gid})`} stroke="rgba(0,0,0,0.08)" strokeWidth="0.4" />)}</g>
    </svg>
  );
}
/** the dashed flight path with the plane at its end — an ornament between bands */
export function FlightPath({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 300 90" className={`iv-flight${flip ? " iv-flight--flip" : ""}${className ? ` ${className}` : ""}`} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" data-dash>
      <path d="M10 70C70 70 90 20 150 20s90 50 130 30" strokeWidth="1.2" strokeDasharray="4 6" strokeLinecap="round" />
      <g transform="translate(276 44) rotate(35)"><path d="M9 0v-1.2l-5.6-3.5V-8a.9.9 0 0 0-1.8 0v3.3L-4 -1.2V0l5.6-1.8v3.2l-1.4 1v.9l2.3-.7 2.3.7v-.9l-1.4-1v-3.2z" fill="currentColor" stroke="none" /></g>
    </svg>
  );
}
export function QrSvg({ text, className = "" }: { text: string; className?: string }) {
  const m = useMemo(() => qrMatrix(text), [text]);
  const n = m.length;
  const path = useMemo(() => { let d = ""; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x} ${y}h1v1h-1z`; return d; }, [m, n]);
  return (
    <svg className={className} viewBox={`-2 -2 ${n + 4} ${n + 4}`} role="img" aria-label="QR" shapeRendering="crispEdges">
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#fff" />
      <path d={path} fill="#1C1A17" />
    </svg>
  );
}

// ---------------------------------------------------------------- TICKET (style C)
/** the boarding pass — the gate's face and the page's head */
export function BoardingPass({ ctx, as = "hero", children }: { ctx: RenderCtx; as?: "gate" | "hero"; children?: React.ReactNode }) {
  const { lang, data } = ctx;
  const H = ctx.compact || ctx.embed ? ("div" as const) : ("h1" as const);

  const [a, b] = data.identity.hosts;
  const v = firstVenueBlock(ctx);
  const x = inYerevan(data.identity.date);
  const stamp = `${t(lang, a)} & ${b ? t(lang, b) : ""} · ${x.d} ${L.monthsShort[lang][x.m]} ${x.y} · `;
  const sid = useId().replace(/[:]/g, "");
  return (
    <div className={`iv-tk iv-tk--${as}`}>
      <span className="iv-tk__side" aria-hidden="true"><Icon name="chevron" size={10} /> {t(lang, L.departure)}</span>
      <p className="iv-tk__kick">{t(lang, data.features.gate?.label ?? L.ticket)}</p>
      <Plane size={16} className="iv-tk__plane" />
      <span data-float="6"><Globe size={as === "gate" ? 92 : 84} className="iv-tk__globe" /></span>
      <H className="iv-tk__names" data-rise={as === "hero" ? true : undefined}>
        <span data-letters>{t(lang, a)}</span>
        {b && <><i className="iv-tk__and">{lang === "hy" ? "և" : "and"}</i><span data-letters>{t(lang, b)}</span></>}
      </H>
      <dl className="iv-tk__table">
        <div><dt>{t(lang, L.flight)}</dt><dd>{dotted(data.identity.date)}</dd></div>
        <div><dt>{t(lang, L.cls)}</dt><dd>{t(lang, L.first)}</dd></div>
        <div><dt>{t(lang, L.dest)}</dt><dd>{t(lang, data.identity.city)}</dd></div>
        <div><dt>{t(lang, L.loc)}</dt><dd>{v ? t(lang, v.venue) : t(lang, data.identity.city)}</dd></div>
      </dl>
      <div className="iv-tk__stamps" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="iv-tk__stamp" data-stamp>
          <defs><path id={sid} d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0" /></defs>
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <text fontSize="8.2" letterSpacing="1.4" fill="currentColor" fontFamily="var(--iv-fb)"><textPath href={`#${sid}`}>{stamp.toUpperCase()}</textPath></text>
          <g transform="translate(50 50) scale(1.1)"><path d="M9 0v-1.2l-5.6-3.5V-8a.9.9 0 0 0-1.8 0v3.3L-4 -1.2V0l5.6-1.8v3.2l-1.4 1v.9l2.3-.7 2.3.7v-.9l-1.4-1v-3.2z" fill="currentColor" transform="rotate(-30)" /></g>
        </svg>
        <svg viewBox="0 0 120 60" className="iv-tk__post"><path d="M4 12c14 0 14 6 28 6s14-6 28-6 14 6 28 6 14-6 28-6M4 24c14 0 14 6 28 6s14-6 28-6 14 6 28 6 14-6 28-6M4 36c14 0 14 6 28 6s14-6 28-6 14 6 28 6 14-6 28-6M4 48c14 0 14 6 28 6s14-6 28-6 14 6 28 6 14-6 28-6" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
        <span className="iv-tk__logo">ԿՆԻՔ</span>
      </div>
      <p className="iv-tk__foot">{t(lang, L.boarding)}</p>
      {children}
    </div>
  );
}
export function LuggageTag({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const d = data.extras?.destination;
  if (!d) return null;
  return (
    <section className="iv-tag" aria-label={t(lang, d.label ?? L.dest)} data-stamp>
      <span className="iv-tag__hole" aria-hidden="true" />
      <Globe size={44} className="iv-tag__globe" />
      <div>
        <small>{t(lang, d.label ?? L.dest)}</small>
        <b>{t(lang, d.place)}</b>
        <span>{t(lang, d.region)}</span>
      </div>
      <small className="iv-tag__home"><Icon name="map" size={11} /> {t(lang, L.home)}</small>
    </section>
  );
}
export function VenueTicket({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const v = firstVenueBlock(ctx);
  const photo = data.assets.gallery.find((m): m is Extract<typeof m, { kind: "image" }> => m.kind === "image");
  if (!v) return null;
  return (
    <section className="iv-vt" aria-label={t(lang, L.venue)}>
      <p className="iv-vt__h" data-rise>{t(lang, L.venue)} <Plane size={12} /></p>
      <b className="iv-vt__name" data-rise>{t(lang, v.venue)}</b>
      {v.address && <p className="iv-vt__addr" data-rise>{t(lang, v.address)}</p>}
      <div data-rise><VenueMapButton block={v} lang={lang} kind="directions" className="iv-vt__btn" label={L.getThere} /></div>
      {photo && (
        <div className="iv-vt__photo" data-reveal>
          {typeof photo.src === "string"
            ? <span className="iv-gal__fill"><Image src={photo.src} alt={t(lang, photo.alt)} sizes="(max-width: 700px) 90vw, 420px" fill style={{ objectFit: "cover" }} /></span>
            : <Image src={photo.src} alt={t(lang, photo.alt)} sizes="(max-width: 700px) 90vw, 420px" placeholder="blur" />}
        </div>
      )}
      <span className="iv-vt__stamp" aria-hidden="true" data-stamp><Plane size={14} /><em>{t(lang, data.identity.city)}</em></span>
    </section>
  );
}
/** «We are waiting for you» + calendar card + «Save the date dd.mm.yyyy» ♥ */
export function SaveTheDateCard({ ctx, children }: { ctx: RenderCtx; children?: React.ReactNode }) {
  const { lang, data } = ctx;
  return (
    <section className="iv-std" aria-label={t(lang, L.waiting)}>
      <h2 className="iv-std__h" data-rise>{t(lang, L.waiting)}</h2>
      {data.features.details?.[0] && <p className="iv-std__p" data-rise>{t(lang, data.features.details[0])}</p>}
      <div className="iv-std__card" data-rise>
        {children}
        <p className="iv-std__save"><small>{t(lang, L.saveDate)}</small><b>{dotted(data.identity.date)}</b><span data-float="4"><Heart size={14} className="iv-std__heart" /></span></p>
      </div>
    </section>
  );
}

/** the pearls hero: names stacked huge in the sans, the script kicker, a B&W photo */
export function StackedHero({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const H = ctx.compact || ctx.embed ? ("div" as const) : ("h1" as const);

  const [a, b] = data.identity.hosts;
  const first = data.assets.hero[0];
  return (
    <header className="iv-hero iv-hero--stacked">
      <TopBar ctx={ctx} />
      <div className="iv-hero__in">
        <H className="iv-hero__names iv-hero__names--stacked" data-rise><span data-letters>{t(lang, a)}</span>{b && <span data-letters>{t(lang, b)}</span>}</H>
        <p className="iv-hero__kick iv-script" data-rise data-words>{t(lang, data.identity.kicker)}</p>
      </div>
      {first && first.kind === "image" && (
        <div className="iv-hero__photo" data-reveal>
          {typeof first.src === "string"
            ? <span className="iv-gal__fill"><Image src={first.src} alt={t(lang, first.alt)} sizes="(max-width: 700px) 92vw, 420px" fill style={{ objectFit: "cover" }} priority={!ctx.compact} data-kenburns /></span>
            : <Image src={first.src} alt={t(lang, first.alt)} sizes="(max-width: 700px) 92vw, 420px" placeholder="blur" priority={!ctx.compact} data-kenburns />}
        </div>
      )}
    </header>
  );
}
/** the dusty-blue card 1: butterfly, «WE'RE GETTING MARRIED», script names */
export function ButterflyHero({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const H = ctx.compact || ctx.embed ? ("div" as const) : ("h1" as const);

  const [a, b] = data.identity.hosts;
  return (
    <header className="iv-hero iv-hero--butterfly">
      <div className="iv-hero__in">
        <span className="iv-hero__bflyWrap" data-float="5"><Butterfly size={ctx.compact ? 84 : 124} className="iv-hero__bfly" /></span>
        <p className="iv-hero__kick" data-rise data-track>{t(lang, data.identity.kicker)}</p>
        <H className="iv-hero__names iv-hero__names--script iv-script" data-rise><span data-letters>{t(lang, a)}</span>{b && <><i className="iv-hero__amp">&amp;</i><span data-letters>{t(lang, b)}</span></>}</H>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------- PEARLS (style D)
export function TopBar({ ctx }: { ctx: RenderCtx }) {
  const { data } = ctx;
  const x = inYerevan(data.identity.date);
  return (
    <div className="iv-top" aria-hidden="true">
      <span className="iv-top__logo">ԿՆԻՔ</span>
      <span className="iv-top__date">{pad2(x.d)} {pad2(x.m + 1)} {String(x.y).slice(2)}</span>
      <span className="iv-top__menu"><i /><i /><i /></span>
    </div>
  );
}
/** «Dear friends! — You're invited» as a note card clipped onto an envelope */
export function NoteOnEnvelope({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  if (!data.identity.blurb) return null;
  const m = data.identity.monogram;
  return (
    <section className="iv-note" aria-label={t(lang, data.identity.subtitle ?? { hy: "Հրավեր", en: "Invitation" })}>
      {data.identity.subtitle && (
        <p className="iv-note__h" data-rise>
          <b>{t(lang, data.identity.subtitle).split(/[!,]/)[0]}!</b>
          <i className="iv-script">{t(lang, data.identity.subtitle).split(/[!,]/).slice(1).join(" ").trim() || (lang === "hy" ? "Դուք հրավիրված եք" : "You're invited")}</i>
        </p>
      )}
      <div className="iv-note__stage" data-rise>
        <div className="iv-note__env" aria-hidden="true">{m && <span className="iv-note__mono iv-script">{m.a}{m.b}</span>}</div>
        <div className="iv-note__card" data-stamp>
          <span className="iv-note__clip" aria-hidden="true" />
          <p>{t(lang, data.identity.blurb)}</p>
          <i className="iv-note__sig iv-script" aria-hidden="true">~</i>
        </div>
      </div>
    </section>
  );
}
/** the three-day strip: the day before · THE day · the day after, a pearl pendant under it */
export function DayStrip({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const x = inYerevan(data.identity.date);
  const day = (off: number) => { const d = new Date(Date.UTC(x.y, x.m, x.d + off)); return { dow: L.weekday[lang][d.getUTCDay()], n: d.getUTCDate() }; };
  const days = [day(-1), day(0), day(1)];
  return (
    <section className="iv-strip3" aria-label={`${L.months[lang][x.m]} ${x.d}`}>
      <p className="iv-strip3__month" data-rise>{L.months[lang][x.m]}</p>
      <div className="iv-strip3__row" data-rise>
        {days.map((d, i) => (
          <div key={i} className={`iv-strip3__d${i === 1 ? " iv-strip3__d--the" : ""}`} aria-current={i === 1 ? "date" : undefined}>
            <small>{d.dow}</small>
            <b>{d.n}</b>
          </div>
        ))}
      </div>
      <span className="iv-strip3__pendant" aria-hidden="true" data-float="4"><i /><b /></span>
    </section>
  );
}
/** VENUE on a tray: every block that carries a venue, «View on map» */
export function TrayVenues({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const seen = new Set<string>();
  const list = data.schedule.blocks.filter((b) => { const k = t("en", b.venue); if (seen.has(k) || !b.mapUrl) return false; seen.add(k); return true; }).slice(0, 2);
  if (!list.length) return null;
  return (
    <section className="iv-tray" aria-label={t(lang, L.venue)}>
      <p className="iv-tray__h" data-rise><b>{t(lang, L.venue)}</b><i className="iv-script">{t(lang, L.savePlace)}</i></p>
      <div className="iv-tray__stage" data-rise>
        <div className="iv-tray__plate" aria-hidden="true" />
        <div className="iv-tray__card" data-stamp>
          {list.map((b, i) => (
            <div key={b.id} className="iv-tray__it">
              <small>{i === 0 ? t(lang, L.ceremony) : t(lang, L.banquet)}</small>
              <b>{t(lang, b.venue)}</b>
              {b.address && <span>{t(lang, b.address)}</span>}
              <VenueMapButton block={b} lang={lang} kind="map" className="iv-tray__link" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ChannelCard({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const c = data.extras?.channel;
  if (!c) return null;
  return (
    <section className="iv-chan" aria-label={t(lang, c.label)}>
      <p className="iv-chan__h" data-rise><b>{t(lang, c.label)}</b><i className="iv-script">Telegram</i></p>
      <div className="iv-chan__stage" data-rise>
        <span className="iv-chan__bow" aria-hidden="true" data-float="5"><i /><i /></span>
        <div className="iv-chan__card">
          <p>{t(lang, c.note)}</p>
          {c.url ? <a className="iv-chan__join" href={c.url} target="_blank" rel="noopener noreferrer">{t(lang, L.join)}</a> : <span className="iv-chan__join iv-chan__join--off" title={t(lang, L.joinSoon)}>{t(lang, L.join)}</span>}
        </div>
      </div>
    </section>
  );
}
export function WishesNote({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const w = data.extras?.wishes;
  if (!w) return null;
  return (
    <section className="iv-wish" aria-label={t(lang, w.title ?? { hy: "Ցանկություններ", en: "Wishes" })} data-rise>
      <p className="iv-wish__h">{t(lang, w.title ?? { hy: "Ցանկություններ", en: "Wishes" })}</p>
      <span className="iv-wish__hearts" aria-hidden="true" data-float="4"><Heart size={26} /><Heart size={26} /></span>
      <p className="iv-wish__p">{t(lang, w.text)}</p>
    </section>
  );
}

// ---------------------------------------------------------------- DUSTY BLUE (style E)
/** card 2: the arched photo, then «AUGUST / SATURDAY 24 AT 2:00 PM / 20XX» */
export function DateBlock({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const x = inYerevan(data.identity.date);
  return (
    <section className="iv-db" aria-label={longDate(lang, data.identity.date)}>
      {data.identity.families && <p className="iv-db__kick" data-rise>{t(lang, data.identity.families)}</p>}
      <p className="iv-db__month" data-rise>{L.months[lang][x.m]}</p>
      <p className="iv-db__row" data-rise><span>{L.weekday[lang][x.dow]}</span><b>{x.d}</b><span>{t(lang, L.at)} {x.hh}:{x.mm}</span></p>
      <p className="iv-db__year" data-rise>{x.y}</p>
      {data.identity.subtitle && <p className="iv-db__sub" data-rise>{t(lang, data.identity.subtitle)}</p>}
    </section>
  );
}
export function ArchPhoto({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const first = data.assets.hero[0];
  if (!first || first.kind !== "image" || typeof first.src === "string") return null;
  return (
    <div className="iv-arch" data-rise>
      <span className="iv-arch__dia iv-arch__dia--l" aria-hidden="true">◆</span>
      <div className="iv-arch__frame" data-reveal><Image src={first.src} alt={t(lang, first.alt)} sizes="(max-width: 700px) 60vw, 260px" placeholder="blur" data-kenburns /></div>
      <span className="iv-arch__dia iv-arch__dia--r" aria-hidden="true">◆</span>
    </div>
  );
}
/** «THE details» — the QR of this page, the dress-code hearts, the hotel */
export function DetailsCard({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const [href, setHref] = useState("");
  useEffect(() => { setHref(window.location.href.split("#")[0]); }, []);
  const dc = data.features.dressCode;
  const h = data.extras?.hotel;
  if (!data.features.qr && !dc && !h) return null;
  return (
    <section className="iv-det" aria-label={t(lang, L.details)}>
      <p className="iv-det__h" data-rise>{lang === "en" && <b>{t(lang, L.the)}</b>}<i className="iv-script">{t(lang, L.details)}</i></p>
      {data.features.qr && !ctx.compact && !ctx.embed && (
        <div className="iv-det__block" data-rise>
          <small>{t(lang, L.qr)}</small>
          <div className="iv-det__qr">{href ? <QrSvg text={href} className="iv-det__qrSvg" /> : <span className="iv-det__qrSvg" />}</div>
          <span className="iv-det__hint">{t(lang, L.qrHint)}</span>
        </div>
      )}
      {dc && dc.swatches.length > 0 && (
        <div className="iv-det__block" data-rise>
          <small>{t(lang, dc.label ?? { hy: "Հագուստի կոդ", en: "Dress code" })}</small>
          <span className="iv-det__hearts" data-pop>{dc.swatches.map((c) => <span key={c} style={{ color: c }}><Heart size={26} className="iv-det__heart" /></span>)}</span>
          {dc.note && <span className="iv-det__hint">{t(lang, dc.note)}</span>}
        </div>
      )}
      {h && (
        <div className="iv-det__block" data-rise>
          <small>{t(lang, L.hotel)}</small>
          <b>{t(lang, h.name)}</b>
          <span className="iv-det__hint">{t(lang, h.address)}</span>
          {h.mapUrl && <a className="iv-det__map" href={h.mapUrl} target="_blank" rel="noopener noreferrer"><Icon name="map" size={12} /> {t(lang, L.viewMap)}</a>}
        </div>
      )}
    </section>
  );
}
/** «please RSVP — By <date>» head over the form; the deadline from the RSVP config */
export function RsvpHead({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const dl = data.features.rsvp.deadline;
  return (
    <div className="iv-rsvphead" data-rise>
      <i className="iv-script">{t(lang, L.please)}</i>
      <b data-letters>{t(lang, L.rsvp)}</b>
      {dl && <span>{t(lang, L.by)} {longDate(lang, dl)}</span>}
    </div>
  );
}
/** the end card: navy, the ornate oval frame (sprite symbol), the names in script */
export function EndCard({ ctx }: { ctx: RenderCtx }) {
  const { data } = ctx;
  return (
    <section className="iv-end" aria-hidden="true">
      <svg viewBox="0 0 120 100" className="iv-end__frame" fill="none" stroke="currentColor" data-stamp>
        <ellipse cx="60" cy="50" rx="54" ry="40" strokeWidth="0.9" />
        <ellipse cx="60" cy="50" rx="49" ry="35.5" strokeWidth="0.5" />
        <g strokeWidth="0.8" strokeLinecap="round">
          <path d="M60 10c-4-4-10-5-13 0 3 3 8 2 13 0zm0 0c4-4 10-5 13 0-3 3-8 2-13 0z" />
          <path d="M60 90c-4 4-10 5-13 0 3-3 8-2 13 0zm0 0c4 4 10 5 13 0-3-3-8-2-13 0z" />
          <path d="M6 50c-3-4-3-9 0-12 3 3 2 8 0 12zm0 0c-3 4-3 9 0 12 3-3 2-8 0-12z" />
          <path d="M114 50c3-4 3-9 0-12-3 3-2 8 0 12zm0 0c3 4 3 9 0 12-3-3-2-8 0-12z" />
          <path d="M24 22c-5-1-9 1-10 5 4 1 8-1 10-5zM96 22c5-1 9 1 10 5-4 1-8-1-10-5zM24 78c-5 1-9-1-10-5 4-1 8 1 10 5zM96 78c5 1 9-1 10-5-4-1-8 1-10 5z" />
        </g>
      </svg>
      <p className="iv-end__names iv-script" data-words>{hostsLine(ctx, " & ")}</p>
      {data.identity.monogram && <p className="iv-end__mono">{data.identity.monogram.a} · {data.identity.monogram.b}</p>}
    </section>
  );
}
