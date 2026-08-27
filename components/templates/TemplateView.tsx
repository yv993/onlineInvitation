import Link from "next/link";
import Plate from "@/components/Plate";
import Motion from "@/components/Motion";
import Particles from "@/components/ui/3d/Particles";
import Envelope3D from "@/components/ui/3d/Envelope3D";
import { Beam, Corners, Grain } from "@/components/ui/Fx";
import FoldCard from "@/components/ui/3d/FoldCard";
import VideoBg from "@/components/ui/VideoBg";
import MusicDock from "@/components/ui/MusicDock";
import Icon from "@/components/Icon";
import DayRoute from "@/components/invitations/DayRoute";
import { MiniCalendar, ParentsAnnounce } from "./blocks/Family";
import GiftBox from "./blocks/GiftBox";
import WishesWall from "./blocks/WishesWall";
import SealBanner, { Sprig } from "@/components/templates/SealBanner";
import SceneHero from "@/components/templates/SceneHero";
import CastleScene from "@/components/templates/CastleScene";
import { BloomHero, RoseHero, SprigHero, TornHero } from "@/components/templates/BloomHeroes";
import { BouquetBottle, Hydrangea, RoseBloom } from "@/components/templates/FloralArt";
import { AdultsNote, DetailsBand, DressArt, DressCodeRich, Entourage, GiftNote, Greeting, GuestChat, LoveStory, PlanPlace, QuoteBand, SeatNote, VenueCards } from "./blocks/Blocks2";
import { guessIcon } from "@/lib/invitations/fromDraft";
import { GUEST_LANGS, langPrefix, t } from "@/lib/i18n";
import { site } from "@/lib/content";
import type { Lang, T } from "@/lib/content";

/** how each guest language names itself on the toggle */
const LANG_LABEL: Record<Lang, string> = { hy: "ՀԱՅ", en: "EN", ru: "РУС" };
import { stampFromIso, weekdayFromIso } from "@/lib/draft";
import type { TemplateSpec } from "@/lib/templates";
import type { Draft } from "@/lib/draft";
import type { StaticImageData } from "next/image";
import ambientRose from "@/assets/photos/couple-hill.webp";
import ambientGold from "@/assets/photos/cake-gold.webp";
import ambientSky from "@/assets/photos/jars-angel.webp";
import estatePhoto from "@/assets/photos/noravank.webp";
import velvetTable from "@/assets/photos/candlestick.webp";
import chapelPhoto from "@/assets/photos/chapel-cliff.webp";
import {
  Countdown, DressCode, Gallery, Godparents, IcsButton, MapCard, ParentsNote, PinDrop,
  ProductTilt, QrCheckin, ReelNote, Registry, Speakers, TemplateRsvp, Timeline, ToastBoard,
} from "./blocks/Blocks";

/** The wizard's draft, laid over a template's sample event. Names, date,
 *  city, venue, address, stops, and the extras (dress palette, video toggle,
 *  music URL, godparents, birth year) replace the sample; everything the
 *  couple did not fill stays as the template shows it. */
function applyDraft(s: TemplateSpec, d: Draft | undefined) {
  if (!d) return { ev: s.event, blocks: s.blocks, video: s.video, audio: s.audio, god: undefined as { a: string; b: string } | undefined, cover: s.cover as TemplateSpec["cover"] | string, gallery: s.gallery as Array<{ img: TemplateSpec["gallery"][number]["img"] | string; alt: typeof s.coverAlt }> };
  const same = (x: string) => ({ hy: x, en: x });
  const first = d.stops[0]?.time ?? d.time;
  // NOTHING EVER GOES BLANK: a field the couple has not typed yet keeps the
  // template's own sample, so the very first keystroke has something to
  // replace and a half-filled form still renders a whole invitation.
  const ta = d.a.trim();
  const tb = d.b.trim();
  const ev: TemplateSpec["event"] = {
    ...s.event,
    // the editor's own wording for the hero, when the couple wrote one
    kicker: d.heading ? same(d.heading) : s.event.kicker,
    a: ta ? same(ta) : s.event.a,
    b: tb ? same(tb) : ta ? undefined : s.event.b,
    date: d.date ? `${d.date}T${first}:00+04:00` : s.event.date,
    end: d.date ? `${d.date}T23:59:00+04:00` : s.event.end,
    city: d.city ? same(d.city) : s.event.city,
    venue: d.venue ? same(d.venue) : s.event.venue,
    address: d.address ? same(d.address) : s.event.address,
    stops: d.stops.length ? d.stops.map((x) => ({ time: x.time, name: same(x.name), place: same(x.place || x.address) })) : s.event.stops,
  };
  const sw = d.show ?? {};
  const blocks: TemplateSpec["blocks"] = {
    ...s.blocks,
    dressCode: sw.dress === false ? undefined : d.dress && d.dress.length ? d.dress : s.blocks.dressCode,
    ageCountdown: d.born ? { born: `${d.born}-01-01` } : s.blocks.ageCountdown,
    map: sw.map === false ? false : s.blocks.map || Boolean(d.map || d.venue),
    // the editor's SECTION SWITCHES: false hides what the template would show
    gallery: sw.gallery === false ? undefined : s.blocks.gallery,
    countdown: sw.countdown === false ? false : s.blocks.countdown,
    timeline: sw.schedule === false ? undefined : s.blocks.timeline,
    rsvp: sw.rsvp === false ? undefined : d.rsvpKind ?? s.blocks.rsvp,
    envelope: sw.envelope === false ? false : s.blocks.envelope,
  };
  const loops: Record<string, { src: string; poster: StaticImageData }> = {
    wedding: { src: "/video/ambient-rose.mp4", poster: ambientRose },
    engagement: { src: "/video/ambient-rose.mp4", poster: ambientRose },
    birthday: { src: "/video/ambient-gold.mp4", poster: ambientGold },
    corporate: { src: "/video/ambient-gold.mp4", poster: ambientGold },
    christening: { src: "/video/ambient-sky.mp4", poster: ambientSky },
  };
  const video = d.video === true ? (s.video ?? { ...loops[s.category], synthesized: true }) : d.video === undefined ? s.video : undefined;
  // an uploaded track's path would label the dock with its six-letter id —
  // say what it is instead; a pasted URL keeps its own file name
  const audio = d.show?.music === false
    ? undefined
    : d.music
      ? { src: d.music, label: d.music.startsWith("/api/audio/") ? ({ hy: "Ձեր երգը", en: "Your track" } as T) : same(d.music.split("/").pop() ?? "track"), synthesized: false }
      : s.audio;
  const god = d.godA || d.godB ? { a: d.godA ?? "—", b: d.godB ?? "—" } : undefined;

  // THE COUPLE'S OWN PHOTOGRAPHS. When they uploaded any, the template's stock
  // plates step aside: the first becomes the cover, all of them become the
  // gallery. Nothing else changes — they land in the very slots the template
  // already animates, so the curtain reveal, the Ken Burns drift, the hover
  // tilt and the lightbox apply to them exactly as they did to the samples.
  const own = d.photos ?? [];
  const alt: typeof s.coverAlt = { hy: "Ձեր լուսանկարը", en: "Your photograph", ru: "Ваша фотография" };
  const cover: TemplateSpec["cover"] | string = own[0] ?? s.cover;
  const gallery: Array<{ img: TemplateSpec["gallery"][number]["img"] | string; alt: typeof s.coverAlt }> =
    own.length ? own.map((src) => ({ img: src, alt })) : s.gallery;

  return { ev, blocks, video, audio, god, cover, gallery };
}

// ============================================================================
// TEMPLATE VIEW — a live invitation composed from one registry entry.
//
// The theme is written to CSS custom properties on the root, so every block
// wears the template's palette without knowing which template it is in; the
// ambient layer (video and/or particles) sits fixed behind; the music dock
// floats bottom-right when the spec has audio; each block appears where its
// flag is set. Fifteen entries, one renderer — a sixteenth is data.
// ============================================================================

export default function TemplateView({
  lang,
  s,
  base,
  draft,
  mapUrl,
  eventId,
  embed = false,
}: {
  lang: Lang;
  s: TemplateSpec;
  base: string;
  /** a couple's own details from the wizard, laid over the sample */
  draft?: Draft;
  /** their pasted maps URL, when valid */
  mapUrl?: string;
  /** the MINTED LINK's id (2026-08-25): RSVPs tag with THIS when set, so two
   *  couples on the same template never share one answer bucket */
  eventId?: string;
  /** EMBED — every section, live, inside a host's own scroll frame (the
   *  wizard's preview rows). No Motion (Lenis would seize the host's scroll),
   *  no viewport-fixed ambient (it would paint over the wizard), no chrome, no
   *  music dock — and the parked states pinned visible in CSS, exactly the
   *  contract the engine's `embed` render already follows. Rendered INLINE
   *  rather than framed, so every keystroke lands without a page reload. */
  embed?: boolean;
}) {
  const th = s.theme;
  const applied = applyDraft(s, draft);
  const ev = applied.ev;
  const B = applied.blocks;
  const video = applied.video;
  const cover = applied.cover;
  const gallery = applied.gallery;
  const coverAlt = typeof cover === "string" ? { hy: "Ձեր լուսանկարը", en: "Your photograph", ru: "Ваша фотография" } : s.coverAlt;
  const audio = applied.audio;
  const names = ev.b ? `${t(lang, ev.a)} · ${t(lang, ev.b)}` : t(lang, ev.a);
  // the FOOTER prefers the couple's short names when they set any
  const footNames = draft?.shortA
    ? draft.shortB
      ? `${draft.shortA} · ${draft.shortB}`
      : draft.shortA
    : names;
  // the clock face the editor chose: 18:00 → 6:00 PM when ampm
  const clock = (hhmm: string) => {
    if (!draft?.ampm || !/^\d{2}:\d{2}$/.test(hhmm)) return hhmm;
    const h = Number(hhmm.slice(0, 2));
    return `${((h + 11) % 12) + 1}:${hhmm.slice(3)} ${h < 12 ? "AM" : "PM"}`;
  };
  const style = {
    "--tp-bg": th.bg, "--tp-fg": th.fg, "--tp-soft": th.fgSoft, "--tp-acc": th.accent, "--tp-acc-ink": th.accentInk, "--tp-panel": th.panel,
  } as React.CSSProperties;

  // AN EMBED IS A GUEST, NOT A PAGE: a live preview inside another document
  // must not plant its own <h1> — the landing was carrying twenty-eight of
  // them, one per inline example. The class carries all the styling, so the
  // tag can step down to a div with nothing changing visually.
  const H = embed ? ("div" as const) : ("h1" as const);
  const hero = (
    <div className="kn-tp__heroIn">
      <p className="kn-tp__kick" data-rise data-track>{t(lang, ev.kicker)}</p>
      <H className={`kn-tp__names${th.foil ? " kn-foil" : ""}${th.neon ? " kn-neon" : ""}`} data-rise>
        {/* a numeric second line — an age, a jubilee — counts up instead of
            splitting into letters */}
        {ev.b ? (<><span data-letters>{t(lang, ev.a)}</span><i>·</i>{/^\d{1,4}$/.test(t(lang, ev.b)) ? <span data-count>{t(lang, ev.b)}</span> : <span data-letters>{t(lang, ev.b)}</span>}</>) : <span data-letters>{t(lang, ev.a)}</span>}
      </H>
      <p className="kn-tp__date" data-rise>{stampFromIso(ev.date)}</p>
      <p className="kn-tp__meta" data-rise>{t(lang, weekdayFromIso(ev.date))} · {t(lang, ev.city)}</p>
    </div>
  );

  return (
    <div className={`kn-tp kn-tp--${s.category} kn-tp--face-${th.face}${th.dark ? " kn-tp--dark" : ""}${B.watercolorFrame ? " kn-tp--wc" : ""}${embed ? " kn-tp--embed" : ""}`} data-tpl={s.id} style={style}>
      {!embed && <Motion />}

      {/* the 3D envelope: it opens INTO the page, which is already rendered
          behind it — an embed and a no-JS visitor never meet it at all */}
      {!embed && B.envelope && (
        <Envelope3D
          lang={lang}
          names={names}
          greet={draft?.greet}
          date={stampFromIso(ev.date)}
          monogram={t(lang, ev.a).slice(0, 1) + (ev.b ? t(lang, ev.b).slice(0, 1) : "")}
        />
      )}

      {/* ambient layer — fixed to the viewport, so an embed leaves it out */}
      {!embed && video && <VideoBg src={video.src} poster={video.poster} className="kn-tp__vbg" dim={th.dark ? 0.55 : 0.25} />}
      {!embed && <Particles fx={s.fx} color={th.accent} className="kn-tp__fx" />}
      {B.texture && <Grain kind={B.texture} />}
      {B.watercolorFrame && <div className="kn-wc" aria-hidden="true" />}

      {/* top chrome: back + the other two guest languages */}
      {!embed && (
      <div className="kn-tp__chrome">
        <Link href={`${base}/#gallery`} className="kn-tp__back"><Icon name="chevron" size={16} /> ԿՆԻՔ</Link>
        <span className="kn-tp__langs">
          {GUEST_LANGS.filter((l) => l !== lang).map((l) => (
            <Link key={l} href={`${langPrefix(l)}/invitations/${s.id}`} className="kn-tp__lang">{LANG_LABEL[l]}</Link>
          ))}
        </span>
      </div>
      )}

      <main className="kn-tp__main" id="card">
        {/* ------------------------------------------------------------ HERO */}
        <section className="kn-tp__hero">
          {B.fold ? (
            <FoldCard
              left={<div className="kn-fold__face"><Plate img={gallery[0].img} alt={t(lang, gallery[0].alt)} sizes="30vw" ratio="3 / 4" /></div>}
              center={<div className="kn-fold__face kn-fold__face--c">{hero}</div>}
              right={<div className="kn-fold__face"><Plate img={(gallery[1] ?? gallery[0]).img} alt={t(lang, (gallery[1] ?? gallery[0]).alt)} sizes="30vw" ratio="3 / 4" /></div>}
            />
          ) : B.productTilt ? (
            <div className="kn-tp__prodHero">
              {hero}
              <ProductTilt lang={lang} img={cover} alt={t(lang, coverAlt)} />
            </div>
          ) : B.sealBanner ? (
            <SealBanner lang={lang} a={t(lang, ev.a)} b={ev.b ? t(lang, ev.b) : ""} iso={ev.date} kicker={ev.kicker} embed={embed} />
          ) : B.sceneHero ? (
            <SceneHero lang={lang} a={t(lang, ev.a)} b={ev.b ? t(lang, ev.b) : ""} iso={ev.date} kicker={ev.kicker} city={t(lang, ev.city)} weekday={t(lang, weekdayFromIso(ev.date))} embed={embed} />
          ) : B.castleScene ? (
            <CastleScene lang={lang} a={t(lang, ev.a)} b={ev.b ? t(lang, ev.b) : ""} iso={ev.date} kicker={ev.kicker} city={t(lang, ev.city)} weekday={t(lang, weekdayFromIso(ev.date))} embed={embed} />
          ) : B.tornHero ? (
            <TornHero embed={embed} lang={lang} a={t(lang, ev.a)} b={ev.b ? t(lang, ev.b) : ""} iso={ev.date} kicker={ev.kicker} photo={cover} photoAlt={t(lang, coverAlt)} quote={B.quote} />
          ) : B.bloomHero ? (
            <BloomHero embed={embed} lang={lang} a={t(lang, ev.a)} b={ev.b ? t(lang, ev.b) : ""} iso={ev.date} kicker={ev.kicker} photo={cover} photoAlt={t(lang, coverAlt)} />
          ) : B.roseHero ? (
            <RoseHero embed={embed} lang={lang} a={t(lang, ev.a)} b={ev.b ? t(lang, ev.b) : ""} iso={ev.date} kicker={ev.kicker} photo={cover} photoAlt={t(lang, coverAlt)} />
          ) : B.sprigHero ? (
            <SprigHero embed={embed} lang={lang} a={t(lang, ev.a)} b={ev.b ? t(lang, ev.b) : ""} iso={ev.date} kicker={ev.kicker} photo={cover} photoAlt={t(lang, coverAlt)} invite={B.invite} quote={B.quote} groups={B.entourage} />
          ) : (
            <>
              <div className="kn-tp__cover" data-rise data-reveal>
                <Plate img={cover} alt={t(lang, coverAlt)} sizes="(max-width: 900px) 92vw, 44vw" ratio={s.category === "corporate" ? "16 / 10" : "4 / 5"} priority zoom drift={0.06} />
              </div>
              {hero}
            </>
          )}
        </section>

        {B.memoryReel && <ReelNote lang={lang} />}
        {B.wreath && (
          <div className="kn-wreath" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="kn-wreath__svg">
              <circle cx="100" cy="100" r="78" fill="none" stroke="var(--tp-acc)" strokeWidth="1.2" strokeDasharray="6 4" />
              {Array.from({ length: 24 }).map((_, i) => (
                <ellipse key={i} cx="100" cy="22" rx="5" ry="11" fill="var(--tp-acc)" opacity={0.6 + (i % 3) * 0.12} transform={`rotate(${i * 15} 100 100)`} />
              ))}
            </svg>
          </div>
        )}
        {B.cross && (
          <div className="kn-cross" aria-hidden="true">
            <span className="kn-cross__v" /><span className="kn-cross__h" />
          </div>
        )}

        {/* ---------------------------------------------------------- BLOCKS */}
        <section className="kn-tp__grid">
          {/* a quote the hero did not already set (the torn hero sets its own) */}
          {B.quote && !B.tornHero && !B.sprigHero && <QuoteBand lang={lang} quote={B.quote} />}
          {B.greeting && <Greeting lang={lang} iso={ev.date} />}
          {B.venues && <VenueCards lang={lang} stops={ev.stops} mapUrl={mapUrl ?? draft?.map} />}
          {B.countdown && (
            <div className="kn-fxwrap" data-spotlight>
              <Countdown lang={lang} iso={ev.date} ageBorn={B.ageCountdown?.born} />
              {(s.category === "wedding" || s.category === "engagement") && <MiniCalendar lang={lang} iso={ev.date} />}
              <Beam />
            </div>
          )}
          {/* THE TWO FAMILIES (2026-08-26, after the reference's anatomy):
              both sets of parents over the announce line — renders only when
              the couple filled at least one name; samples never invent them */}
          {draft?.parents && (s.category === "wedding" || s.category === "engagement") && (
            <ParentsAnnounce lang={lang} parents={draft.parents} a={t(lang, ev.a)} b={ev.b ? t(lang, ev.b) : undefined} engagement={s.category === "engagement"} announce={draft.announce} roleA={draft.roleA} roleB={draft.roleB} familyFirst={draft.familyFirst} titleG={draft.ptG} titleB={draft.ptB} addrG={draft.famAG} addrB={draft.famAB} />
          )}
          {/* the day, as a line that draws itself with the scroll: every stop
              spotted with its hour, its place and what happens there. The tabbed
              agenda (a gala's) keeps its own shape. */}
          {B.timeline && (B.timeline === "tabs" ? (
            <Timeline lang={lang} stops={ev.stops.map((x) => ({ ...x, time: clock(x.time) }))} kind={B.timeline} />
          ) : (
            <DayRoute
              lang={lang}
              variant={th.dark ? "cinematic" : "classic"}
              directions={Boolean(B.map)}
              stops={ev.stops.map((x, i) => ({ id: `s${i}`, icon: guessIcon(t(lang, x.name), s.category === "christening" ? "baptism" : s.category, i), time: clock(x.time), title: x.name, venue: x.place, mapUrl: i === 0 ? (mapUrl ?? draft?.map) : undefined }))}
            />
          ))}
          {B.map && <MapCard lang={lang} venue={t(lang, ev.venue)} address={t(lang, ev.address)} city={t(lang, ev.city)} url={mapUrl ?? draft?.map} heading={draft?.ceremonyHead} />}
          {/* the velvet strip closes its LOCATION band on the estate itself,
              a pale bloom riding the tear */}
          {(B.roseHero || B.bloomHero) && B.map && (
            <div className="kn-tb kn-tb--estate" data-rise data-reveal>
              <Plate img={B.bloomHero ? chapelPhoto : estatePhoto} alt="" sizes="(max-width: 900px) 92vw, 560px" ratio="16 / 10" zoom drift={0.08} />
              <span className="kn-estate__rose" aria-hidden="true" data-float="7">{B.bloomHero ? <Hydrangea size={92} seed={47} tones={["#B9C4E0", "#E4E9F5", "#FFFFFF"]} /> : <RoseBloom size={84} seed={47} deep="#A65A6C" mid="#E8AFBD" lit="#F6D4DC" />}</span>
            </div>
          )}
          {B.story && <LoveStory lang={lang} story={B.story} />}
          {B.entourage && !B.sprigHero && <Entourage lang={lang} groups={B.entourage} />}
          {B.godparents && <Godparents lang={lang} names={applied.god} />}
          {B.speakers && <Speakers lang={lang} />}
          {B.plan && <PlanPlace lang={lang} />}
          {B.dressCode && (B.tornHero || B.bloomHero || B.roseHero) && <DressArt className="kn-tb kn-tb--forms" />}
          {B.dressCode && (B.dressNames ? <DressCodeRich lang={lang} colors={B.dressCode} names={B.dressNames} avoid={B.dressAvoid} /> : <DressCode lang={lang} colors={B.dressCode} />)}
          {/* …and its DRESS CODE sinks into the dressed, candlelit table */}
          {B.roseHero && B.dressCode && (
            <div className="kn-tb kn-tb--dphoto" data-rise data-reveal="left">
              <Plate img={velvetTable} alt="" sizes="(max-width: 900px) 92vw, 560px" ratio="16 / 10" zoom drift={0.08} />
            </div>
          )}
          {B.pinDrop && <PinDrop lang={lang} />}
          {B.parentsNote && <ParentsNote lang={lang} />}
          {/* the QR sample follows the deployed origin the day NEXT_PUBLIC_SITE_URL
              is set; until then the placeholder domain stands, labeled as a sample */}
          {B.qr && <QrCheckin lang={lang} url={`${site.url || "https://kniq.am"}/invitations/${s.id}?g=vip-7f3a`} code="KNIQ·7F3A" />}
          {B.ics && (
            <div className="kn-tb"><IcsButton lang={lang} id={s.id} /></div>
          )}
          {B.registry && <Registry lang={lang} />}
          {B.details && <DetailsBand lang={lang} art={<BouquetBottle className="kn-det__art" />} />}
          {draft?.show?.gifts === false ? null : draft?.gifts ? <GiftBox lang={lang} gifts={draft.gifts} /> : B.gift && <GiftNote lang={lang} />}
          {B.gallery && <Gallery lang={lang} items={gallery} kind={B.gallery} />}
          {B.seats !== undefined && <SeatNote lang={lang} seats={B.seats} />}
          {B.adults && <AdultsNote lang={lang} />}
          {B.toastBoard && <ToastBoard lang={lang} />}
          {B.hashtag && (
            <div className="kn-tb kn-tb--hash" data-rise>
              <span className="kn-hash__sprig" aria-hidden="true"><Sprig /></span>
              <p className="kn-hash__t">{lang === "hy" ? "Հարսանեկան հեշթեգ" : "Our wedding hashtag"}</p>
              <p className="kn-hash__p">{lang === "hy" ? "Եթե օրվա լուսանկարները դնեք սոցիալական ցանցերում, խնդրում ենք օգտագործել մեր հեշթեգը։" : "If you post photographs from the day, please use our hashtag."}</p>
              <p className="kn-hash__tag">{t(lang, B.hashtag)}</p>
              <span className="kn-hash__rule" aria-hidden="true" />
            </div>
          )}
          {/* weddings and engagements seat guests by side — the same rule the
              base card and the engine follow (lib/content.ts → occasionHasSides) */}
          {B.rsvp && (
            <div className="kn-fxwrap" data-spotlight>
              <TemplateRsvp lang={lang} kind={B.rsvp} id={eventId ?? s.id} askSide={s.category === "wedding" || s.category === "engagement"} />
              <Beam seconds={12} />
            </div>
          )}
          {/* the guests' words, given back to the guests — only a MINTED link
              has an id to collect under, so demos never grow a wall */}
          {eventId && (s.category === "wedding" || s.category === "engagement") && !embed && draft?.show?.guestbook !== false && (
            <WishesWall lang={lang} eventId={eventId} />
          )}
          {B.guestChat && <GuestChat lang={lang} />}
          {/* the editor's thank-you note — the page's last word, when written */}
          {draft?.thanks && (
            <div className="kn-tb kn-thanks" data-rise>
              <p className="kn-thanks__t">{draft.thanks}</p>
            </div>
          )}
        </section>

        <footer className="kn-tp__foot">
          <p>{footNames} · {stampFromIso(ev.date)}</p>
          <small>ԿՆԻՔ — {lang === "hy" ? "ցուցադրական հրավեր" : "sample invitation"}</small>
        </footer>
      </main>

      {!embed && audio && <MusicDock src={audio.src} label={t(lang, audio.label)} dark={th.dark} />}
    </div>
  );
}
