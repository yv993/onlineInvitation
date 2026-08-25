"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/Icon";
import { wizard, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// LIVE DEMO — a fullscreen modal framing the very URL a guest would open.
// Portalled to <body>: the page's main column is its own stacking context (it
// sits under the sticky nav on purpose), so a fixed overlay rendered in place
// could never rise above the nav no matter its z-index. Esc closes, focus
// lands on ✕ and returns where it was, the page behind stops scrolling.
// ============================================================================

export default function DemoModal({ lang, href, onClose }: { lang: Lang; href: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const scroll = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = scroll; prev?.focus?.(); };
  }, [onClose]);
  return createPortal(
    <div className="kn-wz__modal" role="dialog" aria-modal="true" aria-label={t(lang, wizard.demo)}>
      <div className="kn-wz__modalBar">
        <span className="kn-wz__modalT"><Icon name="film" size={16} /> {t(lang, wizard.demo)} <small>{t(lang, wizard.demoHint)}</small></span>
        <a className="kn-wz__modalOpen" href={href} target="_blank" rel="noopener">{t(lang, wizard.demoOpen)} <Icon name="arrow" size={14} /></a>
        <button ref={closeRef} type="button" className="kn-wz__modalX" onClick={onClose} aria-label={t(lang, wizard.close)}><Icon name="x" size={18} /></button>
      </div>
      <iframe className="kn-wz__frame" src={href} title={t(lang, wizard.demo)} />
    </div>,
    document.body,
  );
}
