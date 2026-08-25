"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

// ============================================================================
// MUSIC DOCK — the floating background-music controller with a waveform.
//
// Rules the references break, kept: it never autoplays (every current
// browser rejects unmuted autoplay anyway; a card that starts making noise
// in a quiet office gets closed); under reduced motion it does not appear;
// the label states the state it is IN and changes with it.
//
// The waveform is REAL when it can be: a Web Audio AnalyserNode reads the
// playing track and draws its frequency bins to a small canvas. Where the
// AudioContext is refused (rare) it falls back to a CSS idle pulse. Nothing
// here contacts a third party — the tracks are self-hosted (and, in this
// demo, SYNTHESIZED beds a couple replaces with their own).
// ============================================================================

export default function MusicDock({
  src,
  label,
  dark = false,
  inline = false,
}: {
  src: string;
  label: string;
  dark?: boolean;
  /** sits in the flow (a preview card) instead of fixed bottom-right */
  inline?: boolean;
}) {
  const audio = useRef<HTMLAudioElement | null>(null);
  // A couple's own track on a foreign host: without CORS headers a
  // MediaElementSource outputs silence and crossOrigin="anonymous" refuses
  // to load at all. So foreign tracks play plainly and the wave falls back
  // to the CSS pulse; our self-hosted beds keep the real analyser.
  const external = /^https?:/i.test(src);
  const cv = useRef<HTMLCanvasElement | null>(null);
  const [on, setOn] = useState(false);
  const [ok, setOk] = useState(false);
  const an = useRef<AnalyserNode | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    setOk(window.matchMedia("(prefers-reduced-motion: no-preference)").matches);
  }, []);

  const draw = () => {
    const c = cv.current, a = an.current;
    if (!c || !a) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const data = new Uint8Array(a.frequencyBinCount);
    a.getByteFrequencyData(data);
    const W = c.width, H = c.height, bars = 18;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "currentColor";
    for (let i = 0; i < bars; i++) {
      const v = data[Math.floor((i / bars) * data.length * 0.5)] / 255;
      const h = Math.max(2, v * H);
      ctx.fillRect(i * (W / bars) + 1, (H - h) / 2, W / bars - 2, h);
    }
    raf.current = requestAnimationFrame(draw);
  };

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      try {
        if (!an.current && !external) {
          const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AC();
          const srcNode = ctx.createMediaElementSource(a);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          srcNode.connect(analyser);
          analyser.connect(ctx.destination);
          an.current = analyser;
        }
      } catch {
        an.current = null; // CSS pulse fallback
      }
      a.play().then(
        () => {
          setOn(true);
          if (an.current) raf.current = requestAnimationFrame(draw);
        },
        () => setOn(false),
      );
    } else {
      a.pause();
      setOn(false);
      cancelAnimationFrame(raf.current);
    }
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  if (!ok) return null;
  return (
    <div className={`kn-dock${dark ? " kn-dock--dark" : ""}${inline ? " kn-dock--inline" : ""}`} data-on={on ? "" : undefined}>
      <button type="button" className="kn-dock__b" onClick={toggle} aria-pressed={on} aria-label={label}>
        <Icon name={on ? "x" : "music"} size={16} />
      </button>
      <div className="kn-dock__wave" aria-hidden="true">
        {an.current ? <canvas ref={cv} width={72} height={20} /> : (
          <span className="kn-dock__pulse">
            {Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}
          </span>
        )}
      </div>
      <span className="kn-dock__l">{label}</span>
      <audio ref={audio} src={src} loop preload="none" crossOrigin={external ? undefined : "anonymous"} />
    </div>
  );
}
