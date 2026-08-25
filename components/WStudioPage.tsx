import { notFound } from "next/navigation";
import Motion from "./Motion";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import WStudio from "./wcards/WStudio";
import WMotifSprite from "./wcards/WMotifs";
import type { Lang } from "@/lib/content";
import { findWCard } from "@/lib/wcards";

// /wedding-cards/<design> — the design page + studio.
export default function WStudioPage({ lang, id }: { lang: Lang; id: string }) {
  const card = findWCard(id);
  if (!card) notFound();
  return (
    <div className="kn-svc kn-svc--kids kn-svc--wcards">
      <SiteNav lang={lang} onLanding={false} sub={`/wedding-cards/${id}`} />
      <Motion />
      <WMotifSprite />
      <div className="kn-back" aria-hidden="true" />
      <main className="kn-main" id="card">
        <section className="kn-band kn-svc__pageTop kn-ks__band">
          <div className="kn-col"><WStudio lang={lang} card={card} /></div>
        </section>
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
