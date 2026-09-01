"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import WMotifSprite from "@/components/wcards/WMotifs";
import Particles from "@/components/ui/3d/Particles";
import type { Lang, T } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// THE SUNLIT LETTER (wedding-9) — a cinematic envelope film, recreated as an
// ORIGINAL scene after a reference video the client brought (2026-08-30):
// a kraft envelope with a crimson wax seal lies on a wooden table in warm
// window light; it lifts off the table, floats up to face the reader, the
// flap opens, and the card rises out and presents itself. Dust motes drift
// in the rays. Nothing from the video is used — the room, rays, table,
// envelope, seal and card are CSS and inline SVG; the florals are our own
// WMotifs; the motes are the existing gold Particles system.
//
// THE GATE CONTRACT (Royal.tsx's shape, kept exactly):
//   · the page renders COMPLETE underneath; `shut` starts false and becomes
//     true only in a client effect that first checks reduced motion — so a
//     no-JS or reduced-motion reader simply sees the finished invitation.
//   · scroll is locked via `kn-locked` on <html> while shut, removed in the
//     effect's cleanup AND on dismissal.
//   · dismissing sets shut=false (CSS fades the gate) and unmounts after 1s.
//
// THE 3D CONTRACT (EnvelopeScene.tsx's lessons, kept exactly):
//   · layering inside preserve-3d is translateZ, never z-index:
//     liner 0 · card 1 · pocket 2 · flap 3 · seal 4 — and the card jumps to
//     z 8 the moment it clears the mouth, so it can stand in front.
//   · the sway lives on its OWN wrapper: the timeline owns the envelope's
//     rotateX/scale, and two writers on one transform fight.
//   · the timeline is killed before any replay and on unmount.
// ============================================================================

const L = {
  kicker: { hy: "Հրավեր", en: "Wedding invitation", ru: "Приглашение" } as T,
  open: { hy: "Բացել հրավերը", en: "Open the invitation", ru: "Открыть приглашение" } as T,
  skip: { hy: "Հպեք՝ անցնելու", en: "Tap to skip", ru: "Нажмите, чтобы пропустить" } as T,
  scroll: { hy: "Ոլորեք՝ բացելու համար", en: "Scroll to open", ru: "Прокрутите, чтобы открыть" } as T,
  reply: { hy: "Խնդրում ենք պատասխանել", en: "Kindly reply", ru: "Просим ответить" } as T,
};

/** the ornate double-rule frame with corner scrolls — drawn, not copied */
function CardFrame() {
  return (
    <svg className="kn-cine__frame" viewBox="0 0 250 350" aria-hidden="true" preserveAspectRatio="none">
      <rect x="10" y="10" width="230" height="330" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="16" y="16" width="218" height="318" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* corner scrolls, one path mirrored four ways */}
      {[
        "translate(10,10)",
        "translate(240,10) scale(-1,1)",
        "translate(10,340) scale(1,-1)",
        "translate(240,340) scale(-1,-1)",
      ].map((tf, i) => (
        <path key={i} transform={tf} d="M0 22 C2 10 10 2 22 0 M4 16 C7 9 9 7 16 4 M0 10 q4 6 10 0" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      ))}
      {/* the top-centre ornament */}
      <path d="M105 16 q10 8 20 0 q-10 10 -20 0 Z M99 16 h8 M143 16 h8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function CineGate({
  lang,
  a,
  b,
  dateLine,
  venue,
  city,
  greet,
}: {
  lang: Lang;
  a: string;
  b: string;
  dateLine: string;
  venue?: string;
  city?: string;
  greet?: string;
}) {
  const [shut, setShut] = useState(false);
  const [gone, setGone] = useState(false);
  const [settled, setSettled] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const sway = useRef<gsap.core.Tween | null>(null);
  // settled flows into the click handler; a ref keeps the handler stable so
  // a parent re-render can never rebuild it mid-film (EnvelopeScene's lesson)
  const settledRef = useRef(false);
  settledRef.current = settled;

  // mount CLOSED only after hydration, and never under reduced motion — the
  // safer polarity (not "no-preference") also treats browsers without media
  // query support as reduced
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    setShut(true);
  }, []);

  const open = useCallback(() => {
    setShut(false);
    document.documentElement.classList.remove("kn-locked");
    window.setTimeout(() => setGone(true), 1000);
  }, []);
  // the wheel listener lives in an effect keyed on `shut` alone; the ref keeps
  // it current without rebuilding the film (the settledRef lesson, again)
  const openRef = useRef(open);
  openRef.current = open;
  // the scrub state the tap handler reaches into
  const drive = useRef<{ toEnd: () => void }>({ toEnd: () => {} });

  // the page behind must not scroll under the film
  useEffect(() => {
    if (!shut) return;
    document.documentElement.classList.add("kn-locked");
    return () => document.documentElement.classList.remove("kn-locked");
  }, [shut]);

  // the film itself
  useEffect(() => {
    if (!shut || !root.current) return;
    const q = gsap.utils.selector(root.current);
    tl.current?.kill();
    sway.current?.kill();

    // the opening pose: the envelope lies on the table, small and tilted away
    gsap.set(q(".kn-cine__env"), { rotateX: 64, y: "30svh", scale: 0.56, transformOrigin: "50% 82%" });
    gsap.set(q(".kn-cine__shadow"), { autoAlpha: 0.5, scale: 1 });
    gsap.set(q(".kn-cine__liner"), { z: 0 });
    gsap.set(q(".kn-cine__card"), { z: 1, y: "6%", scale: 1 });
    gsap.set(q(".kn-cine__pocket"), { z: 2 });
    gsap.set(q(".kn-cine__flap"), { z: 3, rotateX: 0, transformOrigin: "50% 0%" });
    gsap.set(q(".kn-cine__seal"), { z: 4, autoAlpha: 1, scale: 1 });

    // PAUSED, and driven by the reader's hand (2026-08-30, from a reference the
    // client brought): the film scrubs with scroll — forward opens the
    // envelope, backward folds it shut again — instead of playing on a clock.
    // The gate still owns the viewport (kn-locked), so the wheel and touch
    // deltas below are the only scroll there is.
    const m = gsap.timeline({ defaults: { ease: "power3.inOut" }, paused: true });
    m
      // 1 · the lift: off the table, up into the light, turning to face us
      .to(q(".kn-cine__env"), { rotateX: 0, y: 0, scale: 1, duration: 1.7 })
      .to(q(".kn-cine__shadow"), { autoAlpha: 0.12, scale: 0.55, duration: 1.7 }, "<")
      // 2 · the flap opens; the seal lets go with it. It folds to EDGE-ON
      // (-92°) and then dissolves rather than swinging the full 180: past 90°
      // the container's mirror composes with flapIn's own rotateX(180) into a
      // translated ghost — measured as a detached triangle floating above the
      // envelope. Edge-on foreshortens honestly in any projection.
      .to(q(".kn-cine__flap"), { rotateX: -92, duration: 0.7, ease: "power2.in" }, "+=0.25")
      .to(q(".kn-cine__flap"), { autoAlpha: 0, duration: 0.25 }, "-=0.1")
      .to(q(".kn-cine__seal"), { y: "-30%", autoAlpha: 0, scale: 1.22, duration: 0.5, ease: "power2.out" }, "<+0.15")
      // 3 · the card rises out of the mouth (still z 1, behind the pocket)
      .to(q(".kn-cine__card"), { y: "-64%", duration: 1.15, ease: "power2.inOut" }, "-=0.25")
      // …and the moment it clears, it may stand in front of everything
      .set(q(".kn-cine__card"), { z: 8 })
      // 4 · the presentation: the card fills the stage, the envelope sinks
      .to(q(".kn-cine__card"), { y: "-54%", scale: 1.34, duration: 1.0, ease: "power2.out", transformOrigin: "50% 42%" })
      .to(q(".kn-cine__pocket, .kn-cine__flap, .kn-cine__liner, .kn-cine__paper"), { y: 34, autoAlpha: 0.5, duration: 0.8 }, "<")
      .to(q(".kn-cine__shadow"), { autoAlpha: 0, duration: 0.6 }, "<");
    tl.current = m;

    // the scrub: wheel and touch move a TARGET; a rAF loop eases the playhead
    // toward it (the reference's scrub feel). Over-scrolling past the end is
    // the reader pushing on into the invitation — it opens the gate.
    const el = root.current;
    const st = { target: 0, cur: 0, raf: 0, lastY: 0, opened: false };
    const TOTAL = 1500; // px of scroll for the whole film
    const step = () => {
      st.cur += (Math.min(st.target, 1) - st.cur) * 0.14;
      if (Math.abs(Math.min(st.target, 1) - st.cur) < 0.0006) st.cur = Math.min(st.target, 1);
      m.progress(st.cur);
      // the airborne sway begins once the envelope has left the table, and is
      // NOT part of the scrubbed timeline — scrubbing back should refold the
      // envelope, not un-sway the air
      if (st.cur > 0.34 && !sway.current) {
        sway.current = gsap.fromTo(q(".kn-cine__sway"), { rotateZ: -1.3 }, { rotateZ: 1.3, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
      if (st.cur >= 0.995 && !settledRef.current) setSettled(true);
      else if (st.cur < 0.95 && settledRef.current) setSettled(false);
      st.raf = requestAnimationFrame(step);
    };
    st.raf = requestAnimationFrame(step);
    drive.current = { toEnd: () => { st.target = 1; } };

    const push = (dy: number) => {
      st.target = Math.max(0, Math.min(1.3, st.target + dy / TOTAL));
      if (st.target > 1.22 && !st.opened) { st.opened = true; openRef.current(); }
    };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); push(e.deltaY); };
    const onTouchStart = (e: TouchEvent) => { st.lastY = e.touches[0]?.clientY ?? 0; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? st.lastY;
      push((st.lastY - y) * 2.2); // a swipe travels less than a wheel notch
      st.lastY = y;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(st.raf);
      m.kill();
      sway.current?.kill();
      sway.current = null;
    };
  }, [shut]);

  // a tap during the film eases the scrub to the end; a tap when settled opens
  const tap = useCallback(() => {
    if (!settledRef.current) { drive.current.toEnd(); return; }
    openRef.current();
  }, []);

  if (gone) return null;

  const initials = `${[...a][0] ?? ""}${b ? [...b][0] ?? "" : ""}`;

  return (
    <div
      ref={root}
      className={`kn-cine${shut ? " is-shut" : ""}${settled ? " is-set" : ""}`}
      aria-hidden={!shut}
      onClick={tap}
    >
      {/* the motifs live inside the gate: TemplateView pages mount no sprite */}
      <WMotifSprite />

      {/* the room: warm dusk, a blurred window, two rays, the table */}
      <div className="kn-cine__room" aria-hidden="true">
        <span className="kn-cine__window">
          <i /><i /><i /><i />
        </span>
        <span className="kn-cine__ray kn-cine__ray--a" />
        <span className="kn-cine__ray kn-cine__ray--b" />
        {/* dried stems at the edges, ours */}
        <svg className="kn-cine__flora kn-cine__flora--r" viewBox="0 0 100 100">
          <use href="#w-wheat" style={{ color: "#8E7F6B" }} />
        </svg>
        <svg className="kn-cine__flora kn-cine__flora--r2" viewBox="0 0 100 100">
          <use href="#w-lavender" style={{ color: "#9C8B74", ["--m2" as string]: "#B8A98E" }} />
        </svg>
        <svg className="kn-cine__flora kn-cine__flora--l" viewBox="0 0 100 100">
          <use href="#w-leafSprig" style={{ color: "#7E6F5A" }} />
        </svg>
        <span className="kn-cine__table" />
      </div>

      {/* the stage: shadow on the table, then the envelope in 3D */}
      <div className="kn-cine__stage" aria-hidden="true">
        <span className="kn-cine__shadow" />
        <div className="kn-cine__sway">
          <div className="kn-cine__env">
            <span className="kn-cine__paper" />
            <span className="kn-cine__liner" />

            <div className="kn-cine__card">
              <CardFrame />
              {/* the sprig laid on the card, held by a strip of tape */}
              <svg className="kn-cine__cardSprig" viewBox="0 0 100 100" aria-hidden="true">
                <use href="#w-lavender" style={{ color: "#8E7F6B", ["--m2" as string]: "#B8A98E" }} />
              </svg>
              <span className="kn-cine__tape" />
              <p className="kn-cine__kicker">{t(lang, L.kicker)}</p>
              <p className="kn-cine__names">
                {a}
                {b ? <em> &amp; </em> : null}
                {b}
              </p>
              <p className="kn-cine__date">{dateLine}</p>
              {venue ? <p className="kn-cine__venue">{venue}{city ? ` · ${city}` : ""}</p> : null}
              {greet ? <p className="kn-cine__greet">{greet}</p> : <p className="kn-cine__greet kn-cine__greet--soft">{t(lang, L.reply)}</p>}
              <span className="kn-cine__stamp">{initials}</span>
            </div>

            <span className="kn-cine__pocket" />
            <div className="kn-cine__flap">
              <span className="kn-cine__flapOut" />
              <span className="kn-cine__flapIn" />
            </div>
            <span className="kn-cine__seal">{initials}</span>
          </div>
        </div>
      </div>

      {/* the dust in the light — pauses itself off-screen and when hidden */}
      <div className="kn-cine__motes" aria-hidden="true">
        <Particles fx="gold" />
      </div>

      <p className="kn-cine__hint">{t(lang, L.scroll)}</p>
      <button type="button" className="kn-btn kn-cine__open" onClick={(e) => { e.stopPropagation(); open(); }}>
        {t(lang, L.open)}
      </button>
    </div>
  );
}
