import Motion from "./Motion";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import EventWizard from "./customizer/EventWizard";
import WMotifSprite from "./wcards/WMotifs";
import { occasions, wizard } from "@/lib/content";
import type { Lang, Occasion } from "@/lib/content";
import { t } from "@/lib/i18n";

// /customize — the step-by-step wizard with five live previews. A category
// card on the landing lands here with ?category=<occasion> preselected.
export default function CustomizePage({ lang, category, tpl }: { lang: Lang; category?: string; tpl?: string }) {
  const oc = category && category in occasions ? (category as Occasion) : undefined;
  return (
    <div className="kn-svc kn-svc--wz">
      <SiteNav lang={lang} onLanding={false} sub="/customize" />
      <Motion />
      {/* the wedding cards in the example picker draw from this sprite */}
      <WMotifSprite />
      <div className="kn-back" aria-hidden="true" />
      <main className="kn-main" id="card">
        <section className="kn-band kn-svc__pageTop kn-wz__band">
          <div className="kn-col">
            <div className="kn-wz__intro">
              <p className="kn-label" data-rise>{t(lang, wizard.kicker)}</p>
              <h1 className="kn-h2" data-rise>{t(lang, wizard.title)}</h1>
              <p className="kn-lead" data-rise>{t(lang, wizard.lead)}</p>
            </div>
            <EventWizard lang={lang} initialCategory={oc} initialTpl={tpl} />
          </div>
        </section>
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
