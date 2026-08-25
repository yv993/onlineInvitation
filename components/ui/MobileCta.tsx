"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { landing, svc, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// THE THUMB BAR — the landing's two verbs, kept under the thumb.
//
// On a phone the nav's CTA is folded into the burger, and the order form is
// six thousand pixels down; the pattern every serious mobile funnel uses is a
// bar pinned to the bottom edge — the reachable zone — carrying the page's
// only two actions: SEE THE EXAMPLES and CREATE. This is that bar.
//
// WHEN IT SHOWS: after the hero has been scrolled past (its own CTAs are the
// first screen's; doubling them is noise) and until the order section arrives
// (the form has its verbs). Two IntersectionObservers, no scroll listener.
//
// WHAT IT IS NOT: content. It renders nothing until JS runs and the hero has
// left — a no-JS visitor loses a shortcut, never a capability, since every
// target is reachable through the page itself. Display is cut at 900px: on a
// desktop the nav is always in reach.
// ============================================================================

export default function MobileCta({ lang }: { lang: Lang }) {
  const base = lang === "hy" ? "" : "/en";
  const [pastHero, setPastHero] = useState(false);
  const [atOrder, setAtOrder] = useState(false);
  const seen = useRef(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const order = document.getElementById("order");
    if (!hero) return;
    const a = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { rootMargin: "-15% 0px 0px 0px" });
    a.observe(hero);
    let b: IntersectionObserver | undefined;
    if (order) {
      b = new IntersectionObserver(([e]) => setAtOrder(e.isIntersecting), { rootMargin: "0px 0px -30% 0px" });
      b.observe(order);
    }
    return () => { a.disconnect(); b?.disconnect(); };
  }, []);

  const on = pastHero && !atOrder;
  if (on) seen.current = true;
  // never mounted until first needed: the hero screen stays bar-free
  if (!seen.current) return null;

  return (
    <div className={`kn-home__bar${on ? " is-on" : ""}`} aria-hidden={!on}>
      <a
        className="kn-btn kn-btn--ghost"
        href="#examples"
        tabIndex={on ? 0 : -1}
        onClick={(e) => {
          const el = document.getElementById("examples");
          if (!el) return;
          e.preventDefault();
          const l = window.__lenis;
          if (l) l.scrollTo("#examples", { offset: -66 });
          else el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        {t(lang, landing.nav.examples)}
      </a>
      <Link className="kn-btn" href={`${base}/customize?category=wedding`} tabIndex={on ? 0 : -1}>
        {t(lang, svc.nav.build)} <Icon name="arrow" size={14} />
      </Link>
    </div>
  );
}
