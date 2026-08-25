"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import StackDeck from "@/components/ui/StackDeck";
import ExampleThumb from "./ExampleThumb";
import { FEAT_ICON, KIND_ICON } from "./ExampleCard";
import { examples as C, type Lang, type T } from "@/lib/content";
import { t } from "@/lib/i18n";
import { priceLabel, styleLetter, tierName, type Example } from "@/lib/examples";

// ============================================================================
// THE WEDDING EXAMPLES, AS A DECK — the pile the client asked for: every
// wedding invitation on its own card, fanned, one at the front, turned by
// dragging. The physics are in components/ui/StackDeck.tsx; what lives here is
// what a card SAYS.
//
// The reference's card is a photograph with a badge and a title that fades
// out on the cards behind. Ours is the same card, with the same fades — except
// that the picture is THE INVITATION ITSELF, rendered live at phone width
// (ExampleThumb, the same one the grid and the wizard use), and the caption
// carries what a couple actually weighs: the name, the line, what it does, and
// THE PRICE.
//
// The two verbs do NOT ride the card. They sit in the bar below it, always in
// the same place, always clickable — a card whose buttons fade out with it is
// a card whose buttons cannot be trusted. The bar names what it is acting on.
// ============================================================================

const L = {
  drag: { hy: "Քաշեք՝ թերթելու համար", en: "Drag to browse", ru: "Перетащите, чтобы листать" },
  show: { hy: "Ցույց տալ", en: "Show", ru: "Показать" },
  showing: { hy: "Առջևում", en: "At the front", ru: "Впереди" },
} satisfies Record<string, T>;

export default function ExampleDeck({ lang, list, chosenId, onChoose, chooseHref, onDetails }: {
  lang: Lang;
  list: Example[];
  /** the wizard marks its pick; the showcase has none */
  chosenId?: string;
  onChoose?: (id: string) => void;
  chooseHref?: (id: string) => string;
  onDetails: (i: number) => void;
}) {
  const [i, setI] = useState(0);
  // The list can change under the deck (the kind filter, another occasion) —
  // and a chosen example arrives with its own place in it. Keyed on WHAT the
  // list holds, not on the array: a parent that rebuilds it every render would
  // otherwise send the deck back to the first card on every keystroke.
  const sig = list.map((e) => e.id).join("|");
  const start = useMemo(() => {
    const at = chosenId ? list.findIndex((e) => e.id === chosenId) : -1;
    return at > 0 ? at : 0;
    // the pick only decides where the deck OPENS, so this is read once per list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  // a narrowed list is a new pile: it opens at its own first card
  useEffect(() => { setI(start); }, [sig, start]);
  const at = Math.min(i, Math.max(0, list.length - 1));
  const cur = list[at];

  const cells = useMemo(
    () => list.map((e) => ({
      key: e.id,
      label: `${t(lang, L.show)} — ${t(lang, e.name)}`,
      node: <DeckCard e={e} lang={lang} chosen={chosenId === e.id} />,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sig, lang, chosenId],
  );

  if (!cur) return null;
  const chosen = chosenId === cur.id;

  return (
    <div className="kn-dk">
      <StackDeck cells={cells} index={at} onIndex={setI} label={t(lang, C.title)} />

      <div className="kn-dk__bar">
        <button type="button" className="kn-dk__arrow" aria-label={t(lang, C.prev)} disabled={list.length < 2} onClick={() => setI((n) => (n - 1 + list.length) % list.length)}>
          <Icon name="chevron" size={16} className="kn-wz__flip" />
        </button>
        <p className="kn-dk__now" aria-live="polite">
          <b>{t(lang, cur.name)}</b>
          <small>
            <Icon name={KIND_ICON[cur.kind]} size={11} /> {t(lang, C.kinds[cur.kind])}
            {styleLetter(cur) ? ` · ${styleLetter(cur)}` : ""} · {priceLabel(cur)} · {t(lang, tierName(cur.tier))}
          </small>
        </p>
        <button type="button" className="kn-dk__arrow" aria-label={t(lang, C.next)} disabled={list.length < 2} onClick={() => setI((n) => (n + 1) % list.length)}>
          <Icon name="chevron" size={16} />
        </button>
      </div>

      <div className="kn-dk__acts">
        <button type="button" className="kn-chip kn-chip--detail" onClick={() => onDetails(at)}>
          <Icon name="film" size={13} /> {t(lang, C.details)}
        </button>
        {onChoose ? (
          <button type="button" className={`kn-chip${chosen ? " kn-chip--on" : ""}`} aria-pressed={chosen} onClick={() => onChoose(cur.id)}>
            {chosen ? <><Icon name="check" size={13} /> {t(lang, C.chosen)}</> : t(lang, C.choose)}
          </button>
        ) : chooseHref ? (
          <Link className="kn-chip" href={chooseHref(cur.id)}>{t(lang, C.choose)}</Link>
        ) : null}
        <small className="kn-dk__count">{at + 1} {t(lang, C.of)} {list.length} · {t(lang, L.drag)}</small>
      </div>

      {list.length > 1 && (
        <ol className="kn-dk__dots" aria-label={t(lang, L.showing)}>
          {list.map((e, n) => (
            <li key={e.id}>
              <button
                type="button"
                className={`kn-dk__dot${n === at ? " is-on" : ""}${chosenId === e.id ? " is-pick" : ""}`}
                aria-label={t(lang, e.name)}
                aria-current={n === at ? "true" : undefined}
                onClick={() => setI(n)}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** one example on a deck card: the invitation's own first screen, a badge, and
 *  the caption that belongs to the card at the front */
function DeckCard({ e, lang, chosen }: { e: Example; lang: Lang; chosen?: boolean }) {
  const letter = styleLetter(e);
  return (
    <article className={`kn-dk__card${e.dark ? " kn-dk__card--dark" : ""}${chosen ? " is-pick" : ""}`} style={{ background: e.palette[0] }} data-id={e.id} data-kind={e.kind}>
      {/* `.kn-ex__media` on purpose: Motion skips what is inside it, so the
          invitation is its finished first screen and not a parked one */}
      <div className={`kn-ex__media kn-dk__media${e.card ? " kn-ex__media--card" : " kn-ex__media--live"}`}>
        <ExampleThumb e={e} lang={lang} />
      </div>
      <span className="kn-dk__scrim" aria-hidden="true" />
      <span className="kn-dk__grad" aria-hidden="true" />
      <span className="kn-dk__badge">
        <Icon name={KIND_ICON[e.kind]} size={11} /> {t(lang, C.kinds[e.kind])}{letter ? ` · ${letter}` : ""}
      </span>
      {chosen && <span className="kn-dk__check" aria-hidden="true"><Icon name="check" size={13} /></span>}
      <span className="kn-dk__cap">
        <b>{t(lang, e.name)}</b>
        <small>{t(lang, e.tagline)}</small>
        <span className="kn-dk__feats">
          {e.features.slice(0, 3).map((f) => (
            <i key={f}>{FEAT_ICON[f] && <Icon name={FEAT_ICON[f]!} size={10} />} {t(lang, C.feats[f])}</i>
          ))}
        </span>
        {/* the price and its tier — the terms («one payment · three
            languages») belong to the bar and the pricing band, not to a line
            that has to wrap inside a phone-wide card */}
        <span className="kn-dk__price">{priceLabel(e)} <small>{t(lang, tierName(e.tier))}</small></span>
      </span>
    </article>
  );
}
