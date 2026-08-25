// ============================================================================
// THE FX LAYER — three ornaments adapted from the feturesss21 collection into
// this project's own idiom (no Tailwind, no cn(), no world-provider, no new
// dependency; tokens instead of hard colours):
//
//   Corners  after my-portfolio/HudFrame.tsx — its four corner accents,
//            re-skinned from technical HUD brackets to an engraver's frame in
//            the template's own accent. They DRAW THEMSELVES on arrival
//            (the corner rules grow from zero), which is the whole trick.
//   Beam     after 3poectTurk/border-beam.tsx — a conic gradient masked to a
//            thin ring so only the border is painted, then spun. Under
//            reduced motion the ring stands still, and it is still a premium
//            edge (that fallback is the reference's own idea, kept).
//   Grain    a paper texture for a light template and a velvet sheen for a
//            dark one — repeating gradients, no image, so every example can
//            carry a different ground for nothing.
//
// All three are decorative: aria-hidden, pointer-events none, and nothing
// here is required for the page to read.
// ============================================================================

/** an engraver's frame: four corners that draw themselves in */
export function Corners({ className = "", inset = 10 }: { className?: string; inset?: number }) {
  return (
    <span className={`kn-frame ${className}`} aria-hidden="true" style={{ "--fr-in": `${inset}px` } as React.CSSProperties}>
      <i className="kn-frame__c kn-frame__c--tl" data-rise />
      <i className="kn-frame__c kn-frame__c--tr" data-rise />
      <i className="kn-frame__c kn-frame__c--bl" data-rise />
      <i className="kn-frame__c kn-frame__c--br" data-rise />
    </span>
  );
}

/** a light that travels the border — the host must be position: relative */
export function Beam({ className = "", seconds = 9 }: { className?: string; seconds?: number }) {
  return <span className={`kn-beam ${className}`} aria-hidden="true" style={{ "--beam-s": `${seconds}s` } as React.CSSProperties} />;
}

/** the ground a template stands on: paper, linen, velvet or a watercolour wash */
export function Grain({ kind = "paper" }: { kind?: "paper" | "linen" | "velvet" | "wash" }) {
  return <span className={`kn-grain kn-grain--${kind}`} aria-hidden="true" />;
}
