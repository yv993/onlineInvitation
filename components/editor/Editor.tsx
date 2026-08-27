"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import TemplateView from "@/components/templates/TemplateView";
import PhotoPicker from "@/components/ui/PhotoPicker";
import TrackPicker from "@/components/ui/TrackPicker";
import LinkPanel from "@/components/customizer/LinkPanel";
import { ShareChecklist } from "@/components/customizer/EventWizard";
import { WizardProvider, useWizard, toDraft } from "@/components/customizer/WizardContext";
import { findTemplate } from "@/lib/templates";
import { findExample, priceLabel, tierName } from "@/lib/examples";
import { editor as E, wizard, examples as EX, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// THE EDITOR — /edit?tpl=…, the sectioned single-page builder, after the
// reference editor's three screens (2026-08-27): one scrolling column of
// collapsible sections, each with its own SHOW/HIDE switch where hiding is a
// real thing the page can do, and the живое preview standing beside it the
// whole time. The five-step wizard remains at /customize — this is the
// other door into the SAME WizardContext state, so a couple can walk in
// either and nothing is lost between them.
//
// EVERY SWITCH IS TRUTHFUL: a toggle exists only where the guest page
// actually changes (show.gallery, show.rsvp, rsvpKind, ampm…). Sections
// whose presence IS their content (families, opening message, thank-you)
// show or hide by being filled or emptied — the hint says so.
// ============================================================================

export default function Editor({ lang, initialTpl }: { lang: Lang; initialTpl?: string }) {
  return (
    <WizardProvider lang={lang} initialCategory="wedding" initialTpl={initialTpl}>
      <EditorInner lang={lang} />
    </WizardProvider>
  );
}

/** one section: title chip, optional switch, foldable body */
function Section({ title, on, onToggle, children, defaultOpen = true }: {
  title: string;
  /** undefined = no switch; boolean = the switch's state */
  on?: boolean;
  onToggle?: (next: boolean) => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`kn-ed__sec${on === false ? " is-off" : ""}`}>
      <header className="kn-ed__head">
        <button type="button" className="kn-ed__fold" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <Icon name="chevron" size={14} className={open ? "kn-ed__chev is-open" : "kn-ed__chev"} />
          <b>{title}</b>
        </button>
        {on !== undefined && onToggle && (
          <button type="button" role="switch" aria-checked={on} className={`kn-ed__sw${on ? " is-on" : ""}`} onClick={() => onToggle(!on)}>
            <i aria-hidden="true" />
          </button>
        )}
      </header>
      {open && <div className="kn-ed__body">{children}</div>}
    </section>
  );
}

function Seg<V extends string>({ value, options, onPick }: { value: V; options: Array<[V, string]>; onPick: (v: V) => void }) {
  return (
    <div className="kn-ed__seg" role="radiogroup">
      {options.map(([v, label]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onPick(v)}>{label}</button>
      ))}
    </div>
  );
}

function EditorInner({ lang }: { lang: Lang }) {
  const w = useWizard();
  const { s, set, patch, setStop, addStop, removeStop, blob, ready } = w;
  const base = lang === "hy" ? "" : "/en";
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [publishOpen, setPublishOpen] = useState(false);
  const tp = findTemplate(s.tpl);
  const pick = findExample(s.tpl);
  const show = s.show ?? {};
  const setShow = (k: keyof NonNullable<typeof s.show>, v: boolean) => set({ show: { ...show, [k]: v ? undefined : false } as typeof s.show });
  const isOn = (k: keyof NonNullable<typeof s.show>) => show[k] !== false;
  const inp = "kn-f__in";

  if (!tp) return null;
  const draft = toDraft(s);

  return (
    <div className="kn-ed" data-tab={tab}>
      {/* ------------------------------------------------------- TOP BAR */}
      <div className="kn-ed__bar">
        <Link className="kn-ed__backB" href={`${base}/templates`} aria-label={t(lang, E.back)}><Icon name="chevron" size={16} className="kn-wz__flip" /></Link>
        <span className="kn-ed__tpl">{t(lang, tp.name)}{pick ? <small> · {priceLabel(pick)} · {t(lang, tierName(pick.tier))}</small> : null}</span>
        <div className="kn-ed__tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "edit"} onClick={() => setTab("edit")}><Icon name="check" size={13} /> {t(lang, E.edit)}</button>
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}><Icon name="film" size={13} /> {t(lang, E.preview)}</button>
        </div>
        <button type="button" className="kn-btn kn-ed__publish" onClick={() => setPublishOpen(true)}>{t(lang, E.publish)}</button>
      </div>

      <div className="kn-ed__grid">
        {/* -------------------------------------------------- THE COLUMN */}
        <div className="kn-ed__col">
          {/* 1 basic information */}
          <Section title={t(lang, E.basic)}>
            <label className="kn-f__label" htmlFor="ed-head">{t(lang, E.headingL)}</label>
            <input id="ed-head" className={inp} value={s.heading ?? ""} onChange={(e) => set({ heading: e.target.value })} maxLength={60} placeholder={t(lang, tp.event.kicker)} />
            <p className="kn-ed__note">{t(lang, E.headingNote)}</p>
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-a">{t(lang, E.groomFull)}</label>
                <input id="ed-a" className={inp} value={s.a} onChange={(e) => set({ a: e.target.value })} maxLength={30} placeholder={t(lang, tp.event.a)} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-b">{t(lang, E.brideFull)}</label>
                <input id="ed-b" className={inp} value={s.b} onChange={(e) => set({ b: e.target.value })} maxLength={30} placeholder={tp.event.b ? t(lang, tp.event.b) : ""} /></div>
            </div>
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-sa">{t(lang, E.groomShort)}</label>
                <input id="ed-sa" className={inp} value={s.shortA ?? ""} onChange={(e) => set({ shortA: e.target.value })} maxLength={20} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-sb">{t(lang, E.brideShort)}</label>
                <input id="ed-sb" className={inp} value={s.shortB ?? ""} onChange={(e) => set({ shortB: e.target.value })} maxLength={20} /></div>
            </div>
            <p className="kn-ed__note">{t(lang, E.shortNote)}</p>
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-ra">{t(lang, E.roleG)}</label>
                <input id="ed-ra" className={inp} value={s.roleA ?? ""} onChange={(e) => set({ roleA: e.target.value })} maxLength={24} placeholder={lang === "hy" ? "Փեսա" : "The groom"} /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-rb">{t(lang, E.roleB)}</label>
                <input id="ed-rb" className={inp} value={s.roleB ?? ""} onChange={(e) => set({ roleB: e.target.value })} maxLength={24} placeholder={lang === "hy" ? "Հարս" : "The bride"} /></div>
            </div>
            <Seg value={s.familyFirst ?? "groom"} onPick={(v) => set({ familyFirst: v })} options={[["groom", t(lang, E.famFirstG)], ["bride", t(lang, E.famFirstB)]]} />
            <p className="kn-ed__note">{t(lang, E.famFirstNote)}</p>
          </Section>

          {/* 2 hero photo + 3 gallery — one picker, the first is the cover */}
          <Section title={`${t(lang, E.heroPhoto)} · ${t(lang, E.gallery)}`} on={isOn("gallery")} onToggle={(v) => setShow("gallery", v)}>
            <p className="kn-ed__note">{t(lang, E.heroPhotoNote)} {t(lang, E.galleryNote)}</p>
            <PhotoPicker lang={lang} value={s.photos} onChange={(next: string[]) => set({ photos: next })} label={wizard.photos} />
          </Section>

          {/* 4 family information */}
          <Section title={t(lang, E.family)}>
            <p className="kn-ed__note">{t(lang, E.familyNote)}</p>
            {([["G", t(lang, E.groomFam)], ["B", t(lang, E.brideFam)]] as const).map(([sideKey, label]) => {
              const g = sideKey === "G";
              return (
                <div className="kn-ed__fam" key={sideKey}>
                  <p className="kn-f__label">{label}</p>
                  <input className={inp} value={(g ? s.ptG : s.ptB) ?? ""} onChange={(e) => set(g ? { ptG: e.target.value } : { ptB: e.target.value })} maxLength={32} placeholder={t(lang, E.parentTitle) + " — " + (lang === "hy" ? "Տեր և տիկին" : "Mr & Mrs")} aria-label={t(lang, E.parentTitle)} />
                  <div className="kn-build__pair" style={{ marginTop: "0.45rem" }}>
                    <input className={inp} value={(g ? s.parents?.gf : s.parents?.bf) ?? ""} onChange={(e) => set({ parents: { ...s.parents, [g ? "gf" : "bf"]: e.target.value } })} maxLength={40} placeholder={t(lang, E.father)} aria-label={`${label} — ${t(lang, E.father)}`} />
                    <input className={inp} value={(g ? s.parents?.gm : s.parents?.bm) ?? ""} onChange={(e) => set({ parents: { ...s.parents, [g ? "gm" : "bm"]: e.target.value } })} maxLength={40} placeholder={t(lang, E.mother)} aria-label={`${label} — ${t(lang, E.mother)}`} />
                  </div>
                  <textarea className={`${inp} kn-ed__ta`} rows={2} value={(g ? s.famAG : s.famAB) ?? ""} onChange={(e) => set(g ? { famAG: e.target.value } : { famAB: e.target.value })} maxLength={120} placeholder={t(lang, E.famAddr)} aria-label={`${label} — ${t(lang, E.famAddr)}`} />
                </div>
              );
            })}
          </Section>

          {/* 5 opening message */}
          <Section title={t(lang, E.opening)}>
            <textarea className={`${inp} kn-ed__ta`} rows={3} value={s.announce ?? ""} onChange={(e) => set({ announce: e.target.value })} maxLength={160}
              placeholder={lang === "hy" ? "Ուրախությամբ հայտնում ենք մեր զավակների ամուսնության մասին" : "With joyful hearts we announce the wedding of our children"} />
            <p className="kn-ed__note">{t(lang, E.openingNote)}</p>
          </Section>

          {/* 6 ceremony: heading + the programme */}
          <Section title={t(lang, E.ceremony)}>
            <label className="kn-f__label" htmlFor="ed-ch">{t(lang, E.ceremonyHeadL)}</label>
            <input id="ed-ch" className={inp} value={s.ceremonyHead ?? ""} onChange={(e) => set({ ceremonyHead: e.target.value })} maxLength={40} placeholder={lang === "hy" ? "ՈՐՏԵՂ" : "CEREMONY INFO"} />
            <p className="kn-f__label" style={{ marginTop: "0.8rem" }}>{t(lang, E.programme)}</p>
            {s.stops.map((st, i) => (
              <div className="kn-ed__stop" key={i}>
                <input className={inp} type="time" value={st.time} onChange={(e) => setStop(i, { time: e.target.value })} aria-label={t(lang, E.stopTime)} />
                <input className={inp} value={st.name} onChange={(e) => setStop(i, { name: e.target.value })} maxLength={40} placeholder={t(lang, E.stopName)} aria-label={t(lang, E.stopName)} />
                <input className={inp} value={st.place} onChange={(e) => setStop(i, { place: e.target.value })} maxLength={60} placeholder={t(lang, E.stopPlace)} aria-label={t(lang, E.stopPlace)} />
                <button type="button" className="kn-wz__swRm kn-wz__giftRm" aria-label={t(lang, wizard.giftRemove)} onClick={() => removeStop(i)}><Icon name="x" size={11} /></button>
              </div>
            ))}
            {s.stops.length < 6 && <button type="button" className="kn-chip" onClick={addStop}>{t(lang, E.addStop)}</button>}
          </Section>

          {/* 7 the reception: date, time, clock face, countdown, address, map */}
          <Section title={t(lang, E.reception)}>
            <div className="kn-build__pair">
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-date">{t(lang, E.eventDate)}</label>
                <input id="ed-date" className={inp} type="date" value={s.date} onChange={(e) => set({ date: e.target.value })} min="2026-01-01" max="2030-12-31" /></div>
              <div className="kn-f"><label className="kn-f__label" htmlFor="ed-time">{t(lang, E.eventTime)}</label>
                <input id="ed-time" className={inp} type="time" value={s.time} onChange={(e) => set({ time: e.target.value })} step={300} /></div>
            </div>
            <Seg value={s.ampm ? "ampm" : "h24"} onPick={(v) => set({ ampm: v === "ampm" ? true : undefined })} options={[["h24", t(lang, E.clock24)], ["ampm", t(lang, E.clockAmPm)]]} />
            <p className="kn-ed__note">{t(lang, E.clockNote)}</p>
            <div className="kn-ed__row">
              <span className="kn-f__label">{t(lang, E.countdown)}</span>
              <button type="button" role="switch" aria-checked={isOn("countdown")} className={`kn-ed__sw${isOn("countdown") ? " is-on" : ""}`} onClick={() => setShow("countdown", !isOn("countdown"))}><i aria-hidden="true" /></button>
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
              <button type="button" role="switch" aria-checked={isOn("map")} className={`kn-ed__sw${isOn("map") ? " is-on" : ""}`} onClick={() => setShow("map", !isOn("map"))}><i aria-hidden="true" /></button>
            </div>
            {isOn("map") && (<>
              <input className={inp} type="url" inputMode="url" value={s.map ?? ""} onChange={(e) => set({ map: e.target.value.trim() })} maxLength={400} placeholder="https://maps.app.goo.gl/…" aria-label={t(lang, E.mapL)} />
              <p className="kn-ed__note">{t(lang, E.mapNote)}</p>
            </>)}
          </Section>

          {/* 8 RSVP */}
          <Section title={t(lang, E.rsvp)} on={isOn("rsvp")} onToggle={(v) => setShow("rsvp", v)}>
            <p className="kn-ed__note">{t(lang, E.rsvpNote)}</p>
            <Seg value={s.rsvpKind ?? (tp.blocks.rsvp === "modal" ? "modal" : "inline")} onPick={(v) => set({ rsvpKind: v })} options={[["modal", t(lang, E.rsvpBtn)], ["inline", t(lang, E.rsvpInline)]]} />
            <label className="kn-f__label" htmlFor="ed-rsvpby" style={{ marginTop: "0.6rem" }}>{t(lang, E.rsvpBy)}</label>
            <input id="ed-rsvpby" className={inp} type="date" value={s.rsvpBy ?? ""} onChange={(e) => set({ rsvpBy: e.target.value })} max={s.date || undefined} />
          </Section>

          {/* 9 dress code */}
          <Section title={t(lang, E.dress)} on={isOn("dress")} onToggle={(v) => setShow("dress", v)}>
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

          {/* 10 the day's schedule */}
          <Section title={t(lang, E.schedule)} on={isOn("schedule")} onToggle={(v) => setShow("schedule", v)}>
            <p className="kn-ed__note">{t(lang, E.scheduleNote)}</p>
          </Section>

          {/* 11 guestbook */}
          <Section title={t(lang, E.guestbook)} on={isOn("guestbook")} onToggle={(v) => setShow("guestbook", v)}>
            <p className="kn-ed__note">{t(lang, E.guestbookNote)}</p>
          </Section>

          {/* 12 gift box */}
          <Section title={t(lang, E.gifts)} on={isOn("gifts")} onToggle={(v) => setShow("gifts", v)}>
            {(s.gifts ?? []).length === 0 && <p className="kn-ed__note">{t(lang, E.giftsEmpty)}</p>}
            {(s.gifts ?? []).map((g, i) => (
              <div className="kn-wz__giftRow" key={i}>
                <input className={inp} value={g.label} onChange={(e) => set({ gifts: (s.gifts ?? []).map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} maxLength={24} placeholder={t(lang, wizard.giftLabelPh)} aria-label={t(lang, wizard.giftLabel)} />
                <input className={inp} value={g.value} onChange={(e) => set({ gifts: (s.gifts ?? []).map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} maxLength={80} placeholder="4318 27** **** 1234" aria-label={t(lang, wizard.giftValue)} />
                <input className={inp} value={g.note ?? ""} onChange={(e) => set({ gifts: (s.gifts ?? []).map((x, j) => (j === i ? { ...x, note: e.target.value } : x)) })} maxLength={90} placeholder={t(lang, wizard.giftNote)} aria-label={t(lang, wizard.giftNote)} />
                <button type="button" className="kn-wz__swRm kn-wz__giftRm" aria-label={t(lang, wizard.giftRemove)} onClick={() => set({ gifts: (s.gifts ?? []).filter((_, j) => j !== i) })}><Icon name="x" size={11} /></button>
              </div>
            ))}
            {(s.gifts ?? []).length < 3 && (
              <button type="button" className="kn-chip" onClick={() => set({ gifts: [...(s.gifts ?? []), { label: "", value: "" }] })}>{t(lang, wizard.giftAdd)}</button>
            )}
          </Section>

          {/* 13 thank-you note */}
          <Section title={t(lang, E.thanks)}>
            <textarea className={`${inp} kn-ed__ta`} rows={2} value={s.thanks ?? ""} onChange={(e) => set({ thanks: e.target.value })} maxLength={200} placeholder={t(lang, E.thanksPh)} />
          </Section>

          {/* 14 background music */}
          <Section title={t(lang, E.music)} on={isOn("music")} onToggle={(v) => setShow("music", v)}>
            <TrackPicker lang={lang} value={s.music ?? ""} onChange={(m) => set({ music: m })} label={wizard.music} hint={wizard.musicHint} />
          </Section>

          {/* 15 the envelope */}
          <Section title={t(lang, E.envelope)} on={isOn("envelope")} onToggle={(v) => setShow("envelope", v)}>
            <label className="kn-f__label" htmlFor="ed-greet">{t(lang, E.greetL)}</label>
            <input id="ed-greet" className={inp} value={s.greet ?? ""} onChange={(e) => set({ greet: e.target.value })} maxLength={60} placeholder={lang === "hy" ? "Սիրով հրավիրում ենք" : "Cordially invite"} />
            <p className="kn-ed__note">{t(lang, E.greetNote)}</p>
          </Section>

          {/* 16 the share preview */}
          <Section title={t(lang, E.shareTitle)}>
            <p className="kn-ed__note">{t(lang, E.shareNote)}</p>
            <Seg value={s.share ?? "envelope"} onPick={(v) => set({ share: v })} options={[["envelope", t(lang, E.shareEnv)], ["photo", t(lang, E.sharePhoto)]]} />
            {s.share === "photo" && s.photos.length === 0 && <p className="kn-ed__note">{t(lang, E.sharePhotoNote)}</p>}
            <div className="kn-ed__shareThumb" aria-hidden="true">
              {s.share === "photo" && s.photos[0]
                // the couple's own picture, exactly as the link card will crop it
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.photos[0]} alt="" />
                : <span className="kn-ed__shareEnv">ԿՆԻՔ</span>}
            </div>
          </Section>
        </div>

        {/* ------------------------------------------------- THE PREVIEW */}
        <aside className="kn-ed__preview" aria-label={t(lang, E.preview)} data-lenis-prevent>
          <div className="kn-pl__view kn-ed__view" tabIndex={0}>
            <div className="kn-pl__page">
              <TemplateView lang={lang} s={tp} base={base} draft={draft} mapUrl={draft.map} embed />
            </div>
          </div>
        </aside>
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
