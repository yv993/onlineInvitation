"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import ThemeToggle from "./ui/ThemeToggle";
import { auth, landing, svc } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { other, pathFor, t } from "@/lib/i18n";

// ============================================================================
// THE SITE NAV — sticky glass bar, five links, language toggle, CTA, and the
// two behaviours the blueprint names:
//
//   ACTIVE LINK ON SCROLL — one IntersectionObserver over the landing's
//   anchored sections with a band across the middle of the viewport
//   (rootMargin -40% / -55%): the section that occupies the middle third is
//   the current one. No scroll listener, no per-frame maths.
//
//   MOBILE DRAWER — a real dialog: focus moves in on open, Escape and the
//   overlay close it, body scroll locks while it is up (the gate's own
//   `kn-locked` class), focus returns to the button on close. Below 900px the
//   link row hides and the burger appears; above it the drawer never mounts.
//
// SMOOTH ANCHORS — with Lenis running, `scrollIntoView` and CSS
// scroll-behavior fight it. Motion.tsx publishes the Lenis instance on
// window; the nav uses it when it exists and falls back to a native smooth
// scroll (reduced-motion visitors, or before Motion has mounted).
//
// On pages other than the landing the anchors become real links back to
// `/#section`, so the same nav serves /order and /templates/[id].
// ============================================================================

type LenisLike = { scrollTo: (target: string | number, opts?: { offset?: number }) => void };
declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

const NAV_H = 66;

export default function SiteNav({
  lang,
  onLanding = true,
  sub = "",
}: {
  lang: Lang;
  onLanding?: boolean;
  /** path after the language root ("/order", "/templates/luys") so the
   *  language toggle lands on the SAME page in the other language */
  sub?: string;
}) {
  const base = lang === "hy" ? "" : "/en";
  const to = other(lang);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("top");
  const drawer = useRef<HTMLDivElement | null>(null);
  const burger = useRef<HTMLButtonElement | null>(null);

  // TWO ROUTES, not five anchors (2026-08-27, after the reference's bar):
  // the product's doors are the catalogue and this device's own invitations
  const links: Array<[id: string, label: string]> = [
    ["templates", lang === "hy" ? "Ձևանմուշներ" : "Templates"],
    ["my", lang === "hy" ? "Իմ հրավերները" : "My invitations"],
  ];

  // --- active section -------------------------------------------------------
  useEffect(() => {
    if (!onLanding) return;
    const ids = links.map(([id]) => id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // The topmost intersecting section wins — stable when two touch.
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLanding, lang]);

  // --- drawer -----------------------------------------------------------------
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("kn-locked");
    const first = drawer.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("kn-locked");
      window.removeEventListener("keydown", onKey);
      burger.current?.focus();
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!onLanding) return; // real navigation
    const el = document.getElementById(id);
    if (!el) return; // a ROUTE link (templates, my) — let it navigate
    e.preventDefault();
    setOpen(false);
    const l = window.__lenis;
    if (l) l.scrollTo(`#${id}`, { offset: -NAV_H });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const href = (id: string) => `${base}/${id}`;

  return (
    <>
      <nav className="kn-nav" aria-label={t(lang, svc.nav.menu)}>
        <a className="kn-nav__mark" href={`${base}/`}>
          ԿՆԻՔ
        </a>

        <div className="kn-nav__links">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={href(id)}
              onClick={(e) => go(e, id)}
              aria-current={onLanding && active === id ? "true" : undefined}
            >
              {label}
            </a>
          ))}
        </div>

        <a
          className="kn-chip kn-nav__lang"
          href={pathFor(to, "", sub)}
          hrefLang={to === "hy" ? "hy-AM" : "en"}
          aria-label={to === "hy" ? "Անցնել հայերենի" : "Switch to English"}
        >
          {to === "hy" ? "ՀԱՅ" : "EN"}
        </a>

        <ThemeToggle labels={lang === "hy" ? { light: "Բաց թեմա", dark: "Մուգ թեմա" } : { light: "Light theme", dark: "Dark theme" }} />

        {/* The way in. /login was reachable only by typing it — the page
            existed and nothing pointed at it, which is the same as it not
            existing. It is a quiet chip rather than a second button: the one
            CTA in this bar stays "create an invitation", and signing in is
            what a couple does on their SECOND visit, to read the answers. */}
        <a className="kn-chip kn-nav__in" href={`${base}/login`} aria-label={t(lang, auth.title)}>
          <Icon name="users" size={15} />
          <span>{t(lang, auth.title)}</span>
        </a>

        <a className="kn-btn kn-nav__cta" href={`${base}/customize`}>
          {t(lang, svc.nav.build)}
        </a>

        <button
          ref={burger}
          type="button"
          className="kn-nav__burger"
          aria-label={t(lang, svc.nav.menu)}
          aria-expanded={open}
          aria-controls="kn-drawer"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" size={22} />
        </button>
      </nav>

      {open && (
        <div className="kn-drawer" role="dialog" aria-modal="true" id="kn-drawer" aria-label={t(lang, svc.nav.menu)}>
          <button
            type="button"
            className="kn-drawer__veil"
            aria-label={t(lang, svc.nav.close)}
            onClick={() => setOpen(false)}
          />
          <div className="kn-drawer__panel" ref={drawer}>
            <div className="kn-drawer__head">
              <span className="kn-nav__mark">ԿՆԻՔ</span>
              <button
                type="button"
                className="kn-drawer__x"
                aria-label={t(lang, svc.nav.close)}
                onClick={() => setOpen(false)}
              >
                <Icon name="x" size={22} />
              </button>
            </div>
            <ul className="kn-drawer__list">
              {links.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={href(id)}
                    onClick={(e) => go(e, id)}
                    aria-current={onLanding && active === id ? "true" : undefined}
                  >
                    {label}
                    <Icon name="chevron" size={18} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="kn-drawer__foot">
              <a className="kn-btn" href={`${base}/customize`}>
                {t(lang, svc.nav.build)}
              </a>
              {/* the bar's sign-in chip is desktop-only, so the drawer needs
                  its own or a phone has no way in at all */}
              <a className="kn-chip" href={`${base}/login`}>
                <Icon name="users" size={15} /> {t(lang, auth.title)}
              </a>
              <a className="kn-chip" href={pathFor(to, "", sub)}>
                {to === "hy" ? "ՀԱՅ" : "EN"}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
