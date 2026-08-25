import Link from "next/link";
import Icon from "./Icon";
import { svc } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { formatAmd } from "@/lib/styles";
import type { InvStyle } from "@/lib/styles";

// The style's facts, shared by the showcase's detail modal and by
// /templates/[id] — one source, so the modal and the page can never disagree.
export default function StyleDetail({
  lang,
  s,
  compact = false,
}: {
  lang: Lang;
  s: InvStyle;
  compact?: boolean;
}) {
  const base = lang === "hy" ? "" : "/en";
  return (
    <div className="kn-sd">
      <p className="kn-svc__catMood">{t(lang, s.mood)}</p>
      <h3 className="kn-sd__name">{t(lang, s.name)}</h3>
      <p className="kn-sd__blurb">{t(lang, s.blurb)}</p>

      <div className="kn-sd__row">
        <div>
          <p className="kn-sd__h">{t(lang, svc.showcase.palette)}</p>
          <div className="kn-sd__sw" aria-hidden="true">
            {s.swatch.map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </div>
          <p className="kn-sd__h" style={{ marginTop: "0.9rem" }}>
            {t(lang, svc.showcase.measured)}
          </p>
          <ul className="kn-sd__list">
            {s.facts.map((f, i) => (
              <li key={i}>
                <Icon name="check" size={16} />
                {t(lang, f)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kn-sd__h">{t(lang, svc.showcase.included)}</p>
          <ul className="kn-sd__list">
            {s.includes.map((f, i) => (
              <li key={i}>
                <Icon name="check" size={16} />
                {t(lang, f)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="kn-sd__price">
        {t(lang, svc.catalog.fromWord)} <b>{formatAmd(s.from)}</b> · {t(lang, svc.catalog.bothLangs)}
      </p>

      <p className="kn-sd__acts">
        <Link className="kn-btn" href={`${base}/order?style=${s.id}`}>
          {t(lang, svc.showcase.chooseThis)}
        </Link>
        <Link className="kn-btn kn-btn--ghost" href={`${base}/i/${s.id}`}>
          {t(lang, svc.showcase.openSample)}
        </Link>
        {compact && (
          <Link className="kn-sd__more" href={`${base}/templates/${s.id}`}>
            {t(lang, svc.showcase.fullPage)} <Icon name="arrow" size={16} />
          </Link>
        )}
      </p>
    </div>
  );
}
