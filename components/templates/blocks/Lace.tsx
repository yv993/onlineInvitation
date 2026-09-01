import Plate from "@/components/Plate";
import { t } from "@/lib/i18n";
import { stampFromIso, weekdayFromIso } from "@/lib/draft";
import type { Lang, T } from "@/lib/content";
import type { TemplateSpec } from "@/lib/templates";

/** the copy this hero owns */
const L = {
  invitation: { hy: "Հարսանեկան հրավեր", en: "Wedding invitation", ru: "Свадебное приглашение" } as T,
};

/** THE LACE FRAME (wedding-13 «Ժանյակ», the client's 2026-08-31 mockup):
 *  a gold lace run down all four edges of the reading window. It is a
 *  background, so it tiles to any height and never costs a request per
 *  edge; it sits above the page but takes no pointer. */
export function LaceFrame() {
  return (
    <div className="kn-lace" aria-hidden="true">
      <span className="kn-lace__e kn-lace__e--t" />
      <span className="kn-lace__e kn-lace__e--b" />
      <span className="kn-lace__e kn-lace__e--l" />
      <span className="kn-lace__e kn-lace__e--r" />
    </div>
  );
}

/** THE RIBBON HERO (wedding-13): the gold vine crown, the ruled
 *  «WEDDING INVITATION» line, the names in script, and the portrait in a
 *  double gold frame with the day printed beneath it. */
export function RibbonHero({ lang, a, b, kicker, iso, time, photo, photoAlt, invite, city, embed }: {
  lang: Lang;
  a: string;
  b: string;
  kicker: T;
  iso: string;
  time?: string;
  photo: TemplateSpec["cover"] | string;
  photoAlt: string;
  invite?: T;
  city: string;
  embed?: boolean;
}) {
  // an embed is a guest, not a page — it must not plant its own <h1>
  const H = embed ? ("div" as const) : ("h1" as const);
  const names = b ? `${a} & ${b}` : a;
  return (
    <div className="kn-rib" data-rise>
      <span className="kn-rib__vine" aria-hidden="true" />

      <p className="kn-rib__banner" data-track>
        <span>{t(lang, kicker) || t(lang, L.invitation)}</span>
      </p>
      <H className="kn-rib__names">{names}</H>

      <div className="kn-rib__portrait" data-rise data-reveal>
        <Plate img={photo} alt={photoAlt} sizes="(max-width: 900px) 88vw, 420px" ratio="4 / 3" priority={!embed} zoom drift={0.05} />
      </div>

      <p className="kn-rib__date">
        <span>{t(lang, weekdayFromIso(iso))}, {stampFromIso(iso)}</span>
        {time && <b>{time}</b>}
        {city && <i>{city}</i>}
      </p>

      {invite && <p className="kn-rib__lede">{t(lang, invite)}</p>}
    </div>
  );
}

/** the hanging bows, strung between two sections (the client's own art) */
export function BowString() {
  return <span className="kn-bows" aria-hidden="true" data-rise />;
}

/** the closing lock: the baroque keyhole with its key beside it, over the
 *  vine-and-heart crown — the mockup's last ornament before the names */
export function LockClose() {
  return (
    <div className="kn-lock" aria-hidden="true" data-rise>
      <span className="kn-lock__hole" />
      <span className="kn-lock__key" />
    </div>
  );
}

/** the vine crown with a heart at its centre — a divider */
export function VineHeart() {
  return <span className="kn-vineheart" aria-hidden="true" data-rise />;
}
