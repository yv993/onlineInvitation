"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import TemplateRenderer from "@/components/invitations/TemplateRenderer";
import { LiveThumb } from "@/components/customizer/ExampleThumb";
import { mockForStyle } from "@/lib/invitations/mock";
import { live as C, wcards as W, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { engineStyles } from "@/lib/invitations/styles";
import type { TemplateStyle } from "@/types/invitation";

// ============================================================================
// /wedding-live — the engine's showcase, in the wedding part: the six styles
// as chips, the chosen one in a phone frame (the real /invitation/live-<style>
// page, not a mock-up), its measured section order beside it, and the two
// doors out — open full page, customize in the wizard.
// ============================================================================

const occasionOf: Record<TemplateStyle, string> = { "classic-floral": "wedding", "modern-cinematic": "wedding", "boarding-pass": "wedding", "pearl-editorial": "wedding", "dusty-blue": "wedding", "engagement-save-the-date": "engagement", "baptism-kunk": "baptism", "birthday-anniversary": "birthday", "gala-corporate": "corporate" };

export default function LiveShowcase({ lang, initial }: { lang: Lang; initial?: string }) {
  const base = lang === "hy" ? "" : "/en";
  const [sel, setSel] = useState<TemplateStyle>(engineStyles.some((s) => s.id === initial) ? (initial as TemplateStyle) : "classic-floral");
  const spec = engineStyles.find((s) => s.id === sel)!;
  const href = `${base}/invitation/live-${sel}`;
  return (
    <div className="kn-live">
      <ul className="kn-ways" aria-label={t(lang, C.ways)}>
        <li className="kn-ways__it"><Link href={`${base}/wedding-cards`}><Icon name="mail" size={16} /> {t(lang, W.wayCard)}</Link></li>
        <li className="kn-ways__it" aria-current="page"><Icon name="globe" size={16} /> <b>{t(lang, W.wayWeb)}</b></li>
        <li className="kn-ways__it kn-ways__it--soon"><Icon name="film" size={16} /> {t(lang, W.wayVideo)} <small>{t(lang, W.waySoon)}</small></li>
      </ul>

      <div className="kn-live__styles" role="tablist" aria-label={t(lang, C.title)}>
        {engineStyles.map((s, i) => (
          <div key={s.id} role="tab" tabIndex={0} aria-selected={sel === s.id} className="kn-live__style" onClick={() => setSel(s.id)} onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); setSel(s.id); } }}>
            <span className="kn-live__cover kn-live__cover--live"><LiveThumb><div className="kn-ep__frame"><TemplateRenderer data={mockForStyle(s.id)} lang={lang} compact chrome={false} /></div></LiveThumb></span>
            <span className="kn-live__styleT">
              <small>{s.occasion === "wedding" ? `${lang === "hy" ? "Ոճ" : "Style"} ${"ABCDE"[i] ?? ""}` : t(lang, { hy: "Ընդլայնված", en: "Extended" })}</small>
              <b>{t(lang, s.name)}</b>
              <em>{t(lang, s.after)}</em>
            </span>
          </div>
        ))}
      </div>

      <div className="kn-live__stage">
        <div className="kn-live__phone">
          <iframe key={href} className="kn-live__frame" src={href} title={t(lang, spec.name)} loading="lazy" />
        </div>
        <aside className="kn-live__side">
          <p className="kn-label">{t(lang, C.preview)}</p>
          <h2 className="kn-live__name">{t(lang, spec.name)}</h2>
          <p className="kn-live__tag">{t(lang, spec.tagline)}</p>
          <p className="kn-live__after"><b>{t(lang, spec.after)}</b></p>
          <p className="kn-label" style={{ marginTop: "1rem" }}>{t(lang, C.anatomy)}</p>
          <ol className="kn-live__anat">{spec.anatomy.map((a, i) => <li key={i}>{t(lang, a)}</li>)}</ol>
          <div className="kn-live__acts">
            <a className="kn-btn" href={href} target="_blank" rel="noopener">{t(lang, C.open)} <Icon name="arrow" size={14} /></a>
            <Link className="kn-btn kn-btn--ghost" href={`${base}/customize?category=${occasionOf[sel]}&tpl=live-${sel}`}>{t(lang, C.customize)}</Link>
          </div>
        </aside>
      </div>

      <section className="kn-live__schema">
        <div>
          <p className="kn-label">{t(lang, C.schema)}</p>
          <h2 className="kn-h2">{t(lang, C.schemaLead)}</h2>
          <ul className="kn-ks__bullets">{C.sections.map((s, i) => <li key={i}><Icon name="check" size={14} /> <code>{t(lang, s)}</code></li>)}</ul>
        </div>
        <div>
          <p className="kn-label">{t(lang, C.binding)}</p>
          <p className="kn-lead">{t(lang, C.bindingLead)}</p>
          <p style={{ marginTop: "1rem" }}><Link href={`${base}/customize?category=wedding&tpl=live-classic-floral`} className="kn-btn">{t(lang, C.customize)} <Icon name="arrow" size={14} /></Link></p>
        </div>
      </section>
    </div>
  );
}
