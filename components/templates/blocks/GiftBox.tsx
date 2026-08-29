"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { Qr } from "@/components/customizer/LinkPanel";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";
import type { Draft } from "@/lib/draft";

// ============================================================================
// THE GIFT BOX — after the reference's tap-to-open box (2026-08-26), in this
// project's own grammar. The couple's payment handles (Idram, a card number,
// an IBAN, a paypal.me link) stand INSIDE a closed box; a tap lifts the lid
// and the cards rise. Every value is a COPY button — a guest pastes it into
// their own banking app; the page never claims to move money. A QR renders
// only when the value is a real https link (the reference's own honesty:
// Zelle «has no public QR», so it shows the info to copy).
//
// THE OPEN STATE IS THE TRUTH: the server renders the box OPEN, so no-JS and
// reduced motion read everything. JS closes it after mount — the tap moment
// exists only for those whose browser can also open it again.
// ============================================================================

const L = {
  title: { hy: "Նվերի արկղ", en: "Gift box", ru: "Подарочная коробка" },
  tap: { hy: "Հպեք՝ բացելու համար", en: "Tap to open", ru: "Нажмите, чтобы открыть" },
  copy: { hy: "Պատճենել", en: "Copy", ru: "Копировать" },
  copied: { hy: "Պատճենվեց", en: "Copied", ru: "Скопировано" },
  open: { hy: "Բացել հղումը", en: "Open the link", ru: "Открыть ссылку" },
  note: {
    hy: "Հյուրը պատճենում է համարը իր բանկի հավելվածում։ Ձեր ներկայությունը ամենամեծ նվերն է։",
    en: "A guest copies the number into their own banking app. Your presence is the greatest gift.",
    ru: "Гость копирует номер в своём банковском приложении. Ваше присутствие — лучший подарок.",
  },
} satisfies Record<string, T>;

export default function GiftBox({ lang, gifts, embed }: { lang: Lang; gifts: NonNullable<Draft["gifts"]>; /** the editor's preview: the couple is proof-reading, so the lid stays up */ embed?: boolean }) {
  // SSR renders open; the lid closes only once JS is here to lift it again
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);
  useEffect(() => {
    // IN THE EDITOR THE BOX STAYS OPEN. Closed, the card numbers are not in
    // the document at all, so a couple could not check what they had typed
    // without tapping — the guest page keeps the tap-to-open charm.
    if (embed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOpen(false);
  }, [embed]);

  const copy = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch { /* the button said copy; nothing moved */ }
      document.body.removeChild(ta);
    }
    setCopied(i);
    window.setTimeout(() => setCopied((c) => (c === i ? null : c)), 1600);
  };

  const isLink = (v: string) => /^https:\/\//.test(v);

  return (
    <div className={`kn-tb kn-gift${open ? " is-open" : ""}`} data-rise>
      <h2 className="kn-tb__label" data-ink>{t(lang, L.title)}</h2>

      {!open ? (
        <button type="button" className="kn-gift__box" onClick={() => setOpen(true)} aria-expanded={false} aria-label={t(lang, L.tap)}>
          {/* the box, drawn: lid over base, a ribbon crossing both */}
          <span className="kn-gift__lid" aria-hidden="true" />
          <span className="kn-gift__base" aria-hidden="true" />
          <span className="kn-gift__ribbon" aria-hidden="true" />
          <span className="kn-gift__bow" aria-hidden="true">🎀</span>
          <span className="kn-gift__tap">{t(lang, L.tap)}</span>
        </button>
      ) : (
        <div className="kn-gift__cards">
          {gifts.map((g, i) => (
            <div className="kn-gift__card" key={i}>
              <p className="kn-gift__method">{g.label}</p>
              <p className="kn-gift__value">{g.value}</p>
              {g.note && <p className="kn-gift__note">{g.note}</p>}
              <div className="kn-gift__acts">
                <button type="button" className="kn-tb__btn kn-gift__copy" onClick={() => copy(g.value, i)}>
                  {copied === i ? <><Icon name="check" size={14} /> {t(lang, L.copied)}</> : t(lang, L.copy)}
                </button>
                {isLink(g.value) && (
                  <a className="kn-tb__btn kn-tb__btn--ghost" href={g.value} target="_blank" rel="noopener noreferrer">{t(lang, L.open)}</a>
                )}
              </div>
              {/* a QR only for a real link — a number is not scannable truth */}
              {isLink(g.value) && <span className="kn-gift__qr"><Qr text={g.value} /></span>}
            </div>
          ))}
          <p className="kn-gift__hint">{t(lang, L.note)}</p>
        </div>
      )}
    </div>
  );
}
