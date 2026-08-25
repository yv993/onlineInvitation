import type { Metadata } from "next";
import InvitationById from "@/components/InvitationById";

// /invitation/<id> — the guest link (style, template, or wizard short id).
// Dynamic: short ids are looked up in the link store at request time.
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = { title: "KNIQ — invitation", robots: { index: false, follow: false } };

export default async function Page({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { id } = await params;
  const sp = await searchParams;
  return <InvitationById lang="en" id={id} sp={sp} />;
}
