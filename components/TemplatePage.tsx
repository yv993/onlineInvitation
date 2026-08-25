import Link from "next/link";
import Motion from "./Motion";
import Plate from "./Plate";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import StyleDetail from "./StyleDetail";
import { svc } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { stylePlates } from "@/lib/photos";
import type { InvStyle } from "@/lib/styles";

// /templates/[id] — one style, at length: its plate, its measured facts, what
// it carries, the price, a live preview in a phone frame, and the two CTAs.
// The same StyleDetail the showcase modal renders.
export default function TemplatePage({ lang, s }: { lang: Lang; s: InvStyle }) {
  const base = lang === "hy" ? "" : "/en";
  const plate = stylePlates[s.id];
  return (
    <div className="kn-svc" data-inv-page={s.id}>
      <SiteNav lang={lang} onLanding={false} sub={`/templates/${s.id}`} />
      <Motion />
      <div className="kn-back" aria-hidden="true" />
      <main className="kn-main" id="card">
        <section className="kn-band kn-svc__pageTop">
          <div className="kn-col">
            <Link className="kn-tpl__back" href={`${base}/#styles`} data-rise>
              {t(lang, svc.template.back)}
            </Link>
            <div className="kn-tpl">
              <div className="kn-tpl__plate" data-rise>
                <Plate img={plate.img} alt={t(lang, plate.alt)} sizes="(max-width: 900px) 92vw, 46vw" ratio="4 / 5" priority zoom drift={0.06} />
              </div>
              <div className="kn-tpl__body" data-rise>
                <p className="kn-label">{t(lang, svc.template.kicker)}</p>
                <StyleDetail lang={lang} s={s} />
              </div>
            </div>

            <div className="kn-tpl__live" data-rise>
              <p className="kn-flow__phoneT">{t(lang, svc.template.preview)}</p>
              <div className="kn-build__bezel">
                <iframe className="kn-build__frame" src={`${base}/i/${s.id}`} title={t(lang, svc.template.preview)} loading="lazy" />
              </div>
              <Link className="kn-btn" href={`${base}/order?style=${s.id}`}>
                {t(lang, svc.template.order)}
              </Link>
            </div>
          </div>
        </section>
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
