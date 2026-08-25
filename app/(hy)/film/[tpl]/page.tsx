import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FilmPage from "@/components/FilmPage";
import { findTemplate, templateIds } from "@/lib/templates";
import { filmPage, site } from "@/lib/content";
import { t } from "@/lib/i18n";

// /film/<tpl> — the invitation as a self-playing 9:16 film.
export function generateStaticParams() {
  return templateIds.map((tpl) => ({ tpl }));
}

type Params = Promise<{ tpl: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tpl } = await params;
  const s = findTemplate(tpl);
  // the film of a NAMED couple is private like their invitation; the sample
  // films are the shop window and may be found
  return {
    title: s ? `${t("hy", filmPage.title)} — ${t("hy", s.name)}` : "ԿՆԻՔ",
    description: t("hy", filmPage.lead),
    ...(site.url ? {} : {}),
  };
}

export default async function Page({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { tpl } = await params;
  const sp = await searchParams;
  if (!findTemplate(tpl)) notFound();
  const p = typeof sp.p === "string" ? sp.p : undefined;
  return <FilmPage lang="hy" tpl={tpl} p={p} base="" />;
}
