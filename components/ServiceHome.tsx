import Link from "next/link";
import Image from "next/image";
import Motion from "./Motion";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import ScrollLink from "./ui/ScrollLink";
import MobileCta from "./ui/MobileCta";
import Drum from "./ui/Drum";
import ExpandingCards, { type ExpandCard } from "./ui/ExpandingCards";
import Marquee, { type MarqueeItem } from "./ui/Marquee";
import OrderFlow from "./OrderFlow";
import Icon from "./Icon";
import WeddingExamples from "./invitations/WeddingExamples";
import TemplateView from "./templates/TemplateView";
import { landing as L, svc } from "@/lib/content";
import { examplesFor, findExample } from "@/lib/examples";
// our own drawn beds, rendered and framed as the night strips' cards —
// self-made art (captures of wedding-6's and wedding-5's own SVG beds,
// regenerated with scratchpad bedart.mjs), no borrowed pixels
import roseBedArt from "@/assets/photos/rose-bed.webp";
import hydrangeaArt from "@/assets/photos/hydrangea-bed.webp";
import eucalyptusArt from "@/assets/photos/eucalyptus-card.webp";
import { phoneShots } from "@/lib/phoneShots";
import type { ScheduleIcon } from "@/types/invitation";
import { phoneStrips } from "@/lib/phoneStrips";
import { findTemplate } from "@/lib/templates";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// THE LANDING, FROM THE GROUND — five moves, the order the world's best
// invitation services walk a visitor through their front door:
//
//   1 HERO       one screen: what the app is for, said plainly, beside the
//                thing itself — the sealed envelope with the sample
//                invitation floating over it. Scroll (or the CTA) leads down.
//   2 EXAMPLES   the wedding deck: eighteen versions fanned into a pile,
//                turned by dragging, each with its live detail window, its
//                price and CHOOSE straight into the wizard.
//   3 HOW        three steps — choose, write, receive — because a visitor
//                who has just browsed needs to know the path is short.
//   4 RESULT     proof before the ask: the REAL invitation, scrollable at
//                phone size, next to what it does (three languages, RSVP by
//                side, guest list + Excel, calendar, music).
//   5 ORDER      the form itself, last — where every CTA above has been
//                quietly pointing.
//
// Everything else the old landing carried — categories, kids' strips, the
// template gallery, the style showcase, features, pricing tiers, the feed,
// the FAQ — is retired WHOLE into ServiceHomeFull.tsx (this repo has no git,
// so that file IS the history). Every retired section still lives on its own
// route; the footer keeps the deep links.
// ============================================================================

export default function ServiceHome({ lang }: { lang: Lang }) {
  const base = lang === "hy" ? "" : "/en";
  // the result phone shows the first wedding template, wearing its own
  // sample words — TemplateView's per-field fallback, no draft needed
  const resultTpl = findTemplate("wedding-1");
  // Two curatorial calls, per the client (2026-08-23): the boarding-pass
  // slot leaves the hero — its Sevanavank cover read as travel, not
  // invitation — and the velvet strip wears its own rose bed instead of the
  // dim candlelight it opens on. …and the Boho card followed it out
  // (2026-08-23, same instruction): the hydrangea night takes that slot,
  // wearing its own drawn bed
  const heroFace = (e: { id: string; cover: unknown }) =>
    e.id === "wedding-6" ? roseBedArt : e.id === "wedding-5" ? hydrangeaArt : e.id === "wedding-7" ? eucalyptusArt : (e.cover as typeof roseBedArt);
  const covered = examplesFor("wedding").filter((e) => e.cover && e.id !== "live-boarding-pass" && e.id !== "wedding-3");
  // THE HERO WEARS THE SLATS (client, 2026-08-24: «second screenshot effect
  // must be in hero part and vice versa»): the wedding examples as the
  // expanding row — each slat that design's real mobile first screen with a
  // drawn glyph, opening under the hand, a tap into the wizard. The drum
  // moved down to the birthday chapter with the birthday faces.
  // …and the same designs as a WALKING GALLERY (client, 2026-08-28): the row
  // carries itself past the reader, each card that design's real first screen
  const wedRun: MarqueeItem[] = covered.map((e) => ({
    id: e.id, name: t(lang, e.name), img: phoneShots[e.id] ?? heroFace(e),
    href: `${base}/customize?category=wedding&tpl=${e.id}`,
  }));
  // THE ENGAGEMENT CHAPTER WEARS THE SLATS (client, 2026-08-28): two designs
  // cannot fill a walking loop, but the expanding row was built for exactly
  // this — each slat opens under the hand and tells its own name
  const engIcon: Record<string, ScheduleIcon> = {
    "engagement-1": "rings", "live-engagement-save-the-date": "vows",
  };
  const engSlats: ExpandCard[] = examplesFor("engagement")
    .filter((e) => phoneShots[e.id] ?? e.cover)
    .map((e) => ({
      id: e.id, title: t(lang, e.name), desc: t(lang, e.tagline),
      img: (phoneShots[e.id] ?? e.cover) as typeof roseBedArt,
      icon: engIcon[e.id] ?? "rings",
      href: `${base}/customize?category=engagement&tpl=${e.id}`,
      strip: phoneStrips[e.id],
    }));
  // the rolling film strip moved to the ENGAGEMENT chapter (client,
  // 2026-08-24) — its frames are that occasion's own first screens, each a
  // door into the wizard with that design picked

  // THE BIRTHDAY DRUM (client, 2026-08-24 — the swap's other half): the
  // hero's old cylinder, now turning the birthday designs — each face that
  // design's REAL mobile first screen (lib/phoneShots — our own captures).
  // Two of the 44 children's cards ride along; the rest are one link away in
  // /kids. A tap on a face lands in the wizard with that design picked.
  const bdayIds = ["birthday-4", "birthday-5", "birthday-1", "birthday-2", "birthday-3",
    "live-birthday-anniversary", "kids-cake-confetti-cream", "kids-space-blast-navy"];
  const bdayFaces = bdayIds.flatMap((id) => {
    const e = findExample(id);
    const img = phoneShots[id];
    if (!e || !img) return [];
    // a kids' card has no kind chip on the drum — its face already says it
    const kind = e.kind === "engine" ? ("engine" as const) : e.kind === "web" ? ("web" as const) : undefined;
    return [{ id, name: t(lang, e.name), img, href: `${base}/customize?category=birthday&tpl=${id}`, kind }];
  });

  return (
    <div className="kn-svc kn-home">
      <SiteNav lang={lang} />
      <Motion />
      <div className="kn-back" aria-hidden="true" />

      <main className="kn-main" id="card">
        {/* ================================================ 0 THE OPENER
            The reference's front door, first (client, 2026-08-27): the brand
            promise on the left, two REAL phones standing on the right — our
            own captured strips, tilted like a pair of held phones. The CTA
            walks into the catalogue; everything the landing already was
            follows below, untouched. */}
        <section className="kn-svc__hero kn-open" id="welcome">
          {/* the washed collage of real invitations behind everything —
              the reference's own ground, laid from OUR captures */}
          <div className="kn-open__collage" aria-hidden="true">
            {Object.values(phoneShots).slice(0, 14).map((img, i) => (
              <span className="kn-open__cIt" key={i}><Image src={img} alt="" fill sizes="150px" draggable={false} /></span>
            ))}
          </div>
          <div className="kn-open__type">
            <p className="kn-open__brand" data-rise><b>{t(lang, L.hero.opener.brand)}</b>.am</p>
            <h1 className="kn-svc__title kn-open__title" data-rise data-words>{t(lang, L.hero.opener.title)}</h1>
            <p className="kn-open__quote" data-rise>{t(lang, L.hero.opener.quote)}</p>
            <p className="kn-svc__sub kn-open__sub" data-rise>{t(lang, L.hero.opener.sub)}</p>
            <p className="kn-open__note" data-rise>{t(lang, L.hero.opener.note)}</p>
            <p className="kn-svc__ctas kn-open__cta" data-rise>
              <Link className="kn-btn kn-btn--big" href={`${base}/templates`}>{t(lang, L.hero.opener.cta)}</Link>
            </p>
          </div>
          {/* REALISTIC DEVICES (2026-08-28): drawn frames — titanium body,
              island, side keys, glass glare — each screen a real template.
              On scroll the front pair passes: one climbs, one sinks
              (data-drifty, Motion.tsx), the third rests behind. */}
          {/* the reference's arrangement: the pair FLIES on one diagonal,
              both leaning the same way and seen slightly from the side.
              The WRAPPER owns position + the scroll drift (gsap writes its
              transform), the DEVICE inside owns rotation + the 3D lean —
              the two never fight over one transform. */}
          <div className="kn-open__phones" data-rise aria-hidden="true">
            <span className="kn-open__phWrap kn-open__phWrap--a" data-drifty="-140">
              <span className="kn-open__ph kn-open__ph--a">
                <span className="kn-open__phScr"><Image src={phoneStrips["wedding-7"]} alt="" fill sizes="300px" draggable={false} /></span>
              </span>
            </span>
            <span className="kn-open__phWrap kn-open__phWrap--b" data-drifty="150">
              <span className="kn-open__ph kn-open__ph--b">
                <span className="kn-open__phScr"><Image src={phoneStrips["wedding-5"]} alt="" fill sizes="320px" draggable={false} /></span>
              </span>
            </span>
          </div>
        </section>

        {/* ================================================== 1 THE HERO
            One viewport, photograph-forward: the type says what the app is
            for, and beneath it THE WORK ITSELF stands — the wedding designs
            as a row of slats (the expanding-cards grammar), each wearing its
            real mobile first screen, the one under the hand opening wide,
            every slat a door into the wizard with that example picked. */}
        <section className="kn-svc__hero kn-home__hero kn-home__hero--drum" id="top">
          {/* THE PITCH IS GONE (2026-08-28): the opener above already carries
              the brand promise and the single CTA, so this chapter opens
              straight on the work — its own name over the row of slats. */}

          {/* the wedding chapter's own name over the slats — centred, walked
              left by the scroll, on the same section-geometry window its three
              sibling chapter heads use. (It once used data-shift="top" —
              absolute scroll — because this hero opened the page; the opener
              above it now spends that window before the row is ever in view.)
              The wrapper shares the slats' width so the title lands exactly on
              the row's left edge. */}
          <div className="kn-home__wedHeadRow">
            <div className="kn-ch__head" data-shift>
              <p className="kn-label" data-rise data-track>{t(lang, L.hero.wedKicker)}</p>
              <h2 className="kn-h2" data-rise data-words>{t(lang, L.hero.wedTitle)}</h2>
            </div>
          </div>

          <div className="kn-home__heroSlats" data-rise>
            <Marquee items={wedRun} label={t(lang, L.hero.slatsLabel)} seconds={52} />
          </div>

          {/* the invitation downward — it bobs until the reader obliges */}
          <ScrollLink className="kn-home__hint" to="examples">
            <span>{t(lang, L.hero.scroll)}</span>
            <Icon name="chevron" size={16} className="kn-home__hintChev" />
          </ScrollLink>
        </section>

        {/* ============================================ 2 THE WEDDING EXAMPLES
            The deck: every wedding version on its own card, fanned, turned by
            dragging; VIEW DETAILS opens the live window, CHOOSE hands the
            pick to the wizard. The component is the same one /wedding-live
            shows — one catalogue, two doors. */}
        <section className="kn-band kn-home__examples" id="examples">
          <div className="kn-col">
            <WeddingExamples lang={lang} />
          </div>
        </section>

        {/* ============================================ 2b THE ENGAGEMENT CHAPTER
            The second occasion, on the reference portfolio's peach ground —
            the examples as the fanned pile (the same deck grammar as the
            wedding catalogue: drag to browse, VIEW DETAILS opens the live
            window, CHOOSE lands in the wizard). The chapter's name is
            authored centred and walks left-and-smaller with the scroll. */}
        {/* ====================================================== 2b THE PATH
            The reference's three-step section, in our own light: the title
            with its tail in the accent, three steps threaded on a connector
            line, the film invitation beside them, and ONE button under it
            all. (This slot held the engagement chapter — its designs live in
            the catalogue, which /templates lists beside the weddings.) */}
        <section className="kn-band kn-home__chap kn-home__path" id="how">
          <div className="kn-col">
            <h2 className="kn-h2 kn-path__title" data-rise>
              {t(lang, L.how.title)} <em>{t(lang, L.how.titleTail)}</em>
            </h2>
            <p className="kn-path__sub" data-rise>{t(lang, L.how.sub)}</p>

            <div className="kn-path__grid">
              <ol className="kn-path__steps">
                {L.how.list.map((st, i) => (
                  <li className="kn-path__step" key={i} data-rise style={{ "--i": i } as React.CSSProperties}>
                    <span className="kn-path__ic" aria-hidden="true"><Icon name={st.icon} size={19} /></span>
                    <p className="kn-path__n">{t(lang, L.how.stepN)} {i + 1}</p>
                    <h3 className="kn-path__t">{t(lang, st.t)}</h3>
                    <p className="kn-path__d">{t(lang, st.d)}</p>
                  </li>
                ))}
              </ol>

              {/* the panel beside the steps is the FILM invitation — a real
                  page of ours, not a tutorial we do not have */}
              <Link className="kn-path__media" href={`${base}/film/wedding-6`} data-rise>
                <span className="kn-path__phone">
                  <Image src={phoneStrips["wedding-6"]} alt="" fill sizes="(max-width: 899px) 60vw, 300px" draggable={false} />
                </span>
                <span className="kn-path__play" aria-hidden="true"><Icon name="film" size={22} /></span>
                <span className="kn-path__cap">{t(lang, L.how.filmCta)}</span>
              </Link>
            </div>

            <p className="kn-svc__ctas kn-path__cta" data-rise>
              <Link className="kn-btn kn-btn--big" href={`${base}/templates`}>{t(lang, L.how.cta)}</Link>
            </p>
          </div>
        </section>

        {/* =========================================== 2b THE ENGAGEMENT CHAPTER
            Its own ground between the wedding cream and the birthday pink.
            The same walking gallery carries it — but the component only spins
            once a chapter has enough designs to fill the loop, and this one
            holds two, so it stands as a plain row until the catalogue grows. */}
        <section className="kn-band kn-home__chap kn-home__eng" id="engagement">
          <div className="kn-col">
            <div className="kn-ch__head" data-shift>
              <p className="kn-label" data-rise data-track>{t(lang, L.eng.kicker)}</p>
              <h2 className="kn-h2" data-rise data-words>{t(lang, L.eng.title)}</h2>
            </div>
            <p className="kn-lead" data-rise>{t(lang, L.eng.lead)}</p>
            <div className="kn-home__engRun" data-rise>
              <ExpandingCards className="kn-xc--eng" items={engSlats} label={t(lang, L.eng.galleryLabel)} open={t(lang, L.hero.open)} />
            </div>
            <p className="kn-svc__ctas" data-rise>
              <Link className="kn-btn kn-btn--ghost" href={`${base}/customize?category=engagement`}>
                {t(lang, L.eng.create)}
              </Link>
            </p>
          </div>
        </section>

        {/* ============================================== 2c THE BIRTHDAY CHAPTER
            The third occasion, on the reference's dusty-pink ground — the
            examples on the TURNING DRUM (the hero's old cylinder, moved here
            in the swap): drifting until a hand lands on it, spun by
            dragging, every face a door into the wizard. */}
        <section className="kn-band kn-home__chap kn-home__bday" id="birthday">
          <div className="kn-col">
            <div className="kn-ch__head" data-shift>
              <p className="kn-label" data-rise data-track>{t(lang, L.bday.kicker)}</p>
              <h2 className="kn-h2" data-rise data-words>{t(lang, L.bday.title)}</h2>
            </div>
            <p className="kn-lead" data-rise>{t(lang, L.bday.lead)}</p>
            <div className="kn-home__drumWrap" data-rise>
              <Drum faces={bdayFaces} label={t(lang, L.bday.drumLabel)} hint={t(lang, L.bday.drumHint)} />
            </div>
            <p className="kn-svc__ctas" data-rise>
              <Link className="kn-btn kn-btn--ghost" href={`${base}/customize?category=birthday`}>
                {t(lang, L.bday.create)}
              </Link>
              <Link className="kn-btn kn-btn--ghost" href={`${base}/kids`}>
                {t(lang, L.bday.kids)} <Icon name="arrow" size={14} />
              </Link>
            </p>
          </div>
        </section>

        {/* ======================================================= 3 THE PATH */}
        {/* the old plain steps band lived here; THE PATH above carries it now */}

        {/* ===================================================== 4 THE RESULT
            Proof before the ask: the real guest page, scrollable in a
            phone-sized pane (the same TemplateView embed the wizard's
            preview column trusts), beside what the link actually does. */}
        <section className="kn-band kn-home__result" id="result">
          {/* three grid children, so the phone can change its seat by screen:
              beside the words on a desktop, BETWEEN the lead and the points on
              a phone — on the device the proof is the size of, it comes right
              after the claim it proves */}
          <div className="kn-col kn-home__resultGrid">
            <div className="kn-home__resultHead">
              <p className="kn-label" data-rise>{t(lang, L.result.kicker)}</p>
              <h2 className="kn-h2" data-rise>{t(lang, L.result.title)}</h2>
              <p className="kn-lead" data-rise>{t(lang, L.result.lead)}</p>
            </div>
            {resultTpl && (
              <div className="kn-home__phone" data-rise>
                <div className="kn-pl__view kn-home__phoneView" tabIndex={0} aria-label={t(lang, L.result.phoneLabel)} data-lenis-prevent>
                  <div className="kn-pl__page">
                    <TemplateView lang={lang} s={resultTpl} base={base} embed />
                  </div>
                </div>
              </div>
            )}
            <div className="kn-home__resultRest">
              <ul className="kn-home__points">
                {L.result.points.map((p, i) => (
                  <li key={i} data-rise style={{ "--i": i } as React.CSSProperties}>
                    <span className="kn-home__pointIc" aria-hidden="true"><Icon name={p.icon} size={18} /></span>
                    <b>{t(lang, p.t)}</b>
                    <span>{t(lang, p.d)}</span>
                  </li>
                ))}
              </ul>
              <p className="kn-svc__ctas" data-rise>
                <Link className="kn-btn kn-btn--ghost" href={`${base}/invitation/wedding-1`} target="_blank" rel="noopener">
                  {t(lang, L.result.open)} <Icon name="arrow" size={14} />
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================== 5 THE ORDER */}
        <section className="kn-band kn-svc__buildBand kn-home__order" id="order">
          <div className="kn-col">
            <div style={{ textAlign: "center" }}>
              <p className="kn-label" data-rise>{t(lang, L.order.kicker)}</p>
              <h2 className="kn-h2" data-rise>{t(lang, svc.flow.title)}</h2>
              <p className="kn-lead" style={{ marginInline: "auto", marginTop: "0.8rem" }} data-rise>
                {t(lang, svc.flow.lead)}
              </p>
            </div>
            <OrderFlow lang={lang} />
          </div>
        </section>

        <SiteFooter lang={lang} />
      </main>

      {/* the two verbs, under the thumb — phones only, between hero and order */}
      <MobileCta lang={lang} />
    </div>
  );
}
