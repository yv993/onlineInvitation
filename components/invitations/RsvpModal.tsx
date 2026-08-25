"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/Icon";
import { t } from "@/lib/i18n";
import type { RenderCtx } from "@/types/invitation";

// ============================================================================
// <RsvpModal /> — the RSVP both references end with, in one component that
// renders INLINE (Invito W121: yes/no · which side · name · guest count ·
// comment · «Պատասխանել») or as a MODAL (the cinematic style: a button opens
// it — guest count selector, dietary requirement chips, allergies).
//
// Every answer POSTs to /api/rsvp tagged with the invitation's event id, so
// it lands in the same guest book (/guests, Excel export) and — when
// RSVP_WEBHOOK is set — in the couple's Google Sheet. The deadline travels
// with the answer and is enforced server-side; `stored`/`delivered` come
// back and the done state says exactly what happened.
// ============================================================================

const L = {
  title: { hy: "Խնդրում ենք հաստատել Ձեր ներկայությունը", en: "Please confirm your presence", ru: "Пожалуйста, подтвердите ваше присутствие" },
  deadline: { hy: "մինչև", en: "by", ru: "до" },
  coming: { hy: "Կկարողանա՞ք մասնակցել", en: "Will you attend?", ru: "Сможете ли вы прийти?" },
  yes: { hy: "Այո, սիրով կմասնակցեմ", en: "Certainly, I'll be there with joy", ru: "Да, приду с радостью" },
  no: { hy: "Ոչ, ցավոք չեմ կարողանա", en: "Unfortunately, I won't be able to attend", ru: "К сожалению, не смогу" },
  side: { hy: "Ու՞մ կողմից եք", en: "Whose side are you on?", ru: "С чьей вы стороны?" },
  name: { hy: "Անուն, Ազգանուն", en: "First name, last name", ru: "Имя, фамилия" },
  guests: { hy: "Հյուրերի քանակ", en: "Number of guests", ru: "Количество гостей" },
  diet: { hy: "Սնունդ", en: "Meal preference", ru: "Предпочтения в еде" },
  allergy: { hy: "Ալերգիաներ / նշումներ", en: "Allergies / notes", ru: "Аллергии / примечания" },
  message: { hy: "Մեկնաբանություն", en: "Comment", ru: "Комментарий" },
  send: { hy: "Պատասխանել", en: "Confirm", ru: "Подтвердить" },
  sending: { hy: "Ուղարկվում է…", en: "Sending…", ru: "Отправляется…" },
  open: { hy: "Հաստատել ներկայությունը", en: "RSVP", ru: "Подтвердить присутствие" },
  thanks: { hy: "Շնորհակալություն — ստացանք։", en: "Thank you — received.", ru: "Спасибо — получили." },
  thanksNo: { hy: "Ցավում ենք — շնորհակալ ենք պատասխանի համար։", en: "We'll miss you — thank you for replying.", ru: "Нам будет вас не хватать — спасибо за ответ." },
  notSent: { hy: "Գրանցվեց այս սարքում, նամակ դեռ չի ուղարկվում։", en: "Recorded on this device; no email is sent yet.", ru: "Сохранено на этом устройстве; письмо пока не отправляется." },
  again: { hy: "Փոխել պատասխանը", en: "Change answer", ru: "Изменить ответ" },
  close: { hy: "Փակել", en: "Close", ru: "Закрыть" },
  errName: { hy: "Գրեք ձեր անունը", en: "Please add your name", ru: "Напишите ваше имя" },
  errCome: { hy: "Ընտրեք պատասխանը", en: "Please choose an answer", ru: "Выберите ответ" },
  closed: { hy: "Պատասխանների ժամկետն անցել է։", en: "The RSVP deadline has passed.", ru: "Срок ответов истёк." },
  where: { hy: "Պատասխանները հավաքվում են ձեր հյուրերի ցուցակում (Excel / Google Sheets)։", en: "Answers collect in your guest list (Excel / Google Sheets).", ru: "Ответы собираются в вашем списке гостей (Excel / Google Sheets)." },
};

function useTick() { const born = useRef(Date.now()); return born; }

export function RsvpForm({ ctx, onDone }: { ctx: RenderCtx; onDone?: () => void }) {
  const { lang, data } = ctx;
  const cfg = data.features.rsvp;
  const [coming, setComing] = useState<"yes" | "no" | null>(null);
  const [side, setSide] = useState<0 | 1 | null>(null);
  const [guests, setGuests] = useState(2);
  const [diet, setDiet] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ coming: "yes" | "no"; stored: boolean; delivered: boolean } | null>(null);
  const born = useTick();
  const closed = cfg.deadline ? Date.now() > new Date(cfg.deadline).getTime() : false;
  const dl = cfg.deadline ? new Date(new Date(cfg.deadline).getTime() + 4 * 3600_000) : null;
  const dlText = dl ? (lang === "hy" ? `${dl.getUTCDate()} ${["հունվարի", "փետրվարի", "մարտի", "ապրիլի", "մայիսի", "հունիսի", "հուլիսի", "օգոստոսի", "սեպտեմբերի", "հոկտեմբերի", "նոյեմբերի", "դեկտեմբերի"][dl.getUTCMonth()]}` : `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][dl.getUTCMonth()]} ${dl.getUTCDate()}`) : "";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    if (!coming) { setErr(t(lang, L.errCome)); return; }
    if (name.length < 2) { setErr(t(lang, L.errName)); return; }
    setErr(""); setBusy(true);
    try {
      const dietWord = diet !== null && cfg.dietOptions?.[diet] ? t(lang, cfg.dietOptions[diet]) : "";
      const allergy = String(fd.get("allergy") ?? "").slice(0, 160);
      const r = await fetch("/api/rsvp", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name, guests: cfg.askGuests ? guests : 1, coming,
          side: cfg.askSide && side !== null ? (side === 0 ? "bride" : "groom") : "both",
          message: String(fd.get("message") ?? "").slice(0, 1000),
          diet: [dietWord, allergy].filter(Boolean).join(" · "),
          event: cfg.event, deadline: cfg.deadline, lang,
          elapsed: Date.now() - born.current, website: String(fd.get("website") ?? ""),
        }),
      });
      const d = (await r.json().catch(() => ({}))) as { stored?: boolean; delivered?: boolean };
      setDone({ coming, stored: Boolean(d.stored), delivered: Boolean(d.delivered) });
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="iv-rsvp__done" role="status">
        <p className="iv-rsvp__h">{t(lang, done.coming === "yes" ? L.thanks : L.thanksNo)}</p>
        {!done.delivered && <p className="iv-rsvp__soft">{t(lang, L.notSent)}</p>}
        <p className="iv-rsvp__soft">{t(lang, L.where)}</p>
        <button type="button" className="iv-btn iv-btn--ghost" onClick={() => setDone(null)}>{t(lang, L.again)}</button>
      </div>
    );
  }
  return (
    <form className="iv-rsvp__form" onSubmit={submit} noValidate>
      <p className="iv-rsvp__h">{t(lang, L.title)}{dlText ? <small> {t(lang, L.deadline)} {dlText}</small> : null}</p>
      {closed && <p className="iv-rsvp__soft">{t(lang, L.closed)}</p>}
      <fieldset className="iv-rsvp__fs">
        <legend>{t(lang, L.coming)}</legend>
        <label className={`iv-radio${coming === "yes" ? " is-on" : ""}`}><input type="radio" name="coming" checked={coming === "yes"} onChange={() => setComing("yes")} /> <span>{t(lang, L.yes)}</span></label>
        <label className={`iv-radio${coming === "no" ? " is-on" : ""}`}><input type="radio" name="coming" checked={coming === "no"} onChange={() => setComing("no")} /> <span>{t(lang, L.no)}</span></label>
      </fieldset>
      {cfg.askSide && cfg.sides && (
        <fieldset className="iv-rsvp__fs">
          <legend>{t(lang, L.side)}</legend>
          <div className="iv-chips">{cfg.sides.map((s, i) => <button key={i} type="button" className="iv-chip" aria-pressed={side === i} onClick={() => setSide(i as 0 | 1)}>{t(lang, s)}</button>)}</div>
        </fieldset>
      )}
      <label className="iv-f"><span>{t(lang, L.name)}</span><input name="name" className="iv-in" maxLength={80} autoComplete="name" required /></label>
      {cfg.askGuests && coming !== "no" && (
        <div className="iv-f">
          <span>{t(lang, L.guests)}</span>
          <div className="iv-step" role="group" aria-label={t(lang, L.guests)}>
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="−" disabled={guests <= 1}>−</button>
            <b aria-live="polite">{guests}</b>
            <button type="button" onClick={() => setGuests((g) => Math.min(cfg.maxGuests ?? 10, g + 1))} aria-label="+" disabled={guests >= (cfg.maxGuests ?? 10)}>+</button>
          </div>
        </div>
      )}
      {cfg.askDiet && cfg.dietOptions && coming !== "no" && (
        <fieldset className="iv-rsvp__fs">
          <legend>{t(lang, L.diet)}</legend>
          <div className="iv-chips">{cfg.dietOptions.map((o, i) => <button key={i} type="button" className="iv-chip" aria-pressed={diet === i} onClick={() => setDiet(diet === i ? null : i)}>{t(lang, o)}</button>)}</div>
        </fieldset>
      )}
      {cfg.askAllergy && coming !== "no" && <label className="iv-f"><span>{t(lang, L.allergy)}</span><input name="allergy" className="iv-in" maxLength={160} /></label>}
      {cfg.askMessage && <label className="iv-f"><span>{t(lang, L.message)}</span><input name="message" className="iv-in" maxLength={300} /></label>}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
      {err && <p className="iv-rsvp__err" role="alert">{err}</p>}
      <button type="submit" className="iv-btn" disabled={busy || closed}><Icon name="check" size={16} /> {busy ? t(lang, L.sending) : t(lang, L.send)}</button>
    </form>
  );
}

export default function RsvpModal({ ctx }: { ctx: RenderCtx }) {
  const { lang, data } = ctx;
  const cfg = data.features.rsvp;
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const scroll = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = scroll; prev?.focus?.(); };
  }, [open]);
  if (!cfg.enabled) return null;
  if (cfg.presentation === "inline" || ctx.compact) {
    return (
      <section className="iv-rsvp iv-rsvp--inline" id="rsvp" aria-label="RSVP" data-rise>
        <p className="iv-sec__label">RSVP</p>
        {ctx.compact ? <button type="button" className="iv-btn" disabled>{t(lang, L.open)}</button> : <RsvpForm ctx={ctx} />}
      </section>
    );
  }
  return (
    <section className="iv-rsvp iv-rsvp--modal" id="rsvp" aria-label="RSVP" data-rise>
      <p className="iv-sec__label">RSVP</p>
      <p className="iv-rsvp__lead">{t(lang, L.title)}</p>
      <button type="button" className="iv-btn" onClick={() => setOpen(true)}><Icon name="check" size={16} /> {t(lang, L.open)}</button>
      {open && createPortal(
        <div className="iv-modal" role="dialog" aria-modal="true" aria-label="RSVP">
          <div className="iv-modal__back" onClick={() => setOpen(false)} />
          <div className="iv-modal__box">
            <button ref={closeRef} type="button" className="iv-modal__x" onClick={() => setOpen(false)} aria-label={t(lang, L.close)}><Icon name="x" size={18} /></button>
            <RsvpForm ctx={ctx} />
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
