import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import CustomizePage from "@/components/CustomizePage";

export const metadata: Metadata = pageMeta("en", "/customize", { title: "KNIQ — Build your invitation" });

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return <CustomizePage lang="en" category={typeof sp.category === "string" ? sp.category : undefined} tpl={typeof sp.tpl === "string" ? sp.tpl : undefined} />;
}
