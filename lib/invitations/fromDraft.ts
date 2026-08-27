import type { Draft } from "@/lib/draft";
import type { InvitationData, ScheduleBlock, ScheduleIcon, TemplateStyle } from "@/types/invitation";
import { mockForStyle } from "./mock";

// ============================================================================
// DRAFT → INVITATION — the real-time binding. The wizard's state is a
// lib/draft.ts Draft; every engine style renders an InvitationData. This lays
// a Draft over a style's sample object: names, date, city, venue, address,
// map pin, the programme (each stop becomes a schedule block with a guessed
// icon), dress palette, music, video, godparents, birth year, RSVP deadline,
// the families/host line and the note — and leaves everything the couple did
// not fill exactly as the sample shows it, so the very first keystroke has
// something to replace and nothing ever goes blank.
// ============================================================================

const same = (x: string) => ({ hy: x, en: x });

const ownAlt = { hy: "Ձեր լուսանկարը", en: "Your photograph", ru: "Ваша фотография" };

/** the hero, once the couple has uploaded photographs of their own.
 *  A style whose hero is an ambient FILM keeps the film and takes their first
 *  picture as its poster; every other style shows the picture itself. */
function heroFor(hero: InvitationData["assets"]["hero"], own: string[], draft: Draft): InvitationData["assets"]["hero"] {
  const base: InvitationData["assets"]["hero"] = own.length
    ? hero.map((h) => (h.kind === "video" ? { ...h, poster: own[0] } : { kind: "image" as const, src: own[0], alt: ownAlt }))
    : hero;
  if (draft.video !== true || base.some((h) => h.kind === "video")) return base;
  const poster = base[0].kind === "image" ? base[0].src : base[0].poster;
  const src = draft.occasion === "baptism" ? "/video/ambient-sky.mp4" : draft.occasion === "birthday" || draft.occasion === "corporate" ? "/video/ambient-gold.mp4" : "/video/ambient-rose.mp4";
  return [{ kind: "video", src, poster, alt: same("ambient"), synthesized: true }, ...base];
}

/** a stop's icon from its name — the same words the references use */
export function guessIcon(name: string, occasion: Draft["occasion"], i: number): ScheduleIcon {
  const n = name.toLowerCase();
  if (/փեսա|groom/.test(n)) return "groom";
  if (/հարս|bride/.test(n)) return "bride";
  if (/պսակ|եկեղեց|church|ceremony|մկրտ|baptism|կնունք/.test(n)) return occasion === "baptism" ? "font" : "church";
  if (/ֆոտո|նկար|photo/.test(n)) return "photo";
  if (/ԶԱԳՍ|զագս|ՔԿԱԳ|քկագ|registry|civil/.test(n)) return "rings";
  // the PLACE first, where the couple named one — a restaurant, a hall, a
  // garden, a hotel reads as itself before it reads as «reception»
  if (/ռեստորան|restaurant|պանդոկ|tavern|կաֆե|cafe/.test(n)) return "restaurant";
  if (/դահլիճ|hall|համալիր|complex|banquet hall/.test(n)) return "hall";
  if (/այգ|garden|բակ|courtyard|outdoor|բնություն/.test(n)) return "garden";
  if (/հյուրանոց|hotel|resort|առանձնատ|villa|estate|усадьба/.test(n)) return "hotel";
  if (/կոկտեյլ|cocktail|ապերիտիվ|aperitif/.test(n)) return "cocktail";
  if (/երդում|vow|ուխտ/.test(n)) return "vows";
  if (/հրավառ|firework|շոու|show/.test(n)) return "fireworks";
  if (/ճանապարհ|հրաժեշտ|farewell|ավարտ|end of|closing/.test(n)) return "farewell";
  if (/խնջույք|հանդիս|ընթրիք|reception|banquet|dinner|ճաշ|lunch/.test(n)) return "reception";
  if (/տորթ|cake/.test(n)) return "cake";
  if (/պար|dance|dj/.test(n)) return "dance";
  if (/կենաց|toast|ընդունել|welcome|drinks/.test(n)) return "toast";
  if (/ելույթ|keynote|speech|գրանց|registration/.test(n)) return "speech";
  if (/երաժշտ|music|համերգ/.test(n)) return "music";
  if (/նվեր|gift/.test(n)) return "gift";
  if (occasion === "birthday") return i === 0 ? "party" : "music";
  if (occasion === "corporate") return i === 0 ? "speech" : "gala";
  return i === 0 ? "home" : i === 1 ? "church" : "reception";
}

export function draftToInvitation(draft: Draft | undefined | null, style: TemplateStyle, base?: InvitationData, eventId?: string): InvitationData {
  const m = base ?? mockForStyle(style);
  if (!draft) return { ...m, style };
  const first = draft.stops[0]?.time || draft.time || "12:00";
  const day = draft.date || "2026-11-14"; // the samples' Saturday stands in for a dateless preview
  const date = `${day}T${first}:00+04:00`;
  const end = `${day}T23:59:00+04:00`;
  const single = draft.occasion === "birthday" || draft.occasion === "corporate";
  const hosts: InvitationData["identity"]["hosts"] = single || !draft.b ? [same(draft.a)] : [same(draft.a), same(draft.b)];
  const blocks: ScheduleBlock[] = draft.stops.length
    ? draft.stops.map((s, i) => ({
        id: `s${i}`,
        icon: guessIcon(s.name, draft.occasion, i),
        time: s.time,
        title: same(s.name),
        venue: same(s.place || draft.venue || draft.city || "—"),
        address: s.address ? same(s.address) : undefined,
        mapUrl: i === 0 && draft.map ? draft.map : undefined,
      }))
    : m.schedule.blocks.map((b, i) => (i === 0 ? { ...b, time: first, venue: draft.venue ? same(draft.venue) : b.venue, address: draft.address ? same(draft.address) : b.address, mapUrl: draft.map ?? b.mapUrl } : b));
  // one pin for the whole day when the couple gave one and no stop carries it
  if (draft.map && !blocks.some((b) => b.mapUrl)) blocks[0] = { ...blocks[0], mapUrl: draft.map };

  const kicker = m.identity.kicker;
  const own = draft.photos ?? [];
  return {
    ...m,
    style,
    identity: {
      ...m.identity,
      hosts,
      kicker,
      // the couple's typed families line wins; else the four parents compose
      // one («father, mother · father, mother»); else the sample's stays
      families: draft.host
        ? same(draft.host)
        : draft.parents
          ? same([[draft.parents.gf, draft.parents.gm].filter(Boolean).join(", "), [draft.parents.bf, draft.parents.bm].filter(Boolean).join(", ")].filter(Boolean).join(" · "))
          : m.identity.families,
      blurb: draft.note ? same(draft.note) : m.identity.blurb,
      date,
      end,
      city: draft.city ? same(draft.city) : m.identity.city,
      monogram: { a: [...draft.a][0] ?? "", b: draft.b ? ([...draft.b][0] ?? "") : "" },
      subtitle: draft.occasion === "birthday" && draft.age ? { hy: `Դառնում է ${draft.age}`, en: `Turning ${draft.age}` } : m.identity.subtitle,
    },
    assets: {
      ...m.assets,
      // an uploaded /api/audio path would label the dock with its id — name it
      audio: draft.music
        ? { src: draft.music, label: draft.music.startsWith("/api/audio/") ? { hy: "Ձեր երգը", en: "Your track" } : same(draft.music.split("/").pop() ?? "track"), synthesized: false }
        : m.assets.audio,
      // THE COUPLE'S OWN PHOTOGRAPHS, when they uploaded any: the first is the
      // hero (behind an ambient film, if they asked for one — a video hero
      // keeps its place and takes their picture as its poster), and all of
      // them become the gallery. Same slots the style already animates, so
      // every effect applies to these exactly as to the samples.
      hero: heroFor(m.assets.hero, own, draft),
      gallery: own.length ? own.map((src) => ({ kind: "image" as const, src, alt: ownAlt })) : m.assets.gallery,
    },
    schedule: { ...m.schedule, blocks },
    features: {
      ...m.features,
      // the couple's own palette drops the sample's swatch NAMES (they named the sample's colours, not theirs)
      dressCode: draft.dress && draft.dress.length ? { ...(m.features.dressCode ?? { label: { hy: "Հագուստի գույներ", en: "Dress code" } }), swatches: draft.dress, labels: undefined } : m.features.dressCode,
      rsvp: { ...m.features.rsvp, deadline: draft.rsvpBy ? `${draft.rsvpBy}T23:59:00+04:00` : m.features.rsvp.deadline, event: eventId ?? `live-${style}` },
      maps: { provider: draft.map && /yandex/.test(draft.map) ? "yandex" : "google", directions: true },
    },
    extras: {
      ...m.extras,
      godparents: draft.godA || draft.godB ? { a: draft.godA ?? "—", b: draft.godB ?? "—", dedication: m.extras?.godparents?.dedication } : m.extras?.godparents,
      born: draft.born ? `${draft.born}-01-01` : m.extras?.born,
      // the luggage tag follows the couple's venue and city
      destination: m.extras?.destination ? { ...m.extras.destination, place: draft.venue ? same(draft.venue) : blocks[0]?.venue ?? m.extras.destination.place, region: draft.city ? same(draft.city) : m.extras.destination.region } : undefined,
      // the sample's hotel and channel are the sample's — a real draft carries neither (the wizard has no field for them yet)
      hotel: undefined,
      channel: undefined,
    },
    meta: { ...m.meta, sample: false },
  };
}
