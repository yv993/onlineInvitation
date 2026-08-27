import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import MyInvitations from "@/components/MyInvitations";

export const metadata: Metadata = { title: "KNIQ — My invitations", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <div className="kn-svc">
      <SiteNav lang="en" />
      <div className="kn-back" aria-hidden="true" />
      <MyInvitations lang="en" />
      <SiteFooter lang="en" />
    </div>
  );
}
