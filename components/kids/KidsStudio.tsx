"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import DemoModal from "@/components/customizer/DemoModal";
import LinkPanel from "@/components/customizer/LinkPanel";
import { kids as K, wizard, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { encodeDraft, type Draft } from "@/lib/draft";
import { kidsCards, kidsThemes, kidsTpl, sampleKids, type KidsCard, type Variant } from "@/lib/kids";
import KidsCardFace from "./KidsCardFace";
import KidsTile from "./KidsTile";

// ============================================================================
// THE STUDIO — /kids/<card>. The reference's card page, measured: card and
// envelope on the design's own backdrop, a small carousel (Card · Envelope ·
// Guest view), the design's name and colourways in a right rail — and then
// what the reference hides behind a login: CUSTOMIZE, right here. Every field
// re-renders the card as the parent types; the guest view tab frames the
// real /invitation URL; Live Demo, Generate Web Link and Order sit under it.
//
// The draft is the same lib/draft.ts Draft the wizard makes (occasion
// "birthday", tpl "kids-<card>-<variant>", plus age/note/host/ask), so the
// guest link, the order and the ICS all already understand it.
// ============================================================================

type State = {
  name: string; age: string; name2: string; age2: string;
  date: string; time: string; venue: string; address: string; city: string; map: string;
  host: string; note: string; rsvpBy: string; counts: boolean; allergy: boolean;
};
const KEY = "kniq.kids.draft.v1";
const empty = (): State => ({ name: "", age: "", name2: "", age2: "", date: "", time: "12:00", venue: "", address: "", city: "", map: "", host: "", note: "", rsvpBy: "", counts: true, allergy: true });

export default function KidsStudio({ lang, card, initialVariant }: { lang: Lang; card: KidsCard; initialVariant?: string }) {
  const base = lang === "hy" ? "" : "/en";
  const [vi, setVi] = useState(() => Math.max(0, card.variants.findIndex((x) => x.id === initialVariant)));
  const variant: Variant = card.variants[vi] ?? card.variants[0];
  const [s, setS] = useState<State>(empty);
  const [photo, setPhoto] = useState<string | null>(null);
  const [tab, setTab] = useState<"card" | "envelope" | "guest">("card");
  const [demo, setDemo] = useState(false);
  const hydrated = useRef(false);
  const set = (p: Partial<State>) => setS((cur) => ({ ...cur, ...p }));

  // restore the parent's typing (and the catalogue's preview name); the
  // colourway comes from ?v= so the tile's dot survives the hop
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const v = new URLSearchParams(window.location.search).get("v");
    if (v) { const ix = card.variants.findIndex((x) => x.id === v); if (ix >= 0) setVi(ix); }
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setS((cur) => ({ ...cur, ...(JSON.parse(raw) as Partial<State>) }));
      else {
        const pv = sessionStorage.getItem("kniq.kids.preview");
        if (pv) { const p = JSON.parse(pv) as { name?: string; age?: string }; setS((cur) => ({ ...cur, name: p.name ?? "", age: p.age ?? "" })); }
      }
    } catch {}
  }, [card.variants]);
  useEffect(() => { if (hydrated.current) try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, [s]);
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  const ageN = s.age ? Number(s.age) : undefined;
  const ready = Boolean(s.name.trim() && s.date);
  const tpl = kidsTpl(card, variant);
  const draft: Draft | null = useMemo(() => {
    if (!ready) return null;
    return {
      a: s.name.trim(), b: card.headline === "double" ? s.name2.trim() : "", date: s.date, time: s.time || "12:00", city: s.city.trim(), stops: [], occasion: "birthday",
      venue: s.venue.trim() || undefined, address: s.address.trim() || undefined, map: s.map.trim() || undefined, rsvpBy: s.rsvpBy || undefined,
      tpl, age: ageN, note: s.note.trim() || undefined, host: s.host.trim() || undefined,
      ask: [s.counts ? "counts" : null, s.allergy ? "allergy" : null].filter((x): x is "counts" | "allergy" => x !== null),
    };
  }, [ready, s, tpl, ageN, card.headline]);
  const blob = draft ? encodeDraft(draft) : "";
  const demoHref = `${base}/invitation/${tpl}${blob ? `?p=${blob}` : ""}`;
  const orderHref = `${base}/order?style=${tpl}&occasion=birthday${blob ? `&p=${blob}` : ""}`;
  const openDemo = useCallback(() => setDemo(true), []);
  // by id, not identity — `card` crossed the server→client boundary and is a copy
  const sample = sampleKids[Math.max(0, kidsCards.findIndex((c) => c.id === card.id)) % sampleKids.length];

  const face = {
    name: s.name || undefined, age: ageN, second: card.headline === "double" ? { name: s.name2, age: s.age2 ? Number(s.age2) : undefined } : undefined,
    date: s.date || undefined, time: s.time, venue: s.venue || undefined, address: s.address || undefined, city: s.city || undefined,
    note: s.note || undefined, host: s.host || undefined, rsvpBy: s.rsvpBy || undefined, photo: photo ?? undefined,
  };

  const related = kidsCards.filter((c) => c.id !== card.id && c.themes.some((th) => card.themes.includes(th))).slice(0, 4);

  return (
    <div className="kn-ks" style={{ "--ks-back": variant.backdrop } as React.CSSProperties}>
      <nav className="kn-ks__crumbs" aria-label="breadcrumb">
        <Link href={`${base}/`}>ԿՆԻՔ</Link><span>/</span><Link href={`${base}/kids`}>{t(lang, K.title)}</Link><span>/</span><b>{t(lang, card.name)}</b>
      </nav>

      <div className="kn-ks__grid">
        {/* ------------------------------------------------ THE STAGE */}
        <section className="kn-ks__stage" aria-label={t(lang, K.preview)}>
          <div className="kn-ks__tabs" role="tablist">
            {(["card", "envelope", "guest"] as const).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} className="kn-ks__tab" onClick={() => setTab(k)}>
                {t(lang, k === "card" ? K.cardTab : k === "envelope" ? K.envelopeTab : K.guestTab)}
              </button>
            ))}
          </div>
          <div className={`kn-ks__view kn-ks__view--${tab}`}>
            {tab === "card" && (
              <div className={`kn-ks__card${card.shape === "landscape" ? " kn-ks__card--land" : ""}`}>
                <KidsCardFace card={card} variant={variant} lang={lang} details sample={!ready} {...face} />
              </div>
            )}
            {tab === "envelope" && <KidsTile card={card} variant={variant} lang={lang} size="hero" face={{ ...face, details: true, sample: !ready }} />}
            {tab === "guest" && (
              <div className="kn-ks__phone">
                {ready ? (
                  <iframe key={demoHref} className="kn-ks__frame" src={demoHref} title={t(lang, K.guestTab)} loading="lazy" />
                ) : (
                  <p className="kn-ks__phoneEmpty">{t(lang, wizard.errFill)}</p>
                )}
              </div>
            )}
          </div>
          <div className="kn-ks__dots" role="radiogroup" aria-label={t(lang, K.colorway)}>
            {card.variants.map((vv, j) => (
              <button key={vv.id} type="button" role="radio" aria-checked={j === vi} aria-label={t(lang, vv.label)} className="kn-kids__dot kn-kids__dot--lg" style={{ "--d1": vv.paper, "--d2": vv.a } as React.CSSProperties} onClick={() => setVi(j)} />
            ))}
            <span className="kn-kids__by">{t(lang, variant.label)}</span>
          </div>
        </section>

        {/* ------------------------------------------------ THE RAIL */}
        <aside className="kn-ks__rail">
          <header className="kn-ks__head">
            <h1 className="kn-ks__name">{t(lang, card.name)}</h1>
            <p className="kn-ks__by">{t(lang, K.by)} {t(lang, card.by)} · {t(lang, K.title)}</p>
            <p className="kn-ks__themes">
              {card.themes.map((th) => (
                <Link key={th} href={`${base}/kids?theme=${th}`} className="kn-chip">{t(lang, kidsThemes.find((x) => x.id === th)!.label)}</Link>
              ))}
            </p>
          </header>

          <div className="kn-ks__actions">
            <button type="button" className="kn-btn" onClick={openDemo} disabled={!ready} title={ready ? t(lang, wizard.demoHint) : t(lang, wizard.errFill)}>
              <Icon name="film" size={16} /> {t(lang, wizard.demo)}
            </button>
            <button type="button" className="kn-btn kn-btn--ghost" onClick={() => setTab("guest")}>{t(lang, K.preview)}</button>
          </div>

          {/* ---------------------------------------------- CUSTOMIZE */}
          <form className="kn-ks__form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="kn-ks__h"><Icon name="seal" size={16} /> {t(lang, K.customize)} <small>{t(lang, K.fill)}</small></h2>
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ks-name">{t(lang, K.childName)}</label><input id="ks-name" className="kn-f__in" value={s.name} onChange={(e) => set({ name: e.target.value })} maxLength={30} placeholder={sample[lang]} autoComplete="off" /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ks-age">{t(lang, K.age)}</label><input id="ks-age" className="kn-f__in" type="number" inputMode="numeric" min={1} max={19} value={s.age} onChange={(e) => set({ age: e.target.value })} placeholder={String(sample.age)} /></div>
            </div>
            {card.headline === "double" && (
              <div className="kn-build__pair kn-ks__pair">
                <div className="kn-f"><label className="kn-f__label" htmlFor="ks-name2">{t(lang, K.second)}</label><input id="ks-name2" className="kn-f__in" value={s.name2} onChange={(e) => set({ name2: e.target.value })} maxLength={30} autoComplete="off" /></div>
                <div className="kn-f"><label className="kn-f__label" htmlFor="ks-age2">{t(lang, K.age)}</label><input id="ks-age2" className="kn-f__in" type="number" inputMode="numeric" min={1} max={19} value={s.age2} onChange={(e) => set({ age2: e.target.value })} /></div>
              </div>
            )}
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ks-date">{t(lang, K.date)}</label><input id="ks-date" className="kn-f__in" type="date" value={s.date} onChange={(e) => set({ date: e.target.value })} min="2026-01-01" max="2030-12-31" /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ks-time">{t(lang, K.time)}</label><input id="ks-time" className="kn-f__in" type="time" value={s.time} onChange={(e) => set({ time: e.target.value })} step={300} /></div>
            </div>
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ks-venue">{t(lang, K.venue)}</label><input id="ks-venue" className="kn-f__in" value={s.venue} onChange={(e) => set({ venue: e.target.value })} maxLength={60} placeholder={t(lang, K.venuePh)} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ks-city">{t(lang, K.city)}</label><input id="ks-city" className="kn-f__in" value={s.city} onChange={(e) => set({ city: e.target.value })} maxLength={40} placeholder={lang === "hy" ? "Երևան" : "Yerevan"} /></div>
            </div>
            <div className="kn-f"><label className="kn-f__label" htmlFor="ks-addr">{t(lang, K.address)}</label><input id="ks-addr" className="kn-f__in" value={s.address} onChange={(e) => set({ address: e.target.value })} maxLength={80} placeholder={lang === "hy" ? "Կոմիտաս 12" : "12 Komitas Ave"} /></div>
            <div className="kn-f"><label className="kn-f__label" htmlFor="ks-map">{t(lang, K.map)}</label><input id="ks-map" className="kn-f__in" type="url" inputMode="url" value={s.map} onChange={(e) => set({ map: e.target.value.trim() })} maxLength={400} placeholder="https://maps.app.goo.gl/…" /></div>
            <div className="kn-f"><label className="kn-f__label" htmlFor="ks-note">{t(lang, K.note)}</label><input id="ks-note" className="kn-f__in" value={s.note} onChange={(e) => set({ note: e.target.value })} maxLength={200} placeholder={t(lang, K.notePh)} /></div>
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ks-host">{t(lang, K.host)}</label><input id="ks-host" className="kn-f__in" value={s.host} onChange={(e) => set({ host: e.target.value })} maxLength={60} placeholder={t(lang, K.hostPh)} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ks-rsvp">{t(lang, K.rsvpBy)}</label><input id="ks-rsvp" className="kn-f__in" type="date" value={s.rsvpBy} onChange={(e) => set({ rsvpBy: e.target.value })} max={s.date || undefined} /></div>
            </div>

            {card.photo && (
              <div className="kn-f">
                <span className="kn-f__label">{t(lang, K.photo)} <small className="kn-wz__small">{t(lang, K.photoHint)}</small></span>
                <div className="kn-wz__photos">
                  {photo && (
                    <span className="kn-wz__ph">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="" />
                      <button type="button" className="kn-wz__swRm" aria-label={t(lang, K.removePhoto)} onClick={() => { URL.revokeObjectURL(photo); setPhoto(null); }}><Icon name="x" size={10} /></button>
                    </span>
                  )}
                  <label className="kn-wz__phAdd">
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f && f.type.startsWith("image/")) { if (photo) URL.revokeObjectURL(photo); setPhoto(URL.createObjectURL(f)); } e.target.value = ""; }} />
                    <Icon name="arrow" size={16} /> {t(lang, K.choosePhoto)}
                  </label>
                </div>
              </div>
            )}

            <div className="kn-f">
              <span className="kn-f__label">{t(lang, K.questions)}</span>
              <label className="kn-ks__check"><input type="checkbox" checked={s.counts} onChange={(e) => set({ counts: e.target.checked })} /> {t(lang, K.askCounts)}</label>
              <label className="kn-ks__check"><input type="checkbox" checked={s.allergy} onChange={(e) => set({ allergy: e.target.checked })} /> {t(lang, K.askAllergy)}</label>
            </div>
            {!ready && <p className="kn-wz__hint">{t(lang, wizard.errFill)}</p>}
          </form>

          <LinkPanel lang={lang} tpl={tpl} blob={blob} ready={ready} photo={photo} />

          <p className="kn-ks__order">
            <Link href={orderHref} className="kn-btn kn-btn--ghost">{t(lang, wizard.order)} <Icon name="arrow" size={14} /></Link>
          </p>

          <ul className="kn-ks__bullets">
            {K.bullets.map((b, i) => <li key={i}><Icon name="check" size={14} /> {t(lang, b)}</li>)}
          </ul>
          <p className="kn-ks__timing">{t(lang, K.timing)}</p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="kn-ks__more" aria-label={t(lang, K.more)}>
          <h2 className="kn-h2">{t(lang, K.more)}</h2>
          <ul className="kn-kids__grid kn-kids__grid--4">
            {related.map((c) => (
              <li key={c.id} className="kn-kids__it">
                <Link href={`${base}/kids/${c.id}`} className="kn-kids__tileLink" aria-label={t(lang, c.name)}>
                  <KidsTile card={c} variant={c.variants[0]} lang={lang} face={{ name: s.name || undefined, age: ageN, details: false }} />
                </Link>
                <div className="kn-kids__meta"><Link href={`${base}/kids/${c.id}`} className="kn-kids__name">{t(lang, c.name)}</Link></div>
              </li>
            ))}
          </ul>
          <p><Link href={`${base}/kids`} className="kn-btn kn-btn--ghost">{t(lang, K.backAll)}</Link></p>
        </section>
      )}

      {demo && <DemoModal lang={lang} href={demoHref} onClose={() => setDemo(false)} />}
    </div>
  );
}
