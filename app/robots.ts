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
  // robots.txt paths match from the ROOT, so "/invitation/" never covered
  // "/en/invitation/" or "/ru/invitation/" — the same private page in the other
  // two languages was left crawlable. The pages themselves carry noindex (see
  // lib/shareCard.ts), which is the binding signal; this list is the second
  // lock, and it should cover the same doors.
  //
  // NOTE the singular/plural split: "/invitation/" is one couple's page and is
  // closed. "/invitations/" is a template on display — the shop window — and is
  // deliberately NOT here.
  const priv = ["/invitation/", "/i/", "/my"];
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/guests",
        ...priv,
        ...priv.map((p) => `/en${p}`),
        ...priv.map((p) => `/ru${p}`),
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
