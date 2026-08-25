"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import Motion from "@/components/Motion";
import Share from "@/components/Share";
import Particles from "@/components/ui/3d/Particles";
import { ToastBoard } from "@/components/templates/blocks/Blocks";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/content";
import type { InvitationData, RenderCtx, TemplateStyle } from "@/types/invitation";
import { CountdownTimer, DetailsNote, DressCodeSwatches, Epigraph, GodparentsCard, HeroHeader, IcsLink, IntroBlurb, MonthCalendar, PhotoGallery, ProgramTimeline, SpeakersRow, hostsLine, longDate } from "./sections";
import { ArchPhoto, BoardingPass, ButterflyHero, ChannelCard, DateBlock, DayStrip, DetailsCard, EndCard, FlightPath, LuggageTag, NoteOnEnvelope, RsvpHead, SaveTheDateCard, StackedHero, TrayVenues, VenueTicket, WishesNote } from "./sections2";
import WMotifSprite from "@/components/wcards/WMotifs";
import RsvpModal from "./RsvpModal";
import DayRoute, { type RouteVariant } from "./DayRoute";

// ============================================================================
// <TemplateRenderer /> — one InvitationData in, one live invitation out, in
// the style the object names. Six compositions of the same sections:
//
//   classic-floral   — Invito W121's order: gate → hero → greeting → countdown
//                      d:h:m:s → calendar → photos → timeline (icons, badges,
//                      directions) → photos → dress code → details → RSVP inline
//   modern-cinematic — iStudio 1046's order: gate → video hero (mute) → families
//                      → «Moment» → calendar → glass reception card («View
//                      map») → dress code → RSVP modal → «N days left» →
//                      scripture → footer
//   engagement-save-the-date · baptism-kunk · birthday-anniversary ·
//   gala-corporate — the same schema, generated: photo-strip hero + .ics; cloud
//                      particles + godparents; neon canvas + age counter +
//                      message board; video hero + agenda tabs + speakers.
//
// Motion is the site's own (data-rise section entries via Motion.tsx, GSAP);
// glass is CSS backdrop-filter; nothing here needs a library the project
// doesn't already carry.
// ============================================================================

const GATE = { view: { hy: "Բացել հրավերը", en: "View invitation" }, music: { hy: "Երաժշտություն", en: "Music" }, on: { hy: "Միացված", en: "On" }, off: { hy: "Անջատված", en: "Off" } };

/** the reference's gate: names · date · one button; music starts on the tap.
 *  Two more faces: the boarding pass (the ticket IS the gate — «Board now»)
 *  and the dusty-blue gatefold envelope, whose two embossed flaps swing open
 *  on the tap before the page shows. */
function Gate({ ctx, onOpen }: { ctx: RenderCtx; onOpen: () => void }) {
  const { lang, data } = ctx;
  const g = data.features.gate;
  const [opening, setOpening] = useState(false);
  const open = () => {
    if (g?.variant !== "gatefold") { onOpen(); return; }
    if (opening) return;
    setOpening(true);
    const reduce = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    window.setTimeout(onOpen, reduce ? 0 : 1150);
  };
  if (g?.variant === "ticket") {
    return (
      <div className="iv-gate iv-gate--ticket" role="dialog" aria-modal="true" aria-label={t(lang, g?.label ?? data.identity.kicker)}>
        <div className="iv-gate__in iv-gate__in--ticket">
          <BoardingPass ctx={ctx} as="gate">
            <button type="button" className="iv-btn iv-gate__btn iv-tk__btn" onClick={open} autoFocus>{t(lang, g?.button ?? GATE.view)} <Icon name="chevron" size={14} /></button>
          </BoardingPass>
        </div>
      </div>
    );
  }
  if (g?.variant === "gatefold") {
    return (
      <div className={`iv-gate iv-gate--fold${opening ? " is-opening" : ""}`} role="dialog" aria-modal="true" aria-label={t(lang, g?.label ?? data.identity.kicker)}>
        <div className="iv-fold" aria-hidden="true">
          <div className="iv-fold__back" />
          <div className="iv-fold__flap iv-fold__flap--l"><EmbossedFlorals side="l" /></div>
          <div className="iv-fold__flap iv-fold__flap--r"><EmbossedFlorals side="r" /></div>
          <div className="iv-fold__seam" />
        </div>
        <div className="iv-gate__in iv-gate__in--fold">
          <p className="iv-gate__kick">{t(lang, g?.label ?? data.identity.kicker)}</p>
          <p className="iv-gate__names iv-script">{hostsLine(ctx, " & ")}</p>
          <button type="button" className="iv-btn iv-gate__btn" onClick={open} autoFocus disabled={opening}>{t(lang, g?.button ?? GATE.view)}</button>
        </div>
      </div>
    );
  }
  return (
    <div className="iv-gate" role="dialog" aria-modal="true" aria-label={t(lang, g?.label ?? data.identity.kicker)}>
      <div className="iv-gate__in">
        <p className="iv-gate__kick">{t(lang, g?.label ?? data.identity.kicker)}</p>
        <p className="iv-gate__names">{hostsLine(ctx)}</p>
        <p className="iv-gate__date">{longDate(lang, data.identity.date)}</p>
        <button type="button" className="iv-btn iv-gate__btn" onClick={onOpen} autoFocus>{t(lang, g?.button ?? GATE.view)}</button>
      </div>
    </div>
  );
}

/** the dusty-blue envelope's relief: the wedding motif symbols drawn twice,
 *  a pale copy up-left and a shaded copy down-right — paper pressed, not
 *  printed; same trick as the card faces' letterpress filter */
function EmbossedFlorals({ side }: { side: "l" | "r" }) {
  const items: Array<{ m: string; x: number; y: number; s: number; r: number }> = side === "l"
    ? [{ m: "leafBranch", x: 10, y: 12, s: 58, r: 200 }, { m: "fern", x: 30, y: 30, s: 46, r: 20 }, { m: "peony", x: 14, y: 50, s: 30, r: 10 }, { m: "eucalyptus", x: 34, y: 68, s: 44, r: 140 }, { m: "rose", x: 16, y: 88, s: 26, r: -20 }, { m: "leafSprig", x: 40, y: 100, s: 36, r: 110 }]
    : [{ m: "olive", x: 62, y: 10, s: 52, r: 20 }, { m: "leafBranch", x: 74, y: 34, s: 50, r: 160 }, { m: "peony", x: 62, y: 54, s: 28, r: 160 }, { m: "fern", x: 76, y: 72, s: 44, r: 250 }, { m: "wildflower", x: 58, y: 90, s: 24, r: 40 }, { m: "rose", x: 78, y: 104, s: 24, r: 60 }];
  return (
    <svg viewBox="0 0 100 120" className="iv-fold__art" preserveAspectRatio="xMidYMid slice">
      {items.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s / 100})`}>
          <use href={`#w-${p.m}`} x="-50" y="-50" width="100" height="100" style={{ color: "rgba(255,255,255,0.26)", transform: "translate(-0.8px,-0.8px)" }} />
          <use href={`#w-${p.m}`} x="-50" y="-50" width="100" height="100" style={{ color: "rgba(20,30,52,0.22)", transform: "translate(0.8px,0.8px)" }} />
          <use href={`#w-${p.m}`} x="-50" y="-50" width="100" height="100" style={{ color: "var(--iv-fold, #6F7F95)" }} />
        </g>
      ))}
    </svg>
  );
}

/** the audio autoplayer — armed by the gate tap (a real user gesture), with a
 *  floating control after that; foreign tracks play plainly */
function AudioPlayer({ ctx, armed }: { ctx: RenderCtx; armed: boolean }) {
  const { lang, data } = ctx;
  const a = data.assets.audio;
  const ref = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !armed || !data.features.music?.autoplayOnGate) return;
    el.play().then(() => setOn(true), () => setOn(false));
  }, [armed, data.features.music?.autoplayOnGate]);
  if (!a || !data.features.music?.showControl) return null;
  const toggle = () => { const el = ref.current; if (!el) return; if (el.paused) el.play().then(() => setOn(true), () => setOn(false)); else { el.pause(); setOn(false); } };
  return (
    <div className="iv-audio" data-on={on ? "" : undefined}>
      <button type="button" className="iv-audio__b" onClick={toggle} aria-pressed={on} aria-label={`${t(lang, GATE.music)} — ${t(lang, on ? GATE.on : GATE.off)}`}>
        <Icon name={on ? "x" : "music"} size={16} />
      </button>
      <span className="iv-audio__pulse" aria-hidden="true">{Array.from({ length: 7 }).map((_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</span>
      <span className="iv-audio__l">{t(lang, a.label)}</span>
      <audio ref={ref} src={a.src} loop preload="none" />
    </div>
  );
}

function Ambient({ data }: { data: InvitationData }) {
  const a = data.assets.ambient;
  if (!a || a === "none") return null;
  if (a === "floral") return <div className="iv-floral" aria-hidden="true"><span className="iv-floral__tl" /><span className="iv-floral__br" /></div>;
  if (a === "planes" || a === "pearls") return null; // their ornaments live inside the bands
  if (a === "butterflies") return null; // the reference has no particles; the butterfly is in the hero
  const fx = a === "petals" ? "petals" : a === "clouds" ? "clouds" : a === "confetti" ? "confetti" : a === "neon" ? "confetti" : a === "sparkles" ? "sparkles" : a === "gold" ? "gold" : "grid";
  return <Particles fx={fx} color={data.assets.palette.accent} className="iv-fx" />;
}

function Footer({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  return (
    <footer className="iv-foot">
      {data.meta.footerLine && <p className="iv-foot__line">{t(lang, data.meta.footerLine)}</p>}
      <p className="iv-foot__names">{hostsLine(ctx)} · {longDate(lang, data.identity.date)}</p>
      {data.meta.contact && <p className="iv-foot__contact"><a href={`tel:${data.meta.contact}`}>{data.meta.contact}</a></p>}
      <small>ԿՆԻՔ — {data.meta.sample ? (lang === "hy" ? "ցուցադրական հրավեր" : "sample invitation") : lang === "hy" ? "թվային հրավեր" : "digital invitation"}</small>
    </footer>
  );
}

// ---------------------------------------------------------------- the styles
function ClassicFloral({ ctx }: { ctx: RenderCtx }) {
  const g = ctx.data.assets.gallery;
  return (
    <>
      <HeroHeader ctx={ctx} variant="centered" />
      <main className="iv-main">
        <IntroBlurb ctx={ctx} />
        <CountdownTimer ctx={ctx} />
        {!ctx.compact && <PhotoGallery ctx={ctx} items={g.slice(0, 1)} layout="strip" />}
        <MonthCalendar ctx={ctx} />
        {!ctx.compact && <PhotoGallery ctx={ctx} items={g.slice(1, 3)} layout="pair" />}
        <Route ctx={ctx} variant="classic" />
        {!ctx.compact && <PhotoGallery ctx={ctx} items={g.slice(3)} layout="pair" />}
        <DressCodeSwatches ctx={ctx} />
        <DetailsNote ctx={ctx} />
        <RsvpModal ctx={ctx} />
        <div className="iv-row"><IcsLink ctx={ctx} />{ctx.data.features.share && !ctx.compact && <Share lang={ctx.lang} />}</div>
        <Epigraph ctx={ctx} />
      </main>
    </>
  );
}
function ModernCinematic({ ctx }: { ctx: RenderCtx }) {
  const g = ctx.data.assets.gallery;
  return (
    <>
      <HeroHeader ctx={ctx} variant="cinematic" showDayNumeral />
      <main className="iv-main">
        <IntroBlurb ctx={ctx} />
        {!ctx.compact && <PhotoGallery ctx={ctx} items={g.slice(0, 1)} layout="strip" />}
        <MonthCalendar ctx={ctx} />
        <Route ctx={ctx} variant="cinematic" />
        <DressCodeSwatches ctx={ctx} />
        <RsvpModal ctx={ctx} />
        <CountdownTimer ctx={ctx} />
        <Epigraph ctx={ctx} />
        <div className="iv-row"><IcsLink ctx={ctx} />{ctx.data.features.share && !ctx.compact && <Share lang={ctx.lang} />}</div>
      </main>
    </>
  );
}
function EngagementStd({ ctx }: { ctx: RenderCtx }) {
  return (
    <>
      <HeroHeader ctx={ctx} variant="strip" />
      <main className="iv-main">
        <IntroBlurb ctx={ctx} />
        <CountdownTimer ctx={ctx} />
        <div className="iv-row iv-row--center"><IcsLink ctx={ctx} /></div>
        <ProgramTimeline ctx={ctx} layout="cards" />
        <MonthCalendar ctx={ctx} />
        <PhotoGallery ctx={ctx} layout="grid" />
        <RsvpModal ctx={ctx} />
        {ctx.data.features.share && !ctx.compact && <div className="iv-row"><Share lang={ctx.lang} /></div>}
      </main>
    </>
  );
}
function BaptismKunk({ ctx }: { ctx: RenderCtx }) {
  return (
    <>
      <HeroHeader ctx={ctx} variant="clouds" />
      <main className="iv-main">
        <IntroBlurb ctx={ctx} />
        <GodparentsCard ctx={ctx} />
        <CountdownTimer ctx={ctx} />
        <ProgramTimeline ctx={ctx} layout="cards" />
        <PhotoGallery ctx={ctx} layout="grid" />
        <RsvpModal ctx={ctx} />
        <Epigraph ctx={ctx} />
        <div className="iv-row"><IcsLink ctx={ctx} />{ctx.data.features.share && !ctx.compact && <Share lang={ctx.lang} />}</div>
      </main>
    </>
  );
}
function BirthdayAnniv({ ctx }: { ctx: RenderCtx }) {
  return (
    <>
      <HeroHeader ctx={ctx} variant="neon" />
      <main className="iv-main">
        <IntroBlurb ctx={ctx} />
        <CountdownTimer ctx={ctx} />
        <ProgramTimeline ctx={ctx} layout="glass" />
        <DressCodeSwatches ctx={ctx} />
        <PhotoGallery ctx={ctx} layout="masonry" />
        {ctx.data.extras?.messageBoard && !ctx.compact && <section className="iv-board" data-rise><ToastBoard lang={ctx.lang} /></section>}
        <RsvpModal ctx={ctx} />
        <div className="iv-row"><IcsLink ctx={ctx} />{ctx.data.features.share && !ctx.compact && <Share lang={ctx.lang} />}</div>
      </main>
    </>
  );
}
function GalaCorporate({ ctx }: { ctx: RenderCtx }) {
  return (
    <>
      <HeroHeader ctx={ctx} variant="cinematic" />
      <main className="iv-main">
        <IntroBlurb ctx={ctx} />
        <CountdownTimer ctx={ctx} />
        <ProgramTimeline ctx={ctx} layout="tabs" />
        <SpeakersRow ctx={ctx} />
        <DressCodeSwatches ctx={ctx} />
        <PhotoGallery ctx={ctx} layout="strip" />
        <RsvpModal ctx={ctx} />
        <div className="iv-row"><IcsLink ctx={ctx} />{ctx.data.features.share && !ctx.compact && <Share lang={ctx.lang} />}</div>
      </main>
    </>
  );
}

// Style C — AreOne «Wedding Ticket»: ticket → dear friends + photo + flight
// path → waiting for you + calendar + save the date → luggage tag → VENUE
// ticket → timeline (dots) → dress code (labelled) → Women · Men → RSVP
function BoardingPassStyle({ ctx }: { ctx: RenderCtx }) {
  const g = ctx.data.assets.gallery;
  return (
    <>
      <header className="iv-hero iv-hero--ticket"><BoardingPass ctx={ctx} as="hero" /></header>
      <main className="iv-main iv-main--ticket">
        <IntroBlurb ctx={ctx} />
        {!ctx.compact && <PhotoGallery ctx={ctx} items={g.slice(0, 1)} layout="strip" showLabel={false} />}
        {!ctx.compact && <FlightPath />}
        <SaveTheDateCard ctx={ctx}><MonthCalendar ctx={ctx} /><CountdownTimer ctx={ctx} /></SaveTheDateCard>
        {!ctx.compact && <LuggageTag ctx={ctx} />}
        {!ctx.compact && <VenueTicket ctx={ctx} />}
        <Route ctx={ctx} variant="ticket" />
        {!ctx.compact && <FlightPath flip />}
        <DressCodeSwatches ctx={ctx} />
        {!ctx.compact && <PhotoGallery ctx={ctx} items={g.slice(2, 4)} layout="pair" />}
        <RsvpModal ctx={ctx} />
        <div className="iv-row"><IcsLink ctx={ctx} />{ctx.data.features.share && !ctx.compact && <Share lang={ctx.lang} />}</div>
      </main>
    </>
  );
}
// Style D — AreOne «Pearls»: top bar + stacked names + photo → note on the
// envelope → three-day strip → VENUE tray → PROGRAM along the pearls (taupe
// band) → fabric dress code + examples → our channel → wishes → RSVP
function PearlEditorialStyle({ ctx }: { ctx: RenderCtx }) {
  return (
    <>
      <StackedHero ctx={ctx} />
      <main className="iv-main iv-main--pearls">
        <NoteOnEnvelope ctx={ctx} />
        {ctx.data.features.calendar?.enabled && (ctx.data.features.calendar.mode === "strip" ? <DayStrip ctx={ctx} /> : <MonthCalendar ctx={ctx} />)}
        {!ctx.compact && <TrayVenues ctx={ctx} />}
        <Route ctx={ctx} variant="pearls" />
        <DressCodeSwatches ctx={ctx} />
        {!ctx.compact && <PhotoGallery ctx={ctx} layout="pair" />}
        {!ctx.compact && <ChannelCard ctx={ctx} />}
        {!ctx.compact && <WishesNote ctx={ctx} />}
        <RsvpModal ctx={ctx} />
        <div className="iv-row"><IcsLink ctx={ctx} />{ctx.data.features.share && !ctx.compact && <Share lang={ctx.lang} />}</div>
      </main>
    </>
  );
}
// Style E — the dusty-blue reveal: (gatefold gate) → butterfly card → arched
// photo + date block → «timeline» → THE details (QR · hearts · hotel) →
// «please RSVP by» + form → end card with the ornate frame
function DustyBlueStyle({ ctx }: { ctx: RenderCtx }) {
  return (
    <>
      <ButterflyHero ctx={ctx} />
      <main className="iv-main iv-main--dusty">
        <section className="iv-card iv-card--photo">
          {!ctx.compact && <ArchPhoto ctx={ctx} />}
          <DateBlock ctx={ctx} />
        </section>
        <section className="iv-card iv-card--route">
          <svg viewBox="0 0 100 100" className="iv-sprig" aria-hidden="true"><use href="#w-wildflower" /></svg>
          <Route ctx={ctx} variant="dusty" />
        </section>
        <DetailsCard ctx={ctx} />
        <CountdownTimer ctx={ctx} />
        <section className="iv-card iv-card--rsvp">
          <RsvpHead ctx={ctx} />
          <RsvpModal ctx={ctx} />
          <DetailsNote ctx={ctx} />
        </section>
        <div className="iv-row"><IcsLink ctx={ctx} />{ctx.data.features.share && !ctx.compact && <Share lang={ctx.lang} />}</div>
        {!ctx.compact && <EndCard ctx={ctx} />}
      </main>
    </>
  );
}

/** the schedule as the scroll-drawn route: same blocks, same words, one line */
function Route({ ctx, variant }: { ctx: RenderCtx; variant: RouteVariant }) {
  const { data, lang } = ctx;
  const blocks = ctx.compact ? data.schedule.blocks.slice(0, 2) : data.schedule.blocks;
  if (!blocks.length) return null;
  return (
    <DayRoute
      lang={lang}
      variant={variant}
      compact={ctx.compact}
      directions={Boolean(data.features.maps?.directions)}
      title={data.schedule.title}
      stops={blocks.map((b) => ({ id: b.id, icon: b.icon, time: b.time, title: b.title, venue: b.venue, address: b.address, mapUrl: b.mapUrl, note: b.note }))}
    />
  );
}

const STYLES: Record<TemplateStyle, (p: { ctx: RenderCtx }) => React.JSX.Element> = {
  "classic-floral": ClassicFloral,
  "modern-cinematic": ModernCinematic,
  "boarding-pass": BoardingPassStyle,
  "pearl-editorial": PearlEditorialStyle,
  "dusty-blue": DustyBlueStyle,
  "engagement-save-the-date": EngagementStd,
  "baptism-kunk": BaptismKunk,
  "birthday-anniversary": BirthdayAnniv,
  "gala-corporate": GalaCorporate,
};

export default function TemplateRenderer({ data, lang, guest, blob, compact = false, chrome = true, embed = false }: { data: InvitationData; lang: Lang; guest?: string; blob?: string; compact?: boolean; chrome?: boolean; embed?: boolean }) {
  // embed = EVERY section, live, inside a host's own scroll frame (the wizard's
  // preview rows): no gate, no Motion (Lenis would take the host's scroll), no
  // viewport-fixed ambient, no audio dock, no chrome — the parked states are
  // pinned visible by CSS the same way the compact render's are
  const ctx: RenderCtx = { lang, data, guest, blob, compact, embed };
  const gateOn = Boolean(data.features.gate?.enabled) && !compact && !embed;
  const lite = compact || embed;
  const [opened, setOpened] = useState(!gateOn);
  const p = data.assets.palette;
  const style = { "--iv-bg": p.bg, "--iv-ink": p.ink, "--iv-soft": p.soft, "--iv-acc": p.accent, "--iv-acc-ink": p.accentInk, "--iv-panel": p.panel } as React.CSSProperties;
  const Style = STYLES[data.style] ?? ClassicFloral;
  const base = lang === "hy" ? "" : "/en";
  return (
    <div className={`iv iv--${data.style} iv--font-${data.assets.font}${p.dark ? " iv--dark" : ""}${compact ? " iv--compact" : ""}${embed ? " iv--embed" : ""}${opened ? " iv--open" : " iv--gated"}`} style={style} data-style={data.style} data-type={data.type}>
      {/* Motion mounts when the page is actually readable: after the gate for
          the gated styles, at load otherwise. Mounted behind the gate it would
          measure a 100svh clipped page and play the first screen's entries
          behind the blur — the tap would land on a page already settled. */}
      {!lite && (data.style === "dusty-blue" || data.style === "pearl-editorial" || data.style === "boarding-pass") && <WMotifSprite />}
      {!lite && opened && <Motion />}
      {/* the ambient layer is viewport-fixed (floral corners, particle canvas)
          — six compact previews would each paint it over the host page */}
      {!lite && <Ambient data={data} />}
      {chrome && !lite && (
        <div className="iv-chrome">
          <Link href={`${base}/wedding-live`} className="iv-chrome__b"><Icon name="chevron" size={16} /> ԿՆԻՔ</Link>
          <Link href={`${lang === "hy" ? "/en" : ""}/invitation/live-${data.style}${blob ? `?p=${blob}` : ""}${guest ? `${blob ? "&" : "?"}g=${encodeURIComponent(guest)}` : ""}`} className="iv-chrome__b">{lang === "hy" ? "EN" : "ՀԱՅ"}</Link>
        </div>
      )}
      {gateOn && !opened && <Gate ctx={ctx} onOpen={() => setOpened(true)} />}
      <div className="iv-page" aria-hidden={gateOn && !opened ? true : undefined}>
        {guest && !lite && <p className="iv-greet">{lang === "hy" ? `Հարգելի՛ ${guest}` : `Dear ${guest}`}</p>}
        <Style ctx={ctx} />
        {!compact && <Footer ctx={ctx} />}
      </div>
      {!lite && <AudioPlayer ctx={ctx} armed={opened && gateOn} />}
    </div>
  );
}
