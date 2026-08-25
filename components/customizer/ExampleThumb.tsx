"use client";

import { useEffect, useRef, useState } from "react";
import Plate from "@/components/Plate";
import WCardFace from "@/components/wcards/WCardFace";
import KidsTile from "@/components/kids/KidsTile";
import TemplateRenderer from "@/components/invitations/TemplateRenderer";
import { Countdown, DressCode, MapCard, Timeline } from "@/components/templates/blocks/Blocks";
import { occasions, type Lang, type T } from "@/lib/content";
import { t } from "@/lib/i18n";
import { stampFromIso, weekdayFromIso, type Draft } from "@/lib/draft";
import { findTemplate, type TemplateSpec } from "@/lib/templates";
import SealBanner from "@/components/templates/SealBanner";
import SceneHero from "@/components/templates/SceneHero";
import CastleScene from "@/components/templates/CastleScene";
import { draftToInvitation } from "@/lib/invitations/fromDraft";
import { parseLiveTpl } from "@/lib/invitations/styles";
import type { Example } from "@/lib/examples";

// ============================================================================
// THE EXAMPLE THUMBNAIL — the card shows THE INVITATION, not a stock photo:
// its first screen, rendered live at phone width (390px) and scaled to the
// card's frame. An engine style draws its compact render (hero · greeting ·
// countdown · first block); a web template draws its real hero (cover plate,
// kicker, names, date) plus its countdown; a card in an envelope draws its
// face. The wizard's typed names land in every one of them. Nothing here is
// scroll-driven — Motion skips `.kn-ex__media` on purpose — so the thumbnail
// is the finished first screen, instantly.
// ============================================================================

const same = (x: string): T => ({ hy: x, en: x });
export type Face = { a?: string; b?: string; date?: string; time?: string; venue?: string; city?: string; /** the couple's own photographs, in order — the first is the cover */ photos?: string[] };

/** renders children at a fixed phone width, scaled to the frame's width */
export function LiveThumb({ width = 390, children }: { width?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [s, setS] = useState(0.66);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => { const w = entries[0]?.contentRect.width; if (w) setS(w / width); });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref} className="kn-ex__live" aria-hidden="true">
      <div className="kn-ex__liveIn" style={{ width, transform: `scale(${s})` }}>{children}</div>
    </div>
  );
}

/** a web template's first screen — its hero, in its palette and face, then its
 *  first blocks (`blocks={false}` = the hero alone, for a card that is itself a link:
 *  the blocks carry buttons and links, which may not nest inside an <a>) */
export function TemplateHeroThumb({ tp, lang, face, blocks: withBlocks = true }: { tp: TemplateSpec; lang: Lang; face?: Face; blocks?: boolean }) {
  const th = tp.theme;
  const ev = tp.event;
  const single = tp.category === "birthday" || tp.category === "corporate";
  const a = face?.a || t(lang, ev.a);
  const b = face?.a ? (face.b || (single ? "" : t(lang, ev.b ?? same("")))) : t(lang, ev.b ?? same(""));
  const first = face?.time || "16:00";
  const iso = face?.date ? `${face.date}T${first}:00+04:00` : ev.date;
  const city = face?.city || t(lang, ev.city);
  const venue = face?.venue || t(lang, ev.venue);
  const address = t(lang, ev.address);
  // the first blocks of the real page, after the hero — two at most, so the
  // thumbnail reads as the page's first screen, not a catalogue of blocks
  const blocks: React.ReactNode[] = [];
  if (tp.blocks.countdown) blocks.push(<Countdown key="c" lang={lang} iso={iso} />);
  if (tp.blocks.map) blocks.push(<MapCard key="m" lang={lang} venue={venue} address={address} city={city} />);
  if (tp.blocks.timeline) blocks.push(<Timeline key="t" lang={lang} stops={ev.stops} kind={tp.blocks.timeline} />);
  if (tp.blocks.dressCode) blocks.push(<DressCode key="d" lang={lang} colors={tp.blocks.dressCode} />);
  const occ = tp.category === "christening" ? "baptism" : tp.category;
  const kicker = face?.a ? t(lang, occasions[occ].kicker) : t(lang, ev.kicker);
  const style = { "--tp-bg": th.bg, "--tp-fg": th.fg, "--tp-soft": th.fgSoft, "--tp-acc": th.accent, "--tp-acc-ink": th.accentInk, "--tp-panel": th.panel } as React.CSSProperties;
  return (
    <div className={`kn-tp kn-tp--thumb kn-tp--${tp.category} kn-tp--face-${th.face}${th.dark ? " kn-tp--dark" : ""}`} style={style} data-tpl={tp.id}>
      <div className="kn-tp__main">
        <section className="kn-tp__hero">
          {/* a template with its own hero (the wax-seal banner) shows THAT, so
              the card is the page's first screen and not a different one */}
          {tp.blocks.sealBanner ? (
            <SealBanner lang={lang} a={a} b={b} iso={iso} kicker={kicker} compact />
          ) : tp.blocks.sceneHero ? (
            <SceneHero lang={lang} a={a} b={b} iso={iso} kicker={kicker} city={city} weekday={t(lang, weekdayFromIso(iso))} compact />
          ) : tp.blocks.castleScene ? (
            <CastleScene lang={lang} a={a} b={b} iso={iso} kicker={kicker} city={city} weekday={t(lang, weekdayFromIso(iso))} compact />
          ) : (<>
          <div className="kn-tp__cover">
            <Plate img={face?.photos?.[0] ?? tp.cover} alt="" sizes="200px" ratio={tp.category === "corporate" ? "16 / 10" : "4 / 5"} />
          </div>
          <div className="kn-tp__heroIn">
            <p className="kn-tp__kick">{kicker}</p>
            {/* a thumbnail must not plant an <h1> in the host document —
                the class carries all the styling */}
            <div className={`kn-tp__names${th.foil ? " kn-foil" : ""}${th.neon ? " kn-neon" : ""}`}>
              {b ? (<><span>{a}</span><i>·</i><span>{b}</span></>) : a}
            </div>
            <p className="kn-tp__date">{stampFromIso(iso)}</p>
            <p className="kn-tp__meta">{t(lang, weekdayFromIso(iso))} · {city}</p>
          </div>
          </>)}
        </section>
        {withBlocks && blocks.length > 0 && <section className="kn-tp__grid">{blocks.slice(0, 2)}</section>}
      </div>
    </div>
  );
}

export default function ExampleThumb({ e, lang, face, draft }: { e: Example; lang: Lang; face?: Face; draft?: Draft | null }) {
  if (e.card) {
    return <WCardFace card={e.card.card} variant={e.card.variant} lang={lang} a={face?.a} b={face?.b} date={face?.date} time={face?.time} venue={face?.venue} city={face?.city} className="kn-ex__face" />;
  }
  if (e.kids) {
    // a birthday's two «names» are the child and the age — the age arrives as
    // text from the order form, and the face wants a number
    const age = face?.b && /^\d{1,3}$/.test(face.b) ? Number(face.b) : undefined;
    return (
      <span className="kn-ex__face kn-ex__face--kids">
        <KidsTile card={e.kids.card} variant={e.kids.variant} lang={lang} face={{ name: face?.a, age, date: face?.date, time: face?.time, venue: face?.venue }} />
      </span>
    );
  }
  if (e.kind === "engine") {
    const st = parseLiveTpl(e.id);
    if (!st) return null;
    const data = draftToInvitation(draft ?? null, st.id);
    return (
      <LiveThumb>
        <div className="kn-ep__frame"><TemplateRenderer data={data} lang={lang} compact chrome={false} /></div>
      </LiveThumb>
    );
  }
  const tp = findTemplate(e.id);
  if (!tp) return null;
  return (
    <LiveThumb>
      <TemplateHeroThumb tp={tp} lang={lang} face={face} />
    </LiveThumb>
  );
}
