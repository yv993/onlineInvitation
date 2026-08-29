import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import SiteNav from "@/components/SiteNav";
import LoginPage from "@/components/LoginPage";
import { authReady } from "@/lib/server/supabase";

export const metadata: Metadata = pageMeta("en", "/login", { title: "KNIQ — Sign in" });

export const dynamic = "force-dynamic";

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return (
    <div className="kn-svc">
      <SiteNav lang="en" onLanding={false} sub="/login" />
      <div className="kn-back" aria-hidden="true" />
      <LoginPage
        lang="en"
        ready={authReady}
        linkExpired={sp.e === "link"}
        next={typeof sp.next === "string" ? sp.next : undefined}
      />
    </div>
  );
}
