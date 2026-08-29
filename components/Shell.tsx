import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { fontClass } from "@/app/fonts";
import { site, ui } from "@/lib/content";
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

/** The locale tag Open Graph wants, per language. */
const ogLocale: Record<Lang, string> = { hy: "hy_AM", en: "en_US", ru: "ru_RU" };

// ---------------------------------------------------------------------------
// The two ground colours, handed to the BROWSER CHROME.
//
// The site has always had a light and a dark theme; the phone's address bar
// never knew. Without theme-color a guest opening an invitation on Android or
// iOS gets our paper card framed in the browser's own grey — the seam is the
// first thing they see, before a single word of the invitation. These are the
// literal values from globals.css: --paper (:root) and the dark ground painted
// on html[data-theme="dark"]. If either moves, move it here too.
//
// The site is also `suppressHydrationWarning`-themed from localStorage before
// paint, so a visitor whose stored choice disagrees with their OS setting sees
// the wrong chrome colour for one frame. That is the honest cost of a stored
// override, and it is one frame on a bar, not on the page.
// ---------------------------------------------------------------------------
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
  colorScheme: "light dark",
};

/** What the SERVICE is, in each language — the share card for every business
 *  page that does not describe something more specific. Same wording as the
 *  landing pages already carry; nothing new is claimed here. */
const serviceCard: Record<Lang, { title: string; description: string }> = {
  hy: {
    title: "ԿՆԻՔ — Թվային հրավիրատոմսեր",
    description:
      "Ընտրեք ոճը, ուղարկեք ձեր օրվա մանրամասները, և հյուրերին տվեք մեկ հղում՝ ծրագրով, քարտեզներով, հետհաշվարկով և պատասխանի ձևով։",
  },
  en: {
    title: "KNIQ — Digital invitations",
    description:
      "Pick a style, fill in the details of your day, and give your guests one link — with the programme, the maps, the countdown and the reply form.",
  },
  ru: {
    title: "KNIQ — Цифровые приглашения",
    description:
      "Выберите стиль, заполните детали вашего дня и дайте гостям одну ссылку — с программой, картами, обратным отсчётом и формой ответа.",
  },
};

// ---------------------------------------------------------------------------
// THE LAYOUT DEFAULT.
//
// This runs in a LAYOUT, so whatever it returns is inherited by every page
// underneath it. That is exactly why it must not name a URL. It used to set
// `alternates.canonical` to "/" — and because no page overrode it, /templates,
// /customize, /kids and every other business page shipped a canonical pointing
// at the HOMEPAGE. Measured on the production build: all three sampled routes
// emitted <link rel="canonical" href="/">, which tells a crawler they are
// duplicates of the front page and only one of them deserves to be indexed.
// A missing canonical is harmless (search engines self-canonicalise); a wrong
// one throws the page away. Canonicals now come from pageMeta(), per page.
//
// The share card had the same shape of bug: it described a SAMPLE COUPLE, so
// posting the KNIQ homepage anywhere produced "Նարե և Հայկ — 10 · 10 · 2026".
// The default now describes the service; the guest pages, which really are
// about a couple, build their own card in lib/shareCard.ts.
// ---------------------------------------------------------------------------
// The studio card, declared EXPLICITLY rather than left to Next's
// app/opengraph-image.png file convention. That convention only fills in when
// nothing in the segment chain declares an openGraph object; the moment
// pageMeta() below started writing one per page to carry the canonical, the
// convention stopped firing and og:image vanished from every business page —
// measured on the production build as no og:image tag at all on the front door.
// Naming the file here makes the card independent of that merge rule. The url
// is relative on purpose: Next resolves it against metadataBase, so it is
// absolute in production and simply unset before a domain exists.
const shareImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "ԿՆԻՔ — թվային հրավիրատոմսերի ստուդիա. Հրավերը, որ բացվում է կնիքից։",
};

export function buildMetadata(lang: Lang): Metadata {
  const card = serviceCard[lang];

  return {
    // Only set metadataBase when there is a real origin. Emitting
    // http://localhost OG URLs into a production build is the classic own goal.
    ...(site.url ? { metadataBase: new URL(site.url) } : {}),
    title: card.title,
    description: card.description,
    applicationName: site.nameLatin,
    openGraph: {
      title: card.title,
      description: card.description,
      siteName: site.nameLatin,
      type: "website",
      locale: ogLocale[lang],
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title: card.title, description: card.description, images: [shareImage.url] },
    // THE SPLIT (2026-08-25): the BUSINESS pages want to be found — that is
    // how couples arrive — so the default is indexable. The pages that
    // belong to one couple and their guests (/invitation, /i, /guests)
    // declare their own noindex in their routes: a wedding invitation must
    // never turn up in a search for the couple's names.
    robots: { index: true, follow: true },
  };
}

/**
 * Per-page metadata: the ONE place a canonical may be named, because only a
 * page knows its own path. `path` is the Armenian path ("/templates"); the
 * English twin is assumed to be "/en" + path, which is how the route groups
 * are laid out. Pass the page's own title/description to have them carry into
 * the share card too — otherwise Next keeps the layout's Open Graph object
 * even when the page overrides `title`, which is how the business pages ended
 * up sharing a sample couple's names.
 */
export function pageMeta(
  lang: Lang,
  path: string,
  extra: { title?: string; description?: string } = {},
): Metadata {
  const base = buildMetadata(lang);
  const hy = path === "/" ? "/" : path;
  const en = path === "/" ? "/en" : `/en${path}`;
  const self = lang === "hy" ? hy : en;
  const title = extra.title ?? (base.title as string);
  const description = extra.description ?? (base.description as string);

  return {
    ...base,
    title,
    description,
    alternates: {
      canonical: self,
      // Only the two MARKETING languages are listed: the Russian route group
      // carries the guest surface only, and those pages are noindex.
      languages: { "hy-AM": hy, en },
    },
    openGraph: { ...base.openGraph, title, description, url: self },
    twitter: { ...base.twitter, title, description },
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
