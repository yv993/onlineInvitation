"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import Share from "@/components/Share";
import { Countdown, MapCard } from "@/components/templates/blocks/Blocks";
import { kids as K, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Draft } from "@/lib/draft";
import { kidsDateLine, sampleKids, type KidsCard, type Variant } from "@/lib/kids";
import KidsCardFace from "./KidsCardFace";
import MotifSprite from "./Motifs";

// ============================================================================
// THE GUEST LINK for a kids' card — /invitation/kids-<card>-<variant>?p=…
// or the short id the studio minted.
//
// The card comes out of its envelope (the reference animates this too), then
// the details the card already carries repeat below in tappable form: date
// with a countdown, place with a map button, add-to-calendar, the parents'
// line, and the RSVP — which asks what the parent chose to ask: adult and
// child headcounts, allergies. Answers go to /api/rsvp tagged with this
// event, so they land in the same guest book and Excel export.
// ============================================================================

export default function KidsInvitation({ lang, card, variant, draft, blob , eventId }: { lang: Lang; card: KidsCard; variant: Variant; draft?: Draft; blob?: string   /** a minted link's id — RSVPs tag with THIS so each link keeps its own list */
  eventId?: string;
}) {
  const base = lang === "hy" ? "" : "/en";
  const sample = !draft;
  const sk = sampleKids[0];
  const name = draft?.a ?? sk[lang];
  const age = draft?.age ?? sk.age;
  const date = draft?.date ?? "2026-11-08";
  const time = draft?.time ?? "12:00";
  const venue = draft?.venue ?? (lang === "hy" ? "Play Park" : "Play Park");
  const address = draft?.address ?? (lang === "hy" ? "Կոմիտաս 12" : "12 Komitas Ave");
  const city = draft?.city || (lang === "hy" ? "Երևան" : "Yerevan");
  const iso = `${date}T${time}:00+04:00`;
  const ask = draft?.ask ?? ["counts", "allergy"];
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const reduce = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const id = window.setTimeout(() => setOpen(true), reduce ? 0 : 900);
    return () => window.clearTimeout(id);
  }, []);

  const style = {
    "--ki-paper": variant.paper, "--ki-ink": variant.ink, "--ki-a": variant.a, "--ki-b": variant.b, "--ki-c": variant.c, "--ki-d": variant.d,
    "--ki-back": variant.backdrop, "--ki-env": variant.env, "--ki-liner": variant.liner,
    // the shared blocks (Countdown, MapCard) wear the template tokens
    "--tp-bg": variant.paper, "--tp-fg": variant.ink, "--tp-soft": `color-mix(in srgb, ${variant.ink} 70%, ${variant.paper})`, "--tp-acc": variant.a, "--tp-acc-ink": variant.a, "--tp-panel": variant.dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
    "--f-tp": "var(--f-kids)",
  } as React.CSSProperties;

  return (
    <div className={`kn-ki${variant.dark ? " kn-ki--dark" : ""}${open ? " kn-ki--open" : ""}`} style={style} data-tpl={`kids-${card.id}-${variant.id}`}>
      <MotifSprite />
      <div className="kn-ki__chrome">
        <Link href={`${base}/kids`} className="kn-tp__back"><Icon name="chevron" size={16} /> ԿՆԻՔ</Link>
        <Link href={`${lang === "hy" ? "/en" : ""}/invitation/kids-${card.id}-${variant.id}${blob ? `?p=${blob}` : ""}`} className="kn-tp__lang">{lang === "hy" ? "EN" : "ՀԱՅ"}</Link>
      </div>

      {/* ------------------------------------------------- THE ENVELOPE */}
      <section className="kn-ki__hero" aria-label={t(lang, K.cardTab)}>
        <div className={`kn-ki__env${card.shape === "landscape" ? " kn-ki__env--land" : ""}`}>
          <span className="kn-ki__envBack" aria-hidden="true" />
          <span className="kn-ki__envLiner" aria-hidden="true" />
          <div className="kn-ki__card">
            <KidsCardFace card={card} variant={variant} lang={lang} details name={name} age={age} second={draft?.b ? { name: draft.b } : undefined} date={date} time={time} venue={venue} address={address} city={draft?.city || undefined} note={draft?.note} host={draft?.host} rsvpBy={draft?.rsvpBy} photo={draft?.photo} sample={sample} />
          </div>
          <span className="kn-ki__envPocket" aria-hidden="true" />
          {!open && (
            <button type="button" className="kn-btn kn-ki__open" onClick={() => setOpen(true)}>{t(lang, K.open2)}</button>
          )}
        </div>
      </section>

      {/* -------------------------------------------------- THE DETAILS */}
      <main className="kn-ki__main" id="card">
        <section className="kn-ki__grid">
          <div className="kn-tb kn-ki__when">
            <p className="kn-tb__label">{t(lang, K.when)}</p>
            <h3>{kidsDateLine(lang, date, "")}</h3>
            <p className="kn-tb__soft">{time}</p>
            <a className="kn-tb__btn" href={`/api/ics?p=${blob ?? ""}${blob ? "" : `&t=birthday-1`}`} download={`${date}.ics`}>
              <Icon name="calendar" size={16} /> {lang === "hy" ? "Ավելացնել օրացույցում" : "Add to calendar"}
            </a>
          </div>
          <Countdown lang={lang} iso={iso} />
          <MapCard lang={lang} venue={venue} address={address} city={city} url={draft?.map} />
          {(draft?.note || draft?.host || sample) && (
            <div className="kn-tb kn-ki__note">
              {(draft?.note || sample) && <p className="kn-ki__noteText">“{draft?.note ?? t(lang, K.notePh)}”</p>}
              {(draft?.host || sample) && (<><p className="kn-tb__label">{t(lang, K.fromParents)}</p><h3>{draft?.host ?? t(lang, K.hostPh)}</h3></>)}
            </div>
          )}
          <KidsRsvp lang={lang} event={eventId ?? `kids-${card.id}`} deadline={draft?.rsvpBy} askCounts={ask.includes("counts")} askAllergy={ask.includes("allergy")} />
          <div className="kn-tb kn-ki__share">
            <Share lang={lang} />
          </div>
        </section>
        <footer className="kn-ki__foot">
          <p>{name} · {age}</p>
          <small>ԿՆԻՔ — {sample ? t(lang, K.sample) : lang === "hy" ? "թվային հրավեր" : "digital invitation"}</small>
        </footer>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------- RSVP
function KidsRsvp({ lang, event, deadline, askCounts, askAllergy }: { lang: Lang; event: string; deadline?: string; askCounts: boolean; askAllergy: boolean }) {
  const [coming, setComing] = useState<"yes" | "no">("yes");
  const [adults, setAdults] = useState(2);
  const [kidsN, setKidsN] = useState(1);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ stored: boolean; delivered: boolean } | null>(null);
  const [err, setErr] = useState("");
  const born = useRef(Date.now());
  const closed = deadline ? Date.now() > new Date(`${deadline}T23:59:00+04:00`).getTime() : false;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    if (name.length < 2) { setErr(t(lang, K.errName)); return; }
    const total = askCounts ? adults + kidsN : Number(fd.get("guests") ?? 1);
    if (coming === "yes" && total < 1) { setErr(t(lang, K.errCount)); return; }
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/rsvp", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name, guests: Math.max(1, total), side: "both", coming, message: String(fd.get("message") ?? "").slice(0, 1000), lang,
          adults: askCounts ? adults : undefined, kids: askCounts ? kidsN : undefined, allergy: askAllergy ? String(fd.get("allergy") ?? "").slice(0, 160) : undefined,
          event, deadline: deadline ? `${deadline}T23:59:00+04:00` : undefined,
          elapsed: Date.now() - born.current, website: String(fd.get("website") ?? ""),
        }),
      });
      const d = (await r.json().catch(() => ({}))) as { stored?: boolean; delivered?: boolean };
      setDone({ stored: Boolean(d.stored), delivered: Boolean(d.delivered) });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="kn-tb kn-ki__rsvp" role="status">
        <p className="kn-tb__label">{t(lang, K.rsvpTitle)}</p>
        <h3>{t(lang, K.thanks)}</h3>
        {!done.delivered && <p className="kn-tb__soft">{t(lang, K.notSent)}</p>}
        <button type="button" className="kn-tb__btn" onClick={() => setDone(null)}>{t(lang, K.again)}</button>
      </div>
    );
  }
  return (
    <form className="kn-tb kn-ki__rsvp" onSubmit={submit} noValidate>
      <p className="kn-tb__label">{t(lang, K.rsvpTitle)}</p>
      {closed && <p className="kn-tb__soft">{lang === "hy" ? "Պատասխանների ժամկետն անցել է։" : "The RSVP deadline has passed."}</p>}
      <div className="kn-chips" role="radiogroup" aria-label={t(lang, K.rsvpTitle)}>
        <button type="button" role="radio" aria-checked={coming === "yes"} aria-pressed={coming === "yes"} className="kn-chips__b" onClick={() => setComing("yes")}>{t(lang, K.yes)}</button>
        <button type="button" role="radio" aria-checked={coming === "no"} aria-pressed={coming === "no"} className="kn-chips__b" onClick={() => setComing("no")}>{t(lang, K.no)}</button>
      </div>
      <label className="kn-f"><span className="kn-f__label">{t(lang, K.yourName)}</span><input name="name" className="kn-f__in" maxLength={80} autoComplete="name" required /></label>
      {coming === "yes" && (
        askCounts ? (
          <div className="kn-ki__counts">
            <Stepper label={t(lang, K.adults)} value={adults} onChange={setAdults} />
            <Stepper label={t(lang, K.children)} value={kidsN} onChange={setKidsN} min={0} />
          </div>
        ) : (
          <label className="kn-f"><span className="kn-f__label">{lang === "hy" ? "Քանի հոգի եք" : "How many of you"}</span><input name="guests" className="kn-f__in" type="number" min={1} max={20} defaultValue={2} /></label>
        )
      )}
      {coming === "yes" && askAllergy && (
        <label className="kn-f"><span className="kn-f__label">{t(lang, K.allergy)}</span><input name="allergy" className="kn-f__in" maxLength={160} placeholder={t(lang, K.allergyPh)} /></label>
      )}
      <label className="kn-f"><span className="kn-f__label">{t(lang, K.message)}</span><input name="message" className="kn-f__in" maxLength={300} /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
      {err && <p className="kn-f__err" role="alert">{err}</p>}
      <button type="submit" className="kn-tb__btn" disabled={busy || closed}>
        <Icon name="check" size={16} /> {busy ? t(lang, K.sending) : t(lang, K.send)}
      </button>
    </form>
  );
}

function Stepper({ label, value, onChange, min = 1, max = 20 }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <div className="kn-ki__step">
      <span className="kn-f__label">{label}</span>
      <div className="kn-ki__stepC">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="−" disabled={value <= min}>−</button>
        <b aria-live="polite">{value}</b>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="+" disabled={value >= max}>+</button>
      </div>
    </div>
  );
}
