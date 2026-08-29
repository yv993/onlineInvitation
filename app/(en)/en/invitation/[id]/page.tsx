import type { Metadata } from "next";
import InvitationById from "@/components/InvitationById";
import { shareCard } from "@/lib/shareCard";

// /invitation/<id> — the guest link (style, template, or wizard short id).
// Dynamic: short ids are looked up in the link store at request time.
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

// the link's preview card — the editor's envelope/photo choice, finally read
export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  return shareCard("en", await searchParams);
}

export default async function Page({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { id } = await params;
  const sp = await searchParams;
  return <InvitationById lang="en" id={id} sp={sp} />;
}
