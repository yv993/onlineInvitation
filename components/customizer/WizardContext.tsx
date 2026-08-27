"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { encodeDraft, type Draft, type DraftStop } from "@/lib/draft";
import { parseWTpl, wTpl } from "@/lib/wcards";
import { parseKidsTpl } from "@/lib/kids";
import { templates } from "@/lib/templates";
import { engineStyles } from "@/lib/invitations/styles";
import type { Lang } from "@/lib/content";

// ============================================================================
// THE WIZARD'S STATE — one React Context, real-time, shared by the form, all
// five live previews, the Live Demo modal and the link generator.
//
// The state IS a Draft (lib/draft.ts) plus what only the browser knows:
//   • `photos` — the couple's own photographs as SAME-ORIGIN PATHS. They
//     used to be object URLs, which the previews could show and nothing else
//     could: an iframe cannot load its parent's blob: handle, and no other
//     machine can load it at all, so the guest link fell back to the
//     template's stock plates. They are uploaded at pick time now
//     (components/ui/PhotoPicker.tsx → POST /api/photo) and ride in the blob,
//     so the previews, the short link and the guest's browser all show the
//     real pictures — in the template's own plate slots, wearing every effect
//     it applies to its samples.
//   • `tab` — which preview is fronted on mobile.
//
// PERSISTENCE: localStorage with a seven-day shelf life (2026-08-25 — was
// sessionStorage, and a couple who closed the tab lost twenty filled fields;
// now the draft survives the browser, and a stale one quietly expires), so a
// new tab starts fresh (nobody wants last month's engagement pre-filled in
// their sister's wedding). The photographs survive a reload now — they are
// saved paths, not handles that die with the document.
//
// EVERY EDIT is a plain `set({ field })`; `blob` is derived and memoised, so
// the previews, the iframe URL and the link generator always agree.
// ============================================================================

export type WizardCategory = Draft["occasion"]; // wedding | engagement | baptism | birthday | corporate

export type WizardState = Draft & {
  tpl: string; // the live template id chosen for this category
  photos: string[]; // same-origin /api/photo/<id> paths, in order
  lang: Lang;
};

// The web templates AND the engine styles (`live-<style>`), DERIVED from the
// registries rather than listed by hand. The hand-list was a trap that
// sprang on 2026-08-24: wedding-4..7 shipped without joining it, so
// `isValidTpl` rejected them and the wizard silently swapped every deep link
// to those strips for wedding-1 — «some examples bring wrong place». A list
// that must be maintained in step with another list eventually is not.
const catOf = (c: (typeof templates)[number]["category"]): WizardCategory => (c === "christening" ? "baptism" : c);
const occOf = (o: (typeof engineStyles)[number]["occasion"]): WizardCategory => (o === "gala" ? "corporate" : o);
export const CATEGORY_TEMPLATES: Record<WizardCategory, string[]> = (() => {
  const m: Record<WizardCategory, string[]> = { wedding: [], engagement: [], baptism: [], birthday: [], corporate: [] };
  for (const tp of templates) m[catOf(tp.category)].push(tp.id);
  for (const st of engineStyles) m[occOf(st.occasion)].push(`live-${st.id}`);
  return m;
})();

/** a tpl the occasion can be built on: its templates and engine styles, plus
 *  the minted card ids — a wedding's `wed-<design>-<colour>` (lib/wcards) and
 *  a birthday's `kids-<card>-<variant>` (lib/kids), both lenient parsers */
export function isValidTpl(occasion: WizardCategory, tpl: string): boolean {
  return (
    CATEGORY_TEMPLATES[occasion].includes(tpl) ||
    (occasion === "wedding" && parseWTpl(tpl) !== null) ||
    (occasion === "birthday" && parseKidsTpl(tpl) !== null)
  );
}
/** the id the rest of the site will agree on — a card colourway that does not
 *  exist resolves to the design's first (parseWTpl is lenient), so the id is
 *  rewritten here, once, instead of every consumer comparing loosely */
export function canonTpl(tpl: string): string {
  if (!tpl.startsWith("wed-")) return tpl;
  const w = parseWTpl(tpl);
  return w ? wTpl(w.card, w.variant) : tpl;
}

/** A blank draft — the previews still render (they fall back to sample copy)
 *  so the very first keystroke has something to change. */
export function emptyState(lang: Lang, category: WizardCategory = "wedding"): WizardState {
  return {
    a: "",
    b: "",
    date: "",
    time: "16:00",
    city: "",
    stops: [],
    occasion: category,
    venue: "",
    address: "",
    map: "",
    rsvpBy: "",
    dress: [],
    music: "",
    video: false,
    godA: "",
    godB: "",
    born: undefined,
    tpl: CATEGORY_TEMPLATES[category][0],
    photos: [],
    lang,
  };
}

const KEY = "kniq.wizard.v1";

type Ctx = {
  s: WizardState;
  set: (patch: Partial<WizardState>) => void;
  /** functional form — reads the CURRENT state, so rapid successive edits never clobber each other */
  patch: (fn: (cur: WizardState) => Partial<WizardState>) => void;
  setStop: (i: number, patch: Partial<DraftStop>) => void;
  addStop: () => void;
  removeStop: (i: number) => void;
  setCategory: (c: WizardCategory) => void;
  reset: () => void;
  /** the sanitised, shareable blob for the CURRENT state ("" until names+date exist) */
  blob: string;
  /** names + date present — the minimum a card needs */
  ready: boolean;
};

const WizardCtx = createContext<Ctx | null>(null);

export function useWizard(): Ctx {
  const c = useContext(WizardCtx);
  if (!c) throw new Error("useWizard outside <WizardProvider>");
  return c;
}

/** The Draft part of the state, exactly as lib/draft.ts encodes it. */
export function toDraft(s: WizardState): Draft {
  return {
    a: s.a,
    b: s.b,
    date: s.date,
    time: s.time,
    city: s.city,
    stops: s.stops.filter((x) => x.time && x.name),
    occasion: s.occasion,
    venue: s.venue || undefined,
    address: s.address || undefined,
    map: s.map || undefined,
    rsvpBy: s.rsvpBy || undefined,
    dress: s.dress && s.dress.length ? s.dress : undefined,
    music: s.music || undefined,
    video: s.video ? true : undefined,
    godA: s.godA || undefined,
    godB: s.godB || undefined,
    born: s.born,
    tpl: s.tpl,
    photos: s.photos.length ? s.photos : undefined,
    // the two families and the gift box travel only when something is filled
    parents: s.parents && (s.parents.gf || s.parents.gm || s.parents.bf || s.parents.bm) ? s.parents : undefined,
    gifts: s.gifts && s.gifts.some((g) => g.label.trim() && g.value.trim()) ? s.gifts.filter((g) => g.label.trim() && g.value.trim()) : undefined,
  };
}

export function WizardProvider({ lang, initialCategory, initialTpl, children }: { lang: Lang; initialCategory?: WizardCategory; initialTpl?: string; children: React.ReactNode }) {
  const [s, setS] = useState<WizardState>(() => {
    const e = emptyState(lang, initialCategory);
    if (initialTpl && isValidTpl(e.occasion, initialTpl)) e.tpl = canonTpl(initialTpl);
    return e;
  });
  const hydrated = useRef(false);

  // restore (once, client only) — but a ?category= in the URL wins over the
  // remembered one, because the couple just clicked that card on purpose
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const env = JSON.parse(raw) as { at?: number; s?: Partial<WizardState> } & Partial<WizardState>;
        // the envelope form carries a timestamp; a bare legacy draft (from the
        // sessionStorage era) reads as the state itself and is accepted once
        const fresh = !env.at || Date.now() - env.at < 7 * 24 * 60 * 60 * 1000;
        const saved = (env.s ?? env) as Partial<WizardState>;
        if (!fresh) { localStorage.removeItem(KEY); return; }
        setS((cur) => {
          const next = { ...cur, ...saved, lang };
          if (initialCategory) {
            next.occasion = initialCategory;
            if (!isValidTpl(initialCategory, next.tpl)) next.tpl = CATEGORY_TEMPLATES[initialCategory][0];
          }
          if (initialTpl && isValidTpl(next.occasion, initialTpl)) next.tpl = initialTpl;
          next.tpl = canonTpl(next.tpl);
          return next;
        });
      }
    } catch {}
  }, [initialCategory, initialTpl, lang]);

  // persist — photos included now: they are saved paths, not object URLs, so
  // a reload keeps the pictures instead of quietly dropping them
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), s }));
    } catch {}
  }, [s]);

  const set = useCallback((patch: Partial<WizardState>) => setS((cur) => ({ ...cur, ...patch })), []);
  const patch = useCallback((fn: (cur: WizardState) => Partial<WizardState>) => setS((cur) => ({ ...cur, ...fn(cur) })), []);

  const setStop = useCallback((i: number, patch: Partial<DraftStop>) => {
    setS((cur) => ({ ...cur, stops: cur.stops.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  }, []);

  const addStop = useCallback(() => {
    setS((cur) => {
      if (cur.stops.length >= 5) return cur;
      const last = cur.stops[cur.stops.length - 1];
      const t = last ? bump(last.time) : cur.time || "16:00";
      return { ...cur, stops: [...cur.stops, { time: t, name: "", place: "", address: "" }] };
    });
  }, []);

  const removeStop = useCallback((i: number) => setS((cur) => ({ ...cur, stops: cur.stops.filter((_, j) => j !== i) })), []);

  const setCategory = useCallback((c: WizardCategory) => {
    setS((cur) => ({ ...cur, occasion: c, tpl: isValidTpl(c, cur.tpl) ? cur.tpl : CATEGORY_TEMPLATES[c][0] }));
  }, []);

  const reset = useCallback(() => {
    setS(emptyState(lang, initialCategory));
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, [lang, initialCategory]);

  const ready = Boolean(s.a && s.date && (s.b || s.occasion === "birthday" || s.occasion === "corporate"));
  const blob = useMemo(() => (ready ? encodeDraft(toDraft(s)) : ""), [s, ready]);

  const value = useMemo<Ctx>(
    () => ({ s, set, patch, setStop, addStop, removeStop, setCategory, reset, blob, ready }),
    [s, set, patch, setStop, addStop, removeStop, setCategory, reset, blob, ready],
  );
  return <WizardCtx.Provider value={value}>{children}</WizardCtx.Provider>;
}

/** "15:00" → "16:30" — the next stop's suggested time */
function bump(t: string): string {
  const m = /^(\d{2}):(\d{2})$/.exec(t);
  if (!m) return "16:00";
  const mins = Math.min(23 * 60 + 30, Number(m[1]) * 60 + Number(m[2]) + 90);
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}
