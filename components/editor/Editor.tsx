"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import PhotoPicker from "@/components/ui/PhotoPicker";
import TrackPicker from "@/components/ui/TrackPicker";
import LinkPanel from "@/components/customizer/LinkPanel";
import { ShareChecklist } from "@/components/customizer/EventWizard";
import { WizardProvider, useWizard } from "@/components/customizer/WizardContext";
import { findTemplate } from "@/lib/templates";
import { findExample, priceLabel, tierName } from "@/lib/examples";
import { phoneStrips } from "@/lib/phoneStrips";
import { phoneShots } from "@/lib/phoneShots";
import { editor as E, receptionHeads, wizard, examples as EX, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// THE EDITOR — /edit?tpl=…, the sectioned single-page builder, matched to the
// reference editor's five screens attribute for attribute (2026-08-27): the
// two-row top (site nav above, then ← · template chip · ⚙ · centered
// Edit/Preview pill · Publish), icon-led section headers with a labelled
// Show switch, the Default-toggled event heading with its "using the
// template's wording" tip, labelled family fields, tip boxes, dashed empty
// states, full-width outlined add buttons, and the big share-preview card.
// The five-step wizard remains at /customize — this is the other door into
// the SAME WizardContext state.
//
// EVERY SWITCH IS TRUTHFUL: a toggle exists only where the guest page
// actually changes. PREVIEW is a real mode at every width — it hides the
// form and hands the whole stage to the live invitation.
// ============================================================================

export default function Editor({ lang, initialTpl }: { lang: Lang; initialTpl?: string }) {
  return (
    <WizardProvider lang={lang} initialCategory="wedding" initialTpl={initialTpl}>
      <EditorInner lang={lang} />
    </WizardProvider>
  );
}

/** one section: chevron + icon + title, optional labelled switch, foldable body */
function Section({ icon, title, on, onToggle, swLabel, children, defaultOpen = true }: {
  icon: string;
  title: string;
  /** undefined = no switch; boolean = the switch's state */
  on?: boolean;
  onToggle?: (next: boolean) => void;
  swLabel?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`kn-ed__sec${on === false ? " is-off" : ""}`}>
      <header className="kn-ed__head">
        <button type="button" className="kn-ed__fold" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <Icon name="chevron" size={14} className={open ? "kn-ed__chev is-open" : "kn-ed__chev"} />
          <Icon name={icon} size={15} className="kn-ed__secIc" />
          <b>{title}</b>
        </button>
        {on !== undefined && onToggle && (
          <span className="kn-ed__swWrap">
            {swLabel && <small className="kn-ed__swL">{swLabel}</small>}
            <button type="button" role="switch" aria-checked={on} className={`kn-ed__sw${on ? " is-on" : ""}`} onClick={() => onToggle(!on)}>
              <i aria-hidden="true" />
            </button>
          </span>
        )}
      </header>
      {open && <div className="kn-ed__body">{children}</div>}
    </section>
  );
}

function Seg<V extends string>({ value, options, onPick, full }: { value: V; options: Array<[V, string]>; onPick: (v: V) => void; full?: boolean }) {
  return (
    <div className={`kn-ed__seg${full ? " kn-ed__seg--full" : ""}`} role="radiogroup">
      {options.map(([v, label]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onPick(v)}>{label}</button>
      ))}
    </div>
  );
}

/** the reference's lightbulb tip box */
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="kn-ed__tip">
      <Icon name="bulb" size={15} className="kn-ed__tipIc" />
      <span>{children}</span>
    </div>
  );
}

function EditorInner({ lang }: { lang: Lang }) {
  const w = useWizard();
  const { s, set, patch, setStop, addStop, removeStop, blob, ready } = w;
  const base = lang === "hy" ? "" : "/en";
  const [publishOpen, setPublishOpen] = useState(false);
  const tp = findTemplate(s.tpl);
  const pick = findExample(s.tpl);
  const show = s.show ?? {};
  const setShow = (k: keyof NonNullable<typeof s.show>, v: boolean) => set({ show: { ...show, [k]: v ? undefined : false } as typeof s.show });
  const isOn = (k: keyof NonNullable<typeof s.show>) => show[k] !== false;
  const inp = "kn-f__in";
  const showL = t(lang, E.show);

  // welcome & dinner ride the programme as two named stops
  const wl = t(lang, E.welcomeL), dl = t(lang, E.dinnerL);
  const namedStop = (name: string) => s.stops.find((x) => x.name === name);
  const wOn = Boolean(namedStop(wl) || namedStop(dl));
  const setNamed = (name: string, time: string) => patch((cur) => {
    const i = cur.stops.findIndex((x) => x.name === name);
    if (i >= 0) return { stops: cur.stops.map((x, j) => (j === i ? { ...x, time } : x)) };
    return { stops: [...cur.stops, { time, name, place: cur.venue ?? "", address: "" }].slice(0, 6) };
  });
  const toggleWelcome = (on: boolean) => patch((cur) => on
    ? { stops: [...cur.stops, { time: "17:00", name: wl, place: cur.venue ?? "", address: "" }, { time: "19:00", name: dl, place: cur.venue ?? "", address: "" }].slice(0, 6) }
    : { stops: cur.stops.filter((x) => x.name !== wl && x.name !== dl) });

  // the guestbook row shows the real count once this browser has minted a link
  const [wishCount, setWishCount] = useState<number | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kn-my-links");
      if (!raw) return;
      const list = JSON.parse(raw) as Array<{ id: string; tpl: string }>;
      const mine = list.filter((x) => x && x.tpl === s.tpl);
      const last = mine[mine.length - 1];
      if (!last) return;
      fetch(`/api/wishes?event=${encodeURIComponent(last.id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { wishes?: unknown[] } | null) => { if (d && Array.isArray(d.wishes)) setWishCount(d.wishes.length); })
        .catch(() => {});
    } catch { /* no list is a fine answer */ }
  }, [s.tpl]);

  if (!tp) return null;
  // PREVIEW opens the real guest page — the demo route with the draft overlaid
  const demoHref = `${base}/invitation/${s.tpl}${blob ? `?p=${blob}` : ""}`;
  const chipShot = phoneStrips[s.tpl] ?? phoneShots[s.tpl] ?? tp.cover;
  // heading: Default OFF = the couple's own wording (an input); ON = the template's
  const headingCustom = s.heading !== undefined;

  return (
    <div className="kn-ed">
      {/* ------------------------------------------------------- TOP BAR */}
      <div className="kn-ed__bar">
        <Link className="kn-ed__backB" href={`${base}/templates`} aria-label={t(lang, E.back)}><Icon name="chevron" size={16} className="kn-wz__flip" /></Link>
        {/* the template chip — thumbnail, name, caret; the door back to the catalogue */}
        <Link className="kn-ed__chipT" href={`${base}/templates`} title={t(lang, E.switchTpl)}>
          <Image src={chipShot} alt="" fill sizes="150px" draggable={false} />
          <span><b>{t(lang, tp.name)}</b><Icon name="chevron" size={12} className="kn-ed__chipCaret" /></span>
        </Link>
        <button type="button" className="kn-ed__gear" aria-label={t(lang, E.settingsL)} onClick={() => setPublishOpen(true)}><Icon name="gear" size={17} /></button>
        {pick && <span className="kn-ed__price">{priceLabel(pick)} <small>· {t(lang, tierName(pick.tier))}</small></span>}
        <div className="kn-ed__tabs">
          <span className="kn-ed__tabOn" aria-current="page"><Icon name="check" size={13} /> {t(lang, E.edit)}</span>
          <a href={demoHref} target="_blank" rel="noopener"><Icon name="film" size={13} /> {t(lang, E.preview)}</a>
        </div>
        <button type="button" className="kn-btn kn-ed__publish" onClick={() => setPublishOpen(true)}>{t(lang, E.publish)}</button>
      </div>

      <div className="kn-ed__grid">
        {/* -------------------------------------------------- THE COLUMN */}
        <div className="kn-ed__col">
          {/* 1 basic information */}
          <Section icon="heart" title={t(lang, E.basic)}>
            <div className="kn-ed__row kn-ed__row--head">
              <label className="kn-f__label" htmlFor="ed-head">{t(lang, E.headingL)}</label>
              <span className="kn-ed__swWrap">
                <small className="kn-ed__swL">{t(lang, E.defaultL)}</small>
                <button type="button" role="switch" aria-checked={headingCustom} className={`kn-ed__sw${headingCustom ? " is-on" : ""}`}
                  onClick={() => set({ heading: headingCustom ? undefined : "" })}><i aria-hidden="true" /></button>
              </span>
            </div>
            {headingCustom ? (
              <>
                <input id="ed-head" className={inp} value={s.heading ?? ""} onChange={(e) => set({ heading: e.target.value })} maxLength={60} placeholder={t(lang, tp.event.kicker)} />
                <p className="kn-ed__note">{t(lang, E.headingNote)}</p>
              </>
            ) : (
              <Tip>{t(lang, E.usingTpl)}<br /><b>“{t(lang, tp.event.kicker)}”</b></Tip>
            )}
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-a">{t(lang, E.groomFull)}</label>
                <input id="ed-a" className={inp} value={s.a} onChange={(e) => set({ a: e.target.value })} maxLength={30} placeholder={t(lang, tp.event.a)} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-b">{t(lang, E.brideFull)}</label>
                <input id="ed-b" className={inp} value={s.b} onChange={(e) => set({ b: e.target.value })} maxLength={30} placeholder={tp.event.b ? t(lang, tp.event.b) : ""} /></div>
            </div>
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-sa">{t(lang, E.groomShort)}</label>
                <span className="kn-ed__inWrap">
                  <input id="ed-sa" className={inp} value={s.shortA ?? ""} onChange={(e) => set({ shortA: e.target.value })} maxLength={20} />
                  <button type="button" className="kn-ed__reset" aria-label={t(lang, E.clearL)} disabled={!s.shortA} onClick={() => set({ shortA: undefined })}><Icon name="reset" size={13} /></button>
                </span></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-sb">{t(lang, E.brideShort)}</label>
                <span className="kn-ed__inWrap">
                  <input id="ed-sb" className={inp} value={s.shortB ?? ""} onChange={(e) => set({ shortB: e.target.value })} maxLength={20} />
                  <button type="button" className="kn-ed__reset" aria-label={t(lang, E.clearL)} disabled={!s.shortB} onClick={() => set({ shortB: undefined })}><Icon name="reset" size={13} /></button>
                </span></div>
            </div>
            <p className="kn-ed__note">{t(lang, E.shortNote)}</p>
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-ra">{t(lang, E.roleG)}</label>
                <input id="ed-ra" className={inp} value={s.roleA ?? ""} onChange={(e) => set({ roleA: e.target.value })} maxLength={24} placeholder={lang === "hy" ? "Փեսա" : "The groom"} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-rb">{t(lang, E.roleB)}</label>
                <input id="ed-rb" className={inp} value={s.roleB ?? ""} onChange={(e) => set({ roleB: e.target.value })} maxLength={24} placeholder={lang === "hy" ? "Հարս" : "The bride"} /></div>
            </div>
            <p className="kn-ed__cap">{t(lang, E.displayOrder)}</p>
            <Seg full value={s.familyFirst ?? "groom"} onPick={(v) => set({ familyFirst: v })} options={[["groom", t(lang, E.famFirstG)], ["bride", t(lang, E.famFirstB)]]} />
            <p className="kn-ed__note">{t(lang, E.famFirstNote)}</p>
          </Section>

          {/* 2 hero photo + gallery — one picker, the first is the cover */}
          <Section icon="film" title={`${t(lang, E.heroPhoto)} · ${t(lang, E.gallery)}`} on={isOn("gallery")} onToggle={(v) => setShow("gallery", v)} swLabel={showL}>
            <p className="kn-ed__cap">{t(lang, E.layoutL)}</p>
            <Seg full value={s.galleryKind ?? (tp.blocks.gallery === "masonry" ? "masonry" : tp.blocks.gallery === "ring" ? "ring" : "grid")} onPick={(v) => set({ galleryKind: v })}
              options={[["grid", t(lang, E.layoutGrid)], ["masonry", t(lang, E.layoutMasonry)], ["ring", t(lang, E.layout3d)]]} />
            <p className="kn-ed__note">{s.galleryKind === "ring" ? t(lang, E.layout3dNote) : t(lang, E.layoutNote)}</p>
            <p className="kn-ed__note">{t(lang, E.heroPhotoNote)} {t(lang, E.galleryNote)}</p>
            <PhotoPicker lang={lang} value={s.photos} onChange={(next: string[]) => set({ photos: next })} label={wizard.photos} />
          </Section>

          {/* 3 family information */}
          <Section icon="users" title={t(lang, E.family)} on={isOn("family")} onToggle={(v) => setShow("family", v)} swLabel={showL}>
            <p className="kn-ed__note">{t(lang, E.familyNote)}</p>
            {([["G", t(lang, E.groomFam)], ["B", t(lang, E.brideFam)]] as const).map(([sideKey, label]) => {
              const g = sideKey === "G";
              return (
                <div className="kn-ed__fam" key={sideKey}>
                  <p className="kn-ed__famCap">{label}</p>
                  <label className="kn-f__label" htmlFor={`ed-pt${sideKey}`}>{t(lang, E.parentTitle)}</label>
                  <input id={`ed-pt${sideKey}`} className={inp} value={(g ? s.ptG : s.ptB) ?? ""} onChange={(e) => set(g ? { ptG: e.target.value } : { ptB: e.target.value })} maxLength={32} placeholder={lang === "hy" ? "Տեր և տիկին" : "Mr & Mrs"} />
                  <div className="kn-build__pair" style={{ marginTop: "0.45rem" }}>
                    <div className="kn-f"><label className="kn-f__label" htmlFor={`ed-f${sideKey}`}>{t(lang, E.father)}</label>
                      <input id={`ed-f${sideKey}`} className={inp} value={(g ? s.parents?.gf : s.parents?.bf) ?? ""} onChange={(e) => set({ parents: { ...s.parents, [g ? "gf" : "bf"]: e.target.value } })} maxLength={40} /></div>
                    <div className="kn-f"><label className="kn-f__label" htmlFor={`ed-m${sideKey}`}>{t(lang, E.mother)}</label>
                      <input id={`ed-m${sideKey}`} className={inp} value={(g ? s.parents?.gm : s.parents?.bm) ?? ""} onChange={(e) => set({ parents: { ...s.parents, [g ? "gm" : "bm"]: e.target.value } })} maxLength={40} /></div>
                  </div>
                  <label className="kn-f__label" htmlFor={`ed-ad${sideKey}`} style={{ marginTop: "0.45rem" }}>{t(lang, E.famAddr)}</label>
                  <textarea id={`ed-ad${sideKey}`} className={`${inp} kn-ed__ta`} rows={2} value={(g ? s.famAG : s.famAB) ?? ""} onChange={(e) => set(g ? { famAG: e.target.value } : { famAB: e.target.value })} maxLength={120} />
                </div>
              );
            })}
          </Section>

          {/* 4 opening message */}
          <Section icon="bubble" title={t(lang, E.opening)} on={isOn("announce")} onToggle={(v) => setShow("announce", v)} swLabel={showL}>
            <label className="kn-f__label" htmlFor="ed-open">{t(lang, E.openLbl)}</label>
            <textarea id="ed-open" className={`${inp} kn-ed__ta`} rows={3} value={s.announce ?? ""} onChange={(e) => set({ announce: e.target.value })} maxLength={160}
              placeholder={lang === "hy" ? "Ուրախությամբ հայտնում ենք մեր զավակների ամուսնության մասին" : "With joyful hearts we announce the wedding of our children"} />
            <p className="kn-ed__note">{t(lang, E.openingNote)}</p>
          </Section>

          {/* 5 ceremony: heading + the programme */}
          <Section icon="clock" title={t(lang, E.ceremony)}>
            <label className="kn-f__label" htmlFor="ed-ch">{t(lang, E.ceremonyHeadL)}</label>
            <input id="ed-ch" className={inp} value={s.ceremonyHead ?? ""} onChange={(e) => set({ ceremonyHead: e.target.value })} maxLength={40} placeholder={lang === "hy" ? "ՈՐՏԵՂ" : "CEREMONY INFO"} />
            <p className="kn-ed__note">{t(lang, E.ceremonyHeadNote)}</p>
            <Tip>{t(lang, E.ceremonyAsk)}</Tip>
            <p className="kn-f__label" style={{ marginTop: "0.4rem" }}>{t(lang, E.programme)}</p>
            {s.stops.map((st, i) => (
              <div className="kn-ed__stop" key={i}>
                <input className={inp} type="time" value={st.time} onChange={(e) => setStop(i, { time: e.target.value })} aria-label={t(lang, E.stopTime)} />
                <input className={inp} value={st.name} onChange={(e) => setStop(i, { name: e.target.value })} maxLength={40} placeholder={t(lang, E.stopName)} aria-label={t(lang, E.stopName)} />
                <input className={inp} value={st.place} onChange={(e) => setStop(i, { place: e.target.value })} maxLength={60} placeholder={t(lang, E.stopPlace)} aria-label={t(lang, E.stopPlace)} />
                <button type="button" className="kn-wz__swRm kn-wz__giftRm" aria-label={t(lang, wizard.giftRemove)} onClick={() => removeStop(i)}><Icon name="x" size={11} /></button>
              </div>
            ))}
            {s.stops.length < 6 && <button type="button" className="kn-ed__add" onClick={addStop}>+ {t(lang, E.addStop)}</button>}
          </Section>

          {/* 6 the reception: date, time, clock face, countdown, address, map */}
          <Section icon="calendar" title={t(lang, E.reception)}>
            <Seg full value={s.receptionKind ?? "wedding"} onPick={(v) => set({ receptionKind: v })}
              options={[["wedding", t(lang, receptionHeads.wedding)], ["party", t(lang, receptionHeads.party)], ["engagement", t(lang, receptionHeads.engagement)]]} />
            <p className="kn-ed__note">{t(lang, E.recKindNote)}</p>
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-date">{t(lang, E.eventDate)}</label>
                <input id="ed-date" className={inp} type="date" value={s.date} onChange={(e) => set({ date: e.target.value })} min="2026-01-01" max="2030-12-31" /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-time">{t(lang, E.eventTime)}</label>
                <input id="ed-time" className={inp} type="time" value={s.time} onChange={(e) => set({ time: e.target.value })} step={300} /></div>
            </div>
            <p className="kn-ed__cap">{t(lang, E.timeFormat)}</p>
            <Seg full value={s.ampm ? "ampm" : "h24"} onPick={(v) => set({ ampm: v === "ampm" ? true : undefined })} options={[["h24", t(lang, E.clock24)], ["ampm", t(lang, E.clockAmPm)]]} />
            <p className="kn-ed__note">{t(lang, E.clockNote)}</p>
            <div className="kn-ed__row">
              <span className="kn-f__label">{t(lang, E.welcomeTimes)}</span>
              <span className="kn-ed__swWrap"><small className="kn-ed__swL">{showL}</small>
                <button type="button" role="switch" aria-checked={wOn} className={`kn-ed__sw${wOn ? " is-on" : ""}`} onClick={() => toggleWelcome(!wOn)}><i aria-hidden="true" /></button></span>
            </div>
            <p className="kn-ed__note">{t(lang, E.welcomeTimesNote)}</p>
            {wOn && (
              <div className="kn-build__pair">
                <div className="kn-f"><label className="kn-f__label" htmlFor="ed-wt">{wl}</label>
                  <input id="ed-wt" className={inp} type="time" value={namedStop(wl)?.time ?? ""} onChange={(e) => setNamed(wl, e.target.value)} /></div>
                <div className="kn-f"><label className="kn-f__label" htmlFor="ed-dt">{dl}</label>
                  <input id="ed-dt" className={inp} type="time" value={namedStop(dl)?.time ?? ""} onChange={(e) => setNamed(dl, e.target.value)} /></div>
              </div>
            )}
            <div className="kn-ed__row">
              <span className="kn-f__label">{t(lang, E.countdown)}</span>
              <span className="kn-ed__swWrap"><small className="kn-ed__swL">{showL}</small>
                <button type="button" role="switch" aria-checked={isOn("countdown")} className={`kn-ed__sw${isOn("countdown") ? " is-on" : ""}`} onClick={() => setShow("countdown", !isOn("countdown"))}><i aria-hidden="true" /></button></span>
            </div>
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-venue">{t(lang, E.venueL)}</label>
                <input id="ed-venue" className={inp} value={s.venue ?? ""} onChange={(e) => set({ venue: e.target.value })} maxLength={60} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-city">{t(lang, E.cityL)}</label>
                <input id="ed-city" className={inp} value={s.city} onChange={(e) => set({ city: e.target.value })} maxLength={40} /></div>
            </div>
            <label className="kn-f__label" htmlFor="ed-addr">{t(lang, E.addressL)}</label>
            <textarea id="ed-addr" className={`${inp} kn-ed__ta`} rows={2} value={s.address ?? ""} onChange={(e) => set({ address: e.target.value })} maxLength={80} />
            <div className="kn-ed__row">
              <span className="kn-f__label">{t(lang, E.mapL)}</span>
              <span className="kn-ed__swWrap"><small className="kn-ed__swL">{showL}</small>
                <button type="button" role="switch" aria-checked={isOn("map")} className={`kn-ed__sw${isOn("map") ? " is-on" : ""}`} onClick={() => setShow("map", !isOn("map"))}><i aria-hidden="true" /></button></span>
            </div>
            {isOn("map") && (<>
              <input className={inp} type="url" inputMode="url" value={s.map ?? ""} onChange={(e) => set({ map: e.target.value.trim() })} maxLength={400} placeholder="https://maps.app.goo.gl/…" aria-label={t(lang, E.mapL)} />
              <p className="kn-ed__note">{t(lang, E.mapNote)}</p>
            </>)}
          </Section>

          {/* 7 RSVP */}
          <Section icon="mail" title={t(lang, E.rsvp)} on={isOn("rsvp")} onToggle={(v) => setShow("rsvp", v)} swLabel={showL}>
            <Tip>{t(lang, E.rsvpNote)}</Tip>
            <p className="kn-ed__cap">{t(lang, E.displayStyle)}</p>
            <Seg full value={s.rsvpKind ?? (tp.blocks.rsvp === "modal" ? "modal" : "inline")} onPick={(v) => set({ rsvpKind: v })} options={[["modal", t(lang, E.rsvpBtn)], ["inline", t(lang, E.rsvpInline)]]} />
            <p className="kn-ed__cap">{t(lang, E.addQCap)}</p>
            <p className="kn-ed__note">{t(lang, E.addQNote)}</p>
            {(s.questions ?? []).map((q, i) => (
              <div className="kn-ed__qRow" key={i}>
                <input className={inp} value={q} onChange={(e) => set({ questions: (s.questions ?? []).map((x, j) => (j === i ? e.target.value : x)) })} maxLength={80} placeholder={t(lang, E.qPh)} aria-label={`${t(lang, E.addQuestion)} ${i + 1}`} />
                <button type="button" className="kn-wz__swRm kn-wz__giftRm" aria-label={t(lang, wizard.giftRemove)} onClick={() => set({ questions: (s.questions ?? []).filter((_, j) => j !== i) })}><Icon name="x" size={11} /></button>
              </div>
            ))}
            {(s.questions ?? []).length < 3 && (
              <button type="button" className="kn-ed__add" onClick={() => set({ questions: [...(s.questions ?? []), ""] })}>+ {t(lang, E.addQuestion)}</button>
            )}
            <label className="kn-f__label" htmlFor="ed-rsvpby" style={{ marginTop: "0.6rem" }}>{t(lang, E.rsvpBy)}</label>
            <input id="ed-rsvpby" className={inp} type="date" value={s.rsvpBy ?? ""} onChange={(e) => set({ rsvpBy: e.target.value })} max={s.date || undefined} />
          </Section>

          {/* 8 dress code */}
          <Section icon="seal" title={t(lang, E.dress)} on={isOn("dress")} onToggle={(v) => setShow("dress", v)} swLabel={showL}>
            <p className="kn-ed__note">{t(lang, E.dressNote)}</p>
            <div className="kn-wz__swatches">
              {(s.dress ?? []).map((c, i) => (
                <label key={i} className="kn-wz__sw" style={{ "--sw": c } as React.CSSProperties}>
                  <input type="color" value={c} onChange={(e) => { const v = e.target.value.toUpperCase(); patch((cur) => ({ dress: (cur.dress ?? []).map((x, j) => (j === i ? v : x)) })); }} aria-label={`${t(lang, E.dress)} ${i + 1}`} />
                  <button type="button" className="kn-wz__swRm" aria-label={t(lang, wizard.giftRemove)} onClick={() => patch((cur) => ({ dress: (cur.dress ?? []).filter((_, j) => j !== i) }))}><Icon name="x" size={10} /></button>
                </label>
              ))}
              {(s.dress ?? []).length < 5 && (
                <button type="button" className="kn-wz__swAdd" onClick={() => patch((cur) => ({ dress: [...(cur.dress ?? []), "#B08D57"].slice(0, 5) }))}>{t(lang, wizard.addColor)}</button>
              )}
            </div>
          </Section>

          {/* 9 the day's schedule */}
          <Section icon="route" title={t(lang, E.schedule)} on={isOn("schedule")} onToggle={(v) => setShow("schedule", v)} swLabel={showL}>
            <p className="kn-ed__note">{t(lang, E.scheduleNote)}</p>
          </Section>

          {/* 10 guestbook */}
          <Section icon="bubble" title={t(lang, E.guestbook)} on={isOn("guestbook")} onToggle={(v) => setShow("guestbook", v)} swLabel={showL}>
            <Link className="kn-ed__wall" href={`${base}/my`}>
              <Icon name="bubble" size={16} />
              <span><b>{wishCount !== null ? `${wishCount} ${t(lang, E.wishesN)} · ${t(lang, E.wallManage)}` : t(lang, E.wallManage)}</b><small>{t(lang, E.guestbookNote)}</small></span>
              <Icon name="chevron" size={14} className="kn-ed__wallGo" />
            </Link>
          </Section>

          {/* 11 gift box */}
          <Section icon="gift" title={t(lang, E.gifts)} on={isOn("gifts")} onToggle={(v) => setShow("gifts", v)} swLabel={showL}>
            {(s.gifts ?? []).length === 0 && <div className="kn-ed__dash">{t(lang, E.giftsEmpty)}</div>}
            {(s.gifts ?? []).map((g, i) => (
              <div className="kn-wz__giftRow" key={i}>
                <input className={inp} value={g.label} onChange={(e) => set({ gifts: (s.gifts ?? []).map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} maxLength={24} placeholder={t(lang, wizard.giftLabelPh)} aria-label={t(lang, wizard.giftLabel)} />
                <input className={inp} value={g.value} onChange={(e) => set({ gifts: (s.gifts ?? []).map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} maxLength={80} placeholder="4318 27** **** 1234" aria-label={t(lang, wizard.giftValue)} />
                <input className={inp} value={g.note ?? ""} onChange={(e) => set({ gifts: (s.gifts ?? []).map((x, j) => (j === i ? { ...x, note: e.target.value } : x)) })} maxLength={90} placeholder={t(lang, wizard.giftNote)} aria-label={t(lang, wizard.giftNote)} />
                <button type="button" className="kn-wz__swRm kn-wz__giftRm" aria-label={t(lang, wizard.giftRemove)} onClick={() => set({ gifts: (s.gifts ?? []).filter((_, j) => j !== i) })}><Icon name="x" size={11} /></button>
              </div>
            ))}
            {(s.gifts ?? []).length < 3 && (
              <button type="button" className="kn-ed__add" onClick={() => set({ gifts: [...(s.gifts ?? []), { label: "", value: "" }] })}>+ {t(lang, wizard.giftAdd)}</button>
            )}
          </Section>

          {/* 12 thank-you note */}
          <Section icon="heart" title={t(lang, E.thanks)} on={isOn("thanks")} onToggle={(v) => setShow("thanks", v)} swLabel={showL}>
            <textarea className={`${inp} kn-ed__ta`} rows={2} value={s.thanks ?? ""} onChange={(e) => set({ thanks: e.target.value })} maxLength={200} placeholder={t(lang, E.thanksPh)} />
          </Section>

          {/* 13 background music */}
          <Section icon="music" title={t(lang, E.music)} on={isOn("music")} onToggle={(v) => setShow("music", v)} swLabel={showL}>
            <TrackPicker lang={lang} value={s.music ?? ""} onChange={(m) => set({ music: m })} label={wizard.music} hint={wizard.musicHint} />
          </Section>

          {/* 14 the envelope */}
          <Section icon="mail" title={t(lang, E.envelope)} on={isOn("envelope")} onToggle={(v) => setShow("envelope", v)} swLabel={showL}>
            <label className="kn-f__label" htmlFor="ed-greet">{t(lang, E.greetL)}</label>
            <input id="ed-greet" className={inp} value={s.greet ?? ""} onChange={(e) => set({ greet: e.target.value })} maxLength={60} placeholder={lang === "hy" ? "Սիրով հրավիրում ենք" : "Cordially invite"} />
            <p className="kn-ed__note">{t(lang, E.greetNote)}</p>
            <p className="kn-ed__note">{t(lang, E.greetNote2)}</p>
          </Section>

          {/* 15 the share preview */}
          <Section icon="share" title={t(lang, E.shareTitle)}>
            <p className="kn-ed__note">{t(lang, E.shareNote)}</p>
            <Seg full value={s.share ?? "envelope"} onPick={(v) => set({ share: v })} options={[["envelope", t(lang, E.shareEnv)], ["photo", t(lang, E.sharePhoto)]]} />
            {s.share === "photo" && s.photos.length === 0 && <p className="kn-ed__note">{t(lang, E.sharePhotoNote)}</p>}
            <p className="kn-ed__cap">{t(lang, E.previewCap)}</p>
            <div className="kn-ed__shareThumb" aria-hidden="true">
              {s.share === "photo" && s.photos[0]
                // the couple's own picture, exactly as the link card will crop it
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.photos[0]} alt="" />
                : (
                  <span className="kn-ed__shareCard">
                    <i>{[s.shortA || s.a || t(lang, tp.event.a), s.shortB || s.b || (tp.event.b ? t(lang, tp.event.b) : "")].filter(Boolean).join(" · ")}</i>
                    <span className="kn-ed__shareEnv">ԿՆԻՔ</span>
                  </span>
                )}
            </div>
            <p className="kn-ed__note">{t(lang, E.shareCache)}</p>
          </Section>
        </div>

      </div>

      {/* ------------------------------------------------- PUBLISH DRAWER */}
      {publishOpen && (
        <div className="kn-ed__pub" role="dialog" aria-modal="true" aria-label={t(lang, E.publish)}>
          <div className="kn-ed__pubBack" onClick={() => setPublishOpen(false)} />
          <div className="kn-ed__pubBox">
            <div className="kn-ed__pubBar">
              <b>{t(lang, E.publish)}</b>
              <button type="button" className="kn-exd__x" aria-label={t(lang, EX.close)} onClick={() => setPublishOpen(false)}><Icon name="x" size={16} /></button>
            </div>
            <ShareChecklist lang={lang} s={s} ready={ready} go={() => setPublishOpen(false)} />
            <LinkPanel lang={lang} tpl={s.tpl} blob={blob} ready={ready} />
            <p className="kn-ed__note" style={{ marginTop: "0.8rem" }}>
              <Link className="kn-btn kn-btn--ghost" href={`${base}/order?style=${s.tpl}&occasion=${s.occasion}${blob ? `&p=${blob}` : ""}`}>{t(lang, wizard.order)}</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
