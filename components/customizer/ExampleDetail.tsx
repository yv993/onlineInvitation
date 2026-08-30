"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Icon from "@/components/Icon";
import WCardFace from "@/components/wcards/WCardFace";
import { encodeDraft, type Draft } from "@/lib/draft";
import type { Face } from "./ExampleThumb";
import { examples as C, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { priceLabel, styleLetter, tierName, type Example } from "@/lib/examples";
import { FEAT_ICON, KIND_ICON } from "./ExampleCard";

// ============================================================================
// THE DETAIL WINDOW — one example, in full, without leaving the page.
//
// Left, the real guest page in a phone frame (the same /invitation/<id> URL a
// guest opens; with the wizard's draft when there is one, the sample before).
// Right, everything a couple weighs: kind, name, what it was measured against,
// the price line, what is included, the section order top to bottom, the
// sample couple — and the verbs: choose it, open it full-page, order with it,
// open the card studio. ‹ › and the arrow keys walk the grid; Esc closes;
// focus lands on ✕ and returns where it was; the page behind stops scrolling.
// Portalled to <body> — the wizard column is a stacking context under the nav.
// ============================================================================

export default function ExampleDetail({ lang, list, index, onIndex, onClose, chosenId, onChoose, chooseHref, blob, editable = false, face }: {
  lang: Lang; list: Example[]; index: number; onIndex: (i: number) => void; onClose: () => void;
  chosenId?: string; onChoose?: (id: string) => void; chooseHref?: (id: string) => string; blob?: string;
  /** the fill-in panel: every word the card face prints, editable in place.
   *  Only offered where the window was opened from a showcase (the wizard's
   *  picker keeps its own fields - two writers on one draft would fight). */
  editable?: boolean;
  /** what the visitor already typed on the chapter, so the window opens
   *  mid-thought instead of empty */
  face?: Face;
}) {
  const e = list[index];
  // the ten words a card can print - kept ACROSS the arrows on purpose:
  // type your names once, then flip the pile wearing them
  const [f, setF] = useState<Face & { address?: string; rsvpBy?: string; host?: string; note?: string }>(() => ({
    a: face?.a, b: face?.b, date: face?.date,
  }));
  const up = (k: string) => (ev: React.ChangeEvent<HTMLInputElement>) => setF((prev) => ({ ...prev, [k]: ev.target.value }));
  const touched = Boolean(f.a || f.b || f.date || f.time || f.venue || f.address || f.city || f.rsvpBy || f.host || f.note);
  // the same ?p= blob every guest link speaks - decodeDraft on the other side
  // re-sanitises per field, so this carries words, never markup
  const myBlob = useMemo(() => {
    if (!editable || !e?.card || !touched) return blob;
    const d: Draft = {
      a: (f.a ?? "").trim(), b: (f.b ?? "").trim(), date: f.date ?? "", time: f.time ?? "",
      city: (f.city ?? "").trim(), stops: [], occasion: "wedding",
      ...(f.venue?.trim() ? { venue: f.venue.trim() } : {}),
      ...(f.address?.trim() ? { address: f.address.trim() } : {}),
      ...(f.rsvpBy ? { rsvpBy: f.rsvpBy } : {}),
      ...(f.host?.trim() ? { host: f.host.trim() } : {}),
      ...(f.note?.trim() ? { note: f.note.trim() } : {}),
    };
    return encodeDraft(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, e?.card, touched, f, blob]);
  const base = lang === "hy" ? "" : "/en";
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const prev = () => onIndex((index - 1 + list.length) % list.length);
  const next = () => onIndex((index + 1) % list.length);
  useEffect(() => {
    const was = document.activeElement as HTMLElement | null;
    const scroll = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
      if (ev.key === "ArrowLeft") prev();
      if (ev.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = scroll; was?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, index, list.length]);
  if (!e) return null;
  const href = `${base}/invitation/${e.id}${myBlob ? `?p=${myBlob}` : ""}`;
  const orderHref = `${base}/order?style=${e.id}&occasion=${e.occasion}${myBlob ? `&p=${myBlob}` : ""}`;
  // Choose carries the words too - the wizard opens already knowing them
  const buildHref = chooseHref ? `${chooseHref(e.id)}${myBlob && myBlob !== blob ? `&p=${myBlob}` : ""}` : undefined;
  const chosen = chosenId === e.id;
  const letter = styleLetter(e);
  return createPortal(
    <div className="kn-exd" role="dialog" aria-modal="true" aria-labelledby="kn-exd-title">
      <div className="kn-exd__back" onClick={onClose} />
      <div className="kn-exd__box">
        <div className="kn-exd__bar">
          <span className="kn-exd__kind"><Icon name={KIND_ICON[e.kind]} size={14} /> {t(lang, C.kinds[e.kind])}{letter ? ` · ${lang === "hy" ? "Ոճ" : "Style"} ${letter}` : ""}</span>
          <span className="kn-exd__count">{index + 1} {t(lang, C.of)} {list.length}</span>
          <span className="kn-exd__nav">
            <button type="button" className="kn-exd__arrow" onClick={prev} aria-label={t(lang, C.prev)} disabled={list.length < 2}><Icon name="chevron" size={16} className="kn-wz__flip" /></button>
            <button type="button" className="kn-exd__arrow" onClick={next} aria-label={t(lang, C.next)} disabled={list.length < 2}><Icon name="chevron" size={16} /></button>
          </span>
          <button ref={closeRef} type="button" className="kn-exd__x" onClick={onClose} aria-label={t(lang, C.close)}><Icon name="x" size={18} /></button>
        </div>
        <div className="kn-exd__body" data-lenis-prevent>
          <div className="kn-exd__stage">
            {editable && e.card ? (
              /* the card ITSELF, not an iframe: it re-renders on every
                 keystroke, which a reloading frame could never do calmly.
                 The envelope version is one click away on "Open full page". */
              <div className="kn-exd__facewrap">
                <WCardFace card={e.card.card} variant={e.card.variant} lang={lang}
                  a={f.a} b={f.b} date={f.date} time={f.time} venue={f.venue}
                  address={f.address} city={f.city} rsvpBy={f.rsvpBy} host={f.host} note={f.note}
                  className="kn-exd__face" />
              </div>
            ) : (
              <div className="kn-exd__phone"><iframe key={href} className="kn-exd__frame" src={href} title={`${t(lang, e.name)} — ${t(lang, C.detailTitle)}`} loading="lazy" /></div>
            )}
            <p className="kn-exd__live"><Icon name="film" size={13} /> {t(lang, C.liveNote)}</p>
          </div>
          <div className="kn-exd__info">
            <h2 className="kn-exd__name" id="kn-exd-title">{t(lang, e.name)}</h2>
            <p className="kn-exd__tag">{t(lang, e.tagline)}</p>
            {editable && e.card && (
              <div className="kn-exd__fill">
                <p className="kn-label">{t(lang, C.cardFill.title)}</p>
                <div className="kn-exd__fillGrid">
                  <label><span className="kn-f__label">{t(lang, C.cardFill.a)}</span><input className="kn-f__in" value={f.a ?? ""} onChange={up("a")} maxLength={40} /></label>
                  <label><span className="kn-f__label">{t(lang, C.cardFill.b)}</span><input className="kn-f__in" value={f.b ?? ""} onChange={up("b")} maxLength={40} /></label>
                  <label><span className="kn-f__label">{t(lang, C.cardFill.date)}</span><input className="kn-f__in" type="date" value={f.date ?? ""} onChange={up("date")} /></label>
                  <label><span className="kn-f__label">{t(lang, C.cardFill.time)}</span><input className="kn-f__in" type="time" value={f.time ?? ""} onChange={up("time")} /></label>
                  <label><span className="kn-f__label">{t(lang, C.cardFill.venue)}</span><input className="kn-f__in" value={f.venue ?? ""} onChange={up("venue")} maxLength={80} /></label>
                  <label><span className="kn-f__label">{t(lang, C.cardFill.city)}</span><input className="kn-f__in" value={f.city ?? ""} onChange={up("city")} maxLength={40} /></label>
                  <label className="kn-exd__fillWide"><span className="kn-f__label">{t(lang, C.cardFill.address)}</span><input className="kn-f__in" value={f.address ?? ""} onChange={up("address")} maxLength={120} /></label>
                  <label><span className="kn-f__label">{t(lang, C.cardFill.rsvpBy)}</span><input className="kn-f__in" type="date" value={f.rsvpBy ?? ""} onChange={up("rsvpBy")} /></label>
                  <label><span className="kn-f__label">{t(lang, C.cardFill.host)}</span><input className="kn-f__in" value={f.host ?? ""} onChange={up("host")} maxLength={60} /></label>
                  <label className="kn-exd__fillWide"><span className="kn-f__label">{t(lang, C.cardFill.note)}</span><input className="kn-f__in" value={f.note ?? ""} onChange={up("note")} maxLength={200} /></label>
                </div>
                <p className="kn-exd__fillHint">{t(lang, C.cardFill.hint)}</p>
              </div>
            )}
            <p className="kn-exd__after"><span>{t(lang, C.afterLabel)}:</span> {t(lang, e.after)}</p>
            <div className="kn-exd__price">
              <b>{priceLabel(e)}</b>
              <small>{t(lang, tierName(e.tier))} · {t(lang, C.terms)}</small>
            </div>
            <p className="kn-label">{t(lang, C.includes)}</p>
            <ul className="kn-exd__feats">
              {e.features.map((f) => <li key={f}>{FEAT_ICON[f] && <Icon name={FEAT_ICON[f]!} size={12} />} {t(lang, C.feats[f])}</li>)}
            </ul>
            <p className="kn-label">{t(lang, C.sectionOrder)}</p>
            <ol className="kn-exd__anat">{e.anatomy.map((a, i) => <li key={i}>{t(lang, a)}</li>)}</ol>
            <p className="kn-exd__sample"><span>{t(lang, C.sampleNote)}:</span> {t(lang, e.sample.a)}{e.sample.b ? ` ${lang === "hy" ? "և" : "&"} ${t(lang, e.sample.b)}` : ""}</p>
            <div className="kn-exd__acts">
              {onChoose ? (
                <button type="button" className={`kn-btn${chosen ? " kn-btn--on" : ""}`} onClick={() => { onChoose(e.id); }} aria-pressed={chosen}>
                  <Icon name="check" size={14} /> {t(lang, chosen ? C.chosenThis : C.chooseThis)}
                </button>
              ) : chooseHref ? (
                <Link className="kn-btn" href={buildHref!}>{t(lang, C.buildWith)} <Icon name="arrow" size={14} /></Link>
              ) : null}
              <a className="kn-btn kn-btn--ghost" href={href} target="_blank" rel="noopener">{t(lang, C.openFull)} <Icon name="arrow" size={14} /></a>
              <Link className="kn-btn kn-btn--ghost" href={orderHref}>{t(lang, C.orderWith)}</Link>
              {e.studio && <Link className="kn-btn kn-btn--ghost" href={`${base}${e.studio}`}>{t(lang, C.openStudio)}</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
