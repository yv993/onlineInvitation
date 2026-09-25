"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

// ============================================================================
// THE INK SCORE (wedding-3, «The Ink Line») — how the page ARRIVES.
//
// The owner's brief (2026-09-24) was a generic reveal system: masked slide-up
// titles, faded paragraphs, staggered tokens, curtained images, buttons that
// enter after their text. This page is ink on paper, so each of those is
// applied only where its MATERIAL could make that motion, and adapted where it
// could not:
//
//   · script (Hurricane) is WRITTEN — a pen, left to right, one line after
//     another, at a hand's speed in ems. Never split into letters (a
//     connected script loses its joins) and never slid through a mask (its
//     tails overhang a line-height of 1.0 by 0.15em and would be cropped;
//     measured). This is the spec's masked reveal, turned to the direction
//     the pen moves.
//   · slab capitals are PRINTED — the spec's masked slide-up, literally: the
//     line rises through a fixed window. Capitals have nothing to crop.
//   · serif labels and paragraphs are SET — a soft fade and a short drift.
//   · the week's seven columns are the one real run of TOKENS (0.04s apart).
//   · stroked ornaments are DRAWN along their own paths (stroke-dash on
//     pathLength=1); filled ones and the date box are wiped in the direction
//     a hand would take.
//   · photographs SETTLE onto the paper (scale 1.06 → 1; the spec's blur is
//     left out — see develop()); the pencil sketch is SHADED IN by a soft
//     graphite sweep instead.
//   · the map pill, the form rows and SEND ENTER right after the words they
//     act on.
//
// ONE PEN AT A TIME. Pieces are queued in reading order as they enter the
// viewport, and the pen TAKES the next one only when its hand is free — so a
// piece that has scrolled away by then is simply shown, and what the guest
// can see never waits behind what they cannot. A piece that has waited past
// MAX_WAIT plays faster (the guest is outrunning the pen). Everything plays
// ONCE; nothing that has been shown is ever hidden again — not on the way
// back up, not by a late start, not by a switch of the motion setting.
//
// THE CONTRACT (the same one Motion.tsx keeps): every parked state lives in
// globals.css under `html.js` + (prefers-reduced-motion: no-preference) and
// never inside an embed, so no-JS, reduced motion and the editor's preview get
// the finished page. All parked states hang off ONE switch, `--ink-park` on
// the artboard, which a CSS failsafe flips at 4s — if this never runs (or
// throws, or its chunk fails), the page shows itself, finished. Every piece
// ends by dropping its inline styles and taking `.is-inked`, so the page at
// rest IS the 1:1 Figma layout.
// ============================================================================

gsap.registerPlugin(ScrollTrigger, CustomEase);
// the spec's editorial curve, and its image curve
CustomEase.create("inkSet", "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("inkDevelop", "M0,0 C0.25,1 0.5,1 1,1");

type Kind = "write" | "draw" | "set" | "enter" | "row" | "print" | "develop" | "sketch" | "hang" | "tokens" | "rule";
type Built = {
  tl: gsap.core.Timeline;
  /** seconds after its start at which the pen is free for the next piece */
  handoff: number;
  /** true when the element's text no longer sits where it was measured */
  moved?: () => boolean;
};
type Piece = {
  el: HTMLElement;
  kind: Kind;
  /** reading order */
  i: number;
  /** seconds into the hero's own score (the first screen plays on arrival) */
  cue?: number;
  /** played by the note it sits in, never queued on its own */
  nested: boolean;
  started: boolean;
  done: boolean;
  queued: boolean;
  /** when it entered the viewport (gsap time) */
  enteredAt: number;
  /** its picture has decoded (develop / sketch); true for everything else */
  ready: boolean;
  tl?: gsap.core.Timeline;
  moved?: () => boolean;
};

const VERBS = ["write", "draw", "set", "enter", "print", "develop", "sketch", "hang", "tokens", "rule"] as const;
// Pieces the markup cannot label: the RSVP is a shared component (Blocks.tsx),
// so its title and rows are claimed here by position. globals.css parks them
// by the same selectors, so they are hidden from the first paint too.
const BAND_TITLE = ".kn-ink__bandIn .kn-tb__label";
const BAND_ROWS = ".kn-ink__bandIn .kn-tf > :not(.kn-sr)";
const THANKS = ":scope > .kn-thanks";

// GSAP 3.13+ also writes `translate/rotate/scale: none` beside every transform
// it sets (to keep the individual properties from compounding) — at rest
// those are cleared too, or a `none` would sit on the element for good
const CLEAR = [
  "clip-path", "opacity", "transform", "transform-origin", "translate", "rotate", "scale", "filter",
  "mask-position", "-webkit-mask-position", "stroke-dasharray", "stroke-dashoffset", "--rule",
];
/** a piece is finished: its parked state no longer applies, and nothing
 *  inline remains — the element is exactly as the page draws it at rest */
function settle(el: Element) {
  el.classList.add("is-inked");
  const s = (el as HTMLElement).style;
  if (s) for (const p of CLEAR) s.removeProperty(p);
}
const inked = (el: Element) => el.classList.contains("is-inked");

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** development only: a timeline of what the score did, for the harness
 *  (window.__inkLog — [ms since navigation, event, piece]) */
const log = (event: string, el?: Element) => {
  if (process.env.NODE_ENV === "production") return;
  const w = window as unknown as { __inkLog?: Array<[number, string, string]> };
  const id = el ? `${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(" ").filter((c) => c && c !== "is-inked")[0] ?? ""}${(el as HTMLElement).dataset?.cue ? `@${(el as HTMLElement).dataset.cue}` : ""}` : "";
  (w.__inkLog ??= []).push([Math.round(performance.now()), event, id]);
};

// ---------------------------------------------------------------- the pen
type Glyph = { l: number; r: number; t: number; b: number };
type Line = { l: number; r: number; c: number; top: number; bot: number; glyphs: Glyph[] };
type Seg = { x0: number; x1: number; y: number };

let cv: CanvasRenderingContext2D | null = null;

/** the lines of an element's text AND the ink of every glyph on them,
 *  measured on the live layout — so an Armenian or Russian fallback is
 *  written with its own extents. A glyph's box comes from its Range (its
 *  place, in context) and its ink from canvas measureText with the same face
 *  (how far it reaches past that place: Hurricane's tails run 0.15em under a
 *  1.0 line box, its exit strokes up to 0.40em past the advance). */
function measure(el: HTMLElement) {
  const box = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const fs = parseFloat(cs.fontSize) || 16;
  const lh = parseFloat(cs.lineHeight) || fs * 1.2;
  const lines: Line[] = [];
  const lineAt = (c: number) => {
    let hit = lines.find((x) => Math.abs(x.c - c) < lh * 0.5);
    if (!hit) { hit = { l: Infinity, r: -Infinity, c, top: c - lh / 2, bot: c + lh / 2, glyphs: [] }; lines.push(hit); }
    return hit;
  };
  cv ??= document.createElement("canvas").getContext("2d");
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const host = n.parentElement;
    if (!host) continue;
    const hs = getComputedStyle(host);
    const face = `${hs.fontStyle} ${hs.fontWeight} ${hs.fontSize}`;
    // the baseline sits the PRIMARY face's ascent below the run's box top,
    // whichever face draws a given glyph (its fallbacks share the baseline)
    let ascent = NaN;
    if (cv) {
      cv.font = `${face} ${hs.fontFamily.split(",")[0]}`;
      ascent = cv.measureText("M").fontBoundingBoxAscent;
      cv.font = `${face} ${hs.fontFamily}`;
    }
    const text = n.data;
    for (let i = 0; i < text.length; ) {
      const ch = String.fromCodePoint(text.codePointAt(i) ?? 32);
      const len = ch.length;
      range.setStart(n, i);
      range.setEnd(n, i + len);
      i += len;
      if (/\s/.test(ch)) continue;
      const rr = range.getClientRects()[0];
      if (!rr || rr.width < 0.1) continue;
      const ln = lineAt((rr.top + rr.bottom) / 2 - box.top);
      const x0 = rr.left - box.left;
      ln.l = Math.min(ln.l, x0);
      ln.r = Math.max(ln.r, rr.right - box.left);
      if (cv && Number.isFinite(ascent) && ascent > 0) {
        const m = cv.measureText(ch);
        const base = rr.top - box.top + ascent;
        ln.glyphs.push({ l: x0 - Math.max(0, m.actualBoundingBoxLeft), r: x0 + m.actualBoundingBoxRight, t: base - m.actualBoundingBoxAscent, b: base + m.actualBoundingBoxDescent });
      }
    }
  }
  range.detach?.();
  lines.sort((a, b) => a.c - b.c);
  return { lines: lines.filter((l) => l.r > l.l), fs, lh };
}

/** THE SEAM between two lines, as a step function of x. By default it runs
 *  just under the upper line's box; under a glyph of the upper line whose
 *  tail hangs lower it drops beneath that tail, and over a glyph of the
 *  lower line that reaches higher it rises above that glyph — so a written
 *  line keeps its tails, and the next line shows nothing before its pen.
 *  (A straight seam cut 'y', 'g' and 'f' tails flat for up to 0.8s, and let
 *  the top of the next line's 'f' through early — measured.) Where the two
 *  truly collide, the unwritten line wins: nothing appears before its pen. */
function seamBetween(a: Line, b: Line, fs: number): Seg[] {
  const base = a.bot + 0.06 * fs;
  const m = 0.05 * fs;
  const lo = a.glyphs.filter((g) => g.b + 0.03 * fs > base).map((g) => ({ x0: g.l - m, x1: g.r + m, y: g.b + 0.03 * fs }));
  const hi = b.glyphs.filter((g) => g.t - 0.02 * fs < a.bot + 0.45 * fs).map((g) => ({ x0: g.l - m, x1: g.r + m, y: g.t - 0.02 * fs }));
  const xs = Array.from(new Set([-1e5, 1e5, ...lo.flatMap((z) => [z.x0, z.x1]), ...hi.flatMap((z) => [z.x0, z.x1])])).sort((p, q) => p - q);
  const segs: Seg[] = [];
  for (let k = 0; k < xs.length - 1; k++) {
    const x0 = xs[k], x1 = xs[k + 1], xm = (x0 + x1) / 2;
    let y = base;
    for (const z of lo) if (xm >= z.x0 && xm <= z.x1) y = Math.max(y, z.y);
    for (const z of hi) if (xm >= z.x0 && xm <= z.x1) y = Math.min(y, z.y);
    y = Math.min(Math.max(y, a.bot - 0.3 * fs), a.bot + 0.45 * fs);
    const prev = segs[segs.length - 1];
    if (prev && Math.abs(prev.y - y) < 0.05) prev.x1 = x1;
    else segs.push({ x0, x1, y });
  }
  return segs;
}

/** a seam's points from xa to xb (dir 1) or back (dir -1), steps included */
function along(segs: Seg[], xa: number, xb: number, dir: 1 | -1) {
  const pts: string[] = [];
  const run = segs.filter((s) => s.x1 > xa && s.x0 < xb);
  for (const s of dir === 1 ? run : [...run].reverse()) {
    const a0 = Math.max(s.x0, xa), a1 = Math.min(s.x1, xb);
    if (dir === 1) pts.push(`${a0} ${s.y}`, `${a1} ${s.y}`);
    else pts.push(`${a1} ${s.y}`, `${a0} ${s.y}`);
  }
  return pts;
}

function write(el: HTMLElement): Built {
  const pen = parseFloat(el.dataset.write || "") || 6; // ems per second
  const { lines, fs } = measure(el);
  const tl = gsap.timeline({ paused: true, onComplete: () => settle(el) });
  // nothing to write: a tiny timeline, never a zero-length one (a zero-length
  // timeline played at a changed timeScale completes without its callbacks)
  if (!lines.length) return { tl: tl.to({}, { duration: 0.01 }), handoff: 0 };
  // 0.5em sideways covers every exit stroke; 0.4em above the first line and
  // below the last covers every tail. Between lines, the seams above.
  const padX = 0.5 * fs, padV = 0.4 * fs;
  const n = lines.length;
  const seams = lines.slice(0, -1).map((ln, i) => seamBetween(ln, lines[i + 1], fs));
  const top0 = lines[0].top - padV;
  const botN = lines[n - 1].bot + padV;
  const X0 = lines.map((ln) => ln.l - padX);
  const X1 = lines.map((ln) => ln.r + padX);
  // each line is its own subpath; the bands meet exactly on their seams (and
  // run in opposite directions there), so their union has no hairline
  const band = (i: number, x1: number) => {
    const x0 = X0[i];
    if (x1 <= x0) return "";
    const topPts = i === 0 ? [`${x0} ${top0}`, `${x1} ${top0}`] : along(seams[i - 1], x0, x1, 1);
    const botPts = i === n - 1 ? [`${x1} ${botN}`, `${x0} ${botN}`] : along(seams[i], x0, x1, -1);
    return `M ${[...topPts, ...botPts].join(" L ")} Z`;
  };
  const st = { k: 0, x: X0[0] };
  // a finished line is never painted again: a GSAP revert (a switch to
  // reduced motion) re-runs this onUpdate at the tween's START, and this
  // clip is not GSAP's to restore — it once erased every written title
  const paint = () => {
    if (inked(el)) return;
    let d = "";
    for (let i = 0; i < st.k; i++) d += band(i, X1[i]);
    d += band(st.k, st.x);
    el.style.clipPath = `path("${d || "M 0 0 Z"}")`;
  };
  let t = 0;
  let lastStart = 0;
  let lastDur = 0;
  lines.forEach((ln, i) => {
    // a hand's speed: a long line takes longer than a short one
    const d = gsap.utils.clamp(0.3, 1.3, (ln.r - ln.l) / (pen * fs));
    tl.call(() => { st.k = i; st.x = X0[i]; paint(); }, undefined, t);
    tl.to(st, { x: X1[i], duration: d, ease: "sine.inOut", onUpdate: paint, immediateRender: false }, t);
    lastStart = t;
    lastDur = d;
    t += d + (i < n - 1 ? 0.07 : 0); // the pen lifts between lines
  });
  // the next piece may start while THIS line's last line is being written —
  // never while an earlier line still is (a two-line title used to share the
  // screen with three pieces at once)
  const h = parseFloat(el.dataset.handoff || "") || 0.55;
  const was = lines.map((ln) => [ln.l, ln.r, ln.c].map(Math.round).join()).join("|");
  const moved = () => measure(el).lines.map((ln) => [ln.l, ln.r, ln.c].map(Math.round).join()).join("|") !== was;
  return { tl, handoff: lastStart + h * lastDur, moved };
}

// ------------------------------------------------------------ the strokes
/** a stroked ornament draws itself along its own paths. `center`: from the
 *  middle outward (the symmetric rules); `ltr`: in the direction of reading.
 *  A subpath that runs against that direction is drawn from its far end. Its
 *  filled parts (the closing heart) bloom as the pen passes them.
 *  autoRound:false — GSAP rounds px values to whole pixels, and on
 *  pathLength=1 the offset only runs from 1 to 0: every stroke POPPED whole
 *  at mid-tween instead of drawing (measured on all 48 subpaths). */
function pen(svg: SVGSVGElement, mode: "ltr" | "center", dur: number): Built {
  const vb = svg.viewBox.baseVal;
  const W = vb && vb.width ? vb.width : 1;
  const x0 = vb ? vb.x : 0;
  const cx = x0 + W / 2;
  const all = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
  const strokes = all.filter((p) => p.hasAttribute("pathLength"));
  const fills = all.filter((p) => !p.hasAttribute("pathLength") && !p.closest("symbol"));
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      settle(svg);
      all.forEach(settleSvg);
    },
  });
  const specs = strokes.map((p) => {
    const len = p.getTotalLength();
    return { p, len, a: p.getPointAtLength(0), b: p.getPointAtLength(len) };
  });
  const longest = Math.max(1, ...specs.map((s) => s.len));
  specs.forEach(({ p, len, a, b }) => {
    const back = mode === "center" ? Math.abs(a.x - cx) > Math.abs(b.x - cx) + 0.5 : a.x > b.x + 0.5;
    const from = back ? b.x : a.x;
    const lead = mode === "center" ? Math.min(1, Math.abs(from - cx) / (W / 2)) : Math.min(1, Math.max(0, (from - x0) / W));
    const start = lead * dur * 0.45;
    const d = Math.max(0.2, (dur - start) * (len / longest));
    tl.fromTo(
      p,
      { strokeDasharray: 1, strokeDashoffset: back ? -1 : 1 },
      { strokeDashoffset: 0, duration: d, ease: "power1.inOut", immediateRender: false, autoRound: false },
      start,
    );
  });
  fills.forEach((f) => {
    let at = 0.6 * dur;
    try {
      const bb = f.getBBox();
      const fx = bb.x + bb.width / 2;
      at = (mode === "center" ? Math.abs(fx - cx) / (W / 2) : (fx - x0) / W) * dur * 0.9;
    } catch { /* not rendered: bloom at the default moment */ }
    tl.fromTo(f, { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, at);
  });
  return { tl, handoff: 0.4 * dur };
}

function settleSvg(el: Element) {
  gsap.set(el, { clearProps: "strokeDasharray,strokeDashoffset,opacity,transform,transformOrigin" });
  el.removeAttribute("data-svg-origin");
}

function draw(el: HTMLElement): Built {
  const mode = el.dataset.draw || "ltr";
  const dur = parseFloat(el.dataset.dur || "") || (mode === "center" || mode === "down" ? 0.7 : 1.1);
  if (mode === "pen" || mode === "pen-center") return pen(el as unknown as SVGSVGElement, mode === "pen" ? "ltr" : "center", dur);
  const from = mode === "center" ? "inset(0% 50% 0% 50%)" : mode === "down" ? "inset(0% 0% 100% 0%)" : "inset(0% 100% 0% 0%)";
  const tl = gsap.timeline({ paused: true, onComplete: () => settle(el) });
  tl.fromTo(el, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: mode === "down" ? "power2.inOut" : "sine.inOut", immediateRender: false });
  return { tl, handoff: 0.4 * dur };
}

// ------------------------------------------------------------ type is set
/** hand-off 0.25s: a set is 82% done by 0.15s but still visibly drifting for
 *  another 0.3s, and handing off that early let four pieces move at once */
function set(el: HTMLElement, units: number, dur: number, u: number): Built {
  const tl = gsap.timeline({ paused: true, onComplete: () => settle(el) });
  tl.fromTo(el, { opacity: 0, y: units * u }, { opacity: 1, y: 0, duration: dur, ease: "inkSet", immediateRender: false });
  return { tl, handoff: 0.25 };
}

/** THE SPEC'S MASKED SLIDE-UP, without a wrapper: the line rises by its own
 *  height while its clip, locked to the same tween, holds the window still —
 *  so the React-owned markup is never restructured */
function print(el: HTMLElement): Built {
  const H = el.offsetHeight;
  const p = 0.2 * (parseFloat(getComputedStyle(el).fontSize) || 16);
  const tl = gsap.timeline({ paused: true, onComplete: () => settle(el) });
  tl.fromTo(
    el,
    { y: H, clipPath: `inset(${-p}px ${-p}px ${H - p}px ${-p}px)` },
    { y: 0, clipPath: `inset(${-p}px ${-p}px ${-p}px ${-p}px)`, duration: 0.9, ease: "inkSet", immediateRender: false },
    0,
  ).fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power1.out", immediateRender: false }, 0);
  return { tl, handoff: 0.35 };
}

// ---------------------------------------------------------------- images
/** a photograph settles onto the paper, 1.06 → 1 inside its fixed frame (the
 *  spec's curve). NO BLUR, deliberately: next/image already blurs up from its
 *  placeholder, so a second blur reads as a failed load — worst on the hero,
 *  which is on screen from the first paint — and an animated filter repaints
 *  the whole picture every frame on the phones guests use. The hero is never
 *  hidden either: it is the page's largest paint (LCP), so it only settles. */
function develop(el: HTMLElement): Built {
  const mv = el.querySelector<HTMLElement>(".kn-plate__mv");
  const hero = Boolean(el.closest(".kn-ink__hero"));
  const dur = hero ? 1.4 : 1.3;
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      settle(el);
      if (mv) gsap.set(mv, { clearProps: "transform,transformOrigin,translate,rotate,scale" });
    },
  });
  if (!hero) tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out", immediateRender: false }, 0);
  if (mv) tl.fromTo(mv, { scale: 1.06 }, { scale: 1, duration: dur, ease: "inkDevelop", immediateRender: false }, 0);
  return { tl, handoff: 0.45 * dur };
}

const canMask = () =>
  typeof CSS !== "undefined" &&
  (CSS.supports("mask-image", "linear-gradient(#000,#000)") || CSS.supports("-webkit-mask-image", "linear-gradient(#000,#000)"));

/** a pencil drawing does not come into focus — it is shaded in, from the top
 *  left, by a soft graphite edge (a mask gradient walked across it) */
function sketch(el: HTMLElement): Built {
  const tl = gsap.timeline({ paused: true, onComplete: () => settle(el) });
  if (!canMask()) return { tl: tl.to({}, { duration: 0.01 }), handoff: 0 };
  const o = { p: 100 };
  const put = () => {
    if (inked(el)) return; // never repainted once shaded (see write's paint)
    el.style.setProperty("-webkit-mask-position", `${o.p}% ${o.p}%`);
    el.style.setProperty("mask-position", `${o.p}% ${o.p}%`);
  };
  tl.fromTo(o, { p: 100 }, { p: 0, duration: 1.5, ease: "power1.inOut", onUpdate: put, immediateRender: false });
  return { tl, handoff: 0.45 * 1.5 };
}

// ------------------------------------------------------ the dress colours
/** the string is drawn, and each colour is hung on it as the pen passes —
 *  one damped swing about its knot, the one playful beat on the page */
function hang(el: HTMLElement): Built {
  const svg = el as unknown as SVGSVGElement;
  const W = svg.viewBox.baseVal?.width || 1920;
  const string = svg.querySelector<SVGPathElement>(":scope > path[pathLength]");
  const bows = Array.from(svg.querySelectorAll<SVGGElement>(".kn-ink__bow"));
  const dur = 1.2;
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      settle(el);
      if (string) settleSvg(string);
      bows.forEach(settleSvg);
    },
  });
  if (string) {
    const len = string.getTotalLength();
    const back = string.getPointAtLength(0).x > string.getPointAtLength(len).x;
    tl.fromTo(string, { strokeDasharray: 1, strokeDashoffset: back ? -1 : 1 }, { strokeDashoffset: 0, duration: dur, ease: "sine.inOut", immediateRender: false, autoRound: false }, 0);
  }
  tl.set(bows, { opacity: 0 }, 0);
  bows.forEach((b) => {
    const kx = Number(b.dataset.kx) || 0;
    const ky = Number(b.dataset.ky) || 0;
    const at = dur * (kx / W) + 0.05;
    gsap.set(b, { svgOrigin: `${kx} ${ky}` });
    tl.to(b, { opacity: 1, duration: 0.2, ease: "power1.out" }, at);
    tl.to(b, {
      keyframes: [
        { rotation: -9, duration: 0.35 },
        { rotation: 4, duration: 0.3 },
        { rotation: -1.5, duration: 0.35 },
        { rotation: 0, duration: 0.3 },
      ],
      ease: "sine.inOut",
    }, at);
  });
  return { tl, handoff: 0.6 * dur };
}

// ------------------------------------------------------- the week, and its heart
function tokens(el: HTMLElement, ctx: gsap.Context): Built {
  const rows = Array.from(el.querySelectorAll<HTMLElement>(":scope > ol"));
  const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
  const lis = rows.flatMap((ol) => Array.from(ol.children) as HTMLElement[]);
  const inkd = el.closest(".kn-inkd");
  const traveller = inkd?.querySelector<HTMLElement>(".kn-inkd__traveller") ?? null;
  const heart = traveller?.querySelector<SVGSVGElement>("svg") ?? null;
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      settle(el);
      gsap.set(lis, { clearProps: "opacity,transform,translate,rotate,scale" });
      if (traveller) gsap.set(traveller, { clearProps: "opacity" });
    },
  });
  // the days take their from-state in the SAME instant the strip is shown —
  // shown first, the whole week flashed on and was then wiped off token by
  // token before fading back in (measured)
  tl.set(lis, { opacity: 0, y: 0.35 * fs }, 0);
  tl.set(el, { opacity: 1 }, 0);
  rows.forEach((ol, r) => {
    // clearProps per day as it lands: a transform left on a day <li> makes it
    // a stacking context and traps the white number (z 3) under the heart
    tl.to(Array.from(ol.children), { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.04, clearProps: "transform,translate,rotate,scale" }, r * 0.08);
  });
  // THE HEART BEATS once as its week lands and brings the day's number with
  // it — decided when the beat is due, not when the week was queued: a guest
  // who has scrolled on by then has the heart travelling the line, and it
  // must not blink out and beat there. Only the inner SVG scales (InkDay owns
  // the traveller's transform).
  const beatAt = tl.duration();
  tl.call(() => {
    if (!traveller || !heart || inkd?.classList.contains("is-away")) return;
    ctx.add(() => {
      gsap.fromTo(traveller, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power1.out" });
      gsap.fromTo(heart, { scale: 0.55, transformOrigin: "50% 100%" }, {
        keyframes: [{ scale: 1.08, duration: 0.35, ease: "power2.out" }, { scale: 1, duration: 0.3, ease: "sine.inOut" }],
        clearProps: "transform,transformOrigin,translate,rotate,scale",
      });
    });
  }, undefined, beatAt);
  tl.to({}, { duration: 0.7 }, beatAt); // the week is finished once the beat is
  return { tl, handoff: 0.6 };
}

// ---------------------------------------------------------- the gifts' notes
function rule(el: HTMLElement, u: number): Built {
  const h3 = el.querySelector<HTMLElement>(":scope > h3");
  const body = el.querySelector<HTMLElement>(":scope > .kn-ink__body");
  const tl = gsap.timeline({ paused: true, onComplete: () => settle(el) });
  // the side rule is ruled before anything is written beside it
  tl.fromTo(el, { "--rule": 0 }, { "--rule": 1, duration: 0.7, ease: "power2.inOut", immediateRender: false }, 0);
  if (h3) tl.add(print(h3).tl.paused(false), 0.15);
  if (body) tl.add(set(body, 48, 0.6, u).tl.paused(false), 0.3);
  return { tl, handoff: 0.7 };
}

// ============================================================ the conductor
/** a disposed score shows everything finished — but one task later, so that
 *  an IMMEDIATE remount (React's development double-mount) cancels it and
 *  takes over the parked page instead: settled at once, the whole page
 *  flashed in, hid again and played twice (measured in dev) */
let pendingSettle: number | null = null;

const HERO_OPEN = 2.6; // the cue sheet's last stroke (Ink.tsx) starts here
const MAX_WAIT = 1.2;  // a piece may wait this long for the pen…
const FAST = 1.6;      // …beyond it the backlog plays this much faster,
const STEP = 0.12;     // …this far apart, in reading order

/**
 * @param late the page has ALREADY been seen whole — the failsafe showed it,
 *   or the guest was reading with motion reduced — so nothing is parked
 *   again: everything is shown finished and nothing replays.
 */
function score(root: HTMLElement, ctx: gsap.Context, late: boolean): () => void {
  if (pendingSettle !== null) { window.clearTimeout(pendingSettle); pendingSettle = null; }
  let disposed = false;
  const unit = () => (root.clientWidth || 600) / 1920;

  const claimed = new Set<Element>([
    ...Array.from(root.querySelectorAll(BAND_TITLE)),
    ...Array.from(root.querySelectorAll(BAND_ROWS)),
    ...Array.from(root.querySelectorAll(THANKS)),
  ]);
  const sel = VERBS.map((v) => `[data-${v}]`).join(",");
  const els = Array.from(new Set([...Array.from(root.querySelectorAll<HTMLElement>(sel)), ...(Array.from(claimed) as HTMLElement[])]));
  els.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  const pieces: Piece[] = els.map((el, i) => {
    let kind: Kind = "set";
    if (el.matches(BAND_TITLE)) kind = "write";
    else if (el.matches(BAND_ROWS)) kind = "row";
    else if (claimed.has(el)) kind = "set";
    else for (const v of VERBS) if (el.hasAttribute(`data-${v}`)) { kind = v; break; }
    const cue = el.dataset.cue !== undefined ? Number(el.dataset.cue) : undefined;
    const nested = Boolean(el.parentElement?.closest("[data-rule]"));
    // a piece this page already shows (an earlier score finished it) is done:
    // a remount must never replay what the guest has seen
    const done = inked(el);
    return { el, kind, i, cue, nested, started: done, done, queued: false, enteredAt: 0, ready: true };
  });

  const build = (p: Piece): Built => {
    const el = p.el;
    const u = unit();
    switch (p.kind) {
      case "write": return write(el);
      case "draw": return draw(el);
      case "print": return print(el);
      case "develop": return develop(el);
      case "sketch": return sketch(el);
      case "hang": return hang(el);
      case "tokens": return tokens(el, ctx);
      case "rule": return rule(el, u);
      case "enter": return set(el, 40, 0.5, u);
      case "row": return set(el, el.matches("button") ? 40 : 32, 0.5, u);
      default: return set(el, 48, 0.6, u);
    }
  };

  const band = root.querySelector<HTMLElement>(".kn-ink__band");
  const bandPieces = () => pieces.filter((p) => band?.contains(p.el));
  const checkBand = () => {
    if (band && !inked(band) && bandPieces().every((p) => p.done)) band.classList.add("is-inked");
  };
  const markDone = (p: Piece) => {
    settle(p.el);
    p.done = true;
    p.started = true;
    pieces.filter((q) => q.nested && p.el.contains(q.el)).forEach((q) => { settle(q.el); q.done = true; q.started = true; });
    checkBand();
  };

  /** show a piece finished, now (focus reached it, it scrolled past, print) */
  const finish = (p: Piece) => {
    if (p.done) return;
    log("finish", p.el);
    try {
      ctx.add(() => {
        if (!p.tl) p.tl = build(p).tl;
        p.tl.progress(1);
      });
    } catch { /* whatever went wrong, the piece is shown below */ }
    markDone(p);
  };

  /** anything unexpected: show the whole page, finished, and stop */
  const bail = (why: unknown) => {
    if (disposed) return;
    disposed = true;
    log(`bail ${why instanceof Error ? why.message : String(why)}`.slice(0, 80));
    pieces.forEach((p) => { p.tl?.kill(); markDone(p); });
    band?.classList.add("is-inked");
  };

  const launch = (p: Piece, delay: number, b: Built, speed = 1) => {
    p.tl = b.tl;
    p.moved = b.moved;
    b.tl.timeScale(speed);
    // setting onComplete REPLACES the builder's own (which clears a photo's
    // mover, a week's days, a drawing's strokes): chain it, never drop it
    const own = b.tl.eventCallback("onComplete") as unknown as (() => void) | undefined;
    b.tl.eventCallback("onComplete", () => {
      own?.();
      log("done", p.el);
      markDone(p);
    });
    log(`cue+${delay.toFixed(2)}${speed !== 1 ? `x${speed}` : ""}`, p.el);
    const go = () => { if (!p.done && !disposed) { log("play", p.el); b.tl.play(); } };
    if (delay > 0) gsap.delayedCall(delay, go);
    else go();
  };

  // ---- ONE PEN AT A TIME, pulled -----------------------------------------
  const queue: Piece[] = [];
  let penFree = gsap.ticker.time;
  let heroUntil = -Infinity;
  let timer: gsap.core.Tween | null = null;
  const pctOf = (p: Piece) => (p.kind === "develop" || p.kind === "sketch" ? 85 : p.kind === "enter" || p.kind === "row" ? 92 : 88);
  const capOf = (p: Piece) => (p.kind === "sketch" ? 1.2 : 0.6);

  const arm = (p: Piece) =>
    ScrollTrigger.create({ trigger: p.el, start: `top ${pctOf(p)}%`, once: true, onEnter: () => cue(p) });

  const pump = () => {
    if (timer || disposed || !queue.length) return;
    const wait = Math.max(0, penFree - gsap.ticker.time);
    ctx.add(() => { timer = gsap.delayedCall(wait, take); });
  };

  /** the pen is free: take the next piece in reading order. One that has
   *  scrolled above the viewport meanwhile is shown at once and costs the
   *  pen nothing; one the guest has scrolled back up past waits to enter
   *  again; a picture that is still decoding holds the pen briefly. */
  const take = () => {
    timer = null;
    if (disposed) return;
    try {
      ctx.add(() => {
        const now = gsap.ticker.time;
        const vh = window.innerHeight;
        while (queue.length) {
          const p = queue[0];
          if (p.done) { queue.shift(); continue; }
          const r = p.el.getBoundingClientRect();
          if (r.bottom < 0) { queue.shift(); finish(p); continue; }
          if (r.top > vh) { queue.shift(); p.queued = false; p.started = false; arm(p); continue; }
          if (!p.ready && now - p.enteredAt < capOf(p)) { timer = gsap.delayedCall(0.1, take); return; }
          queue.shift();
          const lag = now - Math.max(p.enteredAt, heroUntil);
          const speed = lag > MAX_WAIT ? FAST : 1;
          let b: Built;
          try { b = build(p); } catch (e) { log("error", p.el); markDone(p); continue; }
          launch(p, 0, b, speed);
          penFree = now + (speed > 1 ? STEP : b.handoff / speed);
          break;
        }
      });
    } catch (e) { bail(e); return; }
    pump();
  };

  const cue = (p: Piece) => {
    if (p.done || p.queued || disposed) return;
    if (p.el.getBoundingClientRect().bottom < 0) { finish(p); return; } // already scrolled past
    p.started = true;
    p.queued = true;
    p.enteredAt = gsap.ticker.time;
    // never develop or sweep a blur placeholder: the real pixels first
    const img = p.kind === "develop" || p.kind === "sketch" ? p.el.querySelector("img") : null;
    if (img && !(img.complete && img.naturalWidth)) {
      p.ready = false;
      const ok = () => { p.ready = true; };
      img.addEventListener("load", ok, { once: true });
      img.addEventListener("error", ok, { once: true });
    }
    let k = queue.length;
    while (k > 0 && queue[k - 1].i > p.i) k--;
    queue.splice(k, 0, p);
    pump();
  };

  // A HAND THAT REACHES FOR SOMETHING IS NEVER KEPT WAITING: focus, a click
  // or a mouse press on a parked control shows it at once — inside the RSVP
  // band, the whole band (a guest who typed a name and pressed Enter before
  // scrolling on must see the form they get back). A TOUCH press does not
  // count: every phone scroll begins with one, and a thumb that started a
  // scroll on a form row used to finish the band unseen; a real tap
  // arrives as focusin or click.
  const onReach = (e: Event) => {
    const t = e.target as Element | null;
    if (!t || disposed) return;
    if (e.type === "pointerdown" && (e as PointerEvent).pointerType !== "mouse") return;
    if (e.type !== "focusin" && !t.closest("input, textarea, select, button, a, label")) return;
    if (band?.contains(t)) {
      bandPieces().forEach(finish);
      band.classList.add("is-inked");
      return;
    }
    pieces.filter((p) => !p.done && p.el.contains(t)).forEach(finish);
  };
  root.addEventListener("focusin", onReach);
  root.addEventListener("pointerdown", onReach);
  root.addEventListener("click", onReach);
  // …and a focus that landed BEFORE this score existed (a keyboard guest
  // tabbing in while the chunk was still on its way) is honoured now
  const had = document.activeElement;
  if (had && root.contains(had)) onReach({ type: "focusin", target: had } as unknown as Event);

  // A FACE THAT LANDS MID-WRITE moves the glyphs under a pen measured on the
  // old ones: a line being written is then finished at once rather than
  // clipped to stale geometry — but only if its text really moved (any face
  // finishing anywhere fires this; it used to cut the names short).
  const onFaces = () => {
    pieces.forEach((p) => { if (p.kind === "write" && p.tl && !p.done && p.tl.isActive() && p.moved?.()) finish(p); });
  };
  document.fonts?.addEventListener?.("loadingdone", onFaces);

  // PRINT is the finished page: nothing parked, nothing half-written
  const onPrint = () => { pieces.forEach(finish); band?.classList.add("is-inked"); };
  window.addEventListener("beforeprint", onPrint);

  /** the page has been seen whole: show it finished, park nothing again */
  const showAll = () => {
    root.dataset.inkShown = "1";
    pieces.forEach((p) => { if (!p.done) markDone(p); });
    band?.classList.add("is-inked");
  };

  const start = async () => {
    const shown = () => late || root.dataset.inkShown === "1" || getComputedStyle(root).getPropertyValue("--ink-park").trim() === "0";
    if (shown()) { log("start-late"); showAll(); return; }
    log("start");

    // THE PEN MEASURES THE FACE IT WRITES, never a fallback's: the ink faces
    // are not preloaded and swap in (Hurricane sets 31% narrower than its
    // fallback). The first screen waits for the names' own face — asked for
    // by name, since `fonts.ready` alone can resolve before a face has even
    // started loading — up to 3s. The failsafe keeps running meanwhile, and
    // the verdict is read again after the wait: if it has shown the page,
    // the page stays shown.
    const names = root.querySelector<HTMLElement>(".kn-ink__names") ?? root.querySelector<HTMLElement>("[data-write]");
    const face = names ? getComputedStyle(names).font : "";
    const text = names?.textContent || undefined;
    const faceIn = () => {
      try { return !face || document.fonts?.check?.(face, text) !== false; } catch { return true; }
    };
    await Promise.race([Promise.all([document.fonts?.ready, face ? document.fonts?.load(face, text) : null]).catch(() => undefined), sleep(1200)]);
    if (!faceIn()) await Promise.race([document.fonts?.load(face, text).catch(() => undefined), sleep(1800)]);
    if (disposed) return;
    if (shown()) { log("start-late"); showAll(); return; }

    try {
      ctx.add(() => {
        // take the parked page over from the failsafe — only now, with
        // nothing left that can fail between this line and the pieces
        // being armed (a throw after it once left the whole page parked)
        root.style.animation = "none";
        const t0 = gsap.ticker.time;
        const vh = window.innerHeight;
        let hero = false;
        for (const p of pieces) {
          if (p.done || p.nested || p.cue === undefined) continue;
          const r = p.el.getBoundingClientRect();
          if (r.bottom < 0) { finish(p); continue; }
          // a first-screen piece below this viewport's fold becomes a scroll piece
          if (r.top > vh) { p.cue = undefined; continue; }
          p.started = true;
          hero = true;
          launch(p, p.cue, build(p));
        }
        if (hero) { heroUntil = t0 + HERO_OPEN; penFree = heroUntil; }

        for (const p of pieces) {
          if (p.started || p.done || p.nested) continue;
          const r = p.el.getBoundingClientRect();
          if (r.bottom < 0) { finish(p); continue; }
          // the spec's threshold: a piece already 15% inside the first screen
          // (the letter's title sits 95% in view on a phone) is written after
          // the hero, not held until the guest happens to scroll
          const inView = r.height > 0 ? (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / r.height : 0;
          if (inView >= 0.15) cue(p);
          else arm(p);
        }
      });
    } catch (e) {
      bail(e);
    }
  };
  start().catch(bail);

  return () => {
    disposed = true;
    log("dispose");
    timer?.kill();
    root.removeEventListener("focusin", onReach);
    root.removeEventListener("pointerdown", onReach);
    root.removeEventListener("click", onReach);
    document.fonts?.removeEventListener?.("loadingdone", onFaces);
    window.removeEventListener("beforeprint", onPrint);
    // EVERY piece is shown finished — the done ones too, since GSAP's revert
    // (which runs before this) rewinds their tweens — a task later, unless a
    // new score takes the page over first (see pendingSettle)
    pendingSettle = window.setTimeout(() => {
      pendingSettle = null;
      pieces.forEach((p) => { settle(p.el); p.done = true; });
      band?.classList.add("is-inked");
      root.style.removeProperty("animation");
    }, 0);
  };
}

/** Mounted by InkPage on a guest's page only (never in an embed). Renders
 *  nothing; conducts the page it sits in. */
export default function InkScore() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".kn-tp--ink:not(.kn-tp--embed) .kn-ink");
    if (!root) return;
    // A score that starts on a motion-setting SWITCH (reduced → full) is
    // late by definition: the guest was reading the finished page.
    const movingAtMount = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    let runs = 0;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (ctx) => score(root, ctx, runs++ > 0 || !movingAtMount));
    return () => mm.revert();
  }, []);
  return null;
}
