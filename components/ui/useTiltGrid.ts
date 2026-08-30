"use client";

import { useEffect, useRef } from "react";

// ============================================================================
// A 3D TILT FOR A WHOLE GRID, ON ONE LISTENER.
//
// The catalogue has twenty cards. The obvious route — wrap each in the existing
// <TiltCard> — would mount twenty GSAP instances with twenty quickTo pairs on a
// page that already carries the site's heaviest hydration; the landing was
// measured at 845ms TBT for exactly this kind of reason. So: ONE pointermove
// listener on the grid, which finds the card under the pointer and writes four
// custom properties on it. No per-card JavaScript, no library, no re-render —
// React never hears about any of this, and the transform stays on the compositor.
//
// The properties are consumed by CSS (section 54):
//   --tx / --ty  the tilt, in degrees, clamped
//   --mx / --my  the pointer inside the card, 0..100%, for the sheen
//
// Writes are coalesced into a single rAF: pointermove can fire far faster than
// the display refreshes, and setting a custom property per event would do the
// same style invalidation many times for one painted frame.
//
// Deliberately does nothing on touch or with reduced motion — the CSS guards
// the visuals, and this guards the work: a phone should not run a listener
// whose only output is an effect its media query has already switched off.
// ============================================================================

export function useTiltGrid<T extends HTMLElement>(cardSelector: string, maxDeg = 7) {
  const root = useRef<T | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let pending: { card: HTMLElement; x: number; y: number } | null = null;
    let active: HTMLElement | null = null;

    const paint = () => {
      raf = 0;
      if (!pending) return;
      const { card, x, y } = pending;
      // -1..1 from the card's centre
      const dx = x * 2 - 1;
      const dy = y * 2 - 1;
      // rotateX follows the VERTICAL axis inverted: pointer high tilts the top
      // away, which is what "leaning toward the cursor" actually looks like
      card.style.setProperty("--tx", `${(-dy * maxDeg).toFixed(2)}deg`);
      card.style.setProperty("--ty", `${(dx * maxDeg).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    };

    const clear = (card: HTMLElement) => {
      card.style.removeProperty("--tx");
      card.style.removeProperty("--ty");
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    };

    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(cardSelector) ?? null;
      if (card !== active) {
        if (active) clear(active);
        active = card;
      }
      if (!card) return;
      const r = card.getBoundingClientRect();
      pending = { card, x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
      if (!raf) raf = requestAnimationFrame(paint);
    };

    // leaving the grid entirely must also reset — pointermove stops firing and
    // the last card would otherwise stay frozen mid-tilt
    const onLeave = () => {
      if (active) clear(active);
      active = null;
      pending = null;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      if (active) clear(active);
    };
  }, [cardSelector, maxDeg]);

  return root;
}
