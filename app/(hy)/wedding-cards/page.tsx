import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import WCardsPage from "@/components/WCardsPage";

export const metadata: Metadata = pageMeta("hy", "/wedding-cards", { title: "ԿՆԻՔ — Հարսանեկան հրավիրատոմս-քարտեր" });

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return <WCardsPage lang="hy" style={typeof sp.style === "string" ? sp.style : undefined} collection={typeof sp.collection === "string" ? sp.collection : undefined} />;
}
