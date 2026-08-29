import { decodeDraft, stampFromIso } from "@/lib/draft";
import { site, type Lang } from "@/lib/content";

// ============================================================================
// THE LINK'S PREVIEW CARD — what WhatsApp, Viber, Telegram and Messenger show
// when a couple sends their invitation.
//
// The editor has always offered the choice (the envelope, or the couple's own
// photograph) and always drew a thumbnail of it — but nothing downstream read
// it: the route exported a static `metadata` with no openGraph block at all,
// so every link unfurled as bare text. This is the consumer that choice was
// missing.
//
// TWO HONEST LIMITS, both deliberate:
//   · An unfurler fetches over the public internet, so an image needs an
//     ABSOLUTE url. Until NEXT_PUBLIC_SITE_URL names this deployment there is
//     no absolute origin to build one from, and we emit the title and the
//     description only — never a broken image.
//   · `robots: { index: false }` stays. It keeps search engines out; it does
//     not stop a messenger from unfurling a link a guest was handed, which is
//     exactly the line this product wants.
// ============================================================================

const T = {
  hy: { invite: "Հրավեր", and: "և" },
  en: { invite: "Invitation", and: "and" },
  ru: { invite: "Приглашение", and: "и" },
} as const;

export function shareCard(lang: Lang, sp: Record<string, string | string[] | undefined>) {
  const w = T[lang] ?? T.hy;
  const d = decodeDraft(sp.p);
  const names = d && (d.a || d.b)
    ? [d.a, d.b].filter(Boolean).join(` ${w.and} `)
    : "";
  const title = names ? `${names} — ${w.invite}` : `ԿՆԻՔ — ${w.invite}`;
  const description = d?.date
    ? [stampFromIso(`${d.date}T12:00:00+04:00`), d.venue, d.city].filter(Boolean).join(" · ")
    : undefined;

  // the couple asked for their own photograph AND gave one
  const wantsPhoto = d?.share === "photo" && d.photos?.[0];
  const origin = site.url.replace(/\/$/, "");
  const image = origin
    ? (wantsPhoto ? `${origin}${d!.photos![0]}` : `${origin}/opengraph-image.png`)
    : undefined;

  return {
    title,
    ...(description ? { description } : {}),
    robots: { index: false, follow: false },
    openGraph: {
      title,
      ...(description ? { description } : {}),
      type: "website" as const,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: image ? ("summary_large_image" as const) : ("summary" as const),
      title,
      ...(description ? { description } : {}),
      ...(image ? { images: [image] } : {}),
    },
  };
}
