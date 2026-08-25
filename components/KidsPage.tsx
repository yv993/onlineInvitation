import Motion from "./Motion";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import KidsCatalog from "./kids/KidsCatalog";
import MotifSprite from "./kids/Motifs";
import { kids as K } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// /kids — the kids' birthday card catalogue (see lib/kids.ts for what was
// absorbed from the reference and what was drawn fresh).
export default function KidsPage({ lang, facet }: { lang: Lang; facet?: string }) {
  return (
    <div className="kn-svc kn-svc--kids">
      <SiteNav lang={lang} onLanding={false} sub="/kids" />
      <Motion />
      <MotifSprite />
      <div className="kn-back" aria-hidden="true" />
      <main className="kn-main" id="card">
        <section className="kn-band kn-svc__pageTop kn-kids__band">
          <div className="kn-col">
            <div className="kn-kids__intro">
              <p className="kn-label" data-rise>{t(lang, K.kicker)}</p>
              <h1 className="kn-h2" data-rise>{t(lang, K.title)}</h1>
              <p className="kn-lead" data-rise>{t(lang, K.lead)}</p>
            </div>
            <KidsCatalog lang={lang} initialFacet={facet} />
          </div>
        </section>
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
