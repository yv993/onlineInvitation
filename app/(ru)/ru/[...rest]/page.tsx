import type { Metadata } from "next";
import { notFound } from "next/navigation";

// /ru/<anything unmatched> — see the note on app/(hy)/[...rest]/page.tsx.
export const metadata: Metadata = {
  title: "KNIQ — 404",
  robots: { index: false, follow: false },
};

export default function CatchAll() {
  notFound();
}
