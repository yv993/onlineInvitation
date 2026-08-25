import type { StaticImageData } from "next/image";
import type { T } from "@/lib/content";

// ============================================================================
// THE UNIFIED INVITATION SCHEMA — one typed object every ceremony and every
// template style renders from.
//
// Measured against the two references before it was written:
//   • iStudio /templates/1046 — gate («SAVE THE DATE · names · date · VIEW
//     INVITATION», music starts on tap) → 100svh hero (floral overlay, «WEDDING
//     INVITATION», the day numeral, month, monogram) → families line → «MOMENT»
//     photo → month calendar → RECEPTION block (time · venue · address · VIEW
//     MAP) → DRESS CODE → RSVP (name · guests · yes/no · CONFIRM) → «27 DAYS
//     LEFT» → scripture → footer;
//   • Invito W121 — hero (names · «Save the date» · OCT 12 2026 · music) →
//     greeting paragraph → countdown 54 : 14 : 27 : 46 → photo → month
//     calendar → photos → «Ժամանակացույց» timeline (icon per stop: groom,
//     bride, church, ring, restaurant · time badge · address · map pin) →
//     photos → dress-code swatches + «avoid white» note → «Details» caution
//     → RSVP (yes/no · which side · name · guest count · comment) → footer.
//
// Every section either reference has is a field here; every field is
// bilingual (T) or a plain value; the same object feeds a classic serif
// layout, a cinematic video one, and the engagement / baptism / birthday /
// gala variants. Nothing is fetched at render: media are static imports or
// same-origin files, the RSVP posts to /api/rsvp, the export is the guest
// book's own CSV / Sheets webhook.
// ============================================================================

export type EventType = "wedding" | "engagement" | "baptism" | "birthday" | "gala";

/** the nine render styles the engine ships */
export type TemplateStyle =
  | "classic-floral" // Style A — after Invito W121
  | "modern-cinematic" // Style B — after iStudio 1046, with a video hero
  | "boarding-pass" // Style C — after AreOne «Wedding Ticket» (destination wedding)
  | "pearl-editorial" // Style D — after AreOne «Pearls» (editorial, pearl-string programme)
  | "dusty-blue" // Style E — after the Ewedlab dusty-blue envelope reveal (the video invitation, as a page)
  | "engagement-save-the-date"
  | "baptism-kunk"
  | "birthday-anniversary"
  | "gala-corporate";

export type Media =
  | { kind: "image"; src: StaticImageData | string; alt: T; focus?: string }
  | { kind: "video"; src: string; poster: StaticImageData | string; alt: T; synthesized?: boolean };

export type Palette = {
  bg: string; // page ground
  ink: string; // text on bg (≥ 7:1 with bg — measured before use)
  soft: string; // secondary text
  accent: string; // ornament colour (may fail text contrast on purpose)
  accentInk: string; // the same hue, text-safe on bg
  panel: string; // glass panel tint (rgba)
  dark: boolean; // dark ground → light chrome
};

export type FontFace = "serif" | "script" | "sans" | "display" | "kids";

export type ScheduleIcon =
  | "groom" | "bride" | "church" | "rings" | "reception" | "photo" | "car" | "cake" | "party" | "toast"
  | "font" | "gala" | "speech" | "gift" | "music" | "dance" | "registry" | "home" | "flowers" | "candle"
  // the venues a day actually passes through (2026-08-24) — every stop on the
  // route can now name its PLACE, not just its act
  | "restaurant" | "hall" | "garden" | "hotel" | "farewell" | "fireworks" | "cocktail" | "vows";

export type ScheduleBlock = {
  id: string;
  icon: ScheduleIcon;
  time: string; // HH:MM, Armenia time
  title: T;
  venue: T;
  address?: T;
  /** a pin the couple pasted — https, host allow-listed (Google / Yandex / Apple) */
  mapUrl?: string;
  note?: T;
};

export type CountdownStyle = "days" | "dhms" | "age";

export type RsvpConfig = {
  enabled: boolean;
  /** ISO date-time; enforced server-side by /api/rsvp when the answer carries it */
  deadline?: string;
  askSide?: boolean;
  sides?: [T, T];
  askGuests: boolean;
  maxGuests?: number;
  askDiet?: boolean;
  dietOptions?: T[];
  askAllergy?: boolean;
  askMessage?: boolean;
  /** kids' parties: adult / child headcounts instead of one number */
  askCounts?: boolean;
  /** where the answers go — the guest book (Excel/CSV) and, if RSVP_WEBHOOK is set, a Google Sheet */
  export: "excel" | "sheets" | "both";
  /** the tag the guest book files the answer under */
  event: string;
  presentation: "inline" | "modal";
};

export type Features = {
  countdown?: { enabled: boolean; style: CountdownStyle; label?: T };
  /** month grid, or the three-day strip (the day before · THE day · the day after) */
  calendar?: { enabled: boolean; mode?: "month" | "strip" };
  maps?: { provider: "google" | "yandex"; directions: boolean };
  /** swatches; `labels` names them (IVORY · TAUPE · NAVY), `shape` draws them as
   *  hearts or fabric circles, `link` is the «View examples» anchor to the gallery */
  dressCode?: { swatches: string[]; labels?: T[]; shape?: "circle" | "heart" | "fabric"; note?: T; label?: T; link?: T };
  gallery?: { layout: "grid" | "masonry" | "strip" | "pair"; lightbox: boolean; label?: T };
  rsvp: RsvpConfig;
  ics?: boolean;
  share?: boolean;
  music?: { autoplayOnGate: boolean; showControl: boolean };
  /** the tap-to-open screen: a card with names, a boarding-pass ticket, or the
   *  embossed gatefold envelope whose two flaps swing open */
  gate?: { enabled: boolean; label?: T; button?: T; variant?: "card" | "ticket" | "gatefold" };
  /** «THE details»: a QR of this very page for the guest to keep / forward */
  qr?: boolean;
  epigraph?: { text: T; from: T };
  details?: T[]; // extra notes («Details», caution paragraphs)
};

export type Extras = {
  godparents?: { a: string; b: string; dedication?: T };
  parents?: T;
  born?: string; // YYYY-MM-DD → age counter
  messageBoard?: boolean;
  registry?: { note: T; links?: Array<{ label: T; href: string }> };
  saveTheDate?: boolean;
  speakers?: Array<{ name: string; role: T }>;
  agenda?: boolean; // gala: tabs instead of a timeline
  /** the couple's Telegram / WhatsApp channel card («Our channel — Join») */
  channel?: { label: T; note: T; url?: string };
  /** «Wishes» — the gift note (pearls style) */
  wishes?: { title?: T; text: T };
  /** «Recommended hotel» (dusty-blue «details») */
  hotel?: { name: T; address: T; mapUrl?: string };
  /** the luggage tag: DESTINATION · place · region (boarding pass) */
  destination?: { label?: T; place: T; region: T };
};

export type InvitationData = {
  id: string;
  type: EventType;
  style: TemplateStyle;
  identity: {
    /** one name for a birthday or a gala host, two for a couple / child + parent */
    hosts: [T] | [T, T];
    kicker: T; // «WEDDING INVITATION», «Save the date», «Ծննդյան հրավեր»
    subtitle?: T; // hero sub-line
    families?: T; // «Together with their families» / the parents
    blurb?: T; // the greeting paragraph («Սիրելի՛ հարազատներ…»)
    date: string; // ISO with +04:00
    end?: string;
    city: T;
    monogram?: { a: string; b: string };
  };
  assets: {
    hero: Media[]; // first = the hero; a video first for cinematic
    palette: Palette;
    font: FontFace;
    audio?: { src: string; label: T; synthesized?: boolean };
    gallery: Media[];
    /** decorative overlay: floral corners, clouds, confetti canvas… */
    ambient?: "floral" | "petals" | "clouds" | "confetti" | "neon" | "sparkles" | "gold" | "grid" | "planes" | "pearls" | "butterflies" | "none";
  };
  schedule: { title?: T; subtitle?: T; blocks: ScheduleBlock[]; connector?: "path" | "line" | "flight" | "pearls" | "none" };
  features: Features;
  extras?: Extras;
  meta: {
    sample: boolean; // drives the honesty footer
    footerLine?: T; // «Սիրով կսպասենք»
    contact?: string; // a phone the couple chose to print — never invented
  };
};

/** what a section component needs to know about the surrounding page */
export type RenderCtx = {
  /** ru is guest-facing: untranslated labels fall back to English (lib/i18n) */
  lang: "hy" | "en" | "ru";
  data: InvitationData;
  guest?: string; // ?g=
  blob?: string; // ?p= — feeds the .ics and the RSVP tag
  compact?: boolean; // the wizard's live preview: hero + countdown + first block
  embed?: boolean; // every section, inside a host's own scroll frame (no gate, no motion, no QR of the host URL)
};
