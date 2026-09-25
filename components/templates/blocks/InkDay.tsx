"use client";

import { useEffect, useMemo, useRef } from "react";
import { MONTHS, MONTHS_OF } from "./Family";
// the two ornaments this client part draws, from their own small module:
// ./inkArt is the whole set, and importing from it put every ornament the
// server already drew into the script of every template page (inkArt.ts)
import { heart as inkHeart, tail as inkTail } from "./inkLine";
import type { InkArt } from "./inkArt";
import { weekdayFromIso } from "@/lib/draft";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE DAY (wedding-3, the client's Figma file «Wedding»): the month, the week
// with the day inside the maroon heart, and the hand-inked line the day runs
// down — and the heart RUNS DOWN IT WITH THE SCROLL (client, 2026-09-24:
// «red heart must move with scroll and go to every place and hour and show
// what will happen this day»).
//
// Geometry is the file's own, in its design px (the page is 1920 wide; the
// CSS scales everything by --u = 1/1920 of the column): the heart is 194×193,
// its tip 40 below the day row; the first stop's dot sits 502 below that tip,
// each next one 373 further (the file's mean); dots swing between x 630 and
// 1150; each stop's words stand OUTSIDE the curve in a column centred on x 378
// (left) or 1390 (right), the hour's baseline level with its dot.
//
// The line is drawn procedurally rather than pinned: the file draws seven
// stops, a couple has one to five. The tail (the curl into a small heart) IS
// the file's vector, hung off the last dot.
//
// How the heart travels: the point where the reader's eye is — the middle of
// the scroller's viewport — is found on the line (the line only ever moves
// down, so its height picks exactly one place on it), and the heart's tip is
// put there. A stop is REACHED once the heart gets to its dot; only then do
// its hour, its name and its place appear. Reduced motion, no JS and the
// first paint all show the finished page: heart on the day, every stop out.
// ============================================================================

const W = 1920; // the file's page width, in its own px
const HEART = { w: 194, h: 193 };
const LEAD = 502; // heart tip → first dot
const STEP = 373; // dot → dot
const TAIL = 324; // the tail vector's height below the last dot
const XL = 630;
const XR = 1150;
// each stop's words hang OUTSIDE the curve, anchored on the side away from
// it: a left stop ENDS 60 short of its dot (the file: text to 569, dot 631),
// a right stop BEGINS 117 past its dot (text from 1192, dot 1076) — so a long
// name grows outward, never into the line
const END_L = XL - 60;
const START_R = XR + 117;

/** Monday-first week names, as the file's strip reads (MON … SUN) */
const WD: Record<Lang, string[]> = {
  hy: ["Երկ", "Երք", "Չրք", "Հնգ", "Ուրբ", "Շբթ", "Կիր"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
};

export type InkStop = { time: string; name: T; place: T };

const PAINT: Record<string, string> = { "#631729": "var(--ink-heart)", black: "var(--ink-deep)" };
function Art({ a, className, style }: { a: InkArt; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox={`0 0 ${a.w} ${a.h}`} style={style} aria-hidden="true" focusable="false">
      {a.paths.map((p, i) => (
        <path key={i} d={p.d} style={{ fill: p.fill ? PAINT[p.fill] ?? p.fill : "none", stroke: p.stroke ? PAINT[p.stroke] ?? p.stroke : undefined, strokeWidth: p.sw }} />
      ))}
    </svg>
  );
}

/** the nearest ancestor that actually scrolls — the editor's preview pane,
 *  or nothing (the window) on a guest's own page */
function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let e = el?.parentElement; e; e = e.parentElement) {
    const oy = getComputedStyle(e).overflowY;
    if ((oy === "auto" || oy === "scroll") && e.scrollHeight > e.clientHeight + 1) return e;
  }
  return null;
}

export default function InkDay({ lang, iso, stops }: { lang: Lang; iso: string; stops: InkStop[] }) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  const y = m ? Number(m[1]) : 2026, mo = m ? Number(m[2]) - 1 : 0, d = m ? Number(m[3]) : 1;

  // the real week the date falls in, Monday first — the heart lands on the
  // day's own weekday column (a Saturday wedding sits sixth, as in the file)
  const week = useMemo(() => {
    const at = new Date(Date.UTC(y, mo, d));
    const monday = d - ((at.getUTCDay() + 6) % 7);
    return Array.from({ length: 7 }, (_, k) => {
      const x = new Date(Date.UTC(y, mo, monday + k));
      return { k, n: x.getUTCDate(), on: x.getUTCMonth() === mo && x.getUTCDate() === d };
    });
  }, [y, mo, d]);
  const col = Math.max(0, week.findIndex((x) => x.on));
  const hx = 217 + 248 * col; // the file's MON-label column centres: 217 + 248k

  // the line, in design px: from the heart's tip to each dot. Memoised on the
  // count alone — a fresh array each render would re-arm the scroll effect
  const dots = useMemo(() => Array.from({ length: stops.length }, (_, i) => ({ x: i % 2 ? XR : XL, y: LEAD + i * STEP })), [stops.length]);
  const last = dots[dots.length - 1] ?? { x: XL, y: LEAD };
  const H = last.y + TAIL + 8;
  const d0 = dots.length
    ? dots.map((p, i) => {
        const prev = i === 0 ? { x: hx, y: 0 } : dots[i - 1];
        const dy = p.y - prev.y;
        // vertical tangents at every dot (the file's own S-bends); the lead-in
        // falls briefly under the heart before it sweeps across
        const c1y = prev.y + dy * (i === 0 ? 0.42 : 0.55);
        return `${i === 0 ? `M ${hx} 0 ` : ""}C ${prev.x} ${c1y} ${p.x} ${p.y - dy * 0.55} ${p.x} ${p.y}`;
      }).join(" ")
    : `M ${hx} 0 L ${hx} ${LEAD}`;

  const root = useRef<HTMLDivElement | null>(null);
  const field = useRef<HTMLDivElement | null>(null);
  const path = useRef<SVGPathElement | null>(null);
  const heart = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = root.current, fl = field.current, pa = path.current, ht = heart.current;
    if (!el || !fl || !pa || !ht) return;

    const items = [...el.querySelectorAll<HTMLElement>(".kn-inkd__stop")];
    const blots = [...el.querySelectorAll<SVGCircleElement>(".kn-inkd__line circle")];
    // INK DOES NOT COME OFF: a stop is written out once and stays written. A
    // stop reached by the heart takes a blot of ink on its dot; one that is
    // simply there (seeded, below) takes no blot — that would be motion on
    // something the guest was already reading.
    const reach = (i: number, seeded = false) => {
      if (items[i].classList.contains("is-reached")) return;
      items[i].classList.add("is-reached");
      blots[i]?.classList.add("is-reached");
      if (seeded) blots[i]?.classList.add("is-seeded");
    };

    // The heart travels only while motion is allowed — and the setting can
    // change while the page is open: turned on mid-visit, the heart stops,
    // every stop is simply there and STAYS reached, so turning it off again
    // never hides a stop the guest has read (it used to ignore the switch and
    // keep moving; InkScore and Lenis already follow it).
    const live = () => {
      // a lookup of the line by height: the path only ever descends, so a height
      // names one length along it
      const total = pa.getTotalLength();
      const table: Array<{ l: number; x: number; y: number }> = [];
      for (let i = 0; i <= 480; i++) {
        const l = (total * i) / 480;
        const p = pa.getPointAtLength(l);
        table.push({ l, x: p.x, y: p.y });
      }
      const at = (yy: number) => {
        if (yy <= 0) return table[0];
        if (yy >= table[table.length - 1].y) return table[table.length - 1];
        let lo = 0, hi = table.length - 1;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (table[mid].y < yy) lo = mid; else hi = mid; }
        const a = table[lo], b = table[hi], k = (yy - a.y) / (b.y - a.y || 1);
        return { l: a.l + (b.l - a.l) * k, x: a.x + (b.x - a.x) * k, y: yy };
      };

      // which box scrolls can change after mount: the editor mounts its preview
      // hidden on a phone (nothing scrolls yet) and shows it later. So the
      // scroller is looked up again whenever the field's size changes, and the
      // scroll listener sits on the window in CAPTURE — it hears every scroll,
      // the window's and any pane's, whichever turns out to carry the page
      let scroller = scrollParent(el);

      // SEED THE RATCHET WITH WHAT THE GUEST CAN ALREADY SEE, in the same
      // instant the heart takes over: after a reload mid-page (or JS arriving
      // late) the stops were painted by the server and read — going live used
      // to hide every one below the eye line until the guest scrolled again.
      // If the page has already shown itself whole (the ink failsafe fired, or
      // a score found it shown), every stop is seeded.
      const board = el.closest<HTMLElement>(".kn-ink");
      const wholeShown = Boolean(board) && (getComputedStyle(board!).getPropertyValue("--ink-park").trim() === "0" || board!.dataset.inkShown === "1");
      const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
      items.forEach((it, i) => { if (wholeShown || it.getBoundingClientRect().top < bottom) reach(i, true); });
      el.classList.add("is-live");

      let raf = 0;
      const paint = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        const fr = fl.getBoundingClientRect();
        if (!fr.width) return; // hidden (an unshown preview): nothing to place
        const s = fr.width / W; // design px → screen px
        const view = scroller ? scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight };
        // the reader's eye: a little above the viewport's middle, so a stop is
        // reached while it still has room to be read below the heart
        const eye = view.top + view.height * 0.46;
        const yy = Math.min(Math.max((eye - fr.top) / s, 0), last.y);
        const p = at(yy);
        // tip on the line; the heart hangs above the point it stands on
        ht.style.transform = `translate(${(p.x - HEART.w / 2) * s}px, ${(p.y - HEART.h) * s + (fr.top - el.getBoundingClientRect().top)}px)`;
        el.classList.toggle("is-away", yy > 6);
        // a stop is written out when the heart first reaches it, and stays so
        // when the guest scrolls back up (it used to hide again)
        items.forEach((_, i) => { if (yy >= dots[i].y - 30) reach(i); });
      };
      const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
      // a size change places the heart AT ONCE, not a frame later: the observer
      // reports after layout and before paint, so an un-hidden preview (the
      // editor's phone tab) would otherwise paint one frame with the heart at
      // the block's corner, where it waited while nothing could be measured
      const reflow = () => { scroller = scrollParent(el); paint(); };
      paint();
      window.addEventListener("scroll", ask, { capture: true, passive: true });
      window.addEventListener("resize", reflow);
      const ro = new ResizeObserver(reflow);
      ro.observe(fl);
      return () => {
        window.removeEventListener("scroll", ask, { capture: true });
        window.removeEventListener("resize", reflow);
        ro.disconnect();
        if (raf) cancelAnimationFrame(raf);
        el.classList.remove("is-live", "is-away");
      };
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop: (() => void) | null = null;
    const apply = () => {
      if (mq.matches) {
        // motion reduced (at mount, or switched on now): no heart, every
        // stop simply there — and remembered as reached
        if (stop) { stop(); stop = null; }
        items.forEach((_, i) => reach(i, true));
      } else if (!stop) {
        stop = live();
      }
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => {
      mq.removeEventListener?.("change", apply);
      stop?.();
      stop = null;
      // a changed schedule (the editor) starts its reach again from where the
      // reader is — React keeps these nodes, and would keep the classes too
      items.forEach((it) => it.classList.remove("is-reached"));
      blots.forEach((b) => b.classList.remove("is-reached", "is-seeded"));
    };
  }, [d0, last.y, dots]);

  // A WORD NEVER CROSSES THE LINE. A stop's column is capped (560 of the
  // file's px — 105 on a 360 phone, 93 on a 320) and one word can be wider:
  // in capitals at the 11-px floor «ՊՍԱԿԱԴՐՈՒԹՅՈՒՆ», the commonest first
  // stop, is 108, and the column grew towards the line and ran it across its
  // dot. Breaking it anywhere (the CSS's last resort) left «Ն» alone on a line
  // at 360. So a label whose longest word overflows is set just small enough
  // to fit, never under 9 px; only a word too long even then breaks. Every
  // label that fits keeps the file's size. Re-measured when the column
  // resizes and once the faces have loaded (a fallback face measures wrong).
  const words = stops.map((s) => `${t(lang, s.name)}\n${t(lang, s.place)}`).join("\n\n");
  useEffect(() => {
    const fl = field.current;
    if (!fl) return;
    let alive = true;
    const fit = () => {
      const els = [...fl.querySelectorAll<HTMLElement>(".kn-inkd__stop > :is(span, small)")];
      // all written, then all read, then all written: one layout, not one each
      els.forEach((e) => { e.style.fontSize = ""; e.style.overflowWrap = "normal"; e.style.width = "min-content"; });
      const m = els.map((e) => ({ e, word: e.getBoundingClientRect().width, room: e.parentElement!.getBoundingClientRect().width, fs: parseFloat(getComputedStyle(e).fontSize) }));
      els.forEach((e) => { e.style.overflowWrap = ""; e.style.width = ""; });
      m.forEach(({ e, word, room, fs }) => {
        if (room && word > room + 0.5) e.style.fontSize = `${Math.max(9, Math.floor(((fs * room) / word) * 10) / 10)}px`;
      });
    };
    const ro = new ResizeObserver(fit); // its first report is the first fit
    ro.observe(fl);
    document.fonts?.ready.then(() => { if (alive) fit(); });
    return () => { alive = false; ro.disconnect(); };
  }, [words]);

  return (
    <div className="kn-inkd" ref={root}>
      {/* the month is PRINTED up through its own window; the week is the
          page's one run of tokens, printed column by column, and the heart
          beats once on the day as it lands (InkScore.tsx) */}
      <p className="kn-inkd__month" data-print="">{MONTHS[lang][mo]} {y}</p>
      {/* the week is a picture of a date, not a table to navigate: one name
          for the reader, the grid hidden from the accessibility tree. The
          name says what the picture shows — the weekday the heart marks —
          with the month in the genitive a date takes («14 նոյեմբերի») */}
      <div className="kn-inkd__week" role="img" aria-label={`${t(lang, weekdayFromIso(iso))}, ${d} ${MONTHS_OF[lang][mo]} ${y}`} data-tokens="">
        <ol className="kn-inkd__wd" aria-hidden="true">{week.map((x, i) => <li key={x.k}>{WD[lang][i]}</li>)}</ol>
        <ol className="kn-inkd__days" aria-hidden="true">
          {week.map((x) => (
            <li key={x.k} className={x.on ? "is-day" : undefined}>
              {x.on && <Art a={inkHeart} className="kn-inkd__dayHeart" />}
              <span>{x.n}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* no schedule (hidden in the editor, or not yet written): the week
          stands alone — a line with no stop to reach would end in a tail
          hanging off nothing, and there is nowhere for the heart to go */}
      {stops.length > 0 && (
      <div className="kn-inkd__field" ref={field} style={{ aspectRatio: `${W} / ${H}` }}>
        <svg className="kn-inkd__line" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          <path ref={path} d={d0} />
          {dots.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={13} />)}
        </svg>
        {/* the file's tail, entering 22 px into its 615-px box at the last dot.
            Mirrored when the last stop sits on the right, so the curl turns in
            towards the page — the mirror moves the entry point to the box's far
            side, so the box starts (615 − 22) left of the dot */}
        <Art
          a={inkTail}
          className={`kn-inkd__tail${last.x > W / 2 ? " is-r" : ""}`}
          style={{
            left: `${((last.x > W / 2 ? last.x - (inkTail.w - 22) : last.x - 22) / W) * 100}%`,
            top: `${((last.y - 3) / H) * 100}%`,
            width: `${(inkTail.w / W) * 100}%`,
          }}
        />
        <ol className="kn-inkd__stops">
          {stops.map((s, i) => (
            <li
              key={i}
              className={`kn-inkd__stop${i % 2 ? " is-r" : ""}`}
              style={
                i % 2
                  ? { left: `${(START_R / W) * 100}%`, top: `${((dots[i].y - 142.5) / H) * 100}%` }
                  : { right: `${((W - END_L) / W) * 100}%`, top: `${((dots[i].y - 142.5) / H) * 100}%` }
              }
            >
              <b>{s.time}</b>
              <span>{t(lang, s.name)}</span>
              {t(lang, s.place) && <small>{t(lang, s.place)}</small>}
            </li>
          ))}
        </ol>
      </div>
      )}

      {/* the traveller: the same heart, lifted off the day and walked down the
          line by the effect above; only drawn once JS has taken over */}
      {stops.length > 0 && (
        <span className="kn-inkd__traveller" ref={heart} aria-hidden="true">
          <Art a={inkHeart} />
        </span>
      )}
    </div>
  );
}
