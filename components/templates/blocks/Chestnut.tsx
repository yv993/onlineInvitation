"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Plate from "@/components/Plate";
import { t } from "@/lib/i18n";
import { MONTHS } from "./Family";
import type { Lang, T } from "@/lib/content";
import type { TemplateSpec } from "@/lib/templates";

/** the copy wedding-12 owns */
const L = {
  hint: { hy: "Սեղմեք բանալին կամ կնիքը՝ բացելու համար", en: "Tap the key or the seal to open", ru: "Нажмите на ключ или печать, чтобы открыть" } as T,
  day: { hy: "Հարսանեկան օր", en: "Wedding day", ru: "День свадьбы" } as T,
  date: { hy: "ամսաթիվ", en: "date", ru: "дата" } as T,
  dear: { hy: "Սիրելի՛ հարազատներ և ընկերներ", en: "Dear family and friends!", ru: "Дорогие родные и друзья!" } as T,
  withLove: { hy: "Սիրով՝", en: "With love,", ru: "С любовью," } as T,
  wait: { hy: "Սիրով սպասում ենք ձեզ", en: "We are waiting for you, dear ones!", ru: "Мы ждём вас, дорогие!" } as T,
};

/* ------------------------------------------------ the gate's inline art */
const SealArt = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 3 C74 1 97 20 97 48 C97 76 78 98 50 97 C22 96 3 78 3 50 C3 22 26 5 50 3 Z" fill="#C5A566" />
    <path d="M50 3 C74 1 97 20 97 48 C97 76 78 98 50 97 C22 96 3 78 3 50 C3 22 26 5 50 3 Z" fill="none" stroke="#A8894F" strokeWidth="1.4" />
    <circle cx="50" cy="50" r="34" fill="none" stroke="#A8894F" strokeWidth="1.2" />
    {/* the olive branch relief */}
    <path d="M34 66 C 42 54, 52 44, 66 34" fill="none" stroke="#8F7440" strokeWidth="2" strokeLinecap="round" />
    {[
      [40, 57, -36], [47, 50, -30], [54, 43, -24], [61, 37, -18],
      [44, 61, 24], [51, 54, 30], [58, 47, 36], [64, 40, 42],
    ].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx="5.4" ry="2.3" fill="#B3945A" stroke="#8F7440" strokeWidth="0.7" transform={`rotate(${r} ${x} ${y})`} />
    ))}
  </svg>
);

/** the LOCK ORNAMENT — the corrected film's single horizontal jewel that
 *  lies below the seal: a quatrefoil key bow at the left, the baroque
 *  escutcheon plate over the middle of the shaft, and the teeth at the
 *  right. Drawn as one piece because the reference wears it as one. */
const LockArt = () => (
  <svg viewBox="0 0 210 74" aria-hidden="true">
    <defs>
      <linearGradient id="knLockG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E0C48D" />
        <stop offset="0.45" stopColor="#C5A566" />
        <stop offset="1" stopColor="#8F7440" />
      </linearGradient>
    </defs>
    <g fill="url(#knLockG)" stroke="#7E6435" strokeWidth="1.1">
      {/* the quatrefoil bow */}
      <path d="M40 37 C40 24 32 18 24 22 C14 27 15 41 26 44 C16 50 20 62 31 60 C39 58 41 49 40 37 Z" />
      <path d="M40 37 C40 24 48 18 56 22 C66 27 65 41 54 44 C64 50 60 62 49 60 C41 58 39 49 40 37 Z" />
      <circle cx="40" cy="37" r="6.5" fill="#6E5730" stroke="none" />
      {/* the shaft */}
      <rect x="64" y="33" width="126" height="8" rx="4" />
      {/* the teeth */}
      <path d="M166 41 h9 v14 h-9 z" />
      <path d="M180 41 h8 v10 h-8 z" />
      {/* the escutcheon plate, riding the shaft */}
      <path d="M108 6 C120 6 127 13 125 21 C134 22 138 31 134 38 C139 46 134 56 126 58 C127 66 118 71 108 71 C98 71 89 66 90 58 C82 56 77 46 82 38 C78 31 82 22 91 21 C89 13 96 6 108 6 Z" />
      <path d="M99 20 C104 16 112 16 117 20" fill="none" strokeWidth="1.4" />
    </g>
    <circle cx="108" cy="33" r="7.5" fill="#2E2A20" />
    <path d="M103 39 h10 l3 17 h-16 z" fill="#2E2A20" />
  </svg>
);

/** the gold leaf garland — two mirrored branches meeting at the middle
 *  (the reference's foil ornament under the names) */
const GarlandArt = () => (
  <svg viewBox="0 0 240 54" aria-hidden="true" fill="none" stroke="#B08D4F" strokeWidth="1.6" strokeLinecap="round">
    {[1, -1].map((m) => (
      <g key={m} transform={m === -1 ? "translate(240 0) scale(-1 1)" : undefined}>
        <path d="M120 44 C 92 40, 52 34, 16 12" />
        {[
          [96, 36, -30], [76, 31, -34], [56, 25, -40], [38, 19, -46], [24, 14, -50],
        ].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="9" ry="3.6" fill="#C5A566" fillOpacity="0.5" transform={`rotate(${r} ${x} ${y})`} />
        ))}
        <circle cx="88" cy="30" r="2" fill="#B08D4F" />
        <circle cx="47" cy="19" r="2" fill="#B08D4F" />
      </g>
    ))}
  </svg>
);

/** the skeleton key as a light line sketch (the reference column's opener) */
const KeySketch = () => (
  <svg viewBox="0 0 120 34" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="16" cy="17" r="9" />
    <circle cx="16" cy="17" r="3.4" />
    <path d="M25 17 L 102 17" />
    <path d="M88 17 L 88 26 M 98 17 L 98 24" />
  </svg>
);

/** the dress-code string: dress, bow, and shirt line-art hanging from one
 *  cord (the reference's garment row over the swatches) */
export function GarmentsArt() {
  return (
    <div className="kn-let__wear" data-rise aria-hidden="true">
      <svg viewBox="0 0 300 96" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* the cord */}
        <path d="M6 16 C 80 30, 220 30, 294 16" />
        {/* the dress */}
        <path d="M70 26 v5" />
        <path d="M60 31 h20" />
        <path d="M62 31 c 1 9 -9 16 -9 30 c 0 7 34 7 34 0 c 0 -14 -10 -21 -9 -30" />
        <path d="M64 44 h12" />
        {/* the bow */}
        <path d="M150 32 c -11 -8 -24 3 -13 11 c 5 3 11 0 13 -5 c 2 5 8 8 13 5 c 11 -8 -2 -19 -13 -11 z" />
        <path d="M147 43 l -3 12 M153 43 l 3 12" />
        {/* the shirt */}
        <path d="M230 27 v5" />
        <path d="M224 32 l 6 5 6 -5" />
        <path d="M218 32 l -8 9 8 5 2 -4 v 22 h 20 v -22 l 2 4 8 -5 -8 -9" />
      </svg>
    </div>
  );
}

/** the estate, as a line sketch (the reference's architectural drawing) */
export function ManorSketch() {
  return (
    <div className="kn-let__manor kn-tb" data-rise aria-hidden="true">
      <svg viewBox="0 0 260 120" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M60 58 L130 22 L200 58" />
        <path d="M74 58 L74 104 L186 104 L186 58" />
        <path d="M96 58 L130 40 L164 58" />
        <rect x="118" y="76" width="24" height="28" />
        <rect x="84" y="66" width="16" height="18" />
        <rect x="160" y="66" width="16" height="18" />
        <path d="M20 104 L240 104" />
        <path d="M30 104 C 42 92, 50 92, 58 104" />
        <path d="M202 104 C 214 92, 222 92, 230 104" />
        <path d="M130 22 L130 12 M124 16 L136 16" />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------- the gate */
/** The SEALED ENVELOPE (wedding-12 «Շագանակ», the client's 2026-08-31
 *  master spec): a sage envelope under a gold wax seal, an escutcheon and
 *  a skeleton key. One tap: the key slides in and turns, sparks scatter,
 *  the seal cracks, the top flap opens, and the letter rises — then the
 *  gate fades from over the ALREADY-RENDERED page (the GiftBox rule: an
 *  embed, a no-JS visitor and a reduced-motion reader never meet it). */
/** THE FILM ITSELF (client, 2026-08-31: «why didn't you use the mp4»). The
 *  reference render IS the gate now — trimmed to the window that carries no
 *  couple's name (the card's own «Aria & Leo» would be someone else's
 *  wedding) and with the recording's mouse cursor painted off the seal.
 *  ~100KB; the drawn envelope below stays as the fallback. */
const FILM_SRC = "/video/envelope-sage.mp4";
const FILM_POSTER = "/video/envelope-sage-poster.webp";

export function SealGate({ lang, a, b, dateLine, greet }: { lang: Lang; a: string; b: string; dateLine: string; greet?: string }) {
  const [shut, setShut] = useState(false);
  const [gone, setGone] = useState(true);
  const [film, setFilm] = useState(true);
  const played = useRef(false);
  const root = useRef<HTMLDivElement | null>(null);
  const vid = useRef<HTMLVideoElement | null>(null);

  const open = useCallback(() => {
    setShut(false);
    document.documentElement.classList.remove("kn-locked");
    window.setTimeout(() => setGone(true), 1000);
  }, []);

  useEffect(() => {
    // the gate exists only for visitors who asked for motion
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    setShut(true);
    setGone(false);
    document.documentElement.classList.add("kn-locked");
    return () => document.documentElement.classList.remove("kn-locked");
  }, []);

  /** the drawn envelope's own opening — the fallback when the film cannot
   *  play (a blocked autoplay policy, a failed fetch, an old browser) */
  const drawn = useCallback(() => {
    if (!root.current) return;
    const q = (s: string) => root.current!.querySelectorAll(s);
    // THE CORRECTED FILM (client's second video, 2026-08-31), beat for beat:
    //   the seal lights up · gold dust bursts out of it and swirls
    //   the TOP FLAP ALONE folds up and back (hinge at its top edge)
    //   the cream letter rises straight up out of the pocket
    //   it comes to meet the reader, and the page is underneath
    // The earlier four-flap "blossom" was read from the FIRST video and is
    // gone: this envelope's front panels never move.
    gsap.timeline()
      .to(q(".kn-chg__ring"), { autoAlpha: 1, scale: 1.5, duration: 0.5, ease: "power1.out" })
      .to(q(".kn-chg__seal"), { scale: 1.08, duration: 0.25, ease: "power1.inOut" }, "<")
      .to(q(".kn-chg__spark"), { opacity: 1, duration: 0.01 })
      .to(q(".kn-chg__spark"), {
        // the dust does not fly straight out: it swirls, the way the film's does
        x: (i: number) => Math.cos(i * 0.5236) * (44 + (i % 4) * 16),
        y: (i: number) => Math.sin(i * 0.5236) * (40 + (i % 3) * 14),
        rotate: (i: number) => (i % 2 ? 120 : -120),
        opacity: 0, duration: 0.85, ease: "power2.out",
      }, "<")
      .to(q(".kn-chg__ring"), { autoAlpha: 0, scale: 2.2, duration: 0.45 }, "<")
      .to(q(".kn-chg__seal"), { scale: 0, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "<")
      .to(q(".kn-chg__lock"), { autoAlpha: 0, duration: 0.4 }, "<+0.1")
      // the top flap alone, hinged at its top edge — the spec's own numbers
      .to(q(".kn-chg__flapT"), { rotateX: 180, duration: 0.9, ease: "power2.inOut" }, "-=0.45")
      .set(q(".kn-chg__flapT"), { backgroundColor: "#3C4B32" }, "-=0.45")
      // the letter rises out of the pocket…
      .to(q(".kn-chg__letter"), { y: "-58%", duration: 0.8, ease: "power2.out" }, "-=0.35")
      // …its print fades, and the plain cream comes to meet the reader as
      // the gate gives way to the page underneath
      .to(q(".kn-chg__frame, .kn-chg__day, .kn-chg__letter b, .kn-chg__letter small, .kn-chg__greet"),
        { autoAlpha: 0, duration: 0.28 }, "-=0.12")
      .add(() => open())
      .to(q(".kn-chg__letter"), { y: "-52%", scale: 2.1, autoAlpha: 0, duration: 0.85, ease: "power2.in", transformOrigin: "50% 42%" });
  }, [open]);

  const play = useCallback(() => {
    if (played.current) return;
    played.current = true;
    const v = vid.current;
    if (!film || !v) { drawn(); return; }
    let closed = false;
    const finish = () => { if (closed) return; closed = true; window.clearTimeout(guard); open(); };
    // 'ended' is the real signal; the timer is only a guard, because a tab
    // that loses focus mid-clip may never fire it and the reader would be
    // left staring at a frozen envelope
    const guard = window.setTimeout(finish, 4200);
    v.addEventListener("ended", finish, { once: true });
    void Promise.resolve(v.play()).catch(() => {
      window.clearTimeout(guard);
      v.removeEventListener("ended", finish);
      setFilm(false);
      drawn();
    });
  }, [film, drawn, open]);


  if (gone) return null;
  return (
    <div ref={root} className={`kn-chg${shut ? " is-shut" : ""}${film ? " is-film" : ""}`} onClick={play} aria-hidden="true">
      {film && (
        <video
          ref={vid}
          className="kn-chg__film"
          src={FILM_SRC}
          poster={FILM_POSTER}
          muted
          playsInline
          preload="auto"
          onError={() => setFilm(false)}
        />
      )}
      <div className="kn-chg__env">
        <span className="kn-chg__liner" />
        {/* the card carries its own keyhole and key, as in the reference film
            — the ornaments are printed on it, not machinery beside it */}
        {/* the letter, wearing the film's gold chevron frame around the
            names — it rises out of the pocket and becomes the page */}
        <span className="kn-chg__letter">
          <span className="kn-chg__frame" aria-hidden="true" />
          <i className="kn-chg__day">{t(lang, L.day)}</i>
          {greet && <i className="kn-chg__greet">{greet}</i>}
          <b>{b ? `${a} & ${b}` : a}</b>
          <small>{dateLine}</small>
        </span>
        <span className="kn-chg__flap kn-chg__flapB" />
        <span className="kn-chg__flap kn-chg__flapL" />
        <span className="kn-chg__flap kn-chg__flapR" />
        <span className="kn-chg__flapT" />
        {Array.from({ length: 8 }).map((_, i) => <span key={i} className="kn-chg__spark" />)}
        <span className="kn-chg__ring" aria-hidden="true" />
        <span className="kn-chg__seal"><SealArt /></span>
        {/* the lock ornament lying below the seal, as the film wears it */}
        <span className="kn-chg__lock"><LockArt /></span>
      </div>
      <p className="kn-chg__hint">{t(lang, L.hint)}</p>
    </div>
  );
}

/* -------------------------------------------------------------- the hero */
/** the LETTER hero: script names over the ✧ divider, the photograph, the
 *  outlined date box, a swirl-and-heart stroke, and the letter that signs
 *  itself «with love» */
export function LetterHero({ lang, a, b, kicker, iso, time, photo, photoAlt, invite, embed }: {
  lang: Lang; a: string; b: string; kicker: T; iso: string; time?: string;
  photo: TemplateSpec["cover"] | string; photoAlt: string; invite?: T; embed?: boolean;
}) {
  const H = embed ? ("div" as const) : ("h1" as const);
  const names = b ? `${a} & ${b}` : a;
  const mIdx = Number(iso.slice(5, 7)) - 1;
  const month = MONTHS[lang]?.[mIdx] ?? iso.slice(5, 7);
  const day = iso.slice(8, 10);
  const year = iso.slice(0, 4);
  return (
    <div className="kn-let" data-rise>
      <span className="kn-let__keySketch" aria-hidden="true"><KeySketch /></span>
      <H className="kn-let__names">{names}</H>
      <span className="kn-let__garland" aria-hidden="true" data-rise><GarlandArt /></span>
      <p className="kn-let__kick" data-track>{t(lang, kicker)}</p>

      <div className="kn-let__photo" data-rise data-reveal>
        <Plate img={photo} alt={photoAlt} sizes="(max-width: 900px) 92vw, 460px" ratio="4 / 5" priority={!embed} zoom drift={0.05} />
      </div>

      <p className="kn-let__label" data-rise>{t(lang, L.day)}</p>
      {/* the reference's date row: the month, the day inside a heart, the year */}
      <div className="kn-let__box" data-rise>
        <span className="kn-let__boxM">{month}</span>
        <span className="kn-let__day"><i aria-hidden="true">♡</i><b>{day}</b></span>
        <span className="kn-let__boxY">{year}</span>
        {time && <span className="kn-let__boxTime">{time}</span>}
      </div>

      <svg className="kn-let__swirl" viewBox="0 0 140 26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M6 16 C 26 4, 44 24, 58 14" />
        <path d="M65 12.5 c 0 -3 4 -4.4 5 -1.2 c 1 -3.2 5 -1.8 5 1.2 c 0 3.4 -5 6.5 -5 6.5 c 0 0 -5 -3.1 -5 -6.5 z" />
        <path d="M82 14 C 96 4, 116 22, 134 12" />
      </svg>

      {invite && (
        <div className="kn-let__msg" data-rise>
          <p className="kn-let__dear">{t(lang, L.dear)}</p>
          <p className="kn-let__note">{t(lang, invite)}</p>
          <p className="kn-let__with">{t(lang, L.withLove)}</p>
          <p className="kn-let__sign">{names}</p>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- the closing */
/** the FAREWELL: a maroon heart, the waiting line, one last photograph */
export function Farewell({ lang, img, alt }: { lang: Lang; img: TemplateSpec["cover"] | string; alt: string }) {
  return (
    <div className="kn-far" data-rise>
      <span className="kn-far__heart" aria-hidden="true">♥</span>
      <p className="kn-far__t">{t(lang, L.wait)}</p>
      <div className="kn-far__photo" data-reveal>
        <Plate img={img} alt={alt} sizes="(max-width: 900px) 88vw, 420px" ratio="4 / 5" zoom drift={0.06} />
      </div>
    </div>
  );
}
