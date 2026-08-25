"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import Plate from "./Plate";
import StyleDetail from "./StyleDetail";
import { svc } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { formatAmd } from "@/lib/styles";
import type { InvStyle } from "@/lib/styles";
import type { Frame } from "@/lib/photos";

// ============================================================================
// SHOWCASE CARD — one style in the portfolio grid, with the two controls the
// blueprint asks for and neither Armenian reference has:
//
//   LIVE PREVIEW TOGGLE — swaps the photograph for the REAL invitation in a
//   phone-shaped iframe (the same /i/<style> route a guest opens). Mounted
//   only on toggle, never on load: three invitations' worth of JS and images
//   is not a price the catalog should pay for visitors who only scroll past.
//
//   DETAIL MODAL — the style's measured palette, what it carries, the price,
//   and the two CTAs. A real dialog: Escape closes, the veil closes, focus
//   moves in and comes back, body scroll locks. The same StyleDetail the
//   /templates/[id] page renders, so they can never drift.
// ============================================================================

export default function StyleCard({
  lang,
  s,
  plate,
}: {
  lang: Lang;
  s: InvStyle;
  plate: Frame;
}) {
  const base = lang === "hy" ? "" : "/en";
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("kn-locked");
    dialog.current?.querySelector<HTMLElement>("button,a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("kn-locked");
      window.removeEventListener("keydown", onKey);
      opener.current?.focus();
    };
  }, [open]);

  return (
    <article
      className="kn-svc__cat"
      data-rise
      style={
        {
          "--sw-paper": s.swatch[0],
          "--sw-ink": s.swatch[1],
          "--sw-accent": s.swatch[2],
        } as React.CSSProperties
      }
    >
      <div className="kn-svc__catPlate">
        {live ? (
          <div className="kn-svc__catLive">
            <iframe
              className="kn-svc__catFrame"
              src={`${base}/i/${s.id}`}
              title={`${t(lang, s.name)} — ${t(lang, svc.showcase.live)}`}
              loading="lazy"
            />
          </div>
        ) : (
          <Plate
            img={plate.img}
            alt={t(lang, plate.alt)}
            sizes="(max-width: 640px) 92vw, (max-width: 1100px) 46vw, 400px"
            ratio="4 / 3"
            hover
            zoom
          />
        )}

        {/* the toggle rides the plate's corner */}
        <button
          type="button"
          className="kn-svc__catToggle"
          aria-pressed={live}
          onClick={() => setLive((v) => !v)}
        >
          <Icon name={live ? "x" : "film"} size={16} />
          {t(lang, live ? svc.showcase.photo : svc.showcase.live)}
        </button>

        {!live && (
          <div className="kn-svc__swatch kn-svc__swatch--over" aria-hidden="true">
            <b />
          </div>
        )}
      </div>

      <div className="kn-svc__catBody">
        <p className="kn-svc__catMood">{t(lang, s.mood)}</p>
        <h3 className="kn-svc__catName">{t(lang, s.name)}</h3>
        <p className="kn-svc__catBlurb">{t(lang, s.blurb)}</p>
        <p className="kn-svc__catFrom">
          {t(lang, svc.catalog.fromWord)} {formatAmd(s.from)}
        </p>
        <p className="kn-svc__catActs">
          <Link className="kn-btn" href={`${base}/order?style=${s.id}`}>
            {t(lang, svc.catalog.pick)}
          </Link>
          <button ref={opener} type="button" className="kn-btn kn-btn--ghost" onClick={() => setOpen(true)}>
            {t(lang, svc.showcase.details)}
          </button>
        </p>
      </div>

      {open && (
        <div className="kn-modal" role="dialog" aria-modal="true" aria-label={t(lang, s.name)}>
          <button
            type="button"
            className="kn-modal__veil"
            aria-label={t(lang, svc.showcase.close)}
            onClick={() => setOpen(false)}
          />
          <div className="kn-modal__panel" ref={dialog}>
            <button
              type="button"
              className="kn-modal__x"
              aria-label={t(lang, svc.showcase.close)}
              onClick={() => setOpen(false)}
            >
              <Icon name="x" size={20} />
            </button>
            <div className="kn-modal__plate">
              <Plate
                img={plate.img}
                alt={t(lang, plate.alt)}
                sizes="(max-width: 700px) 92vw, 640px"
                ratio="16 / 9"
                zoom
              />
            </div>
            <StyleDetail lang={lang} s={s} compact />
          </div>
        </div>
      )}
    </article>
  );
}
