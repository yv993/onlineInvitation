"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// FOLD CARD — a tri-fold that opens as it enters: the two outer panels are
// hinged on the centre panel and swing out on Y (left panel from -180 to 0,
// right panel from 180 to 0), with a subtle shade on the inside faces that
// clears as they open. Under reduced motion the card is simply flat.
// ============================================================================

export default function FoldCard({
  left,
  center,
  right,
  className = "",
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}) {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = el.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const l = root.querySelector<HTMLElement>(".kn-fold__l");
      const r = root.querySelector<HTMLElement>(".kn-fold__r");
      const shades = root.querySelectorAll<HTMLElement>(".kn-fold__shade");
      gsap.set(l, { rotationY: -178, transformOrigin: "100% 50%" });
      gsap.set(r, { rotationY: 178, transformOrigin: "0% 50%" });
      gsap.set(shades, { opacity: 0.55 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 78%", once: true } });
      tl.to(l, { rotationY: 0, duration: 1.4, ease: "power3.inOut" }, 0)
        .to(r, { rotationY: 0, duration: 1.4, ease: "power3.inOut" }, 0.15)
        .to(shades, { opacity: 0, duration: 1.2, ease: "power2.out" }, 0.4);
    });
    return () => mm.revert();
  }, []);

  return (
    <div className={`kn-fold${className ? ` ${className}` : ""}`} ref={el}>
      <div className="kn-fold__p kn-fold__l">
        {left}
        <span className="kn-fold__shade" aria-hidden="true" />
      </div>
      <div className="kn-fold__p kn-fold__c">{center}</div>
      <div className="kn-fold__p kn-fold__r">
        {right}
        <span className="kn-fold__shade" aria-hidden="true" />
      </div>
    </div>
  );
}
