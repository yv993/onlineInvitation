import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import SiteNav from "@/components/SiteNav";
import LoginPage from "@/components/LoginPage";
import { authReady } from "@/lib/server/supabase";

export const metadata: Metadata = pageMeta("hy", "/login", { title: "ԿՆԻՔ — Մուտք" });

// force-dynamic: whether accounts are switched on is an ENVIRONMENT fact, and
// a build-time snapshot of it would be wrong the moment the keys are set.
export const dynamic = "force-dynamic";

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  return (
    <div className="kn-svc">
      <SiteNav lang="hy" onLanding={false} sub="/login" />
      <div className="kn-back" aria-hidden="true" />
      <LoginPage
        lang="hy"
        ready={authReady}
        linkExpired={sp.e === "link"}
        next={typeof sp.next === "string" ? sp.next : undefined}
      />
    </div>
  );
}
