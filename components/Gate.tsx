"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ui } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// THE ENVELOPE GATE
//
// Measured off both references and confirmed against the global category:
// every premium digital invitation in the world opens the same way — a sealed
// envelope you have to touch. iStudio uses a forest-green embossed envelope
// with a gold wax seal; NAIVA folds ivory flaps into an X under a wax seal
// carrying the couple's own initials. Greenvelope, Paperless Post and
// InviteDrop all sell the same moment. It is the one interaction nobody in
// this category skips, so it is the one we build properly.
//
// FOUR THINGS MAKE IT A REAL GATE RATHER THAN A SPLASH SCREEN:
//   1. Scroll is locked while it is up (both html and body — html alone lets
//      iOS Safari rubber-band the page behind it).
//   2. The document behind it is `inert`, so Tab cannot walk into a card the
//      visitor has not opened yet, and a screen reader does not read it out.
//   3. Escape opens it. A gate with no keyboard exit is a locked door.
//   4. Focus is placed on the seal at mount and handed to the card on open —
//      otherwise a keyboard visitor opens the envelope and lands back at the
//      top of the document with no idea anything happened.
//
// THE NO-JS STORY IS THE REASON THIS IS SHAPED THE WAY IT IS.
// The gate is SERVER-RENDERED (so there is no flash of the card before it
// covers), and `html:not(.js) .kn-env { display: none }` in globals.css hides
// it for anyone without JavaScript — the class is written by an inline script
// before first paint, so the hiding is instant and flicker-free.
//
// `inert` and the scroll lock are applied IMPERATIVELY on mount, never in the
// server markup. If they were server-rendered, a visitor with JavaScript off
// would receive a page that is permanently inert and permanently unscrollable
// — a hidden envelope holding the whole invitation shut. That is the single
// worst bug available in this component, and this is how it is avoided.
// ============================================================================

const FLAPS = ["b", "l", "r", "t"] as const;

export default function Gate({
  lang,
  monogram,
}: {
  lang: Lang;
  /** The two glyphs pressed into the wax — the couple's own initials. */
  monogram: { a: string; b: string };
}) {
  const gate = useRef<HTMLDivElement | null>(null);
  const seal = useRef<HTMLButtonElement | null>(null);
  const [gone, setGone] = useState(false);
  const opening = useRef(false);

  /** Restore everything the gate took over. Safe to call twice. */
  const release = useCallback(() => {
    const html = document.documentElement;
    html.classList.remove("kn-locked");
    const main = document.getElementById("card");
    if (main) main.removeAttribute("inert");
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("kn-locked");
    const main = document.getElementById("card");
    if (main) main.setAttribute("inert", "");
    // preventScroll: the lock is already on, but Chrome still nudges the
    // document when focus lands on an element it considers off-screen.
    seal.current?.focus({ preventScroll: true });

    return release;
  }, [release]);

  const open = useCallback(() => {
    if (opening.current) return;
    opening.current = true;

    const el = gate.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      release();
      setGone(true);
      // Hand the reader the card they just opened. Without this the focus ring
      // is still sitting on a button that no longer exists and the next Tab
      // starts from the top of the document.
      const h = document.querySelector<HTMLElement>("#card h1");
      h?.setAttribute("tabindex", "-1");
      h?.focus({ preventScroll: true });
    };

    if (!el || reduced) {
      // Reduced motion keeps the ceremony (the seal is still something you
      // press) and drops the choreography. A fold is motion; a gate is not.
      if (el) gsap.to(el, { autoAlpha: 0, duration: 0.25, onComplete: finish });
      else finish();
      return;
    }

    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ onComplete: finish, defaults: { ease: "power3.inOut" } });

    // The seal is pressed, lifts off the paper, and takes the wax with it.
    tl.to(seal.current, { scale: 1.14, duration: 0.2, ease: "power2.out" })
      .to(seal.current, {
        scale: 0.62,
        y: -26,
        rotate: -14,
        autoAlpha: 0,
        duration: 0.44,
        ease: "power2.in",
      })
      // Then the flaps, in the order a real envelope actually unfolds: the
      // bottom flap sits on top of the sides, so it has to lift first, and the
      // top flap — the one that was glued — comes last.
      .to(q(".kn-env__flap--b"), { rotateX: 132, duration: 0.78 }, "-=0.18")
      .to(q(".kn-env__flap--l"), { rotateY: 132, duration: 0.78 }, "<0.07")
      .to(q(".kn-env__flap--r"), { rotateY: -132, duration: 0.78 }, "<")
      .to(q(".kn-env__flap--t"), { rotateX: -132, duration: 0.82 }, "<0.07")
      .to(q(".kn-env__hint"), { autoAlpha: 0, duration: 0.3 }, 0)
      .to(el, { autoAlpha: 0, duration: 0.5 }, "-=0.4");
  }, [release]);

  // Escape opens it too.
  useEffect(() => {
    if (gone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") open();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gone, open]);

  if (gone) return null;

  const label = `${t(lang, ui.open)} — ${monogram.a} ${monogram.b}`;

  return (
    <div className="kn-env" ref={gate} role="dialog" aria-modal="true" aria-label={label}>
      {FLAPS.map((f) => (
        <div key={f} className={`kn-env__flap kn-env__flap--${f}`} aria-hidden="true" />
      ))}

      {/* The two creases, corner to corner. They belong to the CLOSED envelope
          — a crisp edge is what tells the eye this is folded paper rather than
          a gradient — so they fade with the gate instead of folding with any
          one flap. The embossed botanical is a background on each flap, so it
          travels with the paper it is pressed into. */}
      <div className="kn-env__folds" aria-hidden="true" />

      <button type="button" className="kn-env__seal" ref={seal} onClick={open} aria-label={label}>
        <span className="kn-env__wax" aria-hidden="true" />
        <span className="kn-env__mono" aria-hidden="true">
          <i>{monogram.a}</i>
          {monogram.b && <i>{monogram.b}</i>}
        </span>
      </button>

      <p className="kn-env__hint">{t(lang, ui.openHint)}</p>
    </div>
  );
}
