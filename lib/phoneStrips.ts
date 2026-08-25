import type { StaticImageData } from "next/image";

// ============================================================================
// THE PHONE STRIPS — each hero wedding example's page as a FULL-LENGTH mobile
// capture (390-wide, first ~4200px, SELF-MADE from our own pages; regenerate
// with scratchpad phonestrips.mjs after a template changes — it opens the
// engine pages' gates and walks each page so every entrance has fired).
// The hero slats play these on hover: the tour pans from the top of the page
// to the bottom, so a visitor sees the example exactly as a phone would
// scroll it. At rest the strip's top IS the first screen.
// ============================================================================

import w1 from "@/assets/photos/strips/wedding-1.webp";
import w2 from "@/assets/photos/strips/wedding-2.webp";
import w4 from "@/assets/photos/strips/wedding-4.webp";
import w5 from "@/assets/photos/strips/wedding-5.webp";
import w6 from "@/assets/photos/strips/wedding-6.webp";
import w7 from "@/assets/photos/strips/wedding-7.webp";
import lcf from "@/assets/photos/strips/live-classic-floral.webp";
import lmc from "@/assets/photos/strips/live-modern-cinematic.webp";
import lpe from "@/assets/photos/strips/live-pearl-editorial.webp";
import ldb from "@/assets/photos/strips/live-dusty-blue.webp";

export const phoneStrips: Record<string, StaticImageData> = {
  "wedding-1": w1,
  "wedding-2": w2,
  "wedding-4": w4,
  "wedding-5": w5,
  "wedding-6": w6,
  "wedding-7": w7,
  "live-classic-floral": lcf,
  "live-modern-cinematic": lmc,
  "live-pearl-editorial": lpe,
  "live-dusty-blue": ldb,
};
