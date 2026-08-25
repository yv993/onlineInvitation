import type { Lang, T } from "./content";

// ============================================================================
// WEDDING CARDS — the "send it as a card" way to invite, next to the web
// templates and (later) the video invitations.
//
// The reference for this layer is Greenvelope's wedding designs page
// (greenvelope.com/designs/wedding-invitations), MEASURED, not copied:
//   • the facets — 11 styles (beach, classic, destination, floral, indian →
//     here ARMENIAN, modern, romantic, rustic, simple, vintage, watercolor),
//     18 colours incl. gold / silver / rose gold / copper / champagne foil,
//     photo count (1 / 2 / 3+ / none), shape (portrait / landscape / square),
//     features (backside supported · matching components · colour change
//     supported), designer collections, a search box, colour variants per
//     design in the URL;
//   • the design page — name · artist line · «Start Customizing» ·
//     «Preview Animation» · a description · «Matching components» (save the
//     date, thank-you note) · «Other designs you may like»;
//   • the OPEN SEQUENCE the whole product is named for — the envelope FRONT
//     addressed to the guest with a stamp, a turn to the back, the wax seal,
//     the flap lifting over the liner, the card sliding out and settling, then
//     the details (components/wcards/EnvelopeScene.tsx choreographs it);
//   • «personalized digital envelope, liner, stamp, monogram wax seal, music».
//
// Every design is ORIGINAL — botanical, floral, ornament, foil, watercolor and
// Armenian motifs (pomegranate, eternity sign, Ararat, apricot blossom, vine,
// khachkar lace) drawn as SVG symbols in components/wcards/WMotifs.tsx and
// placed by data; one renderer (WCardFace.tsx) draws the front and the back.
// The couple's details ride in the same lib/draft.ts blob as everything else,
// so the guest link, the short link, the ICS, the order and the RSVP needed
// no new machinery — only the envelope choices were added to the Draft.
// ============================================================================

// ---------------------------------------------------------------- FACETS

export type WStyle = "beach" | "classic" | "destination" | "floral" | "armenian" | "modern" | "romantic" | "rustic" | "simple" | "vintage" | "watercolor";
export type WColor = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "brown" | "creme" | "black" | "white" | "grey" | "gold" | "silver" | "rosegold" | "copper" | "champagne";
export type WShape = "portrait" | "landscape" | "square";
export type WFeature = "backside" | "matching" | "colorChange" | "photo";
export type WCollection = "signature" | "ararat" | "landscapes" | "foil" | "botanical";
export type WPhotos = 0 | 1 | 2 | 3;

export const wStyles: Array<{ id: WStyle; label: T }> = [
  { id: "beach", label: { hy: "Ծովափ", en: "Beach" } },
  { id: "classic", label: { hy: "Դասական", en: "Classic" } },
  { id: "destination", label: { hy: "Ճամփորդական", en: "Destination" } },
  { id: "floral", label: { hy: "Ծաղկային", en: "Floral" } },
  { id: "armenian", label: { hy: "Հայկական", en: "Armenian" } },
  { id: "modern", label: { hy: "Ժամանակակից", en: "Modern" } },
  { id: "romantic", label: { hy: "Ռոմանտիկ", en: "Romantic" } },
  { id: "rustic", label: { hy: "Ռուստիկ", en: "Rustic" } },
  { id: "simple", label: { hy: "Պարզ", en: "Simple" } },
  { id: "vintage", label: { hy: "Վինթաժ", en: "Vintage" } },
  { id: "watercolor", label: { hy: "Ջրաներկ", en: "Watercolor" } },
];

export const wColors: Array<{ id: WColor; label: T; swatch: string }> = [
  { id: "red", label: { hy: "Կարմիր", en: "Red" }, swatch: "#B3202A" },
  { id: "orange", label: { hy: "Նարնջագույն", en: "Orange" }, swatch: "#E07A3F" },
  { id: "yellow", label: { hy: "Դեղին", en: "Yellow" }, swatch: "#E9C46A" },
  { id: "green", label: { hy: "Կանաչ", en: "Green" }, swatch: "#5F7F5A" },
  { id: "blue", label: { hy: "Կապույտ", en: "Blue" }, swatch: "#4A6FA5" },
  { id: "purple", label: { hy: "Մանուշակագույն", en: "Purple" }, swatch: "#6E5A8E" },
  { id: "pink", label: { hy: "Վարդագույն", en: "Pink" }, swatch: "#E3A6B0" },
  { id: "brown", label: { hy: "Շագանակագույն", en: "Brown" }, swatch: "#8B5E3C" },
  { id: "creme", label: { hy: "Կրեմ", en: "Creme" }, swatch: "#F1E7D2" },
  { id: "black", label: { hy: "Սև", en: "Black" }, swatch: "#1C1A17" },
  { id: "white", label: { hy: "Սպիտակ", en: "White" }, swatch: "#FFFFFF" },
  { id: "grey", label: { hy: "Մոխրագույն", en: "Grey" }, swatch: "#8D8A84" },
  { id: "gold", label: { hy: "Ոսկի", en: "Gold" }, swatch: "linear-gradient(135deg,#f1dfa2,#c9a04a 45%,#f6e7b4 60%,#b8893a)" },
  { id: "silver", label: { hy: "Արծաթ", en: "Silver" }, swatch: "linear-gradient(135deg,#f2f2f2,#b9bcc2 45%,#ffffff 60%,#9a9ea6)" },
  { id: "rosegold", label: { hy: "Վարդագույն ոսկի", en: "Rose gold" }, swatch: "linear-gradient(135deg,#f6d3c8,#d3957f 45%,#fbe4dc 60%,#b8735e)" },
  { id: "copper", label: { hy: "Պղինձ", en: "Copper" }, swatch: "linear-gradient(135deg,#f0b48c,#b5622d 45%,#f4c9a8 60%,#8f4a1f)" },
  { id: "champagne", label: { hy: "Շամպայն փայլ", en: "Champagne foil" }, swatch: "linear-gradient(135deg,#f7efdc,#d9c39a 45%,#fbf6ea 60%,#c9b184)" },
];

export const wShapes: Array<{ id: WShape; label: T }> = [
  { id: "portrait", label: { hy: "Ուղղահայաց", en: "Portrait" } },
  { id: "landscape", label: { hy: "Հորիզոնական", en: "Landscape" } },
  { id: "square", label: { hy: "Քառակուսի", en: "Square" } },
];

export const wFeatures: Array<{ id: WFeature; label: T }> = [
  { id: "backside", label: { hy: "Հակառակ երեսով", en: "Backside supported" } },
  { id: "matching", label: { hy: "Համապատասխան հավաքածու", en: "Matching components" } },
  { id: "colorChange", label: { hy: "Գույնը փոխվում է", en: "Colour change supported" } },
  { id: "photo", label: { hy: "Նկարով", en: "Photo" } },
];

export const wCollections: Array<{ id: WCollection; label: T; blurb: T }> = [
  { id: "signature", label: { hy: "ԿՆԻՔ ստորագրություն", en: "KNIQ Signature" }, blurb: { hy: "Ստուդիայի սեփական գծագրերը", en: "The studio's own drawings" } },
  { id: "ararat", label: { hy: "Արարատ հավաքածու", en: "Ararat Collection" }, blurb: { hy: "Նուռ, հավերժության նշան, ծիրանի ծաղիկ, խաղող", en: "Pomegranate, eternity sign, apricot blossom, vine" } },
  { id: "landscapes", label: { hy: "Հայաստանի բնապատկերներ", en: "Armenian Landscapes" }, blurb: { hy: "Արարատ, Սևան, Տաթև, Նորավանք", en: "Ararat, Sevan, Tatev, Noravank" } },
  { id: "foil", label: { hy: "Ֆոլգա և փայլ", en: "Foil & Shimmer" }, blurb: { hy: "Ոսկի, արծաթ, վարդագույն ոսկի", en: "Gold, silver, rose gold" } },
  { id: "botanical", label: { hy: "Բուսաբանական", en: "Botanical" }, blurb: { hy: "Տերևներ, ճյուղեր, ջրաներկ դաշտեր", en: "Leaves, branches, watercolor meadows" } },
];

// ---------------------------------------------------------------- ENVELOPE OPTIONS

export type EnvCover = { id: string; label: T; paper: string; ink: string; dark?: boolean };
export type EnvLiner = { id: string; label: T; css: string; foil?: boolean };
export type EnvStamp = { id: string; label: T };
export type EnvSeal = { id: string; label: T; wax: string };
export type EnvBackdrop = { id: string; label: T; css: string; dark?: boolean };

export const envCovers: EnvCover[] = [
  { id: "ivory", label: { hy: "Փղոսկր", en: "Ivory" }, paper: "#F3EFE7", ink: "#1C1A17" },
  { id: "white", label: { hy: "Սպիտակ", en: "White" }, paper: "#FDFCFA", ink: "#1C1A17" },
  { id: "kraft", label: { hy: "Կրաֆտ", en: "Kraft" }, paper: "#C9A97C", ink: "#3A2A14" },
  { id: "blush", label: { hy: "Վարդագույն", en: "Blush" }, paper: "#EED3CB", ink: "#4A2A2A" },
  { id: "sage", label: { hy: "Եղեսպակ", en: "Sage" }, paper: "#CFD9C6", ink: "#25321F" },
  { id: "dusty", label: { hy: "Փոշոտ կապույտ", en: "Dusty blue" }, paper: "#B9C7D6", ink: "#1E2A3A" },
  { id: "navy", label: { hy: "Մուգ կապույտ", en: "Navy" }, paper: "#1E2A45", ink: "#F3EFE7", dark: true },
  { id: "burgundy", label: { hy: "Բորդո", en: "Burgundy" }, paper: "#5A1E2A", ink: "#F6E7E4", dark: true },
  { id: "black", label: { hy: "Սև", en: "Black" }, paper: "#17161A", ink: "#F3EFE7", dark: true },
  { id: "forest", label: { hy: "Անտառ", en: "Forest" }, paper: "#25392E", ink: "#EEF3E8", dark: true },
];

const gold = "linear-gradient(135deg,#f1dfa2,#c9a04a 40%,#f6e7b4 55%,#b8893a)";
const silver = "linear-gradient(135deg,#f4f4f4,#b9bcc2 40%,#ffffff 55%,#9a9ea6)";
const rose = "linear-gradient(135deg,#f6d3c8,#d3957f 40%,#fbe4dc 55%,#b8735e)";
export const envLiners: EnvLiner[] = [
  { id: "plain", label: { hy: "Հասարակ", en: "Plain" }, css: "#EAE3D6" },
  { id: "gold", label: { hy: "Ոսկե փայլ", en: "Gold foil" }, css: gold, foil: true },
  { id: "silver", label: { hy: "Արծաթ", en: "Silver foil" }, css: silver, foil: true },
  { id: "rosegold", label: { hy: "Վարդագույն ոսկի", en: "Rose gold" }, css: rose, foil: true },
  { id: "marble", label: { hy: "Մարմար", en: "Marble" }, css: "radial-gradient(ellipse at 20% 30%,#fff 0 12%,transparent 13%),radial-gradient(ellipse at 70% 60%,#e6e2dc 0 18%,transparent 19%),linear-gradient(120deg,#f4f1ec,#d9d4cc 45%,#f7f4ef 70%,#cfc9c0)" },
  { id: "dots", label: { hy: "Կետեր", en: "Dots" }, css: "radial-gradient(circle at 6px 6px,#b08d57 2px,transparent 2.6px) 0 0/16px 16px,#f3efe7" },
  { id: "stripes", label: { hy: "Գծեր", en: "Stripes" }, css: "repeating-linear-gradient(135deg,#f3efe7 0 10px,#d9cfc0 10px 20px)" },
  { id: "botanic", label: { hy: "Բուսական տպագիր", en: "Botanical print" }, css: "radial-gradient(ellipse 10px 22px at 20px 20px,#5f7f5a 0 60%,transparent 62%) 0 0/48px 44px,radial-gradient(ellipse 10px 22px at 44px 42px,#8ca87f 0 60%,transparent 62%) 0 0/48px 44px,#eef1e6" },
  { id: "damask", label: { hy: "Դամասկ", en: "Damask" }, css: "radial-gradient(circle at 12px 12px,#c9b184 0 3px,transparent 4px) 0 0/24px 24px,radial-gradient(circle at 0 0,#c9b184 0 3px,transparent 4px) 0 0/24px 24px,#f5ecd8" },
  { id: "pomegranate", label: { hy: "Նռան տպագիր", en: "Pomegranate print" }, css: "radial-gradient(circle at 14px 16px,#9c2f3a 0 7px,transparent 8px) 0 0/40px 40px,radial-gradient(circle at 34px 36px,#c9a04a 0 3px,transparent 4px) 0 0/40px 40px,#f6ede4" },
  { id: "wash", label: { hy: "Ջրաներկ", en: "Watercolor wash" }, css: "radial-gradient(ellipse at 30% 40%,#e9cfc8 0 30%,transparent 60%),radial-gradient(ellipse at 70% 70%,#b9c7d6 0 25%,transparent 55%),#f7f3ee" },
  { id: "glitter", label: { hy: "Փայլփլուն", en: "Glitter" }, css: "radial-gradient(circle at 20% 30%,#fff8 0 1px,transparent 2px) 0 0/9px 9px,radial-gradient(circle at 70% 60%,#fff6 0 1px,transparent 2px) 0 0/13px 13px,#d3957f" },
  { id: "night", label: { hy: "Գիշեր", en: "Night sky" }, css: "radial-gradient(circle at 20% 30%,#fff9 0 1px,transparent 2px) 0 0/22px 22px,radial-gradient(circle at 70% 70%,#fff6 0 1px,transparent 1.5px) 0 0/17px 17px,linear-gradient(160deg,#141a33,#2a3f6a)" },
];

export const envStamps: EnvStamp[] = [
  { id: "monogram", label: { hy: "Մոնոգրամ", en: "Monogram" } },
  { id: "pomegranate", label: { hy: "Նուռ", en: "Pomegranate" } },
  { id: "ararat", label: { hy: "Արարատ", en: "Ararat" } },
  { id: "wreath", label: { hy: "Ծաղկեպսակ", en: "Wreath" } },
  { id: "hearts", label: { hy: "Սրտեր", en: "Hearts" } },
  { id: "dove", label: { hy: "Աղավնի", en: "Dove" } },
];

export const envSeals: EnvSeal[] = [
  { id: "monogram", label: { hy: "Մոնոգրամ", en: "Monogram" }, wax: "#8F4B45" },
  { id: "gold", label: { hy: "Ոսկե մոնոգրամ", en: "Gold monogram" }, wax: "#B08D57" },
  { id: "pomegranate", label: { hy: "Նուռ", en: "Pomegranate" }, wax: "#9C2F3A" },
  { id: "eternity", label: { hy: "Հավերժության նշան", en: "Eternity sign" }, wax: "#7E6034" },
  { id: "heart", label: { hy: "Սիրտ", en: "Heart" }, wax: "#C96A7A" },
  { id: "leaf", label: { hy: "Տերև", en: "Leaf" }, wax: "#5F7F5A" },
  { id: "none", label: { hy: "Առանց կնիքի", en: "No seal" }, wax: "transparent" },
];

export const envBackdrops: EnvBackdrop[] = [
  { id: "linen", label: { hy: "Բաց կտավ", en: "Light linen" }, css: "repeating-linear-gradient(0deg,#0000 0 3px,#0000000a 3px 4px),repeating-linear-gradient(90deg,#0000 0 3px,#0000000a 3px 4px),#ECE6DA" },
  { id: "marble", label: { hy: "Մարմար", en: "Marble" }, css: "radial-gradient(ellipse at 20% 30%,#fff 0 12%,transparent 13%),radial-gradient(ellipse at 70% 60%,#e6e2dc 0 18%,transparent 19%),linear-gradient(120deg,#f4f1ec,#dcd7cf 45%,#f7f4ef 70%,#d3cdc4)" },
  { id: "blush", label: { hy: "Վարդագույն", en: "Blush" }, css: "radial-gradient(ellipse at 30% 40%,#f2d9d2 0 30%,transparent 60%),#F5E9E4" },
  { id: "sage", label: { hy: "Եղեսպակ", en: "Sage" }, css: "radial-gradient(ellipse at 70% 30%,#dde6d5 0 30%,transparent 60%),#E3EADB" },
  { id: "wood", label: { hy: "Փայտ", en: "Wood" }, css: "repeating-linear-gradient(90deg,#c9a97c 0 22px,#bd9b6c 22px 24px,#c4a274 24px 46px),#c4a274" },
  { id: "dark", label: { hy: "Մուգ կտավ", en: "Dark linen" }, css: "repeating-linear-gradient(0deg,#0000 0 3px,#ffffff08 3px 4px),repeating-linear-gradient(90deg,#0000 0 3px,#ffffff08 3px 4px),#1B1916", dark: true },
  { id: "night", label: { hy: "Գիշերային երկինք", en: "Night sky" }, css: "radial-gradient(circle at 20% 30%,#fff9 0 1px,transparent 2px) 0 0/22px 22px,radial-gradient(circle at 70% 70%,#fff6 0 1px,transparent 1.5px) 0 0/17px 17px,linear-gradient(160deg,#141a33,#22315a)", dark: true },
];

export const findCover = (id?: string) => envCovers.find((x) => x.id === id) ?? envCovers[0];
export const findLiner = (id?: string) => envLiners.find((x) => x.id === id) ?? envLiners[1];
export const findStamp = (id?: string) => envStamps.find((x) => x.id === id) ?? envStamps[0];
export const findSeal = (id?: string) => envSeals.find((x) => x.id === id) ?? envSeals[0];
export const findBackdrop = (id?: string) => envBackdrops.find((x) => x.id === id) ?? envBackdrops[0];

// ---------------------------------------------------------------- MODEL

export type WMotifId =
  | "leafSprig" | "leafBranch" | "eucalyptus" | "olive" | "fern" | "palmFrond" | "monstera" | "wheat"
  | "rose" | "peony" | "daisy" | "wildflower" | "cherryBlossom" | "apricotBlossom" | "tulip" | "lavender" | "hydrangea" | "carnation" | "cactus" | "birdOfParadise"
  | "wreath" | "laurel" | "garland" | "bouquet" | "vineBorder" | "grapes"
  | "pomegranate" | "pomegranateHalf" | "eternity" | "khachkarLace" | "duduk" | "ararat" | "sevan" | "tatev" | "noravank"
  | "ampersand" | "heart" | "rings" | "dove" | "birds" | "moon" | "stars" | "sun" | "waves" | "shell" | "starfish" | "compass" | "mountains" | "birch" | "pine"
  | "frameOrnate" | "frameCorner" | "flourish" | "divider" | "arch" | "monogramRing" | "confettiDot" | "watercolorBlob" | "inkStroke" | "koi" | "butterfly" | "bee";

export type WSlot = "ink" | "a" | "b" | "c" | "paper" | "foil";

export type WPlaced = { m: WMotifId; x: number; y: number; s: number; r?: number; c?: WSlot; c2?: WSlot; o?: number; flip?: boolean };

export type WFace = "serif" | "script" | "sans" | "smallcaps" | "modern";
export type WLayout = "center" | "bottom" | "top" | "left" | "right";
export type WBg = "none" | "wash" | "linen" | "speckle" | "marble" | "deckle" | "gradient" | "halfSplit" | "photoFull";
export type WFrame = "none" | "thin" | "double" | "corners" | "ornate" | "arch" | "botanicalCorners" | "goldEdge" | "deckleEdge";

export type WVariant = {
  id: WColor;
  label: T;
  paper: string;
  ink: string;
  a: string; // primary accent
  b: string; // secondary
  c: string; // tertiary / soft
  foil: string; // a CSS gradient for foil type / edges (or a flat)
  cover: string; // suggested envelope cover id
  liner: string; // suggested liner id
  backdrop: string; // suggested backdrop id
  dark?: boolean;
};

export type WPhotoSlot = { x: number; y: number; w: number; h: number; shape: "rect" | "circle" | "oval" | "arch" | "full" };

export type WCard = {
  id: string;
  name: T;
  by: T;
  desc: T;
  styles: WStyle[];
  collection: WCollection;
  shape: WShape;
  photos: WPhotos;
  features: WFeature[];
  matching: Array<"saveTheDate" | "thankYou" | "details" | "rsvp">;
  bg: WBg;
  frame: WFrame;
  face: WFace;
  layout: WLayout;
  /** foil-painted names */
  foilNames?: boolean;
  motifs: WPlaced[];
  /** the back side, when supported: its own motifs (light) */
  back?: WPlaced[];
  photo?: WPhotoSlot[];
  variants: WVariant[];
  tags: string[];
  popular?: boolean;
  isNew?: boolean;
};

// ---------------------------------------------------------------- WORDS

/** «Շաբաթ, 10 հոկտեմբերի, 2026» / «Saturday, the 10th of October, 2026» */
const HY_MONTHS_GEN = ["հունվարի", "փետրվարի", "մարտի", "ապրիլի", "մայիսի", "հունիսի", "հուլիսի", "օգոստոսի", "սեպտեմբերի", "հոկտեմբերի", "նոյեմբերի", "դեկտեմբերի"];
const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const HY_DAYS = ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"];
const EN_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const enOrd = (n: number) => { const v = n % 100; if (v >= 11 && v <= 13) return `${n}th`; return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`; };

export function wDateLine(lang: Lang, date: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return "";
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  const dow = d.getUTCDay(), day = Number(m[3]), mo = Number(m[2]) - 1, y = m[1];
  return lang === "hy" ? `${HY_DAYS[dow]}, ${day} ${HY_MONTHS_GEN[mo]}, ${y}` : `${EN_DAYS[dow]}, the ${enOrd(day)} of ${EN_MONTHS[mo]}, ${y}`;
}
export function wTimeLine(lang: Lang, time: string): string {
  if (!/^\d{2}:\d{2}$/.test(time)) return "";
  if (lang === "hy") return `ժամը ${time}`;
  const [h, mm] = time.split(":").map(Number);
  const h12 = ((h + 11) % 12) + 1;
  const part = h < 12 ? "in the morning" : h < 17 ? "in the afternoon" : "in the evening";
  return `at ${h12}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${part}`;
}

export type WWords = {
  families: string; // «together with their families» / parents line
  a: string; b: string; amp: string;
  invite: string; // request the pleasure…
  date: string; time: string;
  venue: string; where: string; // address, city
  after: string; // reception to follow
  rsvp: string; // kindly reply by…
  note?: string;
};

export function wWords(
  lang: Lang,
  d: { a?: string; b?: string; date?: string; time?: string; venue?: string; address?: string; city?: string; rsvpBy?: string; host?: string; note?: string } = {},
): WWords {
  const hy = lang === "hy";
  const a = d.a || (hy ? "Նարե" : "Nare");
  const b = d.b || (hy ? "Հայկ" : "Hayk");
  const date = d.date || "2026-10-10";
  const time = d.time || "15:00";
  const rsvpBy = d.rsvpBy || "2026-09-19";
  const rsvpM = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rsvpBy);
  const rsvpWords = rsvpM ? (hy ? `${Number(rsvpM[3])} ${HY_MONTHS_GEN[Number(rsvpM[2]) - 1]}` : `${EN_MONTHS[Number(rsvpM[2]) - 1]} ${Number(rsvpM[3])}`) : rsvpBy;
  return {
    families: d.host ? d.host : hy ? "Ընտանիքների հետ միասին" : "Together with their families",
    a, b, amp: hy ? "և" : "&",
    invite: hy ? "սիրով հրավիրում ենք Ձեզ մեր հարսանիքին" : "request the pleasure of your company at their wedding",
    date: wDateLine(lang, date),
    time: wTimeLine(lang, time),
    venue: d.venue || (hy ? "Սուրբ Աստվածածին եկեղեցի" : "Surb Astvatsatsin Church"),
    where: [d.address, d.city || (hy ? "Երևան" : "Yerevan")].filter(Boolean).join(", "),
    after: hy ? "Խնջույքը՝ արարողությունից հետո" : "Reception to follow",
    rsvp: hy ? `Խնդրում ենք պատասխանել մինչև ${rsvpWords}` : `Kindly reply by ${rsvpWords}`,
    note: d.note,
  };
}

// ---------------------------------------------------------------- DESIGNS

const V = (id: WColor, label: T, paper: string, ink: string, a: string, b: string, c: string, foil: string, cover: string, liner: string, backdrop: string, dark = false): WVariant =>
  ({ id, label, paper, ink, a, b, c, foil, cover, liner, backdrop, dark });
const GOLD = gold, SILVER = silver, ROSE = rose;
const CHAMP = "linear-gradient(135deg,#f7efdc,#d9c39a 40%,#fbf6ea 55%,#c9b184)";
const COPPER = "linear-gradient(135deg,#f0b48c,#b5622d 40%,#f4c9a8 55%,#8f4a1f)";
const L = {
  green: { hy: "Կանաչ", en: "Green" }, blue: { hy: "Կապույտ", en: "Blue" }, pink: { hy: "Վարդագույն", en: "Pink" }, creme: { hy: "Կրեմ", en: "Creme" },
  gold: { hy: "Ոսկի", en: "Gold" }, black: { hy: "Սև", en: "Black" }, white: { hy: "Սպիտակ", en: "White" }, grey: { hy: "Մոխրագույն", en: "Grey" },
  red: { hy: "Կարմիր", en: "Red" }, purple: { hy: "Մանուշակագույն", en: "Purple" }, brown: { hy: "Շագանակագույն", en: "Brown" }, orange: { hy: "Նարնջագույն", en: "Orange" },
  yellow: { hy: "Դեղին", en: "Yellow" }, silver: { hy: "Արծաթ", en: "Silver" }, rosegold: { hy: "Վարդագույն ոսկի", en: "Rose gold" }, copper: { hy: "Պղինձ", en: "Copper" }, champagne: { hy: "Շամպայն", en: "Champagne" },
} satisfies Record<WColor, T>;

const S = { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" };
const cornersLeaves = (m: WMotifId, s = 90, c: WSlot = "a"): WPlaced[] => [
  { m, x: 34, y: 36, s, r: 200, c }, { m, x: 266, y: 36, s, r: 290, c, flip: true }, { m, x: 34, y: 384, s, r: 110, c }, { m, x: 266, y: 384, s, r: 20, c, flip: true },
];

export const wCards: WCard[] = [
  // ------------------------------------------------------- GILDED BOTANICAL
  {
    id: "gilded-botanical", name: { hy: "Ոսկեզօծ բուսականություն", en: "Gilded Botanical" }, by: S,
    desc: { hy: "Ջրաներկ տերևներ եզրերին, ոսկե ուրվագիծ, դասական սերիֆ։", en: "Watercolour leaves around the edges, a gold hairline, classic serif." },
    styles: ["floral", "classic", "watercolor"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "wash", frame: "thin", face: "serif", layout: "center", popular: true,
    tags: ["botanical", "leaves", "տերև", "gold", "ոսկի", "watercolor"],
    motifs: [...cornersLeaves("leafBranch", 110), { m: "eucalyptus", x: 150, y: 24, s: 70, r: 0, c: "b" }, { m: "eucalyptus", x: 150, y: 398, s: 70, r: 180, c: "b" }],
    back: [{ m: "leafSprig", x: 150, y: 60, s: 60, c: "b", o: 0.7 }],
    variants: [
      V("blue", L.blue, "#F6F3EC", "#1E2A3A", "#4A6FA5", "#8CA0BF", "#B9C7D6", GOLD, "dusty", "gold", "linen"),
      V("green", L.green, "#F6F4EC", "#22301F", "#5F7F5A", "#8CA87F", "#C9D6C0", GOLD, "sage", "gold", "linen"),
      V("pink", L.pink, "#FBF4F1", "#3A2A2A", "#C98B8F", "#E3B4B8", "#F0D6D3", ROSE, "blush", "rosegold", "blush"),
    ],
  },
  // ------------------------------------------------------- MEADOW WATERCOLOR
  {
    id: "meadow-watercolor", name: { hy: "Ջրաներկ դաշտ", en: "Watercolour Meadow" }, by: S,
    desc: { hy: "Վայրի ծաղիկների ջրաներկ դաշտ ներքևում, օդային տառեր վերևում։", en: "A watercolour meadow of wildflowers along the foot, airy type above." },
    styles: ["floral", "watercolor", "romantic", "rustic"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "script", layout: "top", popular: true,
    tags: ["meadow", "դաշտ", "wildflower", "ծաղիկ", "watercolor", "ջրաներկ"],
    motifs: [
      { m: "watercolorBlob", x: 150, y: 400, s: 340, c: "c", o: 0.55 }, { m: "wildflower", x: 40, y: 372, s: 90, c: "a", c2: "b" }, { m: "wildflower", x: 110, y: 380, s: 76, c: "b", c2: "a", flip: true }, { m: "lavender", x: 170, y: 376, s: 84, c: "b" },
      { m: "daisy", x: 230, y: 382, s: 70, c: "paper", c2: "a" }, { m: "wildflower", x: 272, y: 372, s: 86, c: "a", c2: "b" }, { m: "bee", x: 96, y: 328, s: 18, c: "a", c2: "ink" }, { m: "butterfly", x: 240, y: 322, s: 26, c: "b" },
    ],
    back: [{ m: "wildflower", x: 40, y: 390, s: 60, c: "a", c2: "b", o: 0.8 }, { m: "daisy", x: 262, y: 392, s: 50, c: "paper", c2: "a", o: 0.8 }],
    variants: [
      V("pink", L.pink, "#FCF8F4", "#3A2A2A", "#D98B94", "#7C9A6E", "#F2D6CF", ROSE, "ivory", "wash", "blush"),
      V("purple", L.purple, "#F9F6F9", "#2E2340", "#8E6BA8", "#6F8F6A", "#DDD1E6", SILVER, "white", "plain", "linen"),
      V("yellow", L.yellow, "#FDFAF1", "#3B2E12", "#E1B740", "#7C9A6E", "#F6E7B4", GOLD, "ivory", "dots", "linen"),
    ],
  },
  // ------------------------------------------------------- LINEWORK FLORALS
  {
    id: "linework-florals", name: { hy: "Գծանկար ծաղիկներ", en: "Linework Florals" }, by: S,
    desc: { hy: "Մեկ գծով նկարված վարդեր ու տերևներ, շատ սպիտակ տարածք։", en: "Roses and leaves drawn in a single line, plenty of white space." },
    styles: ["modern", "simple", "floral"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou", "rsvp"],
    bg: "none", frame: "none", face: "sans", layout: "center",
    tags: ["linework", "գծանկար", "minimal", "rose", "modern"],
    motifs: [{ m: "rose", x: 60, y: 70, s: 120, r: -10, c: "ink", c2: "paper", o: 0.9 }, { m: "leafBranch", x: 250, y: 360, s: 130, r: 210, c: "ink", o: 0.9 }, { m: "leafSprig", x: 250, y: 60, s: 60, r: 40, c: "ink", o: 0.7 }],
    back: [{ m: "rose", x: 150, y: 90, s: 90, c: "ink", c2: "paper", o: 0.5 }],
    variants: [
      V("white", L.white, "#FFFFFF", "#1C1A17", "#1C1A17", "#8D8A84", "#EDEBE6", CHAMP, "white", "plain", "linen"),
      V("creme", L.creme, "#F5EFE2", "#2E2419", "#2E2419", "#8B7355", "#E6DCC7", GOLD, "kraft", "gold", "wood"),
      V("black", L.black, "#17161A", "#F3EFE7", "#F3EFE7", "#B8B3A8", "#2A2830", GOLD, "black", "gold", "dark", true),
    ],
  },
  // ------------------------------------------------------- VINTAGE ENGRAVED
  {
    id: "vintage-engraved", name: { hy: "Վինթաժ փորագիր", en: "Vintage Engraved" }, by: S,
    desc: { hy: "Փորագրված ծաղկեփնջեր, կրկնակի շրջանակ, հին գրքի ոգի։", en: "Engraved bouquets in a double rule, the spirit of an old book." },
    styles: ["vintage", "classic", "floral"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "speckle", frame: "double", face: "serif", layout: "center",
    tags: ["vintage", "վինթաժ", "engraved", "փորագիր", "etched", "classic"],
    motifs: [{ m: "bouquet", x: 150, y: 70, s: 120, c: "ink", c2: "a", o: 0.85 }, { m: "divider", x: 150, y: 350, s: 120, c: "a" }, { m: "flourish", x: 150, y: 386, s: 90, c: "ink", o: 0.7 }],
    back: [{ m: "frameCorner", x: 30, y: 30, s: 50, c: "a" }, { m: "frameCorner", x: 270, y: 390, s: 50, r: 180, c: "a" }],
    variants: [
      V("blue", L.blue, "#F3EFE4", "#2A3446", "#4A6FA5", "#8CA0BF", "#DDE3E9", SILVER, "dusty", "damask", "linen"),
      V("brown", L.brown, "#F1E8D8", "#3B2A14", "#8B5E3C", "#B8926E", "#E4D5C0", GOLD, "kraft", "damask", "wood"),
      V("green", L.green, "#F2F0E6", "#22301F", "#5F7F5A", "#8CA87F", "#DCE3D3", GOLD, "sage", "botanic", "linen"),
    ],
  },
  // ------------------------------------------------------- SIMPLY DECKLED
  {
    id: "simply-deckled", name: { hy: "Պատռված եզր", en: "Simply Deckled" }, by: S,
    desc: { hy: "Ձեռքով պատռված թղթի եզր, ոչինչ ավելին։ Անունները՝ մեծ։", en: "A hand-torn paper edge and nothing else. The names, large." },
    styles: ["simple", "modern", "classic"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou", "rsvp"],
    bg: "deckle", frame: "deckleEdge", face: "serif", layout: "center", popular: true,
    tags: ["deckle", "պատռված", "simple", "պարզ", "minimal", "torn"],
    motifs: [{ m: "divider", x: 150, y: 250, s: 80, c: "a", o: 0.8 }],
    back: [],
    variants: [
      V("pink", L.pink, "#F8ECE8", "#3A2A2A", "#C98B8F", "#E3B4B8", "#F0D6D3", ROSE, "blush", "plain", "blush"),
      V("creme", L.creme, "#F5EFE2", "#2E2419", "#8B7355", "#B8A27E", "#E6DCC7", GOLD, "ivory", "gold", "linen"),
      V("white", L.white, "#FDFCFA", "#1C1A17", "#8D8A84", "#B8B3A8", "#EDEBE6", SILVER, "white", "plain", "marble"),
    ],
  },
  // ------------------------------------------------------- AMPERSAND
  {
    id: "ampersand", name: { hy: "Ամպերսանդ", en: "Ampersand" }, by: S,
    desc: { hy: "Հսկա «&»՝ ֆոլգայով, երկու անուն երկու կողմում։", en: "A giant foil «&», the two names either side of it." },
    styles: ["modern", "simple"], collection: "foil", shape: "square", photos: 0, features: ["backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "modern", layout: "center", foilNames: false,
    tags: ["ampersand", "modern", "foil", "ֆոլգա", "typographic"],
    motifs: [{ m: "ampersand", x: 160, y: 156, s: 200, c: "foil", o: 0.95 }],
    back: [{ m: "ampersand", x: 160, y: 160, s: 120, c: "a", o: 0.25 }],
    variants: [
      V("pink", L.pink, "#FBEFEC", "#3A2A2A", "#C98B8F", "#E3B4B8", "#F0D6D3", ROSE, "blush", "rosegold", "blush"),
      V("gold", L.gold, "#F7F1E4", "#2E2419", "#B08D57", "#D4B478", "#F0E4C8", GOLD, "ivory", "gold", "linen"),
      V("black", L.black, "#17161A", "#F3EFE7", "#B08D57", "#D4B478", "#2A2830", GOLD, "black", "gold", "dark", true),
    ],
  },
  // ------------------------------------------------------- ORNATE FRAME
  {
    id: "ornate-frame", name: { hy: "Զարդանախշ շրջանակ", en: "Ornate Frame" }, by: S,
    desc: { hy: "Բարոկկո շրջանակ՝ ոսկե գծով, հանդիսավոր և զուսպ։", en: "A baroque frame in a gold line, ceremonial and restrained." },
    styles: ["classic", "vintage", "romantic"], collection: "foil", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "linen", frame: "ornate", face: "smallcaps", layout: "center", popular: true,
    tags: ["frame", "շրջանակ", "ornate", "baroque", "gold", "classic"],
    motifs: [{ m: "flourish", x: 150, y: 96, s: 100, c: "foil" }, { m: "flourish", x: 150, y: 328, s: 100, r: 180, c: "foil" }],
    back: [{ m: "frameCorner", x: 30, y: 30, s: 50, c: "foil" }, { m: "frameCorner", x: 270, y: 30, s: 50, r: 90, c: "foil" }, { m: "frameCorner", x: 270, y: 390, s: 50, r: 180, c: "foil" }, { m: "frameCorner", x: 30, y: 390, s: 50, r: 270, c: "foil" }],
    variants: [
      V("green", L.green, "#EEF1E8", "#22301F", "#5F7F5A", "#8CA87F", "#DCE3D3", GOLD, "forest", "gold", "linen"),
      V("creme", L.creme, "#F5EFE2", "#2E2419", "#8B7355", "#B8A27E", "#E6DCC7", GOLD, "ivory", "gold", "marble"),
      V("black", L.black, "#17161A", "#F3EFE7", "#B08D57", "#D4B478", "#2A2830", GOLD, "black", "gold", "dark", true),
      V("blue", L.blue, "#EEF1F6", "#1E2A3A", "#4A6FA5", "#8CA0BF", "#DDE3E9", SILVER, "navy", "silver", "linen"),
    ],
  },
  // ------------------------------------------------------- LETTERPRESS LEAVES
  {
    id: "letterpress-leaves", name: { hy: "Լետերպրես տերևներ", en: "Letterpress Leaves" }, by: S,
    desc: { hy: "Թղթի մեջ սեղմված նուրբ տերևներ, ձեռքի պես թեթև։", en: "Delicate leaves pressed into the paper, light as a hand." },
    styles: ["simple", "rustic", "classic"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou", "rsvp"],
    bg: "linen", frame: "none", face: "serif", layout: "center",
    tags: ["letterpress", "leaves", "տերև", "pressed", "simple"],
    motifs: [{ m: "leafSprig", x: 150, y: 60, s: 90, c: "a", o: 0.9 }, { m: "leafSprig", x: 150, y: 370, s: 90, r: 180, c: "a", o: 0.9 }, { m: "leafSprig", x: 44, y: 210, s: 60, r: 90, c: "b", o: 0.7 }, { m: "leafSprig", x: 256, y: 210, s: 60, r: 270, c: "b", o: 0.7 }],
    back: [{ m: "leafSprig", x: 150, y: 210, s: 120, c: "a", o: 0.25 }],
    variants: [
      V("creme", L.creme, "#F5EFE2", "#2E2419", "#8B7355", "#B8A27E", "#E6DCC7", GOLD, "ivory", "plain", "linen"),
      V("green", L.green, "#F2F0E6", "#22301F", "#5F7F5A", "#8CA87F", "#DCE3D3", GOLD, "sage", "botanic", "linen"),
      V("grey", L.grey, "#F2F1EE", "#2A2926", "#8D8A84", "#B8B3A8", "#E1DFDA", SILVER, "white", "plain", "marble"),
    ],
  },
  // ------------------------------------------------------- MISTY MOORS
  {
    id: "misty-moors", name: { hy: "Մշուշոտ լեռներ", en: "Misty Moors" }, by: S,
    desc: { hy: "Շերտավոր լեռների բնապատկեր մշուշի մեջ, ներքևում՝ անունները։", en: "Layered hills in mist, the names set below the horizon." },
    styles: ["destination", "rustic", "romantic"], collection: "landscapes", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou"],
    bg: "gradient", frame: "none", face: "serif", layout: "bottom",
    tags: ["mountains", "լեռ", "landscape", "բնապատկեր", "mist", "destination"],
    motifs: [{ m: "mountains", x: 150, y: 150, s: 320, c: "b", c2: "c", o: 0.9 }, { m: "pine", x: 40, y: 200, s: 50, c: "ink", o: 0.6 }, { m: "pine", x: 64, y: 210, s: 40, c: "ink", o: 0.5 }, { m: "birds", x: 220, y: 60, s: 40, c: "ink", o: 0.6 }],
    back: [{ m: "mountains", x: 150, y: 120, s: 220, c: "b", c2: "c", o: 0.35 }],
    variants: [
      V("green", L.green, "#EEF1EA", "#22301F", "#5F7F5A", "#8CA87F", "#C9D6C0", CHAMP, "sage", "plain", "sage"),
      V("blue", L.blue, "#EEF1F6", "#1E2A3A", "#4A6FA5", "#8CA0BF", "#C9D3E0", SILVER, "dusty", "plain", "linen"),
      V("grey", L.grey, "#F0EFEC", "#2A2926", "#6E6B66", "#A3A09A", "#D6D3CE", SILVER, "white", "plain", "marble"),
    ],
  },
  // ------------------------------------------------------- LUSH ROSES
  {
    id: "lush-roses", name: { hy: "Փարթամ վարդեր", en: "Lush Roses" }, by: S,
    desc: { hy: "Խիտ վարդեր վերևի անկյուններից, խորը գույն, սերիֆ։", en: "Dense roses from the top corners, deep colour, serif." },
    styles: ["floral", "romantic", "classic"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "none", frame: "none", face: "serif", layout: "center", popular: true,
    tags: ["roses", "վարդ", "romantic", "floral", "lush"],
    motifs: [
      { m: "rose", x: 40, y: 40, s: 110, r: -20, c: "a", c2: "b" }, { m: "rose", x: 90, y: 30, s: 80, r: 10, c: "b", c2: "a" }, { m: "leafBranch", x: 60, y: 90, s: 90, r: 160, c: "c" },
      { m: "rose", x: 262, y: 386, s: 110, r: 160, c: "a", c2: "b" }, { m: "rose", x: 214, y: 396, s: 80, r: 190, c: "b", c2: "a" }, { m: "leafBranch", x: 246, y: 336, s: 90, r: -20, c: "c" },
    ],
    back: [{ m: "rose", x: 262, y: 386, s: 80, r: 160, c: "a", c2: "b", o: 0.5 }],
    variants: [
      V("red", L.red, "#F8F1EE", "#3A1F1F", "#B3202A", "#D9484F", "#5F7F5A", GOLD, "burgundy", "gold", "linen"),
      V("pink", L.pink, "#FBF4F1", "#3A2A2A", "#D98B94", "#E9B7BD", "#7C9A6E", ROSE, "blush", "rosegold", "blush"),
      V("purple", L.purple, "#F7F3F8", "#2E2340", "#6E5A8E", "#A08CBF", "#7C9A6E", SILVER, "navy", "silver", "linen"),
    ],
  },
  // ------------------------------------------------------- CUT PAPER GARDEN
  {
    id: "cut-paper-garden", name: { hy: "Կտրված թղթի այգի", en: "Cut Paper Garden" }, by: S,
    desc: { hy: "Հարթ, կտրված թղթի ծաղիկներ ու տերևներ՝ եզրի շուրջ։", en: "Flat, cut-paper flowers and leaves around the edge." },
    styles: ["floral", "modern"], collection: "signature", shape: "square", photos: 0, features: ["backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "botanicalCorners", face: "sans", layout: "center",
    tags: ["cut paper", "garden", "այգի", "flat", "modern floral"],
    motifs: [{ m: "tulip", x: 40, y: 40, s: 70, r: -20, c: "a", c2: "b" }, { m: "daisy", x: 280, y: 44, s: 60, c: "b", c2: "a" }, { m: "tulip", x: 282, y: 280, s: 70, r: 160, c: "a", c2: "b" }, { m: "daisy", x: 40, y: 278, s: 60, c: "b", c2: "a" }, { m: "leafSprig", x: 160, y: 30, s: 50, c: "c" }, { m: "leafSprig", x: 160, y: 290, s: 50, r: 180, c: "c" }],
    back: [{ m: "daisy", x: 160, y: 160, s: 90, c: "b", c2: "a", o: 0.3 }],
    variants: [
      V("pink", L.pink, "#FBF2EE", "#3A2A2A", "#E3A6B0", "#F0C9CF", "#7C9A6E", ROSE, "blush", "wash", "blush"),
      V("orange", L.orange, "#FBF3E8", "#3A2A14", "#E07A3F", "#F0B48C", "#7C9A6E", COPPER, "kraft", "stripes", "wood"),
      V("blue", L.blue, "#EEF3F9", "#1E2A3A", "#4A6FA5", "#9DB5D6", "#7C9A6E", SILVER, "dusty", "dots", "linen"),
    ],
  },
  // ------------------------------------------------------- DEEP BLUE SEA
  {
    id: "deep-blue-sea", name: { hy: "Խորը կապույտ ծով", en: "Deep Blue Sea" }, by: S,
    desc: { hy: "Ալիքներ, խեցիներ, ավազի գույն. ծովափնյա հարսանիք։", en: "Waves, shells, sand — a beach wedding." },
    styles: ["beach", "destination", "watercolor"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "wash", frame: "none", face: "sans", layout: "top",
    tags: ["beach", "ծովափ", "sea", "ծով", "waves", "shell", "sand"],
    motifs: [{ m: "waves", x: 150, y: 400, s: 320, c: "a", o: 0.9 }, { m: "waves", x: 150, y: 384, s: 320, c: "b", o: 0.7 }, { m: "shell", x: 50, y: 330, s: 46, c: "c", c2: "paper" }, { m: "starfish", x: 250, y: 328, s: 40, c: "b", c2: "paper" }, { m: "palmFrond", x: 270, y: 60, s: 110, r: 30, c: "b", o: 0.8 }],
    back: [{ m: "waves", x: 150, y: 400, s: 320, c: "a", o: 0.4 }],
    variants: [
      V("blue", L.blue, "#F1F6FA", "#1E2A3A", "#4A6FA5", "#8FB4D9", "#E9C46A", SILVER, "dusty", "wash", "linen"),
      V("green", L.green, "#F0F7F5", "#1F3A34", "#2F8F86", "#7CC7BD", "#E9C46A", CHAMP, "white", "wash", "sage"),
    ],
  },
  // ------------------------------------------------------- HAND-DRAWN BRANCHES
  {
    id: "hand-drawn-branches", name: { hy: "Ձեռքով նկարված ճյուղեր", en: "Hand-Drawn Branches" }, by: S,
    desc: { hy: "Թանաքով ճյուղեր՝ ձախից աջ, կրեմ թուղթ։", en: "Ink branches sweeping left to right on cream stock." },
    styles: ["rustic", "simple", "vintage"], collection: "botanical", shape: "landscape", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou", "rsvp"],
    bg: "speckle", frame: "none", face: "serif", layout: "right",
    tags: ["branches", "ճյուղ", "ink", "թանաք", "rustic", "hand drawn"],
    motifs: [{ m: "leafBranch", x: 90, y: 150, s: 220, r: 20, c: "a", o: 0.9 }, { m: "leafSprig", x: 60, y: 60, s: 60, r: -30, c: "b", o: 0.7 }, { m: "birds", x: 200, y: 50, s: 40, c: "ink", o: 0.6 }],
    back: [{ m: "leafBranch", x: 210, y: 150, s: 160, c: "a", o: 0.3 }],
    variants: [
      V("creme", L.creme, "#F5EFE2", "#2E2419", "#3B3025", "#8B7355", "#E6DCC7", GOLD, "kraft", "plain", "wood"),
      V("green", L.green, "#F2F0E6", "#22301F", "#5F7F5A", "#8CA87F", "#DCE3D3", GOLD, "sage", "botanic", "linen"),
    ],
  },
  // ------------------------------------------------------- MARBLED WATERCOLOR
  {
    id: "marbled-watercolor", name: { hy: "Մարմարե ջրաներկ", en: "Marbled Watercolour" }, by: S,
    desc: { hy: "Ջրաներկի մարմարե հոսք ամբողջ քարտով, սպիտակ սերիֆ։", en: "A marbled watercolour flow across the whole card, white serif." },
    styles: ["watercolor", "modern", "romantic"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "marble", frame: "none", face: "serif", layout: "center",
    tags: ["marble", "մարմար", "watercolor", "flow", "abstract"],
    motifs: [{ m: "watercolorBlob", x: 80, y: 90, s: 240, c: "a", o: 0.55 }, { m: "watercolorBlob", x: 240, y: 340, s: 260, r: 40, c: "b", o: 0.5 }, { m: "inkStroke", x: 150, y: 220, s: 240, r: -20, c: "c", o: 0.35 }],
    back: [{ m: "watercolorBlob", x: 150, y: 210, s: 200, c: "a", o: 0.25 }],
    variants: [
      V("blue", L.blue, "#F3F6FA", "#1E2A3A", "#4A6FA5", "#8FB4D9", "#B9C7D6", GOLD, "navy", "gold", "linen"),
      V("pink", L.pink, "#FBF4F3", "#3A2A2A", "#D98B94", "#E9B7BD", "#F0D6D3", ROSE, "blush", "rosegold", "blush"),
      V("purple", L.purple, "#F6F3F9", "#2E2340", "#6E5A8E", "#A08CBF", "#DDD1E6", SILVER, "navy", "silver", "linen"),
    ],
  },
  // ------------------------------------------------------- WEDDING CACTUS
  {
    id: "wedding-cactus", name: { hy: "Հարսանեկան կակտուս", en: "Wedding Cactus" }, by: S,
    desc: { hy: "Կակտուսներ, տերակոտա, արևոտ արտասահման։", en: "Cacti, terracotta, a sunny elsewhere." },
    styles: ["destination", "modern", "rustic"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "arch", face: "sans", layout: "bottom",
    tags: ["cactus", "կակտուս", "desert", "անապատ", "terracotta", "destination"],
    motifs: [{ m: "cactus", x: 90, y: 150, s: 130, c: "b", c2: "a" }, { m: "cactus", x: 210, y: 170, s: 96, c: "a", c2: "b", flip: true }, { m: "sun", x: 230, y: 70, s: 50, c: "c" }],
    back: [{ m: "cactus", x: 150, y: 150, s: 100, c: "b", c2: "a", o: 0.35 }],
    variants: [
      V("orange", L.orange, "#FBF3E8", "#3A2A14", "#C96A3A", "#5F7F5A", "#E9C46A", COPPER, "kraft", "stripes", "wood"),
      V("green", L.green, "#F2F4EC", "#22301F", "#5F7F5A", "#8CA87F", "#E9C46A", GOLD, "sage", "plain", "linen"),
      V("white", L.white, "#FFFFFF", "#1C1A17", "#5F7F5A", "#C96A3A", "#E9C46A", CHAMP, "white", "plain", "marble"),
    ],
  },
  // ------------------------------------------------------- NIGHT SKY
  {
    id: "night-sky", name: { hy: "Գիշերային երկինք", en: "Night Sky" }, by: S,
    desc: { hy: "Մուգ կապույտ, աստղեր, լուսին և ոսկե տառեր։", en: "Deep navy, stars, a moon and gold type." },
    styles: ["romantic", "modern"], collection: "foil", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou"],
    bg: "gradient", frame: "thin", face: "serif", layout: "center", foilNames: true, popular: true,
    tags: ["night", "գիշեր", "stars", "աստղ", "moon", "navy", "gold"],
    motifs: [{ m: "stars", x: 150, y: 210, s: 300, c: "paper", o: 0.9 }, { m: "moon", x: 240, y: 60, s: 60, c: "foil" }, { m: "stars", x: 80, y: 90, s: 120, c: "foil", o: 0.8 }],
    back: [{ m: "stars", x: 150, y: 210, s: 300, c: "paper", o: 0.5 }],
    variants: [
      V("blue", L.blue, "#141A33", "#F3EFE7", "#B08D57", "#8FB4D9", "#22315A", GOLD, "navy", "night", "night", true),
      V("black", L.black, "#0F0F14", "#F3EFE7", "#B08D57", "#8D8A84", "#22222A", GOLD, "black", "gold", "dark", true),
      V("purple", L.purple, "#1E1038", "#F3EFE7", "#D4B478", "#A08CBF", "#33205E", GOLD, "navy", "night", "night", true),
    ],
  },
  // ------------------------------------------------------- BOHO BOUQUET
  {
    id: "boho-bouquet", name: { hy: "Բոհո փունջ", en: "Boho Bouquet" }, by: S,
    desc: { hy: "Ցորենի հասկեր, պամպասի խոտ, տերակոտա և հագեցած ծաղիկներ։", en: "Wheat, pampas, terracotta and saturated blooms." },
    styles: ["rustic", "floral", "modern"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "none", frame: "arch", face: "serif", layout: "center",
    tags: ["boho", "բոհո", "wheat", "ցորեն", "pampas", "terracotta"],
    motifs: [{ m: "wheat", x: 40, y: 380, s: 110, r: 10, c: "b" }, { m: "wheat", x: 262, y: 380, s: 110, r: -10, c: "b", flip: true }, { m: "wildflower", x: 60, y: 60, s: 90, r: -30, c: "a", c2: "c" }, { m: "wildflower", x: 244, y: 64, s: 90, r: 30, c: "c", c2: "a", flip: true }, { m: "leafSprig", x: 150, y: 24, s: 60, c: "b" }],
    back: [{ m: "wheat", x: 150, y: 400, s: 100, c: "b", o: 0.5 }],
    variants: [
      V("orange", L.orange, "#FBF3EA", "#3A2A14", "#C96A3A", "#C9A97C", "#8CA87F", COPPER, "kraft", "stripes", "wood"),
      V("brown", L.brown, "#F5EEE3", "#3B2A14", "#8B5E3C", "#C9A97C", "#8CA87F", GOLD, "kraft", "plain", "wood"),
      V("yellow", L.yellow, "#FDF8EA", "#3B2E12", "#E1B740", "#C9A97C", "#8CA87F", GOLD, "ivory", "dots", "linen"),
    ],
  },
  // ------------------------------------------------------- CONFETTI ARCH
  {
    id: "confetti-arch", name: { hy: "Կոնֆետի կամար", en: "Confetti Arch" }, by: S,
    desc: { hy: "Ժամանակակից կամար, ոսկե կոնֆետի, սև գրություն։", en: "A modern arch, gold confetti, black type." },
    styles: ["modern", "simple"], collection: "foil", shape: "portrait", photos: 0, features: ["backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "arch", face: "modern", layout: "center",
    tags: ["confetti", "կոնֆետի", "arch", "կամար", "modern", "gold"],
    motifs: [{ m: "confettiDot", x: 40, y: 50, s: 14, c: "foil" }, { m: "confettiDot", x: 260, y: 70, s: 10, c: "foil" }, { m: "confettiDot", x: 60, y: 380, s: 12, c: "a" }, { m: "confettiDot", x: 250, y: 360, s: 16, c: "foil" }, { m: "confettiDot", x: 150, y: 30, s: 8, c: "a" }, { m: "confettiDot", x: 30, y: 220, s: 8, c: "foil" }, { m: "confettiDot", x: 272, y: 240, s: 12, c: "a" }],
    back: [{ m: "confettiDot", x: 150, y: 210, s: 40, c: "foil", o: 0.3 }],
    variants: [
      V("black", L.black, "#F7F4EE", "#1C1A17", "#1C1A17", "#B08D57", "#EDE7DA", GOLD, "black", "gold", "linen"),
      V("white", L.white, "#FFFFFF", "#1C1A17", "#8D8A84", "#B8B3A8", "#EDEBE6", SILVER, "white", "silver", "marble"),
      V("pink", L.pink, "#FBF2EE", "#3A2A2A", "#C98B8F", "#E3B4B8", "#F0D6D3", ROSE, "blush", "rosegold", "blush"),
    ],
  },
  // ------------------------------------------------------- BIRCH TREES
  {
    id: "birch-trees", name: { hy: "Կեչիներ", en: "Elegant Birch" }, by: S,
    desc: { hy: "Կեչու բներ երկու կողմից, ձմեռային կամ աշնանային։", en: "Birch trunks either side, wintry or autumnal." },
    styles: ["rustic", "destination", "simple"], collection: "landscapes", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou"],
    bg: "linen", frame: "none", face: "serif", layout: "center",
    tags: ["birch", "կեչի", "trees", "ծառ", "forest", "winter"],
    motifs: [{ m: "birch", x: 30, y: 210, s: 420, c: "ink", c2: "paper", o: 0.85 }, { m: "birch", x: 272, y: 210, s: 420, c: "ink", c2: "paper", o: 0.85, flip: true }, { m: "leafSprig", x: 150, y: 44, s: 60, c: "a", o: 0.8 }],
    back: [{ m: "birch", x: 30, y: 210, s: 420, c: "ink", c2: "paper", o: 0.3 }],
    variants: [
      V("white", L.white, "#FDFCFA", "#1C1A17", "#5F7F5A", "#B8B3A8", "#EDEBE6", SILVER, "white", "plain", "marble"),
      V("orange", L.orange, "#FBF3E8", "#3A2A14", "#E07A3F", "#C9A97C", "#F0B48C", COPPER, "kraft", "stripes", "wood"),
    ],
  },
  // ------------------------------------------------------- CHERRY BLOSSOMS
  {
    id: "cherry-blossoms", name: { hy: "Բալի ծաղկունք", en: "Cherry Blossoms" }, by: S,
    desc: { hy: "Ծաղկած ճյուղ վերևից, թռչող թերթիկներ։", en: "A blossoming branch from above, petals drifting." },
    styles: ["floral", "romantic", "watercolor"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "script", layout: "bottom",
    tags: ["cherry", "բալ", "blossom", "ծաղկունք", "sakura", "spring", "գարուն"],
    motifs: [{ m: "cherryBlossom", x: 90, y: 60, s: 220, c: "a", c2: "b" }, { m: "cherryBlossom", x: 250, y: 100, s: 120, r: 30, c: "a", c2: "b", flip: true }, { m: "confettiDot", x: 200, y: 200, s: 6, c: "b" }, { m: "confettiDot", x: 60, y: 240, s: 5, c: "b" }, { m: "confettiDot", x: 240, y: 260, s: 7, c: "a" }],
    back: [{ m: "cherryBlossom", x: 90, y: 60, s: 160, c: "a", c2: "b", o: 0.35 }],
    variants: [
      V("pink", L.pink, "#FBF6F4", "#3A2A2A", "#E3A6B0", "#F5D3D8", "#8B5E3C", ROSE, "blush", "wash", "blush"),
      V("red", L.red, "#F9F1EE", "#3A1F1F", "#C9484F", "#E9989E", "#5A3A2A", GOLD, "burgundy", "gold", "linen"),
      V("white", L.white, "#FFFFFF", "#1C1A17", "#8D8A84", "#D6D3CE", "#5A5450", SILVER, "white", "plain", "marble"),
    ],
  },
  // ------------------------------------------------------- PALM FRONDS
  {
    id: "tropical-palms", name: { hy: "Արևադարձային արմավենիներ", en: "Tropical Palm Fronds" }, by: S,
    desc: { hy: "Արմավենու տերևներ եզրերին, ծովափնյա երեկո։", en: "Palm fronds at the edges, an evening by the sea." },
    styles: ["beach", "destination"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "sans", layout: "center",
    tags: ["palm", "արմավենի", "tropical", "beach", "ծովափ", "monstera"],
    motifs: [{ m: "palmFrond", x: 40, y: 50, s: 160, r: 20, c: "a" }, { m: "monstera", x: 262, y: 380, s: 140, r: 200, c: "b" }, { m: "palmFrond", x: 260, y: 40, s: 110, r: -30, c: "b", flip: true, o: 0.8 }, { m: "monstera", x: 40, y: 380, s: 100, r: 150, c: "a", o: 0.8 }],
    back: [{ m: "palmFrond", x: 150, y: 210, s: 220, c: "a", o: 0.25 }],
    variants: [
      V("green", L.green, "#F4F6EE", "#22301F", "#3E7C47", "#8CA87F", "#DCE3D3", GOLD, "sage", "botanic", "sage"),
      V("blue", L.blue, "#EEF5F7", "#1E2A3A", "#2F8F86", "#7CC7BD", "#DDE3E9", SILVER, "dusty", "wash", "linen"),
    ],
  },
  // ------------------------------------------------------- GOLDEN WREATH
  {
    id: "golden-wreath", name: { hy: "Ոսկե ծաղկեպսակ", en: "Golden Wreath" }, by: S,
    desc: { hy: "Ոսկե ֆոլգայի ծաղկեպսակ, մեջտեղում՝ մոնոգրամ։", en: "A gold-foil wreath with the monogram at its centre." },
    styles: ["classic", "romantic", "vintage"], collection: "foil", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "linen", frame: "none", face: "smallcaps", layout: "bottom", foilNames: true, popular: true,
    tags: ["wreath", "ծաղկեպսակ", "monogram", "մոնոգրամ", "gold", "foil"],
    motifs: [{ m: "wreath", x: 150, y: 130, s: 190, c: "foil" }, { m: "monogramRing", x: 150, y: 130, s: 60, c: "foil", o: 0.9 }],
    back: [{ m: "wreath", x: 150, y: 210, s: 200, c: "foil", o: 0.35 }],
    variants: [
      V("white", L.white, "#FDFCFA", "#1C1A17", "#B08D57", "#D4B478", "#EDEBE6", GOLD, "white", "gold", "marble"),
      V("green", L.green, "#EEF1E8", "#22301F", "#B08D57", "#8CA87F", "#DCE3D3", GOLD, "forest", "gold", "linen"),
      V("black", L.black, "#17161A", "#F3EFE7", "#B08D57", "#D4B478", "#2A2830", GOLD, "black", "gold", "dark", true),
      V("silver", L.silver, "#F4F4F4", "#1C1A17", "#8D8A84", "#B9BCC2", "#E6E6E6", SILVER, "white", "silver", "marble"),
    ],
  },
  // ------------------------------------------------------- SPRIGS
  {
    id: "sprigs", name: { hy: "Ճյուղիկներ", en: "Sprigs" }, by: S,
    desc: { hy: "Ցրված փոքր ճյուղիկներ ամբողջ քարտով, պարզ և թարմ։", en: "Small sprigs scattered over the whole card, simple and fresh." },
    styles: ["simple", "rustic", "floral"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou", "rsvp"],
    bg: "none", frame: "none", face: "sans", layout: "center",
    tags: ["sprigs", "ճյուղիկ", "scatter", "simple", "fresh"],
    motifs: [{ m: "leafSprig", x: 40, y: 40, s: 44, r: -30, c: "a" }, { m: "leafSprig", x: 250, y: 60, s: 40, r: 40, c: "b" }, { m: "leafSprig", x: 60, y: 380, s: 44, r: 200, c: "b" }, { m: "leafSprig", x: 260, y: 370, s: 40, r: 150, c: "a" }, { m: "leafSprig", x: 150, y: 30, s: 36, r: 0, c: "a" }, { m: "leafSprig", x: 30, y: 210, s: 34, r: -80, c: "b" }, { m: "leafSprig", x: 270, y: 220, s: 34, r: 90, c: "a" }, { m: "leafSprig", x: 150, y: 396, s: 36, r: 180, c: "b" }],
    back: [{ m: "leafSprig", x: 150, y: 210, s: 60, c: "a", o: 0.4 }],
    variants: [
      V("green", L.green, "#F6F6F0", "#22301F", "#5F7F5A", "#8CA87F", "#DCE3D3", GOLD, "sage", "botanic", "linen"),
      V("grey", L.grey, "#F4F3F0", "#2A2926", "#6E6B66", "#A3A09A", "#E1DFDA", SILVER, "white", "plain", "marble"),
    ],
  },
  // ------------------------------------------------------- INK WASH
  {
    id: "ink-wash", name: { hy: "Թանաքի լվացք", en: "Ink Wash" }, by: S,
    desc: { hy: "Մեկ լայն թանաքի հարված ֆոնին, մոդեռն սանս։", en: "One wide ink stroke behind, modern sans." },
    styles: ["modern", "watercolor", "simple"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "modern", layout: "center",
    tags: ["ink", "թանաք", "wash", "brush", "modern", "abstract"],
    motifs: [{ m: "inkStroke", x: 150, y: 210, s: 340, r: -30, c: "a", o: 0.85 }],
    back: [{ m: "inkStroke", x: 150, y: 210, s: 200, c: "a", o: 0.3 }],
    variants: [
      V("blue", L.blue, "#F5F7FA", "#1E2A3A", "#4A6FA5", "#8CA0BF", "#DDE3E9", SILVER, "navy", "plain", "linen"),
      V("black", L.black, "#F7F6F3", "#1C1A17", "#2A2926", "#8D8A84", "#E1DFDA", GOLD, "black", "gold", "marble"),
      V("green", L.green, "#F4F6F0", "#22301F", "#5F7F5A", "#8CA87F", "#DCE3D3", GOLD, "forest", "plain", "sage"),
    ],
  },
  // ------------------------------------------------------- SNAPSHOTS (PHOTO)
  {
    id: "layered-snapshots", name: { hy: "Շերտավոր նկարներ", en: "Layered Snapshots" }, by: S,
    desc: { hy: "Երկու նկար՝ շերտերով, անունները ներքևում։", en: "Two photographs layered, the names below." },
    styles: ["modern", "simple", "romantic"], collection: "signature", shape: "portrait", photos: 2, features: ["photo", "backside"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "sans", layout: "bottom",
    photo: [{ x: 96, y: 130, w: 150, h: 190, shape: "rect" }, { x: 190, y: 190, w: 140, h: 176, shape: "rect" }],
    tags: ["photo", "նկար", "snapshots", "two photos", "modern"],
    motifs: [{ m: "confettiDot", x: 40, y: 60, s: 8, c: "a" }, { m: "confettiDot", x: 260, y: 300, s: 10, c: "b" }],
    back: [],
    variants: [
      V("white", L.white, "#FFFFFF", "#1C1A17", "#B08D57", "#8D8A84", "#EDEBE6", GOLD, "white", "plain", "marble"),
      V("black", L.black, "#17161A", "#F3EFE7", "#B08D57", "#8D8A84", "#2A2830", GOLD, "black", "gold", "dark", true),
    ],
  },
  // ------------------------------------------------------- FULL PHOTO
  {
    id: "full-photo-arch", name: { hy: "Կամարաձև նկար", en: "Arched Photo" }, by: S,
    desc: { hy: "Մեկ նկար՝ կամարի մեջ, ներքևում՝ անունները և օրը։", en: "One photograph in an arch, names and the day below." },
    styles: ["modern", "romantic", "simple"], collection: "signature", shape: "portrait", photos: 1, features: ["photo", "backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "serif", layout: "bottom", popular: true,
    photo: [{ x: 150, y: 150, w: 200, h: 250, shape: "arch" }],
    tags: ["photo", "նկար", "arch", "կամար", "one photo", "modern"],
    motifs: [{ m: "leafSprig", x: 44, y: 384, s: 50, r: 200, c: "a", o: 0.8 }, { m: "leafSprig", x: 256, y: 384, s: 50, r: 160, c: "a", o: 0.8, flip: true }],
    back: [{ m: "leafSprig", x: 150, y: 210, s: 80, c: "a", o: 0.3 }],
    variants: [
      V("creme", L.creme, "#F5EFE2", "#2E2419", "#8B7355", "#B8A27E", "#E6DCC7", GOLD, "ivory", "gold", "linen"),
      V("green", L.green, "#F2F4EC", "#22301F", "#5F7F5A", "#8CA87F", "#DCE3D3", GOLD, "sage", "botanic", "sage"),
      V("white", L.white, "#FFFFFF", "#1C1A17", "#8D8A84", "#B8B3A8", "#EDEBE6", SILVER, "white", "plain", "marble"),
    ],
  },
  // ============================================================ ARARAT COLLECTION
  {
    id: "pomegranate", name: { hy: "Նուռ", en: "Pomegranate" }, by: S,
    desc: { hy: "Հայկական հարսանիքի գլխավոր խորհրդանիշը՝ բացված նուռ, ոսկե հատիկներ, խորը կարմիր։", en: "The Armenian wedding's own symbol — a split pomegranate, gold seeds, deep red." },
    styles: ["armenian", "classic", "romantic"], collection: "ararat", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "linen", frame: "thin", face: "serif", layout: "center", foilNames: true, popular: true, isNew: true,
    tags: ["pomegranate", "նուռ", "armenian", "հայկական", "red", "gold", "tradition"],
    motifs: [{ m: "pomegranateHalf", x: 60, y: 60, s: 100, r: -15, c: "a", c2: "foil" }, { m: "pomegranate", x: 246, y: 372, s: 100, r: 10, c: "a", c2: "b" }, { m: "leafSprig", x: 246, y: 60, s: 60, r: 40, c: "b", o: 0.8 }, { m: "leafSprig", x: 60, y: 372, s: 60, r: 220, c: "b", o: 0.8 }, { m: "divider", x: 150, y: 330, s: 90, c: "foil" }],
    back: [{ m: "pomegranate", x: 150, y: 210, s: 120, c: "a", c2: "b", o: 0.35 }],
    variants: [
      V("red", L.red, "#F7F0E8", "#3A1F1F", "#9C2F3A", "#5F7F5A", "#E7C9C4", GOLD, "burgundy", "pomegranate", "linen"),
      V("creme", L.creme, "#F5EFE2", "#2E2419", "#B3202A", "#5F7F5A", "#E6DCC7", GOLD, "ivory", "gold", "linen"),
      V("black", L.black, "#17161A", "#F3EFE7", "#C9484F", "#8CA87F", "#2A2830", GOLD, "black", "pomegranate", "dark", true),
    ],
  },
  {
    id: "eternity-lace", name: { hy: "Հավերժության ժանյակ", en: "Eternity Lace" }, by: S,
    desc: { hy: "Խաչքարի ժանյակե եզրագիծ և հավերժության նշան՝ ոսկով։", en: "A khachkar-lace border and the eternity sign, in gold." },
    styles: ["armenian", "vintage", "classic"], collection: "ararat", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "linen", frame: "double", face: "serif", layout: "center", isNew: true,
    tags: ["eternity", "հավերժություն", "khachkar", "խաչքար", "lace", "ժանյակ", "armenian", "ornament"],
    motifs: [{ m: "eternity", x: 150, y: 76, s: 70, c: "foil" }, { m: "khachkarLace", x: 150, y: 24, s: 220, c: "a", o: 0.8 }, { m: "khachkarLace", x: 150, y: 396, s: 220, r: 180, c: "a", o: 0.8 }, { m: "divider", x: 150, y: 340, s: 100, c: "foil" }],
    back: [{ m: "eternity", x: 150, y: 210, s: 140, c: "foil", o: 0.3 }],
    variants: [
      V("gold", L.gold, "#F7F1E4", "#2E2419", "#B08D57", "#8B7355", "#F0E4C8", GOLD, "ivory", "gold", "linen"),
      V("brown", L.brown, "#F1E8D8", "#3B2A14", "#8B5E3C", "#B8926E", "#E4D5C0", GOLD, "kraft", "damask", "wood"),
      V("black", L.black, "#17161A", "#F3EFE7", "#B08D57", "#D4B478", "#2A2830", GOLD, "black", "gold", "dark", true),
    ],
  },
  {
    id: "ararat-dawn", name: { hy: "Արարատի արշալույս", en: "Ararat at Dawn" }, by: S,
    desc: { hy: "Երկգագաթ լեռը արշալույսին, ներքևում՝ անունները։", en: "The two peaks at dawn, the names below." },
    styles: ["armenian", "destination", "romantic"], collection: "landscapes", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou"],
    bg: "gradient", frame: "none", face: "serif", layout: "bottom", popular: true, isNew: true,
    tags: ["ararat", "արարատ", "mountain", "լեռ", "dawn", "արշալույս", "landscape"],
    motifs: [{ m: "ararat", x: 150, y: 150, s: 320, c: "b", c2: "paper" }, { m: "sun", x: 230, y: 70, s: 40, c: "a", o: 0.9 }, { m: "birds", x: 80, y: 70, s: 40, c: "ink", o: 0.5 }, { m: "apricotBlossom", x: 40, y: 384, s: 60, r: 200, c: "a", c2: "paper", o: 0.9 }, { m: "apricotBlossom", x: 262, y: 384, s: 60, r: 160, c: "a", c2: "paper", o: 0.9, flip: true }],
    back: [{ m: "ararat", x: 150, y: 150, s: 220, c: "b", c2: "paper", o: 0.35 }],
    variants: [
      V("orange", L.orange, "#FBEFE4", "#3A2A24", "#E07A3F", "#8FA3B8", "#F4D2BC", GOLD, "ivory", "wash", "linen"),
      V("blue", L.blue, "#EEF2F7", "#1E2A3A", "#B08D57", "#6E86A6", "#CBD6E4", GOLD, "dusty", "plain", "linen"),
      V("purple", L.purple, "#F1ECF3", "#2E2340", "#D3957F", "#8E7CA8", "#DDD1E6", ROSE, "navy", "night", "night"),
    ],
  },
  {
    id: "apricot-blossom", name: { hy: "Ծիրանի ծաղիկ", en: "Apricot Blossom" }, by: S,
    desc: { hy: "Ծիրանենու ծաղկած ճյուղեր՝ ծիրանագույն և սպիտակ։", en: "Blossoming apricot branches in apricot and white." },
    styles: ["armenian", "floral", "watercolor"], collection: "ararat", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "script", layout: "center", isNew: true,
    tags: ["apricot", "ծիրան", "blossom", "ծաղիկ", "armenian", "spring", "գարուն"],
    motifs: [{ m: "apricotBlossom", x: 60, y: 60, s: 140, r: -10, c: "a", c2: "paper" }, { m: "apricotBlossom", x: 250, y: 370, s: 140, r: 170, c: "a", c2: "paper", flip: true }, { m: "confettiDot", x: 210, y: 90, s: 6, c: "a" }, { m: "confettiDot", x: 90, y: 330, s: 7, c: "a" }],
    back: [{ m: "apricotBlossom", x: 150, y: 210, s: 140, c: "a", c2: "paper", o: 0.35 }],
    variants: [
      V("orange", L.orange, "#FDF6EE", "#3A2A24", "#F0A46B", "#5F7F5A", "#F7D9C0", COPPER, "ivory", "wash", "linen"),
      V("pink", L.pink, "#FCF5F3", "#3A2A2A", "#E9A6A0", "#7C9A6E", "#F5D3CE", ROSE, "blush", "wash", "blush"),
    ],
  },
  {
    id: "vine-and-grapes", name: { hy: "Որթատունկ և խաղող", en: "Vine and Grapes" }, by: S,
    desc: { hy: "Խաղողի ողկույզներով որթատունկի եզրագիծ՝ գինու տոնի համար։", en: "A grapevine border with clusters, for a wine-country wedding." },
    styles: ["armenian", "rustic", "vintage"], collection: "ararat", shape: "landscape", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "speckle", frame: "none", face: "serif", layout: "center", isNew: true,
    tags: ["vine", "որթատունկ", "grapes", "խաղող", "wine", "գինի", "areni", "rustic"],
    motifs: [{ m: "vineBorder", x: 210, y: 24, s: 400, c: "b" }, { m: "vineBorder", x: 210, y: 276, s: 400, r: 180, c: "b" }, { m: "grapes", x: 40, y: 150, s: 70, c: "a", c2: "b" }, { m: "grapes", x: 380, y: 150, s: 70, c: "a", c2: "b", flip: true }],
    back: [{ m: "grapes", x: 210, y: 150, s: 90, c: "a", c2: "b", o: 0.3 }],
    variants: [
      V("purple", L.purple, "#F5F1EA", "#2E2340", "#6E5A8E", "#5F7F5A", "#DDD1E6", GOLD, "kraft", "damask", "wood"),
      V("green", L.green, "#F4F3EA", "#22301F", "#5F7F5A", "#8CA87F", "#DCE3D3", GOLD, "sage", "botanic", "linen"),
    ],
  },
  {
    id: "sevan-shore", name: { hy: "Սևանի ափ", en: "Sevan Shore" }, by: S,
    desc: { hy: "Կապույտ լիճ, վանքի ուրվագիծ, ճայեր։", en: "The blue lake, the monastery silhouette, gulls." },
    styles: ["armenian", "destination", "beach"], collection: "landscapes", shape: "landscape", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou"],
    bg: "gradient", frame: "none", face: "sans", layout: "left", isNew: true,
    tags: ["sevan", "սևան", "lake", "լիճ", "monastery", "landscape"],
    motifs: [{ m: "sevan", x: 300, y: 170, s: 260, c: "b", c2: "a" }, { m: "birds", x: 330, y: 60, s: 40, c: "ink", o: 0.6 }],
    back: [{ m: "sevan", x: 210, y: 150, s: 200, c: "b", c2: "a", o: 0.3 }],
    variants: [
      V("blue", L.blue, "#EEF3F8", "#1E2A3A", "#4A6FA5", "#8FB4D9", "#DDE3E9", SILVER, "dusty", "wash", "linen"),
      V("green", L.green, "#EEF3F1", "#1F3A34", "#2F8F86", "#7CC7BD", "#DCE3D3", CHAMP, "sage", "plain", "sage"),
    ],
  },
  {
    id: "tatev-heights", name: { hy: "Տաթևի բարձունք", en: "Tatev Heights" }, by: S,
    desc: { hy: "Ժայռի ծայրին վանք, ձորը մշուշում։", en: "The monastery on the cliff, the gorge in mist." },
    styles: ["armenian", "destination", "rustic"], collection: "landscapes", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou"],
    bg: "gradient", frame: "none", face: "serif", layout: "bottom", isNew: true,
    tags: ["tatev", "տաթև", "monastery", "վանք", "cliff", "gorge", "landscape"],
    motifs: [{ m: "tatev", x: 150, y: 150, s: 300, c: "b", c2: "ink" }, { m: "birds", x: 220, y: 60, s: 36, c: "ink", o: 0.5 }],
    back: [{ m: "tatev", x: 150, y: 150, s: 200, c: "b", c2: "ink", o: 0.3 }],
    variants: [
      V("green", L.green, "#EEF1EA", "#22301F", "#5F7F5A", "#8CA87F", "#C9D6C0", GOLD, "forest", "plain", "sage"),
      V("grey", L.grey, "#F0EFEC", "#2A2926", "#6E6B66", "#A3A09A", "#D6D3CE", SILVER, "white", "plain", "marble"),
    ],
  },
  {
    id: "noravank-red", name: { hy: "Նորավանքի կարմիր", en: "Noravank Red" }, by: S,
    desc: { hy: "Կարմիր ժայռերի կիրճ, տուֆի գույն, ոսկե խաչ։", en: "The red-rock gorge, tuff colour, a gold cross." },
    styles: ["armenian", "destination", "classic"], collection: "landscapes", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "gradient", frame: "thin", face: "serif", layout: "bottom", isNew: true,
    tags: ["noravank", "նորավանք", "red rocks", "tuff", "տուֆ", "gorge", "landscape"],
    motifs: [{ m: "noravank", x: 150, y: 150, s: 300, c: "a", c2: "b" }, { m: "eternity", x: 150, y: 44, s: 30, c: "foil", o: 0.9 }],
    back: [{ m: "noravank", x: 150, y: 150, s: 200, c: "a", c2: "b", o: 0.3 }],
    variants: [
      V("red", L.red, "#F8EEE6", "#3A1F1F", "#9C4526", "#D9906B", "#F1D2C0", GOLD, "burgundy", "gold", "linen"),
      V("orange", L.orange, "#FBF1E6", "#3A2A14", "#C96A3A", "#E9A67A", "#F4D8BE", COPPER, "kraft", "stripes", "wood"),
    ],
  },
  {
    id: "duduk-night", name: { hy: "Դուդուկի գիշեր", en: "Duduk Night" }, by: S,
    desc: { hy: "Մուգ ֆոն, ոսկե զարդանախշ և դուդուկ՝ երաժշտության հրավեր։", en: "Dark ground, gold ornament and a duduk — an invitation to music." },
    styles: ["armenian", "modern", "romantic"], collection: "ararat", shape: "portrait", photos: 0, features: ["backside"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "goldEdge", face: "smallcaps", layout: "center", foilNames: true, isNew: true,
    tags: ["duduk", "դուդուկ", "music", "երաժշտություն", "night", "gold", "armenian"],
    motifs: [{ m: "duduk", x: 150, y: 70, s: 120, r: -30, c: "foil" }, { m: "khachkarLace", x: 150, y: 396, s: 200, r: 180, c: "foil", o: 0.7 }, { m: "stars", x: 150, y: 210, s: 300, c: "paper", o: 0.35 }],
    back: [{ m: "duduk", x: 150, y: 210, s: 120, r: -30, c: "foil", o: 0.35 }],
    variants: [
      V("black", L.black, "#15141A", "#F3EFE7", "#B08D57", "#D4B478", "#2A2830", GOLD, "black", "gold", "dark", true),
      V("blue", L.blue, "#141A33", "#F3EFE7", "#B08D57", "#8FB4D9", "#22315A", GOLD, "navy", "night", "night", true),
    ],
  },
  {
    id: "carpet-border", name: { hy: "Գորգի եզրագիծ", en: "Carpet Border" }, by: S,
    desc: { hy: "Հայկական գորգի երկրաչափական եզրագիծ՝ կարմիր, կապույտ, ոսկի։", en: "The geometric border of an Armenian carpet — red, blue, gold." },
    styles: ["armenian", "vintage", "rustic"], collection: "ararat", shape: "square", photos: 0, features: ["backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "linen", frame: "none", face: "serif", layout: "center", isNew: true,
    tags: ["carpet", "գորգ", "kilim", "ornament", "զարդանախշ", "geometric", "armenian"],
    motifs: [{ m: "khachkarLace", x: 160, y: 22, s: 260, c: "a" }, { m: "khachkarLace", x: 160, y: 298, s: 260, r: 180, c: "a" }, { m: "khachkarLace", x: 22, y: 160, s: 260, r: 270, c: "b" }, { m: "khachkarLace", x: 298, y: 160, s: 260, r: 90, c: "b" }, { m: "eternity", x: 160, y: 84, s: 40, c: "foil" }],
    back: [{ m: "eternity", x: 160, y: 160, s: 120, c: "foil", o: 0.3 }],
    variants: [
      V("red", L.red, "#F6EDE3", "#3A1F1F", "#9C2F3A", "#2E4A7A", "#E7C9C4", GOLD, "burgundy", "damask", "wood"),
      V("blue", L.blue, "#EEF1F6", "#1E2A3A", "#2E4A7A", "#9C2F3A", "#DDE3E9", GOLD, "navy", "damask", "linen"),
    ],
  },
  // ------------------------------------------------------- AT LAST (SCRIPT)
  {
    id: "at-last", name: { hy: "Վերջապես", en: "At Last" }, by: S,
    desc: { hy: "Մեկ բառ՝ ձեռագիր, մնացածը՝ փոքր և հանգիստ։", en: "One word in script, everything else small and calm." },
    styles: ["simple", "modern", "romantic"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "script", layout: "center",
    tags: ["script", "ձեռագիր", "simple", "typographic", "at last"],
    motifs: [{ m: "heart", x: 150, y: 60, s: 20, c: "a", o: 0.8 }, { m: "divider", x: 150, y: 350, s: 60, c: "a", o: 0.7 }],
    back: [{ m: "heart", x: 150, y: 210, s: 60, c: "a", o: 0.25 }],
    variants: [
      V("creme", L.creme, "#F5EFE2", "#2E2419", "#8B7355", "#B8A27E", "#E6DCC7", GOLD, "ivory", "plain", "linen"),
      V("pink", L.pink, "#FBF4F1", "#3A2A2A", "#C98B8F", "#E3B4B8", "#F0D6D3", ROSE, "blush", "rosegold", "blush"),
      V("black", L.black, "#17161A", "#F3EFE7", "#B08D57", "#8D8A84", "#2A2830", GOLD, "black", "gold", "dark", true),
    ],
  },
  // ------------------------------------------------------- DOVES
  {
    id: "two-doves", name: { hy: "Երկու աղավնի", en: "Two Doves" }, by: S,
    desc: { hy: "Երկու աղավնի, ձիթենու ճյուղ, կապույտ երկինք։", en: "Two doves, an olive branch, a blue sky." },
    styles: ["classic", "romantic", "vintage"], collection: "signature", shape: "portrait", photos: 0, features: ["backside", "matching"], matching: ["saveTheDate", "thankYou", "details"],
    bg: "wash", frame: "thin", face: "serif", layout: "center",
    tags: ["dove", "աղավնի", "olive", "ձիթենի", "classic", "peace"],
    motifs: [{ m: "dove", x: 108, y: 66, s: 80, c: "paper", c2: "ink" }, { m: "dove", x: 192, y: 66, s: 80, c: "paper", c2: "ink", flip: true }, { m: "olive", x: 150, y: 386, s: 120, c: "b" }, { m: "rings", x: 150, y: 120, s: 40, c: "foil" }],
    back: [{ m: "olive", x: 150, y: 210, s: 120, c: "b", o: 0.35 }],
    variants: [
      V("blue", L.blue, "#EEF3F9", "#1E2A3A", "#4A6FA5", "#5F7F5A", "#CBD6E4", GOLD, "dusty", "plain", "linen"),
      V("white", L.white, "#FDFCFA", "#1C1A17", "#8D8A84", "#5F7F5A", "#EDEBE6", GOLD, "white", "gold", "marble"),
    ],
  },
  // ------------------------------------------------------- HYDRANGEA
  {
    id: "hydrangea-corners", name: { hy: "Հորտենզիա", en: "Hydrangea Corners" }, by: S,
    desc: { hy: "Հորտենզիայի փնջեր անկյուններում, փափուկ կապույտ։", en: "Hydrangea clusters in the corners, soft blue." },
    styles: ["floral", "romantic", "watercolor"], collection: "botanical", shape: "portrait", photos: 0, features: ["backside", "matching", "colorChange"], matching: ["saveTheDate", "thankYou"],
    bg: "none", frame: "none", face: "script", layout: "center",
    tags: ["hydrangea", "հորտենզիա", "blue", "կապույտ", "floral", "watercolor"],
    motifs: [{ m: "hydrangea", x: 50, y: 50, s: 120, c: "a", c2: "b" }, { m: "hydrangea", x: 250, y: 370, s: 120, c: "a", c2: "b", flip: true }, { m: "leafSprig", x: 110, y: 90, s: 50, r: 120, c: "c" }, { m: "leafSprig", x: 190, y: 330, s: 50, r: -60, c: "c" }],
    back: [{ m: "hydrangea", x: 150, y: 210, s: 120, c: "a", c2: "b", o: 0.3 }],
    variants: [
      V("blue", L.blue, "#F5F7FA", "#1E2A3A", "#7C9CD1", "#B7C9E8", "#7C9A6E", SILVER, "dusty", "wash", "linen"),
      V("purple", L.purple, "#F8F5F9", "#2E2340", "#9C86C2", "#CDBEE0", "#7C9A6E", SILVER, "white", "plain", "linen"),
      V("pink", L.pink, "#FBF5F4", "#3A2A2A", "#E3A6B0", "#F2CFD5", "#7C9A6E", ROSE, "blush", "wash", "blush"),
    ],
  },
  // ------------------------------------------------------- KOI
  {
    id: "gentle-koi", name: { hy: "Հանգիստ կոյեր", en: "Gentle Koi" }, by: S,
    desc: { hy: "Երկու կոյ ձուկ՝ պտտվող, ջրի օղակներ։", en: "Two koi circling, rings on the water." },
    styles: ["modern", "watercolor", "romantic"], collection: "signature", shape: "square", photos: 0, features: ["backside"], matching: ["saveTheDate", "thankYou"],
    bg: "wash", frame: "none", face: "sans", layout: "bottom",
    tags: ["koi", "կոյ", "fish", "ձուկ", "water", "circle", "modern"],
    motifs: [{ m: "koi", x: 130, y: 120, s: 120, r: -20, c: "a", c2: "paper" }, { m: "koi", x: 200, y: 150, s: 120, r: 160, c: "b", c2: "paper" }, { m: "confettiDot", x: 90, y: 200, s: 6, c: "c" }, { m: "confettiDot", x: 240, y: 90, s: 5, c: "c" }],
    back: [{ m: "koi", x: 160, y: 160, s: 120, c: "a", c2: "paper", o: 0.3 }],
    variants: [
      V("creme", L.creme, "#F7F3EA", "#2E2419", "#E07A3F", "#1E2A3A", "#B9C7D6", GOLD, "ivory", "wash", "linen"),
      V("blue", L.blue, "#EEF3F8", "#1E2A3A", "#E07A3F", "#4A6FA5", "#B9C7D6", SILVER, "dusty", "wash", "linen"),
    ],
  },
];

export const wIds = wCards.map((c) => c.id);
export const findWCard = (id: string | undefined | null) => (id ? wCards.find((c) => c.id === id) : undefined);

/** "wed-<card>-<colour>" ⇄ parts */
export function parseWTpl(tpl: string | undefined | null): { card: WCard; variant: WVariant } | null {
  if (!tpl || !tpl.startsWith("wed-")) return null;
  const rest = tpl.slice(4);
  const card = wCards.find((c) => rest === c.id || rest.startsWith(c.id + "-"));
  if (!card) return null;
  const vid = rest.length > card.id.length ? rest.slice(card.id.length + 1) : "";
  const variant = card.variants.find((x) => x.id === vid) ?? card.variants[0];
  return { card, variant };
}
export const wTpl = (card: WCard, variant: WVariant) => `wed-${card.id}-${variant.id}`;

export const wCardFacets = (c: WCard): string[] => [...c.styles, c.collection, c.shape, ...c.features, ...c.variants.map((v) => v.id)];
