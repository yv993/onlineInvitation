"use client";

import { useEffect, useRef, useState } from "react";
import { music, ui } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { other, pathFor, t } from "@/lib/i18n";

// ============================================================================
// The two persistent controls. It sits BELOW the envelope (z 1200 against the
// gate's 2000) on purpose — while the card is sealed, the envelope is the only
// thing on screen.
//
// THE LANGUAGE TOGGLE IS AN <a>, not a button. It navigates between two
// server-rendered routes, so it works with JavaScript off, it can be opened in
// a new tab, and each language is a real URL a guest can send on. iStudio's
// am/en switch is client state and neither of its languages has an address.
//
// THE MUSIC BUTTON obeys three rules the references both break:
//   · It never autoplays. Every current browser rejects unmuted autoplay
//     anyway, so a card that "plays music" is really a card with a silent
//     rejected promise — and a wedding invitation that starts making noise in
//     a quiet office is a card that gets closed.
//   · Under `prefers-reduced-motion: reduce` it does not appear at all. A
//     looping track is a continuous, unstoppable stimulus in exactly the way
//     that preference is asking about.
//   · It says which state it is IN, not which state it will go to, and the
//     accessible name changes with it.
// ============================================================================

export default function Chrome({
  lang,
  guest,
  sub = "",
}: {
  lang: Lang;
  guest: string;
  /** Path after the language root — "/i/luys" on a preview, "" on the
   *  landing — so the toggle lands on the SAME page in the other language. */
  sub?: string;
}) {
  const to = other(lang);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    if (!music) return;
    setCanPlay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      // play() rejects on autoplay policy, on a missing file, and if the tab
      // is backgrounded. Any of those must leave the button honest rather than
      // showing "pause" over silence.
      a.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="kn-chrome">
      <a
        className="kn-chip"
        href={pathFor(to, guest, sub)}
        hrefLang={to === "hy" ? "hy-AM" : "en"}
        aria-label={t(lang, ui.langLabel)}
      >
        {t(lang, ui.lang)}
      </a>

      {music && canPlay ? (
        <>
          <button
            type="button"
            className="kn-chip"
            onClick={toggle}
            aria-pressed={playing}
            aria-label={playing ? t(lang, ui.musicOff) : t(lang, ui.musicOn)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="currentColor">
              {playing ? (
                <>
                  <rect x="3" y="2" width="3" height="10" rx="1" />
                  <rect x="8" y="2" width="3" height="10" rx="1" />
                </>
              ) : (
                <path d="M4 2.5v9l7-4.5z" />
              )}
            </svg>
          </button>
          <audio ref={audio} src={music.src} loop preload="none" />
        </>
      ) : (
        <span />
      )}
    </div>
  );
}
