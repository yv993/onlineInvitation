import type { StaticImageData } from "next/image";

import coupleHill from "@/assets/photos/couple-hill.webp";
import handsBouquet from "@/assets/photos/hands-bouquet.webp";
import ringbox from "@/assets/photos/ringbox.webp";
import shoes from "@/assets/photos/shoes.webp";
import rings from "@/assets/photos/rings.webp";
import lace from "@/assets/photos/lace.webp";
// the second sourcing pass — the ARMENIAN register (all eyeballed on a
// contact sheet before install, then contact-sheeted again after)
import sealHero from "@/assets/photos/seal-hero.webp";
import sealStamp from "@/assets/photos/seal-stamp.webp";
import araratDawn from "@/assets/photos/ararat-dawn.webp";
import araratDay from "@/assets/photos/ararat-day.webp";
import noravank from "@/assets/photos/noravank.webp";
import chapelCliff from "@/assets/photos/chapel-cliff.webp";
import candles from "@/assets/photos/candles.webp";
import churchCross from "@/assets/photos/church-cross.webp";
import tealights from "@/assets/photos/tealights.webp";
import jarsAngel from "@/assets/photos/jars-angel.webp";
import cakeGold from "@/assets/photos/cake-gold.webp";
import stageSpeaker from "@/assets/photos/stage-speaker.webp";

// ============================================================================
// The gallery plates.
//
// SELF-HOSTED STATIC IMPORTS, never remote URLs — next/image gets real
// intrinsic dimensions (so nothing shifts as they load), builds a blur
// placeholder at build time, and a guest opening this on a phone in Yerevan
// contacts exactly one origin. Same rule as KAR and NORATUN, and the reason
// next.config.mjs declares no remotePatterns at all. All six together are
// ~430 KB before next/image re-encodes them to AVIF.
//
// NOT ONE IDENTIFIABLE FACE, and that is a decision rather than a coincidence.
// These are photographs of real people, and this card names a couple who do
// not exist. Putting a stranger's face under the words "Նարե և Հայկ" presents
// a real person as someone they are not. Detail frames and distant figures say
// everything a wedding gallery needs to say and claim nothing about anybody.
// When a real couple takes this template, they bring their own photographs and
// the constraint disappears with them.
//
// The alt text describes what is ACTUALLY IN THE FRAME. It is not the caption,
// and it is not "wedding photo" six times.
//
// Provenance: Unsplash, licence-free. IDs kept beside each import so any plate
// can be traced back or re-fetched at a larger size.
// ============================================================================

export type Plate = { img: StaticImageData; alt: { hy: string; en: string } };

/**
 * The ARCH plate — the one photograph inside the invitation band, in an
 * arch-topped frame (the shape both references reach for, and the shape of
 * every doorway in the church band's own drawing). Held out of the gallery
 * so no plate appears on the card twice.
 */
export const archPlate: Plate = {
  // 1684244276932 — 1400x2100 portrait; the most "vow-like" frame of the six
  img: handsBouquet,
  alt: {
    hy: "Երկու ձեռք՝ մատանիներով, սպիտակ վարդերի փնջի վրա։",
    en: "Two hands wearing rings, resting together on a bouquet of white roses.",
  },
};

export const photos: Plate[] = [
  {
    // 1532712938310 — the wide establishing frame, first tile, 4:3
    img: coupleHill,
    alt: {
      hy: "Երկու հոգի՝ ձեռք ձեռքի տված, բլրի լանջին, մայրամուտի լույսի տակ։",
      en: "Two figures walking hand in hand along a ridge in the last of the light.",
    },
  },
  {
    // 1710961716482 — 1100x1650, the second 2:3 slot
    img: ringbox,
    alt: {
      hy: "Հարսանյաց թղթեր, ձիթենու ճյուղեր և բացված մատանիների տուփ։",
      en: "Wedding stationery, olive sprigs and an open ring box.",
    },
  },
  {
    // 1705737211476 — landscape, the second 4:3 slot
    img: shoes,
    alt: {
      hy: "Հարսի կոշիկը՝ խոտի մեջ, զգեստի եզրը կողքին։",
      en: "A bride's shoe in long grass, the hem of the dress beside it.",
    },
  },
  {
    // 1637616919953 — crops cleanly to the square slot
    img: rings,
    alt: {
      hy: "Երկու ոսկե մատանի՝ թղթի եզրին, արևի շերտի տակ։",
      en: "Two gold rings on the edge of a sheet of paper, in a band of sunlight.",
    },
  },
  {
    // 1525169087805 — the quietest plate, closes the grid
    img: lace,
    alt: {
      hy: "Ժանյակե զգեստի եզրագիծը՝ մոտիկից։",
      en: "The lace edge of a wedding dress, close up.",
    },
  },
];

// ============================================================================
// THE SERVICE'S OWN PLATES — the landing had no photographs at all, which for
// an invitation service is selling stationery from a text-only page. These
// carry the Armenian register the card is written in: real churches (Noravank
// in its red gorge, the chapel set into the cliff), Ararat at dawn and by
// day, candlelight, and — the literal product — wax-sealed envelopes.
// ============================================================================

export type Frame = { img: StaticImageData; alt: { hy: string; en: string } };

export const service = {
  /** The landing hero — a stack of gold-sealed envelopes. It IS the product. */
  hero: {
    img: sealHero,
    alt: {
      hy: "Երեք սպիտակ ծրար՝ իրար վրա, ամեն մեկը՝ ոսկեգույն զմուռսե կնիքով։",
      en: "Three white envelopes stacked, each closed with a gold wax seal.",
    },
  } as Frame,
  /** How-it-works — the stamp beside a sealed letter. */
  stamp: {
    img: sealStamp,
    alt: {
      hy: "Փայտե կնիք և կարմիր զմուռսով փակված ծրար՝ սեղանին։",
      en: "A wooden seal stamp beside an envelope closed with red wax, on a table.",
    },
  } as Frame,
  /** The closer — Ararat at dawn, the moon still up. */
  closer: {
    img: araratDawn,
    alt: {
      hy: "Արարատը լուսաբացին, երկնքում դեռ լուսինն է։",
      en: "Ararat at dawn, the moon still in the sky.",
    },
  } as Frame,
  /** The card's venue plate — the chapel set into the cliff. */
  chapel: {
    img: chapelCliff,
    alt: {
      hy: "Քարե մատուռ՝ ժայռի կողքին, մեկ խաչով գմբեթին։",
      en: "A stone chapel set against a cliff, a single cross on the dome.",
    },
  } as Frame,
};

/** One plate per style for the catalog cards — each in its own register. */
export const stylePlates: Record<"kniq" | "luys" | "tuf", Frame> = {
  kniq: {
    img: araratDay,
    alt: {
      hy: "Արարատը ձյունածածկ գագաթով՝ դաշտերի վրա, պարզ երկնքի տակ։",
      en: "Snow-capped Ararat over the plain under a clear sky.",
    },
  },
  luys: {
    img: candles,
    alt: {
      hy: "Երկար փայտե սեղան՝ մոմերով, մութ սենյակում։",
      en: "A long wooden table lit by candles in a dark room.",
    },
  },
  tuf: {
    img: noravank,
    alt: {
      hy: "Նորավանքը կարմիր ժայռերի կիրճում։",
      en: "Noravank monastery in its red-rock gorge.",
    },
  },
};

/** Extra gallery plates for the dark style, where the ivory set reads too
 *  bright. The night gallery swaps its first two frames for these. */
export const nightPlates: Frame[] = [
  {
    img: churchCross,
    alt: {
      hy: "Մուգ քարե եկեղեցի մառախուղի մեջ, խաչը գմբեթին։",
      en: "A dark stone church in mist, the cross on its dome.",
    },
  },
  {
    img: tealights,
    alt: {
      hy: "Երկու վառվող մոմ ապակե բաժակներում՝ տաք լույսի տակ։",
      en: "Two lit tealights in glass holders under warm light.",
    },
  },
];

// The landing's five category cards — one photograph each, chosen for the
// occasion: rings on a bouquet, the open ring box, the christening jars, the
// gold cake, the speaker on stage. Same plates the templates use.
export const catPlates = {
  wedding: { img: handsBouquet, alt: { hy: "Մատանիներ՝ փնջի վրա", en: "Rings on a bouquet" } },
  engagement: { img: ringbox, alt: { hy: "Բացված մատանիների տուփ", en: "An open ring box" } },
  baptism: { img: jarsAngel, alt: { hy: "Կնունքի սեղան՝ հրեշտակով", en: "A christening table with an angel" } },
  birthday: { img: cakeGold, alt: { hy: "Ոսկեգույն տորթ", en: "A gold cake" } },
  corporate: { img: stageSpeaker, alt: { hy: "Բանախոս բեմում", en: "A speaker on stage" } },
} as const;
