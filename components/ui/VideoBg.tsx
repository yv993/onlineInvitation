"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

// ============================================================================
// VIDEO BACKGROUND — a looping, muted, inline HTML5 video behind a template,
// with the poster ALWAYS underneath: it is what shows before the first frame
// decodes, when autoplay is refused, on the plain layer, and under reduced
// motion (where the video never starts at all — a looping film is motion).
// `preload="none"` + play() on intersection: the file is not fetched until the
// section is near, and pauses when it leaves. play() is .catch()-ed; a
// refused autoplay leaves the poster, which is a correct picture.
// ============================================================================

export default function VideoBg({
  src,
  poster,
  posterAlt = "",
  className = "",
  dim = 0.35,
}: {
  src: string;
  poster: StaticImageData;
  posterAlt?: string;
  className?: string;
  /** 0..1 — a veil over the film so type stays legible; the plate is measured
   *  by the template, not assumed */
  dim?: number;
}) {
  const v = useRef<HTMLVideoElement | null>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    setMotion(true);
  }, []);

  useEffect(() => {
    const el = v.current;
    if (!el || !motion) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [motion]);

  return (
    <div className={`kn-vbg${className ? ` ${className}` : ""}`} aria-hidden="true">
      <Image src={poster} alt={posterAlt} fill sizes="100vw" placeholder="blur" style={{ objectFit: "cover" }} />
      {motion && (
        <video ref={v} className="kn-vbg__v" src={src} muted loop playsInline preload="none" />
      )}
      <span className="kn-vbg__veil" style={{ opacity: dim }} />
    </div>
  );
}
