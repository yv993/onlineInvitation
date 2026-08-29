import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/components/Shell";
import { TemplateJsonld } from "@/components/Jsonld";
import TemplateView from "@/components/templates/TemplateView";
import { findTemplate, templateIds } from "@/lib/templates";
import { t } from "@/lib/i18n";

// /invitations/<category>-<n> — one of the live templates.
export function generateStaticParams() {
  return templateIds.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

// These demos are the SHOP WINDOW, and app/sitemap.ts has always listed them
// as such — but they used to ship `robots: { index: false }`, copied from the
// private /invitation/<id> pages next door. The two are opposites: /invitation
// (singular) is one couple's page and must never be found; /invitations
// (plural) is a template on display and is the page most likely to earn a
// search for "Armenian wedding invitation template". The sitemap said come in
// while the page said go away, and the whole catalogue stayed invisible.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = findTemplate(slug);
  if (!s) return { title: "ԿՆԻՔ", robots: { index: false, follow: false } };
  return pageMeta("hy", `/invitations/${slug}`, {
    title: `ԿՆԻՔ — ${t("hy", s.name)}`,
    description: t("hy", s.tagline),
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const s = findTemplate(slug);
  if (!s) notFound();
  return (
    <>
      <TemplateJsonld
        lang="hy"
        path={`/invitations/${slug}`}
        name={t("hy", s.name)}
        description={t("hy", s.tagline)}
        trail={[
          { name: "ԿՆԻՔ", path: "/" },
          { name: "Ձևանմուշներ", path: "/templates" },
          { name: t("hy", s.name), path: `/invitations/${slug}` },
        ]}
      />
      <TemplateView lang="hy" s={s} base="" />
    </>
  );
}
