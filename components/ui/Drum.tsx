"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";

// ============================================================================
// THE DRUM — the hero's stage: the wedding examples on a slowly turning
// cylinder, spun by hand.
//
// The reference is a Motion (framer) component — a cylinder of faces built
// from `rotateY(i·360/n) translateZ(radius)`, dragged by pointer, thrown by
// velocity. This site does not carry Motion, so the same anatomy is rebuilt
// on what is already here; the reference's numbers are kept:
//   cylinder width  1800px (1100 under 640px) — radius = width / 2π
//   drag            rotation += dx · 0.05·k (the reference's feel, retuned to
//                   degrees-per-pixel for our width)
//   the throw       a velocity kick eased out, in place of its spring
// And one addition from the castle scene's grammar: when nobody is touching
// it, the drum DRIFTS — a 90-second lap, paused the moment a finger lands.
//
// WHAT EACH FACE IS: a real invitation's cover, and a real <a> into the
// wizard with that example preselected — the hero is already the catalogue.
// A click is a click and a drag is a drag: the same six-pixel guard the deck
// uses decides which, so faces stay tappable on the device that matters.
//
// CONTRACT: the face transforms are server-rendered inline styles, so no-JS
// gets the standing cylinder, front faces visible. Reduced motion loses only
// the idle drift — turning it by hand is the visitor's own doing.
// ============================================================================

export type DrumFace = { id: string; name: string; img: StaticImageData; href: string; kind?: "web" | "engine" };

export default function Drum({ faces, label, hint }: { faces: DrumFace[]; label: string; hint?: string }) {
  const stage = useRef<HTMLDivElement | null>(null);
  const deg = useRef(0);
  const glide = useRef<gsap.core.Tween | null>(null);
  const guard = useRef(false);

  const n = faces.length;
  // THE CYLINDER IS SIZED FROM THE FACE COUNT, not fixed. The reference fixed
  // its width at 1800px and divided it among the faces — fine for its twelve
  // 128px squares, wrong for a drum that grows: at twelve 210px cards each
  // face needs 40° of arc and a twelve-slot drum grants 30°, so neighbours
  // interpenetrated. Now every face gets its card plus a gap of air, and the
  // PERSPECTIVE scales with the radius (5·r keeps r/p at 0.2) so the front
  // card projects at a calm 1.25× whatever n is. The faces are PHONES now
  // (2026-08-24): 390:844's own ratio, wearing each example's real mobile
  // first screen from lib/phoneShots.
  const CARD = 110; // must match the CSS face size (phone 390:844 ratio)
  const GAP = 26;
  const radius = Math.round((n * (CARD + GAP)) / (2 * Math.PI));
  const persp = Math.round(radius * 5); // r/p = 0.2: the front card projects 1.25×

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const small = window.matchMedia("(max-width: 639px)");
    // one scale factor shrinks EVERY length together — the cards, the radius
    // and (through the CSS calc) the perspective — so the phone sees the same
    // drum, six tenths the size
    const k = () => (small.matches ? 0.61 : 1);
    const view = el.parentElement as HTMLElement;
    const faceEls = Array.from(el.children) as HTMLElement[];
    const paint = () => {
      el.style.transform = `rotateY(${deg.current}deg)`;
      view.style.setProperty("--drum-k", String(k()));
      // the rotation itself, for the orbit dot (CSS sin/cos reads it)
      view.style.setProperty("--drum-deg", `${(deg.current % 360).toFixed(2)}deg`);
      // THE LIGHT: a face turned from the lens falls into shade — cos of its
      // angle to the viewer, floored at 0 (the far side is backface-hidden)
      for (let i = 0; i < faceEls.length; i++) {
        const a = (((i * 360) / n + deg.current) * Math.PI) / 180;
        faceEls[i].style.setProperty("--f", Math.max(0, Math.cos(a)).toFixed(3));
      }
    };
    paint();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The idle drift: a ninety-second lap — alive, never busy. A TICKER, not
    // a tween: a tween records its start and end, so resuming one after a
    // drag would snap the cylinder back onto the old range and eat the drag.
    // The ticker only ever says «a little further from wherever you are».
    let drifting = false;
    const tick = (_t: number, dt: number) => { deg.current += (360 / 90000) * dt; paint(); };
    const driftOn = () => { if (!reduced && !drifting) { drifting = true; gsap.ticker.add(tick); } };
    const driftOff = () => { if (drifting) { drifting = false; gsap.ticker.remove(tick); } };
    driftOn();

    let drag: { id: number; x0: number; x: number; t: number; v: number; on: boolean } | null = null;
    const down = (ev: PointerEvent) => {
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      guard.current = false;
      glide.current?.kill();
      drag = { id: ev.pointerId, x0: ev.clientX, x: ev.clientX, t: ev.timeStamp, v: 0, on: false };
    };
    const move = (ev: PointerEvent) => {
      if (!drag || drag.id !== ev.pointerId) return;
      const dx = ev.clientX - drag.x;
      const dt = Math.max(1, ev.timeStamp - drag.t);
      drag.x = ev.clientX;
      drag.t = ev.timeStamp;
      drag.v = 0.7 * ((dx / dt) * 1000) + 0.3 * drag.v;
      if (!drag.on) {
        if (Math.abs(ev.clientX - drag.x0) < 6) return;
        drag.on = true;
        driftOff();
        el.classList.add("is-drag");
        try { (ev.currentTarget as Element)?.setPointerCapture?.(ev.pointerId); } catch { /* kept by the browser */ }
      }
      deg.current += (dx * 0.22) / k();
      paint();
    };
    const up = (ev: PointerEvent) => {
      if (!drag || drag.id !== ev.pointerId) return;
      const was = drag;
      drag = null;
      el.classList.remove("is-drag");
      if (!was.on) return; // a tap: the face's link fires
      guard.current = true;
      // The throw: the reference's velocity kick, eased instead of sprung —
      // and CLAMPED, which its spring did implicitly. A trackpad flick can
      // report tens of thousands of px/s; unclamped that is thirty laps.
      // Half a turn is the most one flick may buy.
      if (Math.abs(was.v) < 20) { driftOn(); return; }
      const kick = Math.max(-180, Math.min(180, (was.v * 0.28) / k()));
      glide.current = gsap.to(deg, {
        current: `+=${kick.toFixed(1)}`,
        duration: 1.15,
        ease: "power3.out",
        onUpdate: paint,
        onComplete: driftOn,
      });
    };
    const wrap = el.parentElement as HTMLElement;
    wrap.addEventListener("pointerdown", down);
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerup", up);
    wrap.addEventListener("pointercancel", up);
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => {
      driftOff();
      glide.current?.kill();
      wrap.removeEventListener("pointerdown", down);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerup", up);
      wrap.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", onResize);
    };
  }, [n]);

  return (
    <div className="kn-drum" role="group" aria-label={label}>
      {/* the lens follows the drum's size: perspective rides the same k */}
      <div className="kn-drum__view" style={{ perspective: `calc(${persp}px * var(--drum-k, 1))` }}>
        {/* THE GROUND the drum stands on: a soft pool of shadow, the orbit
            drawn as a slow-marching dashed ellipse, and a dot that RIDES the
            rotation — CSS sin()/cos() read --drum-deg, which paint() writes,
            so the dot is where face 0 actually is. State, not animation:
            reduced motion stills the dash march and keeps everything placed. */}
        <div className="kn-drum__ground" aria-hidden="true">
          <svg className="kn-drum__orbit" viewBox="0 0 300 60" preserveAspectRatio="none">
            <ellipse cx="150" cy="30" rx="144" ry="24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 7" className="kn-drum__orbitLine" />
          </svg>
          <span className="kn-drum__dot" />
        </div>
        <div
          className="kn-drum__stage"
          ref={stage}
          onClickCapture={(e) => { if (guard.current) { guard.current = false; e.preventDefault(); e.stopPropagation(); } }}
        >
          {faces.map((f, i) => (
            <Link
              key={f.id}
              className="kn-drum__face"
              href={f.href}
              aria-label={f.name}
              draggable={false}
              style={{ transform: `rotateY(${((i * 360) / n).toFixed(2)}deg) translateZ(calc(${radius}px * var(--drum-k, 1)))` }}
            >
              <Image src={f.img} alt="" sizes="240px" fill draggable={false} />
              {/* the kind, said with its icon: a web page or the engine */}
              {f.kind && (
                <span className="kn-drum__kind">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {f.kind === "web"
                      ? <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" /></>
                      : <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.4" /></>}
                  </svg>
                  {f.name}
                </span>
              )}
              {!f.kind && <span className="kn-drum__name">{f.name}</span>}
            </Link>
          ))}
        </div>
      </div>
      {hint && <p className="kn-drum__hint" aria-hidden="true">{hint}</p>}
    </div>
  );
}
