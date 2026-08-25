import type { StaticImageData } from "next/image";
import type { T } from "./content";

import sealHero from "@/assets/photos/seal-hero.webp";
import rings from "@/assets/photos/rings.webp";
import lace from "@/assets/photos/lace.webp";
import ringbox from "@/assets/photos/ringbox.webp";
import handsBouquet from "@/assets/photos/hands-bouquet.webp";
import coupleHill from "@/assets/photos/couple-hill.webp";
import shoes from "@/assets/photos/shoes.webp";
import starsNight from "@/assets/photos/stars-night.webp";
import cakeGold from "@/assets/photos/cake-gold.webp";
import balloonsKids from "@/assets/photos/balloons-kids.webp";
import balloonArch from "@/assets/photos/balloon-arch.webp";
import jarsAngel from "@/assets/photos/jars-angel.webp";
import candlestick from "@/assets/photos/candlestick.webp";
import candleCross from "@/assets/photos/candle-cross.webp";
import chapelCliff from "@/assets/photos/chapel-cliff.webp";
import stageSpeaker from "@/assets/photos/stage-speaker.webp";
import stageStar from "@/assets/photos/stage-star.webp";
import headphones from "@/assets/photos/headphones.webp";
import audience from "@/assets/photos/audience.webp";
import candles from "@/assets/photos/candles.webp";
import araratDawn from "@/assets/photos/ararat-dawn.webp";
import tealights from "@/assets/photos/tealights.webp";
import noravank from "@/assets/photos/noravank.webp";
// the wedding-register plates (2026-08-24, licensed placeholders sourced by
// the contact-sheet rule — no identifiable faces stand in as the couple; the
// couple's own uploads replace them through the wizard's photo slots):
import wedMist from "@/assets/photos/wed-mist.webp";
import wedBlueWalk from "@/assets/photos/wed-blue-walk.webp";
import wedFloat from "@/assets/photos/wed-float.webp";
import wedGoldDusk from "@/assets/photos/wed-gold-dusk.webp";
import wedSparkler from "@/assets/photos/wed-sparkler.webp";
import wedNightVenue from "@/assets/photos/wed-night-venue.webp";
import wedEmbrace from "@/assets/photos/wed-embrace.webp";
import wedHeadTable from "@/assets/photos/wed-head-table.webp";
import wedCandleTable from "@/assets/photos/wed-candle-table.webp";
import wedArbor from "@/assets/photos/wed-arbor.webp";
import wedArchHills from "@/assets/photos/wed-arch-hills.webp";
import wedSageTable from "@/assets/photos/wed-sage-table.webp";

// ============================================================================
// THE TEMPLATE REGISTRY — fifteen live examples, three per ceremony (five
// for a birthday: the two scene invitations joined them).
//
// This is the "mock JSON" the brief asks for, kept as a typed module rather
// than a .json file so the plates are STATIC IMPORTS (blur placeholders, real
// dimensions, no remote hosts) and every string is bilingual by construction.
//
// Every entry is data; components/templates/TemplateView.tsx composes a page
// from it. Feature flags (`blocks`) switch blocks on; `fx` picks the ambient
// canvas system (components/ui/3d/Particles.tsx); `video`/`audio` are
// SELF-HOSTED and — where marked — SYNTHESIZED (ffmpeg `gradients` for the
// ambient loops, detuned sine pads for the music beds). Nothing here is
// fetched from a third party at runtime, and nothing claims to be a real
// couple's footage: the video slots are ambient light, the audio slots are
// beds a couple replaces with their own track.
// ============================================================================

export type Category = "wedding" | "engagement" | "birthday" | "christening" | "corporate";

export type Fx = "petals" | "gold" | "sparkles" | "clouds" | "grid" | "confetti" | "leaves" | "none";

export type TemplateSpec = {
  id: string; // "wedding-1"
  category: Category;
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: T;
  tagline: T;
  tags: string[];
  /** what it was measured against, when it was measured against something —
   *  the examples picker prints this under the name. Absent = KNIQ's own. */
  after?: T;
  /** the theme — six colours; measured contrast noted where it matters */
  theme: {
    bg: string;
    fg: string;
    fgSoft: string;
    accent: string; // ornament colour (may fail text contrast)
    accentInk: string; // the same hue, text-safe on bg
    panel: string; // glass panel tint
    dark: boolean;
    /** the display face: "serif" (Cormorant) | "sans" (Jost) | "display-serif-italic" */
    face: "serif" | "sans" | "serif-italic";
    /** foil: paints display type with a gold-foil gradient */
    foil?: boolean;
    /** neon: adds text-shadow glow to display type */
    neon?: boolean;
  };
  cover: StaticImageData;
  coverAlt: T;
  gallery: Array<{ img: StaticImageData; alt: T }>;
  video?: { src: string; poster: StaticImageData; synthesized: boolean };
  audio?: { src: string; label: T; synthesized: boolean };
  fx: Fx;
  /** the sample event this template previews with */
  event: {
    a: T;
    b?: T;
    kicker: T;
    date: string; // ISO +04:00
    end: string;
    city: T;
    venue: T;
    address: T;
    stops: Array<{ time: string; name: T; place: T }>;
  };
  blocks: {
    countdown?: boolean;
    ageCountdown?: { born: string }; // birthday: counts to the birthday, shows the age
    map?: boolean; // Google Maps link card
    gallery?: "masonry" | "grid";
    lightbox?: boolean;
    rsvp?: "modal" | "inline" | "guests" | "meal" | "team";
    timeline?: "parallax" | "tabs" | "order";
    dressCode?: string[]; // palette swatches
    fold?: boolean; // 3D fold-out intro card
    godparents?: boolean;
    parentsNote?: boolean;
    speakers?: boolean;
    qr?: boolean;
    ics?: boolean;
    registry?: boolean;
    toastBoard?: boolean;
    productTilt?: boolean;
    register?: boolean;
    pinDrop?: boolean;
    wreath?: boolean;
    cross?: boolean;
    watercolorFrame?: boolean;
    memoryReel?: boolean;
    /** the hero is a hanging cream pennant with a poured wax seal (after
     *  priglasi.pro's wax-seal invitation) — components/templates/SealBanner.tsx */
    sealBanner?: boolean;
    /** the hero is a layered valley behind a balloon arch, the scroll its
     *  camera (after three animated scene invitations) —
     *  components/templates/SceneHero.tsx */
    sceneHero?: boolean;
    /** the hero is the castle valley whose camera never stops — the same
     *  lens, plus a time-driven drift (after ONE animated scene invitation) —
     *  components/templates/CastleScene.tsx */
    castleScene?: boolean;
    /** the couple's wedding hashtag, as its own band */
    hashtag?: T;
    // ---- the four reference strips (2026-08-23) — see BloomHeroes.tsx ----
    /** torn-paper blue programme hero: monogrammed photo, date cells, quote */
    tornHero?: boolean;
    /** hydrangea night hero: drawn blooms shoulder the script names */
    bloomHero?: boolean;
    /** velvet roses hero: blooms in the corners, the names stacked huge */
    roseHero?: boolean;
    /** eucalyptus vow hero: hairline frame, initials, arched photograph */
    sprigHero?: boolean;
    /** a scripture or a line, set alone (the torn hero sets it itself) */
    quote?: T;
    /** the invitation sentence the sprig hero says over the photograph */
    invite?: T;
    /** the wedding party, in columns */
    entourage?: Array<{ role: T; names: string[] }>;
    /** the gift line */
    gift?: boolean;
    /** «N seats are kept for you» */
    seats?: number;
    /** the adults-only sentence */
    adults?: boolean;
    /** the hand-sketched guest table and the seating-plan promise */
    plan?: boolean;
    /** the guests' chat card — named, never linked from a sample */
    guestChat?: boolean;
    /** the couple's story, told short — the torn-blue strip's script band */
    story?: T;
    /** the velvet strip's white greeting panel — dear friends, the day, huge */
    greeting?: boolean;
    /** the velvet strip's DETAILS band — the organizer's line, drawn bouquet */
    details?: boolean;
    /** the sage strip's two venue cards with VIEW LOCATION pills */
    venues?: boolean;
    /** the day's palette, NAMED — the rich dress-code card (2026-08-24) */
    dressNames?: T[];
    /** what not to wear, in the couple's own words */
    dressAvoid?: T;
    /** a 3D envelope opens the page (components/ui/3d/Envelope3D.tsx) */
    envelope?: boolean;
    /** the ground this example stands on — paper grain, linen weave, velvet
     *  sheen or a watercolour wash (components/ui/Fx.tsx → Grain) */
    texture?: "paper" | "linen" | "velvet" | "wash";
  };
};

const D = "2026-11-14"; // a Saturday, all samples

const wedding = (n: 1 | 2 | 3 | 4 | 5 | 6 | 7, s: Omit<TemplateSpec, "category" | "n" | "id" | "event"> & { event?: Partial<TemplateSpec["event"]> }): TemplateSpec => ({
  id: `wedding-${n}`,
  category: "wedding",
  n,
  ...s,
  event: {
    a: { hy: "Նարե", en: "Nare" },
    b: { hy: "Հայկ", en: "Hayk" },
    kicker: { hy: "Հրավիրում ենք մեր հարսանիքին", en: "Invite you to their wedding", ru: "Приглашаем на нашу свадьбу" },
    date: `${D}T15:00:00+04:00`,
    end: `${D}T23:59:00+04:00`,
    city: { hy: "Երևան", en: "Yerevan" },
    venue: { hy: "Սուրբ Աստվածածին եկեղեցի", en: "Surb Astvatsatsin Church" },
    address: { hy: "Երևան", en: "Yerevan" },
    stops: [
      { time: "12:30", name: { hy: "Հարսի տուն", en: "The bride's home" }, place: { hy: "Մաշտոցի պող. 24", en: "24 Mashtots Ave" } },
      { time: "15:00", name: { hy: "Պսակադրություն", en: "The ceremony" }, place: { hy: "Սուրբ Աստվածածին", en: "Surb Astvatsatsin" } },
      { time: "18:00", name: { hy: "Խնջույք", en: "The banquet" }, place: { hy: "«Ոսկե Այգի»", en: "Voske Aygi hall" } },
    ],
    ...s.event,
  },
});

export const templates: TemplateSpec[] = [
  // ------------------------------------------------------------ WEDDING 1
  wedding(1, {
    name: { hy: "Դասական թագավորական", en: "Classic Royal Elegance" },
    tagline: { hy: "Ոսկեփայլ տառեր, թռչող վարդի թերթեր, տավիղ։", en: "Gold-foil type, floating rose petals, a harp." },
    tags: ["gold", "classic", "petals", "harp", "countdown", "map"],
    theme: { bg: "#F6F1E8", fg: "#1C1A17", fgSoft: "#4A453D", accent: "#C9A66B", accentInk: "#7E6034", panel: "rgba(255,255,255,0.55)", dark: false, face: "serif", foil: true },
    cover: sealHero,
    coverAlt: { hy: "Ոսկե զմուռսով ծրարներ", en: "Gold-sealed envelopes" },
    gallery: [
      { img: handsBouquet, alt: { hy: "Ձեռքեր՝ փնջի վրա", en: "Hands on a bouquet" } },
      { img: rings, alt: { hy: "Մատանիներ", en: "Rings" } },
      { img: wedGoldDusk, alt: { hy: "Զույգը մայրամուտին", en: "The pair at dusk" } },
      { img: lace, alt: { hy: "Ժանյակ", en: "Lace" } },
    ],
    audio: { src: "/audio/pad-warm.mp3", label: { hy: "Տավիղի հանգիստ բեմ (սինթեզված)", en: "Soft harp-like bed (synthesized)" }, synthesized: true },
    fx: "petals",
    blocks: { countdown: true, map: true, gallery: "grid", lightbox: true, rsvp: "inline", timeline: "order", texture: "paper" },
  }),
  // ------------------------------------------------------------ WEDDING 2
  wedding(2, {
    name: { hy: "Կնիք և ժապավեն", en: "Wax Seal & Banner" },
    tagline: { hy: "Կախված կրեմ մագաղաթ, մոմե կնիք, ձեռագիր անուններ։", en: "A hanging cream pennant, a poured wax seal, handwritten names." },
    tags: ["seal", "banner", "script", "beige", "monogram", "hashtag"],
    // MEASURED BEFORE USE (the ivory rule): ink on the plaster ground 9.01:1,
    // ink on the cream paper 15.59:1, the soft grey 7.08:1 on paper / 4.09:1 on
    // the ground; the copper #B87333 is 3.45:1 — WAX AND ORNAMENT ONLY, never a
    // word; the darker copper #8A5324 (5.72:1 on paper) carries the words.
    theme: { bg: "#C7BAAD", fg: "#1F1B17", fgSoft: "#5A5147", accent: "#B87333", accentInk: "#8A5324", panel: "rgba(247,244,238,0.94)", dark: false, face: "serif" },
    cover: sealHero,
    coverAlt: { hy: "Մոմե կնիքով ծրարներ", en: "Envelopes under a wax seal" },
    gallery: [
      { img: lace, alt: { hy: "Ժանյակ", en: "Lace" } },
      { img: rings, alt: { hy: "Մատանիներ", en: "Rings" } },
      { img: shoes, alt: { hy: "Կոշիկ խոտի մեջ", en: "A shoe in grass" } },
      { img: ringbox, alt: { hy: "Մատանիների տուփ", en: "Ring box" } },
      { img: coupleHill, alt: { hy: "Բլրի վրա", en: "On the ridge" } },
      { img: handsBouquet, alt: { hy: "Փունջ", en: "Bouquet" } },
    ],
    fx: "none",
    blocks: { sealBanner: true, countdown: true, timeline: "order", map: true, dressCode: ["#F7F4EE", "#1F1B17", "#B87333"], gallery: "grid", lightbox: true, rsvp: "inline", ics: true, hashtag: { hy: "#ՆարեԵվՀայկ", en: "#NareAndHayk" } },
  }),
  // ------------------------------------------------------------ WEDDING 3
  wedding(3, {
    name: { hy: "Բոհո ծաղկային այգի", en: "Boho Floral Garden" },
    tagline: { hy: "Ջրաներկ շրջանակ, շնչող ֆոն, զուգահեռ ժամանակացույց։", en: "A watercolour frame, a breathing backdrop, a parallax timeline." },
    tags: ["boho", "floral", "watercolor", "video", "parallax", "dress-code"],
    theme: { bg: "#F4EFE6", fg: "#2A2622", fgSoft: "#5A4E44", accent: "#C98B7A", accentInk: "#8F4B45", panel: "rgba(255,255,255,0.5)", dark: false, face: "serif-italic" },
    cover: coupleHill,
    coverAlt: { hy: "Բլրի լանջին", en: "On the ridge" },
    gallery: [
      { img: coupleHill, alt: { hy: "Բլուր", en: "Ridge" } },
      { img: shoes, alt: { hy: "Կոշիկ", en: "Shoe" } },
      { img: handsBouquet, alt: { hy: "Փունջ", en: "Bouquet" } },
    ],
    video: { src: "/video/ambient-rose.mp4", poster: coupleHill, synthesized: true },
    fx: "leaves",
    blocks: { watercolorFrame: true, timeline: "parallax", dressCode: ["#C98B7A", "#E9CFC8", "#8C9A82", "#F4EFE6", "#5A4E44"], rsvp: "inline", gallery: "grid", lightbox: true },
  }),

  // ------------------------------------------------------------ WEDDING 4
  // After the torn-paper blue programme strip (client reference, 2026-08-23):
  // THE WEDDING OF, the monogrammed photograph, the three-cell date, the
  // scripture, torn bands, the entourage, the colour guide, the gift line,
  // the hashtag, the gallery, the QR. MEASURED: ink #22293F on paper #F7F4EC
  // 13.11:1; the blue #35549C carries words at 6.59:1 and TAKES white type at
  // 7.24:1; the soft #4C5570 6.73:1; the light blue #7C97D6 is 2.63:1 —
  // ORNAMENT ONLY (torn bands, daisies), never a word.
  wedding(4, {
    name: { hy: "Կապույտ պատռվածք", en: "Torn Blue Programme" },
    tagline: { hy: "Պատռված թղթի շերտեր, մարգարտածաղիկներ, մոնոգրամ լուսանկարի վրա։", en: "Torn-paper bands, line-drawn daisies, a monogram over the photograph." },
    tags: ["blue", "torn-paper", "daisies", "programme", "entourage", "qr"],
    after: { hy: "Պատվիրատուի ուղարկած կապույտ ծրագրով հրավերի անատոմիայով", en: "After the torn-blue programme strip the client sent" },
    theme: { bg: "#F7F4EC", fg: "#22293F", fgSoft: "#4C5570", accent: "#7C97D6", accentInk: "#35549C", panel: "rgba(255,255,255,0.78)", dark: false, face: "serif" },
    cover: wedMist,
    coverAlt: { hy: "Զույգը մշուշի մեջ", en: "The pair in the mist" },
    gallery: [
      { img: handsBouquet, alt: { hy: "Փունջ", en: "Bouquet" } },
      { img: rings, alt: { hy: "Մատանիներ", en: "Rings" } },
      { img: wedBlueWalk, alt: { hy: "Ճանապարհին", en: "Down the path" } },
      { img: lace, alt: { hy: "Ժանյակ", en: "Lace" } },
      { img: chapelCliff, alt: { hy: "Մատուռը ժայռին", en: "The chapel on the cliff" } },
      { img: wedFloat, alt: { hy: "Լողացող մոմեր", en: "Floating candles" } },
    ],
    fx: "none",
    blocks: {
      tornHero: true,
      envelope: true,
      texture: "linen",
      quote: {
        hy: "«Երեք բան կմնա հավիտյան՝ հավատը, հույսը և սերը. և սերը մեծագույնն է»",
        en: "“Three things will last forever — faith, hope and love; and the greatest of these is love.”",
        ru: "«Три вещи пребудут вечно — вера, надежда и любовь; и любовь из них больше»",
      },
      timeline: "order",
      map: true,
      story: {
        hy: "Ծանոթացանք Երևանի աշնանը՝ մեկ բաժակ սուրճի շուրջ։ Յոթ տարի անց, նույն սրճարանում, Հայկը ծնկի իջավ։ Հիմա գրում ենք մեր ամենակարևոր գլուխը — և ուզում ենք, որ դուք լինեք կողքին։",
        en: "We met in a Yerevan autumn, over one cup of coffee. Seven years later, in the same café, Hayk went down on one knee. Now we are writing our most important chapter — and we want you beside us.",
        ru: "Мы познакомились ереванской осенью, за чашкой кофе. Семь лет спустя, в том же кафе, Айк встал на одно колено. Теперь мы пишем нашу самую важную главу — и хотим, чтобы вы были рядом.",
      },
      entourage: [
        { role: { hy: "Հարսի ծնողները", en: "Parents of the bride", ru: "Родители невесты" }, names: ["Անահիտ Սարգսյան", "Արմեն Սարգսյան"] },
        { role: { hy: "Փեսայի ծնողները", en: "Parents of the groom", ru: "Родители жениха" }, names: ["Լուսինե Հակոբյան", "Վահե Հակոբյան"] },
        { role: { hy: "Քավոր և քավորկին", en: "Godfather and godmother", ru: "Кум и кума" }, names: ["Տիգրան և Մարիամ Ավագյաններ"] },
      ],
      dressCode: ["#22375F", "#35549C", "#7C97D6", "#C9D4EE", "#F7F4EC"],
      dressNames: [
        { hy: "Խորը նավակապույտ", en: "Deep navy", ru: "Тёмно-синий" },
        { hy: "Թագավորական կապույտ", en: "Royal blue", ru: "Королевский синий" },
        { hy: "Մարգարտածաղկի կապույտ", en: "Daisy blue", ru: "Васильковый" },
        { hy: "Բաց երկնագույն", en: "Powder blue", ru: "Пудрово-голубой" },
        { hy: "Փղոսկր", en: "Ivory", ru: "Айвори" },
      ],
      gift: true,
      hashtag: { hy: "#ՆարեԵվՀայկ2026", en: "#NareAndHayk2026" },
      gallery: "grid",
      lightbox: true,
      rsvp: "inline",
      qr: true,
      ics: true,
    },
  }),
  // ------------------------------------------------------------ WEDDING 5
  // After the navy hydrangea strip (client reference, 2026-08-23): the dark
  // night, drawn hydrangea heads, falling petals, the dress forms, the
  // guests' chat. MEASURED on navy #1C2340: fg #F2F1EC 13.62:1, soft #C3C6D6
  // 9.07:1, the bloom #A9BBE3 8.00:1 (may speak), accentInk #C7D4F0 10.34:1.
  wedding(5, {
    name: { hy: "Հորտենզիայի գիշեր", en: "Hydrangea Night" },
    tagline: { hy: "Մուգ կապույտ գիշեր, նկարված հորտենզիաներ, թափվող թերթիկներ։", en: "A navy night, drawn hydrangea heads, petals coming down." },
    tags: ["navy", "hydrangea", "night", "petals", "chat", "dress-code"],
    after: { hy: "Պատվիրատուի ուղարկած մուգ կապույտ հորտենզիաների անատոմիայով", en: "After the navy hydrangea strip the client sent" },
    theme: { bg: "#1C2340", fg: "#F2F1EC", fgSoft: "#C3C6D6", accent: "#A9BBE3", accentInk: "#C7D4F0", panel: "rgba(246,247,251,0.08)", dark: true, face: "serif-italic" },
    cover: wedSparkler,
    coverAlt: { hy: "Հրավառ գիշեր", en: "A sparkler in the night" },
    gallery: [
      { img: wedNightVenue, alt: { hy: "Երեկոյան սրահը", en: "The venue at dusk" } },
      { img: candles, alt: { hy: "Մոմեր", en: "Candles" } },
      { img: tealights, alt: { hy: "Ջահեր", en: "Tea lights" } },
      { img: lace, alt: { hy: "Ժանյակ", en: "Lace" } },
    ],
    fx: "petals",
    // the strip's own order: greeting → location(+estate) → dress → details → telegram
    blocks: {
      bloomHero: true,
      envelope: true,
      texture: "velvet",
      greeting: true,
      timeline: "order",
      map: true,
      dressCode: ["#E9D8BC", "#A9BBE3", "#141A30"],
      dressNames: [
        { hy: "Շամպայն", en: "Champagne", ru: "Шампань" },
        { hy: "Հորտենզիայի կապույտ", en: "Hydrangea blue", ru: "Голубая гортензия" },
        { hy: "Գիշերային մուգ", en: "Midnight navy", ru: "Ночной синий" },
      ],
      gift: true,
      guestChat: true,
      rsvp: "modal",
      ics: true,
    },
  }),
  // ------------------------------------------------------------ WEDDING 6
  // After the velvet roses taplink (client reference, 2026-08-23): near-black
  // ground, layered roses, the hand-sketched guest table, the organizer's
  // details. MEASURED on #151013: fg #F4EDEA 16.27:1, soft #C9BBB6 10.10:1;
  // the rose red #C0374A is 3.48:1 — ORNAMENT ONLY, never a word; the pale
  // rose #E39AA5 (8.46:1) carries the accent words.
  wedding(6, {
    name: { hy: "Թավշյա վարդեր", en: "Velvet Roses" },
    tagline: { hy: "Սև թավիշ, շերտավոր վարդեր, ձեռագիր սեղանի էսքիզ։", en: "Black velvet, layered roses, a hand-sketched guest table." },
    tags: ["dark", "roses", "velvet", "petals", "seating", "music"],
    after: { hy: "Պատվիրատուի ուղարկած կարմիր վարդերի անատոմիայով", en: "After the dark-rose strip the client sent" },
    theme: { bg: "#151013", fg: "#F4EDEA", fgSoft: "#C9BBB6", accent: "#C0374A", accentInk: "#E39AA5", panel: "rgba(244,237,234,0.07)", dark: true, face: "serif" },
    cover: wedEmbrace,
    coverAlt: { hy: "Գրկախառնություն", en: "The embrace" },
    gallery: [
      { img: wedHeadTable, alt: { hy: "Մոմավառ սեղանը", en: "The candlelit table" } },
      { img: candlestick, alt: { hy: "Մոմակալ", en: "A candlestick" } },
      { img: wedCandleTable, alt: { hy: "Երեկոյան սեղանը", en: "The evening table" } },
      { img: rings, alt: { hy: "Մատանիներ", en: "Rings" } },
    ],
    audio: { src: "/audio/pad-warm.mp3", label: { hy: "Ջերմ լարային բեմ (սինթեզված)", en: "A warm string bed (synthesized)" }, synthesized: true },
    fx: "petals",
    // the strip's own order: greeting → location → guest place → dress → details
    blocks: {
      roseHero: true,
      envelope: true,
      texture: "velvet",
      greeting: true,
      timeline: "order",
      map: true,
      plan: true,
      dressCode: ["#151013", "#F4EDEA"],
      dressNames: [
        { hy: "Թավշյա սև", en: "Velvet black", ru: "Бархатный чёрный" },
        { hy: "Փղոսկր", en: "Ivory", ru: "Айвори" },
      ],
      details: true,
      rsvp: "guests",
      ics: true,
    },
  }),
  // ------------------------------------------------------------ WEDDING 7
  // After the eucalyptus vow strip (client reference, 2026-08-23): the
  // hairline frame, the initials, the arched photograph, the invitation
  // sentence, the parents, the reserved seats, the adults-only line.
  // MEASURED on cream #F3F1E7: ink #33402F 9.68:1, soft #5C6653 5.33:1; the
  // sage #8FA383 is 2.40:1 — ORNAMENT ONLY; #4C5F45 (6.12:1) speaks.
  wedding(7, {
    name: { hy: "Էվկալիպտի ուխտ", en: "Eucalyptus Vow" },
    tagline: { hy: "Բարակ շրջանակ, կամարաձև լուսանկար, էվկալիպտի ճյուղեր։", en: "A hairline frame, an arched photograph, eucalyptus sprigs." },
    tags: ["sage", "eucalyptus", "arch", "parents", "seats", "meal"],
    after: { hy: "Պատվիրատուի ուղարկած էվկալիպտե հրավերի անատոմիայով", en: "After the eucalyptus strip the client sent" },
    theme: { bg: "#F3F1E7", fg: "#33402F", fgSoft: "#5C6653", accent: "#8FA383", accentInk: "#4C5F45", panel: "rgba(255,255,255,0.62)", dark: false, face: "serif-italic" },
    cover: wedArbor,
    coverAlt: { hy: "Կամարը՝ ծաղիկներով", en: "The arbor, flowers and fabric" },
    gallery: [
      { img: wedArchHills, alt: { hy: "Կամարը բլուրների վրա", en: "The arch over the hills" } },
      { img: handsBouquet, alt: { hy: "Փունջ", en: "Bouquet" } },
      { img: wedSageTable, alt: { hy: "Արարողության սեղանը", en: "The ceremony table" } },
      { img: chapelCliff, alt: { hy: "Մատուռ", en: "The chapel" } },
    ],
    fx: "leaves",
    blocks: {
      sprigHero: true,
      envelope: true,
      texture: "wash",
      venues: true,
      quote: {
        hy: "«Երեք բան կմնա հավիտյան՝ հավատը, հույսը և սերը. և սերը մեծագույնն է» — Ա Կորնթ. 13:13",
        en: "“Three things will last forever — faith, hope and love; and the greatest of these is love.” — 1 Corinthians 13:13",
        ru: "«Три вещи пребудут вечно — вера, надежда и любовь; и любовь из них больше» — 1 Кор. 13:13",
      },
      invite: {
        hy: "Մեծ ուրախությամբ և երախտապարտ սրտերով, ծնողների հետ միասին, հրավիրում ենք կիսելու մեր սիրո տոնը։",
        en: "With great joy and grateful hearts, together with our parents, we invite you to share the celebration of our love.",
        ru: "С большой радостью и благодарными сердцами, вместе с родителями, приглашаем разделить праздник нашей любви.",
      },
      timeline: "order",
      map: true,
      entourage: [
        { role: { hy: "Փեսայի ծնողները", en: "Parents of the groom", ru: "Родители жениха" }, names: ["Կարինե Մանուկյան", "Սամվել Մանուկյան"] },
        { role: { hy: "Հարսի ծնողները", en: "Parents of the bride", ru: "Родители невесты" }, names: ["Նունե Գրիգորյան", "Աշոտ Գրիգորյան"] },
      ],
      dressNames: [
        { hy: "Եղեսպակի կանաչ", en: "Sage green", ru: "Шалфейный" },
        { hy: "Կրեմ", en: "Cream", ru: "Кремовый" },
        { hy: "Ձիթապտղի", en: "Olive", ru: "Оливковый" },
      ],
      dressCode: ["#8FA383", "#F3F1E7", "#5C6653"],
      seats: 2,
      gift: true,
      adults: true,
      gallery: "grid",
      lightbox: true,
      rsvp: "meal",
      ics: true,
    },
  }),

  // ---------------------------------------------------------- ENGAGEMENT 1
  {
    id: "engagement-1",
    category: "engagement",
    n: 1,
    name: { hy: "Մատանի և փայլ", en: "Ring & Sparkle" },
    tagline: { hy: "Փայլող մասնիկներ, զույգի նկարը վերևում, երեկոյի ընթացքը, save-the-date։", en: "Sparkle particles, the couple's photo up top, the evening's timeline, save-the-date." },
    tags: ["engagement", "sparkle", "photo", "timeline", "save-the-date", "gold"],
    theme: { bg: "#F7EEEA", fg: "#2A2622", fgSoft: "#5A4E44", accent: "#C9A66B", accentInk: "#8F4B45", panel: "rgba(255,255,255,0.55)", dark: false, face: "serif-italic" },
    cover: ringbox,
    coverAlt: { hy: "Բացված մատանիների տուփ", en: "An open ring box" },
    gallery: [
      { img: ringbox, alt: { hy: "Մատանիների տուփ", en: "Ring box" } },
      { img: rings, alt: { hy: "Մատանիներ", en: "Rings" } },
      { img: handsBouquet, alt: { hy: "Ձեռքեր", en: "Hands" } },
      { img: coupleHill, alt: { hy: "Բլուր", en: "Ridge" } },
    ],
    audio: { src: "/audio/pad-warm.mp3", label: { hy: "Ջերմ բեմ (սինթեզված)", en: "Warm bed (synthesized)" }, synthesized: true },
    fx: "sparkles",
    event: {
      a: { hy: "Անի", en: "Ani" },
      b: { hy: "Արամ", en: "Aram" },
      kicker: { hy: "Նշանվում ենք", en: "We are getting engaged", ru: "Мы обручаемся" },
      date: `${D}T18:00:00+04:00`,
      end: `${D}T23:00:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "«Այգի» ռեստորան", en: "Aygi restaurant" },
      address: { hy: "Աբովյան 12", en: "12 Abovyan St" },
      stops: [
        { time: "18:00", name: { hy: "Ընդունելություն", en: "Reception" }, place: { hy: "Տեռաս", en: "Terrace" } },
        { time: "19:00", name: { hy: "Ընթրիք", en: "Dinner" }, place: { hy: "Սրահ", en: "Hall" } },
        { time: "21:00", name: { hy: "Պար", en: "Dancing" }, place: { hy: "Սրահ", en: "Hall" } },
      ],
    },
    blocks: { countdown: true, timeline: "order", ics: true, map: true, gallery: "grid", lightbox: true, rsvp: "inline" },
  },

  // ------------------------------------------------------------ BIRTHDAY 1
  {
    id: "birthday-1",
    category: "birthday",
    n: 1,
    name: { hy: "Նեոնային գիշեր", en: "Neon Night Party" },
    tagline: { hy: "Մութ սենյակ, նեոն, պտտվող կոնֆետի, տարիքի հաշվարկ։", en: "Dark room, neon glow, spinning confetti, an age countdown." },
    tags: ["neon", "dark", "confetti", "music", "party", "countdown"],
    theme: { bg: "#0B0A12", fg: "#F3EFE7", fgSoft: "#B8B2C8", accent: "#FF4FD8", accentInk: "#FF7BE3", panel: "rgba(255,255,255,0.06)", dark: true, face: "sans", neon: true },
    cover: starsNight,
    coverAlt: { hy: "Ոսկե աստղեր սևի վրա", en: "Gold stars on black" },
    gallery: [
      { img: starsNight, alt: { hy: "Աստղեր", en: "Stars" } },
      { img: candles, alt: { hy: "Մոմեր", en: "Candles" } },
      { img: tealights, alt: { hy: "Մոմիկներ", en: "Tealights" } },
    ],
    audio: { src: "/audio/pad-bright.mp3", label: { hy: "Պայծառ բեմ (սինթեզված)", en: "Bright bed (synthesized)" }, synthesized: true },
    fx: "confetti",
    event: {
      a: { hy: "Անի", en: "Ani" },
      b: { hy: "30", en: "30" },
      kicker: { hy: "Ծննդյան երեկույթ", en: "A birthday night", ru: "Вечер дня рождения" },
      date: `${D}T20:00:00+04:00`,
      end: `${D}T23:59:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "«Լույս» բար", en: "Luys bar" },
      address: { hy: "Թումանյան 12, Երևան", en: "12 Tumanyan St, Yerevan" },
      stops: [
        { time: "20:00", name: { hy: "Դռները բացվում են", en: "Doors" }, place: { hy: "«Լույս»", en: "Luys" } },
        { time: "21:30", name: { hy: "Տորթը", en: "The cake" }, place: { hy: "Տանիք", en: "Rooftop" } },
        { time: "23:00", name: { hy: "Պար", en: "Dancing" }, place: { hy: "Ներքև", en: "Downstairs" } },
      ],
    },
    blocks: { ageCountdown: { born: "1996-11-14" }, countdown: true, rsvp: "guests", gallery: "grid", lightbox: true, map: true },
  },
  // ------------------------------------------------------------ BIRTHDAY 2
  {
    id: "birthday-2",
    category: "birthday",
    n: 2,
    name: { hy: "Ոսկե հոբելյան", en: "Golden Jubilee" },
    tagline: { hy: "Ոսկե եզրագիծ, հիշողությունների ֆոն, կենացների պատ։", en: "A gold-foil border, a memory reel behind, a wall of toasts." },
    tags: ["gold", "anniversary", "elegance", "video", "toasts", "guests"],
    theme: { bg: "#14120F", fg: "#F3EFE7", fgSoft: "#C9C2B4", accent: "#D4B478", accentInk: "#D4B478", panel: "rgba(255,255,255,0.06)", dark: true, face: "serif", foil: true },
    cover: cakeGold,
    coverAlt: { hy: "Ոսկե ժապավենով տորթ", en: "A cake with gold ribbon" },
    gallery: [
      { img: cakeGold, alt: { hy: "Տորթ", en: "Cake" } },
      { img: candles, alt: { hy: "Մոմեր", en: "Candles" } },
      { img: ringbox, alt: { hy: "Հիշատակ", en: "Keepsake" } },
    ],
    video: { src: "/video/ambient-gold.mp4", poster: cakeGold, synthesized: true },
    audio: { src: "/audio/pad-warm.mp3", label: { hy: "Ջերմ բեմ (սինթեզված)", en: "Warm bed (synthesized)" }, synthesized: true },
    fx: "gold",
    event: {
      a: { hy: "Արմեն և Սոնա", en: "Armen & Sona" },
      b: { hy: "50", en: "50" },
      kicker: { hy: "Ամուսնության 50-ամյակ", en: "Fifty years married", ru: "50 лет вместе" },
      date: `${D}T18:00:00+04:00`,
      end: `${D}T23:00:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "«Արարատ» սրահ", en: "Ararat hall" },
      address: { hy: "Բաղրամյան 31", en: "31 Baghramyan Ave" },
      stops: [
        { time: "18:00", name: { hy: "Ընդունելություն", en: "Reception" }, place: { hy: "«Արարատ»", en: "Ararat" } },
        { time: "19:00", name: { hy: "Ընթրիք", en: "Dinner" }, place: { hy: "Մեծ սրահ", en: "Main hall" } },
        { time: "21:00", name: { hy: "Կենացներ", en: "Toasts" }, place: { hy: "Մեծ սրահ", en: "Main hall" } },
      ],
    },
    blocks: { memoryReel: true, rsvp: "guests", toastBoard: true, gallery: "grid", lightbox: true, countdown: true },
  },
  // ------------------------------------------------------------ BIRTHDAY 3
  {
    id: "birthday-3",
    category: "birthday",
    n: 3,
    name: { hy: "Մանկական սուպերհերոս", en: "Kids Superhero & Play" },
    tagline: { hy: "Ցատկող շարժում, նկարազարդ հերոս, քարտեզի կետ, ծնողների նշում։", en: "Springy motion, an illustrated hero, a map pin, a note for parents." },
    tags: ["kids", "playful", "spring", "illustration", "pin", "parents"],
    theme: { bg: "#FFF7E8", fg: "#26223A", fgSoft: "#5B5476", accent: "#FF7A59", accentInk: "#B23F22", panel: "rgba(255,255,255,0.7)", dark: false, face: "sans" },
    cover: balloonsKids,
    coverAlt: { hy: "Վարդագույն և դեղին փուչիկներ", en: "Pink and yellow balloons" },
    gallery: [
      { img: balloonsKids, alt: { hy: "Փուչիկներ", en: "Balloons" } },
      { img: balloonArch, alt: { hy: "Փուչիկների կամար", en: "Balloon arch" } },
      { img: cakeGold, alt: { hy: "Տորթ", en: "Cake" } },
    ],
    fx: "confetti",
    event: {
      a: { hy: "Դավիթ", en: "David" },
      b: { hy: "6", en: "6" },
      kicker: { hy: "Դառնում է 6", en: "Turns six", ru: "Исполняется 6" },
      date: `${D}T13:00:00+04:00`,
      end: `${D}T16:00:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "«Ուրախ պարկ»", en: "Happy Park" },
      address: { hy: "Կոմիտաս 8", en: "8 Komitas Ave" },
      stops: [
        { time: "13:00", name: { hy: "Հավաքվում ենք", en: "We gather" }, place: { hy: "Մուտք", en: "Entrance" } },
        { time: "14:00", name: { hy: "Խաղեր", en: "Games" }, place: { hy: "Խաղասրահ", en: "Play hall" } },
        { time: "15:00", name: { hy: "Տորթ", en: "Cake" }, place: { hy: "Սրճարան", en: "Café" } },
      ],
    },
    blocks: { pinDrop: true, parentsNote: true, rsvp: "guests", gallery: "grid", lightbox: true, countdown: true },
  },
  // ------------------------------------------------------------ BIRTHDAY 4
  {
    id: "birthday-4",
    category: "birthday",
    n: 4,
    name: { hy: "Հեքիաթի հովիտ", en: "Storybook Valley" },
    tagline: { hy: "Շերտավոր հովիտ՝ փուչիկների կամարի հետևում. ոլորումը տեսախցիկն է։", en: "A valley in layers, behind a balloon arch — the scroll is the camera." },
    tags: ["scene", "parallax", "illustrated", "arch", "layers", "canopy"],
    after: {
      hy: "Երեք շարժական «տեսարան-հրավերի» երկրաչափությամբ (Pinterest 1020206121835971536, 953496552376593884, 76561262410085706)՝ շերտերի խորությունը, կամարի միջով անցումը, վերևից կախված զարդագոտին։",
      en: "After the geometry of three animated scene invitations (Pinterest 1020206121835971536, 953496552376593884, 76561262410085706) — the depth of the layers, the pass through the arch, the ornament band hung from the top edge.",
    },
    // MEASURED BEFORE USE, off the references themselves: the ink #3F2E22 is
    // 10.53:1 on the parchment ground and 8.84:1 on the palest measured sky
    // (#C7D6F5), so the title needs no plate under it; the soft brown 5.49:1;
    // the amber #D79854 is 2.01:1 — CANOPY, BALLOONS AND HAIRLINES ONLY, never
    // a word; the darker #8C5A24 (4.75:1) carries the age and the rules.
    theme: { bg: "#EFE7DA", fg: "#3F2E22", fgSoft: "#6B584A", accent: "#D79854", accentInk: "#8C5A24", panel: "rgba(251,248,242,0.92)", dark: false, face: "serif" },
    cover: balloonArch,
    coverAlt: { hy: "Փուչիկների կամար", en: "A balloon arch" },
    gallery: [
      { img: balloonArch, alt: { hy: "Փուչիկների կամար", en: "Balloon arch" } },
      { img: candles, alt: { hy: "Մոմեր", en: "Candles" } },
      { img: cakeGold, alt: { hy: "Տորթ", en: "Cake" } },
      { img: tealights, alt: { hy: "Մոմիկներ", en: "Tealights" } },
    ],
    audio: { src: "/audio/pad-warm.mp3", label: { hy: "Ջերմ բեմ (սինթեզված)", en: "Warm bed (synthesized)" }, synthesized: true },
    fx: "none", // the valley draws its own air — motes, birds, a lit garland
    event: {
      a: { hy: "Անահիտ", en: "Anahit" },
      b: { hy: "40", en: "40" },
      kicker: { hy: "Ծննդյան երեկո՝ հովտում", en: "A birthday evening in the valley", ru: "День рождения в долине" },
      date: `${D}T18:00:00+04:00`,
      end: `${D}T23:30:00+04:00`,
      city: { hy: "Դիլիջան", en: "Dilijan" },
      venue: { hy: "«Հովիտ» այգի-ռեստորան", en: "Hovit garden restaurant" },
      address: { hy: "Գետափնյա 4, Դիլիջան", en: "4 Getapnya St, Dilijan" },
      stops: [
        { time: "18:00", name: { hy: "Հանդիպում կամարի մոտ", en: "We meet at the arch" }, place: { hy: "Այգի", en: "The garden" } },
        { time: "19:30", name: { hy: "Ընթրիք լույսերի տակ", en: "Dinner under the lights" }, place: { hy: "Տեռաս", en: "The terrace" } },
        { time: "21:00", name: { hy: "Տորթը և կենացները", en: "The cake and the toasts" }, place: { hy: "Լճափ", en: "By the water" } },
        { time: "22:00", name: { hy: "Պար", en: "Dancing" }, place: { hy: "Այգի", en: "The garden" } },
      ],
    },
    blocks: {
      sceneHero: true, countdown: true, ageCountdown: { born: "1986-11-14" }, timeline: "order", map: true,
      dressCode: ["#EFE7DA", "#5F6B4A", "#D79854", "#3F2E22"], gallery: "grid", lightbox: true, rsvp: "guests", ics: true,
    },
  },
  // ------------------------------------------------------------ BIRTHDAY 5
  {
    id: "birthday-5",
    category: "birthday",
    n: 5,
    name: { hy: "Ամրոցի հովիտ", en: "Castle Valley" },
    tagline: { hy: "Ձյունոտ գագաթներ, ոսկե անտառ, պտտվող ջրաղաց. կադրը ինքն է շնչում։", en: "Snow peaks, a golden forest, a turning watermill — the frame breathes on its own." },
    tags: ["castle", "mountains", "autumn", "gold", "mill", "fairytale"],
    after: {
      hy: "Մեկ շարժական «տեսարան-հրավերի» երկրաչափությամբ (Pinterest 76561262410085706)՝ ձյունոտ լեռների տակ հեքիաթային ավան, ոսկե անտառ, ջրաղաց լճափին — և տեսախցիկ, որ երբեք չի կանգնում։",
      en: "After the geometry of one animated scene invitation (Pinterest 76561262410085706) — a fairytale village under snow peaks, the golden forest, the watermill at the pond, and a camera that never stops.",
    },
    // MEASURED BEFORE USE, off the reference's frames: the ink #33291C is
    // 12.00:1 on the autumn-cream ground and 13.42:1 on the panel; the shared
    // scene inks read 7.90:1 (#3F2E22) and 4.12:1 (#6B584A) on the DEEPEST
    // periwinkle sky, 10.21:1 / 5.32:1 on the pale upper band where the type
    // actually sits — so the gradient keeps its top pale. The gold #C9A245 is
    // 2.02:1 — FOREST, ORNAMENT AND HAIRLINES ONLY, never a word; the darker
    // #7E6430 (4.71:1 on ground, 5.27:1 on panel) carries the age and rules.
    theme: { bg: "#F2EBDC", fg: "#33291C", fgSoft: "#635441", accent: "#C9A245", accentInk: "#7E6430", panel: "rgba(251,248,240,0.92)", dark: false, face: "serif" },
    cover: araratDawn,
    coverAlt: { hy: "Լեռներ արշալույսին", en: "Mountains at dawn" },
    gallery: [
      { img: araratDawn, alt: { hy: "Լեռներ", en: "Mountains" } },
      { img: noravank, alt: { hy: "Վանք ժայռերի մեջ", en: "A monastery in the cliffs" } },
      { img: cakeGold, alt: { hy: "Տորթ", en: "Cake" } },
      { img: candles, alt: { hy: "Մոմեր", en: "Candles" } },
    ],
    audio: { src: "/audio/pad-bright.mp3", label: { hy: "Պայծառ բեմ (սինթեզված)", en: "Bright bed (synthesized)" }, synthesized: true },
    fx: "none", // the valley draws its own air — the flock, the falling leaves
    event: {
      a: { hy: "Արեգ", en: "Areg" },
      b: { hy: "10", en: "10" },
      kicker: { hy: "Դառնում է 10՝ ամրոցի հովտում", en: "Turning ten, in the castle valley", ru: "Исполняется 10 — в долине замка" },
      date: `${D}T13:00:00+04:00`,
      end: `${D}T17:00:00+04:00`,
      city: { hy: "Ծաղկաձոր", en: "Tsaghkadzor" },
      venue: { hy: "«Ամրոց» այգի", en: "Amrots garden" },
      address: { hy: "Օլիմպիական 7, Ծաղկաձոր", en: "7 Olympic St, Tsaghkadzor" },
      stops: [
        { time: "13:00", name: { hy: "Հավաքվում ենք դարպասի մոտ", en: "We gather at the gate" }, place: { hy: "Այգի", en: "The garden" } },
        { time: "14:00", name: { hy: "Արկածային խաղ անտառում", en: "A quest in the forest" }, place: { hy: "Անտառ", en: "The woods" } },
        { time: "15:30", name: { hy: "Տորթը", en: "The cake" }, place: { hy: "Տաղավար", en: "The pavilion" } },
        { time: "16:30", name: { hy: "Լուսանկար ջրաղացի մոտ", en: "Photographs by the mill" }, place: { hy: "Լճափ", en: "By the pond" } },
      ],
    },
    blocks: {
      castleScene: true, countdown: true, ageCountdown: { born: "2016-11-14" }, timeline: "order", map: true,
      gallery: "grid", lightbox: true, rsvp: "guests", ics: true,
    },
  },

  // ---------------------------------------------------------- CHRISTENING 1
  {
    id: "christening-1",
    category: "christening",
    n: 1,
    name: { hy: "Հրեշտակային ամպ", en: "Angelic Soft Cloud" },
    tagline: { hy: "Բաց երկնագույն և վարդագույն, լողացող ամպեր, կնքահոր և կնքամոր քարտ։", en: "Pale blue and pink, drifting clouds, a godparents' card." },
    tags: ["pastel", "clouds", "soft", "godparents", "order", "video"],
    theme: { bg: "#F1F5FA", fg: "#2A3140", fgSoft: "#5A6478", accent: "#B7CBE6", accentInk: "#3E5C8A", panel: "rgba(255,255,255,0.6)", dark: false, face: "serif" },
    cover: jarsAngel,
    coverAlt: { hy: "Ժանյակով և հրեշտակով բանկաներ", en: "Jars with lace and an angel charm" },
    gallery: [
      { img: jarsAngel, alt: { hy: "Հրեշտակ", en: "Angel" } },
      { img: candlestick, alt: { hy: "Մոմակալ", en: "Candlestick" } },
      { img: chapelCliff, alt: { hy: "Մատուռ", en: "Chapel" } },
    ],
    video: { src: "/video/ambient-sky.mp4", poster: jarsAngel, synthesized: true },
    fx: "clouds",
    event: {
      a: { hy: "Մարիամ", en: "Mariam" },
      kicker: { hy: "Կնունքի սուրբ խորհուրդ", en: "The sacrament of baptism", ru: "Таинство крещения" },
      date: `${D}T11:00:00+04:00`,
      end: `${D}T16:00:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "Սուրբ Սարգիս եկեղեցի", en: "Surb Sargis Church" },
      address: { hy: "Իսրայելյան 21", en: "21 Israelyan St" },
      stops: [
        { time: "11:00", name: { hy: "Կնունք", en: "The baptism" }, place: { hy: "Սուրբ Սարգիս", en: "Surb Sargis" } },
        { time: "13:00", name: { hy: "Ճաշ", en: "Lunch" }, place: { hy: "«Այգի» ռեստորան", en: "Aygi restaurant" } },
      ],
    },
    blocks: { godparents: true, timeline: "order", rsvp: "inline", gallery: "grid", lightbox: true, countdown: true },
  },
  // ---------------------------------------------------------- CHRISTENING 2
  {
    id: "christening-2",
    category: "christening",
    n: 2,
    name: { hy: "Ոսկե տերև", en: "Eucharist Gold Leaf" },
    tagline: { hy: "Կրեմե էջ, խաչի փայլ, ճանապարհ, սննդի ընտրություն։", en: "A cream page, a sheen on the cross, directions, a meal choice." },
    tags: ["cream", "minimal", "cross", "directions", "meal", "gold"],
    theme: { bg: "#F7F2E9", fg: "#1C1A17", fgSoft: "#4A453D", accent: "#C9A66B", accentInk: "#7E6034", panel: "rgba(255,255,255,0.55)", dark: false, face: "serif", foil: true },
    cover: candleCross,
    coverAlt: { hy: "Խաչով մոմ", en: "A candle with a cross" },
    gallery: [
      { img: candleCross, alt: { hy: "Մոմ", en: "Candle" } },
      { img: candlestick, alt: { hy: "Մոմակալ", en: "Candlestick" } },
      { img: chapelCliff, alt: { hy: "Մատուռ", en: "Chapel" } },
    ],
    fx: "gold",
    event: {
      a: { hy: "Արամ", en: "Aram" },
      kicker: { hy: "Կնունք", en: "Baptism", ru: "Крещение" },
      date: `${D}T12:00:00+04:00`,
      end: `${D}T17:00:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "Սուրբ Հովհաննես եկեղեցի", en: "Surb Hovhannes Church" },
      address: { hy: "Կոնդ", en: "Kond" },
      stops: [
        { time: "12:00", name: { hy: "Կնունք", en: "The baptism" }, place: { hy: "Սուրբ Հովհաննես", en: "Surb Hovhannes" } },
        { time: "14:00", name: { hy: "Ճաշ", en: "Lunch" }, place: { hy: "«Դոլմամա»", en: "Dolmama" } },
      ],
    },
    blocks: { cross: true, map: true, rsvp: "meal", gallery: "grid", lightbox: true, countdown: true },
  },
  // ---------------------------------------------------------- CHRISTENING 3
  {
    id: "christening-3",
    category: "christening",
    n: 3,
    name: { hy: "Ծաղկային օրհնություն", en: "Floral Blessing" },
    tagline: { hy: "Պտտվող բուսական պսակ, ակուստիկ բեմ, նվերների հղումներ։", en: "A turning botanical wreath, an acoustic bed, registry links." },
    tags: ["floral", "wreath", "acoustic", "registry", "botanical"],
    theme: { bg: "#F3F5EF", fg: "#26302A", fgSoft: "#55604B", accent: "#8C9A82", accentInk: "#5E6B55", panel: "rgba(255,255,255,0.55)", dark: false, face: "serif-italic" },
    cover: chapelCliff,
    coverAlt: { hy: "Ժայռի մատուռ", en: "The cliff chapel" },
    gallery: [
      { img: chapelCliff, alt: { hy: "Մատուռ", en: "Chapel" } },
      { img: jarsAngel, alt: { hy: "Հրեշտակ", en: "Angel" } },
      { img: handsBouquet, alt: { hy: "Փունջ", en: "Bouquet" } },
    ],
    audio: { src: "/audio/pad-soft.mp3", label: { hy: "Մեղմ բեմ (սինթեզված)", en: "Soft bed (synthesized)" }, synthesized: true },
    fx: "leaves",
    event: {
      a: { hy: "Լիլիթ", en: "Lilit" },
      kicker: { hy: "Կնունքի օրհնություն", en: "A blessing at baptism", ru: "Благословение крещения" },
      date: `${D}T11:30:00+04:00`,
      end: `${D}T16:00:00+04:00`,
      city: { hy: "Գառնի", en: "Garni" },
      venue: { hy: "Սուրբ Աստվածածին, Գառնի", en: "Surb Astvatsatsin, Garni" },
      address: { hy: "Գառնի", en: "Garni" },
      stops: [
        { time: "11:30", name: { hy: "Կնունք", en: "The baptism" }, place: { hy: "Գառնի", en: "Garni" } },
        { time: "14:00", name: { hy: "Ճաշ", en: "Lunch" }, place: { hy: "Այգու սեղան", en: "Garden table" } },
      ],
    },
    blocks: { wreath: true, registry: true, rsvp: "inline", gallery: "grid", lightbox: true, countdown: true },
  },

  // ------------------------------------------------------------ CORPORATE 1
  {
    id: "corporate-1",
    category: "corporate",
    n: 1,
    name: { hy: "Տեխնոլոգիական գագաթաժողով", en: "Tech Summit & Gala" },
    tagline: { hy: "Կիբեր ցանց, բանախոսների քարտեր, օրացույց, VIP QR։", en: "A cyber grid, speaker cards, add-to-calendar, a VIP QR." },
    tags: ["tech", "summit", "grid", "speakers", "ics", "qr", "dark"],
    theme: { bg: "#070B14", fg: "#E8EEF9", fgSoft: "#9AA7C2", accent: "#4CC9F0", accentInk: "#7ED8F5", panel: "rgba(255,255,255,0.05)", dark: true, face: "sans" },
    cover: stageSpeaker,
    coverAlt: { hy: "Բանախոս բեմին", en: "A speaker on stage" },
    gallery: [
      { img: stageSpeaker, alt: { hy: "Բեմ", en: "Stage" } },
      { img: audience, alt: { hy: "Դահլիճ", en: "Audience" } },
      { img: stageStar, alt: { hy: "Բեմ՝ աստղով", en: "Stage with a star" } },
    ],
    fx: "grid",
    event: {
      a: { hy: "ArmTech Summit", en: "ArmTech Summit" },
      b: { hy: "2026", en: "2026" },
      kicker: { hy: "Գագաթաժողով և գալա", en: "Summit & gala", ru: "Саммит и гала-вечер" },
      date: `${D}T09:30:00+04:00`,
      end: `${D}T22:00:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "Կարեն Դեմիրճյանի համալիր", en: "Karen Demirchyan Complex" },
      address: { hy: "Ծիծեռնակաբերդի խճ. 1", en: "1 Tsitsernakaberd Hwy" },
      stops: [
        { time: "09:30", name: { hy: "Գրանցում", en: "Check-in" }, place: { hy: "Նախասրահ", en: "Foyer" } },
        { time: "10:00", name: { hy: "Բացում", en: "Opening" }, place: { hy: "Մեծ դահլիճ", en: "Main hall" } },
        { time: "19:00", name: { hy: "Գալա", en: "Gala" }, place: { hy: "Բանկետային սրահ", en: "Banquet hall" } },
      ],
    },
    blocks: { speakers: true, ics: true, qr: true, timeline: "tabs", rsvp: "team", countdown: true, gallery: "grid", lightbox: true },
  },
  // ------------------------------------------------------------ CORPORATE 2
  {
    id: "corporate-2",
    category: "corporate",
    n: 2,
    name: { hy: "Արտադրանքի շնորհանդես", en: "Product Launch Luxe" },
    tagline: { hy: "3D արտադրանք, մուգ ապակի, ժամացույց, գրանցում։", en: "A 3D product, dark glass, a clock, registration." },
    tags: ["product", "launch", "3d", "glass", "countdown", "register", "dark"],
    theme: { bg: "#0B0B0E", fg: "#F3F1EC", fgSoft: "#A9A49A", accent: "#C9A66B", accentInk: "#D4B478", panel: "rgba(255,255,255,0.06)", dark: true, face: "sans" },
    cover: headphones,
    coverAlt: { hy: "Սև ականջակալներ", en: "Black headphones" },
    gallery: [
      { img: headphones, alt: { hy: "Արտադրանք", en: "Product" } },
      { img: stageStar, alt: { hy: "Բեմ", en: "Stage" } },
      { img: audience, alt: { hy: "Դահլիճ", en: "Audience" } },
    ],
    fx: "sparkles",
    event: {
      a: { hy: "Aura One", en: "Aura One" },
      kicker: { hy: "Շնորհանդես", en: "The launch", ru: "Презентация" },
      date: `${D}T19:00:00+04:00`,
      end: `${D}T22:00:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "«Դվին» սրահ", en: "Dvin hall" },
      address: { hy: "Պարոնյան 40", en: "40 Paronyan St" },
      stops: [
        { time: "19:00", name: { hy: "Դռները բացվում են", en: "Doors" }, place: { hy: "«Դվին»", en: "Dvin" } },
        { time: "19:30", name: { hy: "Բացահայտում", en: "The reveal" }, place: { hy: "Բեմ", en: "Stage" } },
        { time: "20:30", name: { hy: "Ընդունելություն", en: "Reception" }, place: { hy: "Տեռաս", en: "Terrace" } },
      ],
    },
    blocks: { productTilt: true, countdown: true, register: true, rsvp: "team", gallery: "grid", lightbox: true },
  },
  // ------------------------------------------------------------ CORPORATE 3
  {
    id: "corporate-3",
    category: "corporate",
    n: 3,
    name: { hy: "Հոբելյանական երեկո", en: "Anniversary Celebration" },
    tagline: { hy: "Մուգ գորշ և ոսկի, օրակարգ՝ ներդիրներով, քարտեզ, թիմային պատասխան։", en: "Slate and gold, an agenda in tabs, a venue map, a team RSVP." },
    tags: ["anniversary", "executive", "slate", "gold", "agenda", "map", "team"],
    theme: { bg: "#1A1D22", fg: "#F1EEE7", fgSoft: "#B8B3A8", accent: "#D4B478", accentInk: "#D4B478", panel: "rgba(255,255,255,0.06)", dark: true, face: "serif" },
    cover: audience,
    coverAlt: { hy: "Դահլիճ և էկրան", en: "An audience and a screen" },
    gallery: [
      { img: audience, alt: { hy: "Դահլիճ", en: "Audience" } },
      { img: candles, alt: { hy: "Մոմեր", en: "Candles" } },
      { img: araratDawn, alt: { hy: "Արարատ", en: "Ararat" } },
      { img: noravank, alt: { hy: "Նորավանք", en: "Noravank" } },
    ],
    fx: "gold",
    event: {
      a: { hy: "Ameria Group", en: "Ameria Group" },
      b: { hy: "25", en: "25" },
      kicker: { hy: "25 տարի", en: "Twenty-five years", ru: "25 лет" },
      date: `${D}T18:30:00+04:00`,
      end: `${D}T23:00:00+04:00`,
      city: { hy: "Երևան", en: "Yerevan" },
      venue: { hy: "«Օպերա» ակումբ", en: "Opera Club" },
      address: { hy: "Թումանյան 54", en: "54 Tumanyan St" },
      stops: [
        { time: "18:30", name: { hy: "Ընդունելություն", en: "Reception" }, place: { hy: "Նախասրահ", en: "Foyer" } },
        { time: "19:15", name: { hy: "Ելույթներ", en: "Speeches" }, place: { hy: "Մեծ սրահ", en: "Main hall" } },
        { time: "20:30", name: { hy: "Ընթրիք", en: "Dinner" }, place: { hy: "Մեծ սրահ", en: "Main hall" } },
      ],
    },
    blocks: { timeline: "tabs", map: true, rsvp: "team", countdown: true, gallery: "grid", lightbox: true },
  },
];

export const categories: Array<{ id: Category | "all"; label: T }> = [
  { id: "all", label: { hy: "Բոլորը", en: "All" } },
  { id: "wedding", label: { hy: "Հարսանիք", en: "Wedding" } },
  { id: "engagement", label: { hy: "Նշանադրություն", en: "Engagement" } },
  { id: "birthday", label: { hy: "Ծնունդ / Հոբելյան", en: "Birthday / Anniversary" } },
  { id: "christening", label: { hy: "Կնունք", en: "Christening" } },
  { id: "corporate", label: { hy: "Կորպորատիվ", en: "Corporate" } },
];

export const findTemplate = (id: string) => templates.find((x) => x.id === id);
export const templateIds = templates.map((x) => x.id);
