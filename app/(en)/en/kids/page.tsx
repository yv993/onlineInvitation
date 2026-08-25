import type { Metadata } from "next";
import KidsPage from "@/components/KidsPage";

export const metadata: Metadata = { title: "KNIQ — Kids' birthday invitations" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return <KidsPage lang="en" facet={typeof sp.theme === "string" ? sp.theme : undefined} />;
}
