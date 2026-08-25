import type { Metadata } from "next";
import WeddingLivePage from "@/components/WeddingLivePage";

export const metadata: Metadata = { title: "KNIQ — The web-invitation engine" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return <WeddingLivePage lang="en" style={typeof sp.style === "string" ? sp.style : undefined} />;
}
