"use client";

import { useState } from "react";
import { admin } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// The reminder tool on /guests. Renders the ready-to-send message in a
// read-only box (so it can be selected and copied by hand where the clipboard
// API is refused) and a copy button that confirms in words.
export default function Nudge({ lang, text }: { lang: Lang; text: string }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      window.setTimeout(() => setOk(false), 2200);
    } catch {
      /* leave the box selectable — a false "copied" is worse than nothing */
    }
  };
  return (
    <div className="kn-adm__nudge">
      <h2 className="kn-adm__h3">{t(lang, admin.nudge.title)}</h2>
      <p className="kn-adm__lead">{t(lang, admin.nudge.lead)}</p>
      <textarea className="kn-f__in kn-adm__nudgeText" readOnly rows={4} value={text} />
      <button type="button" className="kn-btn kn-btn--ghost" onClick={copy} aria-live="polite">
        {t(lang, ok ? admin.nudge.copied : admin.nudge.copy)}
      </button>
    </div>
  );
}
