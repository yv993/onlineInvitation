"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Icon from "@/components/Icon";
import Lightbox, { useLightbox } from "@/components/ui/Lightbox";
import { t } from "@/lib/i18n";
import { monthGrid, pad2, remaining } from "@/lib/date";
import { calendar as calCopy, type Lang, type T } from "@/lib/content";
import type { InvitationData, Media, RenderCtx, ScheduleBlock } from "@/types/invitation";
import ScheduleGlyph from "./icons";

// ============================================================================
// THE SECTIONS — every block the two references have, as small components
// that read one InvitationData. Any style composes them in its own order and
// dresses them with its own tokens (the renderer writes --iv-* on the root).
// ============================================================================

const L = {
  countdownDone: { hy: "Օրը եկավ", en: "The day is here" },
  d: { hy: "օր", en: "days" }, h: { hy: "ժամ", en: "hours" }, m: { hy: "րոպե", en: "min" }, s: { hy: "վայրկյան", en: "sec" },
  left: { hy: "մնաց", en: "left" },
  turning: { hy: "Դառնում է", en: "Turning" },
  directions: { hy: "Ուղղություն", en: "Directions" },
  viewMap: { hy: "Բացել քարտեզում", en: "View map" },
  months: { hy: ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"], en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"] },
  monthsGen: { hy: ["հունվարի", "փետրվարի", "մարտի", "ապրիլի", "մայիսի", "հունիսի", "հուլիսի", "օգոստոսի", "սեպտեմբերի", "հոկտեմբերի", "նոյեմբերի", "դեկտեմբերի"], en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"] },
  days: { hy: ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"] },
  gallery: { hy: "Նկարներ", en: "Photos" },
  close: { hy: "Փակել", en: "Close" },
  ics: { hy: "Ավելացնել օրացույցում", en: "Add to calendar" },
  mute: { hy: "Անձայն", en: "Mute" }, unmute: { hy: "Ձայնով", en: "Unmute" },
  play: { hy: "Երաժշտություն", en: "Music" },
};

// ---------------------------------------------------------------- helpers
export function inYerevan(iso: string) {
  const d = new Date(new Date(iso).getTime() + 4 * 3600_000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), dow: d.getUTCDay(), hh: pad2(d.getUTCHours()), mm: pad2(d.getUTCMinutes()) };
}
export function longDate(lang: Lang, iso: string) {
  const x = inYerevan(iso);
  // hy and ru speak the date with a genitive month after the day; en leads
  // with the month
  if (lang === "en") return `${L.days.en[x.dow]}, ${L.months.en[x.m]} ${x.d}, ${x.y}`;
  return `${L.days[lang][x.dow]}, ${x.d} ${L.monthsGen[lang][x.m]}, ${x.y}`;
}
export function hostsLine(ctx: RenderCtx, sep?: string) {
  const { lang, data } = ctx;
  const [a, b] = data.identity.hosts;
  const amp = sep ?? (data.type === "birthday" || data.type === "gala" ? " · " : lang === "hy" ? " և " : " & ");
  return b ? `${t(lang, a)}${amp}${t(lang, b)}` : t(lang, a);
}
const dirUrl = (b: ScheduleBlock, lang: Lang) => b.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${t(lang, b.venue)}${b.address ? ", " + t(lang, b.address) : ""}`)}`;

// ---------------------------------------------------------------- <HeroHeader />
export function HeroHeader({ ctx, variant = "centered", showDayNumeral = false, children }: { ctx: RenderCtx; variant?: "centered" | "cinematic" | "strip" | "neon" | "clouds"; showDayNumeral?: boolean; children?: React.ReactNode }) {
  const { lang, data } = ctx;
  // a compact/embedded render must not plant an <h1> in the host document
  const H = ctx.compact || ctx.embed ? ("div" as const) : ("h1" as const);
  const x = inYerevan(data.identity.date);
  const first = data.assets.hero[0];
  const isVideo = first.kind === "video";
  const still = first.kind === "image" ? first.src : first.poster;
  const [muted, setMuted] = useState(true);
  const vid = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    v.play().catch(() => {});
  }, []);
  const [a, b] = data.identity.hosts;
  // the compact render (wizard previews, ~360px) must not request full-viewport sources
  const sz = ctx.compact ? "380px" : ctx.embed ? "460px" : "100vw";
  const szStrip = ctx.compact ? "130px" : ctx.embed ? "160px" : "34vw";
  return (
    <header className={`iv-hero iv-hero--${variant}`}>
      <div className="iv-hero__bg" aria-hidden="true">
        {isVideo ? (
          <>
            <Image src={still} alt="" fill sizes={sz} priority={!ctx.compact} className="iv-hero__poster" data-kenburns />
            <video ref={vid} className="iv-hero__video" src={first.src} muted={muted} loop playsInline preload="metadata" />
          </>
        ) : variant === "strip" ? (
          <div className="iv-hero__strip">
            {data.assets.hero.slice(0, 3).map((m, i) => m.kind === "image" ? <Image key={i} src={m.src} alt={t(lang, m.alt)} fill sizes={szStrip} className="iv-hero__stripImg" style={{ left: `${i * 33.4}%` }} priority={i === 0 && !ctx.compact} /> : null)}
          </div>
        ) : (
          <Image src={still} alt="" fill sizes={sz} priority={!ctx.compact} className="iv-hero__img" data-kenburns />
        )}
        <div className="iv-hero__scrim" />
      </div>
      {isVideo && (
        <button type="button" className="iv-hero__mute" onClick={() => setMuted((m) => !m)} aria-pressed={!muted} aria-label={muted ? t(lang, L.unmute) : t(lang, L.mute)}>
          <Icon name={muted ? "music" : "x"} size={16} /> <span>{muted ? t(lang, L.unmute) : t(lang, L.mute)}</span>
        </button>
      )}
      <div className="iv-hero__in">
        {data.identity.monogram && (data.identity.monogram.a || data.identity.monogram.b) && (
          <p className="iv-hero__mono" aria-hidden="true"><span>{data.identity.monogram.a}</span>{data.identity.monogram.b && <><i>&amp;</i><span>{data.identity.monogram.b}</span></>}</p>
        )}
        <p className="iv-hero__kick" data-rise data-track>{t(lang, data.identity.kicker)}</p>
        <H className="iv-hero__names" data-rise>
          <span data-letters>{t(lang, a)}</span>
          {b && <><i className="iv-hero__amp">{data.type === "birthday" || data.type === "gala" ? "·" : lang === "hy" ? "և" : "&"}</i><span data-letters>{t(lang, b)}</span></>}
        </H>
        {showDayNumeral ? (
          <p className="iv-hero__day" data-rise><b>{x.d}</b><small>{L.months[lang][x.m]} {x.y}</small></p>
        ) : (
          <p className="iv-hero__date" data-rise>{longDate(lang, data.identity.date)}</p>
        )}
        {data.identity.subtitle && <p className="iv-hero__sub" data-rise>{t(lang, data.identity.subtitle)}</p>}
        {children}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------- <CountdownTimer />
export function CountdownTimer({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const cfg = data.features.countdown;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let id: number;
    const tick = () => { setNow(Date.now()); id = window.setTimeout(tick, 1000 - (Date.now() % 1000)); };
    id = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => window.clearTimeout(id);
  }, []);
  if (!cfg?.enabled) return null;
  const r = remaining(data.identity.date, now);
  const born = data.extras?.born;
  const age = born ? inYerevan(data.identity.date).y - Number(born.slice(0, 4)) : null;
  if (r.done) return <section className="iv-count iv-count--done" data-rise><p>{t(lang, L.countdownDone)}</p></section>;
  if (cfg.style === "days") {
    return (
      <section className="iv-count iv-count--days" aria-label={t(lang, cfg.label ?? L.left)}>
        <p className="iv-count__big" data-rise><b key={r.d} suppressHydrationWarning>{r.d}</b><span>{lang === "hy" ? "օր" : r.d === 1 ? "day" : "days"}</span></p>
        <p className="iv-count__label" data-rise>{t(lang, cfg.label ?? L.left)}</p>
      </section>
    );
  }
  return (
    <section className="iv-count iv-count--dhms" aria-label={t(lang, cfg.label ?? L.left)}>
      <p className="iv-count__label" data-rise>{cfg.style === "age" && age !== null ? `${t(lang, L.turning)} ${age}` : t(lang, cfg.label ?? L.left)}</p>
      <div className="iv-count__cells" data-rise>
        {([[r.d, "d"], [r.h, "h"], [r.m, "m"], [r.s, "s"]] as const).map(([n, k], i) => (
          <div className="iv-count__cell" key={k}>
            <b key={i === 0 ? n : pad2(n)} suppressHydrationWarning>{i === 0 ? n : pad2(n)}</b>
            <span>{t(lang, L[k])}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- <MonthCalendar />
export function MonthCalendar({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  if (!data.features.calendar?.enabled) return null;
  const rows = monthGrid(data.identity.date);
  const x = inYerevan(data.identity.date);
  return (
    <section className="iv-cal" aria-label={`${L.months[lang][x.m]} ${x.y}`}>
      <p className="iv-cal__title" data-rise>{L.months[lang][x.m]} <span>{x.y}</span></p>
      <div className="iv-cal__grid" role="grid" data-rise data-pop>
        {calCopy.weekdays[lang].map((w) => <span key={w} className="iv-cal__wd" role="columnheader">{w}</span>)}
        {rows.flat().map((c, i) => (
          <span key={i} role="gridcell" className={`iv-cal__d${c.isWedding ? " iv-cal__d--the" : ""}${c.day === null ? " iv-cal__d--empty" : ""}`} aria-current={c.isWedding ? "date" : undefined}>{c.day ?? ""}</span>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- <VenueMapButton />
export function VenueMapButton({ block, lang, kind = "directions", className = "", label }: { block: ScheduleBlock; lang: Lang; kind?: "directions" | "map"; className?: string; label?: T }) {
  return (
    <a className={`iv-map${className ? ` ${className}` : ""}`} href={dirUrl(block, lang)} target="_blank" rel="noopener noreferrer">
      <Icon name="map" size={16} /> {t(lang, label ?? (kind === "directions" ? L.directions : L.viewMap))}
    </a>
  );
}

// ---------------------------------------------------------------- <ProgramTimeline />
export function ProgramTimeline({ ctx, layout = "cards", ornament }: { ctx: RenderCtx; layout?: "cards" | "glass" | "tabs" | "compact" | "dots" | "pearls" | "centered"; ornament?: React.ReactNode }) {
  const { lang, data } = ctx;
  const blocks = ctx.compact ? data.schedule.blocks.slice(0, 1) : data.schedule.blocks;
  const [tab, setTab] = useState(0);
  const root = useRef<HTMLDivElement | null>(null);
  // the reference draws a path between the stops as you scroll; here the
  // dashed connector fills with scroll (an IntersectionObserver per stop)
  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const items = [...el.querySelectorAll<HTMLElement>(".iv-tl__it")];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-in"); }), { threshold: 0.35 });
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);
  if (!blocks.length) return null;
  const title = t(lang, data.schedule.title ?? { hy: "Ժամանակացույց", en: "The day" });
  // the ticket's dotted list — dot · label · time on the right, a dashed rail
  if (layout === "dots") {
    return (
      <section className="iv-tl iv-tl--dots" ref={root} aria-label={title}>
        <p className="iv-tl__h" data-rise>{title}</p>
        <ol className="iv-tl__list">
          {blocks.map((b, i) => (
            <li key={b.id} className="iv-tl__it" style={{ "--i": i } as React.CSSProperties}>
              <span className="iv-tl__dot" aria-hidden="true" />
              <span className="iv-tl__lbl">{t(lang, b.title)}</span>
              <span className="iv-tl__time">{b.time}</span>
            </li>
          ))}
        </ol>
        {ornament}
      </section>
    );
  }
  // the pearls' programme — hours large, alternating sides of the string
  if (layout === "pearls") {
    return (
      <section className="iv-tl iv-tl--pearls" ref={root} aria-label={title}>
        <p className="iv-tl__ph" data-rise><b>{title}</b>{data.schedule.subtitle && <i className="iv-script">{t(lang, data.schedule.subtitle)}</i>}</p>
        <div className="iv-tl__pearlWrap">
          {ornament}
          <ol className="iv-tl__list">
            {blocks.map((b, i) => (
              <li key={b.id} className="iv-tl__it" style={{ "--i": i } as React.CSSProperties} data-side={i % 2 ? "l" : "r"}>
                <b className="iv-tl__time">{b.time}</b>
                <span className="iv-tl__lbl">{t(lang, b.title)}</span>
              </li>
            ))}
          </ol>
        </div>
        <span className="iv-tl__brooch" aria-hidden="true"><i /></span>
      </section>
    );
  }
  // the dusty card — script title, centred label + time, thin rules between
  if (layout === "centered") {
    return (
      <section className="iv-tl iv-tl--centered" ref={root} aria-label={title}>
        {ornament}
        <p className="iv-tl__ph" data-rise><i className="iv-script">{title}</i></p>
        <ol className="iv-tl__list">
          {blocks.map((b, i) => (
            <li key={b.id} className="iv-tl__it" style={{ "--i": i } as React.CSSProperties}>
              <span className="iv-tl__lbl">{t(lang, b.title)}</span>
              <span className="iv-tl__time">{b.time}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }
  if (layout === "tabs") {
    const b = blocks[tab] ?? blocks[0];
    return (
      <section className="iv-tl iv-tl--tabs" aria-label={t(lang, data.schedule.title ?? { hy: "Օրակարգ", en: "Agenda" })}>
        <p className="iv-sec__label" data-rise>{t(lang, data.schedule.title ?? { hy: "Օրակարգ", en: "Agenda" })}</p>
        <div className="iv-tabs" role="tablist">{blocks.map((x, i) => <button key={x.id} role="tab" type="button" aria-selected={tab === i} className="iv-tabs__b" onClick={() => setTab(i)}>{x.time}</button>)}</div>
        <div className="iv-tabs__panel" role="tabpanel">
          <ScheduleGlyph icon={b.icon} size={40} className="iv-tl__glyph" />
          <h3>{t(lang, b.title)}</h3>
          <p className="iv-tl__venue">{t(lang, b.venue)}{b.address ? ` · ${t(lang, b.address)}` : ""}</p>
          {data.features.maps?.directions && <VenueMapButton block={b} lang={lang} />}
        </div>
      </section>
    );
  }
  return (
    <section className={`iv-tl iv-tl--${layout} iv-tl--conn-${data.schedule.connector ?? "line"}`} ref={root} aria-label={t(lang, data.schedule.title ?? { hy: "Ժամանակացույց", en: "The day" })}>
      <p className="iv-sec__label" data-rise>{t(lang, data.schedule.title ?? { hy: "Ժամանակացույց", en: "The day" })}</p>
      <ol className="iv-tl__list">
        {blocks.map((b, i) => (
          <li key={b.id} className="iv-tl__it" style={{ "--i": i } as React.CSSProperties}>
            <span className="iv-tl__dot" aria-hidden="true" />
            <div className="iv-tl__card">
              <ScheduleGlyph icon={b.icon} size={44} className="iv-tl__glyph" />
              <span className="iv-tl__time">{b.time}</span>
              <h3 className="iv-tl__title">{t(lang, b.title)}</h3>
              <p className="iv-tl__venue">{t(lang, b.venue)}</p>
              {b.address && <p className="iv-tl__addr">{t(lang, b.address)}</p>}
              {b.note && <p className="iv-tl__note">{t(lang, b.note)}</p>}
              {data.features.maps?.directions && !ctx.compact && <VenueMapButton block={b} lang={lang} kind={layout === "glass" ? "map" : "directions"} />}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------- <DressCodeSwatches />
export function DressCodeSwatches({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const dc = data.features.dressCode;
  if (!dc || !dc.swatches.length) return null;
  const shape = dc.shape ?? "circle";
  const noteFirst = Boolean(dc.labels || dc.shape); // the AreOne register: paragraph, then the palette
  return (
    <section className={`iv-dress iv-dress--${shape}${dc.labels ? " iv-dress--labelled" : ""}`} aria-label={t(lang, dc.label ?? { hy: "Հագուստի գույներ", en: "Dress code" })}>
      <p className="iv-sec__label" data-rise>{t(lang, dc.label ?? { hy: "Հագուստի գույներ", en: "Dress code" })}</p>
      {noteFirst && dc.note && <p className="iv-dress__note" data-rise>{t(lang, dc.note)}</p>}
      <div className="iv-dress__sw" data-rise data-pop>
        {dc.swatches.map((c, i) => (
          <span key={c + i} className="iv-dress__one" title={c}>
            <i style={{ background: c }} />
            {dc.labels?.[i] && <small>{t(lang, dc.labels[i])}</small>}
          </span>
        ))}
      </div>
      {!noteFirst && dc.note && <p className="iv-dress__note" data-rise>{t(lang, dc.note)}</p>}
      {dc.link && <a className="iv-dress__link" href="#gallery">{t(lang, dc.link)}</a>}
    </section>
  );
}

// ---------------------------------------------------------------- <PhotoGallery />
export function PhotoGallery({ ctx, items, layout, showLabel = true }: { ctx: RenderCtx; items?: Media[]; layout?: "grid" | "masonry" | "strip" | "pair"; showLabel?: boolean }) {
  const { lang, data } = ctx;
  const g = data.features.gallery;
  // a build-time import OR the couple's own upload as a same-origin path —
  // the string case used to be filtered out here, which silently dropped every
  // photograph they added
  const list = (items ?? data.assets.gallery).filter((m): m is Extract<Media, { kind: "image" }> => m.kind === "image");
  const lb = useLightbox();
  const lbItems = useMemo(() => list.map((m) => ({ img: m.src, alt: t(lang, m.alt) })), [list, lang]);
  if (!g || !list.length) return null;
  const lay = layout ?? g.layout;
  return (
    <section className={`iv-gal iv-gal--${lay}`} id="gallery" aria-label={t(lang, g.label ?? L.gallery)}>
      {g.label && showLabel && <p className="iv-sec__label" data-rise>{t(lang, g.label)}</p>}
      <div className="iv-gal__grid" data-rise>
        {list.map((m, i) => (
          <button key={i} type="button" className="iv-gal__it" onClick={() => g.lightbox && lb.open(i)} aria-label={t(lang, m.alt)} disabled={!g.lightbox} data-reveal>
            {typeof m.src === "string" ? (
              <span className="iv-gal__fill"><Image src={m.src} alt={t(lang, m.alt)} sizes="(max-width: 700px) 50vw, 33vw" fill style={{ objectFit: "cover" }} /></span>
            ) : (
              <Image src={m.src} alt={t(lang, m.alt)} sizes="(max-width: 700px) 50vw, 33vw" placeholder="blur" />
            )}
          </button>
        ))}
      </div>
      {g.lightbox && <Lightbox items={lbItems} index={lb.i} onClose={lb.close} onIndex={lb.setI} closeLabel={t(lang, L.close)} />}
    </section>
  );
}

// ---------------------------------------------------------------- text sections
export function IntroBlurb({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  if (!data.identity.families && !data.identity.blurb) return null;
  return (
    <section className="iv-intro">
      {data.identity.families && <p className="iv-intro__fam" data-rise>{t(lang, data.identity.families)}</p>}
      {data.identity.blurb && <p className="iv-intro__blurb" data-rise data-words>{t(lang, data.identity.blurb)}</p>}
    </section>
  );
}
export function Epigraph({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const e = data.features.epigraph;
  if (!e) return null;
  return (
    <section className="iv-epi" data-rise>
      <blockquote><p data-words>{t(lang, e.text)}</p><cite>{t(lang, e.from)}</cite></blockquote>
    </section>
  );
}
export function DetailsNote({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const d = data.features.details;
  if (!d?.length) return null;
  return (
    <section className="iv-details" aria-label={lang === "hy" ? "Մանրամասներ" : "Details"}>
      <p className="iv-sec__label" data-rise>{lang === "hy" ? "Մանրամասներ" : "Details"}</p>
      {d.map((x, i) => <p key={i} className="iv-details__p" data-rise>{t(lang, x)}</p>)}
      <p className="iv-details__heart" aria-hidden="true">♡</p>
    </section>
  );
}
export function IcsLink({ ctx }: { ctx: RenderCtx }) {
  const { lang, data, blob } = ctx;
  if (!data.features.ics) return null;
  const href = blob ? `/api/ics?p=${blob}` : `/api/ics?t=${data.type === "wedding" ? "wedding-1" : data.type === "engagement" ? "engagement-1" : data.type === "baptism" ? "christening-1" : data.type === "birthday" ? "birthday-1" : "corporate-1"}`;
  return <a className="iv-btn iv-btn--ghost" href={href} download={`${data.id}.ics`}><Icon name="calendar" size={16} /> {t(lang, L.ics)}</a>;
}
export function GodparentsCard({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const g = data.extras?.godparents;
  if (!g) return null;
  return (
    <section className="iv-god" data-rise>
      <p className="iv-sec__label">{lang === "hy" ? "Կնքահայր և կնքամայր" : "Godparents"}</p>
      <div className="iv-god__row">
        <div><small>{lang === "hy" ? "Կնքահայր" : "Godfather"}</small><b>{g.a}</b></div>
        <span className="iv-god__cross" aria-hidden="true">✝</span>
        <div><small>{lang === "hy" ? "Կնքամայր" : "Godmother"}</small><b>{g.b}</b></div>
      </div>
      {g.dedication && <p className="iv-god__ded">{t(lang, g.dedication)}</p>}
      {data.extras?.parents && <p className="iv-god__parents">{t(lang, data.extras.parents)}</p>}
    </section>
  );
}
export function SpeakersRow({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const s = data.extras?.speakers;
  if (!s?.length) return null;
  return (
    <section className="iv-speakers" data-rise>
      <p className="iv-sec__label">{lang === "hy" ? "Բանախոսներ" : "Speakers"}</p>
      <ul>{s.map((x, i) => <li key={i}><b>{x.name}</b><small>{t(lang, x.role)}</small></li>)}</ul>
    </section>
  );
}
