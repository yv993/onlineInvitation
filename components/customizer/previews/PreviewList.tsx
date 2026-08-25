"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import TemplateRenderer from "@/components/invitations/TemplateRenderer";
import { examples as C, occasions, wizard, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { draftToInvitation } from "@/lib/invitations/fromDraft";
import { parseLiveTpl } from "@/lib/invitations/styles";
import { examplesFor, findExample, priceLabel, styleLetter, type Example } from "@/lib/examples";
import { KIND_ICON } from "../ExampleCard";
import ExampleThumb from "../ExampleThumb";
import { findTemplate } from "@/lib/templates";
import TemplateView from "@/components/templates/TemplateView";
import { toDraft, useWizard, type WizardCategory } from "../WizardContext";
import PreviewCard, { orderedKinds } from "./PreviewCard";
import CardPreview from "./CardPreview";

// ============================================================================
// THE PREVIEW LIST — the right column, as a LIST: one separate entry per
// version the occasion offers (every web template, every engine style, every
// card), each with its own live preview drawn from the wizard's state, each
// expandable on its own row. The chosen version opens first and follows the
// pick; the others sit collapsed under it — a row each, with the name, the
// kind, the price and two verbs (Pick · Demo) — so the couple compares
// versions one at a time instead of scrolling one long stack. The other
// occasions' previews («the same details in another occasion's style») keep
// their place at the end, as their own collapsed group.
// ============================================================================

const L = {
  versions: { hy: "Տարբերակները՝ յուրաքանչյուրն առանձին", en: "The versions — each on its own" },
  pick: { hy: "Ընտրել", en: "Pick" },
  picked: { hy: "Ընտրված", en: "Picked" },
  demo: { hy: "Ցուցադրություն", en: "Demo" },
  others: { hy: "Այլ առիթների ոճով", en: "In another occasion's style" },
  othersHint: { hy: "Նույն տվյալները՝ մյուս առիթների առաջին ձևանմուշով։", en: "The same details, in each other occasion's first template." },
  open: { hy: "Բացել", en: "Open" },
  close: { hy: "Փակել", en: "Close" },
  yours: { hy: "Ձեր ընտրությունը", en: "Your pick" },
  taller: { hy: "Ավելի մեծ", en: "Taller", ru: "Крупнее" },
  shorter: { hy: "Ավելի փոքր", en: "Shorter", ru: "Меньше" },
  full: { hy: "Ամբողջ էկրանով", en: "Fullscreen", ru: "Во весь экран" },
};

export default function PreviewList({ lang, onDemo }: { lang: Lang; onDemo: (tpl?: string) => void }) {
  const { s, set } = useWizard();
  // the versions: the occasion's examples, the pick first
  const list = useMemo(() => {
    const own = examplesFor(s.occasion);
    const extra = own.some((e) => e.id === s.tpl) ? undefined : findExample(s.tpl);
    const all = extra && extra.occasion === s.occasion ? [extra, ...own] : own;
    const i = all.findIndex((e) => e.id === s.tpl);
    return i > 0 ? [all[i], ...all.slice(0, i), ...all.slice(i + 1)] : all;
  }, [s.occasion, s.tpl]);
  const [open, setOpen] = useState<Set<string>>(() => new Set([s.tpl]));
  // which panes the couple has asked to see taller — per row, because they
  // compare versions one at a time
  const [tall, setTall] = useState<Set<string>>(() => new Set());
  const [othersOpen, setOthersOpen] = useState(false);
  const rowRefs = useRef(new Map<string, HTMLElement>());
  // a new pick opens its row and brings it into view
  useEffect(() => {
    setOpen((cur) => (cur.has(s.tpl) ? cur : new Set([...cur, s.tpl])));
    const el = rowRefs.current.get(s.tpl);
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [s.tpl]);
  const toggle = (id: string) => setOpen((cur) => { const n = new Set(cur); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const others = useMemo(() => orderedKinds(s.occasion).filter((k) => k !== s.occasion), [s.occasion]);

  return (
    <div className="kn-pl" aria-label={t(lang, L.versions)}>
      {/* no heading, no hint (client, 2026-08-24): every pixel of the column
          belongs to the demo itself — the wrapper's aria-label keeps the
          region named for assistive tech, and the rows explain themselves */}
      <ul className="kn-pl__list">
        {list.map((e) => {
          const isOpen = open.has(e.id);
          const picked = e.id === s.tpl;
          return (
            <li key={e.id} className={`kn-pl__it${picked ? " kn-pl__it--on" : ""}${isOpen ? " is-open" : ""}`} ref={(el) => { if (el) rowRefs.current.set(e.id, el); else rowRefs.current.delete(e.id); }} data-id={e.id}>
              <div className="kn-pl__row">
                {/* a div with the button role: the row's live thumbnail carries the
                    invitation's own buttons, and buttons may not nest */}
                <div role="button" tabIndex={0} className="kn-pl__head" aria-expanded={isOpen} aria-controls={`kn-pl-${e.id}`} onClick={() => toggle(e.id)} onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggle(e.id); } }}>
                  <Thumb e={e} lang={lang} />
                  <span className="kn-pl__t">
                    <b>{t(lang, e.name)}</b>
                    <small><Icon name={KIND_ICON[e.kind]} size={11} /> {t(lang, C.kinds[e.kind])}{styleLetter(e) ? ` · ${styleLetter(e)}` : ""} · {priceLabel(e)}{picked ? ` · ${t(lang, L.yours)}` : ""}</small>
                  </span>
                  <Icon name="chevron" size={16} className={`kn-pl__caret${isOpen ? " is-open" : ""}`} />
                </div>
                <span className="kn-pl__acts">
                  {picked ? <span className="kn-chip kn-chip--on" aria-current="true"><Icon name="check" size={12} /> {t(lang, L.picked)}</span> : <button type="button" className="kn-chip" onClick={() => set({ tpl: e.id })}>{t(lang, L.pick)}</button>}
                  {/* always available: the preview falls back to the design's
                      own sample words, so there is always something to show */}
                  <button type="button" className="kn-chip" onClick={() => onDemo(e.id)} title={t(lang, wizard.demoHint)}>{t(lang, L.demo)}</button>
                </span>
              </div>
              {isOpen && (
                <div className="kn-pl__panel" id={`kn-pl-${e.id}`}>
                  {/* each version scrolls in ITS OWN frame — a phone-height window
                      with its own scrollbar, so the column never grows with the
                      page. TWO WAYS TO SEE MORE OF IT: taller, which keeps the
                      form beside it, or fullscreen, which does not. */}
                  <div className={`kn-pl__view${tall.has(e.id) ? " kn-pl__view--tall" : ""}`} tabIndex={0} aria-label={t(lang, e.name)} data-lenis-prevent>
                    {/* FIRST in the flow and zero-height: a sticky bar placed
                        after the page would sit four thousand pixels down, at
                        the end of it */}
                    <span className="kn-pl__zoom">
                      <button
                        type="button"
                        aria-pressed={tall.has(e.id)}
                        title={t(lang, tall.has(e.id) ? L.shorter : L.taller)}
                        onClick={() => setTall((cur) => { const n = new Set(cur); if (n.has(e.id)) n.delete(e.id); else n.add(e.id); return n; })}
                      >
                        <Icon name="chevron" size={13} className={tall.has(e.id) ? "kn-pl__zoomUp" : undefined} />
                        <b>{t(lang, tall.has(e.id) ? L.shorter : L.taller)}</b>
                      </button>
                      <button type="button" title={t(lang, L.full)} onClick={() => onDemo(e.id)}>
                        <Icon name="arrow" size={13} />
                        <b>{t(lang, L.full)}</b>
                      </button>
                    </span>
                    <VersionPreview e={e} lang={lang} onDemo={() => onDemo(e.id)} />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className={`kn-pl__others${othersOpen ? " is-open" : ""}`}>
        <button type="button" className="kn-pl__head kn-pl__head--group" aria-expanded={othersOpen} onClick={() => setOthersOpen((v) => !v)}>
          <span className="kn-pl__t"><b>{t(lang, L.others)}</b><small>{t(lang, L.othersHint)}</small></span>
          <Icon name="chevron" size={16} className={`kn-pl__caret${othersOpen ? " is-open" : ""}`} />
        </button>
        {othersOpen && (
          <div className="kn-pl__group">
            {others.map((k) => (
              <div key={k} className="kn-wz__pvItem">
                <p className="kn-pl__kindLabel">{t(lang, occasions[k].name)}</p>
                <div className="kn-pl__view" tabIndex={0} aria-label={t(lang, occasions[k].name)} data-lenis-prevent><PreviewCard kind={k} onDemo={() => onDemo()} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** the row's thumbnail: the version's own first screen, in miniature */
function Thumb({ e, lang }: { e: Example; lang: Lang }) {
  return <span className="kn-pl__thumb kn-pl__thumb--live" style={{ background: e.palette[0] }}><ExampleThumb e={e} lang={lang} /></span>;
}

/** one version's live preview: a web template in its palette, an engine style
 *  compact, a card's face — all from the same wizard state */
function VersionPreview({ e, lang, onDemo }: { e: Example; lang: Lang; onDemo: () => void }) {
  const { s, ready, blob } = useWizard();
  const base = lang === "hy" ? "" : `/${lang}`;
  if (e.kind === "card") return <CardPreview lang={lang} onDemo={onDemo} tpl={e.id} bare />;
  if (e.kind === "engine") {
    const st = parseLiveTpl(e.id);
    if (!st) return null;
    const data = draftToInvitation(ready ? toDraft(s) : null, st.id);
    // the whole page, every section, live — in the row's own scroll frame
    return (
      <div className="kn-ep__frame kn-pl__engine">
        <TemplateRenderer data={data} lang={lang} embed chrome={false} />
      </div>
    );
  }
  // A WEB TEMPLATE: the whole page, in the row's own frame — the same guest
  // URL the Live Demo and the detail window open. It used to render the
  // template's FIRST SCREEN inline (hero + two blocks), which meant this pane
  // could not be scrolled to the programme, the gallery or the RSVP: the
  // engine rows showed every section and these showed a fragment. An iframe
  // is the honest fix — it is the invitation, not a rendering of part of it,
  // with its own scroll, its own motion and the couple's own photographs.
  const tp = findTemplate(e.id);
  if (tp) {
    // INLINE, not framed: an iframe carries the state in its ?p= URL, so every
    // keystroke changed its src and reloaded the whole page — the opposite of
    // live. Rendered inline it is the same React tree as the form, so a typed
    // letter or a dropped photograph lands on the next paint.
    return (
      <div className="kn-pl__page">
        <TemplateView lang={lang} s={tp} base={base} draft={toDraft(s)} mapUrl={s.map || undefined} embed />
      </div>
    );
  }
  return <PreviewCard kind={e.occasion as WizardCategory} onDemo={onDemo} tplId={e.id} />;
}
