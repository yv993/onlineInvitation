import Link from "next/link";
import Icon from "./Icon";
import { landing, svc } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { styles } from "@/lib/styles";

// ============================================================================
// THE FOOTER — quick links, contact, social icons, copyright.
//
// The contact and social fields in content.ts are EMPTY on purpose. This is a
// demonstration service with no real phone yet, and a footer that prints a
// made-up number is a footer that lies to the first person who dials it. The
// component renders only what exists and says "through the order form"
// otherwise; the day real details land in content.ts, the columns fill.
// ============================================================================

export default function SiteFooter({ lang }: { lang: Lang }) {
  const base = lang === "hy" ? "" : "/en";
  const f = svc.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="kn-sfoot">
      <div className="kn-col kn-sfoot__grid">
        <div className="kn-sfoot__brand">
          <p className="kn-nav__mark">ԿՆԻՔ</p>
          <p className="kn-sfoot__tag">{t(lang, svc.foot.line)}</p>
          <p className="kn-sfoot__sample">{t(lang, svc.foot.sample)}</p>
        </div>

        <div>
          <p className="kn-sfoot__h">{t(lang, f.quick)}</p>
          <ul className="kn-sfoot__list">
            {/* the landing's sections moved on 2026-08-23: examples replaced
                the style showcase, and the prices now ride the example cards */}
            <li>
              <a href={`${base}/#examples`}>{t(lang, landing.nav.examples)}</a>
            </li>
            {styles.map((s) => (
              <li key={s.id}>
                <Link href={`${base}/templates/${s.id}`}>{t(lang, s.name)}</Link>
              </li>
            ))}
            <li>
              <Link href={`${base}/wedding-cards`}>{lang === "hy" ? "Հարսանեկան քարտեր" : "Wedding cards"}</Link>
            </li>
            <li>
              <Link href={`${base}/wedding-live`}>{lang === "hy" ? "Կայք-հրավերի շարժիչ" : "Web-invitation engine"}</Link>
            </li>
            <li>
              <Link href={`${base}/kids`}>{lang === "hy" ? "Մանկական քարտեր" : "Kids' cards"}</Link>
            </li>
            <li>
              <a href={`${base}/order`}>{t(lang, svc.nav.pricing)}</a>
            </li>
            <li>
              <Link href={`${base}/order`}>{t(lang, svc.nav.order)}</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="kn-sfoot__h">{t(lang, f.contact)}</p>
          <ul className="kn-sfoot__list">
            {f.phone && (
              <li>
                <a href={`tel:${f.phone.replace(/\s+/g, "")}`}>
                  <Icon name="phone" size={16} /> {f.phone}
                </a>
              </li>
            )}
            {f.email && (
              <li>
                <a href={`mailto:${f.email}`}>
                  <Icon name="mail" size={16} /> {f.email}
                </a>
              </li>
            )}
            {!f.phone && !f.email && (
              <li>
                <Link href={`${base}/order`}>
                  <Icon name="mail" size={16} /> {t(lang, f.contactVia)}
                </Link>
              </li>
            )}
          </ul>

          {f.socials.length > 0 && (
            <>
              <p className="kn-sfoot__h" style={{ marginTop: "1.2rem" }}>
                {t(lang, f.follow)}
              </p>
              <div className="kn-sfoot__soc">
                {f.socials.map((s) => (
                  <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.id}>
                    <Icon name={s.id} size={20} />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="kn-col kn-sfoot__bar">
        <span>
          © {year} ԿՆԻՔ · {t(lang, f.rights)}
        </span>
        <span>hy · en</span>
      </div>
    </footer>
  );
}
