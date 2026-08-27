import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import Editor from "@/components/editor/Editor";

export const metadata: Metadata = { title: "KNIQ — Editor" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const tpl = typeof sp.tpl === "string" ? sp.tpl : undefined;
  return (
    <div className="kn-svc kn-edshell">
      <SiteNav lang="en" onLanding={false} sub="/edit" />
      <Editor lang="en" initialTpl={tpl} />
    </div>
  );
}
