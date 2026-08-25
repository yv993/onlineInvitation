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
  const top: MetadataRoute.Sitemap = [
    { url: u("/"), lastModified: now, priority: 1 },
    { url: u("/en"), lastModified: now, priority: 0.9 },
    { url: u("/customize"), lastModified: now, priority: 0.9 },
    { url: u("/en/customize"), lastModified: now, priority: 0.8 },
    { url: u("/wedding-live"), lastModified: now, priority: 0.8 },
    { url: u("/wedding-cards"), lastModified: now, priority: 0.7 },
    { url: u("/kids"), lastModified: now, priority: 0.7 },
    { url: u("/order"), lastModified: now, priority: 0.6 },
  ];
  const demos: MetadataRoute.Sitemap = templates.map((tp) => ({
    url: u(`/invitations/${tp.id}`),
    lastModified: now,
    priority: 0.5,
  }));
  // the sample FILMS are shop window too — the third way to invite
  const films: MetadataRoute.Sitemap = templates.map((tp) => ({
    url: u(`/film/${tp.id}`),
    lastModified: now,
    priority: 0.45,
  }));
  return [...top, ...demos, ...films];
}
