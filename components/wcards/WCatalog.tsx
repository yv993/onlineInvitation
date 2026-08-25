"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { wcards as C, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { wCards, wCollections, wColors, wFeatures, wShapes, wStyles, type WCard, type WColor, type WFeature, type WPhotos, type WShape, type WStyle } from "@/lib/wcards";
import WTile from "./WTile";

// ============================================================================
// THE CATALOGUE — /wedding-cards. The reference's «Filter By» panel, measured:
// Styles · Colour (swatches) · Photos (all / 1 / 2 / 3+ / none) · Shape ·
// Features · Collections, plus search and a result count; tiles show the
// front and turn to the back on hover; colour dots switch the variant. And
// what the reference does with a photo, this does with the NAMES: type them
// once and every card on the page wears them.
// ============================================================================

export default function WCatalog({ lang, initial }: { lang: Lang; initial?: { style?: string; collection?: string } }) {
  const base = lang === "hy" ? "" : "/en";
  const [styles, setStyles] = useState<Set<WStyle>>(() => new Set(initial?.style && wStyles.some((s) => s.id === initial.style) ? [initial.style as WStyle] : []));
  const [colors, setColors] = useState<Set<WColor>>(new Set());
  const [photos, setPhotos] = useState<"all" | "1" | "2" | "3" | "none">("all");
  const [shape, setShape] = useState<WShape | "">("");
  const [features, setFeatures] = useState<Set<WFeature>>(new Set());
  const [collection, setCollection] = useState<string>(initial?.collection ?? "");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [variantIx, setVariantIx] = useState<Record<string, number>>({});

  useEffect(() => { try { const r = sessionStorage.getItem("kniq.wcards.preview"); if (r) { const s = JSON.parse(r) as { a?: string; b?: string }; setA(s.a ?? ""); setB(s.b ?? ""); } } catch {} }, []);
  useEffect(() => { try { sessionStorage.setItem("kniq.wcards.preview", JSON.stringify({ a, b })); } catch {} }, [a, b]);

  const toggle = <K,>(set: React.Dispatch<React.SetStateAction<Set<K>>>, k: K) => set((cur) => { const n = new Set(cur); if (n.has(k)) n.delete(k); else n.add(k); return n; });

  const list = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return wCards.filter((c) => {
      for (const s of styles) if (!c.styles.includes(s)) return false;
      if (colors.size && !c.variants.some((v) => colors.has(v.id))) return false;
      if (photos !== "all") {
        const p: WPhotos = c.photos;
        if (photos === "none" && p !== 0) return false;
        if (photos === "1" && p !== 1) return false;
        if (photos === "2" && p !== 2) return false;
        if (photos === "3" && p < 3) return false;
      }
      if (shape && c.shape !== shape) return false;
      for (const f of features) if (!c.features.includes(f)) return false;
      if (collection && c.collection !== collection) return false;
      if (words.length) {
        const hay = [t("hy", c.name), t("en", c.name), t("hy", c.desc), t("en", c.desc), ...c.tags, ...c.styles, c.collection].join(" ").toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }, [styles, colors, photos, shape, features, collection, q]);

  // a colour filter should show the matching colourway on the tile
  const variantFor = (c: WCard) => {
    const ix = variantIx[c.id];
    if (ix !== undefined) return c.variants[ix] ?? c.variants[0];
    if (colors.size) { const v = c.variants.find((x) => colors.has(x.id)); if (v) return v; }
    return c.variants[0];
  };
  const active = styles.size + colors.size + features.size + (photos !== "all" ? 1 : 0) + (shape ? 1 : 0) + (collection ? 1 : 0);

  return (
    <div className="kn-wcat">
      <div className="kn-kids__bar">
        <div className="kn-kids__pv">
          <span className="kn-kids__pvL"><Icon name="seal" size={16} /> {t(lang, C.previewWith)}</span>
          <input className="kn-f__in kn-kids__in" value={a} onChange={(e) => setA(e.target.value)} placeholder={t(lang, C.nameA)} maxLength={30} aria-label={t(lang, C.nameA)} />
          <input className="kn-f__in kn-kids__in" value={b} onChange={(e) => setB(e.target.value)} placeholder={t(lang, C.nameB)} maxLength={30} aria-label={t(lang, C.nameB)} />
        </div>
        <label className="kn-kids__search"><Icon name="globe" size={16} /><input className="kn-f__in kn-kids__in" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, C.search)} aria-label={t(lang, C.search)} /></label>
      </div>

      <div className="kn-kids__body">
        <aside className="kn-kids__rail" aria-label={t(lang, C.styles)} data-lenis-prevent>
          <p className="kn-wcat__filtersH">{active} {lang === "hy" ? "զտիչ" : "filters"}</p>
          <details className="kn-kids__grp" open>
            <summary>{t(lang, C.styles)}</summary>
            <div className="kn-kids__chips">
              <button type="button" className="kn-kids__chip" aria-pressed={styles.size === 0} onClick={() => setStyles(new Set())}>{t(lang, C.all)}</button>
              {wStyles.map((s) => <button key={s.id} type="button" className="kn-kids__chip" aria-pressed={styles.has(s.id)} onClick={() => toggle(setStyles, s.id)}>{t(lang, s.label)}</button>)}
            </div>
          </details>
          <details className="kn-kids__grp" open>
            <summary>{t(lang, C.colors)}{colors.size ? ` (${colors.size})` : ""}</summary>
            <div className="kn-wcat__swatches" role="group" aria-label={t(lang, C.colors)}>
              {wColors.map((c) => (
                <button key={c.id} type="button" className="kn-wcat__sw" aria-pressed={colors.has(c.id)} aria-label={t(lang, c.label)} title={t(lang, c.label)} style={{ "--sw": c.swatch } as React.CSSProperties} onClick={() => toggle(setColors, c.id)} />
              ))}
            </div>
          </details>
          <details className="kn-kids__grp">
            <summary>{t(lang, C.photos)}</summary>
            <div className="kn-kids__chips">
              {([["all", C.photoAll], ["1", C.photo1], ["2", C.photo2], ["3", C.photo3], ["none", C.photoNone]] as const).map(([k, lbl]) => (
                <button key={k} type="button" className="kn-kids__chip" aria-pressed={photos === k} onClick={() => setPhotos(k)}>{t(lang, lbl)}</button>
              ))}
            </div>
          </details>
          <details className="kn-kids__grp">
            <summary>{t(lang, C.shape)}</summary>
            <div className="kn-kids__chips">
              <button type="button" className="kn-kids__chip" aria-pressed={shape === ""} onClick={() => setShape("")}>{t(lang, C.all)}</button>
              {wShapes.map((s) => <button key={s.id} type="button" className="kn-kids__chip" aria-pressed={shape === s.id} onClick={() => setShape(shape === s.id ? "" : s.id)}>{t(lang, s.label)}</button>)}
            </div>
          </details>
          <details className="kn-kids__grp">
            <summary>{t(lang, C.features)}</summary>
            <div className="kn-kids__chips">
              {wFeatures.map((f) => <button key={f.id} type="button" className="kn-kids__chip" aria-pressed={features.has(f.id)} onClick={() => toggle(setFeatures, f.id)}>{t(lang, f.label)}</button>)}
            </div>
          </details>
          <details className="kn-kids__grp" open>
            <summary>{t(lang, C.collections)}</summary>
            <div className="kn-wcat__cols">
              {wCollections.map((c) => (
                <button key={c.id} type="button" className="kn-wcat__col" aria-pressed={collection === c.id} onClick={() => setCollection(collection === c.id ? "" : c.id)}>
                  <b>{t(lang, c.label)}</b><small>{t(lang, c.blurb)}</small>
                </button>
              ))}
            </div>
          </details>
          {(active > 0 || q) && <button type="button" className="kn-kids__clear" onClick={() => { setStyles(new Set()); setColors(new Set()); setPhotos("all"); setShape(""); setFeatures(new Set()); setCollection(""); setQ(""); }}>{t(lang, C.clear)}</button>}
        </aside>

        <div className="kn-kids__main">
          <p className="kn-kids__count" role="status">{list.length} {t(lang, C.results)}</p>
          {list.length === 0 && <p className="kn-kids__none">{t(lang, C.none)}</p>}
          <ul className="kn-kids__grid kn-wcat__grid">
            {list.map((c, i) => {
              const v = variantFor(c);
              const href = `${base}/wedding-cards/${c.id}?v=${v.id}`;
              return (
                <li key={c.id} className="kn-kids__it" style={{ "--i": i } as React.CSSProperties}>
                  <Link href={href} className="kn-kids__tileLink" aria-label={`${t(lang, c.name)}`}>
                    <WTile card={c} variant={v} lang={lang} face={{ a: a || undefined, b: b || undefined }} />
                  </Link>
                  <div className="kn-kids__meta">
                    {c.features.includes("backside") && <span className="kn-wcat__flag">{t(lang, C.backside)}</span>}
                    <Link href={href} className="kn-kids__name">{t(lang, c.name)}</Link>
                    <span className="kn-kids__by">{t(lang, c.by)}</span>
                    {c.variants.length > 1 && (
                      <span className="kn-kids__dots" role="radiogroup" aria-label={t(lang, C.colorway)}>
                        {c.variants.map((vv, j) => (
                          <button key={vv.id} type="button" role="radio" aria-checked={vv.id === v.id} aria-label={t(lang, vv.label)} className="kn-kids__dot" style={{ "--d1": vv.paper, "--d2": vv.a } as React.CSSProperties} onClick={() => setVariantIx((cur) => ({ ...cur, [c.id]: j }))} />
                        ))}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
