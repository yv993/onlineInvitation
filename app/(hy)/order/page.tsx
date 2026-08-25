import type { Metadata } from "next";
import OrderPage from "@/components/OrderPage";

export const metadata: Metadata = { title: "ԿՆԻՔ — Պատվիրել" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return (
    <OrderPage
      lang="hy"
      style={typeof sp.style === "string" ? sp.style : undefined}
      occasion={typeof sp.occasion === "string" ? sp.occasion : undefined}
    />
  );
}
