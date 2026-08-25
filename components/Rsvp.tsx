"use client";

import { useRef, useState } from "react";
import { rsvp } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// RSVP — the only thing on the card that asks the guest to do something, which
// is why it is the only band on ink. Eight screens of paper, then this.
//
// THE FIELDS ARE THE ARMENIAN ONES. "Whose guest are you — the bride's or the
// groom's" is not decoration: an Armenian wedding seats by side, and both
// references collect it because the couple's families genuinely need it. A
// generic Western RSVP form does not have this field and is the wrong form.
//
// HONESTY, the rule carried from every project in this stack: the done screen
// claims a message was delivered ONLY when the server says it actually sent
// one. With no mail transport configured, it says so in plain words rather
// than showing a green tick over nothing. `delivered` comes back from the
// route; it is not assumed from a 200.
// ============================================================================

type Side = "bride" | "groom" | "both";
type Coming = "yes" | "no";
type Errors = Partial<Record<"name" | "guests" | "coming", string>>;

export default function Rsvp({
  lang,
  guest,
  closed,
  askSide = true,
}: {
  lang: Lang;
  guest: string;
  closed: boolean;
  /** Weddings and engagements seat by side; a birthday or a company gala
   *  does not, and asking "whose guest are you" there is a wrong question. */
  askSide?: boolean;
}) {
  const f = rsvp.fields;
  const form = useRef<HTMLFormElement | null>(null);
  // The moment the form was rendered. A submission that arrives less than two
  // seconds later was not typed by a person.
  const born = useRef(Date.now());

  const [side, setSide] = useState<Side>("both");
  const [coming, setComing] = useState<Coming | null>(null);
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState<Errors>({});
  const [done, setDone] = useState<{ coming: Coming; delivered: boolean; stored: boolean } | null>(
    null,
  );

  if (closed && !done) {
    return (
      <section className="kn-band kn-rsvp">
        <div className="kn-col kn-rsvp__head">
          <h2 className="kn-h2">{t(lang, rsvp.title)}</h2>
          <p className="kn-lead kn-rsvp__lead">{t(lang, rsvp.closed)}</p>
        </div>
      </section>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;

    const fd = new FormData(e.currentTarget);
    const next: Errors = {};
    const name = String(fd.get("name") ?? "").trim();
    const guests = Number(fd.get("guests") ?? 0);

    if (name.length < 2) next.name = lang === "hy" ? "Գրեք ձեր անունը" : "Please add your name";
    if (!Number.isFinite(guests) || guests < 1 || guests > 20)
      next.guests = lang === "hy" ? "1-ից 20" : "Between 1 and 20";
    if (!coming) next.coming = lang === "hy" ? "Ընտրեք պատասխանը" : "Please choose an answer";

    setErrs(next);
    if (Object.keys(next).length) {
      // Focus the first thing that is wrong. Scrolling a guest to a form that
      // silently refused to submit is how RSVPs get abandoned.
      const first = form.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          guests,
          side,
          coming,
          message: String(fd.get("message") ?? "").slice(0, 1000),
          plusOne: String(fd.get("plusOne") ?? "").slice(0, 160),
          diet: String(fd.get("diet") ?? "").slice(0, 160),
          lang,
          from: guest || null,
          // honeypot + elapsed, both checked server-side
          website: String(fd.get("website") ?? ""),
          elapsed: Date.now() - born.current,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        delivered?: boolean;
        stored?: boolean;
        errors?: Errors;
      };

      if (res.status === 422 && data.errors) {
        setErrs(data.errors);
        setBusy(false);
        return;
      }

      setDone({
        coming: coming!,
        delivered: Boolean(data.delivered),
        stored: Boolean(data.stored),
      });
    } catch {
      setErrs({
        name: lang === "hy" ? "Չհաջողվեց ուղարկել։ Փորձեք նորից։" : "Could not send. Please try again.",
      });
      setBusy(false);
    }
  };

  if (done) {
    return (
      <section className="kn-band kn-rsvp">
        <div className="kn-col">
          <div className="kn-rsvp__done" role="status">
            <h3>{t(lang, done.coming === "yes" ? rsvp.doneYes : rsvp.doneNo)}</h3>
            {/* The caveat appears only when the answer reached NEITHER the
                couple's guest book NOR any mail transport — recorded on this
                device and nowhere else. Stored-but-not-emailed is a fine
                outcome (the dashboard has it) and gets no warning. */}
            {!done.delivered && !done.stored && (
              <p className="kn-rsvp__caveat">{t(lang, rsvp.undelivered)}</p>
            )}
            {/* Plans change — Greenvelope lets a guest revise an answer, and a
                card that locks the first tap forever collects stale data. A
                revised answer is simply a newer row in the guest book. */}
            <button
              type="button"
              className="kn-btn kn-btn--ghost kn-rsvp__again"
              onClick={() => {
                setDone(null);
                setBusy(false);
                born.current = Date.now();
              }}
            >
              {t(lang, rsvp.change)}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const sides: Array<[Side, string]> = [
    ["bride", t(lang, f.sideBride)],
    ["groom", t(lang, f.sideGroom)],
    ["both", t(lang, f.sideBoth)],
  ];

  return (
    <section className="kn-band kn-rsvp" aria-labelledby="kn-rsvp-t">
      <div className="kn-col">
        <div className="kn-rsvp__head">
          <h2 className="kn-h2" id="kn-rsvp-t" data-rise>
            {t(lang, rsvp.title)}
          </h2>
          <p className="kn-lead kn-rsvp__lead" data-rise>
            {t(lang, rsvp.lead)}
          </p>
        </div>

        {/* noValidate so the chip pickers and the browser never disagree about
            what "required" means — every rule is enforced once, in submit(). */}
        <form className="kn-rsvp__form" ref={form} onSubmit={submit} noValidate>
          <div className="kn-f">
            <label className="kn-f__label" htmlFor="kn-name">
              {t(lang, f.name)}
            </label>
            <input
              id="kn-name"
              name="name"
              className="kn-f__in"
              type="text"
              autoComplete="name"
              defaultValue={guest}
              aria-invalid={errs.name ? "true" : undefined}
              aria-describedby={errs.name ? "kn-name-e" : undefined}
            />
            {errs.name && (
              <p className="kn-f__err" id="kn-name-e">
                {errs.name}
              </p>
            )}
          </div>

          <div className="kn-f">
            <label className="kn-f__label" htmlFor="kn-guests">
              {t(lang, f.guests)}
            </label>
            <input
              id="kn-guests"
              name="guests"
              className="kn-f__in"
              type="number"
              min={1}
              max={20}
              defaultValue={2}
              inputMode="numeric"
              aria-invalid={errs.guests ? "true" : undefined}
              aria-describedby={errs.guests ? "kn-guests-e" : undefined}
            />
            {errs.guests && (
              <p className="kn-f__err" id="kn-guests-e">
                {errs.guests}
              </p>
            )}
          </div>

          {/* Grouped buttons, not a listbox. `role=group` + aria-pressed is the
              pattern that actually works in screen readers; an ARIA listbox
              needs roving tabindex and arrow-key handling to be correct, and
              almost nobody ships that. */}
          {askSide && (
          <div className="kn-f" role="group" aria-labelledby="kn-side-l">
            <span className="kn-f__label" id="kn-side-l">
              {t(lang, f.side)}
            </span>
            <div className="kn-chips">
              {sides.map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  className="kn-chips__b"
                  aria-pressed={side === v}
                  onClick={() => setSide(v)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          )}

          <div className="kn-f" role="group" aria-labelledby="kn-come-l">
            <span className="kn-f__label" id="kn-come-l">
              {t(lang, f.coming)}
            </span>
            {/* NAIVA marks these two answers with 🥂 and 🕊️. The idea is right
                — the answers deserve their marks — but emoji render as whatever
                the platform ships (Windows' dove and Android's dove are
                different birds). Inline SVG keeps the drawing ours: coupe
                glasses for yes, the dove for no, both in currentColor so they
                follow the chip's own state. */}
            <div className="kn-chips">
              {(["yes", "no"] as Coming[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  className="kn-chips__b"
                  aria-pressed={coming === v}
                  aria-invalid={errs.coming && !coming ? "true" : undefined}
                  onClick={() => {
                    setComing(v);
                    setErrs((p) => ({ ...p, coming: undefined }));
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "0.45em", verticalAlign: "-0.14em" }}
                  >
                    {v === "yes" ? (
                      <>
                        {/* two coupes, tipped together */}
                        <path d="M 3 3 L 8 5.5 Q 8.6 8.6 6.4 9.7 Q 4.2 10.4 2.8 7.9 Z" />
                        <path d="M 5.6 9.9 L 4.4 16.5 M 2.6 17 L 6.4 16" />
                        <path d="M 17 3 L 12 5.5 Q 11.4 8.6 13.6 9.7 Q 15.8 10.4 17.2 7.9 Z" />
                        <path d="M 14.4 9.9 L 15.6 16.5 M 13.6 16 L 17.4 17" />
                      </>
                    ) : (
                      <>
                        {/* the dove */}
                        <path d="M 3 11 Q 7 12.5 10.5 11 Q 10 8 12 6.2 Q 14.4 4.4 17 5.6 L 15.4 7 L 17.6 8 Q 16 12.6 11.8 13.8 Q 7.5 15 3.8 12.8 Z" />
                        <path d="M 8.5 11.6 Q 9.5 9 12 8" />
                      </>
                    )}
                  </svg>
                  {t(lang, v === "yes" ? f.yes : f.no)}
                </button>
              ))}
            </div>
            {errs.coming && <p className="kn-f__err">{errs.coming}</p>}
          </div>

          {/* Only asked of guests who are COMING — a declining guest has no
              caterer to inform and no seat to name. */}
          {coming === "yes" && (
            <>
              <div className="kn-f">
                <label className="kn-f__label" htmlFor="kn-plus">
                  {t(lang, f.plusOne)}
                </label>
                <input
                  id="kn-plus"
                  name="plusOne"
                  className="kn-f__in"
                  type="text"
                  autoComplete="off"
                  maxLength={160}
                />
              </div>
              <div className="kn-f">
                <label className="kn-f__label" htmlFor="kn-diet">
                  {t(lang, f.diet)}
                </label>
                <input
                  id="kn-diet"
                  name="diet"
                  className="kn-f__in"
                  type="text"
                  placeholder={t(lang, f.dietPh)}
                  autoComplete="off"
                  maxLength={160}
                />
              </div>
            </>
          )}

          <div className="kn-f">
            <label className="kn-f__label" htmlFor="kn-msg">
              {t(lang, f.message)}
            </label>
            <textarea id="kn-msg" name="message" className="kn-f__in" rows={3} />
          </div>

          {/* The honeypot. Off-screen rather than display:none — some bots skip
              hidden fields but happily fill a positioned one — and explicitly
              removed from the tab order and the accessibility tree. */}
          <div className="kn-sr" aria-hidden="true">
            <label htmlFor="kn-website">Website</label>
            <input id="kn-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <button type="submit" className="kn-btn kn-rsvp__send" disabled={busy}>
            {t(lang, busy ? f.sending : f.send)}
          </button>
        </form>
      </div>
    </section>
  );
}
