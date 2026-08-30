"use client";

import { useMemo, useState } from "react";
import WMotifSprite from "@/components/wcards/WMotifs";
import ExampleDeck from "@/components/customizer/ExampleDeck";
import ExampleDetail from "@/components/customizer/ExampleDetail";
import { examples as C, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { examplesFor } from "@/lib/examples";

// ============================================================================
// WEDDING EXAMPLES — the wedding topic's own catalogue on /wedding-live:
// every wedding example (web pages, engine styles, cards in an envelope) on
// its own card, each with VIEW DETAILS → its own window (the live page in a
// phone frame, the section order, what is included, the price) without
// leaving the page; CHOOSE / «Build on it» hands the example to the wizard.
//
// THE DECK, not a grid — the client's call, and the same pile the wizard's
// picker shows: the cards are fanned, one at the front, and a drag turns them.
// The physics live in components/ui/StackDeck.tsx, the card in
// components/customizer/ExampleDeck.tsx; the filter and the detail window are
// unchanged, and the window still walks the same list the deck holds.
// ============================================================================

export default function WeddingExamples({ lang }: { lang: Lang }) {
  const base = lang === "hy" ? "" : "/en";
  // CARDS ONLY (2026-08-29). The deck used to fan all 23 wedding examples —
  // web pages, engine styles and envelope cards together, with chips to sort
  // them. This chapter is now the CARD chapter: the tactile, physical one. The
  // web pages and engine styles keep their own homes at /templates and
  // /wedding-live, and the kind chips are gone because there is nothing left
  // to switch between.
  const shown = useMemo(() => examplesFor("wedding").filter((e) => e.kind === "card"), []);
  const [detail, setDetail] = useState<number | null>(null);

  // THE VISITOR'S OWN WORDS. Every card renders live from `face`, so a name
  // typed here lands on all of them at once — the same per-field fallback the
  // rest of the site uses, so nothing ever goes blank: an empty box keeps the
  // sample couple rather than showing an unnamed card.
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [date, setDate] = useState("");
  const face = useMemo(
    () => ({ a: a.trim() || undefined, b: b.trim() || undefined, date: date || undefined }),
    [a, b, date],
  );

  // what they typed rides into the wizard, so it is never asked for twice
  const chooseHref = (id: string) => {
    const q = new URLSearchParams({ category: "wedding", tpl: id });
    if (a.trim()) q.set("a", a.trim());
    if (b.trim()) q.set("b", b.trim());
    if (date) q.set("date", date);
    return `${base}/customize?${q.toString()}`;
  };
  return (
    <section className="kn-exw" id="examples" aria-label={t(lang, C.gridKicker)}>
      <WMotifSprite />
      <div className="kn-exw__head">
        {/* the chapter's name: authored centred, walked left-and-smaller by
            the scroll (data-shift — the reference portfolio's chapter move).
            The wrapper itself carries no data-rise: two writers on one
            transform would fight; the children rise on their own. */}
        <div className="kn-ch__head" data-shift>
          <p className="kn-label" data-rise>{t(lang, C.gridKicker)} <small>· {shown.length} {t(lang, C.count)}</small></p>
          <h2 className="kn-h2" data-rise>{t(lang, C.gridTitle)}</h2>
        </div>
        <p className="kn-lead" data-rise>{t(lang, C.gridLead)}</p>
        {/* the fields, on the chapter itself. Three boxes is the whole set:
            the two names and the day are what a card SHOWS at this size —
            venue and city belong in the wizard, where there is room for them */}
        <div className="kn-exw__fields" data-rise>
          <span className="kn-exw__fieldsL">{t(lang, C.fieldsLabel)}</span>
          <label className="kn-exw__field">
            <span className="kn-f__label">{t(lang, C.fieldA)}</span>
            <input className="kn-f__in" value={a} onChange={(e) => setA(e.target.value)} placeholder="Նարե" autoComplete="off" maxLength={40} />
          </label>
          <label className="kn-exw__field">
            <span className="kn-f__label">{t(lang, C.fieldB)}</span>
            <input className="kn-f__in" value={b} onChange={(e) => setB(e.target.value)} placeholder="Հայկ" autoComplete="off" maxLength={40} />
          </label>
          <label className="kn-exw__field">
            <span className="kn-f__label">{t(lang, C.fieldDate)}</span>
            <input className="kn-f__in" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <p className="kn-exw__fieldsHint" aria-live="polite">
            {a.trim() || b.trim() || date ? "" : t(lang, C.fieldsHint)}
          </p>
        </div>
      </div>
      <ExampleDeck lang={lang} list={shown} chooseHref={chooseHref} onDetails={setDetail} face={face} />
      {detail !== null && shown[detail] && (
        <ExampleDetail lang={lang} list={shown} index={detail} onIndex={setDetail} onClose={() => setDetail(null)} chooseHref={chooseHref} editable face={face} />
      )}
    </section>
  );
}
