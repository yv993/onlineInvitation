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
  const st = useRef({ x: 0, half: 0, drag: false, moved: 0, px: 0, vel: 0, hover: false, id: 0, last: 0 });

  useEffect(() => {
    if (!spin) return;
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = st.current;
    const measure = () => { s.half = el.scrollWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // px per second, from the pass the caller asked for
    const speed = () => (s.half / seconds) * (reverse ? -1 : 1);
    const frame = (t: number) => {
      const dt = s.last ? Math.min(64, t - s.last) / 1000 : 0;
      s.last = t;
      if (!s.drag && !s.hover && s.half) {
        // the throw decays into the steady walk
        s.x -= (speed() - s.vel) * dt;
        s.vel *= 0.94;
        if (Math.abs(s.vel) < 1) s.vel = 0;
      }
      if (s.half) {
        // keep the offset inside one track length, so the seam never shows
        while (s.x <= -s.half) s.x += s.half;
        while (s.x > 0) s.x -= s.half;
        el.style.transform = `translate3d(${s.x}px,0,0)`;
      }
      s.id = requestAnimationFrame(frame);
    };
    s.id = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(s.id); ro.disconnect(); s.last = 0; };
  }, [spin, seconds, reverse]);

  const down = useCallback((e: React.PointerEvent) => {
    if (!spin) return;
    const s = st.current;
    s.drag = true; s.moved = 0; s.px = e.clientX; s.vel = 0;
    box.current?.setPointerCapture(e.pointerId);
  }, [spin]);

  const move = useCallback((e: React.PointerEvent) => {
    const s = st.current;
    if (!s.drag) return;
    const dx = e.clientX - s.px;
    s.px = e.clientX;
    s.moved += Math.abs(dx);
    s.x += dx;
    s.vel = dx * 60; // carried into the release
  }, []);

  const up = useCallback((e: React.PointerEvent) => {
    const s = st.current;
    if (!s.drag) return;
    s.drag = false;
    try { box.current?.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
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
    </div>
  );
}
