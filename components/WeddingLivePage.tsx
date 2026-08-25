import Motion from "./Motion";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import LiveShowcase from "./invitations/LiveShowcase";
import WeddingExamples from "./invitations/WeddingExamples";
import { live as C } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// /wedding-live — the multi-template engine's showcase (in the wedding part).
export default function WeddingLivePage({ lang, style }: { lang: Lang; style?: string }) {
  return (
    <div className="kn-svc kn-svc--kids kn-svc--live">
      <SiteNav lang={lang} onLanding={false} sub="/wedding-live" />
      <Motion />
      <div className="kn-back" aria-hidden="true" />
      <main className="kn-main" id="card">
        <section className="kn-band kn-svc__pageTop kn-kids__band">
          <div className="kn-col">
            <div className="kn-kids__intro">
              <p className="kn-label" data-rise>{t(lang, C.kicker)}</p>
              <h1 className="kn-h2" data-rise>{t(lang, C.title)}</h1>
              <p className="kn-lead" data-rise>{t(lang, C.lead)}</p>
            </div>
            <LiveShowcase lang={lang} initial={style} />
          </div>
        </section>
        {/* the card grid under the wedding topic — every example, its own window */}
        <section className="kn-band kn-kids__band kn-exw__band">
          <div className="kn-col">
            <WeddingExamples lang={lang} />
          </div>
        </section>
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
