import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

// ============================================================================
// robots.txt — the business pages want to be found; the pages that belong to
// one couple and their guests do not. Without NEXT_PUBLIC_SITE_URL the site
// is not deployed anywhere real, so everything stays closed: a preview or a
// staging host must never leak into an index by accident.
// ============================================================================

export default function robots(): MetadataRoute.Robots {
  if (!site.url) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/invitation/", "/i/", "/guests"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
