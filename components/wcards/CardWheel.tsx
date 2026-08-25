"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WCardFace from "./WCardFace";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { WCard } from "@/lib/wcards";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// THE WHEEL — /wedding-cards' opening move: the ten most-chosen card designs
// standing on a great buried wheel, and the scroll turns it.
//
// The reference is a RadialScrollGallery built on @gsap/react — a package
// this site does not carry — so its anatomy is rebuilt on the plain GSAP that
// is already here, with its numbers kept:
//   the circle    radius 550 (220 under 768px), 45% of it above the ground
//   the seats     item i at angle i·2π/n, rotated (angle + 90°) so every card
//                 stands on the rim like a spoke
//   the ride      the ring rotates 0 → 360° while the section is PINNED,
//                 scrubbed over ~1800px of scroll
//   the ground    a mask fades the wheel out where it meets the earth
// Its hover grammar — the touched card lifts while the others dim and blur —
// is pure CSS here (`:hover` + `:has`), no state, fine pointers only.
//
// Every seat is a real <a> into that design's studio. The entrance (cards
// popping onto the rim) and the ride are created only inside the
// no-preference media block, so reduced motion and no-JS both get the
// standing wheel with its top arc of cards — the finished page, still.
// ============================================================================

const L = {
  kicker: { hy: "Պտտվող ցուցափեղկ", en: "The turning case" },
  title: { hy: "Տասը ամենասիրվածները՝ անվի վրա", en: "The ten most chosen, on the wheel" },
  hint: { hy: "Ոլորեք՝ անիվը պտտելու համար", en: "Scroll to turn the wheel" },
  open: { hy: "Բացել ստուդիայում", en: "Open in the studio" },
} as const;

export default function CardWheel({ lang, cards }: { lang: Lang; cards: WCard[] }) {
  const base = lang === "hy" ? "" : "/en";
  const pin = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLUListElement | null>(null);
  const n = cards.length;

  useEffect(() => {
    const wrap = pin.current;
    const ul = ring.current;
    if (!wrap || !ul) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // the cards pop onto the rim as the wheel arrives…
      gsap.fromTo(
        ul.children,
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1.1, ease: "back.out(1.2)", stagger: 0.05,
          scrollTrigger: { trigger: wrap, start: "top 80%", once: true } },
      );
      // …then the scroll turns it a full lap while the section holds still
      gsap.to(ul, {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          pin: true,
          start: "center center",
          end: () => `+=${window.innerWidth < 768 ? 1300 : 1800}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, [n]);

  return (
    <section className="kn-wh" aria-label={t(lang, L.title)}>
      <div className="kn-wh__head">
        <p className="kn-label" data-rise>{t(lang, L.kicker)}</p>
        <h2 className="kn-h2" data-rise>{t(lang, L.title)}</h2>
        <p className="kn-wh__hint" data-rise>{t(lang, L.hint)} ↓</p>
      </div>
      <div className="kn-wh__pin" ref={pin}>
        <div className="kn-wh__ground">
          <ul className="kn-wh__ring" ref={ring}>
            {cards.map((c, i) => {
              const a = (i / n) * 2 * Math.PI;
              // the ring is sized in ems so one set of seats serves both radii;
              // --wh-r is the radius in px, set by the CSS per breakpoint
              const x = Math.cos(a).toFixed(4);
              const y = Math.sin(a).toFixed(4);
              const rot = ((a * 180) / Math.PI + 90).toFixed(2);
              return (
                <li
                  key={c.id}
                  className="kn-wh__it"
                  style={{ transform: `translate(-50%, -50%) translate(calc(${x} * var(--wh-r)), calc(${y} * var(--wh-r))) rotate(${rot}deg)` }}
                >
                  <Link className="kn-wh__card" href={`${base}/wedding-cards/${c.id}`} aria-label={`${t(lang, L.open)} — ${t(lang, c.name)}`}>
                    <WCardFace card={c} variant={c.variants[0]} lang={lang} className="kn-wh__face" />
                    <span className="kn-wh__name">{t(lang, c.name)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
