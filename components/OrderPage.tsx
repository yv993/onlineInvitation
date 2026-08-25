import Motion from "./Motion";
import OrderFlow from "./OrderFlow";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import { occasions, svc } from "@/lib/content";
import type { Lang, Occasion } from "@/lib/content";
import { t } from "@/lib/i18n";
import { styles } from "@/lib/styles";
import type { InvStyle } from "@/lib/styles";

// /order — the same three-step flow as the landing's section 5, on its own
// route so a category card, a pricing tier or a template page can land the
// couple straight in it with the style and occasion preselected.
export default function OrderPage({
  lang,
  style,
  occasion,
}: {
  lang: Lang;
  style?: string;
  occasion?: string;
}) {
  const st = (styles.some((s) => s.id === style) ? style : "kniq") as InvStyle["id"];
  const oc = (occasion && occasion in occasions ? occasion : "wedding") as Occasion;
  return (
    <div className="kn-svc">
      <SiteNav lang={lang} onLanding={false} sub="/order" />
      <Motion />
      <div className="kn-back" aria-hidden="true" />
      <main className="kn-main" id="card">
        <section className="kn-band kn-svc__buildBand kn-svc__pageTop">
          <div className="kn-col">
            <div style={{ textAlign: "center" }}>
              <p className="kn-label" data-rise>
                {t(lang, svc.nav.order)}
              </p>
              <h1 className="kn-h2" data-rise>
                {t(lang, svc.flow.title)}
              </h1>
              <p className="kn-lead" style={{ marginInline: "auto", marginTop: "0.8rem" }} data-rise>
                {t(lang, svc.flow.lead)}
              </p>
            </div>
            <OrderFlow lang={lang} initialStyle={st} initialOccasion={oc} />
          </div>
        </section>
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
