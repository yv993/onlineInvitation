import type { InvitationData, TemplateStyle } from "@/types/invitation";
import handsBouquet from "@/assets/photos/hands-bouquet.webp";
import coupleHill from "@/assets/photos/couple-hill.webp";
import rings from "@/assets/photos/rings.webp";
import ringbox from "@/assets/photos/ringbox.webp";
import lace from "@/assets/photos/lace.webp";
import shoes from "@/assets/photos/shoes.webp";
import candles from "@/assets/photos/candles.webp";
import tealights from "@/assets/photos/tealights.webp";
import churchCross from "@/assets/photos/church-cross.webp";
import candleCross from "@/assets/photos/candle-cross.webp";
import jarsAngel from "@/assets/photos/jars-angel.webp";
import chapelCliff from "@/assets/photos/chapel-cliff.webp";
import cakeGold from "@/assets/photos/cake-gold.webp";
import balloonsKids from "@/assets/photos/balloons-kids.webp";
import balloonArch from "@/assets/photos/balloon-arch.webp";
import starsNight from "@/assets/photos/stars-night.webp";
import stageSpeaker from "@/assets/photos/stage-speaker.webp";
import stageStar from "@/assets/photos/stage-star.webp";
import audience from "@/assets/photos/audience.webp";
import araratDawn from "@/assets/photos/ararat-dawn.webp";
import noravank from "@/assets/photos/noravank.webp";
import sevanavank from "@/assets/photos/sevanavank.webp";
import sevanLake from "@/assets/photos/sevan-lake.webp";
import wingSky from "@/assets/photos/wing-sky.webp";
import pearlsPaper from "@/assets/photos/pearls-paper.webp";
import pearlsGrey from "@/assets/photos/pearls-grey.webp";
import suitRose from "@/assets/photos/suit-rose.webp";

// ============================================================================
// THE SAMPLE OBJECTS — one per event type, plus both wedding styles. These are
// the "mock JSON" the brief asks for, kept as typed modules so the plates are
// static imports (blur placeholders, real dimensions) and every string is
// bilingual by construction. Nobody here is real; every footer says so.
// ============================================================================

const D = "2026-11-14"; // a Saturday
const A = "+04:00";

const rsvpBase = (event: string, extra: Partial<InvitationData["features"]["rsvp"]> = {}): InvitationData["features"]["rsvp"] => ({
  enabled: true,
  askGuests: true,
  maxGuests: 10,
  askMessage: true,
  export: "both",
  event,
  presentation: "inline",
  ...extra,
});

// ------------------------------------------------------------ WEDDING · A
export const weddingClassic: InvitationData = {
  id: "wedding-classic",
  type: "wedding",
  style: "classic-floral",
  identity: {
    hosts: [{ hy: "Նարեկ", en: "Narek" }, { hy: "Սոնա", en: "Sona" }],
    kicker: { hy: "Save the date", en: "Save the date" },
    subtitle: { hy: "Հարսանեկան հրավեր", en: "Wedding invitation" },
    families: { hy: "Ընտանիքների հետ միասին", en: "Together with their families" },
    blurb: {
      hy: "Սիրելի՛ հարազատներ, սիրով հրավիրում ենք Ձեզ մեզ հետ միասին տոնելու մեր կյանքի ամենակարևոր և գեղեցիկ օրը։ Մեր ճանապարհները միանում են՝ սկսելով մի նոր բաժին՝ միասին։",
      en: "Dear family and friends, we warmly invite you to celebrate with us the most important and beautiful day of our lives. Our roads are joining — a new chapter begins, together.",
    },
    date: `${D}T12:00:00${A}`,
    end: `${D}T23:59:00${A}`,
    city: { hy: "Երևան", en: "Yerevan" },
    monogram: { a: "Ն", b: "Ս" },
  },
  assets: {
    hero: [{ kind: "image", src: handsBouquet, alt: { hy: "Երկու ձեռք՝ մատանիներով, փնջի վրա", en: "Two hands with rings on a bouquet" } }],
    palette: { bg: "#F7F3EC", ink: "#1C1A17", soft: "#5A5148", accent: "#B08D57", accentInk: "#7E6034", panel: "rgba(255,255,255,0.62)", dark: false },
    font: "serif",
    audio: { src: "/audio/pad-warm.mp3", label: { hy: "Ջերմ բեմ (սինթեզված)", en: "Warm bed (synthesized)" }, synthesized: true },
    gallery: [
      { kind: "image", src: coupleHill, alt: { hy: "Բլրի վրա", en: "On the ridge" } },
      { kind: "image", src: rings, alt: { hy: "Մատանիներ", en: "Rings" } },
      { kind: "image", src: lace, alt: { hy: "Ժանյակ", en: "Lace" } },
      { kind: "image", src: shoes, alt: { hy: "Կոշիկներ", en: "Shoes" } },
    ],
    ambient: "floral",
  },
  schedule: {
    title: { hy: "Ժամանակացույց", en: "The day" },
    connector: "path",
    blocks: [
      { id: "groom", icon: "groom", time: "11:00", title: { hy: "Փեսայի տուն", en: "The groom's home" }, venue: { hy: "ք. Երևան, Հանրապետության 62", en: "62 Hanrapetutyan St, Yerevan" } },
      { id: "bride", icon: "bride", time: "12:00", title: { hy: "Հարսի տուն", en: "The bride's home" }, venue: { hy: "ք. Երևան, Տպագրիչներ 9", en: "9 Tpagrichner St, Yerevan" } },
      { id: "church", icon: "church", time: "14:00", title: { hy: "Պսակադրություն", en: "The ceremony" }, venue: { hy: "Սաղմոսավանք", en: "Saghmosavank" }, address: { hy: "Արագածոտնի մարզ", en: "Aragatsotn province" }, mapUrl: "https://yandex.com/maps/?text=Saghmosavank" },
      { id: "photo", icon: "photo", time: "15:30", title: { hy: "Ֆոտոսեսիա", en: "Photo session" }, venue: { hy: "Ջրվեժ անտառապարկ", en: "Jrvezh forest park" }, mapUrl: "https://yandex.com/maps/?text=Jrvezh%20forest%20park" },
      { id: "reception", icon: "reception", time: "17:30", title: { hy: "Հարսանյաց հանդիսություն", en: "The reception" }, venue: { hy: "Vivaldi Hall", en: "Vivaldi Hall" }, address: { hy: "Երևան", en: "Yerevan" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Vivaldi%20Hall%20Yerevan" },
    ],
  },
  features: {
    countdown: { enabled: true, style: "dhms", label: { hy: "Միջոցառմանը մնաց", en: "Until the day" } },
    calendar: { enabled: true },
    maps: { provider: "google", directions: true },
    dressCode: { swatches: ["#B08D57", "#8F4B45", "#E9CFC8", "#5F7F5A"], label: { hy: "Հագուստի գույներ", en: "Dress code" }, note: { hy: "Խնդրում ենք խուսափել սպիտակ հագուստ կրելուց և հնարավորության դեպքում հետևել մեր գունային երանգներին։", en: "Please avoid wearing white and, where you can, follow our palette." } },
    gallery: { layout: "pair", lightbox: true, label: { hy: "Նկարներ", en: "Photos" } },
    rsvp: rsvpBase("live-wedding-classic", { deadline: `2026-10-25T23:59:00${A}`, askSide: true, sides: [{ hy: "Նարեկի", en: "Narek's" }, { hy: "Սոնայի", en: "Sona's" }], askDiet: true, dietOptions: [{ hy: "Միս", en: "Meat" }, { hy: "Ձուկ", en: "Fish" }, { hy: "Բուսական", en: "Vegetarian" }] }),
    ics: true,
    share: true,
    music: { autoplayOnGate: true, showControl: true },
    gate: { enabled: true, label: { hy: "Save the date", en: "Save the date" }, button: { hy: "Բացել հրավերը", en: "View invitation" } },
    epigraph: { text: { hy: "«Ինչ Աստված միացրել է, մարդ թող չբաժանի»։", en: "“What God has joined together, let no one separate.”" }, from: { hy: "Մարկոս 10:9", en: "Mark 10:9" } },
    details: [{ hy: "Հարգելի՛ հյուրեր, հրավառության ընթացքում խնդրում ենք երեխաներին պահել Ձեր կողքին։ Շնորհակալ ենք ըմբռնման համար։", en: "Dear guests, please keep children close during the fireworks. Thank you for understanding." }],
  },
  meta: { sample: true, footerLine: { hy: "Սիրով կսպասենք", en: "With love, we'll be waiting" } },
};

// ------------------------------------------------------------ WEDDING · B
export const weddingCinematic: InvitationData = {
  ...weddingClassic,
  id: "wedding-cinematic",
  style: "modern-cinematic",
  identity: {
    ...weddingClassic.identity,
    hosts: [{ hy: "Արթուր", en: "Arthur" }, { hy: "Դիանա", en: "Diana" }],
    kicker: { hy: "Հարսանեկան հրավեր", en: "Wedding invitation" },
    subtitle: { hy: "Save the date", en: "Save the date" },
    families: { hy: "Ընտանիքների հետ միասին", en: "Together with their families" },
    blurb: { hy: "Ընտանիքների հետ միասին՝ Արթուրն ու Դիանան խնդրում են Ձեր ներկայության պատիվը իրենց հարսանիքին։", en: "Together with their families, Arthur and Diana request the honour of your presence at their wedding." },
    date: `${D}T18:00:00${A}`,
    monogram: { a: "A", b: "D" },
  },
  assets: {
    hero: [
      { kind: "video", src: "/video/ambient-rose.mp4", poster: coupleHill, alt: { hy: "Վարդագույն լուսային ցիկլ (սինթեզված)", en: "Rose ambient loop (synthesized)" }, synthesized: true },
      { kind: "image", src: coupleHill, alt: { hy: "Բլրի վրա", en: "On the ridge" } },
    ],
    palette: { bg: "#14120F", ink: "#F3EFE7", soft: "#C9C2B4", accent: "#D4B478", accentInk: "#D4B478", panel: "rgba(255,255,255,0.08)", dark: true },
    font: "display",
    audio: { src: "/audio/pad-soft.mp3", label: { hy: "Մեղմ բեմ (սինթեզված)", en: "Soft bed (synthesized)" }, synthesized: true },
    gallery: [
      { kind: "image", src: coupleHill, alt: { hy: "Բլրի վրա", en: "On the ridge" } },
      { kind: "image", src: candles, alt: { hy: "Մոմեր", en: "Candles" } },
      { kind: "image", src: tealights, alt: { hy: "Ճրագներ", en: "Tealights" } },
    ],
    ambient: "gold",
  },
  schedule: {
    title: { hy: "Օրվա ընթացքը", en: "The day" },
    connector: "line",
    blocks: [
      { id: "reception", icon: "reception", time: "18:00", title: { hy: "Ընդունելություն", en: "Reception" }, venue: { hy: "Dvin Music Hall", en: "Dvin Music Hall" }, address: { hy: "Պարոնյան 40, Երևան", en: "40 Paronyan St, Yerevan" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Dvin%20Music%20Hall%20Yerevan" },
      { id: "dance", icon: "dance", time: "20:00", title: { hy: "Առաջին պար", en: "First dance" }, venue: { hy: "Dvin Music Hall", en: "Dvin Music Hall" } },
      { id: "cake", icon: "cake", time: "22:00", title: { hy: "Տորթ և հրավառություն", en: "Cake and fireworks" }, venue: { hy: "Բակ", en: "The courtyard" } },
    ],
  },
  features: {
    ...weddingClassic.features,
    countdown: { enabled: true, style: "days", label: { hy: "Մնաց", en: "Left" } },
    dressCode: { swatches: ["#1C1A17", "#D8C7A8"], label: { hy: "Հագուստի կոդ", en: "Dress code" }, note: { hy: "Սև և բեժ", en: "Black & beige" } },
    gallery: { layout: "strip", lightbox: true, label: { hy: "Պահ", en: "Moment" } },
    rsvp: rsvpBase("live-wedding-cinematic", { deadline: `2026-11-01T23:59:00${A}`, askDiet: true, dietOptions: [{ hy: "Միս", en: "Meat" }, { hy: "Ձուկ", en: "Fish" }, { hy: "Բուսական", en: "Vegetarian" }], askAllergy: true, presentation: "modal" }),
    gate: { enabled: true, label: { hy: "Save the date", en: "Save the date" }, button: { hy: "Բացել հրավերը", en: "View invitation" } },
    epigraph: { text: { hy: "«Իսկ այժմ մնում են հավատը, հույսը, սերը՝ այս երեքը. և սրանցից մեծը սերն է»։", en: "“And now these three remain: faith, hope and love. But the greatest of these is love.”" }, from: { hy: "Ա Կորնթացիներ 13:13", en: "1 Corinthians 13:13" } },
    details: undefined,
  },
  meta: { sample: true },
};

// ------------------------------------------------------------ ENGAGEMENT
export const engagement: InvitationData = {
  id: "engagement",
  type: "engagement",
  style: "engagement-save-the-date",
  identity: {
    hosts: [{ hy: "Անի", en: "Ani" }, { hy: "Արամ", en: "Aram" }],
    kicker: { hy: "Նշանվում ենք", en: "We are getting engaged" },
    subtitle: { hy: "Save the date", en: "Save the date" },
    blurb: { hy: "Մի երեկո, մեկ մատանի, բոլոր սիրելիները՝ մի սեղանի շուրջ։", en: "One evening, one ring, everyone we love around one table." },
    date: `${D}T18:00:00${A}`,
    end: `${D}T23:00:00${A}`,
    city: { hy: "Երևան", en: "Yerevan" },
    monogram: { a: "Ա", b: "Ա" },
  },
  assets: {
    hero: [{ kind: "image", src: ringbox, alt: { hy: "Բացված մատանիների տուփ", en: "An open ring box" } }, { kind: "image", src: rings, alt: { hy: "Մատանիներ", en: "Rings" } }, { kind: "image", src: handsBouquet, alt: { hy: "Ձեռքեր", en: "Hands" } }],
    palette: { bg: "#F7EEEA", ink: "#2A2622", soft: "#5A4E44", accent: "#C9A66B", accentInk: "#8F4B45", panel: "rgba(255,255,255,0.6)", dark: false },
    font: "script",
    audio: { src: "/audio/pad-warm.mp3", label: { hy: "Ջերմ բեմ (սինթեզված)", en: "Warm bed (synthesized)" }, synthesized: true },
    gallery: [{ kind: "image", src: ringbox, alt: { hy: "Տուփ", en: "Box" } }, { kind: "image", src: rings, alt: { hy: "Մատանիներ", en: "Rings" } }, { kind: "image", src: handsBouquet, alt: { hy: "Ձեռքեր", en: "Hands" } }, { kind: "image", src: coupleHill, alt: { hy: "Բլուր", en: "Ridge" } }],
    ambient: "sparkles",
  },
  schedule: {
    title: { hy: "Երեկոյի ընթացքը", en: "The evening" },
    connector: "line",
    blocks: [
      { id: "welcome", icon: "toast", time: "18:00", title: { hy: "Ընդունելություն", en: "Welcome drinks" }, venue: { hy: "«Այգի» ռեստորան, տեռաս", en: "Aygi restaurant, the terrace" }, address: { hy: "Աբովյան 12", en: "12 Abovyan St" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Abovyan%2012%20Yerevan" },
      { id: "dinner", icon: "reception", time: "19:00", title: { hy: "Ընթրիք", en: "Dinner" }, venue: { hy: "Սրահ", en: "The hall" } },
      { id: "dance", icon: "dance", time: "21:00", title: { hy: "Պար", en: "Dancing" }, venue: { hy: "Սրահ", en: "The hall" } },
    ],
  },
  features: {
    countdown: { enabled: true, style: "dhms", label: { hy: "Մինչև երեկոն", en: "Until the evening" } },
    calendar: { enabled: true },
    maps: { provider: "google", directions: true },
    gallery: { layout: "grid", lightbox: true, label: { hy: "Նկարներ", en: "Photos" } },
    rsvp: rsvpBase("live-engagement", { deadline: `2026-11-07T23:59:00${A}`, askSide: true, sides: [{ hy: "Անիի", en: "Ani's" }, { hy: "Արամի", en: "Aram's" }] }),
    ics: true,
    share: true,
    music: { autoplayOnGate: false, showControl: true },
    gate: { enabled: false },
  },
  extras: { saveTheDate: true },
  meta: { sample: true, footerLine: { hy: "Սիրով՝ Անի և Արամ", en: "With love, Ani & Aram" } },
};

// ------------------------------------------------------------ BAPTISM
export const baptism: InvitationData = {
  id: "baptism",
  type: "baptism",
  style: "baptism-kunk",
  identity: {
    hosts: [{ hy: "Մարիամ", en: "Mariam" }],
    kicker: { hy: "Կնունքի հրավեր", en: "A christening" },
    subtitle: { hy: "Մկրտության սուրբ խորհուրդ", en: "The sacrament of baptism" },
    families: { hy: "Հակոբյան ընտանիք", en: "The Hakobyan family" },
    blurb: { hy: "Հրավիրում ենք կիսելու մեր փոքրիկ Մարիամի մկրտության ուրախությունը։", en: "We invite you to share the joy of our little Mariam's baptism." },
    date: `${D}T11:00:00${A}`,
    end: `${D}T17:00:00${A}`,
    city: { hy: "Երևան", en: "Yerevan" },
    monogram: { a: "Մ", b: "" },
  },
  assets: {
    hero: [{ kind: "image", src: jarsAngel, alt: { hy: "Կնունքի սեղան՝ հրեշտակով", en: "A christening table with an angel" } }],
    palette: { bg: "#F4F7FB", ink: "#1E2A3A", soft: "#4F5B6B", accent: "#8FB4D9", accentInk: "#3B6A96", panel: "rgba(255,255,255,0.7)", dark: false },
    font: "serif",
    audio: { src: "/audio/pad-soft.mp3", label: { hy: "Մեղմ բեմ (սինթեզված)", en: "Soft bed (synthesized)" }, synthesized: true },
    gallery: [{ kind: "image", src: churchCross, alt: { hy: "Եկեղեցու խաչ", en: "Church cross" } }, { kind: "image", src: candleCross, alt: { hy: "Մոմ և խաչ", en: "Candle and cross" } }, { kind: "image", src: chapelCliff, alt: { hy: "Մատուռ", en: "Chapel" } }, { kind: "image", src: jarsAngel, alt: { hy: "Սեղան", en: "Table" } }],
    ambient: "clouds",
  },
  schedule: {
    title: { hy: "Օրվա կարգը", en: "The order of the day" },
    connector: "line",
    blocks: [
      { id: "church", icon: "font", time: "11:00", title: { hy: "Մկրտություն", en: "Baptism" }, venue: { hy: "Սուրբ Սարգիս եկեղեցի", en: "Surb Sargis Church" }, address: { hy: "Իսրայելյան 21, Երևան", en: "21 Israyelyan St, Yerevan" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Surb%20Sargis%20Church%20Yerevan" },
      { id: "photo", icon: "photo", time: "12:30", title: { hy: "Նկարահանում", en: "Photographs" }, venue: { hy: "Եկեղեցու բակ", en: "The churchyard" } },
      { id: "lunch", icon: "reception", time: "14:00", title: { hy: "Տոնական ճաշ", en: "Celebration lunch" }, venue: { hy: "«Դոլմամա» ռեստորան", en: "Dolmama restaurant" }, address: { hy: "Պուշկինի 10", en: "10 Pushkin St" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Dolmama%20Yerevan" },
    ],
  },
  features: {
    countdown: { enabled: true, style: "days", label: { hy: "Մնաց", en: "Days left" } },
    calendar: { enabled: false },
    maps: { provider: "google", directions: true },
    gallery: { layout: "grid", lightbox: true, label: { hy: "Նկարներ", en: "Photos" } },
    rsvp: rsvpBase("live-baptism", { deadline: `2026-11-07T23:59:00${A}`, askDiet: true, dietOptions: [{ hy: "Միս", en: "Meat" }, { hy: "Ձուկ", en: "Fish" }, { hy: "Բուսական", en: "Vegetarian" }] }),
    ics: true,
    share: true,
    music: { autoplayOnGate: false, showControl: true },
    gate: { enabled: false },
    epigraph: { text: { hy: "«Թողե՛ք երեխաներին ինձ մոտ գալ»։", en: "“Let the little children come to me.”" }, from: { hy: "Մարկոս 10:14", en: "Mark 10:14" } },
  },
  extras: { godparents: { a: "Արամ Սարգսյան", b: "Անի Հակոբյան", dedication: { hy: "Հավատքի, հոգատարության և ուղեկցության խոստումով։", en: "With a promise of faith, care and companionship." } }, parents: { hy: "Ծնողներ՝ Լիլիթ և Հայկ", en: "Parents — Lilit & Hayk" } },
  meta: { sample: true },
};

// ------------------------------------------------------------ BIRTHDAY
export const birthday: InvitationData = {
  id: "birthday",
  type: "birthday",
  style: "birthday-anniversary",
  identity: {
    hosts: [{ hy: "Անի", en: "Ani" }],
    kicker: { hy: "Ծննդյան հրավեր", en: "A birthday" },
    subtitle: { hy: "Դառնում է 30", en: "Turning 30" },
    blurb: { hy: "Երեսուն մոմ, մեկ երեկո, բոլորդ։ Արի՛ մեզ հետ։", en: "Thirty candles, one night, all of you. Come celebrate." },
    date: `${D}T20:00:00${A}`,
    end: `2026-11-15T02:00:00${A}`,
    city: { hy: "Երևան", en: "Yerevan" },
  },
  assets: {
    hero: [{ kind: "image", src: starsNight, alt: { hy: "Գիշեր, աստղեր", en: "Night, stars" } }],
    palette: { bg: "#0F0D14", ink: "#F6F0FF", soft: "#C4B8D6", accent: "#FF4FA3", accentInk: "#FF7CB9", panel: "rgba(255,255,255,0.08)", dark: true },
    font: "sans",
    audio: { src: "/audio/pad-bright.mp3", label: { hy: "Պայծառ բեմ (սինթեզված)", en: "Bright bed (synthesized)" }, synthesized: true },
    gallery: [{ kind: "image", src: cakeGold, alt: { hy: "Տորթ", en: "Cake" } }, { kind: "image", src: balloonArch, alt: { hy: "Փուչիկների կամար", en: "Balloon arch" } }, { kind: "image", src: balloonsKids, alt: { hy: "Փուչիկներ", en: "Balloons" } }],
    ambient: "neon",
  },
  schedule: {
    title: { hy: "Երեկոն", en: "The night" },
    connector: "line",
    blocks: [
      { id: "doors", icon: "party", time: "20:00", title: { hy: "Դռները բացվում են", en: "Doors" }, venue: { hy: "«Փարք» լաունջ", en: "Park lounge" }, address: { hy: "Թումանյան 5", en: "5 Tumanyan St" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Tumanyan%205%20Yerevan" },
      { id: "cake", icon: "cake", time: "22:00", title: { hy: "Տորթը", en: "The cake" }, venue: { hy: "Բեմ", en: "The stage" } },
      { id: "dance", icon: "music", time: "23:00", title: { hy: "DJ", en: "DJ set" }, venue: { hy: "Պարահրապարակ", en: "The floor" } },
    ],
  },
  features: {
    countdown: { enabled: true, style: "age" },
    calendar: { enabled: false },
    maps: { provider: "google", directions: true },
    dressCode: { swatches: ["#FF4FA3", "#4FD8FF", "#0F0D14"], label: { hy: "Հագուստի կոդ", en: "Dress code" }, note: { hy: "Նեոն և սև", en: "Neon & black" } },
    gallery: { layout: "masonry", lightbox: true, label: { hy: "Նկարներ", en: "Photos" } },
    rsvp: rsvpBase("live-birthday", { deadline: `2026-11-10T23:59:00${A}`, askDiet: false, presentation: "modal" }),
    ics: true,
    share: true,
    music: { autoplayOnGate: false, showControl: true },
    gate: { enabled: false },
  },
  extras: { born: "1996-11-14", messageBoard: true },
  meta: { sample: true },
};

// ------------------------------------------------------------ GALA
export const gala: InvitationData = {
  id: "gala",
  type: "gala",
  style: "gala-corporate",
  identity: {
    hosts: [{ hy: "ArmTech Summit", en: "ArmTech Summit" }],
    kicker: { hy: "Հրավիրում ենք", en: "You are invited" },
    subtitle: { hy: "Տարեկան գալա երեկո 2026", en: "Annual gala evening 2026" },
    blurb: { hy: "Մի երեկո՝ արդյունքների, բանախոսների և ընթրիքի համար։", en: "An evening of results, speakers and dinner." },
    date: `${D}T19:00:00${A}`,
    end: `${D}T23:00:00${A}`,
    city: { hy: "Երևան", en: "Yerevan" },
  },
  assets: {
    hero: [{ kind: "video", src: "/video/ambient-gold.mp4", poster: stageStar, alt: { hy: "Ոսկե լուսային ցիկլ (սինթեզված)", en: "Gold ambient loop (synthesized)" }, synthesized: true }, { kind: "image", src: stageSpeaker, alt: { hy: "Բանախոս", en: "Speaker" } }],
    palette: { bg: "#0E1116", ink: "#EEF1F5", soft: "#B7BFC9", accent: "#D4B478", accentInk: "#E1C88C", panel: "rgba(255,255,255,0.08)", dark: true },
    font: "sans",
    audio: { src: "/audio/pad-low.mp3", label: { hy: "Ցածր բեմ (սինթեզված)", en: "Low bed (synthesized)" }, synthesized: true },
    gallery: [{ kind: "image", src: stageSpeaker, alt: { hy: "Բեմ", en: "Stage" } }, { kind: "image", src: audience, alt: { hy: "Դահլիճ", en: "Audience" } }, { kind: "image", src: stageStar, alt: { hy: "Բեմ", en: "Stage" } }],
    ambient: "grid",
  },
  schedule: {
    title: { hy: "Օրակարգ", en: "Agenda" },
    connector: "none",
    blocks: [
      { id: "reg", icon: "speech", time: "19:00", title: { hy: "Գրանցում և ողջույն", en: "Registration & welcome" }, venue: { hy: "Կարեն Դեմիրճյանի անվ. համալիր", en: "Karen Demirchyan Complex" }, address: { hy: "Ծիծեռնակաբերդի խճ. 1", en: "1 Tsitsernakaberd Hwy" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Karen%20Demirchyan%20Complex" },
      { id: "keynote", icon: "gala", time: "19:30", title: { hy: "Հիմնական ելույթներ", en: "Keynotes" }, venue: { hy: "Մեծ դահլիճ", en: "Main hall" } },
      { id: "dinner", icon: "reception", time: "21:00", title: { hy: "Ընթրիք", en: "Dinner" }, venue: { hy: "Բանկետային սրահ", en: "Banquet hall" } },
    ],
  },
  features: {
    countdown: { enabled: true, style: "dhms", label: { hy: "Մինչև երեկոն", en: "Until the evening" } },
    calendar: { enabled: false },
    maps: { provider: "google", directions: true },
    dressCode: { swatches: ["#0E1116", "#D4B478"], label: { hy: "Հագուստի կոդ", en: "Dress code" }, note: { hy: "Black tie", en: "Black tie" } },
    gallery: { layout: "strip", lightbox: true, label: { hy: "Անցյալ տարի", en: "Last year" } },
    rsvp: rsvpBase("live-gala", { deadline: `2026-11-05T23:59:00${A}`, askGuests: false, askDiet: true, dietOptions: [{ hy: "Միս", en: "Meat" }, { hy: "Ձուկ", en: "Fish" }, { hy: "Բուսական", en: "Vegetarian" }], askMessage: false, presentation: "modal" }),
    ics: true,
    share: true,
    music: { autoplayOnGate: false, showControl: true },
    gate: { enabled: false },
  },
  extras: { agenda: true, speakers: [{ name: "Արա Մանուկյան", role: { hy: "Գլխավոր տնօրեն", en: "CEO" } }, { name: "Լիլիթ Ավագյան", role: { hy: "Արտադրանքի ղեկավար", en: "Head of product" } }] },
  meta: { sample: true },
};

// ------------------------------------------------------------ WEDDING · C
// After AreOne «Wedding Ticket» (a destination to remember): navy ground,
// cream perforated tickets, a boarding-pass table (FLIGHT & DATE · CLASS ·
// DESTINATION · WEDDING LOCATION), a round stamp, «BOARDING FOR LOVE», the
// dashed flight path between sections, a luggage tag, a VENUE ticket with
// HOW TO GET THERE, a dotted timeline, labelled dress-code swatches, the
// WOMEN / MEN outfit plates. Lake Como → Lake Sevan.
export const weddingTicket: InvitationData = {
  id: "wedding-ticket",
  type: "wedding",
  style: "boarding-pass",
  identity: {
    hosts: [{ hy: "Սոֆի", en: "Sofi" }, { hy: "Արեն", en: "Aren" }],
    kicker: { hy: "Հարսանեկան տոմս", en: "Wedding ticket" },
    subtitle: { hy: "Ուղևորություն, որ պետք է հիշել", en: "A destination to remember" },
    families: { hy: "Սիրելի՛ ընկերներ և հարազատներ", en: "Dear friends and family" },
    blurb: {
      hy: "Ուրախ ենք հրավիրել Ձեզ՝ միանալու մեր կյանքի ամենամեծ արկածին։ Ձեր սերն ու աջակցությունը ամեն ինչ են մեզ համար, և անհամբեր սպասում ենք միասին տոնելու մեր սրտին մոտ մի վայրում։",
      en: "We are thrilled to invite you to join us as we embark on the greatest adventure of our lives. Your love and support mean the world to us, and we can't wait to celebrate together in a place close to our hearts.",
    },
    date: `${D}T12:00:00${A}`,
    end: `${D}T23:00:00${A}`,
    city: { hy: "Սևան", en: "Lake Sevan" },
    monogram: { a: "Ս", b: "Ա" },
  },
  assets: {
    hero: [{ kind: "image", src: wingSky, alt: { hy: "Ինքնաթիռի թևը ամպերի վրա", en: "An aeroplane wing over the clouds" } }],
    palette: { bg: "#1E2B45", ink: "#F4EFE6", soft: "#BFC6D2", accent: "#F4EFE6", accentInk: "#F4EFE6", panel: "rgba(244,239,230,0.96)", dark: true },
    font: "serif",
    audio: { src: "/audio/pad-soft.mp3", label: { hy: "Մեղմ բեմ (սինթեզված)", en: "Soft bed (synthesized)" }, synthesized: true },
    gallery: [
      { kind: "image", src: sevanavank, alt: { hy: "Սևանավանք՝ լճի վրա", en: "Sevanavank over the lake" } },
      { kind: "image", src: sevanLake, alt: { hy: "Սևանա լիճ, ձյունոտ լեռներ", en: "Lake Sevan, snowy ridges" } },
      { kind: "image", src: lace, alt: { hy: "Կանայք — երկար զգեստ, մեր գույներով", en: "Women — long dresses in our palette" } },
      { kind: "image", src: suitRose, alt: { hy: "Տղամարդիկ — մուգ կոստյում, առանց սպիտակի", en: "Men — a dark suit, no white" } },
    ],
    ambient: "planes",
  },
  schedule: {
    title: { hy: "Ժամանակացույց", en: "Timeline" },
    connector: "flight",
    blocks: [
      { id: "gather", icon: "toast", time: "12:00", title: { hy: "Հյուրերի հավաք", en: "Guest gathering" }, venue: { hy: "Սևանավանք", en: "Sevanavank" }, address: { hy: "Սևան թերակղզի, Գեղարքունիք", en: "Sevan peninsula, Gegharkunik" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Sevanavank" },
      { id: "church", icon: "church", time: "12:30", title: { hy: "Պսակադրություն", en: "Wedding ceremony" }, venue: { hy: "Սուրբ Առաքելոց եկեղեցի", en: "Surb Arakelots church" }, address: { hy: "Սևանավանք", en: "Sevanavank" } },
      { id: "reception", icon: "reception", time: "13:30", title: { hy: "Հանդիսություն", en: "Reception" }, venue: { hy: "«Ծովինար» լճափնյա սրահ", en: "Tsovinar lakeside hall" }, address: { hy: "Սևան, ափամերձ ճանապարհ", en: "Sevan, the shore road" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Sevan%20lake%20Armenia" },
      { id: "end", icon: "dance", time: "23:00", title: { hy: "Երեկոյի ավարտ", en: "End of evening" }, venue: { hy: "Նույն սրահում", en: "Same hall" } },
    ],
  },
  features: {
    countdown: { enabled: true, style: "days", label: { hy: "Մինչև նստեցումը", en: "Until boarding" } },
    calendar: { enabled: true, mode: "month" },
    maps: { provider: "google", directions: true },
    dressCode: {
      swatches: ["#F4EFE6", "#E5D9C4", "#9C8E7E", "#1E2B45", "#14120F"],
      labels: [{ hy: "Փղոսկր", en: "Ivory" }, { hy: "Կրեմ", en: "Cream" }, { hy: "Թաուպ", en: "Taupe" }, { hy: "Թագույն", en: "Navy" }, { hy: "Սև", en: "Black" }],
      shape: "circle",
      label: { hy: "Հագուստի կոդ", en: "Dress code" },
      note: { hy: "Կուրախանանք տեսնել մեր ընտանիքին ու ընկերներին նրբագեղ, ժամանակից դուրս հագուստով։ Օրվա մեր գունապնակը՝", en: "We would love to see our family and friends in elegant and timeless attire. Our colour palette for the day:" },
      link: { hy: "Օրինակներ", en: "See examples" },
    },
    gallery: { layout: "pair", lightbox: true, label: { hy: "Կանայք · Տղամարդիկ", en: "Women · Men" } },
    rsvp: rsvpBase("live-wedding-ticket", { deadline: `2026-10-20T23:59:00${A}`, askSide: false, askDiet: true, dietOptions: [{ hy: "Միս", en: "Meat" }, { hy: "Ձուկ", en: "Fish" }, { hy: "Բուսական", en: "Vegetarian" }] }),
    ics: true,
    share: true,
    music: { autoplayOnGate: true, showControl: true },
    gate: { enabled: true, variant: "ticket", label: { hy: "Հարսանեկան տոմս", en: "Wedding ticket" }, button: { hy: "Նստեցում", en: "Board now" } },
    details: [{ hy: "Հավաքեք ճամպրուկները և միացեք մեզ մի շաբաթավերջ, որ լի կլինի սիրով, ծիծաղով և անմոռանալի հիշողություններով։", en: "Pack your bags and join us for a weekend filled with love, laughter and unforgettable memories." }],
  },
  extras: { destination: { label: { hy: "Ուղղություն", en: "Destination" }, place: { hy: "Սևանավանք", en: "Sevanavank" }, region: { hy: "Սևանա լիճ, Հայաստան", en: "Lake Sevan, Armenia" } } },
  meta: { sample: true, footerLine: { hy: "Նստեցում՝ հանուն սիրո", en: "Boarding for love" } },
};

// ------------------------------------------------------------ WEDDING · D
// After AreOne «Pearls»: ivory paper with pearl strings, the names stacked
// huge in a geometric sans, a script sub-line, a B&W photo; «Dear friends!»
// as a note card on an envelope; the three-day strip; VENUE on a tray
// (ceremony + banquet, «View on map»); PROGRAM of the day along a pearl
// string on a taupe band; fabric dress-code circles; «Our channel»; «Wishes».
export const weddingPearls: InvitationData = {
  id: "wedding-pearls",
  type: "wedding",
  style: "pearl-editorial",
  identity: {
    hosts: [{ hy: "Լիլիթ", en: "Lilit" }, { hy: "Տիգրան", en: "Tigran" }],
    kicker: { hy: "Մեր հարսանիքի օրը", en: "Our wedding day!" },
    subtitle: { hy: "Սիրելի՛ ընկերներ, դուք հրավիրված եք", en: "Dear friends! You're invited" },
    families: { hy: "Ընտանիքների հետ միասին", en: "Together with their families" },
    blurb: {
      hy: "Այնքան ուրախ ենք հրավիրել Ձեզ՝ տոնելու մեր նոր կյանքի սկիզբը միասին։ Ձեր ներկայությունը մեր օրը կդարձնի ավելի առանձնահատուկ ու անմոռանալի։",
      en: "We are so happy to invite you to celebrate the beginning of our new life together. Your presence will make our day even more special and unforgettable.",
    },
    date: `${D}T15:00:00${A}`,
    end: `2026-11-15T00:00:00${A}`,
    city: { hy: "Երևան", en: "Yerevan" },
    monogram: { a: "Լ", b: "Տ" },
  },
  assets: {
    hero: [{ kind: "image", src: coupleHill, alt: { hy: "Զույգը լեռնալանջին", en: "The couple on the ridge" } }],
    palette: { bg: "#F4F0E8", ink: "#1C1A17", soft: "#6B645B", accent: "#8E8170", accentInk: "#6B5F4F", panel: "rgba(255,255,255,0.8)", dark: false },
    font: "sans",
    audio: { src: "/audio/pad-bright.mp3", label: { hy: "Պայծառ բեմ (սինթեզված)", en: "Bright bed (synthesized)" }, synthesized: true },
    gallery: [
      { kind: "image", src: pearlsPaper, alt: { hy: "Մարգարիտներ թղթի վրա", en: "Pearls on paper" } },
      { kind: "image", src: pearlsGrey, alt: { hy: "Մարգարիտների շարան", en: "A strand of pearls" } },
      { kind: "image", src: lace, alt: { hy: "Ժանյակ", en: "Lace" } },
      { kind: "image", src: rings, alt: { hy: "Մատանիներ", en: "Rings" } },
    ],
    ambient: "pearls",
  },
  schedule: {
    title: { hy: "Օրվա ծրագիրը", en: "Program" },
    subtitle: { hy: "ժամ առ ժամ", en: "of the day" },
    connector: "pearls",
    blocks: [
      { id: "church", icon: "church", time: "15:00", title: { hy: "Պսակադրություն", en: "Wedding ceremony" }, venue: { hy: "Սուրբ Հովհաննես եկեղեցի", en: "Surb Hovhannes church" }, address: { hy: "Կոնդ, Երևան", en: "Kond, Yerevan" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Surb%20Hovhannes%20Kond%20Yerevan" },
      { id: "buffet", icon: "toast", time: "16:00", title: { hy: "Ողջույնի ֆուրշետ", en: "Welcome buffet" }, venue: { hy: "«Թուֆենկյան» այգի", en: "Tufenkian garden" }, address: { hy: "Երևան", en: "Yerevan" } },
      { id: "banquet", icon: "reception", time: "17:00", title: { hy: "Խնջույքի սկիզբ", en: "Banquet begins" }, venue: { hy: "«Արարատ» սրահ", en: "Ararat hall" }, address: { hy: "Երևան, Արշակունյաց 2", en: "2 Arshakunyats Ave, Yerevan" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Arshakunyats%202%20Yerevan" },
      { id: "end", icon: "dance", time: "00:00", title: { hy: "Տոնակատարության ավարտ", en: "Celebration ends" }, venue: { hy: "Նույն սրահում", en: "Same hall" } },
    ],
  },
  features: {
    countdown: { enabled: false, style: "days" },
    calendar: { enabled: true, mode: "strip" },
    maps: { provider: "google", directions: false },
    dressCode: {
      swatches: ["#2B2A2C", "#2F4A3A", "#5B5A43", "#1F4A57", "#4A3527", "#9C8C7A", "#C9C2B8"],
      shape: "fabric",
      label: { hy: "Հագուստի կոդ", en: "Dress code" },
      note: { hy: "Սիրով խնդրում ենք ընտրել Ձեր հանդերձանքը մեր հարսանեկան գունապնակից։", en: "We kindly invite you to choose your outfit from our wedding palette." },
      link: { hy: "Դիտել օրինակները", en: "View examples" },
    },
    gallery: { layout: "pair", lightbox: true, label: { hy: "Օրինակներ", en: "Examples" } },
    rsvp: rsvpBase("live-wedding-pearls", { deadline: `2026-10-30T23:59:00${A}`, askSide: true, sides: [{ hy: "Լիլիթի", en: "Lilit's" }, { hy: "Տիգրանի", en: "Tigran's" }], askDiet: false }),
    ics: true,
    share: true,
    music: { autoplayOnGate: false, showControl: true },
    gate: { enabled: false },
  },
  extras: {
    channel: { label: { hy: "Մեր ալիքը", en: "Our channel" }, note: { hy: "Միացեք մեր հարսանեկան Telegram ալիքին՝ վերջին նորությունների, ծրագրի փոփոխությունների և օգտակար տեղեկությունների համար։", en: "Join our wedding Telegram channel for all the latest updates, schedule changes and helpful information." } },
    wishes: { title: { hy: "Ցանկություններ", en: "Wishes" }, text: { hy: "Մեզ համար ամենամեծ նվերը Ձեր ներկայությունն է։ Եթե ցանկանում եք նվեր մատուցել, շնորհակալ կլինենք մեր միասին ապագային ներդրման համար։", en: "The greatest gift for us is your presence. If you wish to give a gift, we would be grateful for a contribution to our future together." } },
  },
  meta: { sample: true, footerLine: { hy: "Սիրով՝ Լիլիթ և Տիգրան", en: "With love, Lilit & Tigran" } },
};

// ------------------------------------------------------------ WEDDING · E
// After the Ewedlab «Dusty Blue» animated envelope reveal (the Etsy video
// that circulates on Pinterest): an embossed dusty-blue gatefold envelope
// opens → butterfly card (WE'RE GETTING MARRIED · script names) → arched
// photo with the date block and «reception to follow» → script «timeline»
// list → THE details (QR · dress code hearts · recommended hotel) → «please
// RSVP by…» → a navy end card with an ornate oval frame around the names.
export const weddingDusty: InvitationData = {
  id: "wedding-dusty",
  type: "wedding",
  style: "dusty-blue",
  identity: {
    hosts: [{ hy: "Անահիտ", en: "Anahit" }, { hy: "Վահե", en: "Vahe" }],
    kicker: { hy: "Մենք ամուսնանում ենք", en: "We're getting married" },
    subtitle: { hy: "Հանդիսությունը՝ արարողությունից հետո", en: "Reception to follow" },
    families: { hy: "Իրենց սիրո տոնակատարությանը", en: "In the celebration of their love" },
    blurb: { hy: "Սիրով հրավիրում ենք Ձեզ՝ լինելու մեզ հետ այն օրը, երբ մեր երկու ճանապարհները մեկը կդառնան։", en: "With love, we invite you to be with us on the day our two roads become one." },
    date: `${D}T14:00:00${A}`,
    end: `${D}T23:30:00${A}`,
    city: { hy: "Երևան", en: "Yerevan" },
    monogram: { a: "Ա", b: "Վ" },
  },
  assets: {
    hero: [{ kind: "image", src: coupleHill, alt: { hy: "Զույգը լեռնալանջին", en: "The couple on the ridge" } }],
    palette: { bg: "#B9B3A6", ink: "#2B3A52", soft: "#4F5870", accent: "#7F8FA6", accentInk: "#3E4C66", panel: "rgba(255,255,255,0.55)", dark: false },
    font: "serif",
    audio: { src: "/audio/pad-soft.mp3", label: { hy: "Մեղմ բեմ (սինթեզված)", en: "Soft bed (synthesized)" }, synthesized: true },
    gallery: [
      { kind: "image", src: lace, alt: { hy: "Ժանյակ", en: "Lace" } },
      { kind: "image", src: rings, alt: { hy: "Մատանիներ", en: "Rings" } },
    ],
    ambient: "butterflies",
  },
  schedule: {
    title: { hy: "Ժամանակացույց", en: "timeline" },
    connector: "line",
    blocks: [
      { id: "seating", icon: "home", time: "13:00", title: { hy: "Հյուրերի տեղավորում", en: "Seating begins" }, venue: { hy: "Սուրբ Սարգիս եկեղեցի", en: "Surb Sargis church" }, address: { hy: "Երևան", en: "Yerevan" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Surb%20Sargis%20church%20Yerevan" },
      { id: "church", icon: "church", time: "14:00", title: { hy: "Պսակադրություն", en: "Ceremony" }, venue: { hy: "Սուրբ Սարգիս եկեղեցի", en: "Surb Sargis church" } },
      { id: "reception", icon: "reception", time: "15:00", title: { hy: "Հանդիսություն", en: "Reception" }, venue: { hy: "«Լուսամուտ» սրահ", en: "Lusamut hall" }, address: { hy: "Երևան", en: "Yerevan" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Yerevan%20event%20hall" },
      { id: "party", icon: "dance", time: "16:30", title: { hy: "Պար և երաժշտություն", en: "Party time" }, venue: { hy: "Նույն սրահում", en: "Same hall" } },
      { id: "fire", icon: "candle", time: "19:30", title: { hy: "Հրավառություն", en: "Fireworks" }, venue: { hy: "Սրահի այգում", en: "The hall's garden" } },
    ],
  },
  features: {
    countdown: { enabled: true, style: "days", label: { hy: "Մնաց", en: "Days left" } },
    calendar: { enabled: false },
    maps: { provider: "google", directions: false },
    dressCode: { swatches: ["#2B3A52", "#7F8FA6", "#C9D1DC"], shape: "heart", label: { hy: "Հագուստի կոդ", en: "Dress code" }, note: { hy: "Պաշտոնական հագուստ", en: "Formal attire" } },
    gallery: { layout: "pair", lightbox: true },
    rsvp: rsvpBase("live-wedding-dusty", { deadline: `2026-10-16T23:59:00${A}`, askSide: false, askDiet: false, askMessage: true }),
    ics: true,
    share: true,
    music: { autoplayOnGate: true, showControl: true },
    gate: { enabled: true, variant: "gatefold", label: { hy: "Հրավեր", en: "Invitation" }, button: { hy: "Բացել ծրարը", en: "Open the envelope" } },
    qr: true,
    details: [{ hy: "Խնդրում ենք պատասխանում նշել բոլոր ներկա գտնվող հյուրերի անունները։", en: "Please include the names of all guests attending in your RSVP." }],
  },
  extras: {
    hotel: { name: { hy: "Հյուրանոց «Անի Պլազա»", en: "Ani Plaza hotel" }, address: { hy: "Սայաթ-Նովա 19, Երևան", en: "19 Sayat-Nova Ave, Yerevan" }, mapUrl: "https://www.google.com/maps/search/?api=1&query=Ani%20Plaza%20Hotel%20Yerevan" },
  },
  meta: { sample: true, footerLine: { hy: "Սիրով՝ Անահիտ և Վահե", en: "With love, Anahit & Vahe" } },
};

export const mockInvitations: InvitationData[] = [weddingClassic, weddingCinematic, weddingTicket, weddingPearls, weddingDusty, engagement, baptism, birthday, gala];

/** the sample object for a style */
export function mockForStyle(style: TemplateStyle): InvitationData {
  return mockInvitations.find((m) => m.style === style) ?? weddingClassic;
}

/** a mock's landscape plates, for the showcase and the wizard chips */
export const styleCovers = { "classic-floral": handsBouquet, "modern-cinematic": coupleHill, "boarding-pass": sevanavank, "pearl-editorial": pearlsPaper, "dusty-blue": lace, "engagement-save-the-date": ringbox, "baptism-kunk": jarsAngel, "birthday-anniversary": cakeGold, "gala-corporate": stageSpeaker, ararat: araratDawn, noravank } as const;
