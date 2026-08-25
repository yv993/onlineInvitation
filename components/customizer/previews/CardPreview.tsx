"use client";

import Link from "next/link";
import WCardFace from "@/components/wcards/WCardFace";
import { examples as C, wizard, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { findExample, priceLabel } from "@/lib/examples";
import { parseWTpl } from "@/lib/wcards";
import { useWizard } from "../WizardContext";

// ============================================================================
// THE CARD PREVIEW — when the chosen example is a card in an envelope, the
// previews column leads with the card itself, drawn live from the wizard's
// state (the same WCardFace the catalogue, the studio and the guest link
// draw), so the couple sees their names land on the paper as they type.
// The envelope's paper/liner/stamp/seal are the studio's business — the
// link under the card opens the same design there with nothing lost.
// ============================================================================

export default function CardPreview({ lang, onDemo, tpl, bare = false }: { lang: Lang; onDemo: () => void; tpl?: string; bare?: boolean }) {
  const { s, ready } = useWizard();
  const id = tpl ?? s.tpl;
  const w = parseWTpl(id);
  if (!w) return null;
  const ex = findExample(id);
  const base = lang === "hy" ? "" : "/en";
  const stops = s.stops.filter((x) => x.time && x.name).map((x) => ({ time: x.time, name: x.name, place: x.place }));
  return (
    <article className={`kn-ep__it${id === s.tpl ? " kn-ep__it--on" : ""} kn-cardpv${bare ? " kn-cardpv--bare" : ""}`} data-style={id}>
      <div className="kn-cardpv__stage" style={{ background: w.variant.paper }}>
        <WCardFace card={w.card} variant={w.variant} lang={lang} a={s.a || undefined} b={s.b || undefined} date={s.date || undefined} time={s.time || undefined} venue={s.venue || undefined} address={s.address || undefined} city={s.city || undefined} rsvpBy={s.rsvpBy || undefined} stops={stops.length ? stops : undefined} className="kn-cardpv__face" />
      </div>
      {!bare && <div className="kn-ep__meta">
        <b>{t(lang, w.card.name)}{ex ? <small> · {priceLabel(ex)}</small> : null}</b>
        <div className="kn-ep__acts">
          <button type="button" className="kn-chip" onClick={onDemo} disabled={!ready} title={ready ? t(lang, wizard.demoHint) : t(lang, wizard.errFill)}>{t(lang, wizard.demo)}</button>
          <Link className="kn-chip" href={`${base}/wedding-cards/${w.card.id}?v=${w.variant.id}`}>{t(lang, C.kinds.card)} →</Link>
        </div>
      </div>}
    </article>
  );
}
