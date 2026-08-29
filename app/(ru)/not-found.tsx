import type { Metadata } from "next";
import Oops from "@/components/Oops";

// The Russian group carries the GUEST surface only, so there is no site nav or
// footer to wrap this in — a guest who mistypes a link gets the door back to
// the front page and nothing else. Copy falls back to English where no `ru`
// string exists (lib/i18n.ts → t), which is the documented behaviour here.
export const metadata: Metadata = { title: "KNIQ — 404", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <div className="kn-svc">
      <div className="kn-back" aria-hidden="true" />
      <Oops lang="ru" kind="notFound" base="" />
    </div>
  );
}
