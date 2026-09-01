import Plate from "@/components/Plate";
import { t } from "@/lib/i18n";
import { stampFromIso, weekdayFromIso } from "@/lib/draft";
import type { Lang, T } from "@/lib/content";
import type { TemplateSpec } from "@/lib/templates";

/** the copy this hero owns — the postcard's own turns of phrase */
const L = {
  day: { hy: "Հարսանեկան օր", en: "Wedding day", ru: "День свадьбы" } as T,
  dear: { hy: "Սիրելի՛ հարազատներ և ընկերներ", en: "Dear family and friends", ru: "Дорогие родные и друзья" } as T,
  withLove: { hy: "Սիրով՝", en: "With love,", ru: "С любовью," } as T,
};

/** The POSTCARD hero (wedding-10 «Բացիկ», from the client's 2026-08-31
 *  reference): script names over a tracked kicker, the photograph full-width,
 *  the date held between two hairlines, then the welcome note that signs
 *  itself «with love» — one warm column, nothing else. */
export default function PostcardHero({ lang, a, b, iso, kicker, photo, photoAlt, invite, time, embed }: {
  lang: Lang;
  a: string;
  b: string;
  iso: string;
  kicker: T;
  photo: TemplateSpec["cover"] | string;
  photoAlt: string;
  invite?: T;
  /** the first stop's hour, already on the editor's clock face */
  time?: string;
  embed?: boolean;
}) {
  // an embed is a guest, not a page — it must not plant its own <h1>
  const H = embed ? ("div" as const) : ("h1" as const);
  const names = b ? `${a} & ${b}` : a;
  return (
    <div className="kn-post" data-rise>
      <H className="kn-post__names">{names}</H>
      <p className="kn-post__kicker" data-track>~ {t(lang, kicker)} ~</p>

      <div className="kn-post__photo" data-rise data-reveal>
        <Plate img={photo} alt={photoAlt} sizes="(max-width: 900px) 92vw, 460px" ratio="4 / 5" priority={!embed} zoom drift={0.05} />
      </div>

      <p className="kn-post__label" data-rise>{t(lang, L.day)}</p>
      <div className="kn-post__band" data-rise>
        <b>{stampFromIso(iso)}</b>
        <span>{t(lang, weekdayFromIso(iso))}{time ? ` · ${time}` : ""}</span>
      </div>

      {invite && (
        <div className="kn-post__msg" data-rise>
          <span className="kn-post__heart" aria-hidden="true">♡</span>
          <p className="kn-post__dear">{t(lang, L.dear)}</p>
          <p className="kn-post__note">{t(lang, invite)}</p>
          <p className="kn-post__with">{t(lang, L.withLove)}</p>
          <p className="kn-post__sign">{names}</p>
        </div>
      )}
    </div>
  );
}
