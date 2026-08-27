"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { findTemplate } from "@/lib/templates";
import { type Lang, type T } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// /my — MY INVITATIONS, without an account (2026-08-27, the reference's
// second nav item made honest for a no-login product): everything THIS
// DEVICE has made. Two sources, both local — the draft the builder is
// holding right now, and every link this browser has minted (LinkPanel
// writes them to localStorage at mint time). Nothing is fetched; the page
// says plainly that the list lives here, on this device.
// ============================================================================

const L = {
  title: { hy: "Իմ հրավերները", en: "My invitations" },
  lead: {
    hy: "Այս սարքի վրա ստեղծվածները՝ ընթացիկ սևագիրը և բոլոր ստացած հղումները։ Ցուցակը պահվում է միայն այստեղ՝ ձեր դիտարկիչում։",
    en: "Everything made on this device — the draft in progress and every link you have generated. The list lives here, in your browser, only.",
  },
  draft: { hy: "Ընթացիկ սևագիրը", en: "Your draft in progress" },
  continue: { hy: "Շարունակել", en: "Continue editing" },
  linkAt: { hy: "Ստեղծված", en: "Created" },
  openInv: { hy: "Բացել հրավերը", en: "Open the invitation" },
  guests: { hy: "Հյուրերի ցուցակը", en: "Guest list" },
  empty: {
    hy: "Դեռ ոչինչ չկա։ Ընտրեք ձևանմուշ և ստեղծեք առաջին հրավերը։",
    en: "Nothing yet. Pick a template and make your first invitation.",
  },
  pick: { hy: "Ընտրել ձևանմուշ", en: "Pick a template" },
} satisfies Record<string, T>;

type Minted = { id: string; tpl: string; at: string; guests?: string };

export default function MyInvitations({ lang }: { lang: Lang }) {
  const base = lang === "hy" ? "" : "/en";
  const [links, setLinks] = useState<Minted[] | null>(null);
  const [draftTpl, setDraftTpl] = useState<string | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kn-my-links");
      setLinks(raw ? (JSON.parse(raw) as Minted[]) : []);
    } catch { setLinks([]); }
    try {
      const d = localStorage.getItem("kniq.wizard.v1");
      if (d) {
        const env = JSON.parse(d) as { s?: { tpl?: string; a?: string } };
        const st = env.s ?? (env as { tpl?: string });
        if (st && (st as { a?: string }).a) setDraftTpl((st as { tpl?: string }).tpl ?? null);
      }
    } catch { /* no draft is a fine answer */ }
  }, []);

  if (links === null) return null;

  return (
    <main className="kn-main kn-my" id="card">
      <section className="kn-band">
        <div className="kn-col">
          <h1 className="kn-h2">{t(lang, L.title)}</h1>
          <p className="kn-lead kn-my__lead">{t(lang, L.lead)}</p>

          {draftTpl && (
            <div className="kn-my__row kn-my__row--draft">
              <span className="kn-my__ic" aria-hidden="true"><Icon name="seal" size={18} /></span>
              <span className="kn-my__t"><b>{t(lang, L.draft)}</b><small>{findTemplate(draftTpl) ? t(lang, findTemplate(draftTpl)!.name) : draftTpl}</small></span>
              <Link className="kn-btn" href={`${base}/edit?tpl=${draftTpl}`}>{t(lang, L.continue)}</Link>
            </div>
          )}

          {links.length === 0 && !draftTpl ? (
            <div className="kn-my__empty">
              <p>{t(lang, L.empty)}</p>
              <Link className="kn-btn" href={`${base}/templates`}>{t(lang, L.pick)}</Link>
            </div>
          ) : (
            <ul className="kn-my__list">
              {links.map((m) => {
                const tp = findTemplate(m.tpl);
                return (
                  <li className="kn-my__row" key={m.id}>
                    <span className="kn-my__ic" aria-hidden="true"><Icon name="mail" size={18} /></span>
                    <span className="kn-my__t">
                      <b>{tp ? t(lang, tp.name) : m.tpl}</b>
                      <small>{t(lang, L.linkAt)} {m.at.slice(0, 10)} · /invitation/{m.id}</small>
                    </span>
                    <span className="kn-my__acts">
                      <a className="kn-btn kn-btn--ghost" href={`${base}/invitation/${m.id}`} target="_blank" rel="noopener">{t(lang, L.openInv)}</a>
                      {m.guests && <a className="kn-btn kn-btn--ghost" href={m.guests} target="_blank" rel="noopener">{t(lang, L.guests)}</a>}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
