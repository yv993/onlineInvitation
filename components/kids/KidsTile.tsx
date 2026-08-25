import type { Lang } from "@/lib/content";
import type { KidsCard, Variant } from "@/lib/kids";
import KidsCardFace, { type KidsFaceProps } from "./KidsCardFace";

// ============================================================================
// THE TILE — a card leaning on an open, lined envelope: the anatomy every
// tile on the reference category page shares. The envelope is three CSS
// layers (back, liner, front pocket); the card is the same KidsCardFace the
// studio and the guest link render, at tile size.
// ============================================================================

export default function KidsTile({
  card,
  variant,
  lang,
  face,
  size = "tile",
}: {
  card: KidsCard;
  variant: Variant;
  lang: Lang;
  face?: Partial<KidsFaceProps>;
  size?: "tile" | "hero";
}) {
  const landscape = card.shape === "landscape";
  return (
    <div
      className={`kt kt--${size}${landscape ? " kt--land" : ""}`}
      style={{ "--kt-env": variant.env, "--kt-liner": variant.liner, "--kt-back": variant.backdrop } as React.CSSProperties}
      aria-hidden={size === "tile" ? undefined : undefined}
    >
      <div className="kt__env" aria-hidden="true">
        <span className="kt__envBack" />
        <span className="kt__envLiner" />
        <span className="kt__envPocket" />
      </div>
      <div className="kt__card">
        <KidsCardFace card={card} variant={variant} lang={lang} details={size === "hero"} {...face} />
      </div>
    </div>
  );
}
