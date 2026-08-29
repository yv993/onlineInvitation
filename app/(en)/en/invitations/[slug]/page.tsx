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

// The shop window, indexable — see the note on the Armenian twin.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = findTemplate(slug);
  if (!s) return { title: "KNIQ", robots: { index: false, follow: false } };
  return pageMeta("en", `/invitations/${slug}`, {
    title: `KNIQ — ${t("en", s.name)}`,
    description: t("en", s.tagline),
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const s = findTemplate(slug);
  if (!s) notFound();
  return (
    <>
      <TemplateJsonld
        lang="en"
        path={`/en/invitations/${slug}`}
        name={t("en", s.name)}
        description={t("en", s.tagline)}
        trail={[
          { name: "KNIQ", path: "/en" },
          { name: "Templates", path: "/en/templates" },
          { name: t("en", s.name), path: `/en/invitations/${slug}` },
        ]}
      />
      <TemplateView lang="en" s={s} base="/en" />
    </>
  );
}
