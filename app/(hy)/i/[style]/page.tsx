import { notFound } from "next/navigation";
import Card from "@/components/Card";
import { cleanGuest } from "@/lib/i18n";
import { decodeDraft, draftCouple } from "@/lib/draft";
import { findStyle, styleIds } from "@/lib/styles";

// a page for ONE couple and their guests — never a search result
export const metadata = { robots: { index: false, follow: false } };


// /i/<style> — a catalog entry as the LIVE invitation, not a screenshot.
// With no `?p=` it wears the sample couple; with a `?p=` blob from the
// builder it wears the couple's own draft — same component, same everything.
// A malformed blob falls back to the sample, never to a 500.

export function generateStaticParams() {
  return styleIds.map((style) => ({ style }));
}

type Params = Promise<{ style: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { style } = await params;
  if (!findStyle(style)) notFound();
  const sp = await searchParams;
  const draft = decodeDraft(sp.p);
  return (
    <Card
      lang="hy"
      guest={cleanGuest(sp.g)}
      inv={style}
      who={draft ? draftCouple(draft) : undefined}
      blob={typeof sp.p === "string" && draft ? sp.p : ""}
    />
  );
}
