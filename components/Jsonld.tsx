import { site } from "@/lib/content";
import type { Lang } from "@/lib/content";

// ============================================================================
// STRUCTURED DATA — the machine-readable half of every page.
//
// The production build was measured with zero JSON-LD on every route, which is
// the difference between a plain blue link and a result that carries the brand,
// the logo and a breadcrumb trail. This is the fix.
//
// TWO RULES, both of which this file obeys and neither of which is optional:
//
//   1. NOTHING IS INVENTED. lib/content still has `phone: ""`, `email: ""` and
//      an empty `socials` list, all marked TODO(owner). A telephone or a
//      sameAs array made up to look complete would be a lie told to a search
//      engine in a format designed to be trusted — and Google penalises
//      structured data that disagrees with the page. So those keys are simply
//      absent until the owner fills them in. When they do, add them here.
//
//   2. NOTHING IS EMITTED WITHOUT A REAL ORIGIN. Like robots.ts and sitemap.ts,
//      this returns null unless NEXT_PUBLIC_SITE_URL names a deployment. A
//      graph full of http://localhost @ids is worse than no graph at all.
//
// The <script> is serialised with `<` escaped: JSON-LD sits in a raw text
// element, so an unescaped "</script>" inside any string — a template name, a
// tagline — would close the tag early and spill the rest into the document.
// ============================================================================

type Node = Record<string, unknown>;

function Graph({ nodes }: { nodes: Node[] }) {
  if (!nodes.length) return null;
  const json = JSON.stringify(
    nodes.length === 1 ? { "@context": "https://schema.org", ...nodes[0] } : { "@context": "https://schema.org", "@graph": nodes },
  ).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

const langTag: Record<Lang, string> = { hy: "hy-AM", en: "en", ru: "ru" };

/** The publisher, referenced by @id from every other node. */
function org(url: string) {
  return {
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: site.name,
    alternateName: site.nameLatin,
    url,
    logo: { "@type": "ImageObject", url: `${url}/icon-512.png`, width: 512, height: 512 },
  };
}

/**
 * The site's identity — put this on the two front doors only. Anything more
 * and every page claims to be the website itself.
 */
export function SiteJsonld({ lang, path, name, description }: { lang: Lang; path: string; name: string; description: string }) {
  const url = site.url.replace(/\/$/, "");
  if (!url) return null;
  return (
    <Graph
      nodes={[
        org(url),
        {
          "@type": "WebSite",
          "@id": `${url}/#website`,
          url: `${url}${path === "/" ? "/" : path}`,
          name,
          description,
          inLanguage: langTag[lang],
          publisher: { "@id": `${url}/#organization` },
        },
      ]}
    />
  );
}

/**
 * One template on display, plus the trail that leads to it. CreativeWork, not
 * Product: a Product without an `offers` price is an incomplete Product, and
 * the per-tier prices live in the examples panel rather than on this page —
 * claiming one here would be inventing it.
 */
export function TemplateJsonld({
  lang, path, name, description, trail,
}: { lang: Lang; path: string; name: string; description: string; trail: Array<{ name: string; path: string }> }) {
  const url = site.url.replace(/\/$/, "");
  if (!url) return null;
  return (
    <Graph
      nodes={[
        {
          "@type": "CreativeWork",
          "@id": `${url}${path}#design`,
          url: `${url}${path}`,
          name,
          description,
          inLanguage: langTag[lang],
          genre: "Digital invitation",
          creator: { "@id": `${url}/#organization` },
          isPartOf: { "@id": `${url}/#website` },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${url}${c.path}`,
          })),
        },
      ]}
    />
  );
}
