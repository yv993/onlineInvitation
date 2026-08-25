"use client";

import { useMemo, useState } from "react";
import ExampleDeck from "./ExampleDeck";
import ExampleDetail from "./ExampleDetail";
import { examplesFor, type ExampleOccasion } from "@/lib/examples";
import type { Lang } from "@/lib/content";

// ============================================================================
// ONE OCCASION'S DECK — the pile of examples for whichever occasion asks for
// it, with the same two verbs the wedding catalogue carries: VIEW DETAILS
// opens the live window without leaving the page, CHOOSE hands the example to
// the wizard with that design already picked.
//
// WeddingExamples.tsx stays as it is — it is the wedding topic's own page,
// with the kind filter (pages · cards) that only a catalogue of twenty-two
// needs. This is the lean version the landing's engagement section uses.
// ============================================================================

export default function OccasionDeck({ lang, occasion, base }: { lang: Lang; occasion: ExampleOccasion; base: string }) {
  const list = useMemo(() => examplesFor(occasion), [occasion]);
  const [detail, setDetail] = useState<number | null>(null);
  const chooseHref = (id: string) => `${base}/customize?category=${occasion}&tpl=${id}`;
  if (!list.length) return null;
  return (
    <>
      <ExampleDeck lang={lang} list={list} chooseHref={chooseHref} onDetails={setDetail} />
      {detail !== null && list[detail] && (
        <ExampleDetail lang={lang} list={list} index={detail} onIndex={setDetail} onClose={() => setDetail(null)} chooseHref={chooseHref} />
      )}
    </>
  );
}
