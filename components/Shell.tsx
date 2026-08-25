import type { ReactNode } from "react";
import type { Metadata } from "next";
import { fontClass } from "@/app/fonts";
import { couple, hero, invitation, site, ui } from "@/lib/content";
import { htmlLang, t } from "@/lib/i18n";
import type { Lang } from "@/lib/content";
import "@/app/globals.css";

// ============================================================================
// The document shell, shared by both root layouts.
//
// There are TWO root layouts — app/(hy)/layout.tsx and app/(en)/layout.tsx —
// because <html lang> has to be correct in the SERVER response, not patched in
// after hydration. Armenian and English need different lang attributes for
// screen readers to pronounce them and for the browser to hyphenate them, and
// a client-side language toggle cannot deliver that on the first paint. Route
// groups let both layouts own an <html> without either URL gaining a segment.
// ============================================================================

export function buildMetadata(lang: Lang): Metadata {
  const names = `${t(lang, couple.a)} ${lang === "hy" ? "և" : "&"} ${t(lang, couple.b)}`;
  const title = `${names} — ${hero.stamp}`;
  const description = `${t(lang, invitation.line)} ${t(lang, invitation.body[0])}`;

  return {
    // Only set metadataBase when there is a real origin. Emitting
    // http://localhost OG URLs into a production build is the classic own goal.
    ...(site.url ? { metadataBase: new URL(site.url) } : {}),
    title,
    description,
    alternates: {
      canonical: lang === "hy" ? "/" : "/en",
      languages: { "hy-AM": "/", en: "/en" },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "hy" ? "hy_AM" : "en_US",
    },
    // THE SPLIT (2026-08-25): the BUSINESS pages want to be found — that is
    // how couples arrive — so the default is indexable. The pages that
    // belong to one couple and their guests (/invitation, /i, /guests)
    // declare their own noindex in their routes: a wedding invitation must
    // never turn up in a search for the couple's names.
    robots: { index: true, follow: true },
  };
}

export default function Shell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    // The font classes go on <html>, NOT <body>: globals.css declares the
    // --f-display / --f-body / --f-kids stacks on :root as
    // var(--font-…) references, and a custom property is resolved where it is
    // DECLARED — on :root, a --font-* that only exists on <body> is undefined,
    // the whole stack becomes invalid, and every element falls to the browser
    // default. Measured: with the classes on <body>, computed font-family was
    // "Times New Roman" site-wide (the Armenian looked plausible in Sylfaen).
    <html lang={htmlLang(lang)} className={fontClass} suppressHydrationWarning>
      <head>
        {/* Marks the document as scripted BEFORE first paint, so the motion
            layer's parked states (opacity 0, translated lines) only ever apply
            where something exists to unpark them. Without this, a visitor with
            JavaScript disabled gets a page of invisible text. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');try{var t=localStorage.getItem('kn-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>
        <a className="kn-skip" href="#card">
          {t(lang, ui.skip)}
        </a>
        {children}
      </body>
    </html>
  );
}
