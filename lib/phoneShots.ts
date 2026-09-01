import type { StaticImageData } from "next/image";

// ============================================================================
// THE PHONE SHOTS — each hero example's REAL mobile first screen, captured
// from our own pages at 390×844 (SELF-MADE captures; regenerate with the
// scratchpad phoneshots*.mjs scripts after any template's hero changes —
// the wedding ten in phoneshots.mjs, the birthday/engagement set in
// phoneshots2.mjs, the kids pair in phoneshots3.mjs).
// The hero gallery, the drum and the birthday slats wear these so a visitor
// sees each design exactly as a phone will show it — an engine page appears
// behind its envelope gate, because that IS its first screen.
// ============================================================================

import w1 from "@/assets/photos/phones/wedding-1.webp";
import w2 from "@/assets/photos/phones/wedding-2.webp";
import w4 from "@/assets/photos/phones/wedding-4.webp";
import w5 from "@/assets/photos/phones/wedding-5.webp";
import w6 from "@/assets/photos/phones/wedding-6.webp";
import w7 from "@/assets/photos/phones/wedding-7.webp";
import w8 from "@/assets/photos/phones/wedding-8.webp";
import p9 from "@/assets/photos/phones/wedding-9.webp";
import p10 from "@/assets/photos/phones/wedding-10.webp";
import p11 from "@/assets/photos/phones/wedding-11.webp";
import p12 from "@/assets/photos/phones/wedding-12.webp";
import p13 from "@/assets/photos/phones/wedding-13.webp";
import lcf from "@/assets/photos/phones/live-classic-floral.webp";
import lmc from "@/assets/photos/phones/live-modern-cinematic.webp";
import lpe from "@/assets/photos/phones/live-pearl-editorial.webp";
import ldb from "@/assets/photos/phones/live-dusty-blue.webp";
// the other two occasions the landing now carries a section for (2026-08-24)
import e1 from "@/assets/photos/phones/engagement-1.webp";
import lsd from "@/assets/photos/phones/live-engagement-save-the-date.webp";
import b1 from "@/assets/photos/phones/birthday-1.webp";
import b2 from "@/assets/photos/phones/birthday-2.webp";
import b3 from "@/assets/photos/phones/birthday-3.webp";
import b4 from "@/assets/photos/phones/birthday-4.webp";
import b5 from "@/assets/photos/phones/birthday-5.webp";
import lba from "@/assets/photos/phones/live-birthday-anniversary.webp";
// two of the 44 children's cards ride the birthday slats (the rest in /kids)
import kcc from "@/assets/photos/phones/kids-cake-confetti-cream.webp";
import ksb from "@/assets/photos/phones/kids-space-blast-navy.webp";

export const phoneShots: Record<string, StaticImageData> = {
  "wedding-1": w1,
  "wedding-2": w2,
  "wedding-4": w4,
  "wedding-5": w5,
  "wedding-6": w6,
  "wedding-7": w7,
  "wedding-8": w8,
  "wedding-9": p9,
  "wedding-10": p10,
  "wedding-11": p11,
  "wedding-12": p12,
  "wedding-13": p13,
  "live-classic-floral": lcf,
  "live-modern-cinematic": lmc,
  "live-pearl-editorial": lpe,
  "live-dusty-blue": ldb,
  "engagement-1": e1,
  "live-engagement-save-the-date": lsd,
  "birthday-1": b1,
  "birthday-2": b2,
  "birthday-3": b3,
  "birthday-4": b4,
  "birthday-5": b5,
  "live-birthday-anniversary": lba,
  "kids-cake-confetti-cream": kcc,
  "kids-space-blast-navy": ksb,
};
