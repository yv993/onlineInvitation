"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Lang } from "@/lib/content";
import { findBackdrop, findCover, findLiner, findSeal, findStamp, type WCard } from "@/lib/wcards";

// ============================================================================
// THE ENVELOPE SCENE — the open sequence the reference product is named for,
// choreographed here in CSS 3D + one GSAP timeline:
//
//   1  the envelope FRONT, addressed to the guest, with its stamp, resting on
//      the backdrop the couple chose;
//   2  it turns over (rotateY) — the BACK: pocket, side flaps, the top flap
//      closed under a wax seal;
//   3  the seal breaks (scale + fade);
//   4  the flap lifts (rotateX from its top edge) and the LINER shows;
//   5  the card slides UP out of the pocket, above the flap;
//   6  the envelope sinks and fades, the card settles centred, full size —
//      and, if the design has a back, a tap turns it over.
//
// Reduced motion: the card is simply shown, settled, with the envelope
// beneath it — same content, no choreography. `onSettled` fires either way so
// the page can reveal the details below.
// ============================================================================

export type EnvelopeChoice = { cover?: string; liner?: string; stamp?: string; seal?: string; backdrop?: string };

export default function EnvelopeScene({
  lang,
  card,
  front,
  back,
  choice,
  guest,
  names,
  city,
  initials,
  autoplay = true,
  onSettled,
  compact = false,
}: {
  lang: Lang;
  card: WCard;
  front: React.ReactNode;
  back?: React.ReactNode;
  choice: EnvelopeChoice;
  guest?: string;
  names: string;
  city: string;
  initials: [string, string];
  autoplay?: boolean;
  onSettled?: () => void;
  /** the studio's stage: smaller, replays on click */
  compact?: boolean;
}) {
  const cover = findCover(choice.cover), liner = findLiner(choice.liner), stamp = findStamp(choice.stamp), seal = findSeal(choice.seal), backdrop = findBackdrop(choice.backdrop);
  const root = useRef<HTMLDivElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "settled">("idle");
  const [flipped, setFlipped] = useState(false);
  const landscape = card.shape === "landscape";
  // the callback lives in a ref: a parent re-render must not restart the timeline
  const settledRef = useRef(onSettled);
  useEffect(() => { settledRef.current = onSettled; }, [onSettled]);

  const settle = useCallback(() => {
    const el = root.current;
    if (!el) return;
    gsap.set(el.querySelector(".es__env"), { rotateY: 180 });
    gsap.set(el.querySelector(".es__seal"), { autoAlpha: 0 });
    gsap.set(el.querySelector(".es__flap"), { rotateX: -180 });
    gsap.set(el.querySelector(".es__card"), { y: "-30%", scale: 1.12, z: 1 });
    // the envelope's PARTS sink and fade — never the wrapper, the card lives inside it
    gsap.set(el.querySelectorAll(".es__backPaper, .es__front, .es__liner, .es__pocket, .es__side, .es__flap"), { y: 60, autoAlpha: 0 });
    setPhase("settled");
    settledRef.current?.();
  }, []);

  const play = useCallback(() => {
    const el = root.current;
    if (!el) return;
    tl.current?.kill();
    const env = el.querySelector(".es__env"), sealEl = el.querySelector(".es__seal"), flap = el.querySelector(".es__flap"), cardEl = el.querySelector(".es__card");
    const parts = el.querySelectorAll(".es__backPaper, .es__front, .es__liner, .es__pocket, .es__side, .es__flap");
    if (!env || !sealEl || !flap || !cardEl) return;
    setFlipped(false);
    setPhase("playing");
    // 3D layering is by translateZ, not z-index (z-index is ignored inside a
    // preserve-3d parent): liner 0 · card 1 · pocket/sides 2 · flap 3 · seal 4;
    // the card jumps to 8 the moment it clears the flap
    gsap.set(env, { rotateY: 0 }); gsap.set(sealEl, { autoAlpha: 1, scale: 1 }); gsap.set(parts, { y: 0, autoAlpha: 1 }); gsap.set(flap, { rotateX: 0 }); gsap.set(cardEl, { y: "0%", scale: 1, z: 1 });
    const t = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => { setPhase("settled"); settledRef.current?.(); } });
    t.to(env, { rotateY: 180, duration: 1.1, delay: 0.7 })
      .to(sealEl, { scale: 1.35, autoAlpha: 0, duration: 0.45, ease: "power2.out" }, "+=0.25")
      .to(flap, { rotateX: -180, duration: 0.9 }, "-=0.1")
      // the card slides up behind the pocket (z 1 < 2) — out of the mouth — and
      // the envelope then sinks and fades around it, so nothing ever pops
      .to(cardEl, { y: "-30%", duration: 1.0, ease: "power2.inOut" }, "-=0.2")
      .to(parts, { y: 60, autoAlpha: 0, duration: 0.8 }, "-=0.15")
      .to(cardEl, { scale: 1.12, duration: 0.8, ease: "power2.out" }, "<");
    tl.current = t;
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const reduce = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (reduce) { settle(); return; }
    const id = window.setTimeout(play, 300);
    return () => { window.clearTimeout(id); tl.current?.kill(); };
  }, [autoplay, play, settle]);

  const style = {
    "--es-back": backdrop.css, "--es-cover": cover.paper, "--es-coverInk": cover.ink, "--es-liner": liner.css, "--es-wax": seal.wax,
  } as React.CSSProperties;

  return (
    <div ref={root} className={`es${compact ? " es--compact" : ""}${landscape ? " es--land" : ""}${backdrop.dark ? " es--darkBack" : ""}${cover.dark ? " es--darkCover" : ""} es--${phase}${flipped ? " es--flipped" : ""}`} style={style} data-phase={phase}>
      <div className="es__stage">
        <div className="es__envWrap">
          <div className="es__env">
            {/* ---------------------------------------------- FRONT */}
            <div className="es__face es__front">
              <div className="es__stamp"><Stamp kind={stamp.id} initials={initials} /></div>
              <div className="es__postmark" aria-hidden="true"><span>ԿՆԻՔ · {new Date().getFullYear()}</span></div>
              <div className="es__address">
                <p className="es__to">{guest ? (lang === "hy" ? `Հարգելի՛ ${guest}` : `Dear ${guest}`) : lang === "hy" ? "Հարգելի՛ հյուր" : "Dear guest"}</p>
                <p className="es__from">{names}</p>
                <p className="es__city">{city}</p>
              </div>
            </div>
            {/* ----------------------------------------------- BACK */}
            <div className="es__face es__back">
              <div className="es__backPaper" />
              <div className="es__liner" />
              <div className="es__card">
                <div className="es__cardIn">
                  <div className="es__cardFront">{front}</div>
                  {back && <div className="es__cardBack">{back}</div>}
                </div>
              </div>
              <div className="es__pocket" />
              <div className="es__side es__side--l" /><div className="es__side es__side--r" />
              <div className="es__flap">
                <div className="es__flapOut" />
                <div className="es__flapIn" />
              </div>
              <button type="button" className="es__seal" aria-label={lang === "hy" ? "Բացել ծրարը" : "Open the envelope"} onClick={() => (phase === "idle" ? play() : undefined)}>
                <Seal kind={seal.id} initials={initials} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {phase === "settled" && back && (
        <button type="button" className="es__turn" onClick={() => setFlipped((f) => !f)}>
          {flipped ? (lang === "hy" ? "Առջևի երես" : "Front") : lang === "hy" ? "Շրջել քարտը" : "Turn the card"}
        </button>
      )}
      {compact && phase === "settled" && (
        <button type="button" className="es__replay" onClick={play}>{lang === "hy" ? "Կրկնել" : "Replay"}</button>
      )}
      {phase === "idle" && !autoplay && (
        <button type="button" className="kn-btn es__open" onClick={play}>{lang === "hy" ? "Բացել ծրարը" : "Open the envelope"}</button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- STAMP & SEAL

export function Stamp({ kind, initials }: { kind: string; initials: [string, string] }) {
  return (
    <svg viewBox="0 0 60 72" className="es__stampSvg" aria-hidden="true">
      <defs>
        <pattern id="es-perf" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="#000" /></pattern>
        <mask id="es-perfMask"><rect width="60" height="72" fill="#fff" /><rect width="60" height="72" fill="url(#es-perf)" /></mask>
      </defs>
      <rect width="60" height="72" fill="#f7f3ea" mask="url(#es-perfMask)" />
      <rect x="5" y="5" width="50" height="62" fill="var(--es-stampBg, #e9dcc3)" />
      <g style={{ color: "#5a4a2e" }}>
        {kind === "pomegranate" && <use href="#w-pomegranate" x="12" y="12" width="36" height="36" style={{ ["--m2" as string]: "#f7f3ea" }} />}
        {kind === "ararat" && <use href="#w-ararat" x="6" y="14" width="48" height="36" style={{ ["--m2" as string]: "#f7f3ea" }} />}
        {kind === "wreath" && <use href="#w-wreath" x="12" y="12" width="36" height="36" style={{ ["--m2" as string]: "#f7f3ea" }} />}
        {kind === "hearts" && <><use href="#w-heart" x="14" y="16" width="20" height="20" /><use href="#w-heart" x="26" y="24" width="20" height="20" opacity="0.7" /></>}
        {kind === "dove" && <use href="#w-dove" x="8" y="14" width="44" height="36" style={{ ["--m2" as string]: "#5a4a2e" }} />}
        {kind === "monogram" && (
          <text x="30" y="40" textAnchor="middle" fontFamily="var(--f-display), Georgia, serif" fontSize="22" fill="#5a4a2e">{initials[0]}{initials[1]}</text>
        )}
      </g>
      <text x="30" y="61" textAnchor="middle" fontFamily="var(--f-body), sans-serif" fontSize="6" letterSpacing="1" fill="#5a4a2e">ԿՆԻՔ · ARMENIA</text>
    </svg>
  );
}

export function Seal({ kind, initials }: { kind: string; initials: [string, string] }) {
  if (kind === "none") return null;
  return (
    <span className="es__wax" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="es__waxSvg">
        <path d="M50 4c10 0 14 8 22 10s16-4 22 4-2 16 0 24 10 12 6 22-14 8-20 14-4 16-12 18-14-6-22-6-14 8-22 6-6-12-12-18S2 74 0 64s6-14 6-22-6-16 0-24 14-2 22-4S40 4 50 4z" fill="var(--es-wax)" />
        <circle cx="50" cy="52" r="30" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <g style={{ color: "rgba(255,255,255,0.85)" }}>
          {kind === "pomegranate" && <use href="#w-pomegranate" x="30" y="30" width="40" height="40" style={{ ["--m2" as string]: "var(--es-wax)" }} />}
          {kind === "eternity" && <use href="#w-eternity" x="28" y="30" width="44" height="44" style={{ ["--m2" as string]: "var(--es-wax)" }} />}
          {kind === "heart" && <use href="#w-heart" x="30" y="32" width="40" height="40" />}
          {kind === "leaf" && <use href="#w-leafSprig" x="30" y="28" width="40" height="46" />}
          {(kind === "monogram" || kind === "gold") && (
            <text x="50" y="62" textAnchor="middle" fontFamily="var(--f-display), Georgia, serif" fontSize="30" fill="rgba(255,255,255,0.9)">{initials[0]}{initials[1]}</text>
          )}
        </g>
      </svg>
    </span>
  );
}
