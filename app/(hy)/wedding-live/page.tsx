import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import WeddingLivePage from "@/components/WeddingLivePage";

export const metadata: Metadata = pageMeta("hy", "/wedding-live", { title: "ԿՆԻՔ — Կայք-հրավերի շարժիչը" });

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return <WeddingLivePage lang="hy" style={typeof sp.style === "string" ? sp.style : undefined} />;
}
