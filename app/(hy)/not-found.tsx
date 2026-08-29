import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Oops from "@/components/Oops";

// Catches notFound() from anywhere in the Armenian group — a template slug
// that no longer exists, an /invitation/<id> that was never published.
export const metadata: Metadata = { title: "ԿՆԻՔ — 404", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <div className="kn-svc">
      <SiteNav lang="hy" onLanding={false} />
      <div className="kn-back" aria-hidden="true" />
      <Oops lang="hy" kind="notFound" base="" />
      <SiteFooter lang="hy" />
    </div>
  );
}
