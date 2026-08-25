import type { Lang, T } from "./content";

// ============================================================================
// KIDS' BIRTHDAY CARDS — the catalogue Paperless Post sells as a category
// (paperlesspost.com/cards/category/kids-birthday-invitations), rebuilt as
// ORIGINAL designs for this service.
//
// What was absorbed from the reference is its ANATOMY, measured, not its art:
//   • the facets — 27 "shop by theme" varieties, 4 "explore" and 4 milestone
//     rows, colour, photo-count and card-shape filters (all here, translated);
//   • the tile — a card leaning on an open, LINED envelope, colourway dots
//     under it, the design's name and its "designer";
//   • the front's copy pattern — «JAMIE IS TURNING 6 · & we're having a party
//     · Saturday, July 8th at noon · the residence» — a name, an age, a
//     date, a place; the details ride ON the card, not behind a click;
//   • the card page — card + envelope on a coloured BACKDROP, a carousel
//     (card / envelope / preview), Customize as the primary action, and the
//     product bullets (guest questions, child v. adult headcounts, tracking).
//
// Every illustration is a small original SVG symbol (components/kids/
// Motifs.tsx) — flat vector, two-tone, drawn for this project; nothing is
// traced from a licensed card. "Popular characters" — a licensed-IP row on the
// reference — becomes original friendly monsters here on purpose.
//
// A design is DATA: a palette per colourway, a background pattern, a border,
// a scatter of motifs (position, size, rotation, which palette colour), a
// text block (where the words sit, which face) and, for photo cards, a photo
// slot. components/kids/KidsCardFace.tsx renders any of them with any child's
// details; the same face is the catalogue tile, the studio's live card and
// the guest's invitation.
// ============================================================================

// ---------------------------------------------------------------- FACETS

export type KidsTheme =
  | "animals" | "arts" | "balloons" | "cake" | "cars" | "dance" | "dinos" | "farm"
  | "gaming" | "gymnastics" | "jump" | "jungle" | "magic" | "mermaid" | "movie"
  | "neon" | "ninjas" | "photo" | "pool" | "characters" | "princess" | "rainbows"
  | "sleepover" | "space" | "sports" | "superheroes" | "unicorns";

export type KidsAudience = "girl" | "boy" | "teen" | "joint";
export type KidsMilestone = "first" | "teen13" | "sweet16" | "eighteen";
export type KidsShape = "portrait" | "landscape" | "square" | "scallop" | "wave" | "arch" | "ticket";
export type KidsFacet = KidsTheme | KidsAudience | KidsMilestone;

export const kidsThemes: Array<{ id: KidsTheme; label: T }> = [
  { id: "animals", label: { hy: "Կենդանիներ", en: "Animals" } },
  { id: "arts", label: { hy: "Արվեստ և ձեռքի աշխատանք", en: "Arts and crafts" } },
  { id: "balloons", label: { hy: "Փուչիկներ և կոնֆետի", en: "Balloons and confetti" } },
  { id: "cake", label: { hy: "Տորթ և քաղցրավենիք", en: "Cake and sweets" } },
  { id: "cars", label: { hy: "Մեքենաներ և բեռնատարներ", en: "Cars and trucks" } },
  { id: "dance", label: { hy: "Պար և երաժշտություն", en: "Dance and music" } },
  { id: "dinos", label: { hy: "Դինոզավրեր", en: "Dinosaurs" } },
  { id: "farm", label: { hy: "Ֆերմա", en: "Farm" } },
  { id: "gaming", label: { hy: "Խաղեր", en: "Gaming" } },
  { id: "gymnastics", label: { hy: "Մարմնամարզություն", en: "Gymnastics" } },
  { id: "jump", label: { hy: "Բատուտ և ցատկ", en: "Jump" } },
  { id: "jungle", label: { hy: "Ջունգլի և սաֆարի", en: "Jungle and safari" } },
  { id: "magic", label: { hy: "Կախարդանք", en: "Magic" } },
  { id: "mermaid", label: { hy: "Ջրահարս", en: "Mermaid" } },
  { id: "movie", label: { hy: "Կինոերեկո", en: "Movie night" } },
  { id: "neon", label: { hy: "Նեոն և փայլ", en: "Neon and glow" } },
  { id: "ninjas", label: { hy: "Նինձյաներ", en: "Ninjas" } },
  { id: "photo", label: { hy: "Նկարով", en: "Photo" } },
  { id: "pool", label: { hy: "Լողավազան", en: "Pool party" } },
  { id: "characters", label: { hy: "Հերոսներ և հրեշիկներ", en: "Characters and monsters" } },
  { id: "princess", label: { hy: "Արքայադուստր և փերի", en: "Princess and fairy" } },
  { id: "rainbows", label: { hy: "Ծիածաններ", en: "Rainbows" } },
  { id: "sleepover", label: { hy: "Գիշերակաց", en: "Sleepovers" } },
  { id: "space", label: { hy: "Տիեզերք", en: "Space" } },
  { id: "sports", label: { hy: "Սպորտ", en: "Sports and activities" } },
  { id: "superheroes", label: { hy: "Սուպերհերոսներ", en: "Superheroes" } },
  { id: "unicorns", label: { hy: "Միաեղջյուրներ", en: "Unicorns" } },
];

export const kidsAudiences: Array<{ id: KidsAudience; label: T }> = [
  { id: "girl", label: { hy: "Աղջկա ծնունդ", en: "Girl birthday" } },
  { id: "boy", label: { hy: "Տղայի ծնունդ", en: "Boy birthday" } },
  { id: "teen", label: { hy: "Դեռահասի ծնունդ", en: "Teen birthday" } },
  { id: "joint", label: { hy: "Համատեղ ծնունդ", en: "Joint birthday" } },
];

export const kidsMilestones: Array<{ id: KidsMilestone; label: T }> = [
  { id: "first", label: { hy: "Առաջին տարեդարձ", en: "1st birthday" } },
  { id: "teen13", label: { hy: "13 — դեռահաս", en: "Turning 13" } },
  { id: "sweet16", label: { hy: "Sweet 16", en: "Sweet 16" } },
  { id: "eighteen", label: { hy: "18 — չափահաս", en: "18th birthday" } },
];

export const kidsShapes: Array<{ id: KidsShape; label: T }> = [
  { id: "portrait", label: { hy: "Ուղղահայաց", en: "Portrait" } },
  { id: "landscape", label: { hy: "Հորիզոնական", en: "Landscape" } },
  { id: "square", label: { hy: "Քառակուսի", en: "Square" } },
  { id: "scallop", label: { hy: "Ալիքաեզր", en: "Scalloped" } },
  { id: "wave", label: { hy: "Ալիք", en: "Wavy" } },
  { id: "arch", label: { hy: "Կամար", en: "Arch" } },
  { id: "ticket", label: { hy: "Տոմս", en: "Ticket" } },
];

// ---------------------------------------------------------------- MODEL

export type MotifId =
  | "balloon" | "dot" | "squiggle" | "tri" | "star" | "sparkle" | "heart" | "cakeSlice" | "cupcake"
  | "layerCake" | "candle" | "lollipop" | "iceCream" | "donut" | "gift" | "partyHat" | "moon" | "cloud"
  | "rainbow" | "sun" | "crown" | "wand" | "castle" | "butterfly" | "unicorn" | "dino" | "dinoEgg"
  | "footprint" | "rocket" | "planet" | "ufo" | "fish" | "shell" | "tail" | "bubble" | "floatRing"
  | "wave" | "palm" | "lion" | "giraffe" | "monkey" | "leaf" | "paw" | "dog" | "cat" | "barn"
  | "tractor" | "cow" | "pig" | "chick" | "truck" | "raceCar" | "cone" | "flag" | "trophy"
  | "soccer" | "basketball" | "tennis" | "medal" | "gamepad" | "pixelHeart" | "shuriken" | "ninja"
  | "mask" | "bolt" | "burst" | "popcorn" | "clapboard" | "ticket" | "note" | "headphones" | "disco"
  | "ribbon" | "jumper" | "brush" | "splat" | "palette" | "crayon" | "topHat" | "playingCard"
  | "rabbit" | "pillow" | "zzz" | "tent" | "camera" | "smiley" | "cherry" | "flower" | "mushroom"
  | "bee" | "beachBall" | "sunglasses" | "bunting" | "streamer" | "bone" | "bamboo" | "monster"
  | "cocoa" | "kite" | "drum" | "guitar" | "hoop" | "beam" | "controllerPixel";

/** which palette slot a motif is painted with */
export type Slot = "ink" | "a" | "b" | "c" | "d" | "paper";

export type Placed = {
  m: MotifId;
  x: number; // centre, card units
  y: number;
  s: number; // size (width = height), card units
  r?: number; // rotation, deg
  c?: Slot; // primary colour (default a)
  c2?: Slot; // secondary colour (default paper)
  o?: number; // opacity
};

export type Pattern =
  | "none" | "dots" | "grid" | "stripes" | "diagonal" | "scales" | "checker" | "halftone" | "tiles"
  | "stars" | "pixels" | "rays" | "confetti" | "zigzag" | "hearts" | "waves" | "tieDye";

export type Border =
  | "none" | "stripesTop" | "checkerBand" | "hazard" | "tileFrame" | "leafFrame" | "confettiFrame"
  | "squiggleFrame" | "doubleRule" | "cornerStars" | "fringeBottom" | "buntingTop" | "neonFrame" | "scallopFrame";

export type Face = "round" | "marker" | "pixel" | "neon" | "script" | "serif" | "outline" | "bubble";
export type Headline = "turning" | "party" | "invited" | "join" | "level" | "roar" | "blast" | "splash" | "sweet" | "big1" | "double";
export type TextLayout = "center" | "bottom" | "top" | "left" | "right";

export type Variant = {
  id: string;
  label: T;
  /** the palette: paper (card ground), ink (type), a–d accents */
  paper: string;
  ink: string;
  a: string;
  b: string;
  c: string;
  d: string;
  /** the envelope: its paper and its liner (any CSS background) */
  env: string;
  liner: string;
  /** the studio/tile backdrop */
  backdrop: string;
  /** dark ground → light UI chrome on the invitation */
  dark?: boolean;
};

export type PhotoSlot = { x: number; y: number; w: number; h: number; shape: "rect" | "circle" | "oval" | "arch" | "full"; rotate?: number };

export type KidsCard = {
  id: string;
  name: T;
  by: T; // the "designer" line — a studio name, ours
  themes: KidsTheme[];
  audience: KidsAudience[];
  milestone?: KidsMilestone[];
  shape: KidsShape;
  pattern: Pattern;
  patternSlot?: Slot; // pattern colour (default a)
  patternOpacity?: number;
  border: Border;
  face: Face;
  headline: Headline;
  layout: TextLayout;
  motifs: Placed[];
  photo?: PhotoSlot;
  variants: Variant[];
  tags: string[]; // search words, both languages
  popular?: boolean;
  isNew?: boolean;
};

// ---------------------------------------------------------------- HELPERS

/** Armenian definite article on a name: vowel-final → ն, else ը. */
export function hyDef(name: string): string {
  const s = name.trim();
  if (!s) return "";
  const last = s[s.length - 1].toLowerCase();
  const vowels = "աեէըիոօու";
  if (/[a-z]/i.test(last)) return s + "-ը"; // Latin-spelled name in an Armenian sentence
  return s + (vowels.includes(last) ? "ն" : "ը");
}

/** Armenian genitive on a name (Արենի, Մարիայի, Անիի) — for «Արենի ծնունդը». */
export function hyGen(name: string): string {
  const s = name.trim();
  if (!s) return "";
  const last = s[s.length - 1].toLowerCase();
  if (/[a-z]/i.test(last)) return s + "-ի";
  if (last === "ա" || last === "ո" || last === "օ") return s + "յի";
  if (last === "ի") return s + "ի"; // Անիի
  if (last === "ե" || last === "է") return s + "ի";
  return s + "ի";
}

export const enOrdinal = (n: number) => {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
};

const HY_MONTHS_GEN = ["հունվարի", "փետրվարի", "մարտի", "ապրիլի", "մայիսի", "հունիսի", "հուլիսի", "օգոստոսի", "սեպտեմբերի", "հոկտեմբերի", "նոյեմբերի", "դեկտեմբերի"];
const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const HY_DAYS = ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"];
const EN_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** «Շաբաթ, 8 նոյեմբերի, ժ. 12:00» / «Saturday, November 8 at 12:00» */
export function kidsDateLine(lang: Lang, date: string, time: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return "";
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  const dow = d.getUTCDay();
  const day = Number(m[3]);
  const t = /^\d{2}:\d{2}$/.test(time) ? time : "";
  if (lang === "hy") return `${HY_DAYS[dow]}, ${day} ${HY_MONTHS_GEN[Number(m[2]) - 1]}${t ? `, ժ. ${t}` : ""}`;
  return `${EN_DAYS[dow]}, ${EN_MONTHS[Number(m[2]) - 1]} ${day}${t ? ` at ${t}` : ""}`;
}

/** The words on the front, per headline pattern. `age` may be undefined
 *  (catalogue tile before a parent types) — then the sample age shows. */
export function kidsWords(
  lang: Lang,
  h: Headline,
  name: string,
  age: number | undefined,
  second?: { name: string; age?: number },
): { pre?: string; big: string; ageBig?: string; sub?: string } {
  const a = age ?? 6;
  const n = name || (lang === "hy" ? "Արեն" : "Aren");
  const hy = lang === "hy";
  switch (h) {
    case "party":
      return hy
        ? { pre: "Տոն է", big: `${hyGen(n)} ${a}-ամյակը`, sub: "Արի՛ նշենք միասին" }
        : { pre: "Let's party", big: `${n}'s ${enOrdinal(a)} birthday`, sub: "come celebrate with us" };
    case "invited":
      return hy
        ? { pre: "Դու հրավիրված ես", big: `${hyDef(n)} դառնում է`, ageBig: String(a), sub: "և մենք տոն ենք անում" }
        : { pre: "You're invited", big: `${n} is turning`, ageBig: String(a), sub: "and we're having a party" };
    case "join":
      return hy
        ? { pre: "Միացիր մեզ", big: `${hyGen(n)} ծնունդն է`, ageBig: String(a), sub: "տարեկան" }
        : { pre: "Join us", big: `${n} turns`, ageBig: String(a), sub: "come play with us" };
    case "level":
      return hy
        ? { pre: "Player 1", big: `${hyDef(n)} անցնում է`, ageBig: String(a), sub: "մակարդակ · խաղը սկսվում է" }
        : { pre: "Player 1", big: `${n} reached level`, ageBig: String(a), sub: "game on" };
    case "roar":
      return hy
        ? { pre: "ՌՌՌՌ!", big: `${hyDef(n)} դառնում է`, ageBig: String(a), sub: "դինո-տոն է" }
        : { pre: "ROAR!", big: `${n} is turning`, ageBig: String(a), sub: "it's a dino party" };
    case "blast":
      return hy
        ? { pre: "3 · 2 · 1", big: `${hyDef(n)} թռչում է դեպի`, ageBig: String(a), sub: "թռիչք դեպի տոն" }
        : { pre: "3 · 2 · 1", big: `${n} is blasting off to`, ageBig: String(a), sub: "join the mission" };
    case "splash":
      return hy
        ? { pre: "Շաղ տուր", big: `${hyDef(n)} դառնում է`, ageBig: String(a), sub: "լողավազանի տոն" }
        : { pre: "Make a splash", big: `${n} is turning`, ageBig: String(a), sub: "pool party" };
    case "sweet":
      return hy
        ? { pre: "Sweet", big: String(a), sub: `${hyGen(n)} տոնը` }
        : { pre: "Sweet", big: String(a), sub: `${n}'s celebration` };
    case "big1":
      return hy
        ? { pre: hyGen(n), big: "1", sub: "առաջին տարեդարձ" }
        : { pre: `${n}'s`, big: "1", sub: "first birthday" };
    case "double": {
      const n2 = second?.name || (hy ? "Անի" : "Ani");
      const a2 = second?.age ?? 4;
      return hy
        ? { pre: "Երկու տոն · մեկ օր", big: `${n} · ${a} և ${n2} · ${a2}`, sub: "համատեղ ծնունդ" }
        : { pre: "Two parties · one day", big: `${n} · ${a} & ${n2} · ${a2}`, sub: "a joint birthday" };
    }
    case "turning":
    default:
      return hy
        ? { big: `${hyDef(n)} դառնում է`, ageBig: String(a), sub: "և մենք տոն ենք անում" }
        : { big: `${n} is turning`, ageBig: String(a), sub: "and we're having a party" };
  }
}

/** Sample children for the catalogue tiles — cycled per design. The name in
 *  each guest language, so a /ru card previews with the Russian spelling. */
export const sampleKids: Array<Record<Lang, string> & { age: number }> = [
  { hy: "Արեն", en: "Aren", ru: "Арен", age: 6 }, { hy: "Մարիա", en: "Maria", ru: "Мария", age: 5 }, { hy: "Դավիթ", en: "Davit", ru: "Давид", age: 7 },
  { hy: "Նարե", en: "Nare", ru: "Наре", age: 4 }, { hy: "Արամ", en: "Aram", ru: "Арам", age: 8 }, { hy: "Լիլիթ", en: "Lilit", ru: "Лилит", age: 3 },
  { hy: "Տիգրան", en: "Tigran", ru: "Тигран", age: 9 }, { hy: "Անի", en: "Ani", ru: "Ани", age: 6 }, { hy: "Հայկ", en: "Hayk", ru: "Айк", age: 10 },
  { hy: "Սոնա", en: "Sona", ru: "Сона", age: 7 }, { hy: "Լևոն", en: "Levon", ru: "Левон", age: 5 }, { hy: "Մանե", en: "Mane", ru: "Мане", age: 8 },
];

// ---------------------------------------------------------------- DESIGNS

const P = (paper: string, ink: string, a: string, b: string, c: string, d: string, env: string, liner: string, backdrop: string, dark = false) =>
  ({ paper, ink, a, b, c, d, env, liner, backdrop, dark }) as Omit<Variant, "id" | "label">;

const v = (id: string, label: T, p: Omit<Variant, "id" | "label">): Variant => ({ id, label, ...p });

const L = {
  cream: { hy: "Կրեմ", en: "Cream" }, mint: { hy: "Անանուխ", en: "Mint" }, blush: { hy: "Վարդագույն", en: "Blush" },
  sky: { hy: "Երկնագույն", en: "Sky" }, yellow: { hy: "Դեղին", en: "Yellow" }, pink: { hy: "Վարդագույն", en: "Pink" },
  rainbow: { hy: "Ծիածան", en: "Rainbow" }, green: { hy: "Կանաչ", en: "Green" }, purple: { hy: "Մանուշակագույն", en: "Purple" },
  lilac: { hy: "Յասամանագույն", en: "Lilac" }, navy: { hy: "Մուգ կապույտ", en: "Navy" }, teal: { hy: "Փիրուզագույն", en: "Teal" },
  red: { hy: "Կարմիր", en: "Red" }, orange: { hy: "Նարնջագույն", en: "Orange" }, blue: { hy: "Կապույտ", en: "Blue" },
  black: { hy: "Սև", en: "Black" }, gold: { hy: "Ոսկեգույն", en: "Gold" }, sand: { hy: "Ավազագույն", en: "Sand" },
  aqua: { hy: "Ջրագույն", en: "Aqua" }, lime: { hy: "Լայմ", en: "Lime" }, peach: { hy: "Դեղձագույն", en: "Peach" },
  white: { hy: "Սպիտակ", en: "White" }, rose: { hy: "Վարդ", en: "Rose" }, coral: { hy: "Մարջան", en: "Coral" },
} satisfies Record<string, T>;

const dotsLiner = (c1: string, c2: string) => `radial-gradient(circle at 6px 6px, ${c2} 2px, transparent 2.5px) 0 0/16px 16px, ${c1}`;
const stripeLiner = (c1: string, c2: string) => `repeating-linear-gradient(135deg, ${c1} 0 10px, ${c2} 10px 20px)`;
const goldLiner = "linear-gradient(135deg, #f1dfa2, #c9a04a 40%, #f6e7b4 55%, #b8893a)";
const glitterLiner = (c: string) => `radial-gradient(circle at 20% 30%, #fff8 0 1px, transparent 2px) 0 0/9px 9px, radial-gradient(circle at 70% 60%, #fff6 0 1px, transparent 2px) 0 0/13px 13px, ${c}`;

const scatterConfetti = (n: number, seed: number, slots: Slot[] = ["a", "b", "c", "d"], w = 300, h = 420, size = 10): Placed[] => {
  // deterministic pseudo-random scatter (a card must render identically on server and client)
  const out: Placed[] = [];
  let x = seed;
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  const kinds: MotifId[] = ["dot", "squiggle", "tri", "star", "dot", "sparkle"];
  for (let i = 0; i < n; i++) {
    out.push({ m: kinds[i % kinds.length], x: 14 + rnd() * (w - 28), y: 14 + rnd() * (h - 28), s: size * (0.6 + rnd() * 0.9), r: rnd() * 360, c: slots[i % slots.length], o: 0.95 });
  }
  return out;
};

export const kidsCards: KidsCard[] = [
  // ------------------------------------------------------------ CAKE & CONFETTI
  {
    id: "cake-confetti",
    name: { hy: "Տորթ և կոնֆետի", en: "Cake & Confetti" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["cake", "balloons"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "none", face: "marker", headline: "turning", layout: "center",
    popular: true,
    tags: ["cake", "տորթ", "confetti", "կոնֆետի", "balloons", "cupcake"],
    motifs: [
      { m: "cakeSlice", x: 52, y: 62, s: 74, r: -8, c: "b", c2: "c" }, { m: "balloon", x: 236, y: 60, s: 46, r: 8, c: "c" }, { m: "balloon", x: 262, y: 84, s: 40, r: -6, c: "d" },
      { m: "layerCake", x: 232, y: 46, s: 44, r: 6, c: "ink", c2: "b" }, { m: "candle", x: 62, y: 158, s: 34, r: -4, c: "a", c2: "d" }, { m: "candle", x: 262, y: 176, s: 30, r: 5, c: "c", c2: "b" },
      { m: "partyHat", x: 46, y: 250, s: 44, r: -12, c: "d", c2: "paper" }, { m: "gift", x: 250, y: 330, s: 46, r: 8, c: "a", c2: "c" }, { m: "cupcake", x: 92, y: 372, s: 62, r: 0, c: "b", c2: "c" },
      { m: "layerCake", x: 172, y: 388, s: 44, r: 0, c: "d", c2: "a" }, { m: "lollipop", x: 32, y: 336, s: 30, r: -20, c: "c" }, { m: "candle", x: 152, y: 42, s: 28, r: 0, c: "d", c2: "a" },
      { m: "cakeSlice", x: 240, y: 262, s: 40, r: 20, c: "a", c2: "d" }, ...scatterConfetti(14, 7, ["a", "b", "c", "d"], 300, 420, 8),
    ],
    variants: [
      v("cream", L.cream, P("#F6EFE0", "#2B241C", "#E96A4A", "#F2B544", "#5FA8A0", "#E85B8F", "#F1E9D6", goldLiner, "#DDEBD8")),
      v("mint", L.mint, P("#E4F1E7", "#1F2A24", "#E96A4A", "#F2B544", "#2F8F86", "#E85B8F", "#F5F0E6", dotsLiner("#F5F0E6", "#9ED0BF"), "#F8E7DA")),
      v("blush", L.blush, P("#FBE7E4", "#33231F", "#D9484F", "#F2B544", "#5FA8A0", "#B04C8E", "#FFF7F3", stripeLiner("#F7B7C0", "#FFF3F0"), "#E5EFF9")),
    ],
  },

  // ------------------------------------------------------------ NEON OUTLINE
  {
    id: "neon-outline",
    name: { hy: "Նեոն ուրվագիծ", en: "Neon Outline" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["neon", "dance"], audience: ["teen", "boy", "girl"], shape: "portrait",
    pattern: "none", border: "neonFrame", face: "neon", headline: "party", layout: "center",
    popular: true,
    tags: ["neon", "նեոն", "glow", "dance", "պար", "teen"],
    motifs: [
      { m: "jumper", x: 60, y: 70, s: 70, r: -10, c: "a" }, { m: "jumper", x: 240, y: 90, s: 62, r: 12, c: "b" }, { m: "note", x: 150, y: 44, s: 40, r: 10, c: "c" },
      { m: "jumper", x: 56, y: 350, s: 66, r: 8, c: "c" }, { m: "jumper", x: 244, y: 340, s: 74, r: -8, c: "d" }, { m: "headphones", x: 150, y: 386, s: 42, r: 0, c: "a" },
      { m: "squiggle", x: 32, y: 200, s: 40, r: 80, c: "b" }, { m: "squiggle", x: 270, y: 210, s: 40, r: -70, c: "c" }, { m: "star", x: 30, y: 30, s: 18, c: "d" }, { m: "star", x: 272, y: 392, s: 18, c: "a" },
    ],
    variants: [
      v("yellow", L.yellow, P("#0D0D10", "#FFFFFF", "#F6E14A", "#3FD1FF", "#FF5FA8", "#7CFF6B", "#F6E14A", "linear-gradient(160deg,#F6E14A,#3FD1FF)", "#1A1A22", true)),
      v("rainbow", L.rainbow, P("#0D0D10", "#FFFFFF", "#FF5FA8", "#F6E14A", "#3FD1FF", "#7CFF6B", "#141418", "linear-gradient(120deg,#FF5FA8,#F6E14A,#7CFF6B,#3FD1FF)", "#1A1A22", true)),
      v("pink", L.pink, P("#120A12", "#FFFFFF", "#FF5FA8", "#FF9BD0", "#C05CFF", "#FFD3EA", "#FF9BD0", glitterLiner("#FF5FA8"), "#221626", true)),
    ],
  },

  // ------------------------------------------------------------ STICKER PARTY
  {
    id: "sticker-party",
    name: { hy: "Ստիկեր փարթի", en: "Sticker Party" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["characters", "rainbows"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "grid", patternSlot: "ink", patternOpacity: 0.12, border: "none", face: "bubble", headline: "invited", layout: "center",
    popular: true,
    tags: ["stickers", "ստիկեր", "smiley", "cherry", "rainbow", "grid"],
    motifs: [
      { m: "smiley", x: 46, y: 46, s: 46, r: -10, c: "b", c2: "ink" }, { m: "cherry", x: 250, y: 50, s: 44, r: 12, c: "a", c2: "d" }, { m: "rainbow", x: 150, y: 46, s: 60, r: 0, c: "c", c2: "b" },
      { m: "cloud", x: 46, y: 130, s: 46, r: 0, c: "paper", c2: "ink" }, { m: "star", x: 258, y: 132, s: 36, r: 15, c: "b" }, { m: "heart", x: 44, y: 300, s: 40, r: -12, c: "a" },
      { m: "flower", x: 258, y: 300, s: 44, r: 0, c: "c", c2: "b" }, { m: "iceCream", x: 44, y: 384, s: 48, r: -6, c: "a", c2: "d" }, { m: "butterfly", x: 256, y: 386, s: 48, r: 8, c: "d", c2: "a" },
      { m: "smiley", x: 150, y: 396, s: 36, r: 6, c: "b", c2: "ink" }, { m: "sparkle", x: 100, y: 96, s: 16, c: "d" }, { m: "sparkle", x: 206, y: 100, s: 14, c: "a" },
    ],
    variants: [
      v("blue", L.blue, P("#CFE6F7", "#22323F", "#FF6B6B", "#FFD23F", "#7BC96F", "#8E7CFF", "#F7B7C0", stripeLiner("#F7B7C0", "#FFF3F0"), "#F7E9DD")),
      v("yellow", L.yellow, P("#FFF1B8", "#3B2E12", "#FF6B6B", "#3FA7D6", "#7BC96F", "#8E7CFF", "#CFE6F7", dotsLiner("#CFE6F7", "#3FA7D6"), "#F5DDE7")),
      v("pink", L.pink, P("#FFDCE9", "#3F1F2E", "#FF6B6B", "#FFD23F", "#7BC96F", "#3FA7D6", "#FFF1B8", dotsLiner("#FFF1B8", "#FFB2C9"), "#DDEFF5")),
    ],
  },

  // ------------------------------------------------------------ HYPE NIGHT
  {
    id: "hype-night",
    name: { hy: "Հայփ երեկո", en: "Hype Night" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["dance", "neon"], audience: ["teen"], milestone: ["teen13", "sweet16"], shape: "landscape",
    pattern: "none", border: "none", face: "outline", headline: "party", layout: "right",
    tags: ["dance", "պար", "teen", "night", "party", "brush"],
    motifs: [
      { m: "splat", x: 96, y: 150, s: 220, r: -12, c: "a", o: 0.95 }, { m: "splat", x: 130, y: 172, s: 150, r: 30, c: "b", o: 0.85 }, { m: "sparkle", x: 40, y: 50, s: 20, c: "c" },
      { m: "sparkle", x: 200, y: 260, s: 16, c: "d" }, { m: "disco", x: 320, y: 44, s: 46, r: 0, c: "d", c2: "paper" }, { m: "note", x: 232, y: 60, s: 30, r: -15, c: "c" },
    ],
    variants: [
      v("purple", L.purple, P("#0B0B0F", "#FFFFFF", "#8E4BFF", "#FF4FA3", "#FFD54A", "#4FD8FF", "#F1B8D6", glitterLiner("#F1B8D6"), "#1C1420", true)),
      v("green", L.green, P("#0B0B0F", "#FFFFFF", "#22C55E", "#A3E635", "#FFD54A", "#4FD8FF", "#D9F99D", glitterLiner("#84CC16"), "#12201A", true)),
      v("rainbow", L.rainbow, P("#0B0B0F", "#FFFFFF", "#FF4FA3", "#FFD54A", "#4FD8FF", "#22C55E", "#FFFFFF", "linear-gradient(120deg,#FF4FA3,#FFD54A,#22C55E,#4FD8FF,#8E4BFF)", "#1C1C22", true)),
    ],
  },

  // ------------------------------------------------------------ ICING (PHOTO)
  {
    id: "icing-photo",
    name: { hy: "Կրեմ տորթի վրա (նկարով)", en: "Icing on the Cake (Photo)" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["photo", "balloons"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "buntingTop", face: "marker", headline: "invited", layout: "bottom",
    photo: { x: 0, y: 0, w: 300, h: 250, shape: "rect" },
    tags: ["photo", "նկար", "bunting", "confetti"],
    motifs: [
      ...scatterConfetti(16, 3, ["a", "b", "c", "d"], 300, 250, 9),
    ],
    variants: [
      v("yellow", L.yellow, P("#F9D24A", "#2B2417", "#FF6B6B", "#3FA7D6", "#7BC96F", "#FFFFFF", "#7BC96F", dotsLiner("#7BC96F", "#F9D24A"), "#F1E9D6")),
      v("pink", L.pink, P("#F9B4C6", "#3A1F2A", "#FF6B6B", "#3FA7D6", "#FFD23F", "#FFFFFF", "#FFF7F0", stripeLiner("#F9B4C6", "#FFF7F0"), "#E2EFF6")),
    ],
  },

  // ------------------------------------------------------------ FLOATING CAKES
  {
    id: "floating-cakes",
    name: { hy: "Թռչող տորթեր", en: "Floating Cakes" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["cake", "balloons"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "none", face: "script", headline: "turning", layout: "center",
    tags: ["cake", "տորթ", "balloon", "փուչիկ", "delicate", "pastel"],
    motifs: [
      { m: "layerCake", x: 44, y: 46, s: 34, c: "b", c2: "a" }, { m: "balloon", x: 128, y: 40, s: 26, c: "c" }, { m: "cupcake", x: 250, y: 44, s: 34, c: "a", c2: "d" },
      { m: "balloon", x: 40, y: 150, s: 24, c: "d" }, { m: "layerCake", x: 262, y: 148, s: 30, c: "c", c2: "b" }, { m: "candle", x: 40, y: 260, s: 22, c: "b", c2: "a" },
      { m: "cupcake", x: 262, y: 262, s: 30, c: "b", c2: "c" }, { m: "layerCake", x: 60, y: 372, s: 34, c: "d", c2: "a" }, { m: "balloon", x: 170, y: 386, s: 26, c: "a" },
      { m: "cakeSlice", x: 250, y: 380, s: 34, r: 12, c: "c", c2: "b" }, ...scatterConfetti(10, 11, ["a", "b", "c", "d"], 300, 420, 5),
    ],
    variants: [
      v("blush", L.blush, P("#FBF3EC", "#3A2A24", "#F0A3B4", "#F6C86B", "#9FD3C7", "#B8A6E6", "#F7C9D2", dotsLiner("#F7C9D2", "#FFFFFF"), "#EAF2EC")),
      v("sky", L.sky, P("#EEF5FB", "#22303B", "#8FC5F0", "#F6C86B", "#F0A3B4", "#9FD3C7", "#DCEBF7", dotsLiner("#DCEBF7", "#FFFFFF"), "#F8EEE6")),
    ],
  },

  // ------------------------------------------------------------ POOL PARTY
  {
    id: "pool-party",
    name: { hy: "Լողավազանի տոն", en: "Pool Party" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["pool", "sports"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "tiles", patternSlot: "b", patternOpacity: 0.55, border: "tileFrame", face: "bubble", headline: "splash", layout: "center",
    popular: true,
    tags: ["pool", "լողավազան", "swim", "summer", "ամառ", "beach ball"],
    motifs: [
      { m: "beachBall", x: 60, y: 60, s: 60, r: 10, c: "a", c2: "c" }, { m: "floatRing", x: 240, y: 70, s: 62, r: 0, c: "c", c2: "paper" }, { m: "sunglasses", x: 150, y: 44, s: 46, r: -6, c: "ink", c2: "b" },
      { m: "wave", x: 150, y: 400, s: 300, r: 0, c: "b", o: 0.9 }, { m: "wave", x: 150, y: 412, s: 300, r: 0, c: "a", o: 0.9 }, { m: "fish", x: 60, y: 350, s: 40, r: -10, c: "d", c2: "paper" },
      { m: "bubble", x: 246, y: 330, s: 26, c: "paper" }, { m: "bubble", x: 264, y: 356, s: 16, c: "paper" }, { m: "sun", x: 262, y: 22, s: 42, c: "d" }, { m: "floatRing", x: 60, y: 300, s: 40, r: 20, c: "d", c2: "paper" },
    ],
    variants: [
      v("blue", L.blue, P("#7CC7EC", "#0F3550", "#F94F6D", "#3B8FCF", "#FFD23F", "#FF8C42", "#F5F0E6", stripeLiner("#7CC7EC", "#FFFFFF"), "#F8EAD8")),
      v("teal", L.teal, P("#79D3C8", "#0E3B37", "#F94F6D", "#2FA39A", "#FFD23F", "#FF8C42", "#FFF4D6", stripeLiner("#79D3C8", "#FFFFFF"), "#F3E4EC")),
    ],
  },

  // ------------------------------------------------------------ CHARMS
  {
    id: "friendship-charms",
    name: { hy: "Ընկերության կախազարդեր", en: "Friendship Charms" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["arts", "characters"], audience: ["girl", "teen"], shape: "portrait",
    pattern: "none", border: "none", face: "round", headline: "invited", layout: "bottom",
    tags: ["charms", "beads", "ուլունք", "bracelet", "friendship", "teen"],
    motifs: [
      { m: "streamer", x: 150, y: 90, s: 280, r: 0, c: "d", o: 0.9 }, { m: "heart", x: 62, y: 74, s: 30, r: -14, c: "a" }, { m: "star", x: 118, y: 104, s: 30, r: 10, c: "b" },
      { m: "cherry", x: 176, y: 78, s: 34, r: 8, c: "a", c2: "c" }, { m: "smiley", x: 232, y: 106, s: 32, r: -8, c: "b", c2: "ink" }, { m: "flower", x: 44, y: 172, s: 40, c: "c", c2: "b" },
      { m: "butterfly", x: 256, y: 190, s: 44, r: 10, c: "d", c2: "a" }, { m: "mushroom", x: 40, y: 250, s: 36, c: "a", c2: "paper" }, { m: "bee", x: 262, y: 270, s: 34, r: -12, c: "b", c2: "ink" },
      { m: "dot", x: 90, y: 88, s: 10, c: "c" }, { m: "dot", x: 148, y: 96, s: 10, c: "d" }, { m: "dot", x: 204, y: 92, s: 10, c: "a" }, { m: "sparkle", x: 150, y: 150, s: 16, c: "b" },
    ],
    variants: [
      v("yellow", L.yellow, P("#FBF1C7", "#3B2E12", "#F26D8D", "#F4B942", "#7DBB6D", "#7BA6F0", "#FDE68A", dotsLiner("#FDE68A", "#F26D8D"), "#E9EEF8")),
      v("lilac", L.lilac, P("#EEE6FA", "#2E2340", "#F26D8D", "#F4B942", "#7DBB6D", "#9B7BEA", "#D9CCF5", dotsLiner("#D9CCF5", "#FFFFFF"), "#F8EEE6")),
    ],
  },

  // ------------------------------------------------------------ PARTY HAT (PHOTO)
  {
    id: "party-hat-photo",
    name: { hy: "Տոնական գլխարկ (նկարով)", en: "Party Hat (Photo)" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["photo", "balloons"], audience: ["girl", "boy"], milestone: ["first"], shape: "portrait",
    pattern: "none", border: "none", face: "serif", headline: "big1", layout: "bottom",
    photo: { x: 150, y: 150, w: 130, h: 160, shape: "oval" },
    popular: true,
    tags: ["photo", "նկար", "hat", "գլխարկ", "first", "առաջին", "1"],
    motifs: [
      { m: "partyHat", x: 150, y: 58, s: 92, r: 12, c: "a", c2: "paper" }, { m: "sparkle", x: 76, y: 90, s: 14, c: "b" }, { m: "sparkle", x: 224, y: 100, s: 12, c: "b" },
    ],
    variants: [
      v("blue", L.blue, P("#FFFFFF", "#1E2A3A", "#2F6BD1", "#F2B544", "#E96A4A", "#5FA8A0", "#F5F0E6", stripeLiner("#E63946", "#FFFFFF"), "#EAF0F7")),
      v("pink", L.pink, P("#FFFFFF", "#3A1F2A", "#E85B8F", "#F2B544", "#5FA8A0", "#8E7CFF", "#FDE2EA", stripeLiner("#E85B8F", "#FFFFFF"), "#EAF5EE")),
      v("green", L.green, P("#FFFFFF", "#1E2A24", "#2F9E63", "#F2B544", "#E96A4A", "#8E7CFF", "#E3F3E8", stripeLiner("#2F9E63", "#FFFFFF"), "#F8EEE6")),
    ],
  },

  // ------------------------------------------------------------ SPORTY FRAME
  {
    id: "sporty-frame",
    name: { hy: "Սպորտային շրջանակ", en: "Sporty Frame" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["sports"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "none", border: "none", face: "marker", headline: "join", layout: "center",
    tags: ["sports", "սպորտ", "football", "ֆուտբոլ", "basketball", "tennis", "ball"],
    motifs: [
      { m: "soccer", x: 40, y: 40, s: 48, r: 10, c: "ink", c2: "paper" }, { m: "basketball", x: 150, y: 34, s: 44, r: -10, c: "d", c2: "ink" }, { m: "tennis", x: 260, y: 42, s: 40, r: 0, c: "c", c2: "paper" },
      { m: "trophy", x: 42, y: 150, s: 44, c: "b", c2: "a" }, { m: "medal", x: 258, y: 150, s: 40, c: "b", c2: "a" }, { m: "soccer", x: 260, y: 270, s: 40, r: -14, c: "ink", c2: "paper" },
      { m: "basketball", x: 40, y: 270, s: 40, r: 12, c: "d", c2: "ink" }, { m: "tennis", x: 42, y: 380, s: 38, c: "c", c2: "paper" }, { m: "trophy", x: 150, y: 386, s: 40, c: "b", c2: "a" },
      { m: "soccer", x: 258, y: 380, s: 42, r: 8, c: "ink", c2: "paper" }, { m: "star", x: 96, y: 78, s: 14, c: "b" }, { m: "star", x: 206, y: 84, s: 14, c: "b" },
    ],
    variants: [
      v("cream", L.cream, P("#F6F0E4", "#1F2A24", "#2F7D4F", "#F2B544", "#9BD35E", "#E9772F", "#2F7D4F", dotsLiner("#2F7D4F", "#F6F0E4"), "#E4EEF7")),
      v("green", L.green, P("#DFF0DA", "#1F2A24", "#1F6B3E", "#F2B544", "#9BD35E", "#E9772F", "#F6F0E4", stripeLiner("#1F6B3E", "#F6F0E4"), "#F8EAD8")),
    ],
  },

  // ------------------------------------------------------------ THE LITTLES
  {
    id: "the-littles",
    name: { hy: "Փոքրիկները", en: "The Littles" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["arts", "balloons"], audience: ["girl", "boy"], shape: "scallop",
    pattern: "none", border: "scallopFrame", face: "bubble", headline: "party", layout: "center",
    tags: ["play", "խաղ", "letters", "wavy", "scallop", "little"],
    motifs: [
      { m: "kite", x: 60, y: 64, s: 60, r: -12, c: "a", c2: "b" }, { m: "drum", x: 250, y: 66, s: 56, r: 8, c: "c", c2: "d" }, { m: "balloon", x: 44, y: 250, s: 44, r: -6, c: "b" },
      { m: "star", x: 262, y: 246, s: 34, r: 12, c: "d" }, { m: "streamer", x: 150, y: 288, s: 200, r: 6, c: "a", o: 0.9 }, { m: "smiley", x: 150, y: 46, s: 34, c: "b", c2: "ink" },
      ...scatterConfetti(8, 21, ["a", "b", "c", "d"], 320, 320, 7),
    ],
    variants: [
      v("blue", L.blue, P("#FFF9F0", "#26303F", "#3B6BD6", "#F04E7A", "#F5B935", "#3BB273", "#F7C9D2", "#F0F0F0", "#EAF0F7")),
      v("pink", L.pink, P("#FFF6F8", "#3A1F2A", "#F04E7A", "#3B6BD6", "#F5B935", "#3BB273", "#D6E8FA", "#F0F0F0", "#F8F0E6")),
    ],
  },

  // ------------------------------------------------------------ DINO ROAR
  {
    id: "dino-roar",
    name: { hy: "Դինո ՌՌՌ", en: "Dino Roar" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["dinos", "animals"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "none", border: "leafFrame", face: "marker", headline: "roar", layout: "center",
    popular: true,
    tags: ["dino", "դինոզավր", "roar", "egg", "footprint", "jurassic"],
    motifs: [
      { m: "dino", x: 84, y: 82, s: 120, r: 0, c: "b", c2: "c" }, { m: "dino", x: 226, y: 350, s: 110, r: 0, c: "d", c2: "b" }, { m: "dinoEgg", x: 250, y: 74, s: 46, r: 8, c: "paper", c2: "c" },
      { m: "footprint", x: 40, y: 200, s: 26, r: -20, c: "ink", o: 0.6 }, { m: "footprint", x: 70, y: 232, s: 26, r: -20, c: "ink", o: 0.6 }, { m: "footprint", x: 100, y: 264, s: 26, r: -20, c: "ink", o: 0.6 },
      { m: "leaf", x: 42, y: 380, s: 60, r: 20, c: "c" }, { m: "leaf", x: 262, y: 200, s: 54, r: -30, c: "c" }, { m: "dinoEgg", x: 62, y: 330, s: 40, r: -10, c: "paper", c2: "b" },
      { m: "star", x: 150, y: 400, s: 16, c: "d" },
    ],
    variants: [
      v("green", L.green, P("#DFEBC9", "#1F3A1F", "#5B8C3A", "#3E7C47", "#8FBF5A", "#F0A030", "#F6E7B4", dotsLiner("#F6E7B4", "#8FBF5A"), "#F5E6D3")),
      v("orange", L.orange, P("#FBE3C4", "#3A2412", "#E5793B", "#3E7C47", "#8FBF5A", "#2F6BD1", "#8FBF5A", dotsLiner("#8FBF5A", "#FBE3C4"), "#E1EFF6")),
      v("blue", L.blue, P("#D6E9F5", "#1B2E42", "#2F6BD1", "#3E7C47", "#8FBF5A", "#E5793B", "#F6E7B4", stripeLiner("#2F6BD1", "#D6E9F5"), "#F8EEE6")),
    ],
  },

  // ------------------------------------------------------------ UNICORN LEAP
  {
    id: "unicorn-leap",
    name: { hy: "Միաեղջյուրի թռիչք", en: "Unicorn Leap" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["unicorns", "rainbows", "magic"], audience: ["girl"], shape: "portrait",
    pattern: "stars", patternSlot: "d", patternOpacity: 0.5, border: "none", face: "script", headline: "invited", layout: "bottom",
    popular: true,
    tags: ["unicorn", "միաեղջյուր", "rainbow", "ծիածան", "magic", "stars"],
    motifs: [
      { m: "rainbow", x: 150, y: 150, s: 220, r: 0, c: "a", c2: "b" }, { m: "unicorn", x: 150, y: 116, s: 120, r: -8, c: "paper", c2: "c" }, { m: "cloud", x: 46, y: 176, s: 60, c: "paper", c2: "paper" },
      { m: "cloud", x: 256, y: 178, s: 60, c: "paper", c2: "paper" }, { m: "sparkle", x: 60, y: 60, s: 20, c: "d" }, { m: "sparkle", x: 240, y: 50, s: 16, c: "c" }, { m: "star", x: 30, y: 110, s: 16, c: "b" },
      { m: "star", x: 272, y: 100, s: 18, c: "a" }, { m: "heart", x: 44, y: 260, s: 20, c: "a" }, { m: "heart", x: 258, y: 262, s: 18, c: "c" },
    ],
    variants: [
      v("pink", L.pink, P("#FBE4EE", "#3F2237", "#F26D8D", "#F4B942", "#7BC8E8", "#B08CF0", "#F7C9DA", glitterLiner("#F7C9DA"), "#EAF2F8")),
      v("lilac", L.lilac, P("#EDE4FA", "#2E2340", "#B08CF0", "#F26D8D", "#F4B942", "#7BC8E8", "#DCCBF6", glitterLiner("#DCCBF6"), "#FBEEE4")),
      v("mint", L.mint, P("#E1F4EC", "#1F3A2E", "#4FB89A", "#F26D8D", "#F4B942", "#B08CF0", "#CFEFE2", glitterLiner("#CFEFE2"), "#F8E7EE")),
    ],
  },

  // ------------------------------------------------------------ SPACE BLAST
  {
    id: "space-blast",
    name: { hy: "Տիեզերական թռիչք", en: "Space Blast" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["space"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "stars", patternSlot: "paper", patternOpacity: 0.7, border: "none", face: "marker", headline: "blast", layout: "center",
    popular: true,
    tags: ["space", "տիեզերք", "rocket", "հրթիռ", "planet", "moon", "stars"],
    motifs: [
      { m: "rocket", x: 70, y: 84, s: 100, r: -30, c: "a", c2: "b" }, { m: "planet", x: 244, y: 74, s: 74, r: -14, c: "c", c2: "d" }, { m: "moon", x: 44, y: 250, s: 44, c: "b" },
      { m: "ufo", x: 250, y: 250, s: 60, c: "d", c2: "a" }, { m: "planet", x: 60, y: 372, s: 50, r: 10, c: "b", c2: "c" }, { m: "rocket", x: 236, y: 372, s: 70, r: 20, c: "c", c2: "b" },
      { m: "star", x: 150, y: 40, s: 18, c: "b" }, { m: "sparkle", x: 130, y: 400, s: 16, c: "paper" }, { m: "sparkle", x: 180, y: 90, s: 12, c: "paper" },
    ],
    variants: [
      v("navy", L.navy, P("#0F1B3D", "#FFFFFF", "#F26D5B", "#F4C542", "#4FB3E8", "#B08CF0", "#F4C542", "linear-gradient(135deg,#0F1B3D,#2A3F8F)", "#1A2247", true)),
      v("purple", L.purple, P("#1E1038", "#FFFFFF", "#F26D5B", "#F4C542", "#4FB3E8", "#F26D8D", "#B08CF0", "linear-gradient(135deg,#1E1038,#5B2E9E)", "#241640", true)),
      v("teal", L.teal, P("#0B2E33", "#FFFFFF", "#F26D5B", "#F4C542", "#4FB3E8", "#7CE0C3", "#7CE0C3", "linear-gradient(135deg,#0B2E33,#1F6F6B)", "#123A40", true)),
    ],
  },

  // ------------------------------------------------------------ MERMAID TAIL
  {
    id: "mermaid-tail",
    name: { hy: "Ջրահարսի պոչ", en: "Mermaid Tail" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["mermaid", "pool"], audience: ["girl"], shape: "portrait",
    pattern: "scales", patternSlot: "b", patternOpacity: 0.55, border: "none", face: "script", headline: "invited", layout: "top",
    tags: ["mermaid", "ջրահարս", "sea", "ծով", "shell", "bubbles", "under the sea"],
    motifs: [
      { m: "tail", x: 150, y: 330, s: 150, r: 0, c: "c", c2: "d" }, { m: "shell", x: 50, y: 250, s: 48, r: -10, c: "a", c2: "paper" }, { m: "shell", x: 252, y: 250, s: 44, r: 12, c: "d", c2: "paper" },
      { m: "bubble", x: 60, y: 340, s: 26, c: "paper" }, { m: "bubble", x: 40, y: 380, s: 18, c: "paper" }, { m: "bubble", x: 250, y: 350, s: 22, c: "paper" }, { m: "bubble", x: 272, y: 384, s: 14, c: "paper" },
      { m: "fish", x: 60, y: 200, s: 36, r: 10, c: "b", c2: "paper" }, { m: "fish", x: 246, y: 196, s: 32, r: -170, c: "a", c2: "paper" }, { m: "sparkle", x: 150, y: 214, s: 16, c: "paper" },
    ],
    variants: [
      v("aqua", L.aqua, P("#BFE7EA", "#0F3B44", "#F08FA8", "#5CB8C9", "#2F8FA6", "#B08CF0", "#F08FA8", "linear-gradient(135deg,#BFE7EA,#5CB8C9,#B08CF0)", "#FBEDE6")),
      v("lilac", L.lilac, P("#E4DBF6", "#2E2340", "#F08FA8", "#B08CF0", "#7A5FD0", "#5CB8C9", "#CFEFF0", "linear-gradient(135deg,#E4DBF6,#B08CF0,#5CB8C9)", "#EAF6F2")),
    ],
  },

  // ------------------------------------------------------------ WILD SAFARI
  {
    id: "wild-safari",
    name: { hy: "Վայրի սաֆարի", en: "Wild Safari" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["jungle", "animals"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "none", border: "leafFrame", face: "marker", headline: "party", layout: "center",
    tags: ["safari", "սաֆարի", "jungle", "ջունգլի", "lion", "առյուծ", "giraffe", "monkey"],
    motifs: [
      { m: "lion", x: 70, y: 84, s: 84, c: "b", c2: "a" }, { m: "giraffe", x: 236, y: 92, s: 96, c: "b", c2: "ink" }, { m: "monkey", x: 62, y: 344, s: 72, c: "d", c2: "paper" },
      { m: "leaf", x: 250, y: 344, s: 74, r: -20, c: "c" }, { m: "leaf", x: 150, y: 400, s: 50, r: 30, c: "a", o: 0.9 }, { m: "sun", x: 150, y: 44, s: 40, c: "b" },
      { m: "paw", x: 40, y: 220, s: 20, r: 20, c: "ink", o: 0.5 }, { m: "paw", x: 262, y: 226, s: 20, r: -20, c: "ink", o: 0.5 },
    ],
    variants: [
      v("green", L.green, P("#E7EDD3", "#26321C", "#3E7C47", "#E9A63A", "#6DA35A", "#B5651D", "#E9A63A", stripeLiner("#E9A63A", "#F6E7B4"), "#F5E6D3")),
      v("sand", L.sand, P("#F3E4C6", "#3B2A14", "#3E7C47", "#D98B2B", "#8DAF5A", "#7A4A1D", "#3E7C47", dotsLiner("#3E7C47", "#F3E4C6"), "#E1EEF6")),
    ],
  },

  // ------------------------------------------------------------ FARM FRIENDS
  {
    id: "farm-friends",
    name: { hy: "Ֆերմայի ընկերներ", en: "Farm Friends" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["farm", "animals"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "none", border: "none", face: "round", headline: "join", layout: "center",
    tags: ["farm", "ֆերմա", "barn", "tractor", "տրակտոր", "cow", "կով", "pig", "chick"],
    motifs: [
      { m: "sun", x: 46, y: 40, s: 44, c: "b" }, { m: "cloud", x: 200, y: 44, s: 60, c: "paper", c2: "paper" }, { m: "barn", x: 80, y: 110, s: 100, c: "a", c2: "paper" },
      { m: "tractor", x: 232, y: 124, s: 88, c: "c", c2: "ink" }, { m: "cow", x: 54, y: 340, s: 62, c: "paper", c2: "ink" }, { m: "pig", x: 150, y: 384, s: 52, c: "d", c2: "ink" },
      { m: "chick", x: 246, y: 344, s: 50, c: "b", c2: "a" }, { m: "flower", x: 40, y: 250, s: 24, c: "d", c2: "b" }, { m: "flower", x: 262, y: 260, s: 22, c: "a", c2: "b" },
    ],
    variants: [
      v("sky", L.sky, P("#DDEFF8", "#23313A", "#C8443B", "#F2B544", "#3E7C47", "#F0A3B4", "#C8443B", stripeLiner("#C8443B", "#FFFFFF"), "#F4EBDD")),
      v("yellow", L.yellow, P("#FBF0C4", "#3B2E12", "#C8443B", "#E9A63A", "#3E7C47", "#F0A3B4", "#3E7C47", dotsLiner("#3E7C47", "#FBF0C4"), "#E5EFF9")),
    ],
  },

  // ------------------------------------------------------------ RACE DAY
  {
    id: "race-day",
    name: { hy: "Մրցարշավի օր", en: "Race Day" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["cars", "sports"], audience: ["boy"], shape: "landscape",
    pattern: "none", border: "checkerBand", face: "marker", headline: "join", layout: "left",
    tags: ["race", "մրցարշավ", "car", "մեքենա", "flag", "fast", "checkered"],
    motifs: [
      { m: "raceCar", x: 300, y: 150, s: 170, r: 0, c: "a", c2: "ink" }, { m: "flag", x: 386, y: 60, s: 60, r: 10, c: "ink", c2: "paper" }, { m: "cone", x: 226, y: 226, s: 40, c: "b", c2: "paper" },
      { m: "trophy", x: 388, y: 224, s: 46, c: "b", c2: "a" }, { m: "star", x: 236, y: 60, s: 20, c: "b" }, { m: "streamer", x: 300, y: 92, s: 120, r: 0, c: "c", o: 0.7 },
    ],
    variants: [
      v("red", L.red, P("#F6F1E6", "#1B1B1F", "#D93A2F", "#F2B544", "#2F6BD1", "#3BB273", "#1B1B1F", "repeating-conic-gradient(#1B1B1F 0 25%, #FFFFFF 0 50%) 0 0/20px 20px", "#E7EEF6")),
      v("blue", L.blue, P("#F6F1E6", "#1B1B1F", "#2F6BD1", "#F2B544", "#D93A2F", "#3BB273", "#2F6BD1", "repeating-conic-gradient(#1B1B1F 0 25%, #FFFFFF 0 50%) 0 0/20px 20px", "#F8EAD8")),
      v("yellow", L.yellow, P("#F6F1E6", "#1B1B1F", "#F2B544", "#D93A2F", "#2F6BD1", "#3BB273", "#F2B544", "repeating-conic-gradient(#1B1B1F 0 25%, #FFFFFF 0 50%) 0 0/20px 20px", "#E4EEF7")),
    ],
  },

  // ------------------------------------------------------------ CONSTRUCTION ZONE
  {
    id: "construction-zone",
    name: { hy: "Շինհրապարակ", en: "Construction Zone" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["cars"], audience: ["boy"], shape: "portrait",
    pattern: "none", border: "hazard", face: "marker", headline: "invited", layout: "center",
    tags: ["construction", "շինարարություն", "truck", "բեռնատար", "digger", "cone", "hazard"],
    motifs: [
      { m: "truck", x: 150, y: 90, s: 150, c: "a", c2: "ink" }, { m: "cone", x: 46, y: 350, s: 46, c: "a", c2: "paper" }, { m: "cone", x: 254, y: 350, s: 46, c: "a", c2: "paper" },
      { m: "gift", x: 150, y: 386, s: 40, c: "b", c2: "ink" }, { m: "star", x: 44, y: 130, s: 16, c: "b" }, { m: "star", x: 256, y: 128, s: 16, c: "b" },
    ],
    variants: [
      v("yellow", L.yellow, P("#F8D24A", "#1F1B12", "#F28C1E", "#2F6BD1", "#3BB273", "#D93A2F", "#1F1B12", "repeating-linear-gradient(135deg,#F8D24A 0 12px,#1F1B12 12px 24px)", "#EEEDE7")),
      v("orange", L.orange, P("#F7A44A", "#1F1B12", "#D93A2F", "#2F6BD1", "#3BB273", "#F8D24A", "#1F1B12", "repeating-linear-gradient(135deg,#F7A44A 0 12px,#1F1B12 12px 24px)", "#E7EEF6")),
    ],
  },

  // ------------------------------------------------------------ LEVEL UP
  {
    id: "level-up",
    name: { hy: "Level Up", en: "Level Up" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["gaming", "neon"], audience: ["boy", "teen", "girl"], shape: "portrait",
    pattern: "pixels", patternSlot: "a", patternOpacity: 0.16, border: "doubleRule", face: "pixel", headline: "level", layout: "center",
    popular: true,
    tags: ["gaming", "խաղ", "video game", "pixel", "level", "controller", "gamer"],
    motifs: [
      { m: "gamepad", x: 150, y: 90, s: 130, c: "a", c2: "paper" }, { m: "pixelHeart", x: 50, y: 60, s: 32, c: "b" }, { m: "pixelHeart", x: 250, y: 60, s: 32, c: "b" },
      { m: "controllerPixel", x: 46, y: 350, s: 44, c: "c" }, { m: "controllerPixel", x: 254, y: 350, s: 44, c: "c" }, { m: "star", x: 150, y: 396, s: 22, c: "d" },
      { m: "pixelHeart", x: 150, y: 176, s: 18, c: "b" }, { m: "pixelHeart", x: 174, y: 176, s: 18, c: "b" }, { m: "pixelHeart", x: 126, y: 176, s: 18, c: "b" },
    ],
    variants: [
      v("green-black", { hy: "Կանաչ-սև", en: "Green & black" }, P("#0B0F0C", "#E9FFE9", "#39FF6A", "#FF4F81", "#3FD1FF", "#FFD23F", "#39FF6A", "repeating-linear-gradient(0deg,#0B0F0C 0 6px,#39FF6A 6px 8px)", "#151A16", true)),
      v("white-green", { hy: "Սպիտակ-կանաչ", en: "White & green" }, P("#F4F7F2", "#0F1F12", "#1DB954", "#FF4F81", "#2F6BD1", "#FFD23F", "#1DB954", "repeating-linear-gradient(0deg,#F4F7F2 0 6px,#1DB954 6px 8px)", "#E7EEF6")),
      v("purple", L.purple, P("#150F26", "#F3ECFF", "#B06BFF", "#FF4F81", "#3FD1FF", "#FFD23F", "#B06BFF", "repeating-linear-gradient(0deg,#150F26 0 6px,#B06BFF 6px 8px)", "#1D1630", true)),
    ],
  },

  // ------------------------------------------------------------ SUPER POW
  {
    id: "super-pow",
    name: { hy: "Սուպեր ՊԱՈՒ", en: "Super POW" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["superheroes", "characters"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "halftone", patternSlot: "b", patternOpacity: 0.35, border: "none", face: "marker", headline: "invited", layout: "center",
    popular: true,
    tags: ["superhero", "սուպերհերոս", "comic", "pow", "hero", "mask", "bolt"],
    motifs: [
      { m: "burst", x: 150, y: 96, s: 190, r: -6, c: "b", c2: "a" }, { m: "mask", x: 150, y: 96, s: 90, c: "ink", c2: "paper" }, { m: "bolt", x: 44, y: 250, s: 44, r: 12, c: "b" },
      { m: "bolt", x: 258, y: 250, s: 40, r: -14, c: "b" }, { m: "star", x: 44, y: 60, s: 20, c: "paper" }, { m: "star", x: 258, y: 56, s: 22, c: "paper" }, { m: "burst", x: 60, y: 372, s: 70, r: 12, c: "d", c2: "paper" },
      { m: "burst", x: 240, y: 372, s: 70, r: -12, c: "c", c2: "paper" },
    ],
    variants: [
      v("blue", L.blue, P("#3B8FE0", "#141824", "#D93A2F", "#FFD23F", "#3BB273", "#F28C1E", "#D93A2F", dotsLiner("#D93A2F", "#FFD23F"), "#F1EBDD")),
      v("red", L.red, P("#E4463C", "#1B1418", "#2F6BD1", "#FFD23F", "#3BB273", "#F28C1E", "#2F6BD1", dotsLiner("#2F6BD1", "#FFD23F"), "#EAF0F7")),
      v("yellow", L.yellow, P("#F8D24A", "#1F1B12", "#D93A2F", "#2F6BD1", "#3BB273", "#8E4BFF", "#D93A2F", dotsLiner("#D93A2F", "#F8D24A"), "#E7EEF6")),
    ],
  },

  // ------------------------------------------------------------ NINJA NIGHT
  {
    id: "ninja-night",
    name: { hy: "Նինձյա գիշեր", en: "Ninja Night" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["ninjas", "sports"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "none", border: "doubleRule", face: "marker", headline: "invited", layout: "center",
    tags: ["ninja", "նինձյա", "shuriken", "bamboo", "karate", "dojo"],
    motifs: [
      { m: "ninja", x: 150, y: 96, s: 110, c: "ink", c2: "a" }, { m: "shuriken", x: 50, y: 60, s: 44, r: 20, c: "paper" }, { m: "shuriken", x: 250, y: 64, s: 40, r: -10, c: "paper" },
      { m: "bamboo", x: 34, y: 300, s: 110, c: "b" }, { m: "bamboo", x: 266, y: 300, s: 110, c: "b" }, { m: "shuriken", x: 150, y: 396, s: 30, r: 45, c: "a" }, { m: "moon", x: 236, y: 156, s: 40, c: "c" },
    ],
    variants: [
      v("black-red", { hy: "Սև-կարմիր", en: "Black & red" }, P("#15161A", "#F4F0E8", "#D93A2F", "#3BB273", "#F4C542", "#F4F0E8", "#D93A2F", stripeLiner("#15161A", "#D93A2F"), "#232428", true)),
      v("black-green", { hy: "Սև-կանաչ", en: "Black & green" }, P("#141A16", "#F4F0E8", "#3BB273", "#8FBF5A", "#F4C542", "#F4F0E8", "#3BB273", stripeLiner("#141A16", "#3BB273"), "#22282A", true)),
    ],
  },

  // ------------------------------------------------------------ ROYAL COURT
  {
    id: "royal-court",
    name: { hy: "Արքայական պալատ", en: "Royal Court" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["princess", "magic"], audience: ["girl"], shape: "arch",
    pattern: "hearts", patternSlot: "b", patternOpacity: 0.3, border: "none", face: "serif", headline: "invited", layout: "center",
    tags: ["princess", "արքայադուստր", "crown", "թագ", "castle", "royal", "fairy tale"],
    motifs: [
      { m: "castle", x: 150, y: 90, s: 150, c: "a", c2: "b" }, { m: "crown", x: 52, y: 250, s: 44, r: -10, c: "b", c2: "a" }, { m: "wand", x: 250, y: 250, s: 48, r: 20, c: "b", c2: "c" },
      { m: "heart", x: 44, y: 372, s: 26, c: "c" }, { m: "heart", x: 258, y: 372, s: 26, c: "c" }, { m: "sparkle", x: 60, y: 60, s: 18, c: "b" }, { m: "sparkle", x: 240, y: 56, s: 16, c: "b" },
    ],
    variants: [
      v("pink", L.pink, P("#FBE4EE", "#3F2237", "#E85B8F", "#D4AF37", "#B08CF0", "#F4B942", "#F7C9DA", goldLiner, "#EAF2F8")),
      v("lilac", L.lilac, P("#EDE4FA", "#2E2340", "#8E6BE0", "#D4AF37", "#E85B8F", "#7BC8E8", "#DCCBF6", goldLiner, "#FBEEE4")),
      v("gold", L.gold, P("#FBF3DF", "#3B2E12", "#C9962B", "#E85B8F", "#B08CF0", "#7BC8E8", "#F6E7B4", goldLiner, "#EAF0F7")),
    ],
  },

  // ------------------------------------------------------------ ENCHANTED FOREST
  {
    id: "enchanted-forest",
    name: { hy: "Կախարդական անտառ", en: "Enchanted Forest" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["princess", "magic", "animals"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "none", face: "script", headline: "join", layout: "center",
    tags: ["fairy", "փերի", "forest", "անտառ", "mushroom", "butterfly", "magic"],
    motifs: [
      { m: "mushroom", x: 60, y: 90, s: 74, c: "a", c2: "paper" }, { m: "butterfly", x: 240, y: 70, s: 64, r: 10, c: "d", c2: "b" }, { m: "moon", x: 150, y: 40, s: 40, c: "b" },
      { m: "flower", x: 46, y: 250, s: 40, c: "c", c2: "b" }, { m: "rabbit", x: 250, y: 260, s: 58, c: "paper", c2: "a" }, { m: "mushroom", x: 250, y: 380, s: 56, c: "a", c2: "paper" },
      { m: "leaf", x: 50, y: 380, s: 60, r: 30, c: "c" }, { m: "sparkle", x: 100, y: 200, s: 16, c: "b" }, { m: "sparkle", x: 200, y: 210, s: 14, c: "b" }, { m: "bee", x: 150, y: 396, s: 30, r: -10, c: "b", c2: "ink" },
    ],
    variants: [
      v("green", L.green, P("#E3EEDD", "#22301F", "#D9484F", "#F4B942", "#3E7C47", "#B08CF0", "#3E7C47", dotsLiner("#3E7C47", "#E3EEDD"), "#F8EAD8")),
      v("lilac", L.lilac, P("#EDE4FA", "#2E2340", "#D9484F", "#F4B942", "#4FB89A", "#8E6BE0", "#DCCBF6", glitterLiner("#DCCBF6"), "#E9F3EA")),
    ],
  },

  // ------------------------------------------------------------ MAGIC SHOW
  {
    id: "magic-show",
    name: { hy: "Կախարդական շոու", en: "Magic Show" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["magic"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "stars", patternSlot: "b", patternOpacity: 0.35, border: "doubleRule", face: "serif", headline: "invited", layout: "center",
    tags: ["magic", "կախարդանք", "magician", "hat", "wand", "cards", "abracadabra"],
    motifs: [
      { m: "topHat", x: 150, y: 90, s: 110, c: "ink", c2: "a" }, { m: "rabbit", x: 150, y: 60, s: 60, c: "paper", c2: "b" }, { m: "wand", x: 50, y: 250, s: 50, r: -30, c: "ink", c2: "b" },
      { m: "playingCard", x: 250, y: 250, s: 50, r: 14, c: "paper", c2: "a" }, { m: "playingCard", x: 236, y: 262, s: 50, r: -6, c: "paper", c2: "ink" }, { m: "sparkle", x: 60, y: 60, s: 20, c: "b" },
      { m: "sparkle", x: 240, y: 56, s: 18, c: "b" }, { m: "star", x: 44, y: 380, s: 22, c: "b" }, { m: "star", x: 258, y: 384, s: 20, c: "b" },
    ],
    variants: [
      v("purple", L.purple, P("#2A1650", "#F7F0FF", "#D9484F", "#F4C542", "#8E6BE0", "#4FB3E8", "#F4C542", goldLiner, "#33205E", true)),
      v("black-gold", { hy: "Սև-ոսկի", en: "Black & gold" }, P("#121014", "#F7F0E6", "#D9484F", "#D4AF37", "#8E6BE0", "#4FB3E8", "#D4AF37", goldLiner, "#1E1B20", true)),
    ],
  },

  // ------------------------------------------------------------ RAINBOW PARTY
  {
    id: "rainbow-party",
    name: { hy: "Ծիածանի տոն", en: "Rainbow Party" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["rainbows", "balloons"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "fringeBottom", face: "bubble", headline: "turning", layout: "center",
    tags: ["rainbow", "ծիածան", "tinsel", "fringe", "cloud", "colorful"],
    motifs: [
      { m: "rainbow", x: 150, y: 96, s: 260, c: "a", c2: "b" }, { m: "cloud", x: 40, y: 122, s: 64, c: "paper", c2: "paper" }, { m: "cloud", x: 260, y: 122, s: 64, c: "paper", c2: "paper" },
      { m: "sun", x: 150, y: 20, s: 40, c: "b" }, { m: "balloon", x: 44, y: 260, s: 40, c: "c" }, { m: "balloon", x: 258, y: 262, s: 40, c: "d" }, ...scatterConfetti(10, 5, ["a", "b", "c", "d"], 300, 300, 7),
    ],
    variants: [
      v("pastel", { hy: "Պաստել", en: "Pastel" }, P("#FFFFFF", "#33303B", "#F7A6B8", "#F9D26B", "#9ED0BF", "#A9C7F5", "#F7A6B8", "linear-gradient(90deg,#F7A6B8,#F9D26B,#9ED0BF,#A9C7F5,#C9B3F0)", "#F4EEE6")),
      v("bright", { hy: "Վառ", en: "Bright" }, P("#FFFFFF", "#22202B", "#FF4F6D", "#FFC93F", "#3BB273", "#3B8FE0", "#FFC93F", "linear-gradient(90deg,#FF4F6D,#FFC93F,#3BB273,#3B8FE0,#8E4BFF)", "#E7EEF6")),
    ],
  },

  // ------------------------------------------------------------ BALLOON POP
  {
    id: "balloon-pop",
    name: { hy: "Փուչիկների փարթի", en: "Balloon Pop" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["balloons"], audience: ["girl", "boy"], milestone: ["first"], shape: "portrait",
    pattern: "dots", patternSlot: "a", patternOpacity: 0.18, border: "none", face: "round", headline: "turning", layout: "bottom",
    popular: true,
    tags: ["balloons", "փուչիկ", "confetti", "simple", "party"],
    motifs: [
      { m: "balloon", x: 100, y: 96, s: 90, r: -8, c: "a" }, { m: "balloon", x: 170, y: 76, s: 96, r: 4, c: "b" }, { m: "balloon", x: 224, y: 110, s: 84, r: 12, c: "c" },
      { m: "balloon", x: 60, y: 140, s: 70, r: -14, c: "d" }, ...scatterConfetti(14, 9, ["a", "b", "c", "d"], 300, 260, 8),
    ],
    variants: [
      v("pink", L.pink, P("#FFF1F4", "#3A1F2A", "#F26D8D", "#F4B942", "#7BC8E8", "#B08CF0", "#F7C9DA", dotsLiner("#F7C9DA", "#FFFFFF"), "#EAF2F8")),
      v("blue", L.blue, P("#EEF5FD", "#1E2A3A", "#3B8FE0", "#F4B942", "#F26D8D", "#3BB273", "#CFE3F7", dotsLiner("#CFE3F7", "#FFFFFF"), "#F8EEE6")),
      v("green", L.green, P("#EEF8EE", "#1E2A24", "#3BB273", "#F4B942", "#F26D8D", "#3B8FE0", "#CDEBD3", dotsLiner("#CDEBD3", "#FFFFFF"), "#F8EAD8")),
      v("white-pink", { hy: "Սպիտակ-վարդագույն", en: "White & pink" }, P("#FFFFFF", "#33303B", "#F26D8D", "#F7A6B8", "#F9D26B", "#B08CF0", "#FFFFFF", stripeLiner("#F7A6B8", "#FFFFFF"), "#F4EEE6")),
      v("white-blue", { hy: "Սպիտակ-կապույտ", en: "White & blue" }, P("#FFFFFF", "#22303B", "#3B8FE0", "#A9C7F5", "#F9D26B", "#3BB273", "#FFFFFF", stripeLiner("#A9C7F5", "#FFFFFF"), "#F8EAD8")),
    ],
  },

  // ------------------------------------------------------------ PAINT PARTY
  {
    id: "paint-party",
    name: { hy: "Ներկերի տոն", en: "Paint the Party" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["arts"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "none", face: "marker", headline: "join", layout: "center",
    tags: ["art", "արվեստ", "paint", "ներկ", "brush", "craft", "splat"],
    motifs: [
      { m: "splat", x: 60, y: 60, s: 100, r: 10, c: "a" }, { m: "splat", x: 250, y: 90, s: 90, r: -30, c: "c" }, { m: "brush", x: 240, y: 340, s: 100, r: -35, c: "ink", c2: "b" },
      { m: "palette", x: 62, y: 350, s: 84, r: -10, c: "d", c2: "a" }, { m: "crayon", x: 150, y: 400, s: 60, r: -20, c: "b", c2: "ink" }, { m: "splat", x: 150, y: 40, s: 50, r: 0, c: "d" },
      { m: "dot", x: 100, y: 130, s: 12, c: "b" }, { m: "dot", x: 210, y: 150, s: 10, c: "a" }, { m: "dot", x: 40, y: 200, s: 14, c: "c" }, { m: "dot", x: 264, y: 220, s: 12, c: "d" },
    ],
    variants: [
      v("multi", { hy: "Բազմագույն", en: "Multi" }, P("#FFFFFF", "#26262B", "#F04E7A", "#3B8FE0", "#F5B935", "#3BB273", "#F5B935", "linear-gradient(120deg,#F04E7A,#F5B935,#3BB273,#3B8FE0)", "#F0ECE4")),
      v("warm", { hy: "Տաք", en: "Warm" }, P("#FFF8EE", "#2E2419", "#F04E7A", "#F28C1E", "#F5B935", "#D9484F", "#F28C1E", "linear-gradient(120deg,#F04E7A,#F28C1E,#F5B935)", "#E7EEF6")),
      v("cool", { hy: "Սառը", en: "Cool" }, P("#F3F8FD", "#1E2A3A", "#3B8FE0", "#8E6BE0", "#3BB273", "#4FD1C5", "#8E6BE0", "linear-gradient(120deg,#3B8FE0,#8E6BE0,#3BB273)", "#F8EEE6")),
    ],
  },

  // ------------------------------------------------------------ DANCE PARTY
  {
    id: "dance-party",
    name: { hy: "Պարային փարթի", en: "Dance Party" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["dance", "neon"], audience: ["girl", "teen"], shape: "portrait",
    pattern: "rays", patternSlot: "a", patternOpacity: 0.16, border: "none", face: "outline", headline: "party", layout: "center",
    tags: ["dance", "պար", "music", "երաժշտություն", "disco", "pop", "glitter"],
    motifs: [
      { m: "disco", x: 150, y: 70, s: 96, c: "d", c2: "paper" }, { m: "note", x: 50, y: 90, s: 44, r: -15, c: "a" }, { m: "note", x: 250, y: 100, s: 40, r: 15, c: "c" },
      { m: "headphones", x: 60, y: 350, s: 66, c: "b", c2: "ink" }, { m: "guitar", x: 246, y: 344, s: 84, r: 20, c: "a", c2: "b" }, { m: "sparkle", x: 100, y: 150, s: 16, c: "b" }, { m: "sparkle", x: 200, y: 156, s: 14, c: "a" },
      { m: "star", x: 150, y: 400, s: 20, c: "c" },
    ],
    variants: [
      v("purple", L.purple, P("#2B1550", "#FFF6FF", "#FF4FA3", "#FFD54A", "#4FD8FF", "#B08CF0", "#B08CF0", glitterLiner("#8E4BFF"), "#33205E", true)),
      v("pink", L.pink, P("#FFE4F1", "#3F1F2E", "#FF4FA3", "#8E4BFF", "#FFD54A", "#4FD8FF", "#FF9BD0", glitterLiner("#FF9BD0"), "#EAF2F8")),
      v("blue", L.blue, P("#0F2544", "#F0F7FF", "#4FD8FF", "#FF4FA3", "#FFD54A", "#7CFF6B", "#4FD8FF", glitterLiner("#1F5FA0"), "#182E52", true)),
    ],
  },

  // ------------------------------------------------------------ MOVIE NIGHT
  {
    id: "movie-night",
    name: { hy: "Կինոերեկո", en: "Movie Night" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["movie", "sleepover"], audience: ["boy", "girl", "teen"], shape: "ticket",
    pattern: "none", border: "doubleRule", face: "marker", headline: "invited", layout: "center",
    tags: ["movie", "կինո", "popcorn", "film", "ticket", "տոմս", "cinema"],
    motifs: [
      { m: "popcorn", x: 60, y: 84, s: 80, c: "a", c2: "paper" }, { m: "clapboard", x: 244, y: 84, s: 80, r: -8, c: "ink", c2: "paper" }, { m: "ticket", x: 60, y: 350, s: 70, r: -12, c: "b", c2: "ink" },
      { m: "star", x: 250, y: 350, s: 44, c: "b" }, { m: "star", x: 150, y: 400, s: 18, c: "b" }, { m: "sparkle", x: 150, y: 46, s: 18, c: "b" },
    ],
    variants: [
      v("red", L.red, P("#B3202A", "#FFF6E8", "#F4C542", "#F4C542", "#FFF6E8", "#1B1418", "#1B1418", stripeLiner("#B3202A", "#F4C542"), "#2A1418", true)),
      v("navy", L.navy, P("#111A33", "#FFF6E8", "#F4C542", "#F26D5B", "#FFF6E8", "#4FB3E8", "#F4C542", stripeLiner("#111A33", "#F4C542"), "#1B2340", true)),
    ],
  },

  // ------------------------------------------------------------ SLEEPOVER
  {
    id: "sleepover",
    name: { hy: "Գիշերակաց", en: "Sleepover" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["sleepover"], audience: ["girl", "boy", "teen"], shape: "portrait",
    pattern: "stars", patternSlot: "b", patternOpacity: 0.5, border: "none", face: "round", headline: "invited", layout: "center",
    tags: ["sleepover", "գիշերակաց", "pajama", "moon", "լուսին", "pillow", "tent"],
    motifs: [
      { m: "moon", x: 220, y: 70, s: 80, c: "b" }, { m: "zzz", x: 90, y: 60, s: 60, c: "paper" }, { m: "tent", x: 150, y: 350, s: 130, c: "a", c2: "c" },
      { m: "pillow", x: 50, y: 250, s: 56, r: -10, c: "d", c2: "paper" }, { m: "cocoa", x: 258, y: 260, s: 46, c: "paper", c2: "c" }, { m: "star", x: 44, y: 130, s: 18, c: "b" }, { m: "star", x: 262, y: 160, s: 14, c: "b" },
    ],
    variants: [
      v("navy", L.navy, P("#17224A", "#FFF8EC", "#F26D8D", "#F4C542", "#4FB3E8", "#B08CF0", "#F4C542", "linear-gradient(135deg,#17224A,#3B4B9E)", "#1E2A55", true)),
      v("lilac", L.lilac, P("#3B2A66", "#FFF6FF", "#F26D8D", "#F4C542", "#4FB3E8", "#7BC8E8", "#B08CF0", "linear-gradient(135deg,#3B2A66,#8E6BE0)", "#45337A", true)),
    ],
  },

  // ------------------------------------------------------------ BOUNCE!
  {
    id: "bounce",
    name: { hy: "Բատուտ", en: "Bounce!" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["jump", "sports"], audience: ["boy", "girl"], shape: "landscape",
    pattern: "diagonal", patternSlot: "b", patternOpacity: 0.16, border: "none", face: "marker", headline: "join", layout: "left",
    tags: ["trampoline", "բատուտ", "jump", "ցատկ", "bounce", "playground"],
    motifs: [
      { m: "jumper", x: 320, y: 110, s: 120, r: 0, c: "ink" }, { m: "hoop", x: 320, y: 220, s: 160, c: "a", c2: "ink" }, { m: "star", x: 250, y: 60, s: 24, c: "c" }, { m: "star", x: 396, y: 70, s: 20, c: "c" },
      { m: "sparkle", x: 268, y: 150, s: 16, c: "d" }, { m: "sparkle", x: 384, y: 160, s: 14, c: "d" }, { m: "balloon", x: 236, y: 250, s: 44, r: -10, c: "d" },
    ],
    variants: [
      v("orange", L.orange, P("#FFF1E0", "#2B1F14", "#F28C1E", "#3B8FE0", "#F5B935", "#3BB273", "#F28C1E", stripeLiner("#F28C1E", "#FFF1E0"), "#E7EEF6")),
      v("lime", L.lime, P("#EFF8DA", "#1F2A14", "#7DBB2E", "#3B8FE0", "#F5B935", "#F04E7A", "#7DBB2E", stripeLiner("#7DBB2E", "#EFF8DA"), "#F8EAD8")),
    ],
  },

  // ------------------------------------------------------------ GYM STAR
  {
    id: "gym-star",
    name: { hy: "Մարմնամարզիկ", en: "Gym Star" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["gymnastics", "sports", "dance"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "cornerStars", face: "round", headline: "invited", layout: "center",
    tags: ["gymnastics", "մարմնամարզություն", "ribbon", "medal", "մեդալ", "beam"],
    motifs: [
      { m: "ribbon", x: 150, y: 90, s: 200, c: "a" }, { m: "medal", x: 52, y: 250, s: 48, c: "b", c2: "a" }, { m: "trophy", x: 250, y: 250, s: 48, c: "b", c2: "c" },
      { m: "beam", x: 150, y: 386, s: 190, c: "ink", c2: "c" }, { m: "jumper", x: 150, y: 342, s: 60, c: "d" }, { m: "star", x: 60, y: 60, s: 20, c: "c" }, { m: "star", x: 240, y: 56, s: 18, c: "c" },
    ],
    variants: [
      v("pink", L.pink, P("#FFF0F5", "#3A1F2A", "#F26D8D", "#F4B942", "#B08CF0", "#4FB3E8", "#F7C9DA", glitterLiner("#F7C9DA"), "#EAF2F8")),
      v("teal", L.teal, P("#EAF7F5", "#0E3B37", "#2FA39A", "#F4B942", "#F26D8D", "#8E6BE0", "#9ED0C6", glitterLiner("#9ED0C6"), "#F8EEE6")),
    ],
  },

  // ------------------------------------------------------------ PET PARTY
  {
    id: "pet-party",
    name: { hy: "Կենդանիների տոն", en: "Pet Party" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["animals"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "none", face: "round", headline: "join", layout: "center",
    tags: ["pets", "կենդանիներ", "dog", "շուն", "cat", "կատու", "paw", "bone"],
    motifs: [
      { m: "dog", x: 70, y: 84, s: 90, c: "b", c2: "ink" }, { m: "cat", x: 236, y: 90, s: 82, c: "d", c2: "ink" }, { m: "bone", x: 50, y: 250, s: 44, r: -20, c: "paper", c2: "ink" },
      { m: "paw", x: 256, y: 250, s: 36, r: 15, c: "a" }, { m: "paw", x: 60, y: 372, s: 30, r: -20, c: "c" }, { m: "paw", x: 240, y: 380, s: 30, r: 20, c: "a" }, { m: "heart", x: 150, y: 400, s: 22, c: "a" },
      { m: "tennis", x: 150, y: 44, s: 30, c: "c", c2: "paper" },
    ],
    variants: [
      v("cream", L.cream, P("#FBF4E4", "#2E2419", "#E9772F", "#B87A4A", "#7DBB6D", "#7A5C46", "#E9772F", dotsLiner("#E9772F", "#FBF4E4"), "#E7EEF6")),
      v("mint", L.mint, P("#E4F1E7", "#1F2A24", "#E9772F", "#B87A4A", "#2F8F86", "#7A5C46", "#9ED0BF", dotsLiner("#9ED0BF", "#FFFFFF"), "#F8E7DA")),
      v("peach", L.peach, P("#FCE6D8", "#3A2418", "#D9484F", "#B87A4A", "#7DBB6D", "#7A5C46", "#F7C9B8", dotsLiner("#F7C9B8", "#FFFFFF"), "#E5EFF9")),
    ],
  },

  // ------------------------------------------------------------ THE BIG ONE
  {
    id: "the-big-one",
    name: { hy: "Մեծ մեկը", en: "The Big One" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["balloons", "cake"], audience: ["girl", "boy"], milestone: ["first"], shape: "portrait",
    pattern: "dots", patternSlot: "b", patternOpacity: 0.25, border: "none", face: "bubble", headline: "big1", layout: "center",
    popular: true,
    tags: ["first", "առաջին", "1", "one", "մեկ", "tarber", "տարեդարձ"],
    motifs: [
      { m: "partyHat", x: 60, y: 70, s: 60, r: -14, c: "a", c2: "paper" }, { m: "balloon", x: 244, y: 74, s: 60, r: 8, c: "c" }, { m: "layerCake", x: 60, y: 350, s: 60, c: "d", c2: "a" },
      { m: "gift", x: 244, y: 350, s: 54, c: "b", c2: "a" }, { m: "candle", x: 150, y: 396, s: 30, c: "a", c2: "b" }, ...scatterConfetti(12, 13, ["a", "b", "c", "d"], 300, 420, 8),
    ],
    variants: [
      v("blue", L.blue, P("#EAF3FC", "#1E2A3A", "#3B8FE0", "#F4B942", "#F26D8D", "#3BB273", "#3B8FE0", dotsLiner("#3B8FE0", "#EAF3FC"), "#F8EEE6")),
      v("pink", L.pink, P("#FDEBF1", "#3A1F2A", "#F26D8D", "#F4B942", "#3B8FE0", "#B08CF0", "#F26D8D", dotsLiner("#F26D8D", "#FDEBF1"), "#EAF2F8")),
      v("mint", L.mint, P("#E6F5EE", "#1F2A24", "#3BB273", "#F4B942", "#F26D8D", "#3B8FE0", "#3BB273", dotsLiner("#3BB273", "#E6F5EE"), "#F8EAD8")),
    ],
  },

  // ------------------------------------------------------------ SWEET SIXTEEN
  {
    id: "sweet-sixteen",
    name: { hy: "Sweet Sixteen", en: "Sweet Sixteen" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["neon", "dance"], audience: ["teen", "girl"], milestone: ["sweet16", "eighteen", "teen13"], shape: "portrait",
    pattern: "none", border: "doubleRule", face: "script", headline: "sweet", layout: "center",
    tags: ["sweet 16", "teen", "դեռահաս", "16", "18", "glitter", "luxe"],
    motifs: [
      { m: "sparkle", x: 60, y: 60, s: 26, c: "a" }, { m: "sparkle", x: 240, y: 70, s: 20, c: "a" }, { m: "sparkle", x: 44, y: 360, s: 18, c: "a" }, { m: "sparkle", x: 256, y: 350, s: 24, c: "a" },
      { m: "heart", x: 150, y: 46, s: 22, c: "b" }, { m: "streamer", x: 150, y: 384, s: 200, r: 0, c: "a", o: 0.8 }, ...scatterConfetti(8, 17, ["a", "b"], 300, 420, 5),
    ],
    variants: [
      v("gold", L.gold, P("#FBF6EC", "#2E2419", "#C9962B", "#E85B8F", "#B08CF0", "#4FB3E8", "#F6E7B4", goldLiner, "#EAF0F7")),
      v("rose", L.rose, P("#FBECEF", "#3A1F2A", "#C96A7A", "#C9962B", "#B08CF0", "#4FB3E8", "#F2C4CC", glitterLiner("#F2C4CC"), "#EAF2F8")),
    ],
  },

  // ------------------------------------------------------------ DOUBLE TROUBLE
  {
    id: "double-trouble",
    name: { hy: "Կրկնակի տոն", en: "Double Trouble" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["balloons", "cake"], audience: ["joint", "girl", "boy"], shape: "landscape",
    pattern: "confetti", patternSlot: "c", patternOpacity: 0.5, border: "none", face: "round", headline: "double", layout: "center",
    tags: ["joint", "համատեղ", "twins", "երկվորյակ", "two", "siblings"],
    motifs: [
      { m: "balloon", x: 60, y: 90, s: 90, r: -8, c: "a" }, { m: "balloon", x: 360, y: 90, s: 90, r: 8, c: "b" }, { m: "layerCake", x: 60, y: 236, s: 56, c: "c", c2: "d" }, { m: "layerCake", x: 360, y: 236, s: 56, c: "d", c2: "c" },
      { m: "star", x: 210, y: 40, s: 22, c: "d" }, { m: "sparkle", x: 130, y: 250, s: 16, c: "b" }, { m: "sparkle", x: 290, y: 250, s: 16, c: "a" },
    ],
    variants: [
      v("mint", L.mint, P("#EAF6EE", "#1F2A24", "#3BB273", "#F26D8D", "#F4B942", "#3B8FE0", "#9ED0BF", dotsLiner("#9ED0BF", "#FFFFFF"), "#F8E7DA")),
      v("sky", L.sky, P("#EAF3FC", "#1E2A3A", "#3B8FE0", "#F26D8D", "#F4B942", "#3BB273", "#CFE3F7", dotsLiner("#CFE3F7", "#FFFFFF"), "#F8EEE6")),
    ],
  },

  // ------------------------------------------------------------ FULL PHOTO
  {
    id: "full-photo",
    name: { hy: "Ամբողջական նկար", en: "Full-Page Photo" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["photo"], audience: ["girl", "boy", "teen"], shape: "portrait",
    pattern: "none", border: "none", face: "marker", headline: "turning", layout: "bottom",
    photo: { x: 0, y: 0, w: 300, h: 420, shape: "full" },
    tags: ["photo", "նկար", "full", "portrait", "simple"],
    motifs: [],
    variants: [
      v("white", L.white, P("#FFFFFF", "#FFFFFF", "#FFFFFF", "#F4B942", "#F26D8D", "#3B8FE0", "#F5F0E6", "#E8E8E8", "#F1EBDD")),
      v("black", L.black, P("#111111", "#FFFFFF", "#F4B942", "#F26D8D", "#3B8FE0", "#3BB273", "#111111", "#2A2A2A", "#E7EEF6", true)),
    ],
  },

  // ------------------------------------------------------------ CANDLES (PHOTO)
  {
    id: "candles-photo",
    name: { hy: "Մոմեր (նկարով)", en: "Candle Lighting (Photo)" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["photo", "cake"], audience: ["girl", "boy"], shape: "portrait",
    pattern: "none", border: "none", face: "round", headline: "turning", layout: "bottom",
    photo: { x: 150, y: 140, w: 176, h: 176, shape: "circle" },
    tags: ["photo", "նկար", "candles", "մոմ", "circle"],
    motifs: [
      { m: "candle", x: 40, y: 260, s: 40, r: -6, c: "a", c2: "b" }, { m: "candle", x: 262, y: 262, s: 40, r: 6, c: "c", c2: "d" }, { m: "candle", x: 76, y: 44, s: 30, r: 10, c: "b", c2: "a" },
      { m: "candle", x: 224, y: 44, s: 30, r: -10, c: "d", c2: "c" }, ...scatterConfetti(10, 19, ["a", "b", "c", "d"], 300, 300, 7),
    ],
    variants: [
      v("pink-rainbow", { hy: "Վարդագույն ծիածան", en: "Pink rainbow" }, P("#FFF0F5", "#3A1F2A", "#F26D8D", "#F4B942", "#3BB273", "#3B8FE0", "#F7C9DA", "linear-gradient(90deg,#F26D8D,#F4B942,#3BB273,#3B8FE0)", "#EAF2F8")),
      v("rainbow-blue", { hy: "Ծիածան-կապույտ", en: "Rainbow blue" }, P("#EEF5FD", "#1E2A3A", "#3B8FE0", "#F26D8D", "#F4B942", "#3BB273", "#CFE3F7", "linear-gradient(90deg,#3B8FE0,#3BB273,#F4B942,#F26D8D)", "#F8EEE6")),
      v("gold", L.gold, P("#FBF6EC", "#2E2419", "#C9962B", "#E85B8F", "#B08CF0", "#4FB3E8", "#F6E7B4", goldLiner, "#EAF0F7")),
    ],
  },

  // ------------------------------------------------------------ TIE-DYE WAVES
  {
    id: "tie-dye",
    name: { hy: "Թայ-դայ ալիքներ", en: "Tie-Dye Waves" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["arts", "neon"], audience: ["teen", "girl", "boy"], shape: "portrait",
    pattern: "tieDye", patternSlot: "a", patternOpacity: 1, border: "none", face: "outline", headline: "party", layout: "center",
    tags: ["tie dye", "թայ-դայ", "groovy", "teen", "swirl", "retro"],
    motifs: [
      { m: "smiley", x: 50, y: 50, s: 40, c: "paper", c2: "ink" }, { m: "smiley", x: 250, y: 380, s: 40, c: "paper", c2: "ink" }, { m: "sparkle", x: 250, y: 60, s: 20, c: "paper" }, { m: "sparkle", x: 50, y: 370, s: 18, c: "paper" },
    ],
    variants: [
      v("rainbow", L.rainbow, P("#FDE68A", "#26262B", "#F26D8D", "#3B8FE0", "#3BB273", "#B08CF0", "#F26D8D", "conic-gradient(from 90deg,#F26D8D,#FDE68A,#3BB273,#3B8FE0,#B08CF0,#F26D8D)", "#F1EBDD")),
      v("blue", L.blue, P("#CFE3F7", "#1E2A3A", "#3B8FE0", "#8E6BE0", "#4FD1C5", "#FFFFFF", "#3B8FE0", "conic-gradient(from 90deg,#3B8FE0,#8E6BE0,#4FD1C5,#3B8FE0)", "#F8EEE6")),
    ],
  },

  // ------------------------------------------------------------ LIGHT BRIGHT
  {
    id: "light-bright",
    name: { hy: "Լույսերի փայլ", en: "Light Bright" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["neon", "gaming"], audience: ["boy", "girl", "teen"], shape: "portrait",
    pattern: "dots", patternSlot: "a", patternOpacity: 0.9, border: "none", face: "neon", headline: "invited", layout: "center",
    tags: ["neon", "նեոն", "glow", "lights", "լույսեր", "pegs", "dark"],
    motifs: [
      { m: "star", x: 60, y: 60, s: 40, c: "b" }, { m: "heart", x: 240, y: 70, s: 40, c: "c" }, { m: "smiley", x: 60, y: 350, s: 44, c: "d", c2: "ink" }, { m: "bolt", x: 240, y: 350, s: 44, c: "b" },
      { m: "sparkle", x: 150, y: 46, s: 18, c: "c" }, { m: "sparkle", x: 150, y: 396, s: 18, c: "d" },
    ],
    variants: [
      v("green-blue", { hy: "Կանաչ-կապույտ", en: "Green & blue" }, P("#0A0A0F", "#FFFFFF", "#1E3A5F", "#7CFF6B", "#3FD1FF", "#FFD23F", "#3FD1FF", "linear-gradient(135deg,#7CFF6B,#3FD1FF)", "#15161F", true)),
      v("sunset", { hy: "Մայրամուտ", en: "Sunset" }, P("#0A0A0F", "#FFFFFF", "#3A1E2A", "#FFD23F", "#FF5FA8", "#FF8C42", "#FF5FA8", "linear-gradient(135deg,#FFD23F,#FF5FA8,#FF8C42)", "#1F1518", true)),
      v("purple-pink", { hy: "Մանուշակագույն-վարդագույն", en: "Purple & pink" }, P("#0A0A0F", "#FFFFFF", "#2A1E4A", "#C05CFF", "#FF5FA8", "#3FD1FF", "#C05CFF", "linear-gradient(135deg,#C05CFF,#FF5FA8)", "#1A1524", true)),
    ],
  },

  // ------------------------------------------------------------ LASER TAG
  {
    id: "laser-tag",
    name: { hy: "Լազերային մարտ", en: "Laser Tag" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["neon", "gaming", "sports"], audience: ["boy", "teen"], shape: "portrait",
    pattern: "rays", patternSlot: "a", patternOpacity: 0.55, border: "neonFrame", face: "neon", headline: "level", layout: "center",
    tags: ["laser", "լազեր", "tag", "beams", "arena", "neon"],
    motifs: [
      { m: "burst", x: 150, y: 90, s: 120, c: "b", c2: "paper" }, { m: "bolt", x: 50, y: 350, s: 44, r: 20, c: "c" }, { m: "bolt", x: 250, y: 350, s: 44, r: -20, c: "c" }, { m: "star", x: 150, y: 396, s: 20, c: "d" },
    ],
    variants: [
      v("green", L.green, P("#07100B", "#EAFFF0", "#39FF6A", "#39FF6A", "#3FD1FF", "#FFD23F", "#39FF6A", stripeLiner("#07100B", "#39FF6A"), "#111A14", true)),
      v("pink", L.pink, P("#120711", "#FFF0FA", "#FF5FA8", "#FF5FA8", "#C05CFF", "#3FD1FF", "#FF5FA8", stripeLiner("#120711", "#FF5FA8"), "#1D1120", true)),
    ],
  },

  // ------------------------------------------------------------ SUMMER FLOATS
  {
    id: "summer-floats",
    name: { hy: "Ամառային լողակներ", en: "Summer Floats" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["pool"], audience: ["girl", "boy", "teen"], shape: "square",
    pattern: "waves", patternSlot: "b", patternOpacity: 0.35, border: "none", face: "bubble", headline: "splash", layout: "center",
    tags: ["pool", "լողավազան", "float", "summer", "ամառ", "donut", "flamingo"],
    motifs: [
      { m: "floatRing", x: 64, y: 64, s: 84, r: 0, c: "a", c2: "paper" }, { m: "donut", x: 258, y: 66, s: 74, r: 10, c: "c", c2: "d" }, { m: "floatRing", x: 258, y: 258, s: 74, r: 0, c: "d", c2: "paper" },
      { m: "palm", x: 60, y: 258, s: 84, c: "b", c2: "ink" }, { m: "sun", x: 160, y: 40, s: 36, c: "d" }, { m: "sunglasses", x: 160, y: 292, s: 40, c: "ink", c2: "a" },
    ],
    variants: [
      v("aqua", L.aqua, P("#CFF0F5", "#0F3B44", "#F94F6D", "#3B8FCF", "#FFD23F", "#F28C1E", "#F94F6D", stripeLiner("#F94F6D", "#FFFFFF"), "#F8EAD8")),
      v("coral", L.coral, P("#FFE3D6", "#3A2418", "#3B8FCF", "#F94F6D", "#FFD23F", "#4FD1C5", "#4FD1C5", stripeLiner("#4FD1C5", "#FFFFFF"), "#E7EEF6")),
    ],
  },

  // ------------------------------------------------------------ MONSTER MUNCH
  {
    id: "monster-munch",
    name: { hy: "Հրեշիկների խնջույք", en: "Monster Munch" },
    by: { hy: "ԿՆԻՔ ստուդիա", en: "KNIQ studio" },
    themes: ["characters"], audience: ["boy", "girl"], shape: "portrait",
    pattern: "none", border: "none", face: "bubble", headline: "invited", layout: "bottom",
    isNew: true,
    tags: ["monster", "հրեշիկ", "friendly", "fun", "silly", "characters"],
    motifs: [
      { m: "monster", x: 150, y: 130, s: 200, c: "a", c2: "paper" }, { m: "star", x: 44, y: 60, s: 22, c: "c" }, { m: "star", x: 258, y: 66, s: 20, c: "d" }, { m: "monster", x: 50, y: 250, s: 70, r: -10, c: "b", c2: "paper" },
      { m: "monster", x: 254, y: 250, s: 64, r: 10, c: "c", c2: "paper" }, ...scatterConfetti(8, 23, ["b", "c", "d"], 300, 260, 7),
    ],
    variants: [
      v("green", L.green, P("#F1F7E9", "#1F2A24", "#3BB273", "#F26D8D", "#3B8FE0", "#F4B942", "#3BB273", dotsLiner("#3BB273", "#F1F7E9"), "#F8EAD8")),
      v("purple", L.purple, P("#F1EAFB", "#2E2340", "#8E6BE0", "#3BB273", "#F26D8D", "#F4B942", "#8E6BE0", dotsLiner("#8E6BE0", "#F1EAFB"), "#F8EEE6")),
      v("orange", L.orange, P("#FFF1E0", "#2B1F14", "#F28C1E", "#3B8FE0", "#3BB273", "#F26D8D", "#F28C1E", dotsLiner("#F28C1E", "#FFF1E0"), "#E7EEF6")),
    ],
  },
];

export const kidsIds = kidsCards.map((c) => c.id);
export const findKidsCard = (id: string | undefined | null) => (id ? kidsCards.find((c) => c.id === id) : undefined);

/** "kids-<card>-<variant>" ⇄ parts. Any bad part falls back to the first. */
export function parseKidsTpl(tpl: string | undefined | null): { card: KidsCard; variant: Variant } | null {
  if (!tpl || !tpl.startsWith("kids-")) return null;
  const rest = tpl.slice(5);
  const card = kidsCards.find((c) => rest === c.id || rest.startsWith(c.id + "-"));
  if (!card) return null;
  const vid = rest.length > card.id.length ? rest.slice(card.id.length + 1) : "";
  const variant = card.variants.find((x) => x.id === vid) ?? card.variants[0];
  return { card, variant };
}
export const kidsTpl = (card: KidsCard, variant: Variant) => `kids-${card.id}-${variant.id}`;

/** every facet a card answers to — for the filter chips */
export function cardFacets(c: KidsCard): KidsFacet[] {
  return [...c.themes, ...c.audience, ...(c.milestone ?? [])];
}
