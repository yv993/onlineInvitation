import type { Metadata } from "next";
import WStudioPage from "@/components/WStudioPage";
import { findWCard, wIds } from "@/lib/wcards";
import { t } from "@/lib/i18n";

// One static page per design; the colourway (?v=) is read on the client.
export function generateStaticParams() {
  return wIds.map((id) => ({ id }));
}

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const c = findWCard(id);
  return { title: c ? `ԿՆԻՔ — ${t("hy", c.name)}` : "ԿՆԻՔ" };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  return <WStudioPage lang="hy" id={id} />;
}
