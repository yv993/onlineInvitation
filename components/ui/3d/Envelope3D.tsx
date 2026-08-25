"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE 3D ENVELOPE — a real envelope, in depth, that opens into the page.
//
// The anatomy every animated invitation on the boards shares (and the one the
// card catalogue's EnvelopeScene already plays for the paper cards; this is
// the WEB templates' own, lean version):
//   · a body in perspective, its pocket a clipped triangle
//   · a FLAP hinged at the top, standing closed at rotateX(0) and falling
//     open to −168° about its own top edge
//   · a WAX SEAL on the flap's point, which cracks and fades as it lifts
//   · the CARD inside, which rises out of the pocket, straightens and grows
//     as the flap clears it
//   · and, once open, the whole thing lifts away and hands the page over
//
// Three depths, one perspective (the stage's 1200px): the pocket sits at
// z 0, the card travels z 1 → 40, the flap swings above both. `preserve-3d`
// all the way down, so the flap really passes over the card rather than
// being painted next to it.
//
// TAP or KEY to open. It also opens itself after a beat, so nobody is stuck
// staring at a closed envelope wondering — and it NEVER gates the content:
// the invitation is in the DOM the whole time, behind it. Reduced motion and
// no-JS skip the scene entirely (it never mounts), which is why the parent
// renders the page regardless.
// ============================================================================

const L = {
  open: { hy: "Բացել հրավերը", en: "Open the invitation", ru: "Открыть приглашение" },
  hint: { hy: "Հպեք ծրարին", en: "Tap the envelope", ru: "Коснитесь конверта" },
} satisfies Record<string, T>;

export default function Envelope3D({ lang, names, date, monogram, autoOpenMs = 2600 }: {
  lang: Lang;
  names: string;
  date: string;
  monogram: string;
  /** it opens itself after this long; 0 waits for a hand */
  autoOpenMs?: number;
}) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  // THE ENVELOPE EXISTS ONLY AFTER HYDRATION, and only for a visitor who
  // asked for motion. Both matter: rendered on the server it would sit in the
  // no-JS HTML as a lid nothing can lift — the page walled off behind a
  // button that needs JS to work — and under reduced motion a scene that
  // must be dismissed is not a scene anyone asked for.
  const [live, setLive] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setLive(true);
    if (!autoOpenMs) return;
    timer.current = window.setTimeout(() => setOpen(true), autoOpenMs);
    return () => window.clearTimeout(timer.current);
  }, [autoOpenMs]);

  useEffect(() => {
    if (!open) return;
    // the scene leaves once the card has cleared the pocket
    const t2 = window.setTimeout(() => setGone(true), 2200);
    return () => window.clearTimeout(t2);
  }, [open]);

  if (!live || gone) return null;

  return (
    <div className={`kn-env3${open ? " is-open" : ""}`} aria-hidden="true">
      <button
        type="button"
        className="kn-env3__hit"
        onClick={() => { window.clearTimeout(timer.current); setOpen(true); }}
        aria-label={t(lang, L.open)}
      >
        <span className="kn-env3__stage">
          {/* the card, rising out of the pocket */}
          <span className="kn-env3__card">
            <span className="kn-env3__mono">{monogram}</span>
            <span className="kn-env3__names">{names}</span>
            <span className="kn-env3__date">{date}</span>
          </span>
          {/* the pocket in front of it, then the flap above both */}
          <span className="kn-env3__pocket" />
          <span className="kn-env3__flap">
            <span className="kn-env3__seal">{monogram}</span>
          </span>
        </span>
        <span className="kn-env3__hint">
          <Icon name="mail" size={14} /> {t(lang, L.hint)}
        </span>
      </button>
    </div>
  );
}
