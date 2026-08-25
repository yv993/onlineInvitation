import type { StaticImageData } from "next/image";
import type { T } from "./content";
import { svc } from "./content";
import { formatAmd } from "./styles";
import { templates, type TemplateSpec } from "./templates";
import { engineStyles, findStyle, type StyleSpec } from "./invitations/styles";
import { mockForStyle, styleCovers } from "./invitations/mock";
import { parseWTpl, wCards, wTpl, type WCard, type WVariant } from "./wcards";
import { kidsCards, kidsTpl, parseKidsTpl, type KidsCard, type Variant as KidsVariant } from "./kids";
import type { Draft } from "./draft";

// ============================================================================
// THE EXAMPLES — everything the wizard can be built on, as ONE list.
//
// Three kinds live behind the same `tpl` id the Draft, the short link, the
// order and /invitation/<id> already understand:
//   web     the fifteen live templates          (`wedding-1` …)
//   engine  the six engine styles                (`live-classic-floral` …)
//   card    the wedding cards in an envelope     (`wed-<design>-<colour>`)
//
// Each carries what a couple weighs when picking — the look, what the page
// actually does (features), and THE PRICE. Prices are not invented per
// example: they are the site's two published tiers (lib/content.ts →
// svc.pricing, TODO(owner) confirms the numbers), assigned by capability:
//   premium  film or music, guest list + Excel, personalised links, the
//            engine (all of that at once)
//   basic    everything an invitation must do, without those
// One payment, both languages — the same terms the pricing band states.
// ============================================================================

export type ExampleKind = "web" | "engine" | "card";
export type ExampleFeature = "film" | "music" | "rsvp" | "guests" | "gallery" | "timeline" | "maps" | "countdown" | "dress" | "envelope" | "personal" | "calendar";
export type ExampleOccasion = Draft["occasion"]; // wedding | engagement | baptism | birthday | corporate
export type Tier = "basic" | "premium";

export type Example = {
  id: string; // the tpl id
  kind: ExampleKind;
  occasion: ExampleOccasion;
  name: T;
  tagline: T;
  /** a raster cover for web/engine; cards draw their own face (`card`/`kids`) */
  cover: StaticImageData | null;
  card?: { card: WCard; variant: WVariant };
  kids?: { card: KidsCard; variant: KidsVariant };
  palette: [string, string, string]; // bg · accent · ink
  features: ExampleFeature[];
  tier: Tier;
  price: number;
  /** the names the empty wizard previews with */
  sample: { a: T; b?: T };
  dark: boolean;
  /** what it was measured against (the references), or «KNIQ's own» */
  after: T;
  /** the section order, top to bottom — what the detail window lists */
  anatomy: T[];
  /** the card studio, for a card (envelope paper · liner · stamp · seal · backdrop live there) */
  studio?: string;
};

// ---- the section order of a web template, read off its block flags
function templateAnatomy(tp: TemplateSpec): T[] {
  const b = tp.blocks;
  const a: T[] = [];
  // a template with a hero of its own says what THAT hero is
  if (b.sealBanner) a.push({ hy: "Հերոս՝ կախված կրեմ մագաղաթ, մոմե կնիք, ձեռագիր անուններ", en: "Hero — the hanging cream pennant, the poured wax seal, the names in script" });
  else if (b.sceneHero) a.push({ hy: "Հերոս՝ շերտավոր հովիտ փուչիկների կամարի հետևում, կախված զարդագոտի — ոլորումը տեսախցիկն է", en: "Hero — the layered valley behind a balloon arch, the hanging ornament band — the scroll is the camera" });
  else if (b.castleScene) a.push({ hy: "Հերոս՝ ամրոցի հովիտ ձյունոտ լեռների տակ, պտտվող ջրաղաց, թռչունների երամ — կադրը ինքն է շնչում", en: "Hero — the castle valley under snow peaks, the turning mill wheel, the crossing flock: the frame breathes on its own" });
  else if (b.tornHero) a.push({ hy: "Հերոս՝ պատռված կապույտ ծրագիր — մոնոգրամ լուսանկարի վրա, երեք վանդակ ամսաթիվ, տողը սուրբ գրքից", en: "Hero — the torn-blue programme: a monogram over the photograph, the three-cell date, the scripture line" });
  else if (b.bloomHero) a.push({ hy: "Հերոս՝ հորտենզիաների գիշեր — նկարված ծաղկագլուխներ, թափվող թերթիկներ", en: "Hero — the hydrangea night: drawn bloom heads, petals coming down" });
  else if (b.roseHero) a.push({ hy: "Հերոս՝ թավշյա վարդեր — շերտավոր վարդեր անկյուններում, անունները՝ իրար վրա", en: "Hero — the velvet roses: layered blooms in the corners, the names stacked huge" });
  else if (b.sprigHero) a.push({ hy: "Հերոս՝ էվկալիպտի ուխտ — բարակ շրջանակ, կամարաձև լուսանկար, հրավերի նախադասությունը", en: "Hero — the eucalyptus vow: a hairline frame, the arched photograph, the invitation sentence" });
  else a.push(tp.video ? { hy: "Հերոս՝ ֆոնային տեսանյութ, անուններ, օր", en: "Hero — ambient film, names, the date" } : { hy: "Հերոս՝ շապիկի նկար, անուններ, օր", en: "Hero — the cover plate, names, the date" });
  if (b.fold) a.push({ hy: "Եռածալ բացվող քարտ", en: "Tri-fold opening card" });
  if (b.countdown) a.push({ hy: "Հետհաշվարկ", en: "Countdown" });
  if (b.ageCountdown) a.push({ hy: "Տարիքի հաշվարկ", en: "Age countdown" });
  if (b.timeline) a.push({ hy: b.timeline === "tabs" ? "Օրակարգ՝ ներդիրներով" : b.timeline === "parallax" ? "Ժամանակացույց՝ պարալաքսով" : "Օրվա կարգը", en: b.timeline === "tabs" ? "Agenda tabs" : b.timeline === "parallax" ? "Timeline with parallax" : "The order of the day" });
  if (b.map || b.pinDrop) a.push({ hy: "Քարտեզի քարտ", en: "Map card" });
  if (b.gallery) a.push({ hy: b.gallery === "masonry" ? "Պատկերասրահ՝ մասոնրի" + (b.lightbox ? " + լայթբոքս" : "") : "Պատկերասրահ" + (b.lightbox ? " + լայթբոքս" : ""), en: (b.gallery === "masonry" ? "Masonry gallery" : "Gallery") + (b.lightbox ? " + lightbox" : "") });
  if (b.dressCode) a.push({ hy: "Հագուստի գույներ", en: "Dress code" });
  if (b.entourage) a.push({ hy: "Հարազատները՝ սյունակներով", en: "The wedding party, in columns" });
  if (b.gift) a.push({ hy: "Նվերների խոսքը", en: "The gift line" });
  if (b.seats !== undefined) a.push({ hy: "Պահված տեղերի քարտ", en: "Reserved-seats card" });
  if (b.plan) a.push({ hy: "Նստատեղերի էսքիզը", en: "The seating sketch" });
  if (b.adults) a.push({ hy: "Միայն մեծահասակների տողը", en: "The adults-only line" });
  if (b.guestChat) a.push({ hy: "Հյուրերի զրուցարանի քարտ", en: "The guests' chat card" });
  if (b.venues) a.push({ hy: "Երկու վայրի քարտեր՝ «Դիտել քարտեզում» կոճակով", en: "Two venue cards with VIEW LOCATION pills" });
  if (b.greeting) a.push({ hy: "Ողջույնի սպիտակ վահանակ՝ մեծ ամսաթվով", en: "The white greeting panel, the day set huge" });
  if (b.details) a.push({ hy: "Մանրամասների կարմիր գոտի՝ նկարված ծաղկեփնջով", en: "The DETAILS band, with the drawn bouquet" });
  if (b.quote) a.push({ hy: "Տող սուրբ գրքից", en: "A scripture line" });
  if (b.godparents) a.push({ hy: "Կնքահայր և կնքամայր", en: "Godparents" });
  if (b.parentsNote) a.push({ hy: "Ծնողների խոսքը", en: "The parents' note" });
  if (b.speakers) a.push({ hy: "Բանախոսներ", en: "Speakers" });
  if (b.toastBoard) a.push({ hy: "Հյուրերի բարեմաղթանքների պատ", en: "Guest wishes wall" });
  if (b.registry) a.push({ hy: "Նվերների ցանկ", en: "Registry" });
  if (b.productTilt) a.push({ hy: "3D շրջվող քարտ", en: "3D tilt card" });
  if (b.memoryReel) a.push({ hy: "Հիշողությունների ժապավեն", en: "Memory reel" });
  if (b.qr) a.push({ hy: "QR գրանցում", en: "QR check-in" });
  if (b.rsvp) {
    // weddings and engagements also ask the guest's side (bride's / groom's)
    const sides = tp.category === "wedding" || tp.category === "engagement";
    a.push({
      hy: (b.rsvp === "modal" ? "RSVP՝ մոդալ պատուհանով" : b.rsvp === "meal" ? "RSVP՝ ճաշատեսակով" : b.rsvp === "guests" ? "RSVP՝ հյուրերի քանակով" : b.rsvp === "team" ? "RSVP՝ թիմով" : "RSVP՝ էջի մեջ") + (sides ? "՝ հարսի/փեսայի կողմով" : ""),
      en: (b.rsvp === "modal" ? "RSVP in a modal" : b.rsvp === "meal" ? "RSVP with meal choice" : b.rsvp === "guests" ? "RSVP with guest count" : b.rsvp === "team" ? "RSVP by team" : "RSVP inline") + (sides ? " — with the guest's side" : ""),
    });
  }
  if (b.ics) a.push({ hy: ".ics օրացույց", en: ".ics calendar" });
  if (tp.audio) a.push({ hy: "Երաժշտության վահանակ", en: "Music dock" });
  a.push({ hy: "Կիսվել (WhatsApp · Telegram), ստորագիր", en: "Share (WhatsApp · Telegram), footer" });
  return a;
}
const CARD_ANATOMY: T[] = [
  { hy: "Ծրարի երեսը՝ հյուրի անունով, դրոշմանիշ, փոստային կնիք", en: "The envelope front, addressed to the guest — stamp, postmark" },
  { hy: "Շրջվում է, մոմե կնիքը բացվում է, փեղկը բարձրանում է աստառի վրայով", en: "It turns, the wax seal breaks, the flap lifts over the liner" },
  { hy: "Քարտը դուրս է սահում, ծրարը հետ է ընկնում", en: "The card slides out, the envelope sinks away" },
  { hy: "Քարտի երեսը՝ անուններ, օր, վայր; հպումը շրջում է դեպի ծրագիրը", en: "The card front — names, date, venue; a tap turns it to the programme" },
  { hy: "Երբ — հետհաշվարկ, .ics", en: "When — countdown, .ics" },
  { hy: "Ծրագիր, քարտեզ, հրավիրողները", en: "Programme, map, invited by" },
  { hy: "RSVP ըստ կողմի՝ ուղեկից, սնունդ", en: "RSVP by side — plus-one, diet" },
  { hy: "Ծրարի թուղթ, աստառ, դրոշմանիշ, կնիք, ֆոն — քարտերի ստուդիայում", en: "Envelope paper, liner, stamp, seal, backdrop — in the card studio" },
];

const tierPrice = (tier: Tier): number => svc.pricing.tiers.find((x) => x.id === tier)?.price ?? 0;
const tierOf = (kind: ExampleKind, features: ExampleFeature[]): Tier =>
  kind === "engine" ? "premium" : kind === "web" ? (features.includes("film") || features.includes("music") ? "premium" : "basic") : "basic";

const catToOccasion = (c: TemplateSpec["category"]): ExampleOccasion => (c === "christening" ? "baptism" : c);
const styleToOccasion = (s: StyleSpec): ExampleOccasion => (s.occasion === "gala" ? "corporate" : s.occasion);

function fromTemplate(tp: TemplateSpec): Example {
  const f: ExampleFeature[] = [];
  if (tp.video) f.push("film");
  if (tp.audio) f.push("music");
  if (tp.blocks.rsvp) f.push("rsvp");
  if (tp.blocks.gallery) f.push("gallery");
  if (tp.blocks.timeline || tp.event.stops.length) f.push("timeline");
  if (tp.blocks.map) f.push("maps");
  if (tp.blocks.countdown || tp.blocks.ageCountdown) f.push("countdown");
  if (tp.blocks.dressCode) f.push("dress");
  const kind: ExampleKind = "web";
  const tier = tierOf(kind, f);
  return {
    id: tp.id, kind, occasion: catToOccasion(tp.category), name: tp.name, tagline: tp.tagline, cover: tp.cover,
    palette: [tp.theme.bg, tp.theme.accent, tp.theme.fg], features: f, tier, price: tierPrice(tier),
    sample: { a: tp.event.a, b: tp.event.b }, dark: tp.theme.dark,
    after: tp.after ?? { hy: "ԿՆԻՔ-ի սեփական ձևանմուշը", en: "KNIQ's own template" }, anatomy: templateAnatomy(tp),
  };
}

function fromStyle(st: StyleSpec): Example {
  const m = mockForStyle(st.id);
  const f: ExampleFeature[] = [];
  if (m.assets.hero[0]?.kind === "video") f.push("film");
  if (m.assets.audio) f.push("music");
  f.push("rsvp", "guests", "personal");
  if (m.features.gallery && m.assets.gallery.length) f.push("gallery");
  if (m.schedule.blocks.length) f.push("timeline");
  if (m.features.maps) f.push("maps");
  if (m.features.countdown?.enabled) f.push("countdown");
  if (m.features.calendar) f.push("calendar");
  if (m.features.dressCode) f.push("dress");
  const kind: ExampleKind = "engine";
  const tier = tierOf(kind, f);
  const [a, b] = m.identity.hosts;
  return {
    id: `live-${st.id}`, kind, occasion: styleToOccasion(st), name: st.name, tagline: st.tagline, cover: styleCovers[st.id],
    palette: [m.assets.palette.bg, m.assets.palette.accent, m.assets.palette.ink], features: f, tier, price: tierPrice(tier),
    sample: { a, b }, dark: m.assets.palette.dark,
    after: st.after, anatomy: st.anatomy,
  };
}

function fromCard(card: WCard, variant: WVariant): Example {
  const f: ExampleFeature[] = ["envelope", "personal", "rsvp", "timeline", "countdown", "music"];
  const kind: ExampleKind = "card";
  const tier = tierOf(kind, f);
  return {
    id: wTpl(card, variant), kind, occasion: "wedding", name: card.name, tagline: card.desc, cover: null, card: { card, variant },
    palette: [variant.paper, variant.a, variant.ink], features: f, tier, price: tierPrice(tier),
    sample: { a: { hy: "Նարե", en: "Nare" }, b: { hy: "Հայկ", en: "Hayk" } }, dark: Boolean(variant.dark),
    after: { hy: "Greenvelope-ի ծրարի տրամաբանությամբ՝ ԿՆԻՔ-ի սեփական դիզայն", en: "After the Greenvelope envelope logic — a KNIQ design" }, anatomy: CARD_ANATOMY,
    studio: `/wedding-cards/${card.id}?v=${variant.id}`,
  };
}

const KIDS_ANATOMY: T[] = [
  { hy: "Քարտի երեսը՝ երեխայի անունով, տարիքով և նկարազարդմամբ", en: "The card face — the child's name, the age, the illustration" },
  { hy: "Երբ և որտեղ՝ հետհաշվարկ, քարտեզ, .ics", en: "When and where — countdown, map, .ics" },
  { hy: "Ծնողների տողը և ձեր նշումը", en: "The parents' line and your note" },
  { hy: "RSVP՝ մեծահասակ/երեխա քանակ, ալերգիաներ", en: "RSVP — adult and child headcounts, allergies" },
  { hy: "Գույնը, նկարը, ձևը — քարտերի ստուդիայում", en: "Colourway, photo, shape — in the card studio" },
];

/** a kids' card as an orderable example: the same `kids-<card>-<variant>` tpl
 *  the studio mints, so /invitation/<tpl> already knows how to open it */
function fromKidsCard(card: KidsCard, variant: KidsVariant): Example {
  const f: ExampleFeature[] = ["personal", "rsvp", "countdown", "maps", "calendar"];
  const kind: ExampleKind = "card";
  const tier = tierOf(kind, f);
  return {
    id: kidsTpl(card, variant), kind, occasion: "birthday", name: card.name,
    tagline: { hy: "Մանկական քարտ, որը դառնում է կենդանի հրավեր", en: "A child's card that becomes a live invitation" },
    cover: null, kids: { card, variant },
    palette: [variant.paper, variant.a, variant.ink], features: f, tier, price: tierPrice(tier),
    sample: { a: { hy: "Արեն", en: "Aren" }, b: { hy: "6", en: "6" } }, dark: Boolean(variant.dark),
    after: { hy: "Paperless Post-ի մանկական բաժնի տրամաբանությամբ՝ ԿՆԻՔ-ի սեփական դիզայն", en: "After the logic of Paperless Post's kids' section — a KNIQ design" },
    anatomy: KIDS_ANATOMY,
    studio: `/kids/${card.id}?v=${variant.id}`,
  };
}

/** the wedding cards the wizard offers inline — the popular ten; the other
 *  thirty are one link away in /wedding-cards, where the envelope is chosen too */
export const wizardCards: WCard[] = wCards.filter((c) => c.popular).slice(0, 10);
/** the same rule for the kids' cards: the popular ones here, all 44 in /kids */
export const wizardKidsCards: KidsCard[] = kidsCards.filter((c) => c.popular).slice(0, 10);

const webExamples: Example[] = templates.map(fromTemplate);
const engineExamples: Example[] = engineStyles.map(fromStyle);
const cardExamples: Example[] = wizardCards.map((c) => fromCard(c, c.variants[0]));
const kidsExamples: Example[] = wizardKidsCards.map((c) => fromKidsCard(c, c.variants[0]));

/** every example, web first, then the engine, then the cards */
export const examples: Example[] = [...webExamples, ...engineExamples, ...cardExamples, ...kidsExamples];

/** the examples an occasion offers, in the order the picker shows them */
export function examplesFor(occasion: ExampleOccasion): Example[] {
  return examples.filter((e) => e.occasion === occasion);
}

/** resolve any tpl id — including a card colourway that is not in the popular
 *  ten (`wed-<design>-<colour>` from /wedding-cards) — to an example */
export function findExample(tpl: string | undefined | null): Example | undefined {
  if (!tpl) return undefined;
  const hit = examples.find((e) => e.id === tpl);
  if (hit) return hit;
  const w = parseWTpl(tpl);
  if (w) return fromCard(w.card, w.variant);
  // a kids' card from the studio (any of the 44, any colourway)
  const k = parseKidsTpl(tpl);
  return k ? fromKidsCard(k.card, k.variant) : undefined;
}

export const priceLabel = (e: Pick<Example, "price">) => formatAmd(e.price);
/** «Style C» — the letter the showcase uses for a wedding engine style */
export function styleLetter(e: Example): string | undefined {
  if (e.kind !== "engine") return undefined;
  const st = findStyle(e.id.slice(5));
  if (!st || st.occasion !== "wedding") return undefined;
  const i = engineStyles.filter((x) => x.occasion === "wedding").findIndex((x) => x.id === st.id);
  return i >= 0 ? "ABCDE"[i] : undefined;
}
export const tierName = (tier: Tier): T => svc.pricing.tiers.find((x) => x.id === tier)?.name ?? { hy: "", en: "" };

/** the wizard's default pick per occasion — the first web template */
export const defaultExample = (occasion: ExampleOccasion): Example => examplesFor(occasion)[0];
