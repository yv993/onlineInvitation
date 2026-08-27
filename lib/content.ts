// ============================================================================
// ԿՆԻՔ — every word on the invitation, in both languages, in one file.
//
// THIS IS SAMPLE CONTENT. Nare and Hayk do not exist; the date, the addresses
// and the hall are invented. That is deliberate — this build is the showpiece
// Vardan shows clients, not a real couple's invitation, and putting a real
// couple's names, venues and wedding date on a public demo is not ours to do.
// `sample: true` below drives the one honest line in the footer that says so.
//
// TO MAKE THIS A REAL INVITATION: change this file. Nothing else. Every
// component reads from here — names, monogram, date, the three stops, the
// gallery captions, the RSVP deadline, the FAQ. The calendar grid and the
// countdown are COMPUTED from `date`, so moving the wedding moves them both.
//
// BILINGUAL BY CONSTRUCTION: every visible string is a `T` — { hy, en }. There
// is no "translate later" path and no English-shaped Armenian: the Armenian is
// written first and the English follows it, because the guests who matter most
// here read Armenian. `t(lang, value)` in lib/i18n.ts is the only reader.
// ============================================================================

export type Lang = "hy" | "en" | "ru";

/** One string, every language. Armenian and English are REQUIRED — nothing
 *  user-visible may be a bare string. Russian is OPTIONAL and guest-facing:
 *  where a string has no `ru`, the Russian page falls back to English (see
 *  lib/i18n.ts → t). The guest surface — the templates' blocks, the RSVP
 *  forms, the date words — carries `ru`; the marketing site stays hy/en. */
export type T = { hy: string; en: string; ru?: string };

export type Stop = {
  /** 24h, "HH:MM" — sorted and rendered from this, never re-typed in the JSX */
  time: string;
  name: T;
  place: T;
  /** Street line as a guest would give it to a taxi driver */
  address: T;
  /** Yandex Maps is what people actually use in Armenia — not Google. */
  map: string;
  note?: T;
};

export type FaqItem = { q: T; a: T };

export const site = {
  /** Used for <title>, OG and the .ics filename */
  name: "ԿՆԻՔ",
  nameLatin: "KNIQ",
  /** Set NEXT_PUBLIC_SITE_URL in production; sitemap/robots refuse to emit
   *  localhost URLs, same guard as KAR and ArpenArt. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
};

export const couple = {
  /** Order matters: this is the order they are printed in, everywhere. */
  a: { hy: "Նարե", en: "Nare" } as T,
  b: { hy: "Հայկ", en: "Hayk" } as T,
  /** The two glyphs pressed into the wax seal. Armenian letters, because the
   *  seal is the first thing a guest sees and it should be in their alphabet. */
  monogram: { a: "Ն", b: "Հ" },
  /** ISO 8601 with the Armenia offset (+04:00, no DST since 2012). Getting the
   *  offset wrong shifts the countdown by four hours for anyone abroad — which
   *  is exactly the guest most likely to be watching it. */
  date: "2026-10-10T12:30:00+04:00",
  /** The moment the party is over, for the .ics DTEND. */
  end: "2026-10-11T00:00:00+04:00",
  /** RSVP cut-off. Rendered, counted down to, and enforced by /api/rsvp. */
  rsvpBy: "2026-09-20T23:59:00+04:00",
  /** Flips the footer's honesty line. Set false on a real couple's build. */
  sample: true,
};

// Both references play a track behind the card, and it is a real part of the
// genre. Ours ships SILENT on purpose: the music a couple wants is almost
// always a commercial recording, and the licence for it is theirs to hold, not
// something to bundle into a demo. Drop a file at public/audio/ and name it
// here — the control, the autoplay-policy handling and the reduced-motion gate
// are all already built in Chrome.tsx and appear the moment this is non-null.
export const music: { src: string; credit: string } | null = null;

// ============================================================================
// OCCASIONS — naiva sells six, iStudio five (weddings 38 · birthdays 5 ·
// baptisms 4 · commercial 2 in their catalog). The card's structure is the
// same for all of them; what changes is the kicker over the names, the
// calendar summary and the words on the catalog filter. Four here — the
// four an Armenian family actually sends a card for.
// ============================================================================

export type Occasion = "wedding" | "engagement" | "baptism" | "birthday" | "corporate";

export const occasions: Record<
  Occasion,
  { name: T; kicker: T; calendarTitle: T; namesLabel: T }
> = {
  wedding: {
    name: { hy: "Հարսանիք", en: "Wedding" },
    kicker: { hy: "Հրավիրում ենք", en: "You are invited" },
    calendarTitle: { hy: "Հարսանիք", en: "Wedding" },
    namesLabel: { hy: "Հարսի և փեսայի անունները", en: "The couple's names" },
  },
  engagement: {
    name: { hy: "Նշանադրություն", en: "Engagement" },
    kicker: { hy: "Նշանվում ենք", en: "We are getting engaged" },
    calendarTitle: { hy: "Նշանադրություն", en: "Engagement" },
    namesLabel: { hy: "Ձեր անունները", en: "Your names" },
  },
  baptism: {
    name: { hy: "Կնունք", en: "Baptism" },
    kicker: { hy: "Կնունքի հրավեր", en: "A christening" },
    calendarTitle: { hy: "Կնունք", en: "Baptism" },
    namesLabel: { hy: "Երեխայի և ծնողի անունները", en: "The child's and a parent's names" },
  },
  birthday: {
    name: { hy: "Ծնունդ", en: "Birthday" },
    kicker: { hy: "Ծննդյան հրավեր", en: "A birthday" },
    calendarTitle: { hy: "Ծնունդ", en: "Birthday" },
    namesLabel: { hy: "Անունը և տարիքը", en: "The name and the age" },
  },
  // iStudio lists Կոմերցիոն (2), naiva Կոմերցիոն — a company gala, a launch,
  // an anniversary dinner. Same card; the two "names" become the host and
  // the event, the RSVP drops the bride's-side/groom's-side question.
  corporate: {
    name: { hy: "Կորպորատիվ", en: "Corporate" },
    kicker: { hy: "Հրավիրում ենք", en: "You are invited" },
    calendarTitle: { hy: "Միջոցառում", en: "Event" },
    namesLabel: { hy: "Կազմակերպիչը և միջոցառումը", en: "The host and the event" },
  },
};

/** Which occasions join their two "names" with an ampersand (two people) and
 *  which with a middot (a name and an age, a host and an event). */
export const occasionJoinsPeople = (o: Occasion) =>
  o === "wedding" || o === "engagement" || o === "baptism";

/** Which occasions seat guests by side. */
export const occasionHasSides = (o: Occasion) => o === "wedding" || o === "engagement";

export const hero = {
  kicker: { hy: "Հրավիրում ենք", en: "You are invited" } as T,
  /** What the event IS — for the .ics SUMMARY. A calendar entry reading
   *  "Nare & Hayk — You are invited" tells the guest nothing six weeks later;
   *  it has to name the event, because by then the card is out of the thread. */
  calendarTitle: { hy: "Հարսանիք", en: "Wedding" } as T,
  /** The date as TYPE — big, spaced, unmissable. Not derived, because the
   *  visual treatment (dots, not slashes) is a design decision. */
  stamp: "10 · 10 · 2026",
  weekday: { hy: "Շաբաթ", en: "Saturday" } as T,
  place: { hy: "Երևան", en: "Yerevan" } as T,
  scroll: { hy: "Թերթիր", en: "Scroll" } as T,
};

export const invitation = {
  kicker: { hy: "Սիրելի բարեկամներ", en: "Dear friends" } as T,
  /** THE FAMILIES INVITE — measured off iStudio 1049, which opens its
   *  invitation with «Պետրոսյանների եվ Գրիգորյանների ընտանիքները սիրով
   *  հրավիրում են…». That is the traditional Armenian form: the invitation
   *  is issued by the two families, not by the couple, and a card missing
   *  this line reads as Western-translated to the older half of the guest
   *  list — exactly the people the form matters to. Our phrasing, not theirs. */
  families: {
    hy: "Ավագյան և Մանուկյան ընտանիքները սիրով հրավիրում են Ձեզ՝ կիսելու իրենց զավակների ուրախությունը։",
    en: "The Avagyan and Manukyan families warmly invite you to share in the joy of their children.",
  } as T,
  /** The one line that carries the whole card. Kept short enough to set on
   *  two lines at 390px without hyphenating. */
  line: {
    hy: "Երկու ճանապարհ, մեկ տուն։",
    en: "Two roads, one home.",
  } as T,
  /** The epigraph. Scripture, not copy — Mark 10:9 is THE Armenian wedding
   *  verse (it is the one on the reference too, because it is the one read at
   *  the ceremony itself). Closes the band like a blessing. */
  epigraph: {
    hy: "«Արդ, ինչ որ Աստված միավորեց, մարդը թող չբաժանի»",
    en: "“What therefore God has joined together, let no one separate.”",
  } as T,
  epigraphFrom: { hy: "Մարկոս 10:9", en: "Mark 10:9" } as T,
  body: [
    {
      hy: "Հոկտեմբերի 10-ին մենք ամուսնանում ենք։",
      en: "On the tenth of October, we are getting married.",
    },
    {
      hy: "Կուզենայինք, որ այդ օրը մեզ հետ լինեք՝ խոսքով, ծափով, պարով և այն լուռ հայացքներով, որոնք մնում են լուսանկարներից դուրս։",
      en: "We would like you there with us — for the words, the applause, the dancing, and the quiet looks that never make it into the photographs.",
    },
    {
      hy: "Սպասում ենք ձեզ։",
      en: "We will be waiting for you.",
    },
  ] as T[],
};

export const countdown = {
  title: { hy: "Մնաց", en: "Until then" } as T,
  units: {
    d: { hy: "օր", en: "days" } as T,
    h: { hy: "ժամ", en: "hours" } as T,
    m: { hy: "րոպե", en: "min" } as T,
    s: { hy: "վայրկյան", en: "sec" } as T,
  },
  /** Shown once the date has passed — a wedding invitation outlives the
   *  wedding, and a countdown stuck at zero looks broken. */
  after: { hy: "Շնորհակալություն, որ մեզ հետ էիք։", en: "Thank you for being there." } as T,
};

export const calendar = {
  title: { hy: "Հոկտեմբեր 2026", en: "October 2026" } as T,
  /** Monday-first — the Armenian and European week. (The references start on
   *  Sunday, which is the US convention and wrong for this audience.) */
  weekdays: {
    hy: ["Երկ", "Երք", "Չոր", "Հնգ", "Ուր", "Շաբ", "Կիր"],
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  },
  add: { hy: "Ավելացնել օրացույցում", en: "Add to calendar" } as T,
};

export const programme = {
  title: { hy: "Օրվա ընթացքը", en: "The day" } as T,
  lead: {
    hy: "Երեք կանգառ՝ առավոտից մինչև վերջին պարը։",
    en: "Three stops, from the morning to the last dance.",
  } as T,
  howTo: { hy: "Ինչպես հասնել", en: "Directions" } as T,
  stops: [
    {
      time: "12:30",
      name: { hy: "Հարսի տուն", en: "The bride's home" },
      place: { hy: "Ընտանեկան հավաք", en: "Family gathering" },
      address: { hy: "Մաշտոցի պող. 24, Երևան", en: "24 Mashtots Ave, Yerevan" },
      map: "https://yandex.com/maps/10262/yerevan/",
      note: {
        hy: "Եկեք շուտ՝ սուրճը տաք է։",
        en: "Come early — the coffee is on.",
      },
    },
    {
      time: "15:00",
      name: { hy: "Պսակադրություն", en: "The ceremony" },
      place: { hy: "Սուրբ Աստվածածին եկեղեցի", en: "Surb Astvatsatsin Church" },
      address: { hy: "Երևան", en: "Yerevan" },
      map: "https://yandex.com/maps/10262/yerevan/",
      note: {
        hy: "Խնդրում ենք լինել 14:45-ին։",
        en: "Please be seated by 14:45.",
      },
    },
    {
      // The reference's programme has FOUR stops, and the fourth is the one a
      // Western template never thinks of: ՔԿԱԳ, the civil registry ceremony —
      // in practice held at the hall just before the banquet. An Armenian
      // wedding day genuinely has this stop; a programme without it is
      // incomplete for the guests who plan around it.
      time: "17:30",
      name: { hy: "ՔԿԱԳ արարողություն", en: "Civil ceremony" },
      place: { hy: "«Ոսկե Այգի» սրահ", en: "Voske Aygi hall" },
      address: { hy: "Երևանյան խճուղի, Երևան", en: "Yerevanyan Highway, Yerevan" },
      map: "https://yandex.com/maps/10262/yerevan/",
      note: {
        hy: "Պաշտոնական գրանցումը՝ սրահում։",
        en: "The official registration, at the hall.",
      },
    },
    {
      time: "18:00",
      name: { hy: "Հարսանյաց խնջույք", en: "The banquet" },
      place: { hy: "«Ոսկե Այգի» սրահ", en: "Voske Aygi hall" },
      address: { hy: "Երևանյան խճուղի, Երևան", en: "Yerevanyan Highway, Yerevan" },
      map: "https://yandex.com/maps/10262/yerevan/",
      note: {
        hy: "Ավտոկայանատեղին ազատ է։",
        en: "Parking on site.",
      },
    },
  ] as Stop[],
};

// ============================================================================
// ՎԱՅՐԵՐԸ — the two destination venues, as illustrated cards.
//
// Straight from the reference's anatomy: iStudio dedicates a band to the two
// big venues, each with a HAND-DRAWN SKETCH of the building (a pencil study of
// Surb Mariam Astvatsatsin, another of Afina Hall), a chip naming the event, a
// display-size venue name, the address, and a ՔԱՐՏԵԶ button with a shimmer
// sweep. It is the most distinctive thing on their card.
//
// Ours are original SVG line drawings (an Armenian church with its conical
// dome; an arched pavilion) that DRAW THEMSELVES as the band scrolls into
// view — stroke-dashoffset under GSAP, which is a register neither reference
// can reach with AOS. The addresses repeat the programme's on purpose: the
// programme answers "when", this band answers "where is that".
// ============================================================================

export type Venue = {
  art: "church" | "hall";
  chip: T;
  name: T;
  address: T;
  map: string;
};

export const venues = {
  title: { hy: "Վայրերը", en: "The places" } as T,
  mapWord: { hy: "Քարտեզ", en: "Map" } as T,
  list: [
    {
      art: "church",
      chip: { hy: "Պսակադրություն", en: "Ceremony" },
      name: { hy: "Սուրբ Աստվածածին եկեղեցի", en: "Surb Astvatsatsin Church" },
      address: { hy: "Երևան", en: "Yerevan" },
      map: "https://yandex.com/maps/10262/yerevan/",
    },
    {
      art: "hall",
      chip: { hy: "Խնջույք", en: "Banquet" },
      name: { hy: "«Ոսկե Այգի» սրահ", en: "Voske Aygi hall" },
      address: { hy: "Երևանյան խճուղի, Երևան", en: "Yerevanyan Highway, Yerevan" },
      map: "https://yandex.com/maps/10262/yerevan/",
    },
  ] as Venue[],
};

export const gallery = {
  title: { hy: "Մենք", en: "Us" } as T,
  lead: {
    hy: "Մի քանի կադր՝ մինչև այս օրը։",
    en: "A few frames from before all this.",
  } as T,
};

export const rsvp = {
  title: { hy: "Հաստատեք ներկայությունը", en: "Let us know" } as T,
  lead: {
    hy: "Խնդրում ենք պատասխանել մինչև սեպտեմբերի 20-ը, որ սեղանը ձեզ սպասի։",
    en: "Please reply by 20 September, so there is a seat with your name on it.",
  } as T,
  fields: {
    name: { hy: "Ձեր անունը", en: "Your name" } as T,
    guests: { hy: "Հյուրերի քանակը", en: "How many of you" } as T,
    side: { hy: "Ում կողմից եք", en: "Whose guest are you" } as T,
    sideBride: { hy: "Հարսի", en: "The bride's" } as T,
    sideGroom: { hy: "Փեսայի", en: "The groom's" } as T,
    sideBoth: { hy: "Երկուսի", en: "Both" } as T,
    coming: { hy: "Կկարողանա՞ք գալ", en: "Can you come" } as T,
    yes: { hy: "Այո, կգանք", en: "Yes, we'll be there" } as T,
    no: { hy: "Ցավոք, ոչ", en: "Sadly, no" } as T,
    message: { hy: "Երկու խոսք (ըստ ցանկության)", en: "A word for us (optional)" } as T,
    /* The two fields the global platforms all collect and neither Armenian
       reference does. Dietary needs go straight to the caterer; plus-one
       names go straight to the seating plan. Both optional. */
    diet: { hy: "Սննդային նախընտրություններ (ըստ ցանկության)", en: "Dietary needs (optional)" } as T,
    dietPh: { hy: "օր. բուսակեր, առանց գլյուտենի…", en: "e.g. vegetarian, gluten-free…" } as T,
    plusOne: { hy: "Ձեզ հետ եկողների անունները (ըստ ցանկության)", en: "Names of those coming with you (optional)" } as T,
    send: { hy: "Ուղարկել", en: "Send" } as T,
    sending: { hy: "Ուղարկվում է…", en: "Sending…" } as T,
  },
  /** Both outcomes get their own words — "thanks!" for a decline is careless. */
  doneYes: {
    hy: "Ստացանք։ Ուրախ ենք, որ կլինեք։",
    en: "Got it. We're glad you'll be there.",
  } as T,
  doneNo: {
    hy: "Ստացանք։ Կկարոտենք ձեզ։",
    en: "Got it. We'll miss you.",
  } as T,
  /** Shown when the server has no mail transport configured. Never claim a
   *  message was delivered when nothing was sent — the ArpenArt rule. */
  undelivered: {
    hy: "Պատասխանը գրանցվեց այս սարքում, բայց նամակ դեռ չի ուղարկվում։",
    en: "Your answer was recorded on this device, but no email has been sent yet.",
  } as T,
  closed: {
    hy: "Պատասխանների ժամկետը լրացել է։ Զանգահարեք մեզ։",
    en: "The RSVP window has closed. Please call us instead.",
  } as T,
  change: { hy: "Փոխել պատասխանը", en: "Change the answer" } as T,
};

export const details = {
  title: { hy: "Մանրամասներ", en: "Good to know" } as T,
  items: [
    {
      q: { hy: "Հագուստ", en: "What to wear" },
      a: {
        hy: "Տոնական։ Խնդրում ենք սպիտակը թողնել հարսին։",
        en: "Festive. We ask you to leave white to the bride.",
      },
    },
    {
      q: { hy: "Նվերներ", en: "Gifts" },
      a: {
        hy: "Ձեր ներկայությունը բավական է։ Եթե շատ եք ուզում՝ մի բան, որ կմնա տանը։",
        en: "Your being there is plenty. If you insist — something that stays in a home.",
      },
    },
    {
      q: { hy: "Երեխաներ", en: "Children" },
      a: {
        hy: "Անպայման բերեք։ Սրահում կլինի առանձին անկյուն նրանց համար։",
        en: "Please bring them. There is a corner of the hall that belongs to them.",
      },
    },
    {
      q: { hy: "Ավտոկայանատեղի", en: "Parking" },
      a: {
        hy: "Սրահի դիմաց՝ ազատ։ Եկեղեցու մոտ խորհուրդ ենք տալիս տաքսի։",
        en: "Free in front of the hall. For the church, we'd take a taxi.",
      },
    },
  ] as FaqItem[],
};

export const foot = {
  line: { hy: "Տեսնվենք հոկտեմբերի 10-ին", en: "See you on the tenth of October" } as T,
  names: { hy: "Նարե և Հայկ", en: "Nare and Hayk" } as T,
  /** The honest line. Rendered only while couple.sample is true. */
  sampleNote: {
    hy: "Սա ցուցադրական հրավիրատոմս է։ Անունները, ամսաթիվը և հասցեները հորինված են։",
    en: "This is a sample invitation. The names, the date and the addresses are invented.",
  } as T,
};

export const ui = {
  /** The envelope gate */
  open: { hy: "Բացել", en: "Open" } as T,
  openHint: { hy: "Հպվեք կնիքին", en: "Tap the seal" } as T,
  /** Music toggle — both references have one, and both hide what it does. */
  musicOn: { hy: "Միացնել երաժշտությունը", en: "Play music" } as T,
  musicOff: { hy: "Անջատել երաժշտությունը", en: "Pause music" } as T,
  /** Language toggle */
  lang: { hy: "EN", en: "ՀԱՅ" } as T,
  langLabel: { hy: "Switch to English", en: "Անցնել հայերենի" } as T,
  skip: { hy: "Անցնել բովանդակությանը", en: "Skip to content" } as T,
};

/** Greeting for a personalised link (/?g=Ani). Neither reference does this,
 *  and it is the cheapest luxury on the whole card. */
export const personal = {
  greet: { hy: "Հարգելի", en: "Dear" } as T,
};

// iStudio's included-in-every-template list has «Վիդեո» on it. The slot is
// here with its full contract (self-hosted file, poster, native controls, no
// autoplay); it ships null for the same reason the music does — wedding film
// belongs to the couple and their videographer, and a demo has no business
// bundling someone else's. Name a file and the band appears.
export const film: { src: string; poster?: string; label: T } | null = null;

/** The share row. In Armenia an invitation travels through WhatsApp and
 *  Telegram threads — an aunt forwards it to the cousins — so the card offers
 *  the forward itself. Plain share URLs, no SDKs, nothing loaded from either
 *  platform. */
export const share = {
  title: { hy: "Փոխանցեք հրավերը", en: "Pass the invitation on" } as T,
  text: {
    hy: "Նարե և Հայկ — հարսանիք, 10 հոկտեմբերի 2026",
    en: "Nare & Hayk — wedding, 10 October 2026",
  } as T,
  copy: { hy: "Պատճենել հղումը", en: "Copy the link" } as T,
  copied: { hy: "Պատճենվեց", en: "Copied" } as T,
};

// ============================================================================
// THE SERVICE — KNIQ as a business, not one couple's card.
//
// The structure follows what the platform world converges on (measured on
// naiva, iStudio /weblink, and the global set — Greenvelope, WithJoy,
// Paperless Post, InviteDrop): a value hero → how-it-works in three steps →
// the style catalog → what every invitation includes → the order form → FAQ.
// naiva and iStudio both run the CONCIERGE model — choose a template, send
// your details, receive the finished link in 1–2 days — and that is the model
// this form serves, because it is the model that works without accounts.
// ============================================================================

export const svc = {
  hero: {
    kicker: { hy: "Թվային հրավիրատոմսեր", en: "Digital invitations" } as T,
    title: {
      hy: "Հրավերը, որ բացվում է կնիքից",
      en: "The invitation that opens from a seal",
    } as T,
    sub: {
      hy: "Ընտրեք ոճը, ուղարկեք ձեր օրվա մանրամասները, և հյուրերին տվեք մեկ հղում՝ ծրագրով, քարտեզներով, հաշվարկով և պատասխանի ձևով։",
      en: "Choose a style, send us your day, and hand your guests one link — with the programme, the maps, the countdown and the RSVP.",
    } as T,
    cta: { hy: "Դիտել ոճերը", en: "See the styles" } as T,
    cta2: { hy: "Բացել օրինակը", en: "Open the sample" } as T,
  },

  steps: {
    title: { hy: "Ինչպես է աշխատում", en: "How it works" } as T,
    list: [
      {
        t: { hy: "Ընտրեք ոճը", en: "Choose the style" },
        d: {
          hy: "Երեք մշակված ուղղություն։ Ամեն մեկը բացվում է որպես կենդանի հրավեր՝ փորձեք հենց հիմա։",
          en: "Three designed directions. Each opens as a live invitation — try them right now.",
        },
      },
      {
        t: { hy: "Պատմեք ձեր օրվա մասին", en: "Tell us about your day" },
        d: {
          hy: "Անուններ, օր, ժամեր, վայրեր, ծրագիր։ Մեկ ձև՝ ներքևում, հինգ րոպե։",
          en: "Names, date, times, places, programme. One form below, five minutes.",
        },
      },
      {
        t: { hy: "Ուղարկեք հյուրերին", en: "Send it to your guests" },
        d: {
          hy: "1–2 օրում ստանում եք ձեր հղումը՝ WhatsApp-ով և Telegram-ով կիսվելու կոճակներով, և հյուրերի ցուցակը՝ Excel-ով։",
          en: "Within 1–2 days you get your link — with WhatsApp and Telegram share built in, and the guest list in Excel.",
        },
      },
    ] as Array<{ t: T; d: T }>,
  },

  catalog: {
    title: { hy: "Ոճերը", en: "The styles" } as T,
    lead: {
      hy: "Ամեն ոճ նույն ստուգված հրավերն է՝ իր գույներով և տրամադրությամբ։ Բացեք և թերթեք՝ որպես հյուր։",
      en: "Every style is the same verified invitation wearing its own palette and mood. Open one and read it as a guest would.",
    } as T,
    view: { hy: "Բացել օրինակը", en: "Open the sample" } as T,
    pick: { hy: "Ընտրել այս ոճը", en: "Choose this style" } as T,
    fromWord: { hy: "սկսած", en: "from" } as T,
    bothLangs: {
      hy: "Գինը ներառում է երեք լեզուն՝ հայերեն, անգլերեն, ռուսերեն։",
      en: "The price includes all three guest languages — Armenian, English and Russian.",
    } as T,
  },

  features: {
    title: { hy: "Ամեն հրավեր ներառում է", en: "Every invitation includes" } as T,
    list: [
      { hy: "Զմուռսե կնիքով ծրար, որ բացվում է հպումից", en: "A wax-sealed envelope that opens at a tap" },
      { hy: "Օրվա ծրագիրը՝ ինչ է լինելու, որտեղ և երբ", en: "The day's programme — what happens, where and when" },
      { hy: "Քարտեզի հղումներ ամեն կանգառի համար", en: "Map links for every stop" },
      { hy: "Հետհաշվարկ և օրացույց՝ մեկ հպումով հեռախոսում", en: "A countdown and add-to-calendar in one tap" },
      { hy: "Պատասխանի ձև՝ հյուրերի քանակով և կողմով", en: "RSVP with guest count and side" },
      { hy: "Հյուրերի ցուցակ ձեզ համար՝ Excel արտահանումով", en: "A guest list for you, with Excel export" },
      { hy: "Անվանական հղումներ՝ «Հարգելի Անի…»", en: "Personalised links — “Dear Ani…”" },
      { hy: "Երեք լեզու՝ առանց հավելավճարի (ՀԱՅ · EN · РУС)", en: "Three languages at no extra charge (ՀԱՅ · EN · РУС)" },
      { hy: "Կիսվելու կոճակներ WhatsApp-ի և Telegram-ի համար", en: "Share buttons for WhatsApp and Telegram" },
      { hy: "Նկարներ, երաժշտություն և տեսանյութ՝ ըստ ցանկության", en: "Photos, music and film, as you wish" },
    ] as T[],
  },

  /** Site nav — the five links of the blueprint, in the reference's order:
   *  Home · Templates · Features · Pricing · Order. Anchors on the landing,
   *  real routes elsewhere. */
  nav: {
    home: { hy: "Գլխավոր", en: "Home" } as T,
    styles: { hy: "Ոճեր", en: "Templates" } as T,
    features: { hy: "Հնարավորություններ", en: "Features" } as T,
    pricing: { hy: "Գներ", en: "Pricing" } as T,
    how: { hy: "Ինչպես", en: "How" } as T,
    order: { hy: "Պատվիրել", en: "Order" } as T,
    build: { hy: "Ստեղծել հրավեր", en: "Create invitation" } as T,
    kids: { hy: "Քարտեր", en: "Cards" } as T,
    menu: { hy: "Ընտրացանկ", en: "Menu" } as T,
    close: { hy: "Փակել", en: "Close" } as T,
  },

  /** Section 3 — the category grid (weddings, engagements, baptisms,
   *  birthdays, corporate). Each card lands in the order flow with the
   *  occasion preselected. */
  categories: {
    title: { hy: "Ինչի՞ համար է հրավերը", en: "What is the invitation for" } as T,
    lead: {
      hy: "Նույն մշակված քարտը՝ ամեն առիթի համար։ Ընտրեք՝ ու սկսենք։",
      en: "The same considered card, for every occasion. Choose one and begin.",
    } as T,
    hint: { hy: "Սկսել", en: "Start" } as T,
    blurb: {
      wedding: { hy: "Ծրար, կնիք, օրվա ծրագիրը, երկու կողմով պատասխան։", en: "Envelope, seal, the day's programme, an RSVP by side." },
      engagement: { hy: "Ավելի թեթև երեկո՝ նույն ծիսակարգով։", en: "A lighter evening, with the same ceremony." },
      baptism: { hy: "Եկեղեցի, ընտանիք, հանգիստ գույներ։", en: "Church, family, quiet colours." },
      birthday: { hy: "Անունը, տարիքը, և որտեղ է խնջույքը։", en: "The name, the age, and where the party is." },
      corporate: { hy: "Կազմակերպիչը, միջոցառումը, ժամանակացույցը։", en: "The host, the event, the schedule." },
    } as Record<Occasion, T>,
  },

  /** Section 4 — the showcase's own controls. */
  showcase: {
    live: { hy: "Կենդանի նախադիտում", en: "Live preview" } as T,
    photo: { hy: "Նկար", en: "Photo" } as T,
    details: { hy: "Մանրամասներ", en: "Details" } as T,
    fullPage: { hy: "Բացել լրիվ էջը", en: "Open the full page" } as T,
    palette: { hy: "Գունապնակ", en: "Palette" } as T,
    measured: { hy: "Չափված է, ոչ թե ընտրված", en: "Measured, not guessed" } as T,
    included: { hy: "Ինչ է ներառում", en: "What it includes" } as T,
    chooseThis: { hy: "Ընտրել այս ոճը", en: "Choose this style" } as T,
    openSample: { hy: "Բացել օրինակը", en: "Open the sample" } as T,
    close: { hy: "Փակել", en: "Close" } as T,
  },

  /** Section 5 — the stepper over the order flow. */
  flow: {
    title: { hy: "Պատվիրեք երեք քայլով", en: "Order in three steps" } as T,
    lead: {
      hy: "Ընտրեք հրավերը, գրեք ձեր օրը, տեսեք այն հեռախոսի վրա՝ գնով, և ուղարկեք։",
      en: "Choose the invitation, tell us your day, see it on a phone with its price — and send.",
    } as T,
    steps: [
      { t: { hy: "Ընտրեք առիթն ու հրավերը", en: "Choose the occasion and the invitation" } },
      { t: { hy: "Գրեք ձեր օրը", en: "Tell us your day" } },
      { t: { hy: "Նախադիտեք և պատվիրեք", en: "Preview and order" } },
    ] as Array<{ t: T }>,
    stepWord: { hy: "Քայլ", en: "Step" } as T,
    next: { hy: "Հաջորդը", en: "Next" } as T,
    back: { hy: "Հետ", en: "Back" } as T,
    contact: { hy: "Կապ ձեզ հետ (հեռախոս / WhatsApp / էլ. փոստ)", en: "How to reach you (phone / WhatsApp / email)" } as T,
    notes: { hy: "Նշումներ մեզ համար (ըստ ցանկության)", en: "Notes for us (optional)" } as T,
    notesPh: {
      hy: "Երաժշտություն, տեսանյութ, նկարներ, հատուկ ցանկություններ…",
      en: "Music, film, photographs, anything particular…",
    } as T,
    previewTitle: { hy: "Ձեր հրավերը", en: "Your invitation" } as T,
    previewEmpty: {
      hy: "Լրացրեք անուններն ու օրը — քարտը կհայտնվի այստեղ։",
      en: "Fill in the names and the date — the card appears here.",
    } as T,
    // the phone is never empty now — it opens on the pick's own sample words
    previewSample: {
      hy: "Նմուշային բառերով — ձերը կփոխարինեն գրելուն պես։",
      en: "Sample words — yours replace them as you type.",
    } as T,
  },

  /** Section 6 — the feature grid, with icon keys (Icon.tsx). */
  featureGrid: {
    title: { hy: "Ինչ կա ամեն հրավերի մեջ", en: "What every invitation carries" } as T,
    lead: {
      hy: "Ոչ թե նկար, որ ուղարկում են՝ այլ էջ, որ աշխատում է։",
      en: "Not a picture you forward — a page that works.",
    } as T,
    list: [
      { icon: "seal", t: { hy: "Կնիքով ծրար", en: "A sealed envelope" }, d: { hy: "Բացվում է հպումից՝ ձեր սկզբնատառերով զմուռսով։", en: "Opens at a tap, wax pressed with your initials." } },
      { icon: "clock", t: { hy: "Հետհաշվարկ", en: "Countdown" }, d: { hy: "Օր, ժամ, րոպե՝ մինչև ձեր օրը։", en: "Days, hours, minutes to the day." } },
      { icon: "calendar", t: { hy: "Օրացույց՝ մեկ հպումով", en: "Add-to-calendar" }, d: { hy: "Հյուրի հեռախոսում՝ հասցեով և հիշեցումով։", en: "Into the guest's phone, address and reminder attached." } },
      { icon: "map", t: { hy: "Քարտեզներ", en: "Maps" }, d: { hy: "Ամեն կանգառի համար՝ մեկ հպումով ճանապարհ։", en: "Directions for every stop, one tap away." } },
      { icon: "route", t: { hy: "Օրվա ընթացքը", en: "The day's programme" }, d: { hy: "Ինչ է լինելու, որտեղ և երբ։", en: "What happens, where and when." } },
      { icon: "check", t: { hy: "Պատասխանի ձև", en: "RSVP" }, d: { hy: "Հյուրերի քանակ, կողմ, սնունդ, ուղեկցողներ։", en: "Guest count, side, dietary needs, plus-ones." } },
      { icon: "users", t: { hy: "Հյուրերի ցուցակ", en: "Guest list" }, d: { hy: "Ձեր անձնական էջը՝ թվերով և Excel-ով։", en: "Your private page — the totals and an Excel export." } },
      { icon: "music", t: { hy: "Երաժշտություն և տեսանյութ", en: "Music and film" }, d: { hy: "Ձեր երգը և ձեր հոլովակը՝ ըստ ցանկության։", en: "Your song and your film, if you wish." } },
      { icon: "share", t: { hy: "WhatsApp և Telegram", en: "WhatsApp and Telegram" }, d: { hy: "Կիսվելու կոճակներ և անվանական հղումներ։", en: "Share buttons and personalised links." } },
      // TODO(owner): delivery switches on with TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (and/or RESEND_API_KEY + RSVP_TO)
      { icon: "telegram", t: { hy: "Պատասխանները՝ ձեր Telegram-ում", en: "Answers in your Telegram" }, d: { hy: "Ամեն հաստատում գալիս է ձեր զրույցին և էլ. փոստին։", en: "Every confirmation lands in your chat and your inbox." } },
      { icon: "check", t: { hy: "Excel արտահանում", en: "Excel export" }, d: { hy: "Իսկական .xlsx՝ պատասխաններ + ամփոփում երկու թերթով։", en: "A real .xlsx — answers plus a summary, two worksheets." } },
    ] as Array<{ icon: string; t: T; d: T }>,
  },

  /** Section 7 — pricing tiers. CONFIRMED by the owner (2026-08-25):
   *  Basic 19 900 ֏ · Premium 24 900 ֏ are the real launch prices. */
  pricing: {
    title: { hy: "Գները", en: "Pricing" } as T,
    lead: {
      hy: "Մեկ վճարում, անսահմանափակ հյուրեր, երեք լեզու։",
      en: "One payment, unlimited guests, three languages.",
    } as T,
    popular: { hy: "Ամենապահանջվածը", en: "Most chosen" } as T,
    quote: { hy: "Ըստ պայմանավորվածության", en: "By quote" } as T,
    per: { hy: "մեկ հրավեր", en: "per invitation" } as T,
    cta: { hy: "Ընտրել", en: "Choose" } as T,
    ctaCustom: { hy: "Գրել մեզ", en: "Talk to us" } as T,
    tiers: [
      {
        id: "basic",
        name: { hy: "Հիմնական", en: "Basic" },
        price: 19900,
        style: "kniq",
        blurb: { hy: "Փղոսկրյա ոճը՝ ամեն ինչով, ինչ մի հրավեր պետք է անի։", en: "The ivory style with everything an invitation must do." },
        feats: [
          { hy: "ԿՆԻՔ ոճը", en: "The KNIQ style" },
          { hy: "Հայերեն և անգլերեն", en: "Armenian and English" },
          { hy: "Ծրար, ծրագիր, քարտեզներ, հետհաշվարկ, օրացույց", en: "Envelope, programme, maps, countdown, calendar" },
          { hy: "Պատասխանի ձև՝ քանակով և կողմով", en: "RSVP with count and side" },
          { hy: "WhatsApp / Telegram կիսվելու կոճակներ", en: "WhatsApp / Telegram share" },
          { hy: "Հղումը՝ 12 ամիս", en: "Link live 12 months" },
        ],
      },
      {
        id: "premium",
        name: { hy: "Պրեմիում", en: "Premium" },
        price: 24900,
        style: "luys",
        blurb: { hy: "Երեք ոճից ցանկացածը, և հյուրերի ցուցակը՝ ձեր ձեռքին։", en: "Any of the three styles, and the guest list in your hands." },
        feats: [
          { hy: "Հիմնականի ամեն ինչը", en: "Everything in Basic" },
          { hy: "ԿՆԻՔ, ԼՈՒՅՍ կամ ՏՈՒՖ", en: "KNIQ, LUYS or TUF" },
          { hy: "Հյուրերի ցուցակ + Excel արտահանում", en: "Guest list + Excel export" },
          { hy: "Անվանական հղումներ՝ «Հարգելի Անի…»", en: "Personalised links — “Dear Ani…”" },
          { hy: "Սնունդ և ուղեկցողներ պատասխանում", en: "Dietary needs and plus-ones in the RSVP" },
          { hy: "Երաժշտություն և տեսանյութ", en: "Music and film" },
          { hy: "Հիշեցում չպատասխանածներին", en: "A reminder for non-responders" },
        ],
      },
      {
        id: "custom",
        name: { hy: "Անհատական", en: "Custom" },
        price: null,
        style: "tuf",
        blurb: { hy: "Ձեր դիզայնը կամ ոճերի խառնուրդ, ձեր նկարներով և հոլովակով։", en: "Your own design or a mix of styles, with your photographs and film." },
        feats: [
          { hy: "Պրեմիումի ամեն ինչը", en: "Everything in Premium" },
          { hy: "Անհատական գույներ, տառատեսակ, զարդանախշ", en: "Custom palette, type and ornament" },
          { hy: "Ձեր լուսանկարներով պատկերասրահ", en: "A gallery of your own photographs" },
          { hy: "Առաջնահերթ պատրաստում՝ 24 ժամում", en: "Priority turnaround, 24 hours" },
          { hy: "Տպագիր քարտ՝ նույն դիզայնով", en: "A printed card to match" },
        ],
      },
    ] as Array<{
      id: "basic" | "premium" | "custom";
      name: T;
      price: number | null;
      style: "kniq" | "luys" | "tuf";
      blurb: T;
      feats: T[];
    }>,
  },

  /** Section 8 — the gallery feed. A strip of the site's own photography,
   *  each captioned with what is actually in the frame. NO testimonials:
   *  the service has not yet served a couple, and an invented quote is the
   *  one thing this site must never carry. */
  feed: {
    kicker: { hy: "Օրինակներից", en: "From the samples" } as T,
    title: { hy: "Ինչպես է այն երևում", en: "How it looks" } as T,
    open: { hy: "Բացել", en: "Open" } as T,
  },

  /** Section 9 — the footer. Contact fields stay EMPTY until real ones exist;
   *  the footer renders only what is set and says "via the order form"
   *  otherwise. Socials likewise — no dead links, no invented handles. */
  footer: {
    quick: { hy: "Հղումներ", en: "Links" } as T,
    contact: { hy: "Կապ", en: "Contact" } as T,
    contactVia: { hy: "Գրեք մեզ պատվերի ձևով", en: "Reach us through the order form" } as T,
    follow: { hy: "Հետևեք", en: "Follow" } as T,
    legal: { hy: "Գաղտնիություն", en: "Privacy" } as T,
    rights: { hy: "Բոլոր իրավունքները պաշտպանված են", en: "All rights reserved" } as T,
    phone: "", // TODO(owner)
    email: "", // TODO(owner)
    socials: [] as Array<{ id: "instagram" | "telegram" | "whatsapp"; href: string }>, // TODO(owner)
  },

  /** /templates/[id] */
  template: {
    kicker: { hy: "Ոճ", en: "Style" } as T,
    back: { hy: "← Բոլոր ոճերը", en: "← All styles" } as T,
    preview: { hy: "Կենդանի նախադիտում", en: "Live preview" } as T,
    order: { hy: "Պատվիրել այս ոճով", en: "Order in this style" } as T,
  },

  /** THE POLICY STRIP — measured off iStudio's page foot, which states four
   *  promises plainly and is the most trust-building block on their site:
   *  one payment / unlimited sends · ready within 4 days · link live 6 months
   *  after the event · mix designs or bring your own. Ours states the same
   *  class of promise with our own numbers, and adds the one that matters
   *  most to a couple: changes after sending are free and need no re-send. */
  policy: {
    title: { hy: "Ինչ պայմաններով", en: "The terms, plainly" } as T,
    list: [
      {
        k: { hy: "Մեկ վճարում", en: "One payment" },
        v: { hy: "Անսահմանափակ ուղարկում՝ քանի հյուր ուզեք։", en: "Unlimited sends — as many guests as you like." },
      },
      {
        k: { hy: "1–2 աշխատանքային օր", en: "1–2 working days" },
        v: { hy: "Տվյալները ստանալուց մինչև պատրաստ հղումը։", en: "From your details to a finished link." },
      },
      {
        k: { hy: "Հղումը՝ 12 ամիս", en: "The link, 12 months" },
        v: { hy: "Գործում է միջոցառումից հետո ևս մեկ տարի։", en: "Stays live for a year after the day." },
      },
      {
        k: { hy: "Փոփոխություններ՝ անվճար", en: "Changes are free" },
        v: { hy: "Ժամը փոխվե՞ց — թարմացնում ենք, հղումը նույնն է։", en: "A time changed? We update it — the link stays the same." },
      },
      {
        k: { hy: "Երեք լեզու", en: "Three languages" },
        v: { hy: "Հայերեն և անգլերեն՝ նույն գնի մեջ։", en: "Armenian and English, in the one price." },
      },
      {
        k: { hy: "Ձեր հյուրերի ցուցակը", en: "Your guest list" },
        v: { hy: "Անձնական էջ՝ պատասխաններով և Excel-ով։", en: "A private page with the answers and an Excel export." },
      },
    ] as Array<{ k: T; v: T }>,
  },

  /** The occasion filter over the catalog — iStudio's chip row, with counts. */
  filter: {
    all: { hy: "Բոլորը", en: "All" } as T,
  },

  /** THE BUILDER — the couple's own names on the real card, live. */
  build: {
    title: { hy: "Տեսեք ձեր հրավերը՝ հիմա", en: "See your invitation — now" } as T,
    lead: {
      hy: "Գրեք անունները և օրը՝ քարտը փոխվում է ձեր աչքի առաջ։ Հավանե՞ց — պատվիրեք հենց այս էջից։",
      en: "Type the names and the date — the card changes in front of you. Like it? Order from this very page.",
    } as T,
    occasion: { hy: "Առիթը", en: "The occasion" } as T,
    a: { hy: "Առաջին անունը", en: "First name" } as T,
    b: { hy: "Երկրորդ անունը", en: "Second name" } as T,
    date: { hy: "Օրը", en: "The date" } as T,
    city: { hy: "Քաղաքը", en: "City" } as T,
    stops: { hy: "Օրվա ընթացքը", en: "The day's programme" } as T,
    stopTime: { hy: "Ժամ", en: "Time" } as T,
    stopName: { hy: "Ինչ է լինելու", en: "What happens" } as T,
    stopPlace: { hy: "Որտեղ", en: "Where" } as T,
    stopAddr: { hy: "Հասցե", en: "Address" } as T,
    addStop: { hy: "+ Ավելացնել կանգառ", en: "+ Add a stop" } as T,
    removeStop: { hy: "Հեռացնել", en: "Remove" } as T,
    preview: { hy: "Բացել կենդանի նախադիտումը", en: "Open the live preview" } as T,
    previewHint: {
      hy: "Բացվում է որպես իսկական հրավեր՝ ծրարով։ Հղումը կարող եք ուղարկել ընտանիքին՝ կարծիք հարցնելու։",
      en: "Opens as the real invitation, envelope and all. Send the link to family for an opinion.",
    } as T,
    orderThis: { hy: "Պատվիրել այս հրավերը", en: "Order this invitation" } as T,
    ribbon: {
      hy: "Նախադիտում — ձեր հրավերի սևագիրը",
      en: "Preview — a draft of your invitation",
    } as T,
    ribbonEdit: { hy: "Փոխել", en: "Edit" } as T,
    ribbonOrder: { hy: "Պատվիրել", en: "Order" } as T,
  },

  order: {
    title: { hy: "Պատվիրեք ձեր հրավերը", en: "Order your invitation" } as T,
    lead: {
      hy: "Լրացրեք ինչ գիտեք հիմա — մնացածը կճշտենք միասին։ Պատրաստ հղումը կստանաք 1–2 աշխատանքային օրում։",
      en: "Fill in what you know now — we'll settle the rest together. Your link arrives within 1–2 working days.",
    } as T,
    fields: {
      style: { hy: "Ոճը", en: "Style" } as T,
      names: { hy: "Ձեր անունները", en: "Your names" } as T,
      namesPh: { hy: "Նարե և Հայկ", en: "Nare & Hayk" } as T,
      date: { hy: "Օրը", en: "The date" } as T,
      contact: { hy: "Կապ ձեզ հետ (հեռախոս / WhatsApp / էլ. փոստ)", en: "How to reach you (phone / WhatsApp / email)" } as T,
      details: { hy: "Ձեր օրը՝ ժամեր, վայրեր, ծրագիր", en: "Your day — times, places, programme" } as T,
      detailsPh: {
        hy: "Օր. 12:30 հարսի տուն (հասցե), 15:00 պսակ (եկեղեցի), 18:00 խնջույք (սրահ)…",
        en: "e.g. 12:30 bride's home (address), 15:00 ceremony (church), 18:00 banquet (hall)…",
      } as T,
      send: { hy: "Ուղարկել հայտը", en: "Send the request" } as T,
      sending: { hy: "Ուղարկվում է…", en: "Sending…" } as T,
    },
    done: {
      // answers the couple's real question: WHICH link arrives, and where
      hy: "Ստացանք։ Կկապվենք ձեզ 1–2 աշխատանքային օրում և վերջնական հղումը կուղարկենք հենց ձեր թողած կոնտակտին։ Ձեր ստեղծած հղումը մինչ այդ աշխատում է։",
      en: "Received. We'll reach you within 1–2 working days and send the final link straight to the contact you left. Any link you generated keeps working meanwhile.",
    } as T,
    undelivered: {
      hy: "Հայտը գրանցվեց այս սարքում, բայց դեռ ոչ մեկին չի ուղարկվել։",
      en: "The request was recorded on this device but has not been sent to anyone yet.",
    } as T,
    errName: { hy: "Գրեք ձեր անունները", en: "Please add your names" } as T,
    errContact: { hy: "Գրեք կապի միջոց", en: "Please add a way to reach you" } as T,
  },

  faq: {
    title: { hy: "Հարցեր", en: "Questions" } as T,
    list: [
      {
        q: { hy: "Որքա՞ն ժամանակ է պետք", en: "How long does it take" },
        a: {
          hy: "Սովորաբար 1–2 աշխատանքային օր՝ տվյալները ստանալուց հետո։",
          en: "Usually 1–2 working days after we have your details.",
        },
      },
      {
        q: { hy: "Կարո՞ղ ենք փոփոխել ուղարկելուց հետո", en: "Can we change things after it goes out" },
        a: {
          hy: "Այո — հղումը նույնն է մնում, բովանդակությունը թարմացվում է։ Ժամի փոփոխությունը հյուրերին նորից ուղարկել պետք չէ։",
          en: "Yes — the link stays the same and the content updates. A changed time never needs re-sending.",
        },
      },
      {
        q: { hy: "Ինչպե՞ս ենք տեսնում պատասխանները", en: "How do we see the answers" },
        a: {
          hy: "Ձեր անձնական էջում՝ ամփոփ թվերով և ամբողջ ցուցակով, պլյուս ներբեռնում Excel-ի համար։",
          en: "On your private page — the totals, the full list, and a download for Excel.",
        },
      },
      {
        q: { hy: "Իսկ եթե հյուրը ինտերնետից չի օգտվում", en: "What about guests who aren't online" },
        a: {
          hy: "Հրավերը տպվող տարբերակ ունի, իսկ պատասխանը կարող եք գրանցել նրանց փոխարեն։",
          en: "The card prints cleanly, and you can record their answer on their behalf.",
        },
      },
    ] as Array<{ q: T; a: T }>,
  },

  foot: {
    line: { hy: "ԿՆԻՔ — թվային հրավիրատոմսեր", en: "KNIQ — digital invitations" } as T,
    sample: {
      hy: "Սա ցուցադրական ծառայություն է․ գները և օրինակի զույգը պայմանական են։",
      en: "This is a demonstration service; prices and the sample couple are illustrative.",
    } as T,
  },
};

/** /guests — the couple's page, not the guests'. Armenian only would be fine
 *  (the couple reads Armenian), but the strings ride the same T system as
 *  everything else so nothing here is a bare string. */
export const admin = {
  title: { hy: "Հյուրերի ցուցակ", en: "Guest list" } as T,
  lead: {
    hy: "Պատասխանները՝ այս սարքի վրա պահված գրքույկից։",
    en: "Answers from the guest book stored on this server.",
  } as T,
  // ---- the COUPLE's own dashboard, /guests/<id> (2026-08-25) --------------
  coupleLead: {
    hy: "Ձեր հրավերի պատասխանները՝ միայն այս հղումով։ Պահեք այն միայն ձեզ մոտ։",
    en: "Your invitation's answers — behind this link only. Keep it to yourselves.",
  } as T,
  // the owner's ORDERS table on /guests (2026-08-25) — the studio's inbox
  orders: {
    title: { hy: "Պատվերներ", en: "Orders" } as T,
    empty: { hy: "Դեռ պատվեր չկա։", en: "No orders yet." } as T,
    cols: {
      at: { hy: "Երբ", en: "When" } as T,
      names: { hy: "Անուններ", en: "Names" } as T,
      style: { hy: "Ձևանմուշ", en: "Design" } as T,
      contact: { hy: "Կապ", en: "Contact" } as T,
      details: { hy: "Նշումներ", en: "Notes" } as T,
      preview: { hy: "Դիտել", en: "View" } as T,
    },
  },
  oldLink: {
    hy: "Այս հղումը ստեղծվել է մինչև հյուրերի ցուցակների հայտնվելը։ Ստեղծեք նոր հղում կազմիչում — նորը կունենա իր ցուցակը։",
    en: "This link was made before guest lists existed. Generate a new link in the builder — the new one comes with its own list.",
  } as T,
  openInvitation: { hy: "Բացել հրավերը", en: "Open the invitation" } as T,
  empty: { hy: "Դեռ պատասխան չկա։", en: "No answers yet." } as T,
  stats: {
    answers: { hy: "Պատասխան", en: "Answers" } as T,
    coming: { hy: "Գալիս են", en: "Coming" } as T,
    people: { hy: "Հյուր ընդամենը", en: "Guests in total" } as T,
    declined: { hy: "Չեն գալիս", en: "Declined" } as T,
  },
  cols: {
    at: { hy: "Ամսաթիվ", en: "Date" } as T,
    name: { hy: "Անուն", en: "Name" } as T,
    guests: { hy: "Հյուրեր", en: "Guests" } as T,
    side: { hy: "Կողմ", en: "Side" } as T,
    coming: { hy: "Գալիս է", en: "Coming" } as T,
    plusOne: { hy: "Ուղեկցողներ", en: "With them" } as T,
    diet: { hy: "Սնունդ", en: "Dietary" } as T,
    message: { hy: "Խոսք", en: "Message" } as T,
  },
  /** THE NUDGE — Greenvelope's auto-reminders, in the register this market
   *  actually uses: the couple copies a ready message and pastes it into the
   *  family WhatsApp thread. No SMS gateway, no email list, no per-guest
   *  tracking pixels — the couple knows who hasn't answered better than any
   *  dashboard could, and the message is written for them. */
  nudge: {
    title: { hy: "Հիշեցում չպատասխանածներին", en: "A nudge for those who haven't answered" } as T,
    lead: {
      hy: "Պատճենեք և ուղարկեք ընտանեկան խմբում կամ անձամբ։ Հղումը ներսում է։",
      en: "Copy it and send it to the family group, or one by one. The link is inside.",
    } as T,
    copy: { hy: "Պատճենել հիշեցումը", en: "Copy the reminder" } as T,
    copied: { hy: "Պատճենվեց", en: "Copied" } as T,
    /** {names} {date} {rsvpBy} {url} are filled in */
    body: {
      hy: "Սիրելի՛ բարեկամներ, {names}-ի հարսանիքը {date}-ին է։ Խնդրում ենք հաստատել ներկայությունը մինչև {rsvpBy}՝ այստեղ․ {url}",
      en: "Dear friends — {names}'s wedding is on {date}. Please let us know if you can come by {rsvpBy}, here: {url}",
    } as T,
    diets: { hy: "Սննդային նշումներ", en: "Dietary notes" } as T,
  },
  sideWord: {
    bride: { hy: "Հարսի", en: "Bride's" } as T,
    groom: { hy: "Փեսայի", en: "Groom's" } as T,
    both: { hy: "Երկուսի", en: "Both" } as T,
  },
  yes: { hy: "Այո", en: "Yes" } as T,
  no: { hy: "Ոչ", en: "No" } as T,
  exportCsv: { hy: "Ներբեռնել CSV", en: "Download CSV" } as T,
  exportXlsx: { hy: "Ներբեռնել Excel (.xlsx)՝ ամփոփումով", en: "Download Excel (.xlsx) with a summary" } as T,
  keyLabel: { hy: "Մուտքի բանալի", en: "Access key" } as T,
  enter: { hy: "Բացել", en: "Open" } as T,
  wrongKey: {
    hy: "Բանալին սխալ է կամ դեռ սահմանված չէ։",
    en: "The key is wrong, or none has been set yet.",
  } as T,
  disabled: {
    hy: "Ցուցակը կբացվի, երբ սերվերում սահմանվի RSVP_ADMIN_KEY-ը։",
    en: "The list opens once RSVP_ADMIN_KEY is set on the server.",
  } as T,
};

// ---------------------------------------------------------------------------
// THE WIZARD — /customize. Every string the step-by-step builder, its five
// live previews, the Live Demo modal and the link generator show.
// ---------------------------------------------------------------------------
export const wizard = {
  title: { hy: "Ստեղծեք ձեր հրավերը", en: "Build your invitation" } as T,
  kicker: { hy: "Քայլ առ քայլ", en: "Step by step" } as T,
  lead: {
    hy: "Ընտրեք առիթը, գրեք անունները և օրը՝ հինգ նախադիտում փոխվում են ձեր աչքի առաջ։ Բացեք որպես իսկական հրավեր, ստացեք հղումը, ուղարկեք հյուրերին։",
    en: "Pick the occasion, type the names and the date — five live previews change as you type. Open it as the real invitation, get the link, send it to your guests.",
  } as T,
  steps: [
    { hy: "Առիթ և ձևանմուշ", en: "Occasion & template" },
    { hy: "Ովքեր և երբ", en: "Who & when" },
    { hy: "Որտեղ", en: "Where" },
    // named for what couples actually come looking for (review, 2026-08-25):
    // «Extras» hid the two most-asked things — their pictures and their song
    { hy: "Լուսանկարներ և երաժշտություն", en: "Photos & music" },
    { hy: "Դիտել և կիսվել", en: "Preview & share" },
  ] as T[],
  next: { hy: "Հաջորդը", en: "Next" } as T,
  back: { hy: "Նախորդը", en: "Back" } as T,
  category: { hy: "Ինչ առիթ է", en: "What's the occasion" } as T,
  template: { hy: "Ձևանմուշը", en: "Template" } as T,
  templateHint: { hy: "Բոլորը կենդանի են — շրջեք, փորձեք։", en: "All live — turn them, try them." } as T,
  hostA: { hy: "Առաջին անունը", en: "First name" } as T,
  hostB: { hy: "Երկրորդ անունը", en: "Second name" } as T,
  hostBOptional: { hy: "Երկրորդ տողը (տարիք, միջոցառում) — ըստ ցանկության", en: "Second line (age, event) — optional" } as T,
  date: { hy: "Օրը", en: "The date" } as T,
  time: { hy: "Ժամը", en: "The time" } as T,
  venue: { hy: "Վայրի անունը", en: "Venue name" } as T,
  venuePh: { hy: "«Ոսկե Այգի» սրահ", en: "Voske Aygi hall" } as T,
  address: { hy: "Հասցեն", en: "Address" } as T,
  addressPh: { hy: "Մաշտոցի պող. 24", en: "24 Mashtots Ave" } as T,
  city: { hy: "Քաղաքը", en: "City" } as T,
  map: { hy: "Քարտեզի հղում (Google / Yandex / Apple)", en: "Map link (Google / Yandex / Apple)" } as T,
  mapPh: { hy: "https://maps.app.goo.gl/…", en: "https://maps.app.goo.gl/…" } as T,
  mapBad: { hy: "Միայն https հղում Google, Yandex կամ Apple քարտեզներից։", en: "Only an https link from Google, Yandex or Apple Maps." } as T,
  programme: { hy: "Օրվա ընթացքը", en: "The day's programme" } as T,
  programmeHint: { hy: "Մինչև 5 կանգառ — ժամ, ինչ, որտեղ։", en: "Up to 5 stops — time, what, where." } as T,
  rsvpBy: { hy: "Պատասխանել մինչև", en: "RSVP by" } as T,
  dress: { hy: "Հագուստի գույները", en: "Dress code palette" } as T,
  dressHint: { hy: "Մինչև 5 գույն — հյուրերը կտեսնեն որպես նմուշներ։", en: "Up to 5 colours — guests see them as swatches." } as T,
  addColor: { hy: "+ Գույն", en: "+ Colour" } as T,
  music: { hy: "Ձեր երաժշտությունը (https հղում)", en: "Your music (https link)" } as T,
  musicHint: { hy: "Հղում mp3/m4a ֆայլի։ Դատարկ՝ մնում է ձևանմուշի բեմը։", en: "A link to an mp3/m4a. Empty keeps the template's bed." } as T,
  video: { hy: "Ֆոնային տեսանյութ", en: "Background video" } as T,
  videoHint: { hy: "Հանգիստ լուսային ցիկլ նկարների հետևում։", en: "A quiet ambient loop behind the plates." } as T,
  photos: { hy: "Ձեր նկարները", en: "Your photos" } as T,
  photosHint: {
    hy: "Մնում են այս սարքում մինչև պատվերը — ոչինչ չի վերբեռնվում։ Նախադիտումներում երևում են անմիջապես։",
    en: "Stay on this device until you order — nothing is uploaded. They appear in the previews at once.",
  } as T,
  addPhotos: { hy: "Ընտրել նկարներ", en: "Choose photos" } as T,
  godA: { hy: "Կնքահայր", en: "Godfather" } as T,
  godB: { hy: "Կնքամայր", en: "Godmother" } as T,
  born: { hy: "Ծննդյան տարին (տարիքի հաշվարկի համար)", en: "Birth year (for the age countdown)" } as T,
  previews: { hy: "Կենդանի նախադիտումներ", en: "Live previews" } as T,
  previewsHint: { hy: "Ամեն տարբերակ՝ իր տողում։ Բացեք որևէ մեկը՝ տեսնելու Ձեր տվյալները այդ տեսքով. մյուս առիթները՝ վերջում։", en: "One row per version. Open any to see your details in that look; the other occasions sit at the end." } as T,
  tabForm: { hy: "Լրացնել", en: "Fill in" } as T,
  tabPreview: { hy: "Նախադիտում", en: "Preview" } as T,
  demo: { hy: "Կենդանի ցուցադրություն", en: "Live Demo" } as T,
  demoHint: { hy: "Բացվում է ճիշտ այնպես, ինչպես հյուրը կտեսնի։", en: "Opens exactly as a guest will see it." } as T,
  demoOpen: { hy: "Բացել նոր ներդիրում", en: "Open in a new tab" } as T,
  close: { hy: "Փակել", en: "Close" } as T,
  generate: { hy: "Ստեղծել հղումը", en: "Generate Web Link" } as T,
  generating: { hy: "Ստեղծվում է…", en: "Generating…" } as T,
  generateHint: { hy: "Կարճ հղում՝ ուղարկելու WhatsApp-ով, Telegram-ով, SMS-ով։", en: "A short link to send by WhatsApp, Telegram, SMS." } as T,
  // the couple's own answers page arrives WITH the link (2026-08-25)
  answersTitle: { hy: "Ձեր հյուրերի ցուցակը", en: "Your guest list" } as T,
  answersHint: {
    hy: "Պատասխանները հավաքվում են այստեղ։ Այս հղումը միայն ձեզ համար է — մի ուղարկեք հյուրերին։",
    en: "The answers gather here. This link is for you only — don't send it to guests.",
  } as T,
  qrDownload: { hy: "Ներբեռնել QR-ը (PNG)", en: "Download the QR (PNG)" } as T,
  // ---- the two families + the gift box (2026-08-26, after the reference
  // editor's field set) ------------------------------------------------------
  parentsTitle: { hy: "Ծնողները (ըստ ցանկության)", en: "The parents (optional)" } as T,
  parentsHint: {
    hy: "Լրացնելիս հրավերի վրա հայտնվում է «Ուրախությամբ հայտնում ենք մեր զավակների ամուսնության մասին» բաժինը՝ երկու ընտանիքով։",
    en: "When filled, the invitation gains the announcement — «with joyful hearts we announce the wedding of our children» — with both families.",
  } as T,
  groomSide: { hy: "Փեսայի ծնողները", en: "The groom's parents" } as T,
  brideSide: { hy: "Հարսի ծնողները", en: "The bride's parents" } as T,
  father: { hy: "Հայր", en: "Father" } as T,
  mother: { hy: "Մայր", en: "Mother" } as T,
  giftsTitle: { hy: "Նվերի արկղ (ըստ ցանկության)", en: "Gift box (optional)" } as T,
  giftsHint: {
    hy: "Մինչև երեք եղանակ՝ Իդրամ, քարտ, IBAN… Հյուրը բացում է արկղը, պատճենում համարը իր բանկի հավելվածում։ QR հայտնվում է միայն երբ արժեքը իրական հղում է։",
    en: "Up to three ways — Idram, card, IBAN… A guest opens the box and copies the number into their own banking app. A QR appears only when the value is a real link.",
  } as T,
  giftLabel: { hy: "Եղանակ", en: "Method" } as T,
  giftLabelPh: { hy: "Իդրամ / Քարտ / IBAN", en: "Idram / Card / IBAN" } as T,
  giftValue: { hy: "Համար / հղում", en: "Number / link" } as T,
  giftNote: { hy: "Նշում (ըստ ցանկության)", en: "Note (optional)" } as T,
  giftAdd: { hy: "Ավելացնել եղանակ", en: "Add a method" } as T,
  giftRemove: { hy: "Հեռացնել", en: "Remove" } as T,
  // ---- step 5's CHECKLIST (2026-08-25): what is filled, what still wears
  // the template's sample words — each row jumps to its step. The venue row
  // WARNS: sample names look sample, a sample church with a working map
  // button looks real.
  checkTitle: { hy: "Ի՞նչ է պատրաստ հղումի համար", en: "What's ready for the link" } as T,
  checkNames: { hy: "Անուններ և օր", en: "Names & the day" } as T,
  checkNamesNeed: { hy: "Պարտադիր է հղումի համար", en: "Required for the link" } as T,
  checkWhere: { hy: "Վայրը", en: "The venue" } as T,
  checkWhereWarn: { hy: "Հյուրերը կտեսնեն նմուշային եկեղեցին՝ աշխատող քարտեզով", en: "Guests would see the sample church — with a working map" } as T,
  checkProgramme: { hy: "Օրվա ծրագիրը", en: "The programme" } as T,
  checkPhotos: { hy: "Ձեր լուսանկարները", en: "Your photographs" } as T,
  checkMusic: { hy: "Ձեր երգը", en: "Your song" } as T,
  checkRsvp: { hy: "Պատասխանի վերջնաժամկետը", en: "The RSVP deadline" } as T,
  checkOk: { hy: "Լրացված է", en: "Filled in" } as T,
  checkSample: { hy: "Կմնան նմուշայինները", en: "Sample stays for now" } as T,
  checkOptional: { hy: "Ըստ ցանկության", en: "Optional" } as T,
  checkGo: { hy: "Լրացնել", en: "Fill in" } as T,
  // ---- the TWO ways to the link, said plainly (the user's own question:
  // «I add a phone number and receive a link — or is it another link?»)
  pathATitle: { hy: "Ստացեք հղումը հենց հիմա", en: "Get your link right now" } as T,
  pathABody: {
    hy: "Սա հենց այն հղումն է, որ բացում են հյուրերը՝ երեք լեզվով, RSVP-ով։ Ստեղծեք, պատճենեք, ուղարկեք — ուրիշ ոչինչ պետք չէ։",
    en: "This IS the link your guests open — three languages, RSVP and all. Generate it, copy it, send it — nothing else is needed.",
  } as T,
  pathBTitle: { hy: "Կամ թողեք, որ մենք ավարտենք", en: "Or let us finish it for you" } as T,
  pathBBody: {
    hy: "Ուղարկեք պատվերը ձեր հեռախոսահամարով։ Մենք կհղկենք հրավերը և ՎԵՐՋՆԱԿԱՆ հղումը կուղարկենք ձեզ անձամբ։ Այստեղ ստեղծած հղումը մինչ այդ շարունակում է աշխատել։",
    en: "Send the order with your phone number. We polish the invitation and send you the FINAL link personally. Any link you generated here keeps working meanwhile.",
  } as T,
  copy: { hy: "Պատճենել", en: "Copy" } as T,
  copied: { hy: "Պատճենվեց", en: "Copied" } as T,
  open: { hy: "Բացել", en: "Open" } as T,
  qr: { hy: "QR — տպելու կամ ցույց տալու", en: "QR — to print or show" } as T,
  notStored: {
    hy: "Հղումը ստեղծվեց, բայց սերվերում չպահպանվեց (սկավառակը փակ է)։ Օգտագործեք երկար հղումը ներքևում։",
    en: "The link was made but not persisted (disk read-only). Use the long link below.",
  } as T,
  longLink: { hy: "Երկար հղում (առանց սերվերի)", en: "Long link (needs no server)" } as T,
  order: { hy: "Պատվիրել այս հրավերը", en: "Order this invitation" } as T,
  needNames: { hy: "Գրեք անուն(ներ)ը և օրը՝ նախադիտումները կենդանանան։", en: "Type the name(s) and the date — the previews come alive." } as T,
  reset: { hy: "Մաքրել", en: "Start over" } as T,
  meal: { hy: "Ճաշատեսակ", en: "Meal" } as T,
  meals: [{ hy: "Միս", en: "Meat" }, { hy: "Ձուկ", en: "Fish" }, { hy: "Բուսական", en: "Vegetarian" }] as T[],
  rsvpTry: { hy: "Փորձել RSVP-ն", en: "Try the RSVP" } as T,
  saveDate: { hy: "Save the date", en: "Save the date" } as T,
  wall: { hy: "Հյուրերի պատ", en: "Guest wall" } as T,
  wallPh: { hy: "Ձեր բարեմաղթանքը…", en: "Your wish…" } as T,
  wallAdd: { hy: "Ավելացնել", en: "Add" } as T,
  wallEmpty: { hy: "Առաջին բարեմաղթանքը՝ ձերն է։", en: "The first wish is yours." } as T,
  sample: { hy: "նմուշ", en: "sample" } as T,
  yours: { hy: "ձերը", en: "yours" } as T,
  errLink: { hy: "Չստացվեց։ Փորձեք մի պահից։", en: "Didn't work. Try again in a moment." } as T,
  errFill: { hy: "Նախ լրացրեք անուն(ներ)ը և օրը։", en: "Fill in the name(s) and the date first." } as T,
} as const;

// ---------------------------------------------------------------------------
// THE EXAMPLES — the wizard's pick list (lib/examples.ts): what each kind is
// called, what a page does, and the price line. Prices themselves live in
// svc.pricing (one source, TODO(owner) confirms them).
// ---------------------------------------------------------------------------
export const examples = {
  title: { hy: "Օրինակները", en: "The examples" } as T,
  lead: {
    hy: "Ընտրեք մեկը։ «Դիտել»-ը բացում է այն ճիշտ այնպես, ինչպես հյուրը կտեսնի — ձեր անուններով, հենց որ գրեք դրանք։",
    en: "Pick one. Preview opens it exactly as a guest will see it — with your names, as soon as you type them.",
  } as T,
  count: { hy: "օրինակ", en: "examples" } as T,
  all: { hy: "Բոլորը", en: "All" } as T,
  kinds: {
    web: { hy: "Կայք-էջ", en: "Web page" },
    engine: { hy: "Շարժիչ", en: "Engine" },
    card: { hy: "Քարտ՝ ծրարով", en: "Card in an envelope" },
  } as Record<"web" | "engine" | "card", T>,
  kindHint: {
    web: { hy: "Կենդանի կայք-հրավեր՝ ձևանմուշ կամ շարժիչի ոճերից մեկը (նշանը՝ քարտի վրա)", en: "A live web invitation — a template, or one of the engine styles (the badge says which)" },
    engine: { hy: "Նույն սխեմայով շարժիչի ոճերից մեկը — ամեն ինչ միանգամից", en: "One of the engine styles — everything at once" },
    card: { hy: "Բացվող ծրար, անվանական հասցե, քարտը դառնում է հրավեր", en: "An envelope that opens, addressed by name; the card becomes the invitation" },
  } as Record<"web" | "engine" | "card", T>,
  preview: { hy: "Դիտել", en: "Preview" } as T,
  choose: { hy: "Ընտրել", en: "Choose" } as T,
  chosen: { hy: "Ընտրված", en: "Chosen" } as T,
  yourPick: { hy: "Ձեր ընտրությունը", en: "Your pick" } as T,
  change: { hy: "Փոխել", en: "Change" } as T,
  terms: { hy: "մեկ վճարում · երեք լեզու", en: "one payment · three languages" } as T,
  includes: { hy: "Ներառում է", en: "Includes" } as T,
  moreCards: { hy: "Բոլոր 40 քարտերը, ծրարի ընտրությամբ →", en: "All 40 card designs, with the envelope options →" } as T,
  moreKids: { hy: "Բոլոր 44 մանկական քարտերը՝ գույնով և նկարով →", en: "All 44 kids' cards, with colourways and photos →" } as T,
  cardsInWizard: { hy: "10 ամենապահանջված քարտերը՝ այստեղ", en: "The ten most chosen cards, right here" } as T,
  feats: {
    film: { hy: "Տեսանյութ", en: "Film" },
    music: { hy: "Երաժշտություն", en: "Music" },
    rsvp: { hy: "RSVP", en: "RSVP" },
    guests: { hy: "Հյուրերի ցուցակ + Excel", en: "Guest list + Excel" },
    gallery: { hy: "Պատկերասրահ", en: "Gallery" },
    timeline: { hy: "Ժամանակացույց", en: "Timeline" },
    maps: { hy: "Քարտեզ", en: "Map" },
    countdown: { hy: "Հետհաշվարկ", en: "Countdown" },
    dress: { hy: "Հագուստի գույներ", en: "Dress code" },
    envelope: { hy: "Ծրարի անիմացիա", en: "Envelope animation" },
    personal: { hy: "Անվանական հղում", en: "Personalised link" },
    calendar: { hy: "Օրացույց", en: "Calendar" },
  } as Record<"film" | "music" | "rsvp" | "guests" | "gallery" | "timeline" | "maps" | "countdown" | "dress" | "envelope" | "personal" | "calendar", T>,
  total: { hy: "Ընդամենը", en: "Total" } as T,
  ordering: { hy: "Պատվիրվում է", en: "You are ordering" } as T,
  changeInWizard: { hy: "Փոխել մոգում", en: "Change in the wizard" } as T,
  // the order's step 1 opens COLLAPSED on the pick (2026-08-25): the full
  // catalogue was rendering a third time right under the deck. The open
  // verb reuses the block's own `change`; this is its way back.
  changeClose: { hy: "Փակել ցանկը", en: "Close the list" } as T,
  plainStyle: { hy: "Կամ ընտրեք պարզ ոճ առանց օրինակի", en: "Or pick a plain style without an example" } as T,
  // the detail window — one example, in full, without leaving the page
  details: { hy: "Դիտել մանրամասն", en: "View details" } as T,
  detailTitle: { hy: "Օրինակը մանրամասն", en: "The example in detail" } as T,
  close: { hy: "Փակել", en: "Close" } as T,
  prev: { hy: "Նախորդը", en: "Previous" } as T,
  next: { hy: "Հաջորդը", en: "Next" } as T,
  of: { hy: "-ից", en: "of" } as T,
  liveNote: { hy: "Կենդանի է — ճիշտ այնպես, ինչպես հյուրը կտեսնի։ Ձեր անունները տեղ կգտնեն, հենց որ գրեք դրանք։", en: "Live — exactly as a guest will see it. Your names land in it as soon as you type them." } as T,
  sectionOrder: { hy: "Բաժինների կարգը", en: "Section order" } as T,
  afterLabel: { hy: "Կառուցվածքը", en: "Structure" } as T,
  sampleNote: { hy: "Նմուշի զույգը", en: "Sample couple" } as T,
  chooseThis: { hy: "Ընտրել այս օրինակը", en: "Choose this example" } as T,
  chosenThis: { hy: "Ընտրված է", en: "Chosen" } as T,
  openFull: { hy: "Բացել ամբողջ էջով", en: "Open full page" } as T,
  orderWith: { hy: "Պատվիրել այս օրինակով", en: "Order with this example" } as T,
  openStudio: { hy: "Բացել քարտերի ստուդիայում", en: "Open in the card studio" } as T,
  buildWith: { hy: "Կառուցել մոգում", en: "Build on it in the wizard" } as T,
  // the card grid on the wedding showcase
  gridKicker: { hy: "Հարսանեկան օրինակներ", en: "Wedding examples" } as T,
  gridTitle: { hy: "Բոլոր տարբերակները՝ յուրաքանչյուրն իր պատուհանով", en: "Every option, each in its own window" } as T,
  gridLead: { hy: "Կայք-էջեր, շարժիչի ոճեր և ծրարով քարտեր — ամեն օրինակ իր քարտով։ «Դիտել մանրամասն»-ը բացում է կենդանի նախադիտումը, բաժինների կարգը, ներառվածը և գինը՝ առանց էջը լքելու։", en: "Web pages, engine styles and cards in an envelope — every example on its own card. «View details» opens the live preview, the section order, what's included and the price, without leaving the page." } as T,
} as const;

// ---------------------------------------------------------------------------
// KIDS' BIRTHDAY CARDS — /kids, /kids/<card>, and the guest link they make.
// ---------------------------------------------------------------------------
export const kids = {
  title: { hy: "Մանկական ծննդյան հրավերներ", en: "Kids' birthday invitations" } as T,
  kicker: { hy: "Քարտեր, որոնք դառնում են հրավեր", en: "Cards that become invitations" } as T,
  lead: {
    hy: "Դինոզավրերից մինչև միաեղջյուրներ — ընտրեք քարտը, գրեք երեխայի անունը, տարիքը, օրն ու վայրը, և քարտը դառնում է կենդանի հրավեր՝ RSVP-ով, քարտեզով և հաշվարկով։ Ուղարկեք հղումով, WhatsApp-ով, QR-ով։",
    en: "From dinosaurs to unicorns — pick a card, type the child's name, age, day and place, and the card becomes a live invitation with RSVP, map and countdown. Send it as a link, on WhatsApp, as a QR.",
  } as T,
  explore: { hy: "Ըստ երեխայի", en: "Explore" } as T,
  milestones: { hy: "Հատուկ տարեդարձեր", en: "Milestone birthdays" } as T,
  themes: { hy: "Ըստ թեմայի", en: "Shop by theme" } as T,
  shapes: { hy: "Քարտի ձևը", en: "Card shape" } as T,
  all: { hy: "Բոլորը", en: "All" } as T,
  results: { hy: "քարտ", en: "cards" } as T,
  none: { hy: "Այս զտիչներով քարտ չկա — մաքրեք որևէ մեկը։", en: "No card matches these filters — clear one." } as T,
  clear: { hy: "Մաքրել զտիչները", en: "Clear filters" } as T,
  search: { hy: "Որոնել՝ դինո, ծիածան, ֆուտբոլ…", en: "Search: dino, rainbow, football…" } as T,
  previewWith: { hy: "Նախադիտել ձեր երեխայի անունով", en: "Preview with your child's name" } as T,
  childName: { hy: "Երեխայի անունը", en: "Child's name" } as T,
  age: { hy: "Տարիքը", en: "Age" } as T,
  popular: { hy: "Հանրաճանաչ", en: "Popular" } as T,
  isNew: { hy: "Նոր", en: "New" } as T,
  colors: { hy: "գույն", en: "colours" } as T,
  open: { hy: "Բացել քարտը", en: "Open card" } as T,
  by: { hy: "Դիզայն՝", en: "Design by" } as T,
  // the studio
  customize: { hy: "Անհատականացնել", en: "Customize" } as T,
  preview: { hy: "Նախադիտել", en: "Preview" } as T,
  cardTab: { hy: "Քարտ", en: "Card" } as T,
  envelopeTab: { hy: "Ծրար", en: "Envelope" } as T,
  guestTab: { hy: "Հյուրի էկրան", en: "Guest view" } as T,
  colorway: { hy: "Գունային տարբերակ", en: "Colourway" } as T,
  fill: { hy: "Լրացրեք՝ քարտը փոխվում է անմիջապես", en: "Fill in — the card changes as you type" } as T,
  date: { hy: "Օրը", en: "Date" } as T,
  time: { hy: "Ժամը", en: "Time" } as T,
  venue: { hy: "Վայրը", en: "Venue" } as T,
  venuePh: { hy: "Play Park / Մեր տանը", en: "Play Park / our home" } as T,
  address: { hy: "Հասցեն", en: "Address" } as T,
  city: { hy: "Քաղաքը", en: "City" } as T,
  map: { hy: "Քարտեզի հղում", en: "Map link" } as T,
  host: { hy: "Ծնողները (RSVP-ի համար)", en: "Parents (for the RSVP line)" } as T,
  hostPh: { hy: "Աննա և Արամ", en: "Anna & Aram" } as T,
  note: { hy: "Ձեր տողը", en: "Your line" } as T,
  notePh: { hy: "Արի՛ տորթի, խաղերի և շատ ուրախության", en: "Join us for cake, games and lots of fun" } as T,
  rsvpBy: { hy: "Պատասխանել մինչև", en: "RSVP by" } as T,
  second: { hy: "Երկրորդ երեխան (համատեղ ծնունդ)", en: "Second child (joint birthday)" } as T,
  photo: { hy: "Երեխայի նկարը", en: "Child's photo" } as T,
  photoHint: {
    hy: "Երևում է անմիջապես։ Հղում ստեղծելիս նկարը պահվում է մեր սերվերում, որ հյուրերն էլ տեսնեն։",
    en: "Shows at once. When you generate the link the photo is saved on our server so guests see it too.",
  } as T,
  choosePhoto: { hy: "Ընտրել նկար", en: "Choose photo" } as T,
  removePhoto: { hy: "Հեռացնել", en: "Remove" } as T,
  questions: { hy: "Ինչ հարցնել հյուրերին RSVP-ում", en: "What to ask guests in the RSVP" } as T,
  askCounts: { hy: "Մեծահասակների և երեխաների քանակը", en: "Adult and child headcounts" } as T,
  askAllergy: { hy: "Սննդային ալերգիաներ", en: "Food allergies" } as T,
  bullets: [
    { hy: "Քարտը դառնում է հրավեր՝ ձեր տվյալներով, RSVP-ով, քարտեզով, օրացույցով և հաշվարկով։", en: "The card becomes the invitation — your details, RSVP, map, calendar and countdown." },
    { hy: "Հյուրերին հարցրեք մեծահասակ/երեխա քանակ և ալերգիաներ — բոլորին տորթ կհասնի։", en: "Ask guests for adult v. child headcounts and allergies — everyone gets cake." },
    { hy: "Ուղարկեք հղումով, WhatsApp-ով, Telegram-ով, QR-ով։", en: "Send by link, WhatsApp, Telegram, QR." },
    { hy: "Պատասխանները հավաքվում են ձեր ցուցակում, արտահանվում Excel։", en: "Answers collect in your list, export to Excel." },
  ] as T[],
  more: { hy: "Կհավանեք նաև", en: "You might also like" } as T,
  backAll: { hy: "Բոլոր քարտերը", en: "All cards" } as T,
  timing: {
    hy: "Երբ ուղարկել՝ տան տոնի համար՝ 4 շաբաթ առաջ, սրահի համար՝ 6 շաբաթ առաջ, որ հաշվարկը ճիշտ լինի։",
    en: "When to send: four weeks ahead for a party at home, six for a venue, so the headcount is right.",
  } as T,
  // the guest link
  open2: { hy: "Բացել հրավերը", en: "Open the invitation" } as T,
  details: { hy: "Մանրամասներ", en: "Details" } as T,
  when: { hy: "Երբ", en: "When" } as T,
  where: { hy: "Որտեղ", en: "Where" } as T,
  fromParents: { hy: "Ծնողները", en: "Parents" } as T,
  rsvpTitle: { hy: "Կգա՞ք", en: "Are you coming?" } as T,
  yourName: { hy: "Ձեր անունը", en: "Your name" } as T,
  adults: { hy: "Մեծահասակներ", en: "Adults" } as T,
  children: { hy: "Երեխաներ", en: "Children" } as T,
  allergy: { hy: "Ալերգիաներ / սննդի նշումներ", en: "Allergies / food notes" } as T,
  allergyPh: { hy: "օր.՝ ընկույզ, կաթ", en: "e.g. nuts, dairy" } as T,
  message: { hy: "Երկու խոսք", en: "A word" } as T,
  yes: { hy: "Կգանք", en: "We'll come" } as T,
  no: { hy: "Չենք կարող", en: "Can't make it" } as T,
  send: { hy: "Ուղարկել", en: "Send" } as T,
  sending: { hy: "Ուղարկվում է…", en: "Sending…" } as T,
  thanks: { hy: "Ստացանք — շնորհակալություն։", en: "Received — thank you." } as T,
  notSent: { hy: "Գրանցվեց այս սարքում, նամակ դեռ չի ուղարկվում։", en: "Recorded on this device; no email is sent yet." } as T,
  again: { hy: "Փոխել պատասխանը", en: "Change answer" } as T,
  errName: { hy: "Գրեք ձեր անունը", en: "Please add your name" } as T,
  errCount: { hy: "Գոնե մեկ հոգի", en: "At least one of you" } as T,
  gift: { hy: "Ներկայությունը բավական է", en: "Your presence is the present" } as T,
  bring: { hy: "Ինչ բերել", en: "What to bring" } as T,
  sample: { hy: "Ցուցադրական հրավեր — երեխան և օրը հորինված են։", en: "Sample invitation — the child and the day are made up." } as T,
} as const;

// ---------------------------------------------------------------------------
// THE EDITOR — /edit, the sectioned single-page builder (2026-08-27, after
// the reference editor's three screens). Every string it speaks.
// ---------------------------------------------------------------------------
// /templates — the catalogue page + its chooser window (2026-08-27)
export const tplPage = {
  title: { hy: "Ձեռագործ հարսանեկան ձևանմուշներ", en: "Handcrafted wedding invitation templates" } as T,
  lead: {
    hy: "Ընտրեք ձևանմուշը, տեսեք կենդանի, լրացրեք ձեր տվյալները — հղումը ձերն է։",
    en: "Pick a design, see it live, fill in your details — the link is yours.",
  } as T,
  switchNote: { hy: "Ձևանմուշը կարող եք փոխել ցանկացած պահի՝ առանց տվյալները կորցնելու։", en: "You can switch templates anytime while editing — nothing you typed is lost." } as T,
  fresh: { hy: "Նոր", en: "New" } as T,
  hot: { hy: "Սիրված", en: "Hot" } as T,
  features: { hy: "Հնարավորություններ", en: "Features" } as T,
  qrNote: { hy: "Սկանավորեք՝ նմուշը հեռախոսում բացելու համար", en: "Scan to open the live demo on your phone" } as T,
  choose: { hy: "Ընտրել այս ձևանմուշը", en: "Choose this template" } as T,
  previewBtn: { hy: "Դիտել", en: "Preview" } as T,
  my: { hy: "Իմ հրավերները", en: "My invitations" } as T,
} as const;

export const editor = {
  edit: { hy: "Խմբագրել", en: "Edit" } as T,
  preview: { hy: "Դիտել", en: "Preview" } as T,
  publish: { hy: "Հրապարակել", en: "Publish" } as T,
  back: { hy: "Ձևանմուշներ", en: "Templates" } as T,
  show: { hy: "Ցույց տալ", en: "Show" } as T,
  hide: { hy: "Թաքցնել", en: "Hide" } as T,
  basic: { hy: "Հիմնական տվյալներ", en: "Basic information" } as T,
  headingL: { hy: "Հերոսի վերնագիրը", en: "Event heading" } as T,
  headingNote: { hy: "Դատարկ՝ մնում է ձևանմուշի սեփական տողը", en: "Empty keeps the template's own wording" } as T,
  groomFull: { hy: "Փեսայի լրիվ անունը", en: "Groom's full name" } as T,
  brideFull: { hy: "Հարսի լրիվ անունը", en: "Bride's full name" } as T,
  groomShort: { hy: "Փեսայի կարճ անունը", en: "Groom's short name" } as T,
  brideShort: { hy: "Հարսի կարճ անունը", en: "Bride's short name" } as T,
  shortNote: { hy: "Կարճ անունները հայտնվում են նեղ տեղերում՝ ստորագրում", en: "Short names appear where space is tight — the footer line" } as T,
  roleG: { hy: "Փեսայի պիտակը", en: "Groom's label" } as T,
  roleB: { hy: "Հարսի պիտակը", en: "Bride's label" } as T,
  famFirstG: { hy: "Փեսայի ընտանիքն առաջինը", en: "Groom's family first" } as T,
  famFirstB: { hy: "Հարսի ընտանիքն առաջինը", en: "Bride's family first" } as T,
  famFirstNote: { hy: "Որոշում է անունների և ընտանիքների հերթականությունը հայտարարության մեջ", en: "Sets whose name and family stand first in the announcement" } as T,
  heroPhoto: { hy: "Գլխավոր լուսանկար", en: "Hero photo" } as T,
  heroPhotoNote: { hy: "Առաջին լուսանկարը դառնում է շապիկը. ուղղահայաց կադրը լավագույնն է", en: "The first photograph becomes the cover; a vertical frame works best" } as T,
  gallery: { hy: "Պատկերասրահ", en: "Photo gallery" } as T,
  galleryNote: { hy: "Մինչև 8 լուսանկար՝ շապիկից հետո", en: "Up to 8 photographs after the cover" } as T,
  family: { hy: "Ընտանիքների տվյալները", en: "Family information" } as T,
  familyNote: { hy: "Լրացրածը հայտնվում է հայտարարության բաժնում. դատարկը՝ թաքցնում է", en: "Filled fields appear in the announcement; empty hides it" } as T,
  groomFam: { hy: "Փեսայի ընտանիքը", en: "Groom's family" } as T,
  brideFam: { hy: "Հարսի ընտանիքը", en: "Bride's family" } as T,
  parentTitle: { hy: "Ծնողների տողը", en: "Parent title" } as T,
  father: { hy: "Հայր", en: "Father" } as T,
  mother: { hy: "Մայր", en: "Mother" } as T,
  famAddr: { hy: "Ընտանիքի հասցեն", en: "Family address" } as T,
  opening: { hy: "Բացման խոսքը", en: "Opening message" } as T,
  openingNote: { hy: "Դատարկ՝ մնում է դասական տողը", en: "Empty keeps the classical line" } as T,
  ceremony: { hy: "Արարողություն", en: "Ceremony" } as T,
  ceremonyHeadL: { hy: "Բաժնի վերնագիրը", en: "Section heading" } as T,
  programme: { hy: "Օրվա ծրագիրը", en: "The programme" } as T,
  addStop: { hy: "Ավելացնել կանգառ", en: "Add a stop" } as T,
  stopTime: { hy: "Ժամ", en: "Time" } as T,
  stopName: { hy: "Ինչ է լինելու", en: "What happens" } as T,
  stopPlace: { hy: "Վայրը", en: "The place" } as T,
  reception: { hy: "Հանդիսությունը", en: "The reception" } as T,
  eventDate: { hy: "Օրը", en: "Event date" } as T,
  eventTime: { hy: "Ժամը", en: "Event time" } as T,
  clock24: { hy: "24-ժամյա", en: "24-hour" } as T,
  clockAmPm: { hy: "AM/PM", en: "AM/PM" } as T,
  clockNote: { hy: "Ինչպես են գրվում ժամերը հրավերի վրա", en: "How the times print on the invitation" } as T,
  countdown: { hy: "Հետհաշվարկ", en: "Countdown" } as T,
  venueL: { hy: "Վայրի անունը", en: "Venue" } as T,
  cityL: { hy: "Քաղաքը", en: "City" } as T,
  addressL: { hy: "Հասցեն", en: "Address" } as T,
  mapL: { hy: "Քարտեզ", en: "Map" } as T,
  mapNote: { hy: "Հղում Google/Yandex քարտեզից — կոճակը կբացի հենց այն", en: "A Google/Yandex maps link — the button opens exactly it" } as T,
  rsvp: { hy: "RSVP", en: "RSVP" } as T,
  rsvpNote: { hy: "Հյուրերը հաստատում են հենց հրավերի վրա. պատասխանները՝ ձեր հյուրերի ցուցակում", en: "Guests confirm on the invitation itself; answers gather in your guest list" } as T,
  rsvpBtn: { hy: "Կոճակով (մոդալ)", en: "Button (modal)" } as T,
  rsvpInline: { hy: "Էջի մեջ", en: "Inline" } as T,
  rsvpBy: { hy: "Պատասխանել մինչև", en: "RSVP by" } as T,
  dress: { hy: "Հագուստի գույներ", en: "Dress code" } as T,
  dressNote: { hy: "Մինչև 5 գույն. հյուրերը տեսնում են որպես ներկապնակ", en: "Up to 5 colours; guests see them as swatches" } as T,
  schedule: { hy: "Օրվա ժամանակացույցը", en: "Wedding day schedule" } as T,
  scheduleNote: { hy: "Գծում է օրվա երթուղին ձեր ծրագրից", en: "Draws the day's route from your programme" } as T,
  guestbook: { hy: "Բարեմաղթանքների պատ", en: "Guestbook" } as T,
  guestbookNote: { hy: "Հյուրերի խոսքերը երևում են հրապարակված հղումի վրա. դուք տեսնում եք ձեր ցուցակում", en: "Guests' words appear on the published link; you see them in your guest list" } as T,
  gifts: { hy: "Նվերի արկղ", en: "Gift box" } as T,
  giftsEmpty: { hy: "Դեռ եղանակ չկա — ավելացրեք ներքևից", en: "No gift methods yet — add one below" } as T,
  thanks: { hy: "Շնորհակալական խոսք", en: "Thank you note" } as T,
  thanksPh: { hy: "Ձեր ներկայությունը ամենամեծ նվերն է…", en: "Your presence would be the greatest gift…" } as T,
  music: { hy: "Ֆոնային երաժշտություն", en: "Background music" } as T,
  envelope: { hy: "Ծրար", en: "Envelope" } as T,
  greetL: { hy: "Ողջույնի տողը", en: "Greeting" } as T,
  greetNote: { hy: "Կհայտնվի ծրարի քարտի վրա՝ մոնոգրամի մոտ", en: "Appears on the envelope's card, by the monogram" } as T,
  shareTitle: { hy: "Կիսվելու նախադիտումը", en: "Social share preview" } as T,
  shareNote: { hy: "Ինչ է երևում, երբ հղումն ուղարկում եք WhatsApp-ով", en: "What shows when you send the link on WhatsApp" } as T,
  shareEnv: { hy: "Ծրարը", en: "Envelope" } as T,
  sharePhoto: { hy: "Ձեր լուսանկարը", en: "Your photo" } as T,
  sharePhotoNote: { hy: "Աշխատում է, երբ լուսանկար եք ավելացրել", en: "Works once you have added a photograph" } as T,
  // the reference editor's finer anatomy (2026-08-27)
  defaultL: { hy: "Լռելյայն", en: "Default" } as T,
  usingTpl: { hy: "Օգտագործվում է ձևանմուշի սեփական տողը՝", en: "Using the template's wording:" } as T,
  clearL: { hy: "Մաքրել", en: "Clear" } as T,
  displayOrder: { hy: "ՑՈՒՑԱԴՐՄԱՆ ՀԵՐԹԸ", en: "DISPLAY ORDER" } as T,
  layoutL: { hy: "ԴԱՍԱՎՈՐՈՒԹՅՈՒՆ", en: "LAYOUT" } as T,
  layoutGrid: { hy: "Ցանց", en: "Grid" } as T,
  layoutMasonry: { hy: "Կոլաժ", en: "Collage" } as T,
  layoutNote: { hy: "Ինչպես են շարվում լուսանկարները հրավերի վրա", en: "How the photographs arrange on the invitation" } as T,
  openLbl: { hy: "Ձեր խոսքը (դատարկը՝ թաքցնում է)", en: "Custom message (leave empty to hide)" } as T,
  ceremonyHeadNote: { hy: "Տպվում է ծրագրի բլոկի վերևում. դատարկը՝ հանում է", en: "Printed above the block on your card; empty removes it" } as T,
  ceremonyAsk: { hy: "Տա՞նն էլ արարողություն կա — ավելացրեք որպես կանգառ ներքևի կոճակով", en: "Do you have a ceremony at home? Add it as a stop with the button below" } as T,
  displayStyle: { hy: "ՑՈՒՑԱԴՐՄԱՆ ՈՃԸ", en: "DISPLAY STYLE" } as T,
  wallManage: { hy: "Դիտել և կառավարել", en: "View and manage" } as T,
  greetNote2: { hy: "Կիրառվում է բոլոր հյուրերին. անունով դիմելու համար՝ ?g= հղումը հյուրերի ցուցակից", en: "Applies to all guests; for a per-guest address use the ?g= link from your guest list" } as T,
  previewCap: { hy: "ՆԱԽԱԴԻՏՈՒՄ", en: "PREVIEW" } as T,
  shareCache: { hy: "Սոց-ցանցերը պահում են քարտը հիշողության մեջ. խմբագրումից հետո այն կարող է թարմանալ ուշացումով", en: "Social networks cache the card; after an edit it may refresh with a delay" } as T,
  settingsL: { hy: "Կարգավորումներ", en: "Settings" } as T,
  switchTpl: { hy: "Փոխել ձևանմուշը", en: "Switch template" } as T,
  timeFormat: { hy: "ԺԱՄԻ ՁԵՎԱՉԱՓԸ", en: "TIME FORMAT" } as T,
} as const;

// ---------------------------------------------------------------------------
// THE FILM — /film/<tpl>, the third way to invite (2026-08-25). Built, so the
// «coming next» chips became links.
// ---------------------------------------------------------------------------
export const filmPage = {
  kicker: { hy: "Վիդեո-հրավեր", en: "The film invitation" } as T,
  title: { hy: "Հրավերը՝ որպես ֆիլմ", en: "Your invitation, as a film" } as T,
  lead: {
    hy: "Նույն հրավերը՝ շարժվող։ Բացվում է հղումով և ինքն իրեն նվագում՝ հեռախոսի ուղղահայաց կադրում, ինչպես պատմություն։",
    en: "The same invitation, moving. It opens in a link and plays itself — in a phone's vertical frame, like a story.",
  } as T,
  openInvitation: { hy: "Բացել ամբողջ հրավերը", en: "Open the full invitation" } as T,
  build: { hy: "Կառուցել իմ անուններով", en: "Build it with my names" } as T,
  note: {
    hy: "Ֆիլմը նվագում է հղումի մեջ՝ ցանկացած հեռախոսի վրա։ Ֆայլով (.mp4) ստանալու համար՝ գրեք մեզ, պատրաստում ենք ձեր հրավերից։",
    en: "The film plays inside the link, on any phone. For a file (.mp4) to post as a story, write to us — we render it from your invitation.",
  } as T,
  watch: { hy: "Դիտել ֆիլմը", en: "Watch the film" } as T,
} as const;

// ---------------------------------------------------------------------------
// WEDDING CARDS — /wedding-cards, /wedding-cards/<design>, the envelope link.
// ---------------------------------------------------------------------------
export const wcards = {
  title: { hy: "Հարսանեկան հրավիրատոմս-քարտեր", en: "Wedding invitation cards" } as T,
  kicker: { hy: "Հրավեր՝ ծրարով", en: "Invitations, in an envelope" } as T,
  lead: {
    hy: "Ընտրեք քարտը, գրեք ձեր անուններն ու օրը, ընտրեք ծրարը, աստառը, դրոշմանիշն ու մոմե կնիքը։ Հյուրը ստանում է հղում. ծրարը՝ իր անունով, բացվում է, քարտը դուրս է սահում։ Հետո՝ ծրագիրը, քարտեզը, RSVP-ն։",
    en: "Choose a card, type your names and the day, pick the envelope, liner, stamp and wax seal. A guest gets a link: the envelope, addressed to them, opens and the card slides out. Then the programme, the map, the RSVP.",
  } as T,
  ways: { hy: "Երեք ձև՝ հրավիրելու", en: "Three ways to invite" } as T,
  wayCard: { hy: "Քարտով և ծրարով", en: "As a card, in an envelope" } as T,
  wayWeb: { hy: "Կայք-հրավերով", en: "As a web invitation" } as T,
  wayVideo: { hy: "Վիդեո-անիմացիայով", en: "As a video animation" } as T,
  waySoon: { hy: "Շուտով", en: "Coming next" } as T,
  styles: { hy: "Ոճեր", en: "Styles" } as T,
  colors: { hy: "Գույն", en: "Colour" } as T,
  photos: { hy: "Նկարներ", en: "Photos" } as T,
  photoAll: { hy: "Բոլորը", en: "All" } as T,
  photo1: { hy: "1 նկար", en: "1 photo" } as T,
  photo2: { hy: "2 նկար", en: "2 photos" } as T,
  photo3: { hy: "3+ նկար", en: "3+ photos" } as T,
  photoNone: { hy: "Առանց նկարի", en: "No photo" } as T,
  shape: { hy: "Ձևը", en: "Shape" } as T,
  features: { hy: "Հնարավորություններ", en: "Features" } as T,
  collections: { hy: "Հավաքածուներ", en: "Collections" } as T,
  all: { hy: "Բոլորը", en: "All" } as T,
  results: { hy: "դիզայն", en: "designs" } as T,
  none: { hy: "Այս զտիչներով դիզայն չկա — մաքրեք որևէ մեկը։", en: "No design matches these filters — clear one." } as T,
  clear: { hy: "Մաքրել զտիչները", en: "Clear all filters" } as T,
  search: { hy: "Որոնել դիզայն…", en: "Search for a design…" } as T,
  previewWith: { hy: "Նախադիտել ձեր անուններով", en: "Preview with your names" } as T,
  nameA: { hy: "Հարսի անունը", en: "Bride's name" } as T,
  nameB: { hy: "Փեսայի անունը", en: "Groom's name" } as T,
  backside: { hy: "Հակառակ երեսով", en: "Backside supported" } as T,
  hoverBack: { hy: "Հպեք՝ հակառակ երեսը տեսնելու", en: "Hover to see the back" } as T,
  customize: { hy: "Սկսել անհատականացումը", en: "Start Customizing" } as T,
  previewAnim: { hy: "Դիտել անիմացիան", en: "Preview Animation" } as T,
  previewNote: { hy: "Կարող եք փոխել քարտի տեքստը, ֆոնը և ծրարը։", en: "You will be able to change the card text, background and envelope." } as T,
  matching: { hy: "Համապատասխան հավաքածու", en: "Matching components" } as T,
  saveTheDate: { hy: "Save the Date", en: "Save the Date" } as T,
  thankYou: { hy: "Շնորհակալության քարտ", en: "Thank You Note" } as T,
  detailsCard: { hy: "Մանրամասների քարտ", en: "Details card" } as T,
  rsvpCard: { hy: "RSVP քարտ", en: "RSVP card" } as T,
  more: { hy: "Կհավանեք նաև", en: "Other designs you may like" } as T,
  backAll: { hy: "Բոլոր դիզայնները", en: "All designs" } as T,
  by: { hy: "Դիզայն՝", en: "Design by" } as T,
  colorway: { hy: "Գույն", en: "Colour" } as T,
  cardTab: { hy: "Քարտ", en: "Card" } as T,
  backTab: { hy: "Հակառակ երես", en: "Back" } as T,
  envTab: { hy: "Ծրար", en: "Envelope" } as T,
  animTab: { hy: "Անիմացիա", en: "Animation" } as T,
  fill: { hy: "Լրացրեք՝ քարտը փոխվում է անմիջապես", en: "Fill in — the card changes as you type" } as T,
  couple: { hy: "Ամուսնացողները", en: "The couple" } as T,
  hostLine: { hy: "Ընտանիքների տողը", en: "The families line" } as T,
  hostPh: { hy: "Ավագյան և Մանուկյան ընտանիքները", en: "The Avagyan and Manukyan families" } as T,
  when: { hy: "Երբ", en: "When" } as T,
  where: { hy: "Որտեղ", en: "Where" } as T,
  venue: { hy: "Վայրը", en: "Venue" } as T,
  venuePh: { hy: "Սուրբ Աստվածածին եկեղեցի", en: "Surb Astvatsatsin Church" } as T,
  address: { hy: "Հասցեն", en: "Address" } as T,
  city: { hy: "Քաղաքը", en: "City" } as T,
  map: { hy: "Քարտեզի հղում", en: "Map link" } as T,
  programme: { hy: "Օրվա ընթացքը (հակառակ երեսին)", en: "The day's programme (on the back)" } as T,
  note: { hy: "Ձեր տողը", en: "Your line" } as T,
  notePh: { hy: "Հագուստի կոդ՝ երեկոյան", en: "Dress code: evening" } as T,
  rsvpBy: { hy: "Պատասխանել մինչև", en: "RSVP by" } as T,
  envelope: { hy: "Ծրարը", en: "The envelope" } as T,
  cover: { hy: "Ծրարի թուղթը", en: "Envelope paper" } as T,
  liner: { hy: "Աստառը", en: "Liner" } as T,
  stamp: { hy: "Դրոշմանիշը", en: "Stamp" } as T,
  seal: { hy: "Մոմե կնիքը", en: "Wax seal" } as T,
  backdrop: { hy: "Ֆոնը", en: "Backdrop" } as T,
  music: { hy: "Երաժշտություն (https հղում)", en: "Music (https link)" } as T,
  guestName: { hy: "Հյուրի անունը ծրարին (փորձեք)", en: "Guest name on the envelope (try it)" } as T,
  guestHint: { hy: "Իրական հղումում ամեն հյուր տեսնում է ԻՐ անունը՝ ?g= պարամետրով։", en: "On the real link every guest sees THEIR name — the ?g= parameter." } as T,
  photosLbl: { hy: "Նկարներ", en: "Photos" } as T,
  choosePhoto: { hy: "Ընտրել", en: "Choose" } as T,
  bullets: [
    { hy: "Ծրարը՝ հյուրի անունով. բացվում է իսկական անիմացիայով, քարտը դուրս է սահում։", en: "The envelope carries the guest's name; it opens with the real animation and the card slides out." },
    { hy: "Քարտի հակառակ երեսին՝ օրվա ընթացքը։ Ներքևում՝ քարտեզ, օրացույց, հաշվարկ, RSVP կողմերով։", en: "The day's programme on the back; below, map, calendar, countdown, RSVP by side." },
    { hy: "Ուղարկեք հղումով, WhatsApp-ով, QR-ով։ Պատասխանները՝ ձեր ցուցակում, Excel։", en: "Send by link, WhatsApp, QR. Answers in your list, Excel." },
    { hy: "Ֆոլգա, ջրաներկ, բուսական, հայկական՝ նուռ, հավերժություն, Արարատ։", en: "Foil, watercolour, botanical, Armenian — pomegranate, eternity, Ararat." },
  ] as T[],
  sample: { hy: "Ցուցադրական հրավեր — զույգը հորինված է։", en: "Sample invitation — the couple is made up." } as T,
  open: { hy: "Բացել ծրարը", en: "Open the envelope" } as T,
  details: { hy: "Մանրամասներ", en: "Details" } as T,
} as const;

// ---------------------------------------------------------------------------
// THE ENGINE showcase — /wedding-live (in the wedding part).
// ---------------------------------------------------------------------------
export const live = {
  title: { hy: "Կայք-հրավերի շարժիչը", en: "The web-invitation engine" } as T,
  kicker: { hy: "Հրավեր՝ կայքով", en: "Invitations, as a web page" } as T,
  lead: {
    hy: "Մեկ տվյալների սխեմա, ինը ոճ՝ հինգը հարսանիքի համար։ Հերոս, հաշվարկ, օրացույց, ժամանակացույց՝ պատկերակներով և ուղղություններով, հագուստի գույներ, նկարներ, RSVP՝ հյուրերի ցուցակի հետ։ Ընտրեք ոճը, լրացրեք տվյալները մոգում — բոլոր ոճերը փոխվում են միանգամից։",
    en: "One data schema, nine styles — five of them for a wedding. Hero, countdown, calendar, a timeline with icons and directions, dress code, photos, RSVP tied to your guest list. Pick a style, fill in the wizard — every style updates at once.",
  } as T,
  styleA: { hy: "Ոճ A", en: "Style A" } as T,
  styleB: { hy: "Ոճ B", en: "Style B" } as T,
  after: { hy: "Կառուցվածքը՝", en: "Structure after" } as T,
  anatomy: { hy: "Հատվածների կարգը", en: "Section order" } as T,
  open: { hy: "Բացել ամբողջ էջով", en: "Open full page" } as T,
  customize: { hy: "Անհատականացնել մոգում", en: "Customize in the wizard" } as T,
  preview: { hy: "Կենդանի նախադիտում", en: "Live preview" } as T,
  schema: { hy: "Միասնական սխեմա", en: "The unified schema" } as T,
  schemaLead: { hy: "Ինքնություն · նյութեր · ժամանակացույց · հնարավորություններ · հավելումներ — types/invitation.ts", en: "Identity · assets · schedule · features · extras — types/invitation.ts" } as T,
  sections: [
    { hy: "<HeroHeader /> — կենտրոնացված, կինեմատիկ վիդեո (ձայն), ժապավեն, նեոն, ամպեր", en: "<HeroHeader /> — centred, cinematic video (mute), photo strip, neon, clouds" },
    { hy: "<CountdownTimer /> — օր : ժամ : րոպե : վայրկյան, «N օր մնաց», տարիքի հաշվարկ", en: "<CountdownTimer /> — d : h : m : s, «N days left», age counter" },
    { hy: "<ProgramTimeline /> — պատկերակ, ժամ, վայր, հասցե, <VenueMapButton /> ուղղություններով", en: "<ProgramTimeline /> — icon, time badge, venue, address, <VenueMapButton /> with directions" },
    { hy: "<MonthCalendar /> · <DressCodeSwatches /> · <PhotoGallery /> (լայթբոքս)", en: "<MonthCalendar /> · <DressCodeSwatches /> · <PhotoGallery /> (lightbox)" },
    { hy: "<RsvpModal /> — ներդիր կամ մոդալ. այո/ոչ, կողմ, հյուրերի քանակ, սնունդ, ալերգիա → հյուրերի ցուցակ, Excel / Sheets", en: "<RsvpModal /> — inline or modal: yes/no, side, guest count, meal, allergies → guest list, Excel / Sheets" },
    { hy: "Դարպաս + երաժշտության ավտոնվագարկիչ, սուրբգրային տող, .ics, կիսվել", en: "Gate + music autoplayer, epigraph, .ics, share" },
  ] as T[],
  binding: { hy: "Իրական ժամանակի կապ", en: "Real-time binding" } as T,
  bindingLead: { hy: "Մոգի ամեն ստեղնաշարի հարվածը՝ Draft → InvitationData → բոլոր ոճերը։ Ձևանմուշների շարժիչի ոճերը մոգում ընտրվում են որպես ձևանմուշ, և Կենդանի ցուցադրությունը բացում է հենց այս էջը։", en: "Every wizard keystroke: Draft → InvitationData → every style. The engine's styles are picked as templates in the wizard, and Live Demo opens exactly this page." } as T,
  ways: { hy: "Երեք ձև՝ հրավիրելու", en: "Three ways to invite" } as T,
} as const;

// ============================================================================
// THE LEAN LANDING — components/ServiceHome.tsx, rebuilt 2026-08-23 from the
// ground per the client: a hero that says WHAT THE APP IS FOR, the wedding
// examples on scroll, the three steps, the result, the order. Anatomy after
// what the leading invitation services (Paperless Post, Greenvelope) put on
// their front doors: one promise → browse → how → proof → the ask.
// Every claim below is a shipped feature — nothing invited, nothing invented.
// ============================================================================
export const landing = {
  nav: {
    examples: { hy: "Օրինակներ", en: "Examples" } as T,
    result: { hy: "Արդյունքը", en: "The result" } as T,
  },
  hero: {
    kicker: { hy: "Թվային հրավիրատոմսերի ստուդիա", en: "A digital invitation studio" } as T,
    title: { hy: "Հրավերը, որ բացվում է կնիքից", en: "The invitation that opens from a seal" } as T,
    // what the app IS FOR, in one paragraph — the client's ask
    desc: {
      hy: "ԿՆԻՔ-ը հարսանեկան հրավերը դարձնում է կենդանի կայք-էջ։ Ընտրում եք ձևանմուշը, գրում անուններն ու օրը, ավելացնում ձեր լուսանկարները — և ստանում մեկ հղում, որ հյուրերը բացում են երեք լեզվով՝ ծրագրով, քարտեզով, հետհաշվարկով և պատասխանի ձևով։ Պատասխանները հավաքվում են ձեր ցուցակում՝ Excel-ով ներբեռնելի։",
      en: "KNIQ turns a wedding invitation into a living web page. Pick a design, write your names and the day, add your photographs — and receive one link your guests open in three languages, with the programme, the map, the countdown and the RSVP. The answers gather in your guest list, ready to download as Excel.",
    } as T,
    see: { hy: "Դիտել օրինակները", en: "See the examples" } as T,
    // THE OPENER (2026-08-27, after the reference's front door): the page now
  // STARTS with the brand promise beside two standing phones, and only then
  // hands over to the slats hero below
  opener: {
    brand: { hy: "ԿՆԻՔ", en: "KNIQ" } as T,
    title: { hy: "Առցանց հարսանեկան հրավերներ", en: "Online wedding invitations" } as T,
    quote: { hy: "«Հրավերը, որ բացվում է կնիքից»", en: "“The invitation that opens from a seal”" } as T,
    sub: {
      hy: "Դասական հրավիրատոմսի ժամանակակից շարունակությունը՝ կիսվեք ձեր օրով ավելի արագ, ավելի հեռու, ավելի շատերի հետ։",
      en: "A modern take on the classical invitation — share your day faster, further, with more people.",
    } as T,
    note: { hy: "Ստեղծելը անվճար է · վճարում եք միայն պատվերի դեպքում", en: "Creating is free · you pay only when you order" } as T,
    cta: { hy: "Ստեղծել հիմա", en: "Create now" } as T,
  },
  // the hero wears the SLATS now (client, 2026-08-24: «second screenshot
    // effect must be in hero part and vice versa») — the drum's strings
    // moved down to the birthday chapter with the drum itself
    slatsLabel: { hy: "Հարսանեկան ձևանմուշները՝ բացվող շերտերով", en: "The wedding designs, as opening slats" } as T,
    open: { hy: "Բացել", en: "Open" } as T,
    // the wedding chapter's own name, standing over the slats (client,
    // 2026-08-24): the promise above it fades out with the scroll, and this
    // walks left — the same chapter grammar the lower sections speak
    wedKicker: { hy: "Հարսանիք", en: "Weddings" } as T,
    wedTitle: { hy: "Հարսանեկան օրինակները", en: "The wedding examples" } as T,
    create: { hy: "Ստեղծել հրավեր", en: "Create invitation" } as T,
    scroll: { hy: "Ոլորեք", en: "Scroll" } as T,
  },
  // ---- the three occasion chapters the landing walks through (2026-08-24) --
  // Wedding (the hero + the deck), then engagement (the fanned pile), then
  // birthday (the opening slats) — each on its own ground, after the
  // reference portfolio's chapter colours. No string here carries a count;
  // counts are read from lib/examples at render time.
  eng: {
    kicker: { hy: "Նշանադրություն", en: "Engagement" } as T,
    title: { hy: "Նշանադրության հրավերները", en: "The engagement invitations" } as T,
    lead: {
      hy: "Քաշեք տրցակը՝ թերթելու համար։ Ամեն քարտ բացվում է կենդանի՝ իր բաժիններով և գնով, առանց էջը լքելու։",
      en: "Drag the pile to browse. Every card opens live — its sections and its price — without leaving the page.",
    } as T,
    // the rolling film strip lives HERE now (client, 2026-08-24 — moved out
    // of the wedding hero): the finished pages passing by
    galleryLabel: { hy: "Պատրաստի հրավերները՝ ամբողջ էջով", en: "The finished invitations, full page" } as T,
    create: { hy: "Ստեղծել նշանադրության հրավեր", en: "Create an engagement invitation" } as T,
  },
  bday: {
    kicker: { hy: "Ծնունդ", en: "Birthdays" } as T,
    title: { hy: "Ծննդյան օրվա հրավերները", en: "The birthday invitations" } as T,
    // the birthday chapter wears the DRUM now (the hero's old stage)
    lead: {
      hy: "Պտտեք թմբուկը՝ ամեն երեսը մեկ ձևանմուշ է, ցուցադրված այնպես, ինչպես կերևա հեռախոսին։ Հպումը բացում է կազմիչը՝ այդ ձևանմուշն արդեն ընտրված։",
      en: "Spin the drum — every face is one design, shown the way a phone will show it. A tap opens the builder with that design already picked.",
    } as T,
    drumLabel: { hy: "Ծննդյան ձևանմուշները՝ պտտվող թմբուկի վրա", en: "The birthday designs, on a turning drum" } as T,
    drumHint: { hy: "Քաշեք՝ պտտելու համար · հպումը բացում է", en: "Drag to spin · a tap opens it" } as T,
    create: { hy: "Ստեղծել ծննդյան հրավեր", en: "Create a birthday invitation" } as T,
    kids: { hy: "Մանկական քարտերը՝ բոլորը", en: "All the children's cards" } as T,
  },
  how: {
    kicker: { hy: "Ճանապարհը", en: "The path" } as T,
    title: { hy: "Երեք քայլ մինչև հղումը", en: "Three steps to the link" } as T,
    list: [
      {
        icon: "seal",
        t: { hy: "Ընտրեք օրինակը", en: "Choose an example" },
        d: {
          // no COUNT in the copy — the catalogue grows and a number here goes
          // stale (it already had: «eighteen» while the deck held 22)
          hy: "Կայք-էջեր, շարժիչի ոճեր, ծրարով քարտեր՝ ամեն առիթի համար։ Ամեն մեկը բացվում է կենդանի՝ իր գնով, առանց էջը լքելու։",
          en: "Web pages, engine styles, cards in an envelope — for every occasion. Each opens live, with its price, without leaving the page.",
        },
      },
      {
        icon: "check",
        t: { hy: "Գրեք ձեր տվյալները", en: "Write your details" },
        d: {
          hy: "Անուններ, օր, վայր, ծրագիր, ձեր լուսանկարները։ Ամեն ինչ հայտնվում է նախադիտման մեջ հենց գրելու պահին — նկարներն ինքնաբերաբար ստանում են ձևանմուշի բոլոր էֆեկտները։",
          en: "Names, the day, the venue, the programme, your photographs. Everything lands in the preview the moment you type it — the pictures take on every effect the design already has.",
        },
      },
      {
        icon: "share",
        t: { hy: "Ստացեք հղումը", en: "Receive the link" },
        d: {
          hy: "Կենդանի էջ երեք լեզվով՝ RSVP-ով ըստ կողմի, հյուրերի ցուցակով և Excel արտահանմամբ։ Կիսվեք WhatsApp-ով ու Telegram-ով, կամ պատվիրեք՝ և մենք կավարտենք ձեզ համար։",
          en: "A live page in three languages — RSVP by side, a guest list, an Excel export. Share it by WhatsApp and Telegram, or place the order and we finish it for you.",
        },
      },
    ],
  },
  result: {
    kicker: { hy: "Արդյունքը", en: "The result" } as T,
    title: { hy: "Ահա թե ինչ են բացում հյուրերը", en: "This is what your guests open" } as T,
    // no «on the right»: on a phone the page sits BELOW this line, so the
    // copy points at the thing, not at a direction only desktops have
    lead: {
      hy: "Սա իսկական էջն է՝ ոլորեք այն։ Նույնը, ինչ կստանա ամեն հյուր՝ ձեր անուններով և ձեր նկարներով։",
      en: "This is the real page — scroll it. The same one every guest receives, wearing your names and your photographs.",
    } as T,
    points: [
      { icon: "globe", t: { hy: "Երեք լեզու", en: "Three languages" }, d: { hy: "Հյուրը բացում է հայերեն, անգլերեն կամ ռուսերեն — մեկ հղումով։", en: "A guest opens it in Armenian, English or Russian — one link." } },
      { icon: "users", t: { hy: "RSVP և հյուրերի ցուցակ", en: "RSVP and the guest list" }, d: { hy: "Պատասխան՝ հարսի կամ փեսայի կողմից, ուղեկիցով։ Բոլոր պատասխանները՝ ձեր վահանակում, Excel-ով։", en: "Answers by the bride's or the groom's side, plus-ones included. Every answer in your dashboard, downloadable as Excel." } },
      { icon: "calendar", t: { hy: "Օրացույց և հետհաշվարկ", en: "Calendar and countdown" }, d: { hy: "Մեկ հպումով .ics՝ հյուրի օրացույցում, և օրվա հետհաշվարկը՝ էջի վրա։", en: "One tap puts the day in the guest's calendar; the countdown runs on the page." } },
      { icon: "music", t: { hy: "Երաժշտություն և տեսանյութ", en: "Music and film" }, d: { hy: "Պրեմիում ձևանմուշները նվագում են ձեր երգը և բացվում ձեր տեսանյութով։", en: "The premium designs play your song and open on your film." } },
    ],
    open: { hy: "Բացել ամբողջ էջով", en: "Open the full page" } as T,
    phoneLabel: { hy: "Կենդանի հրավերը՝ հեռախոսի չափի պատուհանում", en: "The live invitation, at phone size" } as T,
  },
  order: {
    kicker: { hy: "Պատվերը", en: "The order" } as T,
  },
} as const;
