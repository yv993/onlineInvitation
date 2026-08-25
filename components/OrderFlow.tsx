"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import WMotifSprite from "./wcards/WMotifs";
import ExampleThumb from "./customizer/ExampleThumb";
import PhotoPicker from "./ui/PhotoPicker";
import { examples as EX, occasions, svc } from "@/lib/content";
import { defaultExample, examplesFor, findExample, priceLabel, tierName } from "@/lib/examples";
import type { Example, ExampleKind } from "@/lib/examples";
import type { Lang, Occasion } from "@/lib/content";
import { t } from "@/lib/i18n";
import { decodeDraft, encodeDraft } from "@/lib/draft";
import type { Draft, DraftStop } from "@/lib/draft";
import { formatAmd, styles } from "@/lib/styles";
import type { InvStyle } from "@/lib/styles";

// ============================================================================
// THE ORDER FLOW — section 5 of the blueprint, and the merge of two things
// that used to be separate here (the builder and the order form), which meant
// a couple typed their names twice. Now: THREE STEPS, one state.
//
//   1  Choose the style and the occasion
//   2  Tell us your day — names, date, city, the timed programme
//   3  Preview and order — the REAL card in a phone frame, then a way to
//      reach you, notes, send
//
// The stepper is COMPUTED from completeness, not clicked into: step 1 is
// always satisfied (a style is always selected), step 2 completes when both
// names and a date exist, step 3 when a contact exists. "Next" buttons only
// scroll to the next step — every step is always visible and always
// editable, because a wizard that hides step 2 while you're on step 3 is a
// wizard people abandon.
//
// The preview IS the product: the same /i/<style>?p= route a guest opens,
// with the draft blob debounced 550ms so it reloads at typing pauses. On
// phones the phone frame yields to an "open the live preview" button — an
// iframe inside a phone viewport is a scroll trap.
//
// The same honesty contract as every form here: honeypot + min-time on the
// server, per-field 422s, a done screen that only claims what the server
// confirmed (`stored`, `delivered`).
// ============================================================================

const EMPTY_STOP = (): DraftStop => ({ time: "", name: "", place: "", address: "" });
/** the date every sample in the registry carries — what the phone shows
 *  while the couple has not chosen theirs yet */
const SAMPLE_DATE = "2026-11-14";

/** One orderable invitation in step 1: the design AS ITS DESIGNER MADE IT —
 *  the catalogue is an offer to compare, so it keeps the sample words; the
 *  couple's own details live in the preview beside it. A div with the button
 *  role, not a <button>: the live thumbnail carries the invitation's own
 *  buttons, and buttons may not nest. */
function TemplateChoice({ e, lang, chosen, onChoose }: {
  e: Example;
  lang: Lang;
  chosen: boolean;
  onChoose: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={chosen}
      className={`kn-flow__tpl${chosen ? " is-on" : ""}`}
      onClick={onChoose}
      onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); onChoose(); } }}
    >
      <span className="kn-flow__tplMedia" style={{ background: e.palette[0] }}>
        <ExampleThumb e={e} lang={lang} />
        <span className="kn-flow__tplKind">{t(lang, EX.kinds[e.kind])}</span>
        {chosen && <span className="kn-flow__tplCheck" aria-hidden="true"><Icon name="check" size={14} /></span>}
      </span>
      <span className="kn-flow__tplBody">
        <b>{t(lang, e.name)}</b>
        <small>{priceLabel(e)} · {t(lang, tierName(e.tier))}</small>
      </span>
      <span className="kn-flow__tplPick">{t(lang, chosen ? EX.chosen : EX.choose)}</span>
    </div>
  );
}

export default function OrderFlow({
  lang,
  initialStyle = "kniq",
  initialOccasion = "wedding",
}: {
  lang: Lang;
  initialStyle?: InvStyle["id"];
  initialOccasion?: Occasion;
}) {
  const f = svc.flow;
  const b = svc.build;
  const base = lang === "hy" ? "" : "/en";

  const [style, setStyle] = useState<InvStyle["id"]>(initialStyle);
  const [occasion, setOccasion] = useState<Occasion>(initialOccasion);
  const [a, setA] = useState("");
  const [bName, setB] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [stops, setStops] = useState<DraftStop[]>([
    { time: "12:30", name: lang === "hy" ? "Հարսի տուն" : "The bride's home", place: "", address: "" },
    { time: "15:00", name: lang === "hy" ? "Պսակադրություն" : "The ceremony", place: "", address: "" },
    { time: "18:00", name: lang === "hy" ? "Հարսանյաց խնջույք" : "The banquet", place: "", address: "" },
  ]);
  // the couple's own photographs — saved at pick time, so they ride the blob
  // into the preview iframe, the short link and the guest's browser
  const [photos, setPhotos] = useState<string[]>([]);
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState<Partial<Record<"names" | "contact", string>>>({});
  const [done, setDone] = useState<{ delivered: boolean; stored: boolean } | null>(null);
  const born = useRef(Date.now());
  // step 1 is a real catalogue now: which kind of example is on show
  const [kind, setKind] = useState<ExampleKind | "all">("all");
  const [plainOpen, setPlainOpen] = useState(false);
  // …but it opens COLLAPSED (2026-08-25): on the landing this form sits right
  // under the deck that just showed the same designs, so a third full render
  // of the catalogue was noise (and the page's heaviest stretch). A pick is
  // always in hand — the wizard's, the URL's, or the occasion's default —
  // and the grid unfolds only when the couple asks to change it.
  const [catOpen, setCatOpen] = useState(false);
  // The wizard hands over its whole draft in ?p= (names, date, programme AND
  // the extras — venue, palette, music, template). The extras ride along
  // untouched into the order's blob so the studio sees exactly what the
  // couple built; the template id, when present, is what gets ordered.
  const extras = useRef<Partial<Draft>>({});
  const [tpl, setTpl] = useState("");

  // The occasion chips over the catalog land here with ?occasion= or a
  // data attribute; honour a hash-less preselect passed by the URL.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const st = sp.get("style");
    const oc = sp.get("occasion");
    if (st && styles.some((s) => s.id === st)) setStyle(st as InvStyle["id"]);
    if (oc && oc in occasions) setOccasion(oc as Occasion);
    const d = decodeDraft(sp.get("p") ?? undefined);
    if (d) {
      const { a: da, b: db, date: dd, city: dc, stops: ds, occasion: dO, ...rest } = d;
      extras.current = rest;
      setA(da);
      setB(db);
      setDate(dd);
      setCity(dc);
      if (ds.length) setStops(ds);
      setOccasion(dO);
      if (rest.tpl) setTpl(rest.tpl);
    }
    // no pick arrived: default to the occasion's first design, the same one
    // the wizard opens on — the summary row and the price always have a name
    if (!d?.tpl) {
      const occ: Occasion = d?.occasion ?? (oc && oc in occasions ? (oc as Occasion) : "wedding");
      setTpl((cur) => cur || defaultExample(occ).id);
    }
  }, []);

  // what is being ordered, resolved early: the preview borrows its sample
  // words until the couple has typed their own
  const pick = findExample(tpl);

  const draft: Draft | null = useMemo(() => {
    const single = occasion === "birthday" || occasion === "corporate";
    if (!a.trim() || (!bName.trim() && !single) || !date) return null;
    return {
      ...extras.current,
      a: a.trim(),
      b: bName.trim(),
      date,
      time: stops.find((s) => s.time)?.time || "12:00",
      city: city.trim(),
      stops: stops.filter((s) => s.time && s.name.trim()),
      occasion,
      photos: photos.length ? photos : undefined,
    };
  }, [a, bName, date, city, stops, occasion, photos]);

  // THE PREVIEW'S OWN DRAFT — lenient where the order's is strict. The order
  // needs both names and a date before it can be sent; the PHONE should not
  // wait for all three. It shows the chosen invitation immediately, wearing
  // its own sample words, and each field the couple types replaces one of
  // them — so the first keystroke visibly lands instead of the frame sitting
  // empty until the date is filled in.
  const previewDraft: Draft | null = useMemo(() => {
    const single = occasion === "birthday" || occasion === "corporate";
    const typedSomething = Boolean(a.trim() || bName.trim() || date || city.trim() || photos.length);
    if (!typedSomething) return null;
    const sample = pick?.sample;
    return {
      ...extras.current,
      a: a.trim() || (sample ? t(lang, sample.a) : ""),
      b: bName.trim() || (single ? "" : sample?.b ? t(lang, sample.b) : ""),
      date: date || SAMPLE_DATE,
      time: stops.find((s) => s.time)?.time || "12:00",
      city: city.trim(),
      stops: stops.filter((s) => s.time && s.name.trim()),
      occasion,
      photos: photos.length ? photos : undefined,
    };
  }, [a, bName, date, city, stops, occasion, photos, pick, lang]);

  const [blob, setBlob] = useState("");
  const timer = useRef(0);
  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBlob(previewDraft ? encodeDraft(previewDraft) : ""), 550);
    return () => window.clearTimeout(timer.current);
  }, [previewDraft]);

  const previewHref = tpl
    ? `${base}/invitation/${tpl}${blob ? `?p=${blob}` : ""}`
    : `${base}/i/${style}${blob ? `?p=${blob}` : ""}`;

  // THE CATALOGUE — every invitation this occasion can be ordered as: the web
  // templates, the engine styles, the cards in an envelope. One list, already
  // carrying each one's price and tier (lib/examples.ts).
  const catalogue = useMemo(() => examplesFor(occasion), [occasion]);
  const shown = useMemo(() => (kind === "all" ? catalogue : catalogue.filter((e) => e.kind === kind)), [catalogue, kind]);
  const kinds = useMemo(() => [...new Set(catalogue.map((e) => e.kind))], [catalogue]);
  // an example belongs to its occasion: switching occasion hands the pick to
  // the new occasion's default rather than pricing something unreachable
  useEffect(() => {
    if (tpl && !catalogue.some((e) => e.id === tpl)) setTpl(defaultExample(occasion).id);
  }, [catalogue, tpl, occasion]);
  // the thumbnails wear the couple's own words the moment they are typed

  // Priced: the chosen example (a template, an engine style, a card), else
  // the plain style and its from-price.
  const plain = styles.find((x) => x.id === style) ?? styles[0];
  const total = pick ? priceLabel(pick) : formatAmd(plain.from);
  const totalLine = pick ? `${t(lang, tierName(pick.tier))} · ${t(lang, EX.terms)}` : `${t(lang, plain.name)} · ${t(lang, EX.terms)}`;

  // The stepper's truth: which steps are complete.
  const step2 = Boolean(draft);
  const step3 = step2 && contact.trim().length >= 5;
  const current = !step2 ? 2 : !step3 ? 3 : 3;

  const setStop = (i: number, k: keyof DraftStop, v: string) =>
    setStops((prev) => prev.map((s, j) => (j === i ? { ...s, [k]: v } : s)));

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const l = window.__lenis;
    if (l) l.scrollTo(`#${id}`, { offset: -90 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const next: typeof errs = {};
    if (!draft) next.names = t(lang, svc.order.errName);
    if (contact.trim().length < 5) next.contact = t(lang, svc.order.errContact);
    setErrs(next);
    if (Object.keys(next).length) {
      jump(next.names ? "kn-step-2" : "kn-step-3");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          style: tpl || style,
          names: [a.trim(), bName.trim()].filter(Boolean).join(" & "),
          contact: contact.trim(),
          date,
          details: notes.slice(0, 4000),
          // the STRICT draft goes to the studio — never the preview's
          // sample-filled stand-in
          draft: draft ? encodeDraft(draft) : blob,
          lang,
          website: String(new FormData(e.currentTarget).get("website") ?? ""),
          elapsed: Date.now() - born.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        delivered?: boolean;
        stored?: boolean;
        errors?: typeof errs;
      };
      if (res.status === 422 && data.errors) {
        setErrs(data.errors);
        setBusy(false);
        return;
      }
      setDone({ delivered: Boolean(data.delivered), stored: Boolean(data.stored) });
    } catch {
      setErrs({ contact: lang === "hy" ? "Չհաջողվեց ուղարկել։ Փորձեք նորից։" : "Could not send. Please try again." });
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="kn-flow__done" role="status">
        <Icon name="seal" size={36} />
        <h3>{t(lang, svc.order.done)}</h3>
        {!done.delivered && !done.stored && <p className="kn-flow__caveat">{t(lang, svc.order.undelivered)}</p>}
        {blob && (
          <a className="kn-btn kn-btn--ghost" href={previewHref} target="_blank" rel="noopener">
            {t(lang, b.preview)}
          </a>
        )}
      </div>
    );
  }

  const stepState = (n: number) =>
    n === 1 || (n === 2 && step2) || (n === 3 && step3) ? "done" : n === current ? "current" : "todo";

  return (
    <form className="kn-flow" onSubmit={submit} noValidate>
      {/* ------------------------------------------------------------ STEPPER */}
      <ol className="kn-stepper" aria-label={t(lang, f.title)}>
        {f.steps.map((s, i) => (
          <li key={i} className="kn-stepper__it" data-state={stepState(i + 1)}>
            <button type="button" className="kn-stepper__b" onClick={() => jump(`kn-step-${i + 1}`)}>
              <span className="kn-stepper__n" aria-hidden="true">
                {stepState(i + 1) === "done" ? <Icon name="check" size={16} /> : i + 1}
              </span>
              <span className="kn-stepper__t">
                <small>
                  {t(lang, f.stepWord)} {i + 1}
                </small>
                {t(lang, s.t)}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="kn-flow__grid">
        <div className="kn-flow__col">
          {/* ------------------------------------------------------- STEP 1 */}
          <section className="kn-flow__step" id="kn-step-1" aria-labelledby="kn-s1">
            <h3 className="kn-flow__h" id="kn-s1">
              <span>1</span> {t(lang, f.steps[0].t)}
            </h3>
            {/* the occasion first: it decides which invitations exist */}
            <div className="kn-f" role="group" aria-labelledby="kn-fl-occ">
              <span className="kn-f__label" id="kn-fl-occ">
                {t(lang, b.occasion)}
              </span>
              <div className="kn-chips">
                {(Object.keys(occasions) as Occasion[]).map((o) => (
                  <button
                    key={o}
                    type="button"
                    className="kn-chips__b"
                    aria-pressed={occasion === o}
                    onClick={() => setOccasion(o)}
                  >
                    {t(lang, occasions[o].name)}
                  </button>
                ))}
              </div>
            </div>

            {/* THE PICK, first — the catalogue just played above (the deck);
                here it stays folded until the couple asks to change */}
            {pick && (
              <div className="kn-flow__pick" role="status">
                <div className="kn-flow__pickBody">
                  <small>{t(lang, EX.ordering)} · {t(lang, EX.kinds[pick.kind])}</small>
                  <b>{t(lang, pick.name)}</b>
                  <small>{priceLabel(pick)} · {t(lang, tierName(pick.tier))} · {t(lang, EX.terms)}</small>
                  <Link href={`${base}/customize?category=${occasion}&tpl=${tpl}`}>{t(lang, EX.changeInWizard)}</Link>
                </div>
                <button type="button" className="kn-chip kn-flow__change" aria-expanded={catOpen} onClick={() => setCatOpen((v) => !v)}>
                  {t(lang, catOpen ? EX.changeClose : EX.change)}
                </button>
              </div>
            )}

            {/* ---- THE CATALOGUE: every invitation, choosable, priced ---- */}
            {(catOpen || !pick) && (
            <div className="kn-f" role="group" aria-labelledby="kn-fl-tpl">
              <span className="kn-f__label" id="kn-fl-tpl">
                {t(lang, EX.title)} <small className="kn-flow__count">{shown.length} {t(lang, EX.count)}</small>
              </span>
              <p className="kn-flow__sub">{t(lang, EX.lead)}</p>
              {kinds.length > 1 && (
                <div className="kn-chips kn-flow__kinds">
                  <button type="button" className="kn-chips__b" aria-pressed={kind === "all"} onClick={() => setKind("all")}>
                    {t(lang, EX.all)} <span className="kn-flow__n">{catalogue.length}</span>
                  </button>
                  {kinds.map((k) => (
                    <button key={k} type="button" className="kn-chips__b" aria-pressed={kind === k} onClick={() => setKind(k)}>
                      {t(lang, EX.kinds[k])} <span className="kn-flow__n">{catalogue.filter((e) => e.kind === k).length}</span>
                    </button>
                  ))}
                </div>
              )}
              {shown.some((e) => e.card) && <WMotifSprite />}
              <ul className="kn-flow__tpls">
                {shown.map((e) => (
                  <li key={e.id}>
                    {/* choosing folds the list back onto the summary row */}
                    <TemplateChoice e={e} lang={lang} chosen={tpl === e.id} onChoose={() => { setTpl(e.id); setCatOpen(false); }} />
                  </li>
                ))}
              </ul>
              {/* the popular cards are here; the rest are one link away, where
                  the envelope, the colourway and the photo are chosen too */}
              {occasion === "wedding" && (
                <p className="kn-flow__more">
                  <Link href={`${base}/wedding-cards`}>{t(lang, EX.moreCards)}</Link>
                </p>
              )}
              {occasion === "birthday" && (
                <p className="kn-flow__more">
                  <Link href={`${base}/kids`}>{t(lang, EX.moreKids)}</Link>
                </p>
              )}
            </div>
            )}

            {!pick && (
              /* nothing chosen (only reachable before the default lands): the
                 three plain wardrobes, folded away */
              <details className="kn-flow__plain" open={plainOpen} onToggle={(ev) => setPlainOpen((ev.currentTarget as HTMLDetailsElement).open)}>
                <summary>{t(lang, EX.plainStyle)}</summary>
                <div className="kn-chips">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      id={`order-${s.id}`}
                      type="button"
                      className="kn-chips__b"
                      aria-pressed={style === s.id}
                      onClick={() => setStyle(s.id)}
                      style={{ "--sw": s.swatch[2] } as React.CSSProperties}
                    >
                      <i className="kn-chips__dot" aria-hidden="true" />
                      {t(lang, s.name)}
                    </button>
                  ))}
                </div>
              </details>
            )}
            <p className="kn-flow__next">
              <button type="button" className="kn-btn kn-btn--ghost" onClick={() => jump("kn-step-2")}>
                {t(lang, f.next)} <Icon name="chevron" size={16} />
              </button>
            </p>
          </section>

          {/* ------------------------------------------------------- STEP 2 */}
          <section className="kn-flow__step" id="kn-step-2" aria-labelledby="kn-s2">
            <h3 className="kn-flow__h" id="kn-s2">
              <span>2</span> {t(lang, f.steps[1].t)}
            </h3>
            <p className="kn-flow__sub">{t(lang, occasions[occasion].namesLabel)}</p>
            <div className="kn-build__pair">
              <div className="kn-f">
                <label className="kn-f__label" htmlFor="kn-b-a">
                  {t(lang, b.a)}
                </label>
                <input
                  id="kn-b-a"
                  className="kn-f__in"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  placeholder={lang === "hy" ? "Նարե" : "Nare"}
                  maxLength={30}
                  autoComplete="off"
                  aria-invalid={errs.names ? "true" : undefined}
                />
              </div>
              <div className="kn-f">
                <label className="kn-f__label" htmlFor="kn-b-b">
                  {t(lang, b.b)}
                </label>
                <input
                  id="kn-b-b"
                  className="kn-f__in"
                  value={bName}
                  onChange={(e) => setB(e.target.value)}
                  placeholder={lang === "hy" ? "Հայկ" : "Hayk"}
                  maxLength={30}
                  autoComplete="off"
                />
              </div>
            </div>
            {errs.names && <p className="kn-f__err">{errs.names}</p>}
            <div className="kn-build__pair">
              <div className="kn-f">
                <label className="kn-f__label" htmlFor="kn-b-date">
                  {t(lang, b.date)}
                </label>
                <input
                  id="kn-b-date"
                  className="kn-f__in"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="kn-f">
                <label className="kn-f__label" htmlFor="kn-b-city">
                  {t(lang, b.city)}
                </label>
                <input
                  id="kn-b-city"
                  className="kn-f__in"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={lang === "hy" ? "Երևան" : "Yerevan"}
                  maxLength={40}
                />
              </div>
            </div>

            <fieldset className="kn-build__stops">
              <legend className="kn-f__label">{t(lang, b.stops)}</legend>
              {stops.map((s, i) => (
                <div className="kn-build__stop" key={i}>
                  <input
                    className="kn-f__in kn-build__time"
                    type="time"
                    value={s.time}
                    onChange={(e) => setStop(i, "time", e.target.value)}
                    aria-label={`${t(lang, b.stopTime)} ${i + 1}`}
                  />
                  <input
                    className="kn-f__in"
                    value={s.name}
                    onChange={(e) => setStop(i, "name", e.target.value)}
                    placeholder={t(lang, b.stopName)}
                    aria-label={`${t(lang, b.stopName)} ${i + 1}`}
                    maxLength={40}
                  />
                  <input
                    className="kn-f__in"
                    value={s.place}
                    onChange={(e) => setStop(i, "place", e.target.value)}
                    placeholder={t(lang, b.stopPlace)}
                    aria-label={`${t(lang, b.stopPlace)} ${i + 1}`}
                    maxLength={60}
                  />
                  <input
                    className="kn-f__in"
                    value={s.address}
                    onChange={(e) => setStop(i, "address", e.target.value)}
                    placeholder={t(lang, b.stopAddr)}
                    aria-label={`${t(lang, b.stopAddr)} ${i + 1}`}
                    maxLength={80}
                  />
                  {stops.length > 1 && (
                    <button
                      type="button"
                      className="kn-build__rm"
                      onClick={() => setStops((p) => p.filter((_, j) => j !== i))}
                      aria-label={`${t(lang, b.removeStop)} ${i + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {stops.length < 5 && (
                <button
                  type="button"
                  className="kn-btn kn-btn--ghost kn-build__add"
                  onClick={() => setStops((p) => [...p, EMPTY_STOP()])}
                >
                  {t(lang, b.addStop)}
                </button>
              )}
            </fieldset>

            {/* their own photographs, into the template's own plate slots */}
            <PhotoPicker lang={lang} value={photos} onChange={setPhotos} />

            <p className="kn-flow__next">
              <button type="button" className="kn-btn kn-btn--ghost" onClick={() => jump("kn-step-1")}>
                {t(lang, f.back)}
              </button>
              <button type="button" className="kn-btn kn-btn--ghost" onClick={() => jump("kn-step-3")}>
                {t(lang, f.next)} <Icon name="chevron" size={16} />
              </button>
            </p>
          </section>

          {/* ------------------------------------------------------- STEP 3 */}
          <section className="kn-flow__step" id="kn-step-3" aria-labelledby="kn-s3">
            <h3 className="kn-flow__h" id="kn-s3">
              <span>3</span> {t(lang, f.steps[2].t)}
            </h3>

            {/* On phones the phone frame is hidden — this is the preview. */}
            <p className="kn-flow__mobilePreview">
              <a
                className="kn-btn kn-btn--ghost"
                href={previewHref}
                target="_blank"
                rel="noopener"
                aria-disabled={!previewDraft}
                onClick={(e) => {
                  if (!previewDraft) e.preventDefault();
                }}
              >
                <Icon name="film" size={16} /> {t(lang, b.preview)}
              </a>
              <span className="kn-build__hint">{previewDraft ? t(lang, b.previewHint) : t(lang, f.previewEmpty)}</span>
            </p>

            <div className="kn-f">
              <label className="kn-f__label" htmlFor="kn-o-contact">
                {t(lang, f.contact)}
              </label>
              <input
                id="kn-o-contact"
                className="kn-f__in"
                type="text"
                autoComplete="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                aria-invalid={errs.contact ? "true" : undefined}
                aria-describedby={errs.contact ? "kn-o-contact-e" : undefined}
              />
              {errs.contact && (
                <p className="kn-f__err" id="kn-o-contact-e">
                  {errs.contact}
                </p>
              )}
            </div>
            <div className="kn-f">
              <label className="kn-f__label" htmlFor="kn-o-notes">
                {t(lang, f.notes)}
              </label>
              <textarea
                id="kn-o-notes"
                className="kn-f__in"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t(lang, f.notesPh)}
              />
            </div>

            <div className="kn-flow__total" role="status">
              <span>{t(lang, EX.total)}{pick ? ` — ${t(lang, pick.name)}` : ""}</span>
              <b>{total}</b>
              <small>{totalLine}</small>
            </div>

            <div className="kn-sr" aria-hidden="true">
              <label htmlFor="kn-owebsite">Website</label>
              <input id="kn-owebsite" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <p className="kn-flow__next">
              <button type="button" className="kn-btn kn-btn--ghost" onClick={() => jump("kn-step-2")}>
                {t(lang, f.back)}
              </button>
              <button type="submit" className="kn-btn" disabled={busy}>
                {t(lang, busy ? svc.order.fields.sending : b.orderThis)}
              </button>
            </p>
          </section>
        </div>

        {/* ---------------------------------------------------- THE PHONE
            ALWAYS ALIVE (2026-08-25): it used to sit as an empty «fill in the
            names» frame for the whole flow. The chosen invitation renders
            immediately with its own sample words — the same per-field
            fallback the landing's result phone trusts — and a caption says
            whose words they are until the couple's replace them. */}
        <aside className="kn-flow__phone" aria-label={t(lang, f.previewTitle)}>
          <p className="kn-flow__phoneT">{t(lang, f.previewTitle)}</p>
          <div className="kn-build__bezel">
            <iframe key={previewHref} className="kn-build__frame" src={previewHref} title={t(lang, f.previewTitle)} loading="lazy" tabIndex={-1} />
          </div>
          {!previewDraft && <p className="kn-flow__phoneNote">{t(lang, f.previewSample)}</p>}
          <a className="kn-flow__phoneOpen" href={previewHref} target="_blank" rel="noopener">
            {t(lang, b.preview)} <Icon name="arrow" size={16} />
          </a>
        </aside>
      </div>
    </form>
  );
}
