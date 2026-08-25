"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

// ============================================================================
// THE STACKED DECK — one card at the front, the rest fanned behind it, and a
// drag that turns the pile.
//
// The anatomy is the reference's, measured off it and rebuilt here without it:
// that carousel is built on Motion, and this site carries five runtime
// dependencies of which Motion is not one. Every number below is the
// reference's own:
//   the fan      x = offset·170, y = |offset|·40, rotate = offset·12°,
//                scale = 1 − |offset|·0.12   (tighter under 1024 and 640px)
//   the dead zone |offset| < 0.05 → no rotation, no sink: the front card sits
//                straight even when the spring is still settling
//   the drag     progress moves by −dx / sensitivity, live, under the finger
//   the release  distance ÷ 200 + velocity ÷ 800, ROUNDED and clamped to three
//                cards, counted from where the drag began
//   the spring   stiffness 200, damping 30, mass 1 — integrated here by hand
//                (semi-implicit Euler, dt clamped to a 30fps step)
// The wrap is the reference's too: the offset is taken modulo the count and
// folded into ±count/2, so the pile is a ring with no ends.
//
// TWO THINGS ARE NOT THE REFERENCE'S, and both are the same reason: it is a
// carousel of pictures, and this is a SHOP.
//   · It laid a transparent surface over the pile and made every card
//     pointer-inert. Here the front card must stay clickable, so the drag
//     lives on the STAGE and a click is suppressed only when the pointer
//     actually travelled (six pixels). A tap is a tap.
//   · The cards behind carry buttons no one can see. They are `inert`, which
//     takes them out of the tab order and the accessibility tree as well as
//     out of reach of the mouse, and each wears one honest button instead:
//     «show this one».
//
// Before this mounts — and for a browser with JavaScript off — the stage is a
// plain horizontal scroller: every card, in order, readable. The deck is the
// upgrade, never the price of entry. `prefers-reduced-motion` keeps the deck
// and drops the spring: the pile lands the moment it is let go.
// ============================================================================

export type DeckCell = { key: string; node: ReactNode; label: string };

type Conf = {
  /** px sideways per card of offset */ x: number;
  /** px a card sinks per card of offset */ y: number;
  /** degrees per card of offset */ rot: number;
  /** scale lost per card of offset */ sc: number;
  /** px of drag per card of progress */ sens: number;
  /** px of throw per card of shift */ dist: number;
  /** px/s of throw per card of shift */ vel: number;
};

/** the reference's three sizes, at the reference's own breakpoints */
const conf = (w: number): Conf =>
  w < 640
    ? { x: 90, y: 20, rot: 8, sc: 0.06, sens: 180, dist: 120, vel: 500 }
    : w < 1024
      ? { x: 130, y: 30, rot: 10, sc: 0.09, sens: 220, dist: 160, vel: 650 }
      : { x: 170, y: 40, rot: 12, sc: 0.12, sens: 250, dist: 200, vel: 800 };

/** fold a difference of indices into ±count/2 — the ring's short way round */
function fold(d: number, total: number): number {
  const half = total / 2;
  let x = d % total;
  if (x > half) x -= total;
  if (x < -half) x += total;
  return x;
}

export default function StackDeck({ cells, index, onIndex, label, className }: {
  cells: DeckCell[];
  /** the card at the front — controlled, so the caller can name it */
  index: number;
  onIndex: (i: number) => void;
  label: string;
  className?: string;
}) {
  const total = cells.length;
  const stage = useRef<HTMLUListElement | null>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [deck, setDeck] = useState(false); // JS is here: the pile, not the row

  // the physics live in refs: sixty frames a second is not sixty renders
  const p = useRef(index); // progress, in cards
  const target = useRef(index);
  const v = useRef(0); // cards per second
  const raf = useRef(0);
  const last = useRef(0);
  const cfg = useRef<Conf>(conf(1280));
  const still = useRef(false); // prefers-reduced-motion
  const idx = useRef(index);
  const onIndexRef = useRef(onIndex);
  onIndexRef.current = onIndex;

  // ---- the paint: every card's place in the fan, written straight to the DOM
  const paint = useCallback((at: number) => {
    const els = items.current;
    const n = els.length;
    if (!n) return;
    const c = cfg.current;
    const half = n / 2;
    // a long list would fan two thousand pixels wide, so it fades out three
    // cards from the front; a short one keeps the reference's seam fade
    const fade = Math.min(half, 3);
    const soft = fade >= 3 ? 1 : 0.5;
    for (let i = 0; i < n; i++) {
      const el = els[i];
      if (!el) continue;
      const d = fold(i - at, n);
      const o = Math.abs(d);
      const op = o >= fade ? 0 : o > fade - soft ? (fade - o) / soft : 1;
      if (op <= 0.002) {
        if (el.style.visibility !== "hidden") {
          el.style.visibility = "hidden";
          el.style.opacity = "0";
        }
        continue;
      }
      const dead = o < 0.05;
      el.style.visibility = "visible";
      el.style.opacity = op.toFixed(3);
      el.style.zIndex = String(Math.round(100 - o * 10));
      el.style.transform =
        `translate3d(${(d * c.x).toFixed(2)}px, ${(dead ? 0 : o * c.y).toFixed(2)}px, 0)` +
        ` rotate(${(dead ? 0 : d * c.rot).toFixed(3)}deg)` +
        ` scale(${Math.max(0.1, 1 - o * c.sc).toFixed(4)})`;
      // the reference's two fades: a dark veil over everything but the front
      // card, and the caption, which belongs to the front card alone
      el.style.setProperty("--dk-s", (o >= 2 ? 0.5 : o >= 0.5 ? 0.2 + (o - 0.5) * 0.2 : o * 0.4).toFixed(3));
      el.style.setProperty("--dk-t", Math.max(0, 1 - o * 2).toFixed(3));
    }
  }, []);

  // ---- the spring: stiffness 200, damping 30, mass 1
  const tick = useCallback((now: number) => {
    const dt = last.current ? Math.min(0.032, (now - last.current) / 1000) : 0.016;
    last.current = now;
    const to = target.current;
    v.current += (-200 * (p.current - to) - 30 * v.current) * dt;
    p.current += v.current * dt;
    if (Math.abs(p.current - to) < 0.0005 && Math.abs(v.current) < 0.01) {
      p.current = to;
      v.current = 0;
      raf.current = 0;
      last.current = 0;
      paint(to);
      return;
    }
    paint(p.current);
    raf.current = requestAnimationFrame(tick);
  }, [paint]);

  const run = useCallback(() => {
    if (still.current) {
      // reduced motion: it arrives, it does not travel
      p.current = target.current;
      v.current = 0;
      paint(p.current);
      return;
    }
    if (!raf.current) {
      last.current = 0;
      raf.current = requestAnimationFrame(tick);
    }
  }, [paint, tick]);

  /** land on a progress — and tell the caller which card that is */
  const settle = useCallback((to: number) => {
    target.current = to;
    const n = items.current.length || 1;
    const i = ((Math.round(to) % n) + n) % n;
    if (i !== idx.current) {
      idx.current = i;
      onIndexRef.current(i);
    }
    run();
  }, [run]);

  const step = useCallback((d: number) => settle(Math.round(p.current) + d), [settle]);

  // ---- mount: the pile replaces the row, at the card the caller asked for
  useEffect(() => {
    cfg.current = conf(window.innerWidth);
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    p.current = index;
    target.current = index;
    idx.current = index;
    setDeck(true);
    const resize = () => { cfg.current = conf(window.innerWidth); paint(p.current); };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // the deck opens once, at the card it was given; later moves come through
    // the `index` prop below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the first paint has to wait for the cells to exist
  useEffect(() => { if (deck) paint(p.current); }, [deck, paint, total]);

  // the caller moved the front card (a dot, an arrow, a new pick): take the
  // ring's short way round to it — p + fold(i − p) is always exactly that card
  useEffect(() => {
    if (index === idx.current) return;
    idx.current = index;
    target.current = p.current + fold(index - p.current, total || 1);
    run();
  }, [index, total, run]);

  // ---- the drag
  const drag = useRef<{ id: number; x0: number; y0: number; x: number; t: number; v: number; p0: number; on: boolean } | null>(null);
  const guard = useRef(false); // a drag that travelled swallows its own click

  const down = (ev: React.PointerEvent<HTMLUListElement>) => {
    if (!deck || total < 2) return;
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    guard.current = false;
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = 0; last.current = 0; }
    v.current = 0;
    drag.current = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, x: ev.clientX, t: ev.timeStamp, v: 0, p0: p.current, on: false };
  };

  const move = (ev: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d || d.id !== ev.pointerId) return;
    const dx = ev.clientX - d.x;
    const dt = Math.max(1, ev.timeStamp - d.t);
    d.x = ev.clientX;
    d.t = ev.timeStamp;
    d.v = 0.7 * ((dx / dt) * 1000) + 0.3 * d.v; // px/s, smoothed
    if (!d.on) {
      const tx = Math.abs(ev.clientX - d.x0);
      const ty = Math.abs(ev.clientY - d.y0);
      if (tx < 6) return;
      if (ty > tx) { drag.current = null; return; } // that one belongs to the page
      d.on = true;
      stage.current?.classList.add("is-drag");
      try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch { /* the browser kept it */ }
    }
    p.current -= dx / cfg.current.sens;
    paint(p.current);
  };

  const up = (ev: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d || d.id !== ev.pointerId) return;
    drag.current = null;
    stage.current?.classList.remove("is-drag");
    if (!d.on) return; // a tap, not a drag: let the click land
    guard.current = true;
    const c = cfg.current;
    const throwShift = still.current ? 0 : -d.v / c.vel;
    const shift = Math.max(-3, Math.min(3, Math.round(-(ev.clientX - d.x0) / c.dist + throwShift)));
    settle(Math.round(d.p0) + shift);
  };

  // a trackpad's sideways scroll turns the pile; a vertical one is the page's
  useEffect(() => {
    const el = stage.current;
    if (!el || !deck || total < 2) return;
    let acc = 0;
    const wheel = (ev: WheelEvent) => {
      if (Math.abs(ev.deltaX) <= Math.abs(ev.deltaY)) return;
      ev.preventDefault();
      acc += ev.deltaX;
      if (Math.abs(acc) > 40) { step(acc > 0 ? 1 : -1); acc = 0; }
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [deck, total, step]);

  return (
    <ul
      ref={stage}
      className={`kn-dk__stage${deck ? " is-deck" : ""}${className ? ` ${className}` : ""}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClickCapture={(ev) => { if (guard.current) { guard.current = false; ev.preventDefault(); ev.stopPropagation(); } }}
      onKeyDown={(ev) => {
        if (ev.key === "ArrowRight") { ev.preventDefault(); step(1); }
        if (ev.key === "ArrowLeft") { ev.preventDefault(); step(-1); }
      }}
    >
      {cells.map((c, i) => {
        const on = i === index;
        return (
          <li key={c.key} className={`kn-dk__it${on ? " is-on" : ""}`} ref={(el) => { items.current[i] = el; }}>
            {/* behind the front card: out of the mouse's reach, out of the tab
                order, out of the accessibility tree — one button speaks for it */}
            <div className="kn-dk__hold" {...(deck && !on ? { inert: true } : null)}>{c.node}</div>
            {deck && !on && (
              <button type="button" className="kn-dk__grab" onClick={() => settle(p.current + fold(i - p.current, total))}>
                {c.label}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
