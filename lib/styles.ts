import type { T } from "./content";

// ============================================================================
// THE CATALOG — the styles a couple chooses between.
//
// This is the pivot the references are built around: naiva sells 6 occasion
// categories and iStudio a 48-template catalog, because the couple's first
// decision is never the venue list — it is "which one looks like us". KNIQ's
// catalog is three DESIGNED DIRECTIONS rather than 48 permutations: every
// style is the same measured, verified card (envelope, programme, venues,
// RSVP, dashboard) wearing a different measured palette and mood. One
// codebase, no per-template rebuild, and a fourth style is a token block away.
//
// EVERY PALETTE BELOW WAS MEASURED BEFORE IT WAS USED (same discipline as the
// ivory original):
//   ԼՈՒՅՍ  night #14120F · paper text 16.30:1 · candle #D4B478 9.44:1 — on
//          night, gold is text-safe, the exact inverse of ivory; the RSVP
//          band flips to PAPER to keep the "card turns over" move.
//   ՏՈՒՖ   warm paper #F4E9DC · basalt 12.50:1 · terracotta #C0603A 3.52:1 =
//          ornament only; terra-ink #9C4526 5.33:1 carries coloured words;
//          apricot fails paper (1.71:1) but is the dark band's accent (7.31:1).
// ============================================================================

export type InvStyle = {
  id: "kniq" | "luys" | "tuf";
  name: T;
  mood: T;
  blurb: T;
  /** The three swatches the catalog card shows, in paint order. */
  swatch: [string, string, string];
  /** AMD, one build, BOTH languages included. TODO(owner): confirm pricing —
   *  set against iStudio's 13,900–31,900֏ PER LANGUAGE with the dashboard as
   *  a paid add-on; ours includes both. */
  from: number;
  /** The palette, as measured facts — shown in the detail modal and page.
   *  These are the actual numbers the CSS was built against. */
  facts: T[];
  /** What this style carries beyond the shared card. */
  includes: T[];
};

export const styles: InvStyle[] = [
  {
    id: "kniq",
    name: { hy: "ԿՆԻՔ", en: "KNIQ" },
    mood: { hy: "Փղոսկր և ոսկի", en: "Ivory & gold" },
    blurb: {
      hy: "Թուղթ, մելան, մեկ ոսկե շեշտ։ Դասական տառատեսակներ, զմուռսե կնիք, հանդարտ շարժում։",
      en: "Paper, ink, one gold accent. Classical type, a wax seal, unhurried motion.",
    },
    swatch: ["#F3EFE7", "#1C1A17", "#B08D57"],
    from: 19900,
    facts: [
      { hy: "Մելան թղթի վրա՝ 15.14:1", en: "Ink on paper — 15.14:1" },
      { hy: "Ոսկին զարդ է, ոչ բառ՝ 2.70:1", en: "Gold is ornament, never a word — 2.70:1" },
      { hy: "Ոսկե տեքստը՝ մուգ երանգով՝ 5.07:1", en: "Gold that must be read is the darker gold — 5.07:1" },
    ],
    includes: [
      { hy: "Փղոսկրյա ծրար, ոսկե զմուռս", en: "Ivory envelope, gold wax" },
      { hy: "Դասական տառատեսակներ, թղթի հատիկ", en: "Classical type, paper grain" },
      { hy: "Ձեռքերն ու փունջը՝ կամարի մեջ", en: "The hands and the bouquet in the arch" },
    ],
  },
  {
    id: "luys",
    name: { hy: "ԼՈՒՅՍ", en: "LUYS" },
    mood: { hy: "Գիշեր և մոմի լույս", en: "Night & candlelight" },
    blurb: {
      hy: "Մուգ թուղթ, մոմի ոսկի, կինոյի տրամադրություն։ Երեկոյան հարսանիքի տոնայնությունը։",
      en: "Dark paper, candle gold, a cinematic mood. The register of an evening wedding.",
    },
    swatch: ["#14120F", "#F3EFE7", "#D4B478"],
    from: 24900,
    facts: [
      { hy: "Ոսկրագույնը գիշերվա վրա՝ 16.30:1", en: "Bone on night — 16.30:1" },
      { hy: "Մոմի ոսկին կարող է բառ լինել՝ 9.44:1", en: "Candle gold may carry a word — 9.44:1" },
      { hy: "Պատասխանի հատվածը շրջվում է ոսկրագույնի", en: "The RSVP band turns over to bone" },
    ],
    includes: [
      { hy: "Մուգ դաջված ծրար, նույն ոսկե զմուռսը", en: "Dark embossed envelope, the same gold wax" },
      { hy: "Մոմերի սեղանն ու մշուշոտ եկեղեցին", en: "The candle table and the church in mist" },
      { hy: "Ժայռի մատուռը՝ կամարի մեջ", en: "The cliff chapel in the arch" },
    ],
  },
  {
    id: "tuf",
    name: { hy: "ՏՈՒՖ", en: "TUF" },
    mood: { hy: "Տուֆ և ծիրան", en: "Tuff & apricot" },
    blurb: {
      hy: "Հայկական քարի ջերմությունը՝ տերակոտա, բազալտ, ծիրանագույն շեշտ։ Ճանաչելիորեն մերը։",
      en: "The warmth of Armenian stone — terracotta, basalt, an apricot accent. Recognisably ours.",
    },
    swatch: ["#F4E9DC", "#2B2622", "#C0603A"],
    from: 24900,
    facts: [
      { hy: "Բազալտը տուֆե թղթի վրա՝ 12.50:1", en: "Basalt on tuff paper — 12.50:1" },
      { hy: "Տերակոտան զարդ է՝ 3.52:1, խոսում է մուգը՝ 5.33:1", en: "Terracotta is ornament — 3.52:1; the darker one speaks — 5.33:1" },
      { hy: "Ծիրանագույնը միայն մուգ հատվածում՝ 7.31:1", en: "Apricot belongs to the dark band alone — 7.31:1" },
    ],
    includes: [
      { hy: "Տաք քարե թուղթ, տերակոտա զմուռս", en: "Warm stone paper, terracotta wax" },
      { hy: "Նորավանքն ու Արարատը", en: "Noravank and Ararat" },
      { hy: "Ժայռի մատուռը՝ կամարի մեջ", en: "The cliff chapel in the arch" },
    ],
  },
];

export const styleIds = styles.map((s) => s.id);

export function findStyle(id: string): InvStyle | undefined {
  return styles.find((s) => s.id === id);
}

export const formatAmd = (n: number) => n.toLocaleString("en-US").replace(/,/g, " ") + " ֏";
