import Link from "next/link";
import Film from "@/components/film/Film";
import Icon from "@/components/Icon";
import { findTemplate } from "@/lib/templates";
import { decodeDraft } from "@/lib/draft";
import { filmPage as F } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/content";

// ============================================================================
// /film/<tpl> — the film, framed. The stage itself is Film.tsx; everything
// here is the chrome AROUND it, deliberately outside the 9:16 box so that a
// capture (scripts/film-render.mjs) never picks up a button: the title, the
// way back into the invitation, and the honest sentence about what this is —
// a film that plays inside the link.
//
// NO `data-rise` HERE, deliberately. Those attributes are PARKED at opacity 0
// by CSS and unparked by Motion.tsx — a page that carries them without
// mounting Motion shows nothing at all. This page has no Motion (the film is
// its own animation), so its words are simply written.
// ============================================================================

export default function FilmPage({ lang, tpl, p, base }: { lang: Lang; tpl: string; p?: string; base: string }) {
  const s = findTemplate(tpl);
  if (!s) return null;
  const draft = decodeDraft(p) ?? undefined;
  const href = `${base}/invitation/${tpl}${p ? `?p=${p}` : ""}`;
  return (
    <main className="kn-main kn-filmpage" id="card">
      <section className="kn-band">
        <div className="kn-col kn-filmpage__col">
          <p className="kn-label">{t(lang, F.kicker)}</p>
          <h1 className="kn-h2">{t(lang, F.title)}</h1>
          <p className="kn-lead kn-filmpage__lead">{t(lang, F.lead)}</p>

          {/* the film itself — `key` restarts every animation on a replay */}
          <Film lang={lang} s={s} draft={draft} />

          <div className="kn-film__bar">
            <Link className="kn-btn" href={href}>{t(lang, F.openInvitation)} <Icon name="arrow" size={14} /></Link>
            <Link className="kn-btn kn-btn--ghost" href={`${base}/customize?category=${s.category === "christening" ? "baptism" : s.category}&tpl=${tpl}`}>
              {t(lang, F.build)}
            </Link>
          </div>
          <p className="kn-filmpage__note">{t(lang, F.note)}</p>
        </div>
      </section>
    </main>
  );
}
