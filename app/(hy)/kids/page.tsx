import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import KidsPage from "@/components/KidsPage";

export const metadata: Metadata = pageMeta("hy", "/kids", { title: "ԿՆԻՔ — Մանկական ծննդյան հրավերներ" });

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return <KidsPage lang="hy" facet={typeof sp.theme === "string" ? sp.theme : undefined} />;
}
