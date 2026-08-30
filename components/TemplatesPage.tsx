"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import { Qr } from "@/components/customizer/LinkPanel";
import { categories, templates, type Category } from "@/lib/templates";
import { findExample, priceLabel, tierName } from "@/lib/examples";
import { phoneStrips } from "@/lib/phoneStrips";
import { phoneShots } from "@/lib/phoneShots";
import { useTiltGrid } from "@/components/ui/useTiltGrid";
import { examples as EX, tplPage as C, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// /templates — the catalogue page, after the reference's flow (2026-08-27):
// a grid of tall cards (each wearing its template's REAL captured strip),
// New/Hot ribbons, and a CHOOSER window per card — the description, the
// tags, the features, a QR that opens the live demo on a phone, and the two
// verbs: CHOOSE THIS TEMPLATE (→ the editor, that template picked) and
// PREVIEW (→ the demo page itself).
// ============================================================================

const NEW_IDS = new Set(["wedding-4", "wedding-5", "wedding-6", "wedding-7", "wedding-8"]);
const HOT_IDS = new Set(["wedding-1", "wedding-2"]);

export default function TemplatesPage({ lang }: { lang: Lang }) {
  const base = lang === "hy" ? "" : "/en";
  const [open, setOpen] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // EVERY OCCASION, not just the two (2026-08-29). This page filtered to
  // wedding + engagement, which left the five birthday, three christening and
  // three corporate templates with NO route in from anywhere on the site:
  // TemplateGrid — the component that used to browse all of them — lives only
  // in ServiceHomeFull.tsx, which nothing renders. Their demo pages answered
  // 200 and sat in the sitemap, so this morning's SEO work was publishing
  // eleven orphan pages: indexable, in the sitemap, and linked from nothing,
  // which is the shape search engines discount hardest.
  const [cat, setCat] = useState<Category | "all">("all");
  const list = cat === "all" ? templates : templates.filter((tp) => tp.category === cat);
  // one listener for the whole grid — see useTiltGrid on why not twenty TiltCards
  const grid = useTiltGrid<HTMLUListElement>(".kn-tpls__card");

  // the window traps Escape and locks the page scroll while it stands
  useEffect(() => {
    if (!open) return;
    const was = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => { document.documentElement.style.overflow = was; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const sel = open ? templates.find((tp) => tp.id === open) : null;
  const selEx = open ? findExample(open) : undefined;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <main className="kn-main kn-tpls" id="card">
      <section className="kn-band">
        <div className="kn-col">
          <h1 className="kn-h2 kn-tpls__h" data-rise>{t(lang, C.title)}</h1>
          <p className="kn-lead kn-tpls__lead" data-rise>{t(lang, C.lead)}</p>
          <p className="kn-tpls__note" data-rise>{t(lang, C.switchNote)}</p>

          {/* the occasions, counted off the registry so a new template never
              leaves a tab claiming the old number */}
          <div className="kn-tpls__tabs" role="tablist" aria-label={t(lang, C.title)} data-rise>
            {categories.map((c) => {
              const n = c.id === "all" ? templates.length : templates.filter((x) => x.category === c.id).length;
              if (!n) return null;
              const on = cat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={`kn-chip kn-tpls__tab${on ? " is-on" : ""}`}
                  onClick={() => setCat(c.id)}
                >
                  {t(lang, c.label)} <small>{n}</small>
                </button>
              );
            })}
          </div>

          <ul className="kn-tpls__grid" ref={grid}>
            {list.map((tp, i) => (
              <li key={tp.id} data-rise style={{ "--i": i % 6 } as React.CSSProperties}>
                <button type="button" className="kn-tpls__card" onClick={() => setOpen(tp.id)}>
                  {(NEW_IDS.has(tp.id) || HOT_IDS.has(tp.id)) && (
                    <span className={`kn-tpls__badge${HOT_IDS.has(tp.id) ? " kn-tpls__badge--hot" : ""}`}>
                      {HOT_IDS.has(tp.id) ? t(lang, C.hot) : t(lang, C.fresh)}
                    </span>
                  )}
                  <span className="kn-tpls__shot">
                    <Image src={phoneStrips[tp.id] ?? phoneShots[tp.id] ?? tp.cover} alt="" fill sizes="(max-width: 700px) 46vw, 240px" draggable={false} />
                  </span>
                  <span className="kn-tpls__cap">
                    <b>{t(lang, tp.name)}</b>
                    <small>{tp.tags.slice(0, 2).join(" · ")}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ THE CHOOSER WINDOW */}
      {sel && (
        <div className="kn-exd kn-tpls__win" role="dialog" aria-modal="true" aria-labelledby="kn-tplw-t">
          <div className="kn-exd__back" onClick={() => setOpen(null)} />
          <div className="kn-exd__box kn-tpls__box">
            <button ref={closeRef} type="button" className="kn-exd__x" aria-label={t(lang, EX.close)} onClick={() => setOpen(null)}><Icon name="x" size={18} /></button>
            <div className="kn-tpls__winGrid">
              <div className="kn-tpls__winShot">
                <Image src={phoneStrips[sel.id] ?? phoneShots[sel.id] ?? sel.cover} alt="" fill sizes="300px" draggable={false} />
              </div>
              <div className="kn-tpls__winBody">
                <h2 className="kn-tpls__winT" id="kn-tplw-t">{t(lang, sel.name)}</h2>
                <p className="kn-tpls__winD">{t(lang, sel.tagline)}</p>
                <p className="kn-tpls__tags">{sel.tags.slice(0, 4).map((x) => <span key={x}>{x}</span>)}</p>
                {selEx && (
                  <>
                    <p className="kn-label">{t(lang, C.features)}</p>
                    <ul className="kn-tpls__feats">
                      {selEx.features.slice(0, 8).map((f) => (
                        <li key={f}><Icon name="check" size={12} /> {t(lang, EX.feats[f])}</li>
                      ))}
                    </ul>
                    <p className="kn-tpls__price">{priceLabel(selEx)} <small>· {t(lang, tierName(selEx.tier))} · {t(lang, EX.terms)}</small></p>
                  </>
                )}
                <div className="kn-tpls__qrRow">
                  <span className="kn-tpls__qr"><Qr text={`${origin}${base}/invitations/${sel.id}`} /></span>
                  <small>{t(lang, C.qrNote)}</small>
                </div>
                <div className="kn-tpls__acts">
                  <Link className="kn-btn" href={`${base}/edit?tpl=${sel.id}`}><Icon name="check" size={14} /> {t(lang, C.choose)}</Link>
                  <Link className="kn-btn kn-btn--ghost" href={`${base}/invitations/${sel.id}`} target="_blank" rel="noopener">{t(lang, C.previewBtn)}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
