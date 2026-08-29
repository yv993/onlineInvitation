import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { templates } from "@/lib/templates";

// ============================================================================
// sitemap.xml — the catalogue the crawlers may walk: the landings, the topic
// pages, the builder, and every TEMPLATE DEMO (they are the shop window; the
// couples' own /invitation pages are deliberately absent and disallowed).
// Empty until NEXT_PUBLIC_SITE_URL names a real deployed origin — a sitemap
// full of localhost URLs is worse than none.
// ============================================================================

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  const u = (p: string) => `${site.url}${p}`;
  const now = new Date();
  // Every business page, in BOTH marketing languages, each listing its twin as
  // an hreflang alternate. Two things used to be missing here: /templates —
  // the catalogue itself, the single most important page after the front door —
  // and the English twins of everything except /customize, which left half the
  // site undiscoverable. Russian is absent on purpose: that route group carries
  // the guest surface only, and those pages are noindex.
  const pages: Array<[string, number]> = [
    ["/", 1],
    ["/templates", 0.9],
    ["/customize", 0.9],
    ["/wedding-live", 0.8],
    ["/wedding-cards", 0.7],
    ["/kids", 0.7],
    ["/edit", 0.6],
    ["/order", 0.6],
  ];
  const pair = (p: string) => ({ hy: p, en: p === "/" ? "/en" : `/en${p}` });
  const top: MetadataRoute.Sitemap = pages.flatMap(([p, priority]) => {
    const { hy, en } = pair(p);
    const alternates = { languages: { "hy-AM": u(hy), en: u(en) } };
    return [
      { url: u(hy), lastModified: now, priority, alternates },
      { url: u(en), lastModified: now, priority: Math.max(0.4, priority - 0.1), alternates },
    ];
  });
  // The template demos are the shop window, and they are indexable again (the
  // pages used to carry a noindex that contradicted this very list).
  const demos: MetadataRoute.Sitemap = templates.flatMap((tp) => {
    const { hy, en } = pair(`/invitations/${tp.id}`);
    const alternates = { languages: { "hy-AM": u(hy), en: u(en) } };
    return [
      { url: u(hy), lastModified: now, priority: 0.5, alternates },
      { url: u(en), lastModified: now, priority: 0.45, alternates },
    ];
  });
  // the sample FILMS are shop window too — the third way to invite
  const films: MetadataRoute.Sitemap = templates.map((tp) => ({
    url: u(`/film/${tp.id}`),
    lastModified: now,
    priority: 0.45,
  }));
  return [...top, ...demos, ...films];
}
