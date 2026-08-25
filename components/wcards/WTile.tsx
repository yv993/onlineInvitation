import type { Lang } from "@/lib/content";
import { findCover, findLiner, type WCard, type WVariant } from "@/lib/wcards";
import WCardFace, { type WFaceProps } from "./WCardFace";

// ============================================================================
// THE TILE — the reference shows the front, and on hover the BACK when the
// design has one («Backside supported»). Here the same: card on an open,
// lined envelope; hovering a backside design turns the card over.
// ============================================================================

export default function WTile({ card, variant, lang, face, size = "tile" }: { card: WCard; variant: WVariant; lang: Lang; face?: Partial<WFaceProps>; size?: "tile" | "hero" }) {
  const cover = findCover(variant.cover), liner = findLiner(variant.liner);
  const hasBack = card.features.includes("backside");
  return (
    <div className={`wt wt--${size}${card.shape === "landscape" ? " wt--land" : ""}${hasBack ? " wt--hasBack" : ""}`} style={{ "--wt-env": cover.paper, "--wt-liner": liner.css, "--wt-back": `color-mix(in srgb, ${variant.c} 40%, #f3efe7)` } as React.CSSProperties}>
      <div className="wt__env" aria-hidden="true"><span className="wt__envBack" /><span className="wt__envLiner" /><span className="wt__envPocket" /></div>
      <div className="wt__card">
        <div className="wt__flip">
          <div className="wt__front"><WCardFace card={card} variant={variant} lang={lang} {...face} /></div>
          {hasBack && <div className="wt__back"><WCardFace card={card} variant={variant} lang={lang} side="back" {...face} /></div>}
        </div>
      </div>
    </div>
  );
}
