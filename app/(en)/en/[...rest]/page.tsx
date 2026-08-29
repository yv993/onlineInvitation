import type { Metadata } from "next";
import { notFound } from "next/navigation";

// /en/<anything unmatched> — see the note on app/(hy)/[...rest]/page.tsx.
// Without this, an English visitor who mistyped a url fell through to the
// Armenian global 404: measured, /en/no-such-page came back reading
// «Այս էջը չկա» in Times New Roman with no stylesheet at all.
export const metadata: Metadata = {
  title: "KNIQ — 404",
  robots: { index: false, follow: false },
};

export default function CatchAll() {
  notFound();
}
