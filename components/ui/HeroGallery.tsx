import Link from "next/link";
import Image, { type StaticImageData } from "next/image";

// ============================================================================
// THE HERO GALLERY — a quiet film strip under the drum: every wedding
// example's cover in a small frame, rolling slowly sideways, each frame a
// door to that invitation's FULL LIVE PAGE. The drum above it answers
// «build on this» (it lands in the wizard); the gallery answers «just show
// me MINE» (it opens the wizard with that design picked: the example in
// full, the form beside it, every keystroke landing live).
//
// The roll is CSS ONLY: the track is laid twice and slides half its width on
// a linear loop, so there is no JS, no parked state, and nothing to clean
// up. `prefers-reduced-motion` swaps the roll for a plain scroller — the
// same frames, moved by the visitor's own hand. Hovering pauses the roll so
// a frame can actually be caught.
// ============================================================================

export type GalleryItem = { id: string; name: string; img: StaticImageData; href: string };

export default function HeroGallery({ items, label }: { items: GalleryItem[]; label: string }) {
  // A thin catalogue still rolls full: tile the items until a set holds at
  // least six frames. Both sets must be IDENTICAL (the loop slides exactly
  // half the track), so the tiling applies to each; only the first
  // occurrence of each item in the visible set stays in the tab order —
  // the copies are decoration.
  const reps = Math.max(1, Math.ceil(6 / Math.max(1, items.length)));
  const strip = (hidden: boolean) => (
    <div className="kn-hg__set" aria-hidden={hidden || undefined}>
      {Array.from({ length: reps }).flatMap((_, r) =>
        items.map((g) => {
          const dupe = hidden || r > 0;
          return (
            <Link key={`${g.id}-${r}`} className="kn-hg__it" href={g.href} tabIndex={dupe ? -1 : undefined} aria-hidden={!hidden && r > 0 ? true : undefined}>
              <Image src={g.img} alt="" sizes="120px" fill draggable={false} />
              <span className="kn-hg__name">{g.name}</span>
            </Link>
          );
        }),
      )}
    </div>
  );
  return (
    <div className="kn-hg" role="group" aria-label={label}>
      <div className="kn-hg__roll">
        <div className="kn-hg__track">
          {strip(false)}
          {/* the same frames again, so the loop has no seam */}
          {strip(true)}
        </div>
      </div>
    </div>
  );
}
