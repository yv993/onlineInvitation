import type { Metadata } from "next";
import Editor from "@/components/editor/Editor";

export const metadata: Metadata = { title: "KNIQ — Editor" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const tpl = typeof sp.tpl === "string" ? sp.tpl : undefined;
  return <Editor lang="en" initialTpl={tpl} />;
}
