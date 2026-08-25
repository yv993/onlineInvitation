"use client";

import { useState } from "react";
import Image from "next/image";
import Particles from "@/components/ui/3d/Particles";
import TiltCard from "@/components/ui/3d/TiltCard";
import MusicDock from "@/components/ui/MusicDock";
import Icon from "@/components/Icon";
import { Countdown, DressCode, Godparents, MapCard, Timeline, ToastBoard } from "@/components/templates/blocks/Blocks";
import { findTemplate, type TemplateSpec } from "@/lib/templates";
import { occasions, wizard, type Lang, type T } from "@/lib/content";
import { t } from "@/lib/i18n";
import { stampFromIso, weekdayFromIso } from "@/lib/draft";
import { CATEGORY_TEMPLATES, useWizard, type WizardCategory } from "../WizardContext";
import ringbox from "@/assets/photos/ringbox.webp";
import handsBouquet from "@/assets/photos/hands-bouquet.webp";
import jarsAngel from "@/assets/photos/jars-angel.webp";
import cakeGold from "@/assets/photos/cake-gold.webp";
import stageStar from "@/assets/photos/stage-star.webp";

// ============================================================================
// THE LIVE PREVIEWS — five mini invitations, one per occasion, all reading the
// same wizard state. The couple types once; every card changes.
//
// Each preview wears the palette of the template it would open as (the chosen
// template when it is the couple's own occasion, that occasion's first
// template otherwise), and reuses the SAME blocks the real templates are
// composed from — Countdown, Timeline, MapCard, Godparents, DressCode,
// ToastBoard, the particle systems, the tilt card, the music dock — so what
// the previews show is what the guest link renders, smaller. Empty fields
// fall back to the template's sample event, marked «sample», so the very
// first keystroke has something to replace.
// ============================================================================

const same = (x: string): T => ({ hy: x, en: x });

const COVER = { wedding: handsBouquet, engagement: ringbox, baptism: jarsAngel, birthday: cakeGold, corporate: stageStar } as const;

/** everything a preview needs, resolved from state + the template's sample */
function useResolved(kind: WizardCategory, override?: string) {
  const { s, blob } = useWizard();
  // a specific template when the preview list asks for one; else the chosen
  // template for the couple's own occasion, that occasion's first otherwise
  const tplId = override ?? (kind === s.occasion ? s.tpl : CATEGORY_TEMPLATES[kind][0]);
  const tpl = findTemplate(tplId) ?? findTemplate(CATEGORY_TEMPLATES[kind][0])!;
  const ev = tpl.event;
  const lang = s.lang;
  const single = kind === "birthday" || kind === "corporate";

  const a = s.a || t(lang, ev.a);
  const b = s.a ? (s.b || (single ? "" : t(lang, ev.b ?? same("")))) : t(lang, ev.b ?? same(""));
  const first = s.stops.find((x) => x.time)?.time || s.time || "16:00";
  const iso = s.date ? `${s.date}T${first}:00+04:00` : ev.date;
  const city = s.city || t(lang, ev.city);
  const venue = s.venue || t(lang, ev.venue);
  const address = s.address || t(lang, ev.address);
  const own = s.stops.filter((x) => x.time && x.name);
  const stops: TemplateSpec["event"]["stops"] = own.length
    ? own.map((x) => ({ time: x.time, name: same(x.name), place: same(x.place || x.address) }))
    : ev.stops;
  const isSample = !s.a;
  const th = tpl.theme;
  const style = {
    "--tp-bg": th.bg, "--tp-fg": th.fg, "--tp-soft": th.fgSoft, "--tp-acc": th.accent, "--tp-acc-ink": th.accentInk, "--tp-panel": th.panel,
    "--f-tp": th.face === "sans" ? "var(--f-body)" : "var(--f-display)",
  } as React.CSSProperties;
  const kicker = kind === s.occasion && s.a ? t(lang, occasions[kind].kicker) : t(lang, ev.kicker);
  return { s, blob, lang, tpl, th, style, a, b, iso, city, venue, address, stops, isSample, kicker, single };
}

function Head({ kind, r, foil, neon }: { kind: WizardCategory; r: ReturnType<typeof useResolved>; foil?: boolean; neon?: boolean }) {
  const { lang, a, b, iso, city, kicker, single, isSample } = r;
  const amp = single ? "·" : lang === "hy" ? "և" : "&";
  return (
    <header className="kn-pv__head">
      <span className={`kn-pv__tag${isSample ? "" : " kn-pv__tag--own"}`}>
        {t(lang, occasions[kind].name)} · {t(lang, isSample ? wizard.sample : wizard.yours)}
      </span>
      <p className="kn-pv__kick">{kicker}</p>
      <h3 className={`kn-pv__names${foil ? " kn-foil" : ""}${neon ? " kn-neon" : ""}`}>
        <span>{a}</span>
        {b && (<><i>{amp}</i><span>{b}</span></>)}
      </h3>
      <p className="kn-pv__date">{stampFromIso(iso)}</p>
      <p className="kn-pv__meta">{t(lang, weekdayFromIso(iso))} · {city}</p>
    </header>
  );
}

function PhotoStrip({ photos, alt }: { photos: string[]; alt: string }) {
  if (!photos.length) return null;
  return (
    <div className="kn-pv__strip" aria-label={alt}>
      {photos.slice(0, 4).map((u, i) => (
        // object URLs are this tab's memory — next/image cannot (and must not) optimise them
        // eslint-disable-next-line @next/next/no-img-element
        <img key={u} src={u} alt="" style={{ "--i": i } as React.CSSProperties} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- WEDDING
function Wedding({ onDemo, tplId }: { onDemo: () => void; tplId?: string }) {
  const r = useResolved("wedding", tplId);
  const { s, lang, th, style, venue, address, city, iso } = r;
  void onDemo;
  return (
    <article className={`kn-pv kn-pv--wedding${th.dark ? " kn-pv--dark" : ""}`} style={style} data-kind="wedding">
      <Particles fx="petals" color={th.accent} className="kn-pv__fx" />
      <div className="kn-pv__in">
        <Head kind="wedding" r={r} foil />
        <PhotoStrip photos={s.photos} alt={t(lang, wizard.photos)} />
        <Countdown lang={lang} iso={iso} />
        <MapCard lang={lang} venue={venue} address={address} city={city} url={s.map || undefined} />
        {s.dress && s.dress.length > 0 && <DressCode lang={lang} colors={s.dress} />}
      </div>
    </article>
  );
}

// ------------------------------------------------------------- ENGAGEMENT
function Engagement({ onDemo, tplId }: { onDemo: () => void; tplId?: string }) {
  const r = useResolved("engagement", tplId);
  const { s, blob, lang, th, style, stops, a, b, iso } = r;
  void onDemo;
  const photo = s.photos[0];
  return (
    <article className={`kn-pv kn-pv--engagement${th.dark ? " kn-pv--dark" : ""}`} style={style} data-kind="engagement">
      <Particles fx="sparkles" color={th.accent} className="kn-pv__fx" />
      <div className="kn-pv__in">
        <div className="kn-pv__hero">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="kn-pv__heroImg" src={photo} alt="" />
          ) : (
            <Image className="kn-pv__heroImg" src={COVER.engagement} alt="" sizes="(max-width: 900px) 92vw, 420px" placeholder="blur" />
          )}
          <div className="kn-pv__heroOver">
            <p className="kn-pv__kick">{r.kicker}</p>
            <h3 className="kn-pv__names">
              <span>{a}</span>{b && (<><i>{lang === "hy" ? "և" : "&"}</i><span>{b}</span></>)}
            </h3>
            <p className="kn-pv__date">{stampFromIso(iso)}</p>
          </div>
          <span className={`kn-pv__tag kn-pv__tag--onImg${r.isSample ? "" : " kn-pv__tag--own"}`}>
            {t(lang, occasions.engagement.name)} · {t(lang, r.isSample ? wizard.sample : wizard.yours)}
          </span>
        </div>
        <Timeline lang={lang} stops={stops} kind="order" />
        <div className="kn-tb kn-pv__ics">
          {blob ? (
            <a className="kn-tb__btn" href={`/api/ics?p=${blob}`} download={`${s.date}.ics`}>
              <Icon name="calendar" size={16} /> {t(lang, wizard.saveDate)}
            </a>
          ) : (
            <button type="button" className="kn-tb__btn" disabled title={t(lang, wizard.errFill)}>
              <Icon name="calendar" size={16} /> {t(lang, wizard.saveDate)}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------- BAPTISM
function Baptism({ onDemo, tplId }: { onDemo: () => void; tplId?: string }) {
  const r = useResolved("baptism", tplId);
  const { s, lang, th, style, stops, a, b, iso } = r;
  const [meal, setMeal] = useState(0);
  const god = s.godA || s.godB ? { a: s.godA || "—", b: s.godB || "—" } : undefined;
  return (
    <article className={`kn-pv kn-pv--baptism${th.dark ? " kn-pv--dark" : ""}`} style={style} data-kind="baptism">
      <Particles fx="clouds" color={th.accent} className="kn-pv__fx" />
      <div className="kn-pv__in">
        <span className={`kn-pv__tag${r.isSample ? "" : " kn-pv__tag--own"}`}>
          {t(lang, occasions.baptism.name)} · {t(lang, r.isSample ? wizard.sample : wizard.yours)}
        </span>
        <TiltCard className="kn-pv__tilt" gyro={false}>
          <div className="kn-pv__frame">
            <svg viewBox="0 0 200 200" className="kn-pv__wreath" aria-hidden="true">
              <circle cx="100" cy="100" r="82" fill="none" stroke="var(--tp-acc)" strokeWidth="1" strokeDasharray="5 4" />
              {Array.from({ length: 24 }).map((_, i) => (
                <ellipse key={i} cx="100" cy="18" rx="4.5" ry="10" fill="var(--tp-acc)" opacity={0.55 + (i % 3) * 0.15} transform={`rotate(${i * 15} 100 100)`} />
              ))}
            </svg>
            <span className="kn-pv__cross" aria-hidden="true">✝</span>
            <p className="kn-pv__kick">{r.kicker}</p>
            <h3 className="kn-pv__names kn-pv__names--child"><span>{a}</span></h3>
            {b && <p className="kn-pv__meta">{b}</p>}
            <p className="kn-pv__date">{stampFromIso(iso)}</p>
          </div>
        </TiltCard>
        <PhotoStrip photos={s.photos} alt={t(lang, wizard.photos)} />
        <Godparents lang={lang} names={god} />
        <Timeline lang={lang} stops={stops} kind="order" />
        <div className="kn-tb kn-pv__meal">
          <p className="kn-tb__label">{t(lang, wizard.meal)}</p>
          <div className="kn-chips" role="radiogroup" aria-label={t(lang, wizard.meal)}>
            {wizard.meals.map((m, i) => (
              <button key={i} type="button" role="radio" aria-checked={meal === i} className="kn-chips__b" aria-pressed={meal === i} onClick={() => setMeal(i)}>
                {t(lang, m)}
              </button>
            ))}
          </div>
          <button type="button" className="kn-tb__btn" onClick={onDemo}>
            <Icon name="check" size={16} /> {t(lang, wizard.rsvpTry)}
          </button>
        </div>
      </div>
    </article>
  );
}

// --------------------------------------------------------------- BIRTHDAY
function Birthday({ onDemo, tplId }: { onDemo: () => void; tplId?: string }) {
  const r = useResolved("birthday", tplId);
  const { s, lang, th, style, iso } = r;
  void onDemo;
  const born = s.born ? `${s.born}-01-01` : undefined;
  const src = s.music || "/audio/pad-bright.mp3";
  const label = s.music ? (s.music.split("/").pop() ?? "track") : lang === "hy" ? "Պայծառ բեմ (սինթեզված)" : "Bright bed (synthesized)";
  return (
    <article className={`kn-pv kn-pv--birthday${th.dark ? " kn-pv--dark" : ""}`} style={style} data-kind="birthday">
      <Particles fx="confetti" color={th.accent} className="kn-pv__fx" />
      <div className="kn-pv__in">
        <Head kind="birthday" r={r} neon />
        <PhotoStrip photos={s.photos} alt={t(lang, wizard.photos)} />
        <Countdown lang={lang} iso={iso} ageBorn={born} />
        <div className="kn-tb kn-pv__dockWrap">
          <p className="kn-tb__label">{t(lang, wizard.music)}</p>
          <MusicDock key={src} src={src} label={label} dark={th.dark} inline />
        </div>
        <ToastBoard lang={lang} />
      </div>
    </article>
  );
}

// -------------------------------------------------------------- CORPORATE
function Corporate({ onDemo, tplId }: { onDemo: () => void; tplId?: string }) {
  const r = useResolved("corporate", tplId);
  const { lang, th, style, stops, iso } = r;
  void onDemo;
  return (
    <article className={`kn-pv kn-pv--corporate${th.dark ? " kn-pv--dark" : ""}`} style={style} data-kind="corporate">
      <Particles fx="grid" color={th.accent} className="kn-pv__fx" />
      <div className="kn-pv__in">
        <Head kind="corporate" r={r} />
        <Countdown lang={lang} iso={iso} />
        <Timeline lang={lang} stops={stops} kind="tabs" />
      </div>
    </article>
  );
}

const KINDS: Record<WizardCategory, (p: { onDemo: () => void; tplId?: string }) => React.JSX.Element> = {
  wedding: Wedding,
  engagement: Engagement,
  baptism: Baptism,
  birthday: Birthday,
  corporate: Corporate,
};

export default function PreviewCard({ kind, onDemo, tplId }: { kind: WizardCategory; onDemo: () => void; tplId?: string }) {
  const C = KINDS[kind];
  return <C onDemo={onDemo} tplId={tplId} />;
}

/** the five, the couple's own occasion first */
export function orderedKinds(selected: WizardCategory): WizardCategory[] {
  const all: WizardCategory[] = ["wedding", "engagement", "baptism", "birthday", "corporate"];
  return [selected, ...all.filter((k) => k !== selected)];
}

export { type Lang };
