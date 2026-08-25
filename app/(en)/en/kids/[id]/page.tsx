import type { Metadata } from "next";
import KidsStudioPage from "@/components/KidsStudioPage";
import { findKidsCard, kidsIds } from "@/lib/kids";
import { t } from "@/lib/i18n";

// One static page per design; the colourway (?v=) is read on the client so
// the studio can be prerendered.
export function generateStaticParams() {
  return kidsIds.map((id) => ({ id }));
}

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const c = findKidsCard(id);
  return { title: c ? `ԿՆԻՔ — ${t("en", c.name)}` : "ԿՆԻՔ" };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  return <KidsStudioPage lang="en" id={id} />;
}
