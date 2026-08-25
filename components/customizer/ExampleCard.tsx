"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { examples as C, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Draft } from "@/lib/draft";
import { priceLabel, styleLetter, tierName, type Example, type ExampleFeature, type ExampleKind } from "@/lib/examples";
import ExampleThumb, { type Face } from "./ExampleThumb";

// ============================================================================
// ONE EXAMPLE, AS A CARD — its own window in the grid: what it is (THE
// INVITATION'S FIRST SCREEN, rendered live — never a stock photo), what kind,
// what it does, what it costs, and two verbs:
// VIEW DETAILS (the detail window, without leaving the page) and CHOOSE (in
// the wizard, a click; on the showcase, a link into the wizard).
// ============================================================================

export const FEAT_ICON: Partial<Record<ExampleFeature, string>> = { film: "film", music: "music", guests: "users", maps: "map", timeline: "route", countdown: "clock", calendar: "calendar", envelope: "mail", personal: "share", rsvp: "check" };
export const KIND_ICON: Record<ExampleKind, string> = { web: "globe", engine: "seal", card: "mail" };

export type { Face };

export default function ExampleCard({ e, lang, chosen, onChoose, chooseHref, onDetails, face, draft }: { e: Example; lang: Lang; chosen?: boolean; onChoose?: () => void; chooseHref?: string; onDetails: () => void; face?: Face; draft?: Draft | null }) {
  const letter = styleLetter(e);
  return (
    <article className={`kn-ex__it${chosen ? " kn-ex__it--on" : ""}${e.dark ? " kn-ex__it--dark" : ""}`} data-kind={e.kind} data-id={e.id}>
      {/* a div with the button role, not a <button>: the live thumbnail inside
          carries the invitation's own buttons, and buttons may not nest */}
      <div role="button" tabIndex={0} className={`kn-ex__media${e.card ? " kn-ex__media--card" : " kn-ex__media--live"}`} style={{ background: e.palette[0] }} onClick={onDetails} onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); onDetails(); } }} aria-label={`${t(lang, C.details)} — ${t(lang, e.name)}`}>
        <ExampleThumb e={e} lang={lang} face={face} draft={draft} />
        <span className="kn-ex__kind"><Icon name={KIND_ICON[e.kind]} size={12} /> {t(lang, C.kinds[e.kind])}{letter ? ` · ${letter}` : ""}</span>
        {chosen && <span className="kn-ex__check" aria-hidden="true"><Icon name="check" size={14} /></span>}
        <span className="kn-ex__sw" aria-hidden="true">{e.palette.map((c, i) => <i key={i} style={{ background: c }} />)}</span>
        <span className="kn-ex__zoom" aria-hidden="true"><Icon name="arrow" size={14} /></span>
      </div>
      <div className="kn-ex__body">
        <b className="kn-ex__name">{t(lang, e.name)}</b>
        <small className="kn-ex__tag">{t(lang, e.tagline)}</small>
        <ul className="kn-ex__feats" aria-label={t(lang, C.includes)}>
          {e.features.slice(0, 4).map((f) => (
            <li key={f}>{FEAT_ICON[f] && <Icon name={FEAT_ICON[f]!} size={11} />} {t(lang, C.feats[f])}</li>
          ))}
        </ul>
        <div className="kn-ex__row">
          <span className="kn-ex__price">
            <b>{priceLabel(e)}</b>
            <small>{t(lang, tierName(e.tier))} · {t(lang, C.terms)}</small>
          </span>
          <span className="kn-ex__acts">
            <button type="button" className="kn-chip kn-chip--detail" onClick={onDetails}><Icon name="film" size={13} /> {t(lang, C.details)}</button>
            {onChoose ? (
              <button type="button" className={`kn-chip${chosen ? " kn-chip--on" : ""}`} aria-pressed={chosen} onClick={onChoose}>{chosen ? <><Icon name="check" size={13} /> {t(lang, C.chosen)}</> : t(lang, C.choose)}</button>
            ) : chooseHref ? (
              <Link className="kn-chip" href={chooseHref}>{t(lang, C.choose)}</Link>
            ) : null}
          </span>
        </div>
      </div>
    </article>
  );
}
