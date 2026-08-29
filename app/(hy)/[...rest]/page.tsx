import type { Metadata } from "next";
import { notFound } from "next/navigation";

// ============================================================================
// THE CATCH-ALL, and why a plain app/not-found.tsx was not enough.
//
// This project has THREE root layouts (app/(hy), app/(en), app/(ru)) so that
// <html lang> is correct in the server response. When several root layouts
// exist, Next cannot know which one an UNMATCHED url belonged to, so it renders
// the global not-found outside all of them. Measured on the production build:
// the served 404 had no class on <html> and NO STYLESHEET LINK AT ALL — the
// page came back in Times New Roman on a white ground, which is precisely the
// stock-404 seam the design was meant to remove.
//
// Making the miss a MATCHED ROUTE fixes it at the root: /anything-at-all now
// resolves here, inside the Armenian group, so it gets that group's layout —
// fonts, stylesheet, lang, theme script — and notFound() then renders
// app/(hy)/not-found.tsx complete with the site's nav and footer.
//
// This never shadows a real page: Next matches static and dynamic segments
// before catch-alls, and the /en and /ru groups have catch-alls of their own so
// a miss keeps its language.
// ============================================================================

// The response is a real 404, but the DOCUMENT still carries whatever the root
// layout declared — which is `robots: { index: true }`, because the business
// pages want to be found. Measured: /nope shipped <meta name="robots"
// content="index, follow">. Harmless in the end (a 404 status wins), but it is
// a page telling a crawler to index a url that does not exist, so say the true
// thing here.
export const metadata: Metadata = {
  title: "ԿՆԻՔ — 404",
  robots: { index: false, follow: false },
};

export default function CatchAll() {
  notFound();
}
