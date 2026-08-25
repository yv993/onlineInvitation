import Link from "next/link";
import Motion from "./Motion";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import Icon from "./Icon";
import WCatalog from "./wcards/WCatalog";
import CardWheel from "./wcards/CardWheel";
import WMotifSprite from "./wcards/WMotifs";
import { wcards as C } from "@/lib/content";
import { wCards } from "@/lib/wcards";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// /wedding-cards — the wedding card catalogue (see lib/wcards.ts for what was
// measured on the reference and what was drawn fresh). The "three ways to
// invite" strip names the card way (this), the web way (the templates) and
// the video way (next).
export default function WCardsPage({ lang, style, collection }: { lang: Lang; style?: string; collection?: string }) {
  const base = lang === "hy" ? "" : "/en";
  return (
    <div className="kn-svc kn-svc--kids kn-svc--wcards">
      <SiteNav lang={lang} onLanding={false} sub="/wedding-cards" />
      <Motion />
      <WMotifSprite />
      <div className="kn-back" aria-hidden="true" />
      <main className="kn-main" id="card">
        <section className="kn-band kn-svc__pageTop kn-kids__band">
          <div className="kn-col">
            <div className="kn-kids__intro">
              <p className="kn-label" data-rise>{t(lang, C.kicker)}</p>
              <h1 className="kn-h2" data-rise>{t(lang, C.title)}</h1>
              <p className="kn-lead" data-rise>{t(lang, C.lead)}</p>
              <ul className="kn-ways" data-rise aria-label={t(lang, C.ways)}>
                <li className="kn-ways__it" aria-current="page"><Icon name="mail" size={16} /> <b>{t(lang, C.wayCard)}</b></li>
                <li className="kn-ways__it"><Link href={`${base}/wedding-live`}><Icon name="globe" size={16} /> {t(lang, C.wayWeb)}</Link></li>
                <li className="kn-ways__it kn-ways__it--soon"><Icon name="film" size={16} /> {t(lang, C.wayVideo)} <small>{t(lang, C.waySoon)}</small></li>
              </ul>
            </div>
            {/* the wheel first — the ten most-chosen designs riding a buried
                circle the scroll turns — then the full catalogue to dig in */}
            <CardWheel lang={lang} cards={wCards.filter((c) => c.popular).slice(0, 10)} />
            <WCatalog lang={lang} initial={{ style, collection }} />
          </div>
        </section>
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
