"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { examples as EX, occasions, wizard, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { findTemplate } from "@/lib/templates";
import { findExample, priceLabel, tierName } from "@/lib/examples";
import { WizardProvider, useWizard, type WizardCategory } from "./WizardContext";
import PreviewList from "./previews/PreviewList";
import ExamplePicker from "./ExamplePicker";
import DemoModal from "./DemoModal";
import LinkPanel from "./LinkPanel";
import PhotoPicker from "@/components/ui/PhotoPicker";
import TrackPicker from "@/components/ui/TrackPicker";

// ============================================================================
// THE EVENT WIZARD — /customize.
//
// Five steps on the left, five live previews on the right (side by side on a
// desk, tabbed «Fill in / Preview» on a phone). Every keystroke lands in the
// context (WizardContext.tsx) and every preview re-renders from it — there is
// no "apply" button anywhere. Two things leave the page:
//
//   • LIVE DEMO — a fullscreen modal framing /invitation/<template>?p=<blob>,
//     i.e. the very URL a guest would open. Not a mock-up of the invitation;
//     the invitation.
//   • GENERATE WEB LINK — POST /api/link mints a 6-character id for the blob;
//     the couple gets /invitation/<id>, a copy button, a QR, and the long
//     stateless link as a fallback that needs no server at all.
//
// The order button carries the same blob into /order, so what the studio
// receives is what the couple built — down to the palette and the map pin.
// ============================================================================

const CATS: WizardCategory[] = ["wedding", "engagement", "baptism", "birthday", "corporate"];

export default function EventWizard({ lang, initialCategory, initialTpl }: { lang: Lang; initialCategory?: WizardCategory; initialTpl?: string }) {
  return (
    <WizardProvider lang={lang} initialCategory={initialCategory} initialTpl={initialTpl}>
      <Wizard lang={lang} />
    </WizardProvider>
  );
}

function Wizard({ lang }: { lang: Lang }) {
  const w = useWizard();
  const { s, set, patch, setStop, addStop, removeStop, setCategory, reset, blob, ready } = w;
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<"form" | "preview">("form");
  // the Live Demo frames ONE tpl: the chosen one, or the example a Preview
  // button asked for (the picker lets a couple look before choosing)
  const [demo, setDemo] = useState<string | null>(null);
  const base = lang === "hy" ? "" : "/en";
  const single = s.occasion === "birthday" || s.occasion === "corporate";
  const mapVal = s.map ?? "";
  const mapBad = mapVal.length > 0 && !/^https:\/\/(www\.google\.com|google\.com|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl|yandex\.com|yandex\.ru|www\.yandex\.com|maps\.apple\.com)\//.test(mapVal);

  const demoHref = `${base}/invitation/${s.tpl}${blob ? `?p=${blob}` : ""}`;
  const orderHref = `${base}/order?style=${s.tpl}&occasion=${s.occasion}${blob ? `&p=${blob}` : ""}`;
  const pick = findExample(s.tpl);

  const openDemo = useCallback((tpl?: unknown) => setDemo(typeof tpl === "string" ? tpl : ""), []);

  const done = [true, ready, Boolean(s.venue || s.city || s.stops.length), true, false];

  return (
    <div className="kn-wz" data-tab={tab}>
      {/* mobile tabs */}
      <div className="kn-wz__tabs" role="tablist" aria-label={t(lang, wizard.previews)}>
        <button type="button" role="tab" aria-selected={tab === "form"} className="kn-wz__tab" onClick={() => setTab("form")}>{t(lang, wizard.tabForm)}</button>
        <button type="button" role="tab" aria-selected={tab === "preview"} className="kn-wz__tab" onClick={() => setTab("preview")}>{t(lang, wizard.tabPreview)}</button>
      </div>

      {/* ------------------------------------------------------- THE FORM */}
      <section className="kn-wz__form" aria-label={t(lang, wizard.title)}>
        <ol className="kn-wz__stepper">
          {wizard.steps.map((st, i) => (
            <li key={i}>
              <button type="button" className="kn-wz__stepB" aria-current={step === i ? "step" : undefined} data-done={done[i] && i < step ? "" : undefined} onClick={() => setStep(i)}>
                <span className="kn-wz__stepN">{done[i] && i < step ? <Icon name="check" size={12} /> : i + 1}</span>
                <span className="kn-wz__stepT">{t(lang, st)}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* ---------------------------------------------------- 1 occasion */}
        {step === 0 && (
          <div className="kn-wz__panel" data-step="0">
            <h2 className="kn-wz__h">{t(lang, wizard.category)}</h2>
            <div className="kn-wz__cats" role="radiogroup" aria-label={t(lang, wizard.category)}>
              {CATS.map((c) => (
                <button key={c} type="button" role="radio" aria-checked={s.occasion === c} className="kn-wz__cat" onClick={() => setCategory(c)}>
                  <span className="kn-wz__catI" aria-hidden="true"><CatGlyph c={c} /></span>
                  <span>{t(lang, occasions[c].name)}</span>
                </button>
              ))}
            </div>
            {/* the examples — a separate panel: every web template, engine
                style and (weddings) card in an envelope this occasion offers,
                with what it does and what it costs; Preview + Choose */}
            <ExamplePicker lang={lang} />
          </div>
        )}

        {/* --------------------------------------------------- 2 who/when */}
        {step === 1 && (
          <div className="kn-wz__panel" data-step="1">
            <h2 className="kn-wz__h">{t(lang, occasions[s.occasion].namesLabel)}</h2>
            <div className="kn-build__pair">
              <Field id="wz-a" label={t(lang, wizard.hostA)}>
                <input id="wz-a" className="kn-f__in" value={s.a} onChange={(e) => set({ a: e.target.value })} maxLength={30} autoComplete="off" placeholder={t(lang, findTemplate(s.tpl)?.event.a ?? { hy: "Նարե", en: "Nare" })} />
              </Field>
              <Field id="wz-b" label={t(lang, single ? wizard.hostBOptional : wizard.hostB)}>
                <input id="wz-b" className="kn-f__in" value={s.b} onChange={(e) => set({ b: e.target.value })} maxLength={30} autoComplete="off" placeholder={single ? "" : t(lang, findTemplate(s.tpl)?.event.b ?? { hy: "Հայկ", en: "Hayk" })} />
              </Field>
            </div>
            <div className="kn-build__pair">
              <Field id="wz-date" label={t(lang, wizard.date)}>
                <input id="wz-date" className="kn-f__in" type="date" value={s.date} onChange={(e) => set({ date: e.target.value })} min="2026-01-01" max="2030-12-31" />
              </Field>
              <Field id="wz-time" label={t(lang, wizard.time)}>
                <input id="wz-time" className="kn-f__in" type="time" value={s.time} onChange={(e) => set({ time: e.target.value })} step={300} />
              </Field>
            </div>
            {s.occasion === "baptism" && (
              <div className="kn-build__pair">
                <Field id="wz-ga" label={t(lang, wizard.godA)}>
                  <input id="wz-ga" className="kn-f__in" value={s.godA ?? ""} onChange={(e) => set({ godA: e.target.value })} maxLength={30} autoComplete="off" />
                </Field>
                <Field id="wz-gb" label={t(lang, wizard.godB)}>
                  <input id="wz-gb" className="kn-f__in" value={s.godB ?? ""} onChange={(e) => set({ godB: e.target.value })} maxLength={30} autoComplete="off" />
                </Field>
              </div>
            )}
            {s.occasion === "birthday" && (
              <Field id="wz-born" label={t(lang, wizard.born)}>
                <input id="wz-born" className="kn-f__in" type="number" inputMode="numeric" min={1900} max={2030} value={s.born ?? ""} onChange={(e) => set({ born: e.target.value ? Number(e.target.value) : undefined })} placeholder="1996" />
              </Field>
            )}
            {!ready && <p className="kn-wz__hint">{t(lang, wizard.needNames)}</p>}
          </div>
        )}

        {/* ------------------------------------------------------- 3 where */}
        {step === 2 && (
          <div className="kn-wz__panel" data-step="2">
            <h2 className="kn-wz__h">{t(lang, wizard.steps[2])}</h2>
            <div className="kn-build__pair">
              <Field id="wz-venue" label={t(lang, wizard.venue)}>
                <input id="wz-venue" className="kn-f__in" value={s.venue ?? ""} onChange={(e) => set({ venue: e.target.value })} maxLength={60} placeholder={t(lang, wizard.venuePh)} />
              </Field>
              <Field id="wz-city" label={t(lang, wizard.city)}>
                <input id="wz-city" className="kn-f__in" value={s.city} onChange={(e) => set({ city: e.target.value })} maxLength={40} placeholder={lang === "hy" ? "Երևան" : "Yerevan"} />
              </Field>
            </div>
            <Field id="wz-addr" label={t(lang, wizard.address)}>
              <input id="wz-addr" className="kn-f__in" value={s.address ?? ""} onChange={(e) => set({ address: e.target.value })} maxLength={80} placeholder={t(lang, wizard.addressPh)} />
            </Field>
            <Field id="wz-map" label={t(lang, wizard.map)} err={mapBad ? t(lang, wizard.mapBad) : undefined}>
              <input id="wz-map" className="kn-f__in" type="url" inputMode="url" value={s.map ?? ""} onChange={(e) => set({ map: e.target.value.trim() })} maxLength={400} placeholder={t(lang, wizard.mapPh)} aria-invalid={mapBad ? "true" : undefined} />
            </Field>

            <fieldset className="kn-build__stops kn-wz__stops">
              <legend>{t(lang, wizard.programme)} <small>{t(lang, wizard.programmeHint)}</small></legend>
              {s.stops.map((x, i) => (
                <div className="kn-build__stop" key={i}>
                  <input className="kn-f__in" type="time" value={x.time} onChange={(e) => setStop(i, { time: e.target.value })} aria-label={t(lang, wizard.time)} step={300} />
                  <input className="kn-f__in" value={x.name} onChange={(e) => setStop(i, { name: e.target.value })} maxLength={40} placeholder={lang === "hy" ? "Ինչ է լինելու" : "What happens"} aria-label={lang === "hy" ? "Ինչ է լինելու" : "What happens"} />
                  <input className="kn-f__in" value={x.place} onChange={(e) => setStop(i, { place: e.target.value })} maxLength={60} placeholder={lang === "hy" ? "Որտեղ" : "Where"} aria-label={lang === "hy" ? "Որտեղ" : "Where"} />
                  <input className="kn-f__in" value={x.address} onChange={(e) => setStop(i, { address: e.target.value })} maxLength={80} placeholder={lang === "hy" ? "Հասցե" : "Address"} aria-label={lang === "hy" ? "Հասցե" : "Address"} />
                  <button type="button" className="kn-build__rm" onClick={() => removeStop(i)} aria-label={lang === "hy" ? "Հեռացնել" : "Remove"}><Icon name="x" size={14} /></button>
                </div>
              ))}
              {s.stops.length < 5 && (
                <button type="button" className="kn-build__add" onClick={addStop}>{lang === "hy" ? "+ Ավելացնել կանգառ" : "+ Add a stop"}</button>
              )}
            </fieldset>
          </div>
        )}

        {/* ------------------------------------------------------ 4 extras */}
        {step === 3 && (
          <div className="kn-wz__panel" data-step="3">
            <h2 className="kn-wz__h">{t(lang, wizard.steps[3])}</h2>
            <div className="kn-build__pair">
              <Field id="wz-rsvp" label={t(lang, wizard.rsvpBy)}>
                <input id="wz-rsvp" className="kn-f__in" type="date" value={s.rsvpBy ?? ""} onChange={(e) => set({ rsvpBy: e.target.value })} max={s.date || undefined} />
              </Field>
              {/* the song: a pasted link OR the file itself — the upload gets a
                  same-origin /api/audio path the previews and the guest link
                  can actually play (and the dock's analyser can finally read) */}
              <TrackPicker lang={lang} value={s.music ?? ""} onChange={(m) => set({ music: m })} label={wizard.music} hint={wizard.musicHint} />
            </div>

            <div className="kn-f">
              <span className="kn-f__label">{t(lang, wizard.dress)} <small className="kn-wz__small">{t(lang, wizard.dressHint)}</small></span>
              <div className="kn-wz__swatches">
                {(s.dress ?? []).map((c, i) => (
                  <label key={i} className="kn-wz__sw" style={{ "--sw": c } as React.CSSProperties}>
                    <input type="color" value={c} onChange={(e) => { const v = e.target.value.toUpperCase(); patch((cur) => ({ dress: (cur.dress ?? []).map((x, j) => (j === i ? v : x)) })); }} aria-label={`${t(lang, wizard.dress)} ${i + 1}`} />
                    <button type="button" className="kn-wz__swRm" aria-label={lang === "hy" ? "Հեռացնել" : "Remove"} onClick={() => patch((cur) => ({ dress: (cur.dress ?? []).filter((_, j) => j !== i) }))}><Icon name="x" size={10} /></button>
                  </label>
                ))}
                {(s.dress ?? []).length < 5 && (
                  <button type="button" className="kn-wz__swAdd" onClick={() => patch((cur) => ({ dress: [...(cur.dress ?? []), PALETTE[(cur.dress ?? []).length % PALETTE.length]].slice(0, 5) }))}>{t(lang, wizard.addColor)}</button>
                )}
              </div>
            </div>

            <label className="kn-wz__toggle">
              <input type="checkbox" checked={Boolean(s.video)} onChange={(e) => set({ video: e.target.checked })} />
              <span className="kn-wz__toggleTrack" aria-hidden="true"><i /></span>
              <span><b>{t(lang, wizard.video)}</b><small>{t(lang, wizard.videoHint)}</small></span>
            </label>

            {/* The couple's photographs, saved at pick time rather than held
                as object URLs: the previews here are IFRAMES, and a blob: URL
                belongs to the document that made it — so the old handles could
                never reach them, nor the guest link. Now the draft carries
                same-origin paths and every preview shows the real pictures. */}
            <div className="kn-f">
              <PhotoPicker lang={lang} value={s.photos} onChange={(next: string[]) => set({ photos: next })} label={wizard.photos} />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- 5 share
            Rebuilt (2026-08-25) around the two questions every couple asks
            here: «is anything still missing?» (the CHECKLIST — each row says
            filled / still sample, and jumps to its step) and «which link do
            I actually get?» (the TWO PATHS, side by side: generate it
            yourself right now, or order and receive the final link at your
            contact — said in words, not implied). */}
        {step === 4 && (
          <div className="kn-wz__panel" data-step="4">
            <h2 className="kn-wz__h">{t(lang, wizard.steps[4])}</h2>
            {pick && (
              <p className="kn-ex__pick kn-ex__pick--big">
                <Icon name="check" size={14} /> {t(lang, EX.yourPick)}: <b>{t(lang, pick.name)}</b> · <b>{priceLabel(pick)}</b> · <span>{t(lang, tierName(pick.tier))} · {t(lang, EX.terms)}</span>
                <button type="button" className="kn-wz__reset" onClick={() => setStep(0)}>{t(lang, EX.change)}</button>
              </p>
            )}
            <ShareBar lang={lang} demoHref={demoHref} orderHref={orderHref} onDemo={openDemo} big />

            <ShareChecklist lang={lang} s={s} ready={ready} go={setStep} />

            <div className="kn-wz__paths">
              <section className="kn-wz__path" aria-labelledby="kn-path-a">
                <h3 className="kn-wz__pathT" id="kn-path-a"><span aria-hidden="true">1</span> {t(lang, wizard.pathATitle)}</h3>
                <p className="kn-wz__pathB">{t(lang, wizard.pathABody)}</p>
                <LinkPanel lang={lang} tpl={s.tpl} blob={blob} ready={ready} />
              </section>
              <section className="kn-wz__path" aria-labelledby="kn-path-b">
                <h3 className="kn-wz__pathT" id="kn-path-b"><span aria-hidden="true">2</span> {t(lang, wizard.pathBTitle)}</h3>
                <p className="kn-wz__pathB">{t(lang, wizard.pathBBody)}</p>
                <Link href={orderHref} className="kn-btn kn-wz__pathBtn">{t(lang, wizard.order)} <Icon name="arrow" size={14} /></Link>
              </section>
            </div>

            <p className="kn-wz__hint" style={{ marginTop: "1rem" }}>
              <button type="button" className="kn-wz__reset" onClick={() => { reset(); setStep(0); }}>{t(lang, wizard.reset)}</button>
            </p>
          </div>
        )}

        <div className="kn-wz__nav">
          <button type="button" className="kn-btn kn-btn--ghost" disabled={step === 0} onClick={() => setStep((x) => Math.max(0, x - 1))}>
            <Icon name="chevron" size={16} className="kn-wz__flip" /> {t(lang, wizard.back)}
          </button>
          {step < 4 ? (
            <button type="button" className="kn-btn" onClick={() => setStep((x) => Math.min(4, x + 1))}>
              {t(lang, wizard.next)} <Icon name="chevron" size={16} />
            </button>
          ) : (
            <Link href={orderHref} className="kn-btn">{t(lang, wizard.order)} <Icon name="arrow" size={16} /></Link>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- THE PREVIEWS */}
      <aside className="kn-wz__previews" aria-label={t(lang, wizard.previews)} data-lenis-prevent>
        <div className="kn-wz__pvHead">
          <p className="kn-label">{t(lang, wizard.previews)}</p>
          <p className="kn-wz__pvHint">{t(lang, wizard.previewsHint)}</p>
          <ShareBar lang={lang} demoHref={demoHref} orderHref={orderHref} onDemo={openDemo} />
        </div>
        {/* one separate entry per version — every template, engine style and
            card the occasion offers — the pick open first; the other occasions
            as a collapsed group at the end */}
        <div className="kn-wz__pvList">
          <PreviewList lang={lang} onDemo={openDemo} />
        </div>
      </aside>

      {demo !== null && <DemoModal lang={lang} href={`${base}/invitation/${demo || s.tpl}${blob ? `?p=${blob}` : ""}`} onClose={() => setDemo(null)} />}
    </div>
  );
}

const PALETTE = ["#B08D57", "#8F4B45", "#E9CFC8", "#1C1A17", "#8C9A82"];

function Field({ id, label, hint, err, children }: { id: string; label: string; hint?: string; err?: string; children: React.ReactNode }) {
  return (
    <div className="kn-f">
      <label className="kn-f__label" htmlFor={id}>{label}</label>
      {children}
      {hint && !err && <small className="kn-wz__small kn-wz__fieldHint">{hint}</small>}
      {err && <p className="kn-f__err" role="alert">{err}</p>}
    </div>
  );
}

function ShareBar({ lang, demoHref, onDemo, big }: { lang: Lang; demoHref: string; orderHref?: string; onDemo: () => void; big?: boolean }) {
  // NO GATING (2026-08-25): the demo falls back to the design's own sample
  // words by contract, so there is ALWAYS something to show. And the bar
  // carries only the PREVIEW verbs now, both ghost in the big form — the two
  // terminal actions (generate the link · order) each live in their own
  // labeled path box on step 5, one primary per path. In the previews column
  // the demo stays primary: it is that column's one verb.
  return (
    <div className={`kn-wz__share${big ? " kn-wz__share--big" : ""}`}>
      <button type="button" className={`kn-btn${big ? " kn-btn--ghost" : ""}`} onClick={onDemo} title={t(lang, wizard.demoHint)}>
        <Icon name="film" size={16} /> {t(lang, wizard.demo)}
      </button>
      <a className="kn-btn kn-btn--ghost" href={demoHref} target="_blank" rel="noopener">{t(lang, wizard.demoOpen)} <Icon name="arrow" size={14} /></a>
    </div>
  );
}

/** step 5's conscience: every slot that would still show the template's
 *  sample words on the REAL link, named, with the way there. Sample names
 *  read as samples — but a sample church with a working map button reads as
 *  real, so the venue row warns rather than shrugs. */
function ShareChecklist({ lang, s, ready, go }: { lang: Lang; s: ReturnType<typeof useWizard>["s"]; ready: boolean; go: (step: number) => void }) {
  const whereFilled = Boolean(s.venue || s.map || s.stops.some((x) => x.place || x.address));
  const rows = [
    { label: wizard.checkNames, ok: ready, state: ready ? wizard.checkOk : wizard.checkNamesNeed, warn: !ready, step: 1 },
    { label: wizard.checkWhere, ok: whereFilled, state: whereFilled ? wizard.checkOk : wizard.checkWhereWarn, warn: !whereFilled, step: 2 },
    { label: wizard.checkProgramme, ok: s.stops.length > 0, state: s.stops.length > 0 ? wizard.checkOk : wizard.checkSample, warn: false, step: 2 },
    { label: wizard.checkPhotos, ok: s.photos.length > 0, state: s.photos.length > 0 ? wizard.checkOk : wizard.checkSample, warn: false, step: 3 },
    { label: wizard.checkMusic, ok: Boolean(s.music), state: s.music ? wizard.checkOk : wizard.checkSample, warn: false, step: 3 },
    { label: wizard.checkRsvp, ok: Boolean(s.rsvpBy), state: s.rsvpBy ? wizard.checkOk : wizard.checkOptional, warn: false, step: 3 },
  ];
  return (
    <div className="kn-wz__chk" role="group" aria-label={t(lang, wizard.checkTitle)}>
      <p className="kn-label">{t(lang, wizard.checkTitle)}</p>
      <ul className="kn-wz__chkList">
        {rows.map((r, i) => (
          <li key={i} className={`kn-wz__chkRow${r.ok ? " is-ok" : r.warn ? " is-warn" : ""}`}>
            <span className="kn-wz__chkIc" aria-hidden="true">{r.ok ? <Icon name="check" size={13} /> : "—"}</span>
            <b>{t(lang, r.label)}</b>
            <small>{t(lang, r.state)}</small>
            {!r.ok && (
              <button type="button" className="kn-chip" onClick={() => go(r.step)}>
                {t(lang, wizard.checkGo)}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CatGlyph({ c }: { c: WizardCategory }) {
  switch (c) {
    case "wedding": return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="13" r="5" /><circle cx="15" cy="13" r="5" /><path d="M9 8l1.5-3h3L15 8" /></svg>;
    case "engagement": return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="14" r="6" /><path d="m9 8 3-4 3 4" /><path d="M12 4v0" /></svg>;
    case "baptism": return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M7 8h10" /><path d="M5 20c2-3 12-3 14 0" /></svg>;
    case "birthday": return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 20h16M5 20v-6h14v6M8 14v-3M12 14v-3M16 14v-3M12 8V5" /><path d="M12 5c1-1 1-2 0-3-1 1-1 2 0 3z" /></svg>;
    default: return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 21V5l8-3 8 3v16" /><path d="M9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2" /></svg>;
  }
}
