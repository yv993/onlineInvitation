"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { kids as K, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { cardFacets, kidsAudiences, kidsCards, kidsMilestones, kidsShapes, kidsThemes, sampleKids, type KidsFacet, type KidsShape } from "@/lib/kids";
import KidsTile from "./KidsTile";

// ============================================================================
// THE CATALOGUE — /kids. The reference's grid, measured: a facet rail
// (explore · milestones · themes · shape), a search box, a result count, and
// tiles with colourway dots. One thing the reference does with a photo, this
// does with a NAME: type the child's name and age once and every tile on the
// page re-renders wearing it — the card is already becoming the invitation
// before it is even opened.
// ============================================================================

export default function KidsCatalog({ lang, initialFacet }: { lang: Lang; initialFacet?: string }) {
  const base = lang === "hy" ? "" : "/en";
  const [facets, setFacets] = useState<Set<KidsFacet>>(() => new Set(initialFacet && isFacet(initialFacet) ? [initialFacet] : []));
  const [shape, setShape] = useState<KidsShape | "">("");
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [variantIx, setVariantIx] = useState<Record<string, number>>({});

  // remember the preview name across the catalogue → studio hop
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kniq.kids.preview");
      if (raw) { const s = JSON.parse(raw) as { name?: string; age?: string }; if (s.name) setName(s.name); if (s.age) setAge(s.age); }
    } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem("kniq.kids.preview", JSON.stringify({ name, age })); } catch {}
  }, [name, age]);

  const toggle = (f: KidsFacet) => setFacets((cur) => { const n = new Set(cur); if (n.has(f)) n.delete(f); else n.add(f); return n; });

  const list = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return kidsCards.filter((c) => {
      const cf = cardFacets(c);
      for (const f of facets) if (!cf.includes(f)) return false;
      if (shape && c.shape !== shape) return false;
      if (words.length) {
        const hay = [t("hy", c.name), t("en", c.name), ...c.tags, ...cf].join(" ").toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }, [facets, shape, q]);

  const ageN = age ? Number(age) : undefined;
  const chip = (id: KidsFacet, label: string) => (
    <button key={id} type="button" className="kn-kids__chip" aria-pressed={facets.has(id)} onClick={() => toggle(id)}>{label}</button>
  );

  return (
    <div className="kn-kids">
      {/* the preview-with-a-name bar */}
      <div className="kn-kids__bar">
        <div className="kn-kids__pv">
          <span className="kn-kids__pvL"><Icon name="seal" size={16} /> {t(lang, K.previewWith)}</span>
          <input className="kn-f__in kn-kids__in" value={name} onChange={(e) => setName(e.target.value)} placeholder={t(lang, K.childName)} maxLength={30} aria-label={t(lang, K.childName)} />
          <input className="kn-f__in kn-kids__in kn-kids__in--age" type="number" inputMode="numeric" min={1} max={19} value={age} onChange={(e) => setAge(e.target.value)} placeholder={t(lang, K.age)} aria-label={t(lang, K.age)} />
        </div>
        <label className="kn-kids__search">
          <Icon name="globe" size={16} />
          <input className="kn-f__in kn-kids__in" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, K.search)} aria-label={t(lang, K.search)} />
        </label>
      </div>

      <div className="kn-kids__body">
        {/* facet rail */}
        <aside className="kn-kids__rail" aria-label={t(lang, K.themes)} data-lenis-prevent>
          <details className="kn-kids__grp" open>
            <summary>{t(lang, K.explore)}</summary>
            <div className="kn-kids__chips">{kidsAudiences.map((a) => chip(a.id, t(lang, a.label)))}</div>
          </details>
          <details className="kn-kids__grp" open>
            <summary>{t(lang, K.milestones)}</summary>
            <div className="kn-kids__chips">{kidsMilestones.map((m) => chip(m.id, t(lang, m.label)))}</div>
          </details>
          <details className="kn-kids__grp" open>
            <summary>{t(lang, K.themes)}</summary>
            <div className="kn-kids__chips">{kidsThemes.map((th) => chip(th.id, t(lang, th.label)))}</div>
          </details>
          <details className="kn-kids__grp">
            <summary>{t(lang, K.shapes)}</summary>
            <div className="kn-kids__chips">
              <button type="button" className="kn-kids__chip" aria-pressed={shape === ""} onClick={() => setShape("")}>{t(lang, K.all)}</button>
              {kidsShapes.map((s) => (
                <button key={s.id} type="button" className="kn-kids__chip" aria-pressed={shape === s.id} onClick={() => setShape(shape === s.id ? "" : s.id)}>{t(lang, s.label)}</button>
              ))}
            </div>
          </details>
          {(facets.size > 0 || shape || q) && (
            <button type="button" className="kn-kids__clear" onClick={() => { setFacets(new Set()); setShape(""); setQ(""); }}>{t(lang, K.clear)}</button>
          )}
        </aside>

        {/* the grid */}
        <div className="kn-kids__main">
          <p className="kn-kids__count" role="status">{list.length} {t(lang, K.results)}</p>
          {list.length === 0 && <p className="kn-kids__none">{t(lang, K.none)}</p>}
          {/* THE FIELD OF STILLS — two columns, and every card rises from
              below tipped out of focus, settles square as it crosses the
              middle of the screen, then tilts away over the top. The
              choreography is one verb (`data-focus`, in components/Motion.tsx,
              scrubbed to the scroll); the L/R value mirrors it so the two
              columns lean away from each other. NOTHING was taken off the
              card to make room for it: the whole tile — its link into the
              studio, its badge, its name, its maker, its colourway dots — is
              the still that travels, because the moved layer is the item's
              own first child. */}
          <ul className="kn-kids__grid kn-kids__grid--field">
            {list.map((c, i) => {
              const vi = variantIx[c.id] ?? 0;
              const variant = c.variants[vi] ?? c.variants[0];
              const s = sampleKids[i % sampleKids.length];
              const href = `${base}/kids/${c.id}?v=${variant.id}`;
              return (
                <li key={c.id} className="kn-kids__it" style={{ "--i": i } as React.CSSProperties} data-focus={i % 2 ? "R" : "L"}>
                  <div className="kn-kids__focus">
                  <Link href={href} className="kn-kids__tileLink" aria-label={`${t(lang, K.open)}: ${t(lang, c.name)}`} data-focus-in>
                    <KidsTile card={c} variant={variant} lang={lang} face={{ name: name || s[lang], age: ageN ?? s.age, details: false, sample: true }} />
                  </Link>
                  <div className="kn-kids__meta">
                    {(c.popular || c.isNew) && <span className="kn-kids__badge">{t(lang, c.isNew ? K.isNew : K.popular)}</span>}
                    <Link href={href} className="kn-kids__name">{t(lang, c.name)}</Link>
                    <span className="kn-kids__by">{t(lang, c.by)}</span>
                    {c.variants.length > 1 && (
                      <span className="kn-kids__dots" role="radiogroup" aria-label={t(lang, K.colorway)}>
                        {c.variants.map((vv, j) => (
                          <button
                            key={vv.id}
                            type="button"
                            role="radio"
                            aria-checked={j === vi}
                            aria-label={t(lang, vv.label)}
                            className="kn-kids__dot"
                            style={{ "--d1": vv.paper, "--d2": vv.a } as React.CSSProperties}
                            onClick={() => setVariantIx((cur) => ({ ...cur, [c.id]: j }))}
                          />
                        ))}
                      </span>
                    )}
                  </div>
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

const ALL_FACETS = new Set<string>([...kidsThemes.map((x) => x.id), ...kidsAudiences.map((x) => x.id), ...kidsMilestones.map((x) => x.id)]);
function isFacet(s: string): s is KidsFacet { return ALL_FACETS.has(s); }
