"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";

// ============================================================================
// THE MARQUEE — a row of examples that walks itself, and that the reader can
// TAKE HOLD OF: one offset drives both, so a drag simply moves the same
// number the clock was moving, and letting go hands it back with the throw's
// momentum. Our own captured screens, never remote images, so the page still
// makes no third-party request.
//
// IT ONLY SPINS WHEN IT CAN SPIN HONESTLY: a loop needs enough distinct
// designs to fill the track twice, or the reader just watches the same two
// cards come round again (the engagement chapter's old rolling strip was
// retired for exactly that). Below the threshold it renders as a plain
// centred row — and starts moving on its own the day the catalogue grows.
// ============================================================================

export type MarqueeItem = {
  id: string;
  name: string;
  img: StaticImageData | string;
  href: string;
};

export default function Marquee({
  items,
  label,
  reverse = false,
  seconds = 46,
  min = 5,
}: {
  items: MarqueeItem[];
  label: string;
  reverse?: boolean;
  /** one full pass of the track */
  seconds?: number;
  /** fewer distinct designs than this and the row stands still */
  min?: number;
}) {
  const spin = items.length >= min;
  // the track is doubled so the halfway point lands exactly on the seam
  const run = spin ? [...items, ...items] : items;
  const track = useRef<HTMLUListElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  // one number the clock and the hand both write to
  const st = useRef({ x: 0, half: 0, drag: false, moved: 0, px: 0, vel: 0, hover: false, id: 0, last: 0, midAt: 0, pid: 0, captured: false, goal: null as number | null });
  // THE COVERFLOW. Every card carries `--n`: 0 out at the edges, 1 dead
  // centre, and the CSS scales it by that. The nearness is computed from
  // ARITHMETIC, not from getBoundingClientRect — the geometry is measured
  // once per resize, so a frame costs a subtraction per card instead of
  // forcing layout across the whole row sixty times a second.
  const geo = useRef<{ mid: number[]; boxW: number }>({ mid: [], boxW: 0 });
  const near = useRef<number[]>([]);
  const mid = useRef<Element | null>(null);
  // the dots under the row. They are written from the SAME loop that sizes
  // the cards — never from React state, which would re-render the whole row
  // sixty times a second to move one pill.
  const dots = useRef<HTMLOListElement | null>(null);
  // 0, not -1: the markup ships with the first dot lit so the row is never
  // dotless before the first frame, and the first update has to know which
  // one to put out — starting at -1 left two of them burning.
  const lit = useRef(0);
  const measureGeo = useCallback(() => {
    const host = box.current, row = track.current;
    if (!host || !row) return;
    geo.current.boxW = host.clientWidth;
    geo.current.mid = Array.from(row.children, (li) => {
      const el = li as HTMLElement;
      return el.offsetLeft + el.offsetWidth / 2;
    });
  }, []);
  /** write every card's nearness, and move `is-mid` to the closest one */
  const paint = useCallback((x: number) => {
    const row = track.current;
    const g = geo.current;
    if (!row || !g.boxW || !g.mid.length) return;
    const centre = g.boxW / 2;
    // The falloff. Half the box would finish the shrink just as the mask eats
    // the card — right on a desktop, but on a phone only one card either side
    // is on stage and the ramp reads as a step. Never let it be tighter than
    // a couple of cards, so the size always changes GRADUALLY.
    const pitch = g.mid.length > 1 ? g.mid[1] - g.mid[0] : g.boxW;
    const reach = Math.max(g.boxW * 0.46, pitch * 2.2);
    let best = -1, bestN = -1;
    for (let i = 0; i < g.mid.length; i++) {
      const d = Math.abs(g.mid[i] + x - centre);
      const n = d >= reach ? 0 : 1 - d / reach;
      if (n > bestN) { bestN = n; best = i; }
      // only write when it actually moved — a custom property write costs a
      // style recalc on that element whether or not the value changed
      if (Math.abs(n - (near.current[i] ?? -1)) < 0.008) continue;
      near.current[i] = n;
      (row.children[i] as HTMLElement).style.setProperty("--n", n.toFixed(3));
    }
    const el = best >= 0 ? row.children[best] : null;
    if (el !== mid.current) {
      mid.current?.classList.remove("is-mid");
      el?.classList.add("is-mid");
      mid.current = el;
    }
    // the track is doubled, so the second copy of a design lights the same dot
    const d = dots.current;
    if (d && best >= 0) {
      const k = best % items.length;
      if (k !== lit.current) {
        (d.children[lit.current] as HTMLElement | undefined)?.firstElementChild?.setAttribute("aria-current", "false");
        const b2 = d.children[k]?.firstElementChild as HTMLElement | undefined;
        b2?.setAttribute("aria-current", "true");
        lit.current = k;
      }
    }
  }, [items.length]);

  /** bring design `i` to the middle — the dots are a control, not a caption */
  const goTo = useCallback((i: number) => {
    const g = geo.current, s = st.current;
    if (!g.mid.length || !s.half) return;
    // aim at whichever copy of that card is nearer, so the row never takes
    // the long way round the loop to reach the design under the reader's hand
    const want = g.boxW / 2 - g.mid[i];
    let target = want;
    while (target - s.x > s.half / 2) target -= s.half;
    while (s.x - target > s.half / 2) target += s.half;
    s.goal = target;
    s.vel = 0;
  }, []);

  useEffect(() => {
    if (!spin) return;
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // no walk, but the row still reads as a row: measure once and let the
      // centre card stand at full size while its neighbours sit back
      measureGeo();
      paint(0);
      return;
    }
    const s = st.current;
    const measure = () => { s.half = el.scrollWidth / 2; measureGeo(); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // px per second, from the pass the caller asked for
    const speed = () => (s.half / seconds) * (reverse ? -1 : 1);
    const frame = (t: number) => {
      const dt = s.last ? Math.min(64, t - s.last) / 1000 : 0;
      s.last = t;
      if (s.goal !== null) {
        // a dot was pressed: ease to it, then hand the row back to the clock
        s.x += (s.goal - s.x) * Math.min(1, dt * 7);
        if (Math.abs(s.goal - s.x) < 0.5) { s.x = s.goal; s.goal = null; }
      } else if (!s.drag && !s.hover && s.half) {
        // the throw decays into the steady walk
        s.x -= (speed() - s.vel) * dt;
        s.vel *= 0.94;
        if (Math.abs(s.vel) < 1) s.vel = 0;
      }
      if (s.half) {
        // keep the offset inside one track length, so the seam never shows —
        // and carry the dot's target with it, or the ease would be chasing a
        // number the wrap had just moved out from under it
        while (s.x <= -s.half) { s.x += s.half; if (s.goal !== null) s.goal += s.half; }
        while (s.x > 0) { s.x -= s.half; if (s.goal !== null) s.goal -= s.half; }
        el.style.transform = `translate3d(${s.x}px,0,0)`;
      }
      // the coverflow rides the SAME offset the walk does, so the scale can
      // never drift out of step with where a card actually is
      paint(s.x);
      s.id = requestAnimationFrame(frame);
    };
    s.id = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(s.id); ro.disconnect(); s.last = 0; };
  }, [spin, seconds, reverse, measureGeo, paint]);

  // a row that stands still has a middle too - mark it once, so the centred
  // design breathes even where there are not enough cards to walk
  useEffect(() => {
    if (spin) return;
    measureGeo();
    paint(0);
    const ro = new ResizeObserver(() => { measureGeo(); paint(0); });
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [spin, measureGeo, paint]);

  const down = useCallback((e: React.PointerEvent) => {
    if (!spin) return;
    const s = st.current;
    s.drag = true; s.moved = 0; s.px = e.clientX; s.vel = 0; s.pid = e.pointerId;
    s.goal = null; // a hand on the row outranks a dot that was pressed
    // NO capture yet: capturing on pointerdown retargets the whole tap —
    // click included — to this box, so a clean tap on a card never reached
    // its link (the row read as «not clickable», client 2026-08-31). The
    // pointer is captured only once a real drag begins, below.
  }, [spin]);

  const move = useCallback((e: React.PointerEvent) => {
    const s = st.current;
    if (!s.drag) return;
    const dx = e.clientX - s.px;
    s.px = e.clientX;
    s.moved += Math.abs(dx);
    s.x += dx;
    s.vel = dx * 60; // carried into the release
    if (s.moved > 6 && !s.captured) {
      s.captured = true;
      try { box.current?.setPointerCapture(s.pid); } catch { /* fine */ }
    }
  }, []);

  const up = useCallback((e: React.PointerEvent) => {
    const s = st.current;
    if (!s.drag) return;
    s.drag = false;
    if (s.captured) {
      s.captured = false;
      try { box.current?.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    }
  }, []);

  // a drag that travelled must not also open the card it ended on
  const click = useCallback((e: React.MouseEvent) => {
    if (st.current.moved > 6) { e.preventDefault(); st.current.moved = 0; }
  }, []);

  return (
    <div
      ref={box}
      className={`kn-mq${reverse ? " kn-mq--rev" : ""}${spin ? " kn-mq--live" : ""}`}
      data-still={spin ? undefined : ""}
      aria-label={label}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerEnter={() => { st.current.hover = true; }}
      onPointerLeave={() => { st.current.hover = false; st.current.drag = false; }}
    >
      <ul className="kn-mq__row" ref={track} style={{ "--kn-mq-s": `${seconds}s` } as React.CSSProperties}>
        {run.map((it, i) => (
          <li key={`${it.id}-${i}`} className="kn-mq__it" aria-hidden={spin && i >= items.length ? true : undefined}>
            <Link href={it.href} className="kn-mq__card" onClick={click} draggable={false}
              tabIndex={spin && i >= items.length ? -1 : undefined}>
              <span className="kn-mq__shot">
                <Image src={it.img} alt="" fill sizes="(max-width: 700px) 44vw, 230px" draggable={false} />
              </span>
              <span className="kn-mq__name">{it.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* THE DOTS (client, 2026-09-01). One per design — not per card, since
          the track carries two copies of each — lit from the same loop that
          sizes the cards. They are real buttons: pressing one walks that
          design to the middle, so the row can be steered as well as watched. */}
      {spin && (
        <ol className="kn-mq__dots" ref={dots}>
          {items.map((it, i) => (
            <li key={it.id}>
              <button
                type="button"
                className="kn-mq__dot"
                aria-current={i === 0 ? "true" : "false"}
                onClick={() => goTo(i)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <span className="kn-sr">{it.name}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
