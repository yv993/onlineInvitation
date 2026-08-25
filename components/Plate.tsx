import Image from "next/image";
import type { StaticImageData } from "next/image";

// ============================================================================
// PLATE — every photograph on the site goes through this one component, so
// every photograph gets the same three things:
//
//   1. next/image with a build-time blur placeholder and real dimensions, so
//      nothing shifts as it loads and no plate is fetched larger than shown.
//   2. A frame with an overflow clip, so the motion (drift, zoom, hover) can
//      move the picture INSIDE a fixed window — the frame never moves, the
//      layout never shifts, only the photograph breathes.
//   3. Two data attributes the motion layer reads:
//        data-drift="0.12"   scroll-parallax — the picture travels 12% of its
//                            own height across the viewport, slower than the
//                            page (a photograph on paper, not a sticker on it)
//        data-zoom           a slow settle from 1.08 → 1 as it enters, the
//                            "Ken Burns" every editorial site quietly uses
//      plus a CSS hover-scale on `.kn-plate--hover` (catalog cards).
//
// The IMAGE is oversized inside the frame by the drift amount (`inset`), so
// parallax never reveals the frame's own background at the edges — the usual
// tell of a hand-rolled parallax is a sliver of page colour at the top or
// bottom of the photo as it travels; this cannot show one.
//
// Everything degrades to a still, correctly cropped photograph: no JS, no
// motion preference, no data attributes read — the plate is just a picture.
// ============================================================================

export default function Plate({
  img,
  alt,
  sizes,
  priority = false,
  drift,
  zoom = false,
  hover = false,
  className = "",
  ratio,
  position = "50% 50%",
}: {
  /** a build-time import (blur placeholder, real dimensions) or the couple's
   *  own upload as a same-origin path — the frame, the crop and every motion
   *  attribute are identical either way */
  img: StaticImageData | string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** 0–0.3: fraction of the plate's height it travels across the viewport */
  drift?: number;
  zoom?: boolean;
  hover?: boolean;
  className?: string;
  /** CSS aspect-ratio for the frame, e.g. "4 / 5". Omit to use the image's. */
  ratio?: string;
  /** object-position — where the crop anchors */
  position?: string;
}) {
  // Oversize the picture by the drift so travel never exposes the frame.
  const bleed = drift ? Math.round(drift * 100) : 0;
  return (
    <div
      className={`kn-plate${hover ? " kn-plate--hover" : ""}${className ? ` ${className}` : ""}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div
        className="kn-plate__mv"
        data-drift={drift ? String(drift) : undefined}
        data-zoom={zoom ? "" : undefined}
        style={bleed ? { inset: `-${bleed}% 0` } : undefined}
      >
        <Image
          src={img}
          alt={alt}
          sizes={sizes}
          priority={priority}
          /* an uploaded photo has no build-time blur to place under it */
          placeholder={typeof img === "string" ? "empty" : "blur"}
          fill
          style={{ objectFit: "cover", objectPosition: position }}
        />
      </div>
    </div>
  );
}
