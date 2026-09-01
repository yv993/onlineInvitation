import Plate from "@/components/Plate";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";
import type { TemplateSpec } from "@/lib/templates";

/** the copy this board owns — every badge keeps its «click here» promise */
const L = {
  details: { hy: "Մանրամասներ", en: "Details", ru: "Детали" } as T,
  rsvp: { hy: "Պատասխանեք", en: "Kindly RSVP", ru: "Ответьте" } as T,
  storyA: { hy: "Մեր", en: "Our", ru: "Наша" } as T,
  storyB: { hy: "պատմությունը", en: "story", ru: "история" } as T,
  click: { hy: "Սեղմեք այստեղ", en: "Click here", ru: "Нажмите" } as T,
};

/** The STICKER BOARD hero (wedding-11 «Խճանկար», the client's 2026-08-31
 *  reference): the invitation as a cream pinboard — a hexagon photograph,
 *  three tilted polaroids, and three badge-buttons. The reference swapped
 *  whole sub-views behind its badges; here each badge is an ANCHOR walking
 *  down to the page's real section (#where, #rsvp, #story) — one source of
 *  truth, smooth-scrolled by the site's own CSS, working without JS. */
export default function BoardHero({ lang, a, b, kicker, dateLine, city, cover, coverAlt, gallery, embed }: {
  lang: Lang;
  a: string;
  b: string;
  kicker: T;
  dateLine: string;
  city: string;
  cover: TemplateSpec["cover"] | string;
  coverAlt: string;
  /** the spec's gallery: [0..2] become the polaroids, [3] the arch portrait */
  gallery: Array<{ img: TemplateSpec["cover"] | string; alt: T }>;
  embed?: boolean;
}) {
  // an embed is a guest, not a page — it must not plant its own <h1>
  const H = embed ? ("div" as const) : ("h1" as const);
  const pol = gallery.slice(0, 3);
  const arch = gallery[3] ?? gallery[0];
  return (
    <div className="kn-board" data-rise>
      <p className="kn-board__join" data-track>{t(lang, kicker)}</p>
      <H className="kn-board__names">{b ? `${a} & ${b}` : a}</H>
      <p className="kn-board__meta">{dateLine}{city ? ` • ${city}` : ""}</p>

      <div className="kn-board__canvas">
        {/* the hexagon photograph, on its gold pad */}
        <span className="kn-board__hex" data-float="6">
          <span className="kn-board__hexIn">
            <Plate img={cover} alt={coverAlt} sizes="(max-width: 900px) 40vw, 190px" ratio="8 / 9" priority={!embed} />
          </span>
        </span>

        {/* the three polaroids, each leaning its own way — NO data-float here:
            the float tween folds the CSS rotate property into gsap's own
            transform and the lean is lost (measured 2026-08-31) */}
        {pol.map((g, i) => (
          <span key={i} className={`kn-board__pol kn-board__pol--${i + 1}`}>
            <Plate img={g.img} alt={t(lang, g.alt)} sizes="(max-width: 900px) 30vw, 130px" ratio="6 / 5" />
          </span>
        ))}

        {/* the scalloped DETAILS rosette — down to the venue card */}
        <a className="kn-board__rosette" href="#where" data-float="7">
          <b>{t(lang, L.details)}</b>
          <small>{t(lang, L.click)}</small>
        </a>

        {/* the RSVP envelope — down to the live reply form */}
        <a className="kn-board__env" href="#rsvp" data-float="9">
          <b>{t(lang, L.rsvp)}</b>
          <small>{t(lang, L.click)}</small>
        </a>

        {/* the olive arch — down to the story */}
        <a className="kn-board__arch" href="#story" data-float="8">
          <span className="kn-board__archT"><i>{t(lang, L.storyA)}</i><i>{t(lang, L.storyB)}</i></span>
          <span className="kn-board__archImg">
            <Plate img={arch.img} alt={t(lang, arch.alt)} sizes="110px" ratio="1 / 1" />
          </span>
          <small>{t(lang, L.click)}</small>
        </a>
      </div>
    </div>
  );
}
