"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import WMotifSprite from "@/components/wcards/WMotifs";
import { KIND_ICON } from "@/components/customizer/ExampleCard";
import ExampleDeck from "@/components/customizer/ExampleDeck";
import ExampleDetail from "@/components/customizer/ExampleDetail";
import { examples as C, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { examplesFor, type Example } from "@/lib/examples";

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
  const list = useMemo(() => examplesFor("wedding"), []);
  const inGroup = (e: Example, k: "web" | "card") => (k === "web" ? e.kind !== "card" : e.kind === "card");
  const [kind, setKind] = useState<"web" | "card" | "all">("all");
  const shown = useMemo(() => (kind === "all" ? list : list.filter((e) => (kind === "web" ? e.kind !== "card" : e.kind === "card"))), [list, kind]);
  const [detail, setDetail] = useState<number | null>(null);
  const chooseHref = (id: string) => `${base}/customize?category=wedding&tpl=${id}`;
  return (
    <section className="kn-exw" id="examples" aria-label={t(lang, C.gridKicker)}>
      <WMotifSprite />
      <div className="kn-exw__head">
        {/* the chapter's name: authored centred, walked left-and-smaller by
            the scroll (data-shift — the reference portfolio's chapter move).
            The wrapper itself carries no data-rise: two writers on one
            transform would fight; the children rise on their own. */}
        <div className="kn-ch__head" data-shift>
          <p className="kn-label" data-rise>{t(lang, C.gridKicker)} <small>· {list.length} {t(lang, C.count)}</small></p>
          <h2 className="kn-h2" data-rise>{t(lang, C.gridTitle)}</h2>
        </div>
        <p className="kn-lead" data-rise>{t(lang, C.gridLead)}</p>
        <div className="kn-ex__kinds" role="tablist" aria-label={t(lang, C.title)} data-rise>
          <button type="button" role="tab" aria-selected={kind === "all"} className="kn-chip" onClick={() => setKind("all")}>{t(lang, C.all)} <small>{list.length}</small></button>
          {(["web", "card"] as const).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={kind === k} className="kn-chip" onClick={() => setKind(k)}>
              <Icon name={KIND_ICON[k]} size={14} /> {t(lang, C.kinds[k])} <small>{list.filter((e) => inGroup(e, k)).length}</small>
            </button>
          ))}
        </div>
      </div>
      <ExampleDeck lang={lang} list={shown} chooseHref={chooseHref} onDetails={setDetail} />
      {detail !== null && shown[detail] && (
        <ExampleDetail lang={lang} list={shown} index={detail} onIndex={setDetail} onClose={() => setDetail(null)} chooseHref={chooseHref} />
      )}
    </section>
  );
}
