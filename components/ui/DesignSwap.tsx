"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

// ============================================================================
// THE DESIGN SWAP — the proof beside the promise. One phone, the SAME
// couple, and the design under them changing: every strip here is our own
// capture of a real template wearing the same sample names, so the thing the
// section claims («only the design changes») is the thing the reader is
// looking at. The dots are the marquee's dots (same classes, same shape);
// pressing one shows that design and stops the clock, because a hand on it
// outranks the timer.
// ============================================================================

export type SwapItem = { id: string; name: string; img: StaticImageData | string };

export default function DesignSwap({ items, label, every = 3200 }: { items: SwapItem[]; label: string; every?: number }) {
  const [i, setI] = useState(0);
  const held = useRef(false);

  // the clock: only where motion is welcome, and only until someone touches it
  useEffect(() => {
    if (items.length < 2) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const t = setInterval(() => { if (!held.current) setI((k) => (k + 1) % items.length); }, every);
    return () => clearInterval(t);
  }, [items.length, every]);

  const cur = items[i];
  if (!cur) return null;

  return (
    <div className="kn-swap__demo" aria-label={label}>
      <div className="kn-swap__phone">
        {/* every strip stays mounted so a switch is a crossfade, not a reload —
            the image is already decoded when its turn comes */}
        {items.map((it, k) => (
          <span key={it.id} className="kn-swap__shot" data-on={k === i ? "" : undefined} aria-hidden={k !== i}>
            <Image src={it.img} alt="" fill sizes="(max-width: 899px) 80vw, 360px" draggable={false} priority={k === 0} />
          </span>
        ))}
      </div>
      <ol className="kn-mq__dots kn-swap__dots">
        {items.map((it, k) => (
          <li key={it.id}>
            <button type="button" className="kn-mq__dot" aria-current={k === i ? "true" : "false"}
              onClick={() => { held.current = true; setI(k); }}>
              <span className="kn-sr">{it.name}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="kn-swap__cap" aria-live="polite">{cur.name}</p>
    </div>
  );
}
