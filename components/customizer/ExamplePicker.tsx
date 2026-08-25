"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { examples as C, occasions, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { examplesFor, findExample, priceLabel, type Example } from "@/lib/examples";
import { useWizard } from "./WizardContext";
import ExampleCard, { KIND_ICON } from "./ExampleCard";
import ExampleDeck from "./ExampleDeck";
import ExampleDetail from "./ExampleDetail";

// ============================================================================
// THE EXAMPLE PICKER — step 1's second half, and the wizard's shop window.
//
// One list per occasion (lib/examples.ts): the web templates, the engine
// styles and — for a wedding — the popular cards in an envelope, each on ITS
// OWN CARD (cover or the live card face, kind, what it does, the price) with
// two verbs: VIEW DETAILS opens the example's own window — the real guest
// page in a phone frame, the section order, what is included, the price —
// without leaving the wizard; CHOOSE makes it the template. The filter groups
// by what a couple receives (a web page · a card in an envelope); the whole
// list is one screen, so a couple compares by looking.
// ============================================================================

export default function ExamplePicker({ lang }: { lang: Lang }) {
  const { s, set, blob } = useWizard();
  const base = lang === "hy" ? "" : "/en";
  // the occasion's list — plus the current pick when it came from outside it
  // (a card colourway chosen in /wedding-cards, or an order's «change» link)
  const list = useMemo(() => {
    const own = examplesFor(s.occasion);
    if (own.some((e) => e.id === s.tpl)) return own;
    const extra = findExample(s.tpl);
    return extra && extra.occasion === s.occasion ? [extra, ...own] : own;
  }, [s.occasion, s.tpl]);
  // the filter groups by what a couple receives: a web page (the templates AND
  // the engine styles together) or a card in an envelope; the badge on each
  // example still says which kind of web page it is
  const inGroup = (e: Example, k: "web" | "card") => (k === "web" ? e.kind !== "card" : e.kind === "card");
  const groups = useMemo(() => (["web", "card"] as const).filter((k) => list.some((e) => inGroup(e, k))), [list]);
  const [kind, setKind] = useState<"web" | "card" | "all">("all");
  const shown = useMemo(() => (kind === "all" ? list : list.filter((e) => (kind === "web" ? e.kind !== "card" : e.kind === "card"))), [list, kind]);
  const chosen = list.find((e) => e.id === s.tpl);
  const [detail, setDetail] = useState<number | null>(null);
  // the cards stay as their designers made them — the couple's own words and
  // photographs appear in the preview column, not in the catalogue

  return (
    <section className="kn-ex" aria-label={t(lang, C.title)}>
      <div className="kn-ex__head">
        <div>
          <h2 className="kn-wz__h kn-ex__h">
            {t(lang, occasions[s.occasion].name)} — {t(lang, C.title).toLowerCase()} <small>{list.length} {t(lang, C.count)}</small>
          </h2>
          <p className="kn-wz__hint">{t(lang, C.lead)}</p>
        </div>
        <div className="kn-ex__kinds" role="tablist" aria-label={t(lang, C.title)}>
          <button type="button" role="tab" aria-selected={kind === "all"} className="kn-chip" onClick={() => setKind("all")}>{t(lang, C.all)} <small>{list.length}</small></button>
          {groups.map((k) => (
            <button key={k} type="button" role="tab" aria-selected={kind === k} className="kn-chip" onClick={() => setKind(k)}>
              <Icon name={KIND_ICON[k]} size={14} /> {t(lang, C.kinds[k])} <small>{list.filter((e) => inGroup(e, k)).length}</small>
            </button>
          ))}
        </div>
      </div>

      {kind !== "all" && <p className="kn-ex__kindHint">{t(lang, C.kindHint[kind])}</p>}

      {/* A WEDDING IS SHOWN AS A DECK — the client's call: the cards fanned in
          a pile, one at the front, turned by dragging (components/ui/
          StackDeck.tsx). The other occasions keep the grid, which is what they
          were designed against. Same cards, same detail window, same pick. */}
      {s.occasion === "wedding" ? (
        <ExampleDeck lang={lang} list={shown} chosenId={s.tpl} onChoose={(id) => set({ tpl: id })} onDetails={setDetail} />
      ) : (
        <div className="kn-ex__grid" role="list" aria-label={t(lang, C.title)}>
          {shown.map((e, i) => (
            <ExampleCard key={e.id} e={e} lang={lang} chosen={s.tpl === e.id} onChoose={() => set({ tpl: e.id })} onDetails={() => setDetail(i)} />
          ))}
        </div>
      )}

      <div className="kn-ex__foot">
        {s.occasion === "wedding" && (
          <p className="kn-wz__hint">
            {t(lang, C.cardsInWizard)} · <Link href={`${base}/wedding-cards`}>{t(lang, C.moreCards)}</Link>
          </p>
        )}
        {s.occasion === "engagement" && (
          <p className="kn-wz__hint"><Link href={`${base}/wedding-cards`}>{t(lang, C.moreCards)}</Link></p>
        )}
        {s.occasion === "birthday" && (
          <p className="kn-wz__hint"><Link href={`${base}/kids`}>{lang === "hy" ? "Երեխայի՞ ծնունդ է — 44 մանկական քարտ →" : "A child's birthday? — 44 kids' cards →"}</Link></p>
        )}
        {chosen && (
          <p className="kn-ex__pick" aria-live="polite">
            <Icon name="check" size={14} /> {t(lang, C.yourPick)}: <b>{t(lang, chosen.name)}</b> · {priceLabel(chosen)} · <span>{t(lang, C.terms)}</span>
          </p>
        )}
      </div>

      {detail !== null && shown[detail] && (
        <ExampleDetail lang={lang} list={shown} index={detail} onIndex={setDetail} onClose={() => setDetail(null)} chosenId={s.tpl} onChoose={(id) => set({ tpl: id })} blob={blob || undefined} />
      )}
    </section>
  );
}
