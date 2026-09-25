"use client";

import dynamic from "next/dynamic";

// The ink score runs on ONE template's guest page, but TemplateView — and so
// Ink.tsx — sits in the code every template page, the landing and the editor
// share. Imported directly, the score rode along in that shared chunk to
// every one of them (measured in the build: chunk 2456, loaded by the
// landing, the editor and all three invitation routes). Behind this wrapper
// it is fetched only where it renders: a wedding-3 guest's page.
//
// THE IMPORT FAILS SOFT. A chunk that cannot load (a network error, a 404
// after a redeploy) must never reach the route's error boundary — it did, and
// replaced the whole invitation with "Something went wrong". It renders
// nothing instead: the page is parked in CSS, and the 4s failsafe shows it
// finished, exactly as it does for a chunk that merely stalls.
const InkScore = dynamic(
  () => import("./InkScore").catch(() => ({ default: () => null })),
  { ssr: false },
);

export default function InkScoreLazy() {
  return <InkScore />;
}
