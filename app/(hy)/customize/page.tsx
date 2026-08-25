import type { Metadata } from "next";
import CustomizePage from "@/components/CustomizePage";

export const metadata: Metadata = { title: "ԿՆԻՔ — Ստեղծեք ձեր հրավերը" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return <CustomizePage lang="hy" category={typeof sp.category === "string" ? sp.category : undefined} tpl={typeof sp.tpl === "string" ? sp.tpl : undefined} />;
}
