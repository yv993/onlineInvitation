"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { LiveThumb, TemplateHeroThumb } from "./customizer/ExampleThumb";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { categories, templates } from "@/lib/templates";
import type { Category } from "@/lib/templates";

// ============================================================================
// TEMPLATE GRID — the live examples on the home page, with FILTER TABS
// (All · Wedding · Birthday · Christening · Corporate) and an INSTANT SEARCH
// over name, tagline and tags. Filtering is a pure derivation of two pieces of
// state — no fetch, no debounce needed at fifteen items. Each card is a link to
// the live template; the card's picture is THE INVITATION'S FIRST SCREEN,
// rendered live (never a stock photo), and a "live" pill marks entries with
// video or audio.
// ============================================================================

const L = {
  title: { hy: "Կենդանի օրինակներ", en: "Live examples" },
  // counted off the registry, never written out: a fourteenth template must
  // not leave the page claiming twelve
  lead: { hy: "{n} տարբեր հրավեր՝ {k} առիթի համար։ Բացեք ցանկացածը՝ որպես հյուր։", en: "{n} distinct invitations across {k} occasions. Open any of them as a guest would." },
  search: { hy: "Որոնել ոճ, զգացողություն, հատկություն…", en: "Search a style, a mood, a feature…" },
  none: { hy: "Ոչինչ չգտնվեց։", en: "Nothing matched." },
  open: { hy: "Բացել", en: "Open" },
  live: { hy: "կենդանի", en: "live" },
  count: { hy: "օրինակ", en: "examples" },
};

export default function TemplateGrid({ lang }: { lang: Lang }) {
  const [cat, setCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");
  const base = lang === "hy" ? "" : "/en";

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return templates.filter((x) => {
      if (cat !== "all" && x.category !== cat) return false;
      if (!needle) return true;
      const hay = [t(lang, x.name), t(lang, x.tagline), x.tags.join(" "), x.category, x.id].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [cat, q, lang]);

  return (
    <div className="kn-tgrid">
      <div className="kn-tgrid__head">
        <div>
          <p className="kn-label">{t(lang, L.live)} · {templates.length} {t(lang, L.count)}</p>
          <h2 className="kn-h2">{t(lang, L.title)}</h2>
          <p className="kn-lead" style={{ marginTop: "0.6rem" }}>
            {t(lang, L.lead).replace("{n}", String(templates.length)).replace("{k}", String(new Set(templates.map((x) => x.category)).size))}
          </p>
        </div>
        <label className="kn-tgrid__search">
          <Icon name="globe" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, L.search)} aria-label={t(lang, L.search)} />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="clear"><Icon name="x" size={14} /></button>
          )}
        </label>
      </div>

      <div className="kn-tgrid__tabs" role="tablist">
        {categories.map((c) => {
          const n = c.id === "all" ? templates.length : templates.filter((x) => x.category === c.id).length;
          return (
            <button key={c.id} role="tab" aria-selected={cat === c.id} className="kn-chips__b" onClick={() => setCat(c.id)}>
              {t(lang, c.label)} <span className="kn-tgrid__n">{n}</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="kn-tgrid__none">{t(lang, L.none)}</p>
      ) : (
        <div className="kn-tgrid__grid">
          {list.map((x) => (
            <Link key={x.id} className="kn-tcard" href={`${base}/invitations/${x.id}`} data-cat={x.category} style={{ "--tc-acc": x.theme.accent, "--tc-bg": x.theme.bg, "--tc-fg": x.theme.fg } as React.CSSProperties}>
              <span className="kn-tcard__plate kn-tcard__plate--live">
                <LiveThumb><TemplateHeroThumb tp={x} lang={lang} blocks={false} /></LiveThumb>
                {(x.video || x.audio) && <span className="kn-tcard__live">● {t(lang, L.live)}</span>}
                <span className="kn-tcard__no" aria-hidden="true">{x.category.slice(0, 1).toUpperCase()}{x.n}</span>
              </span>
              <span className="kn-tcard__body">
                <span className="kn-tcard__cat">{t(lang, categories.find((c) => c.id === x.category)!.label)}</span>
                <b className="kn-tcard__name">{t(lang, x.name)}</b>
                <span className="kn-tcard__tag">{t(lang, x.tagline)}</span>
                <span className="kn-tcard__tags">{x.tags.slice(0, 4).map((g) => <i key={g}>#{g}</i>)}</span>
                <span className="kn-tcard__go">{t(lang, L.open)} <Icon name="arrow" size={14} /></span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
