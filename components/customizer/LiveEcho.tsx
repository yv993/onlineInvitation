"use client";

import { useWizard } from "./WizardContext";
import { findExample } from "@/lib/examples";
import { occasions, occasionJoinsPeople, wizard, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// THE LIVE ECHO — the wizard's answer to the DOHERTY THRESHOLD.
//
// Measured on this page before it existed (2026-09-08, dev server): typing a
// name produced NO reaction anywhere on the page — `document.body.textContent`
// never contained what had just been typed. The only feedback was the Preview
// button, which frames the real invitation in an iframe: 3,008 ms to first
// show the typed name. The threshold is 400 ms. Between those two numbers a
// couple types their own names into a form that says nothing back.
//
// This is NOT the old five-preview column (deleted 2026-08-30; CSS section 52
// centred the form and sent PREVIEW off-page deliberately, and that decision
// stands — five iframes re-rendering per keystroke is what made the column
// expensive). It is the cheapest possible acknowledgement: text nodes and a
// palette, one React render, no iframe, no image, no timer. It cannot be slow
// because there is nothing in it to be slow.
//
// It carries three jobs at once:
//   · DOHERTY — the words change in the same frame as the keystroke.
//   · ZEIGARNIK — the "still needed" line names the open loop, so the form
//     reads as a thing being finished rather than a thing being filled.
//   · PARKINSON — that line is also the time box: the work is bounded and
//     visible (two names and a date), not an unknown length of form.
//
// NOT an aria-live region, deliberately: this changes on every keystroke, and
// a polite live region would read the whole card back after every letter. It
// is a labelled region a screen-reader user can visit when they choose.
// ============================================================================

/** Written out here rather than imported: lib/kids and lib/wcards each carry
 *  their month names next to several hundred lines of card DATA, and Intl's
 *  hy-AM month forms differ between engines — which is a hydration mismatch
 *  waiting to happen on a component that renders before and after typing. */
const MONTHS: Record<string, string[]> = {
  hy: ["հունվարի", "փետրվարի", "մարտի", "ապրիլի", "մայիսի", "հունիսի", "հուլիսի", "օգոստոսի", "սեպտեմբերի", "հոկտեմբերի", "նոյեմբերի", "դեկտեմբերի"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
};

function dateLine(lang: Lang, date: string, time: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return "";
  const months = MONTHS[lang] ?? MONTHS.en;
  const day = Number(m[3]);
  const month = months[Number(m[2]) - 1] ?? "";
  const year = m[1];
  const stamp = lang === "en" ? `${month} ${day}, ${year}` : `${day} ${month} ${year}`;
  if (!time) return stamp;
  return lang === "en" ? `${stamp} at ${time}` : `${stamp}, ժ. ${time}`;
}

export default function LiveEcho({ lang }: { lang: Lang }) {
  const { s } = useWizard();
  const pick = findExample(s.tpl);
  const joins = occasionJoinsPeople(s.occasion);

  // typed words win; the design's own sample words hold the shape until then,
  // tagged so nobody mistakes a placeholder for their own card (the tagging
  // convention the previews column used, kept)
  const aTyped = s.a.trim().length > 0;
  const bTyped = (s.b ?? "").trim().length > 0;
  const a = aTyped ? s.a.trim() : pick ? t(lang, pick.sample.a) : "";
  const b = bTyped ? (s.b ?? "").trim() : pick?.sample.b && joins ? t(lang, pick.sample.b) : "";
  const line = dateLine(lang, s.date, s.time);
  const place = [s.venue, s.city].map((x) => (x ?? "").trim()).filter(Boolean).join(" · ");

  // what still stands between this draft and a link it can mint
  const missing: string[] = [];
  if (!aTyped) missing.push(t(lang, wizard.hostA).toLocaleLowerCase(lang === "hy" ? "hy-AM" : "en"));
  if (joins && !bTyped) missing.push(t(lang, wizard.hostB).toLocaleLowerCase(lang === "hy" ? "hy-AM" : "en"));
  if (!s.date) missing.push(t(lang, wizard.date).toLocaleLowerCase(lang === "hy" ? "hy-AM" : "en"));

  const [bg, accent, ink] = pick?.palette ?? ["var(--paper-deep)", "var(--btn)", "var(--ink)"];

  return (
    <section
      className="kn-echo"
      aria-labelledby="kn-echo-h"
      data-dark={pick?.dark ? "" : undefined}
      style={{ ["--ec-bg" as string]: bg, ["--ec-accent" as string]: accent, ["--ec-ink" as string]: ink }}
    >
      <header className="kn-echo__head">
        <h2 className="kn-echo__h" id="kn-echo-h">{t(lang, wizard.echoTitle)}</h2>
        {pick && <p className="kn-echo__pick">{t(lang, pick.name)}</p>}
      </header>

      <div className="kn-echo__card">
        <p className="kn-echo__kicker">{t(lang, occasions[s.occasion].kicker)}</p>
        <p className="kn-echo__names">
          {a || "…"}
          {b && <span className="kn-echo__amp"> {joins ? "&" : "·"} </span>}
          {b}
        </p>
        {line && <p className="kn-echo__when">{line}</p>}
        {place && <p className="kn-echo__where">{place}</p>}
        {/* the tag stands whenever ANY word on the card is still the design's
            own — a typed first name beside a sample second name is exactly
            the case that reads as real and is not */}
        {pick && (!aTyped || (joins && !bTyped)) && <p className="kn-echo__tag">{t(lang, wizard.echoSample)}</p>}
      </div>

      <p className="kn-echo__left">
        {missing.length === 0
          ? t(lang, wizard.echoReady)
          : `${t(lang, wizard.echoLeft)} ${missing.join(", ")}`}
      </p>
    </section>
  );
}
