import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplateView from "@/components/templates/TemplateView";
import { findTemplate, templateIds } from "@/lib/templates";
import { t } from "@/lib/i18n";

// /ru/invitations/<category>-<n> — one of the live templates, in Russian.
export function generateStaticParams() {
  return templateIds.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = findTemplate(slug);
  return { title: s ? `ԿՆԻՔ — ${t("ru", s.name)}` : "ԿՆԻՔ", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const s = findTemplate(slug);
  if (!s) notFound();
  return <TemplateView lang="ru" s={s} base="/ru" />;
}
