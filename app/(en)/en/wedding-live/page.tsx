import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import WeddingLivePage from "@/components/WeddingLivePage";

export const metadata: Metadata = pageMeta("en", "/wedding-live", { title: "KNIQ — The web-invitation engine" });

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return <WeddingLivePage lang="en" style={typeof sp.style === "string" ? sp.style : undefined} />;
}
