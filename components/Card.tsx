import Image from "next/image";
import Gate from "./Gate";
import Chrome from "./Chrome";
import Countdown from "./Countdown";
import Rsvp from "./Rsvp";
import Motion from "./Motion";
import Sketch from "./Sketch";
import Share from "./Share";
import {
  calendar,
  couple,
  details,
  film,
  foot,
  gallery,
  hero,
  invitation,
  personal,
  programme,
  venues,
} from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { monthGrid } from "@/lib/date";
import { sampleCouple, stampFromIso, weekdayFromIso } from "@/lib/draft";
import type { Couple } from "@/lib/draft";
import { occasionHasSides, occasionJoinsPeople, occasions, svc } from "@/lib/content";
import { archPlate, nightPlates, photos, service } from "@/lib/photos";
import Plate from "./Plate";


// ============================================================================
// The card itself: nine bands, all server-rendered.
//
// Only four things in this document are client components — the gate, the
// countdown (it ticks), the RSVP form (it posts) and the chrome (music). Every
// word, every address and every map link is in the server HTML, which is why
// this whole invitation is readable with JavaScript switched off.
//
// BAND ORDER, and why it differs from the references:
//   hero → invitation → COUNTDOWN → calendar → programme → gallery → RSVP →
//   details → footer
// NAIVA puts its countdown at 6,253px, immediately above the RSVP form, where
// it reads as a deadline clock rather than as anticipation. Ours sits third,
// right after the invitation, where "54 days" is a happy number; the RSVP
// deadline is stated in words next to the form instead, which is where a
// deadline belongs.
//
// The `details` band (dress code, gifts, children, parking) exists in the
// global category and in NEITHER reference. It is the band that stops four
// separate phone calls to the couple's mothers.
// ============================================================================

const RULE = (
  <p className="kn-rule" aria-hidden="true">
    <span className="kn-rule__mark" />
  </p>
);

export default function Card({
  lang,
  guest,
  inv = "kniq",
  who,
  blob = "",
}: {
  lang: Lang;
  guest: string;
  /** Which wardrobe the card wears (lib/styles.ts). The wrapper's [data-inv]
   *  swaps the custom-property palette; structure and motion never change. */
  inv?: string;
  /** WHOSE card this is. Absent = the sample couple from content.ts. A
   *  couple's own draft (lib/draft.ts) renders through the identical tree —
   *  that is the whole point: the preview IS the product. */
  who?: Couple;
  /** The encoded draft, when this is a couple's preview — the ribbon's
   *  Edit/Order links carry it back to the builder and the order form. */
  blob?: string;
}) {
  const couple = who ?? sampleCouple();
  const grid = monthGrid(couple.date);
  const occ = occasions[couple.occasion];
  const base = lang === "hy" ? "" : "/en";
  // The night style swaps its two brightest plates for the misty church and
  // the tealights — the ivory set reads as glare on a dark ground.
  const gallery_ =
    inv === "luys" ? [nightPlates[0], photos[1], nightPlates[1], photos[3], photos[4]] : photos;
  const days = calendar.weekdays[lang];
  // Two PEOPLE are joined by an ampersand; a name and an age, or a host and
  // an event, by a middot.
  const amp = occasionJoinsPeople(couple.occasion) ? (lang === "hy" ? "և" : "&") : "·";

  return (
    // The style wrapper. display:contents adds no box, but custom properties
    // still inherit through it, so everything inside — the fixed envelope and
    // backdrop included — wears the chosen palette. The body's own background
    // stays ivory for a frame, and never shows: the gate and .kn-back cover
    // the viewport from the first paint.
    <div data-inv={inv} style={{ display: "contents" }}>
      <Gate lang={lang} monogram={couple.monogram} />
      <Chrome lang={lang} guest={guest} sub={`/i/${inv}${blob ? `?p=${blob}` : ""}`} />

      {/* THE DRAFT RIBBON — only on a couple's own preview. Says what this is
          (a draft, not the sent card), and carries the couple straight back
          to editing or forward to ordering with their draft intact. Fixed at
          the bottom so it never covers the envelope's seal. */}
      {couple.draft && (
        <div className="kn-ribbon" role="note">
          <span className="kn-ribbon__t">{t(lang, svc.build.ribbon)}</span>
          <a className="kn-ribbon__a" href={`${base}/#build`}>
            {t(lang, svc.build.ribbonEdit)}
          </a>
          <a className="kn-ribbon__a kn-ribbon__a--go" href={`${base}/order`}>
            {t(lang, svc.build.ribbonOrder)}
          </a>
        </div>
      )}
      <Motion />

      {/* NAIVA's structural idea, in our register: one fixed layer the whole
          card scrolls over. Opaque bands (the RSVP ink, the envelope) cover
          it; everything else reads as one continuous piece of stationery. */}
      <div className="kn-back" aria-hidden="true" />

      <main className="kn-main" id="card">
        {/* ---------------------------------------------------------- HERO */}
        <section className="kn-hero">
          <div className="kn-hero__in">
            {/* The personalised greeting. A link like /?g=Անի makes the card
                open with the guest's own name on it — the cheapest luxury in
                the category, and neither reference has it. Absent by default,
                so the card is never awkwardly blank. */}
            {guest ? (
              <p className="kn-hero__greet" data-rise>
                {t(lang, personal.greet)} {guest},
              </p>
            ) : (
              <p className="kn-label" data-rise>
                {t(lang, occ.kicker)}
              </p>
            )}

            <h1 className="kn-hero__names" data-rise>
              <span>{t(lang, couple.a)}</span>
              {t(lang, couple.b) && (
                <>
                  <span className="kn-hero__amp">{amp}</span>
                  <span>{t(lang, couple.b)}</span>
                </>
              )}
            </h1>

            {RULE}

            <p className="kn-hero__stamp" data-rise>
              {stampFromIso(couple.date)}
            </p>
            <p className="kn-hero__meta" data-rise>
              {t(lang, weekdayFromIso(couple.date))} · {t(lang, couple.city)}
            </p>

            <p className="kn-hero__scroll" aria-hidden="true">
              <span className="kn-hero__line" />
              {t(lang, hero.scroll)}
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------- INVITATION
            The band absorbed the reference's full invitation anatomy: the
            arch-framed photograph opens it, THE FAMILIES issue the invitation
            (the traditional Armenian form — iStudio leads with it, and its
            absence reads as a translated template to exactly the guests the
            form matters to), and scripture closes it like a blessing. */}
        <section className="kn-band kn-invite">
          <div className="kn-col kn-invite__in">
            {/* The arch plate: the ivory card keeps the hands-and-bouquet;
                the two Armenian styles carry the cliff chapel — the register
                of the stone, not a Western studio. It settles from a slow
                zoom as the band enters. */}
            <figure className="kn-arch" data-rise>
              <Plate
                img={inv === "kniq" ? archPlate.img : service.chapel.img}
                alt={t(lang, inv === "kniq" ? archPlate.alt : service.chapel.alt)}
                sizes="(max-width: 640px) 72vw, 310px"
                ratio="3 / 4.1"
                zoom
                drift={0.06}
                position={inv === "kniq" ? "50% 50%" : "50% 30%"}
              />
            </figure>

            <p className="kn-label" data-rise>
              {t(lang, invitation.kicker)}
            </p>
            <p className="kn-invite__fam" data-rise>
              {t(lang, invitation.families)}
            </p>
            <h2 className="kn-invite__line" data-rise>
              {t(lang, invitation.line)}
            </h2>
            {RULE}
            <div className="kn-invite__body">
              {invitation.body.map((p, i) => (
                <p key={i} data-rise>
                  {t(lang, p)}
                </p>
              ))}
            </div>

            {/* <cite>, not <footer>: the attribution names a work (Mark 10:9),
                which is exactly what cite is for — and a <footer> in here
                would leak into every `footer` selector on the page, including
                Motion's own per-band loop. */}
            <blockquote className="kn-epi" data-rise>
              <p className="kn-epi__q">{t(lang, invitation.epigraph)}</p>
              <cite className="kn-epi__from">{t(lang, invitation.epigraphFrom)}</cite>
            </blockquote>
          </div>
        </section>

        {/* ----------------------------------------------------- COUNTDOWN */}
        <Countdown lang={lang} date={couple.date} />

        {/* ------------------------------------------------------ CALENDAR */}
        <section className="kn-band kn-cal">
          <div className="kn-col">
            <h2 className="kn-h2" data-rise>
              {t(lang, calendar.title)}
            </h2>

            <div className="kn-cal__card" data-rise>
              <table className="kn-cal__grid">
                <caption className="kn-sr">{t(lang, calendar.title)}</caption>
                <thead>
                  <tr>
                    {days.map((d, i) => (
                      // abbr carries the full name for screen readers; the
                      // visible text stays three letters wide so the grid
                      // holds its columns at 320px.
                      <th key={d} scope="col" abbr={d}>
                        {days[i]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.map((week, wi) => (
                    <tr key={wi}>
                      {week.map((cell, ci) => (
                        <td key={ci}>
                          {cell.day === null ? (
                            <span className="kn-cal__d" aria-hidden="true" />
                          ) : cell.isWedding ? (
                            // The day is marked by a filled disc AND a ring —
                            // two signals, so it is never identified by colour
                            // alone. The glyph stays ink on gold (15.14:1);
                            // gold text on paper would be 2.70:1 and illegible.
                            <span className="kn-cal__d kn-cal__d--on">
                              <span className="kn-sr">
                                {lang === "hy" ? "Հարսանիքի օրը՝ " : "The wedding day: "}
                              </span>
                              {cell.day}
                            </span>
                          ) : (
                            <span className="kn-cal__d">{cell.day}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add to calendar — a real .ics, generated server-side. Works on
                iPhone, Android, Outlook and Google alike. Neither reference
                offers one, and it is the most useful control on the card. */}
            <p className="kn-cal__add" data-rise>
              <a className="kn-btn kn-btn--ghost" href="/api/ics" download="wedding.ics">
                {t(lang, calendar.add)}
              </a>
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------- PROGRAMME */}
        <section className="kn-band kn-prog">
          <div className="kn-col">
            <div className="kn-prog__head">
              <h2 className="kn-h2" data-rise>
                {t(lang, programme.title)}
              </h2>
              <p className="kn-lead kn-prog__lead" data-rise>
                {t(lang, programme.lead)}
              </p>
            </div>

            <ol className="kn-prog__list">
              {couple.stops.map((s) => (
                <li className="kn-prog__stop" key={s.time}>
                  <div className="kn-prog__rail" aria-hidden="true">
                    <span className="kn-prog__dot" />
                    <span className="kn-prog__thread" />
                  </div>

                  <div>
                    <p className="kn-prog__time">
                      <time dateTime={s.time}>{s.time}</time>
                    </p>
                    <h3 className="kn-prog__name">{t(lang, s.name)}</h3>
                    <p className="kn-prog__place">{t(lang, s.place)}</p>
                    <p className="kn-prog__addr">{t(lang, s.address)}</p>
                    {s.note && <p className="kn-prog__note">{t(lang, s.note)}</p>}

                    {/* Yandex, not Google — it is what Armenian phones and
                        Armenian taxi drivers actually use. Same choice both
                        references made, and the right one. */}
                    <a
                      className="kn-prog__map"
                      href={s.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t(lang, programme.howTo)} — ${t(lang, s.place)}`}
                    >
                      {t(lang, programme.howTo)} ↗
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- VENUES
            The reference's best band: each destination venue as an
            illustrated card — a line drawing of the building, the event chip,
            the venue at display size, the address, the map. Our drawings are
            original SVG line art that DRAWS ITSELF as the band arrives
            (Motion.tsx pulls every pathLength=1 stroke from dashoffset 1 to
            0) — a register AOS cannot reach. The addresses deliberately
            repeat the programme's: that band answers "when", this one
            answers "where is that". */}
        <section className="kn-band kn-ven">
          <div className="kn-col">
            <div className="kn-ven__head">
              <h2 className="kn-h2" data-rise>
                {t(lang, venues.title)}
              </h2>
            </div>

            <div className="kn-ven__grid">
              {venues.list.map((v) => (
                <article className="kn-ven__card" key={v.art} data-rise>
                  <Sketch kind={v.art} />
                  <p className="kn-ven__chip">{t(lang, v.chip)}</p>
                  <h3 className="kn-ven__name">{t(lang, v.name)}</h3>
                  <p className="kn-ven__addr">{t(lang, v.address)}</p>
                  <p className="kn-ven__map">
                    <a
                      className="kn-btn kn-btn--ghost kn-shimmer"
                      href={v.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t(lang, venues.mapWord)} — ${t(lang, v.name)}`}
                    >
                      {t(lang, venues.mapWord)} ↗
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- GALLERY */}
        {photos.length > 0 && (
          <section className="kn-band kn-gal">
            <div className="kn-col">
              <div className="kn-gal__head">
                <h2 className="kn-h2" data-rise>
                  {t(lang, gallery.title)}
                </h2>
                <p className="kn-lead kn-prog__lead" data-rise>
                  {t(lang, gallery.lead)}
                </p>
              </div>

              <div className="kn-gal__grid">
                {gallery_.map((p, i) => (
                  // Each plate drifts a little slower than the page and
                  // swells on hover — the grid breathes instead of sitting.
                  // Alternating drift amounts so neighbours don't move as
                  // one block.
                  <figure className="kn-gal__fig" key={i} data-rise>
                    <Plate
                      img={p.img}
                      alt={t(lang, p.alt)}
                      // The last plate spans the full grid width — its sizes
                      // must say so or next/image serves it a half-width file
                      // and the lace renders soft.
                      sizes={
                        i === gallery_.length - 1
                          ? "(max-width: 640px) 100vw, 1024px"
                          : "(max-width: 640px) 50vw, (max-width: 1100px) 50vw, 640px"
                      }
                      // The FIGURE owns the aspect ratio (the grid's own
                      // rhythm in CSS); the plate just fills it.
                      className="kn-plate--fill"
                      drift={i % 2 === 0 ? 0.08 : 0.12}
                      hover
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------- FILM
            iStudio's included-features list carries «Վիդեո»; the slot exists
            with its full contract and renders only when content.ts names a
            file. Native controls, no autoplay — a guest presses play, which
            also makes the reduced-motion story trivially honest. */}
        {film && (
          <section className="kn-band kn-film">
            <div className="kn-col">
              <video
                className="kn-film__v"
                src={film.src}
                poster={film.poster}
                controls
                playsInline
                preload="none"
                aria-label={t(lang, film.label)}
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------- RSVP */}
        {/* `closed` is decided on the SERVER and handed down, not recomputed in
            the browser. Two clocks would disagree at hydration and swap the
            form for the closed notice (or the reverse) for one frame — and the
            server's clock is the one /api/rsvp enforces against anyway. */}
        <Rsvp
          lang={lang}
          guest={guest}
          closed={Date.now() > new Date(couple.rsvpBy).getTime()}
          askSide={occasionHasSides(couple.occasion)}
        />

        {/* ------------------------------------------------------- DETAILS */}
        <section className="kn-band kn-det">
          <div className="kn-col">
            <div className="kn-det__head">
              <h2 className="kn-h2" data-rise>
                {t(lang, details.title)}
              </h2>
            </div>

            {/* A description list, not a set of collapsibles. There are four
                rows of one sentence each; hiding them behind accordions would
                be four taps to read six lines. */}
            <dl className="kn-det__list">
              {details.items.map((it, i) => (
                <div className="kn-det__row" key={i} data-rise>
                  <dt className="kn-det__q">{t(lang, it.q)}</dt>
                  <dd className="kn-det__a">{t(lang, it.a)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------------- FOOT */}
        <footer className="kn-foot">
          <div className="kn-col">
            {RULE}
            <p className="kn-foot__line" data-rise>
              {t(lang, foot.line)}
            </p>
            <p className="kn-foot__names" data-rise>
              {t(lang, foot.names)}
            </p>

            {/* Forward the invitation on — plain wa.me / t.me links + copy. */}
            <Share lang={lang} />

            {/* The honest line. This build is a showpiece, and a sample
                invitation has to say that it is one. Drops away by itself the
                moment `couple.sample` is set false for a real couple. */}
            {couple.sample && <p className="kn-foot__sample">{t(lang, foot.sampleNote)}</p>}
          </div>
        </footer>
      </main>
    </div>
  );
}
