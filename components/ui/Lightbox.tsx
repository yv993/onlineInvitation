"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Icon from "@/components/Icon";

// ============================================================================
// LIGHTBOX — a dialog over a set of plates: arrows, keyboard (← → Esc), and
// SWIPE (pointer-tracked, 40px threshold, with the picture following the
// finger and springing back). Focus moves in, body scroll locks, focus
// returns to the thumbnail that opened it. Touch-friendly targets 44px+.
// ============================================================================

export type LbItem = { img: StaticImageData | string; alt: string };

export function useLightbox() {
  const [i, setI] = useState<number | null>(null);
  return { i, open: (n: number) => setI(n), close: () => setI(null), setI };
}

export default function Lightbox({
  items,
  index,
  onClose,
  onIndex,
  closeLabel = "Close",
}: {
  items: LbItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (n: number) => void;
  closeLabel?: string;
}) {
  const box = useRef<HTMLDivElement | null>(null);
  const img = useRef<HTMLDivElement | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const dx = useRef(0);

  const open = index !== null;
  const n = items.length;
  const go = (d: number) => onIndex(((index ?? 0) + d + n) % n);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("kn-locked");
    box.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("kn-locked");
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  if (!open || index === null) return null;
  const it = items[index];

  const down = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    dx.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!start.current || !img.current) return;
    dx.current = e.clientX - start.current.x;
    img.current.style.transform = `translateX(${dx.current}px)`;
    img.current.style.transition = "none";
  };
  const up = () => {
    if (!img.current) return;
    img.current.style.transition = "transform 0.35s cubic-bezier(.22,.61,.36,1)";
    img.current.style.transform = "";
    if (Math.abs(dx.current) > 40) go(dx.current < 0 ? 1 : -1);
    start.current = null;
  };

  return (
    <div className="kn-lb" role="dialog" aria-modal="true" aria-label={it.alt} ref={box}>
      <button type="button" className="kn-lb__veil" aria-label={closeLabel} onClick={onClose} />
      <button type="button" className="kn-lb__x" aria-label={closeLabel} onClick={onClose}>
        <Icon name="x" size={22} />
      </button>
      {n > 1 && (
        <>
          <button type="button" className="kn-lb__nav kn-lb__nav--l" aria-label="Previous" onClick={() => go(-1)}>
            <Icon name="chevron" size={22} />
          </button>
          <button type="button" className="kn-lb__nav kn-lb__nav--r" aria-label="Next" onClick={() => go(1)}>
            <Icon name="chevron" size={22} />
          </button>
        </>
      )}
      <div className="kn-lb__img" ref={img} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <Image key={index} src={it.img} alt={it.alt} sizes="92vw" placeholder={typeof it.img === "string" ? "empty" : "blur"} style={{ objectFit: "contain" }} fill />
      </div>
      <p className="kn-lb__cap">
        {it.alt} · {index + 1}/{n}
      </p>
    </div>
  );
}
