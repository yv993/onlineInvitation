import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import MyInvitations from "@/components/MyInvitations";

export const metadata: Metadata = { title: "ԿՆԻՔ — Իմ հրավերները", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <div className="kn-svc">
      <SiteNav lang="hy" />
      <div className="kn-back" aria-hidden="true" />
      <MyInvitations lang="hy" />
      <SiteFooter lang="hy" />
    </div>
  );
}
