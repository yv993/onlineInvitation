import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Oops from "@/components/Oops";

export const metadata: Metadata = { title: "KNIQ — 404", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <div className="kn-svc">
      <SiteNav lang="en" onLanding={false} />
      <div className="kn-back" aria-hidden="true" />
      <Oops lang="en" kind="notFound" base="/en" />
      <SiteFooter lang="en" />
    </div>
  );
}
