import Link from "next/link";
import Motion from "./Motion";
import Plate from "./Plate";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import TiltCard from "./ui/3d/TiltCard";
import StyleCard from "./StyleCard";
import OrderFlow from "./OrderFlow";
import Icon from "./Icon";
import TemplateGrid from "./TemplateGrid";
import { catPlates, photos, service, stylePlates } from "@/lib/photos";
import { kids as kidsCopy, occasions, svc, wcards as wCopy } from "@/lib/content";
import { kidsCards, sampleKids } from "@/lib/kids";
import { wCards } from "@/lib/wcards";
import KidsTile from "./kids/KidsTile";
import MotifSprite from "./kids/Motifs";
import WTile from "./wcards/WTile";
import WMotifSprite from "./wcards/WMotifs";
import type { Lang, Occasion } from "@/lib/content";
import { t } from "@/lib/i18n";
import { formatAmd, styles } from "@/lib/styles";

// ============================================================================
// THE FULL LANDING, RETIRED — kept whole, imported by nothing.
//
// On 2026-08-23 the client asked for the landing to start again from the
// ground: a hero that says what the app is for, the wedding examples on
// scroll, and the path to an order — everything else deleted or commented.
// This project has no git history, so «commented» means THIS FILE: the whole
// nine-section page as it stood, ready to be mined or restored. The new
// landing lives in ServiceHome.tsx. Every component this file uses is still
// alive on its own route (/kids, /wedding-cards, /templates, /order).
//
// THE SERVICE LANDING — the blueprint's nine sections, in its order:
//
//   1 nav · 2 hero (type + a 3D tilt stage: the sealed-envelope photograph
//   with the SAMPLE INVITATION floating over it in depth) · 3 category grid ·
//   4 showcase (style cards with live-preview toggle + detail modal) ·
//   5 the three-step order flow · 6 features grid · 7 pricing tiers (+ the
//   terms, plainly) · 8 gallery feed · 9 footer — with the FAQ and Ararat
//   closer as an addendum before the footer.
//
// Geometry per the blueprint: 1280 container, 16/24 radii on cards, 64–96px
// band padding, subtle shadows; serif display + sans body; gold, charcoal,
// cream, and a soft rose accent — every colour measured before use.
//
// Server-rendered except the nav, the tilt stage, the showcase cards and the
// order flow.
// ============================================================================

export default function ServiceHomeFull({ lang }: { lang: Lang }) {
  const base = lang === "hy" ? "" : "/en";
  const occKeys = Object.keys(occasions) as Occasion[];
  const cheapest = Math.min(...styles.map((s) => s.from));

  return (
    <div className="kn-svc">
      <SiteNav lang={lang} />
      <Motion />
      <div className="kn-back" aria-hidden="true" />

      <main className="kn-main" id="card">
        {/* ============================================================ 2 HERO */}
        <section className="kn-svc__hero kn-svc__hero--split" id="top">
          <div className="kn-svc__heroType">
            <p className="kn-label" data-rise>
              {t(lang, svc.hero.kicker)}
            </p>
            <h1 className="kn-svc__title" data-rise>
              {t(lang, svc.hero.title)}
            </h1>
            <p className="kn-svc__sub" data-rise>
              {t(lang, svc.hero.sub)}
            </p>
            <p className="kn-svc__from" data-rise>
              {t(lang, svc.catalog.fromWord)} {formatAmd(cheapest)} · {t(lang, svc.catalog.bothLangs)}
            </p>
            <p className="kn-svc__ctas" data-rise>
              <Link className="kn-btn" href={`${base}/customize`}>
                {t(lang, svc.nav.build)}
              </Link>
              <Link className="kn-btn kn-btn--ghost" href={`${base}/i/kniq`}>
                {t(lang, svc.hero.cta2)}
              </Link>
            </p>
          </div>

          {/* The 3D preview stage: the photograph at depth 0, the sample card
              floating over it at depth 1. Tilts toward the pointer; on a phone
              it stands still. Clicking the card opens the real invitation. */}
          <div className="kn-svc__heroStage" data-rise>
            <TiltCard>
              <div className="kn-svc__heroPlate" data-depth="0">
                <Plate
                  img={service.hero.img}
                  alt={t(lang, service.hero.alt)}
                  sizes="(max-width: 900px) 92vw, 44vw"
                  priority
                  ratio="4 / 5"
                  position="50% 40%"
                />
              </div>
              <Link className="kn-mini" href={`${base}/i/kniq`} data-depth="1" aria-label={t(lang, svc.hero.cta2)}>
                <span className="kn-mini__seal" aria-hidden="true">
                  <b>Ն</b>
                  <b>Հ</b>
                </span>
                <span className="kn-mini__kick">{t(lang, occasions.wedding.kicker)}</span>
                <span className="kn-mini__names">
                  Նարե <i>&amp;</i> Հայկ
                </span>
                <span className="kn-mini__date">10 · 10 · 2026</span>
                <span className="kn-mini__open">
                  {t(lang, svc.hero.cta2)} <Icon name="arrow" size={14} />
                </span>
              </Link>
            </TiltCard>
          </div>
        </section>

        {/* ====================================================== 3 CATEGORIES */}
        <section className="kn-band" id="categories">
          <div className="kn-col" style={{ textAlign: "center" }}>
            <h2 className="kn-h2" data-rise>
              {t(lang, svc.categories.title)}
            </h2>
            <p className="kn-lead" style={{ marginInline: "auto", marginTop: "0.8rem" }} data-rise>
              {t(lang, svc.categories.lead)}
            </p>
            <div className="kn-cats">
              {occKeys.map((o, i) => (
                <Link
                  key={o}
                  className="kn-cat kn-cat--photo"
                  href={`${base}/customize?category=${o}`}
                  data-rise
                  data-occ={o}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className="kn-cat__img">
                    <Plate img={catPlates[o].img} alt={t(lang, catPlates[o].alt)} sizes="(max-width: 700px) 92vw, 300px" ratio="4 / 3" hover />
                    <span className="kn-cat__n" aria-hidden="true">0{i + 1}</span>
                  </span>
                  <span className="kn-cat__t">{t(lang, occasions[o].name)}</span>
                  <span className="kn-cat__d">{t(lang, svc.categories.blurb[o])}</span>
                  <span className="kn-cat__go">
                    {t(lang, svc.categories.hint)} <Icon name="arrow" size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================ 3b KIDS' CARDS
            The kids' birthday catalogue (lib/kids.ts) — six of the forty-four,
            wearing sample children, each opening its own studio. */}
        <section className="kn-band kn-svc__kids" id="kids">
          <MotifSprite />
          <WMotifSprite />
          <div className="kn-col">
            {/* ---- wedding cards: the Greenvelope way, in an envelope ---- */}
            <div className="kn-svc__kidsHead">
              <div>
                <p className="kn-label" data-rise>{t(lang, wCopy.kicker)}</p>
                <h2 className="kn-h2" data-rise>{t(lang, wCopy.title)}</h2>
                <p className="kn-lead" data-rise>{t(lang, wCopy.lead)}</p>
              </div>
              <span className="kn-svc__ctas" data-rise><Link href={`${base}/wedding-cards`} className="kn-btn">{t(lang, wCopy.backAll)} · {wCards.length} <Icon name="arrow" size={14} /></Link><Link href={`${base}/wedding-live`} className="kn-btn kn-btn--ghost">{t(lang, wCopy.wayWeb)} <Icon name="arrow" size={14} /></Link></span>
            </div>
            <ul className="kn-kids__grid kn-svc__kidsStrip" style={{ marginBottom: "clamp(3rem, 7vw, 5rem)" }}>
              {wCards.filter((k) => k.popular).slice(0, 6).map((k, i) => (
                <li key={k.id} className="kn-kids__it" data-rise style={{ "--i": i } as React.CSSProperties}>
                  <Link href={`${base}/wedding-cards/${k.id}`} className="kn-kids__tileLink" aria-label={t(lang, k.name)}>
                    <WTile card={k} variant={k.variants[0]} lang={lang} />
                  </Link>
                  <div className="kn-kids__meta"><Link href={`${base}/wedding-cards/${k.id}`} className="kn-kids__name">{t(lang, k.name)}</Link></div>
                </li>
              ))}
            </ul>
            <div className="kn-svc__kidsHead">
              <div>
                <p className="kn-label" data-rise>{t(lang, kidsCopy.kicker)}</p>
                <h2 className="kn-h2" data-rise>{t(lang, kidsCopy.title)}</h2>
                <p className="kn-lead" data-rise>{t(lang, kidsCopy.lead)}</p>
              </div>
              <Link href={`${base}/kids`} className="kn-btn" data-rise>{t(lang, kidsCopy.backAll)} · {kidsCards.length} <Icon name="arrow" size={14} /></Link>
            </div>
            <ul className="kn-kids__grid kn-svc__kidsStrip">
              {kidsCards.filter((k) => k.popular).slice(0, 6).map((k, i) => (
                <li key={k.id} className="kn-kids__it" data-rise style={{ "--i": i } as React.CSSProperties}>
                  <Link href={`${base}/kids/${k.id}`} className="kn-kids__tileLink" aria-label={t(lang, k.name)}>
                    <KidsTile card={k} variant={k.variants[0]} lang={lang} face={{ name: sampleKids[i][lang], age: sampleKids[i].age, details: false }} />
                  </Link>
                  <div className="kn-kids__meta"><Link href={`${base}/kids/${k.id}`} className="kn-kids__name">{t(lang, k.name)}</Link></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================================ 4a LIVE TEMPLATE GALLERY
            The live examples with filter tabs and instant search — the
            gallery the brief asks for, ahead of the three base styles. */}
        <section className="kn-band" id="gallery">
          <div className="kn-col">
            <TemplateGrid lang={lang} />
          </div>
        </section>

        {/* ======================================================== 4 SHOWCASE */}
        <section className="kn-band" id="styles">
          <div className="kn-col" style={{ textAlign: "center" }}>
            <h2 className="kn-h2" data-rise>
              {t(lang, svc.catalog.title)}
            </h2>
            <p className="kn-lead" style={{ marginInline: "auto", marginTop: "0.8rem" }} data-rise>
              {t(lang, svc.catalog.lead)}
            </p>
            <div className="kn-svc__cats">
              {styles.map((s) => (
                <StyleCard key={s.id} lang={lang} s={s} plate={stylePlates[s.id]} />
              ))}
            </div>
            <p className="kn-svc__langNote" data-rise>
              {t(lang, svc.catalog.bothLangs)}
            </p>
          </div>
        </section>

        {/* ====================================================== 5 ORDER FLOW */}
        <section className="kn-band kn-svc__buildBand" id="order">
          <div className="kn-col">
            <span id="build" />
            <div style={{ textAlign: "center" }}>
              <h2 className="kn-h2" data-rise>
                {t(lang, svc.flow.title)}
              </h2>
              <p className="kn-lead" style={{ marginInline: "auto", marginTop: "0.8rem" }} data-rise>
                {t(lang, svc.flow.lead)}
              </p>
            </div>
            <OrderFlow lang={lang} />
          </div>
        </section>

        {/* ======================================================== 6 FEATURES */}
        <section className="kn-band" id="features">
          <div className="kn-col" style={{ textAlign: "center" }}>
            <h2 className="kn-h2" data-rise>
              {t(lang, svc.featureGrid.title)}
            </h2>
            <p className="kn-lead" style={{ marginInline: "auto", marginTop: "0.8rem" }} data-rise>
              {t(lang, svc.featureGrid.lead)}
            </p>
            <div className="kn-feats">
              {svc.featureGrid.list.map((it, i) => (
                <div className="kn-feat" key={i} data-rise>
                  <span className="kn-feat__ic" aria-hidden="true">
                    <Icon name={it.icon} size={22} />
                  </span>
                  <h3 className="kn-feat__t">{t(lang, it.t)}</h3>
                  <p className="kn-feat__d">{t(lang, it.d)}</p>
                </div>
              ))}
            </div>

            {/* how it works, with the stamp — the three steps in prose */}
            <div className="kn-svc__how" id="how" style={{ marginTop: "clamp(3rem, 8vh, 5rem)", textAlign: "left" }}>
              <div className="kn-svc__howPlate" data-rise>
                <Plate
                  img={service.stamp.img}
                  alt={t(lang, service.stamp.alt)}
                  sizes="(max-width: 900px) 92vw, 40vw"
                  ratio="3 / 2"
                  drift={0.1}
                  zoom
                />
              </div>
              <div>
                <h3 className="kn-h2" data-rise>
                  {t(lang, svc.steps.title)}
                </h3>
                <ol className="kn-svc__steps kn-svc__steps--col" style={{ listStyle: "none", padding: 0 }}>
                  {svc.steps.list.map((s, i) => (
                    <li className="kn-svc__step" key={i} data-rise>
                      <span className="kn-svc__stepN">0{i + 1}</span>
                      <h4 className="kn-svc__stepT">{t(lang, s.t)}</h4>
                      <p className="kn-svc__stepD">{t(lang, s.d)}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= 7 PRICING */}
        <section className="kn-band kn-svc__pricing" id="pricing">
          <div className="kn-col" style={{ textAlign: "center" }}>
            <h2 className="kn-h2" data-rise>
              {t(lang, svc.pricing.title)}
            </h2>
            <p className="kn-lead" style={{ marginInline: "auto", marginTop: "0.8rem" }} data-rise>
              {t(lang, svc.pricing.lead)}
            </p>

            <div className="kn-tiers">
              {svc.pricing.tiers.map((tier) => (
                <article
                  className="kn-tier"
                  key={tier.id}
                  data-rise
                  data-popular={tier.id === "premium" ? "" : undefined}
                >
                  {tier.id === "premium" && <span className="kn-tier__pop">{t(lang, svc.pricing.popular)}</span>}
                  <p className="kn-svc__catMood">{t(lang, tier.name)}</p>
                  <p className="kn-tier__price">
                    {tier.price === null ? (
                      <span className="kn-tier__quote">{t(lang, svc.pricing.quote)}</span>
                    ) : (
                      <>
                        {formatAmd(tier.price)} <small>/ {t(lang, svc.pricing.per)}</small>
                      </>
                    )}
                  </p>
                  <p className="kn-tier__blurb">{t(lang, tier.blurb)}</p>
                  <ul className="kn-tier__feats">
                    {tier.feats.map((x, i) => (
                      <li key={i}>
                        <Icon name="check" size={16} />
                        {t(lang, x)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className={`kn-btn${tier.id === "premium" ? "" : " kn-btn--ghost"}`}
                    href={`${base}/order?style=${tier.style}`}
                  >
                    {t(lang, tier.price === null ? svc.pricing.ctaCustom : svc.pricing.cta)}
                  </Link>
                </article>
              ))}
            </div>

            {/* the terms, plainly — iStudio's most trust-building block */}
            <dl className="kn-svc__terms">
              {svc.policy.list.map((p, i) => (
                <div className="kn-svc__term" key={i} data-rise>
                  <dt>{t(lang, p.k)}</dt>
                  <dd>{t(lang, p.v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ==================================================== 8 GALLERY FEED */}
        <section className="kn-band kn-feed" id="feed">
          <div className="kn-col">
            <p className="kn-label" data-rise>
              {t(lang, svc.feed.kicker)}
            </p>
            <h2 className="kn-h2" data-rise>
              {t(lang, svc.feed.title)}
            </h2>
          </div>
          <div className="kn-feed__strip" data-rise>
            {[service.hero, stylePlates.kniq, service.stamp, stylePlates.luys, photos[0], stylePlates.tuf, service.chapel, service.closer].map(
              (p, i) => (
                <figure className="kn-feed__it" key={i}>
                  <Plate img={p.img} alt="" sizes="(max-width: 640px) 78vw, 380px" ratio="4 / 5" hover />
                  <figcaption>{t(lang, p.alt)}</figcaption>
                </figure>
              ),
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------- FAQ */}
        <section className="kn-band">
          <div className="kn-col" style={{ textAlign: "center" }}>
            <h2 className="kn-h2" data-rise>
              {t(lang, svc.faq.title)}
            </h2>
            <dl className="kn-svc__faq">
              {svc.faq.list.map((f, i) => (
                <div key={i} data-rise>
                  <dt className="kn-svc__q">{t(lang, f.q)}</dt>
                  <dd className="kn-svc__a">{t(lang, f.a)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------------- CLOSER */}
        <section className="kn-svc__closer" aria-hidden="true">
          <Plate img={service.closer.img} alt="" sizes="100vw" drift={0.18} className="kn-svc__closerPlate" position="50% 60%" />
          <p className="kn-svc__closerLine" data-rise>
            {t(lang, svc.hero.title)}
          </p>
        </section>

        {/* ========================================================== 9 FOOTER */}
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
