import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TemplatePage from "@/components/TemplatePage";
import { findStyle, styleIds } from "@/lib/styles";
import { t } from "@/lib/i18n";

export function generateStaticParams() {
  return styleIds.map((id) => ({ id }));
}

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const s = findStyle(id);
  return { title: s ? `ԿՆԻՔ — ${t("en", s.name)}` : "ԿՆԻՔ" };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const s = findStyle(id);
  if (!s) notFound();
  return <TemplatePage lang="en" s={s} />;
}
