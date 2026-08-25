import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FilmPage from "@/components/FilmPage";
import { findTemplate, templateIds } from "@/lib/templates";
import { filmPage } from "@/lib/content";
import { t } from "@/lib/i18n";

export function generateStaticParams() {
  return templateIds.map((tpl) => ({ tpl }));
}

type Params = Promise<{ tpl: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tpl } = await params;
  const s = findTemplate(tpl);
  return {
    title: s ? `${t("en", filmPage.title)} — ${t("en", s.name)}` : "KNIQ",
    description: t("en", filmPage.lead),
  };
}

export default async function Page({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { tpl } = await params;
  const sp = await searchParams;
  if (!findTemplate(tpl)) notFound();
  const p = typeof sp.p === "string" ? sp.p : undefined;
  return <FilmPage lang="en" tpl={tpl} p={p} base="/en" />;
}
