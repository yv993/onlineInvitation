import { notFound } from "next/navigation";
import Motion from "./Motion";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import KidsStudio from "./kids/KidsStudio";
import MotifSprite from "./kids/Motifs";
import type { Lang } from "@/lib/content";
import { findKidsCard } from "@/lib/kids";

// /kids/<card> — the studio: card + envelope on the design's backdrop, and
// the Customize form that turns it into the invitation as the parent types.
export default function KidsStudioPage({ lang, id, variant }: { lang: Lang; id: string; variant?: string }) {
  const card = findKidsCard(id);
  if (!card) notFound();
  return (
    <div className="kn-svc kn-svc--kids">
      <SiteNav lang={lang} onLanding={false} sub={`/kids/${id}`} />
      <Motion />
      <MotifSprite />
      <div className="kn-back" aria-hidden="true" />
      <main className="kn-main" id="card">
        <section className="kn-band kn-svc__pageTop kn-ks__band">
          <div className="kn-col">
            <KidsStudio lang={lang} card={card} initialVariant={variant} />
          </div>
        </section>
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
