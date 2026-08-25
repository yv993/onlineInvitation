"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import DemoModal from "@/components/customizer/DemoModal";
import LinkPanel from "@/components/customizer/LinkPanel";
import { wcards as C, wizard, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { encodeDraft, type Draft, type DraftStop } from "@/lib/draft";
import { envBackdrops, envCovers, envLiners, envSeals, envStamps, wCards, wStyles, wTpl, type WCard, type WVariant } from "@/lib/wcards";
import EnvelopeScene from "./EnvelopeScene";
import WCardFace from "./WCardFace";
import WTile from "./WTile";

// ============================================================================
// THE STUDIO — /wedding-cards/<design>. The reference's design page (name ·
// artist · Start Customizing · Preview Animation · description · matching
// components · you may like) with the customizing done right here: the
// couple's words, the programme for the back, and the ENVELOPE — paper,
// liner, stamp, wax seal, backdrop — every choice re-rendering the stage.
// The Animation tab plays the open sequence on the studio's own stage; Preview
// Animation opens the real guest link full-screen.
// ============================================================================

type S = {
  a: string; b: string; host: string; date: string; time: string; venue: string; address: string; city: string; map: string;
  stops: DraftStop[]; note: string; rsvpBy: string; music: string;
  cover: string; liner: string; stamp: string; seal: string; backdrop: string; guest: string;
};
const KEY = "kniq.wcards.draft.v1";
const empty = (): S => ({ a: "", b: "", host: "", date: "", time: "15:00", venue: "", address: "", city: "", map: "", stops: [{ time: "12:30", name: "", place: "", address: "" }, { time: "15:00", name: "", place: "", address: "" }, { time: "18:00", name: "", place: "", address: "" }], note: "", rsvpBy: "", music: "", cover: "", liner: "", stamp: "", seal: "", backdrop: "", guest: "" });

export default function WStudio({ lang, card }: { lang: Lang; card: WCard }) {
  const base = lang === "hy" ? "" : "/en";
  const [vi, setVi] = useState(0);
  const variant: WVariant = card.variants[vi] ?? card.variants[0];
  const [s, setS] = useState<S>(empty);
  const [photos, setPhotos] = useState<string[]>([]);
  const [tab, setTab] = useState<"card" | "back" | "envelope" | "animation">("card");
  const [demo, setDemo] = useState(false);
  const hydrated = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const set = (p: Partial<S>) => setS((cur) => ({ ...cur, ...p }));

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const v = new URLSearchParams(window.location.search).get("v");
    if (v) { const ix = card.variants.findIndex((x) => x.id === v); if (ix >= 0) setVi(ix); }
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setS((cur) => ({ ...cur, ...(JSON.parse(raw) as Partial<S>) }));
      else { const pv = sessionStorage.getItem("kniq.wcards.preview"); if (pv) { const p = JSON.parse(pv) as { a?: string; b?: string }; setS((cur) => ({ ...cur, a: p.a ?? "", b: p.b ?? "" })); } }
    } catch {}
  }, [card.variants]);
  useEffect(() => { if (hydrated.current) try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, [s]);
  useEffect(() => () => photos.forEach((u) => URL.revokeObjectURL(u)), [photos]);

  // the envelope defaults follow the colourway until the couple chooses
  const cover = s.cover || variant.cover, liner = s.liner || variant.liner, backdrop = s.backdrop || variant.backdrop, stamp = s.stamp || "monogram", seal = s.seal || "monogram";
  const ready = Boolean(s.a.trim() && s.b.trim() && s.date);
  const tpl = wTpl(card, variant);
  const stops = s.stops.filter((x) => x.time && x.name.trim());
  const draft: Draft | null = useMemo(() => {
    if (!ready) return null;
    return {
      a: s.a.trim(), b: s.b.trim(), date: s.date, time: s.time || "15:00", city: s.city.trim(), stops, occasion: "wedding",
      venue: s.venue.trim() || undefined, address: s.address.trim() || undefined, map: s.map.trim() || undefined, rsvpBy: s.rsvpBy || undefined,
      host: s.host.trim() || undefined, note: s.note.trim() || undefined, music: s.music.trim() || undefined, tpl,
      envCover: cover, envLiner: liner, envStamp: stamp, envSeal: seal, envBack: backdrop,
    };
  }, [ready, s, stops, tpl, cover, liner, stamp, seal, backdrop]);
  const blob = draft ? encodeDraft(draft) : "";
  const demoHref = `${base}/invitation/${tpl}${blob ? `?p=${blob}` : ""}${s.guest ? `${blob ? "&" : "?"}g=${encodeURIComponent(s.guest)}` : ""}`;
  const orderHref = `${base}/order?style=${tpl}&occasion=wedding${blob ? `&p=${blob}` : ""}`;
  const openDemo = useCallback(() => setDemo(true), []);

  const face = { a: s.a || undefined, b: s.b || undefined, host: s.host || undefined, date: s.date || undefined, time: s.time, venue: s.venue || undefined, address: s.address || undefined, city: s.city || undefined, rsvpBy: s.rsvpBy || undefined, note: s.note || undefined, stops: stops.length ? stops.map((x) => ({ time: x.time, name: x.name, place: x.place || x.address })) : undefined, photos, guest: s.guest || undefined };
  const names = `${s.a || (lang === "hy" ? "Նարե" : "Nare")} ${lang === "hy" ? "և" : "&"} ${s.b || (lang === "hy" ? "Հայկ" : "Hayk")}`;
  const initials: [string, string] = [[...(s.a || (lang === "hy" ? "Ն" : "N"))][0], [...(s.b || (lang === "hy" ? "Հ" : "H"))][0]];
  const related = wCards.filter((c) => c.id !== card.id && (c.collection === card.collection || c.styles.some((x) => card.styles.includes(x)))).slice(0, 4);
  const hasBack = card.features.includes("backside");

  return (
    <div className="kn-ks kn-ws" style={{ "--ks-back": envBackdrops.find((x) => x.id === backdrop)?.css ?? "#ECE6DA" } as React.CSSProperties}>
      <nav className="kn-ks__crumbs" aria-label="breadcrumb"><Link href={`${base}/`}>ԿՆԻՔ</Link><span>/</span><Link href={`${base}/wedding-cards`}>{t(lang, C.title)}</Link><span>/</span><b>{t(lang, card.name)}</b></nav>

      <div className="kn-ks__grid">
        {/* ------------------------------------------------ THE STAGE */}
        <section className="kn-ks__stage kn-ws__stage" aria-label={t(lang, C.previewAnim)}>
          <div className="kn-ks__tabs" role="tablist">
            {(["card", "back", "envelope", "animation"] as const).filter((k) => k !== "back" || hasBack).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} className="kn-ks__tab" onClick={() => setTab(k)}>
                {t(lang, k === "card" ? C.cardTab : k === "back" ? C.backTab : k === "envelope" ? C.envTab : C.animTab)}
              </button>
            ))}
          </div>
          <div className={`kn-ks__view kn-ks__view--${tab}`}>
            {tab === "card" && <div className={`kn-ks__card${card.shape === "landscape" ? " kn-ks__card--land" : ""}`}><WCardFace card={card} variant={variant} lang={lang} {...face} /></div>}
            {tab === "back" && <div className={`kn-ks__card${card.shape === "landscape" ? " kn-ks__card--land" : ""}`}><WCardFace card={card} variant={variant} lang={lang} side="back" {...face} /></div>}
            {tab === "envelope" && <WTile card={card} variant={{ ...variant, cover, liner }} lang={lang} size="hero" face={face} />}
            {tab === "animation" && (
              <EnvelopeScene key={`${tpl}-${cover}-${liner}-${stamp}-${seal}-${backdrop}`} lang={lang} card={card} choice={{ cover, liner, stamp, seal, backdrop }} guest={s.guest || undefined} names={names} city={s.city || (lang === "hy" ? "Երևան" : "Yerevan")} initials={initials} compact autoplay={false}
                front={<WCardFace card={card} variant={variant} lang={lang} {...face} />} back={hasBack ? <WCardFace card={card} variant={variant} lang={lang} side="back" {...face} /> : undefined} />
            )}
          </div>
          <div className="kn-ks__dots" role="radiogroup" aria-label={t(lang, C.colorway)}>
            {card.variants.map((vv, j) => (
              <button key={vv.id} type="button" role="radio" aria-checked={j === vi} aria-label={t(lang, vv.label)} className="kn-kids__dot kn-kids__dot--lg" style={{ "--d1": vv.paper, "--d2": vv.a } as React.CSSProperties} onClick={() => { setVi(j); set({ cover: "", liner: "", backdrop: "" }); }} />
            ))}
            <span className="kn-kids__by">{t(lang, variant.label)}</span>
          </div>
        </section>

        {/* ------------------------------------------------ THE RAIL */}
        <aside className="kn-ks__rail">
          <header className="kn-ks__head">
            <h1 className="kn-ks__name">{t(lang, card.name)}</h1>
            <p className="kn-ks__by">{t(lang, C.by)} {t(lang, card.by)} · {t(lang, C.title)}</p>
            <p className="kn-ks__themes">{card.styles.map((st) => <Link key={st} href={`${base}/wedding-cards?style=${st}`} className="kn-chip">{t(lang, wStyles.find((x) => x.id === st)!.label)}</Link>)}</p>
          </header>
          <div className="kn-ks__actions">
            <button type="button" className="kn-btn" onClick={() => { formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); formRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }); }}><Icon name="seal" size={16} /> {t(lang, C.customize)}</button>
            <button type="button" className="kn-btn kn-btn--ghost" onClick={() => (ready ? openDemo() : setTab("animation"))}><Icon name="film" size={16} /> {t(lang, C.previewAnim)}</button>
          </div>
          <p className="kn-wz__small">{t(lang, C.previewNote)}</p>
          <p className="kn-ws__desc">{t(lang, card.desc)}</p>

          {/* -------------------------------------------- CUSTOMIZE */}
          <form ref={formRef} className="kn-ks__form" onSubmit={(e) => e.preventDefault()} id="customize">
            <h2 className="kn-ks__h"><Icon name="seal" size={16} /> {t(lang, C.couple)} <small>{t(lang, C.fill)}</small></h2>
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-a">{t(lang, C.nameA)}</label><input id="ws-a" className="kn-f__in" value={s.a} onChange={(e) => set({ a: e.target.value })} maxLength={30} placeholder={lang === "hy" ? "Նարե" : "Nare"} autoComplete="off" /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-b">{t(lang, C.nameB)}</label><input id="ws-b" className="kn-f__in" value={s.b} onChange={(e) => set({ b: e.target.value })} maxLength={30} placeholder={lang === "hy" ? "Հայկ" : "Hayk"} autoComplete="off" /></div>
            </div>
            <div className="kn-f"><label className="kn-f__label" htmlFor="ws-host">{t(lang, C.hostLine)}</label><input id="ws-host" className="kn-f__in" value={s.host} onChange={(e) => set({ host: e.target.value })} maxLength={60} placeholder={t(lang, C.hostPh)} /></div>
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-date">{t(lang, C.when)}</label><input id="ws-date" className="kn-f__in" type="date" value={s.date} onChange={(e) => set({ date: e.target.value })} min="2026-01-01" max="2030-12-31" /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-time">{lang === "hy" ? "Ժամը" : "Time"}</label><input id="ws-time" className="kn-f__in" type="time" value={s.time} onChange={(e) => set({ time: e.target.value })} step={300} /></div>
            </div>
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-venue">{t(lang, C.venue)}</label><input id="ws-venue" className="kn-f__in" value={s.venue} onChange={(e) => set({ venue: e.target.value })} maxLength={60} placeholder={t(lang, C.venuePh)} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-city">{t(lang, C.city)}</label><input id="ws-city" className="kn-f__in" value={s.city} onChange={(e) => set({ city: e.target.value })} maxLength={40} placeholder={lang === "hy" ? "Երևան" : "Yerevan"} /></div>
            </div>
            <div className="kn-f"><label className="kn-f__label" htmlFor="ws-addr">{t(lang, C.address)}</label><input id="ws-addr" className="kn-f__in" value={s.address} onChange={(e) => set({ address: e.target.value })} maxLength={80} /></div>
            <div className="kn-f"><label className="kn-f__label" htmlFor="ws-map">{t(lang, C.map)}</label><input id="ws-map" className="kn-f__in" type="url" inputMode="url" value={s.map} onChange={(e) => set({ map: e.target.value.trim() })} maxLength={400} placeholder="https://maps.app.goo.gl/…" /></div>

            <fieldset className="kn-build__stops kn-wz__stops">
              <legend>{t(lang, C.programme)}</legend>
              {s.stops.map((x, i) => (
                <div className="kn-build__stop" key={i}>
                  <input className="kn-f__in" type="time" value={x.time} onChange={(e) => set({ stops: s.stops.map((y, j) => (j === i ? { ...y, time: e.target.value } : y)) })} aria-label={lang === "hy" ? "Ժամ" : "Time"} step={300} />
                  <input className="kn-f__in" value={x.name} onChange={(e) => set({ stops: s.stops.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)) })} maxLength={40} placeholder={[lang === "hy" ? "Հարսի տուն" : "The bride's home", lang === "hy" ? "Պսակադրություն" : "The ceremony", lang === "hy" ? "Հարսանյաց խնջույք" : "The banquet"][i] ?? ""} aria-label={lang === "hy" ? "Ինչ" : "What"} />
                  <input className="kn-f__in" value={x.place} onChange={(e) => set({ stops: s.stops.map((y, j) => (j === i ? { ...y, place: e.target.value } : y)) })} maxLength={60} placeholder={lang === "hy" ? "Որտեղ" : "Where"} aria-label={lang === "hy" ? "Որտեղ" : "Where"} />
                  <input className="kn-f__in" value={x.address} onChange={(e) => set({ stops: s.stops.map((y, j) => (j === i ? { ...y, address: e.target.value } : y)) })} maxLength={80} placeholder={lang === "hy" ? "Հասցե" : "Address"} aria-label={lang === "hy" ? "Հասցե" : "Address"} />
                  <button type="button" className="kn-build__rm" onClick={() => set({ stops: s.stops.filter((_, j) => j !== i) })} aria-label={lang === "hy" ? "Հեռացնել" : "Remove"}><Icon name="x" size={14} /></button>
                </div>
              ))}
              {s.stops.length < 5 && <button type="button" className="kn-build__add" onClick={() => set({ stops: [...s.stops, { time: "", name: "", place: "", address: "" }] })}>{lang === "hy" ? "+ Ավելացնել կանգառ" : "+ Add a stop"}</button>}
            </fieldset>

            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-note">{t(lang, C.note)}</label><input id="ws-note" className="kn-f__in" value={s.note} onChange={(e) => set({ note: e.target.value })} maxLength={200} placeholder={t(lang, C.notePh)} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-rsvp">{t(lang, C.rsvpBy)}</label><input id="ws-rsvp" className="kn-f__in" type="date" value={s.rsvpBy} onChange={(e) => set({ rsvpBy: e.target.value })} max={s.date || undefined} /></div>
            </div>

            {card.photo && card.photo.length > 0 && (
              <div className="kn-f">
                <span className="kn-f__label">{t(lang, C.photosLbl)} ({card.photo.length})</span>
                <div className="kn-wz__photos">
                  {photos.map((u, i) => (
                    <span className="kn-wz__ph" key={u}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" />
                      <button type="button" className="kn-wz__swRm" aria-label="×" onClick={() => setPhotos((cur) => cur.filter((_, j) => j !== i))}><Icon name="x" size={10} /></button>
                    </span>
                  ))}
                  {photos.length < card.photo.length && (
                    <label className="kn-wz__phAdd"><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f && f.type.startsWith("image/")) setPhotos((cur) => [...cur, URL.createObjectURL(f)]); e.target.value = ""; }} /><Icon name="arrow" size={16} /> {t(lang, C.choosePhoto)}</label>
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------- THE ENVELOPE */}
            <h2 className="kn-ks__h" id="ws-env"><Icon name="mail" size={16} /> {t(lang, C.envelope)}</h2>
            <div className="kn-f"><span className="kn-f__label">{t(lang, C.cover)}</span>
              <div className="kn-ws__sw" role="radiogroup" aria-label={t(lang, C.cover)}>
                {envCovers.map((c) => <button key={c.id} type="button" role="radio" aria-checked={cover === c.id} aria-label={t(lang, c.label)} title={t(lang, c.label)} className="kn-ws__swB" style={{ "--sw": c.paper } as React.CSSProperties} onClick={() => set({ cover: c.id })} />)}
              </div>
            </div>
            <div className="kn-f"><span className="kn-f__label">{t(lang, C.liner)}</span>
              <div className="kn-ws__sw" role="radiogroup" aria-label={t(lang, C.liner)}>
                {envLiners.map((c) => <button key={c.id} type="button" role="radio" aria-checked={liner === c.id} aria-label={t(lang, c.label)} title={t(lang, c.label)} className="kn-ws__swB kn-ws__swB--sq" style={{ "--sw": c.css } as React.CSSProperties} onClick={() => set({ liner: c.id })} />)}
              </div>
            </div>
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><span className="kn-f__label">{t(lang, C.stamp)}</span>
                <div className="kn-chips">{envStamps.map((c) => <button key={c.id} type="button" className="kn-chips__b" aria-pressed={stamp === c.id} onClick={() => set({ stamp: c.id })}>{t(lang, c.label)}</button>)}</div>
              </div>
              <div className="kn-f"><span className="kn-f__label">{t(lang, C.seal)}</span>
                <div className="kn-chips">{envSeals.map((c) => <button key={c.id} type="button" className="kn-chips__b" aria-pressed={seal === c.id} onClick={() => set({ seal: c.id })}>{c.wax !== "transparent" && <i className="kn-ws__waxDot" style={{ background: c.wax }} />}{t(lang, c.label)}</button>)}</div>
              </div>
            </div>
            <div className="kn-f"><span className="kn-f__label">{t(lang, C.backdrop)}</span>
              <div className="kn-ws__sw" role="radiogroup" aria-label={t(lang, C.backdrop)}>
                {envBackdrops.map((c) => <button key={c.id} type="button" role="radio" aria-checked={backdrop === c.id} aria-label={t(lang, c.label)} title={t(lang, c.label)} className="kn-ws__swB kn-ws__swB--sq" style={{ "--sw": c.css } as React.CSSProperties} onClick={() => set({ backdrop: c.id })} />)}
              </div>
            </div>
            <div className="kn-build__pair kn-ks__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-guest">{t(lang, C.guestName)}</label><input id="ws-guest" className="kn-f__in" value={s.guest} onChange={(e) => set({ guest: e.target.value })} maxLength={40} placeholder={lang === "hy" ? "Անի և Արամ" : "Ani & Aram"} /><small className="kn-wz__small kn-wz__fieldHint">{t(lang, C.guestHint)}</small></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ws-music">{t(lang, C.music)}</label><input id="ws-music" className="kn-f__in" type="url" inputMode="url" value={s.music} onChange={(e) => set({ music: e.target.value.trim() })} maxLength={400} placeholder="https://…/our-song.mp3" /></div>
            </div>
            {!ready && <p className="kn-wz__hint">{t(lang, wizard.errFill)}</p>}
          </form>

          <div className="kn-ks__actions">
            <button type="button" className="kn-btn" onClick={openDemo} disabled={!ready} title={ready ? t(lang, wizard.demoHint) : t(lang, wizard.errFill)}><Icon name="film" size={16} /> {t(lang, wizard.demo)}</button>
            <button type="button" className="kn-btn kn-btn--ghost" onClick={() => setTab("animation")}>{t(lang, C.animTab)}</button>
          </div>
          <LinkPanel lang={lang} tpl={tpl} blob={blob} ready={ready} photo={photos[0] ?? null} />
          <p className="kn-ks__order"><Link href={orderHref} className="kn-btn kn-btn--ghost">{t(lang, wizard.order)} <Icon name="arrow" size={14} /></Link></p>
          <ul className="kn-ks__bullets">{C.bullets.map((b, i) => <li key={i}><Icon name="check" size={14} /> {t(lang, b)}</li>)}</ul>
        </aside>
      </div>

      {/* --------------------------------------------- MATCHING COMPONENTS */}
      <section className="kn-ws__match" aria-label={t(lang, C.matching)}>
        <h2 className="kn-h2">{t(lang, C.matching)}</h2>
        <ul className="kn-ws__matchList">
          {card.matching.map((m) => (
            <li key={m}>
              <div className={`kn-ws__matchCard${card.shape === "landscape" ? " kn-ws__matchCard--land" : ""}`}><WCardFace card={card} variant={variant} lang={lang} mode={m} {...face} /></div>
              <p>{t(lang, m === "saveTheDate" ? C.saveTheDate : m === "thankYou" ? C.thankYou : m === "details" ? C.detailsCard : C.rsvpCard)}</p>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="kn-ks__more" aria-label={t(lang, C.more)}>
          <h2 className="kn-h2">{t(lang, C.more)}</h2>
          <ul className="kn-kids__grid kn-kids__grid--4">
            {related.map((c) => (
              <li key={c.id} className="kn-kids__it">
                <Link href={`${base}/wedding-cards/${c.id}`} className="kn-kids__tileLink" aria-label={t(lang, c.name)}><WTile card={c} variant={c.variants[0]} lang={lang} face={{ a: s.a || undefined, b: s.b || undefined }} /></Link>
                <div className="kn-kids__meta"><Link href={`${base}/wedding-cards/${c.id}`} className="kn-kids__name">{t(lang, c.name)}</Link></div>
              </li>
            ))}
          </ul>
          <p><Link href={`${base}/wedding-cards`} className="kn-btn kn-btn--ghost">{t(lang, C.backAll)}</Link></p>
        </section>
      )}

      {demo && <DemoModal lang={lang} href={demoHref} onClose={() => setDemo(false)} />}
    </div>
  );
}
