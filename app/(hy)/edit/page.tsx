import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import Editor from "@/components/editor/Editor";

// /edit — the sectioned single-page builder (the wizard's other door; both
// bind the same WizardContext state, so nothing is lost between them).
export const metadata: Metadata = { title: "ԿՆԻՔ — Խմբագրիչ" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const tpl = typeof sp.tpl === "string" ? sp.tpl : undefined;
  return (
    <div className="kn-svc kn-edshell">
      <SiteNav lang="hy" onLanding={false} sub="/edit" />
      <Editor lang="hy" initialTpl={tpl} />
    </div>
  );
}
