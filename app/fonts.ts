import localFont from "next/font/local";

// Three families, self-hosted (no Google request at runtime — the CSP has no
// third-party font-src and doesn't need one).
//
// The Armenian face is reached by PER-GLYPH FALLBACK rather than by switching
// stacks per route: Cormorant and Jost carry no Armenian coverage, so every
// Armenian letter drops through to Noto Serif Armenian automatically while
// Latin stays in the display face. One font-family list serves both languages.
//
// NOTO SERIF ARMENIAN IS A LOCAL FILE, NOT A GOOGLE IMPORT, after a build
// failure worth remembering: next/font/google pins exact fonts.gstatic.com
// URLs inside the installed Next release, and Google eventually rotates them —
// the pinned v30 URL began returning a REAL 404, so any build without a warm
// .next cache could never succeed again. The current file was fetched once
// from Google's css2 endpoint (it is a VARIABLE font — one 34 KB woff2
// carries the whole weight axis, which is why "400" and "600" resolved to the
// same URL) and lives in assets/fonts, where no third party can rot it.

// …AND SO ARE THE OTHER TWO NOW (2026-08-29). The same rot the note above
// describes applies to every next/font/google import: the build reaches
// fonts.gstatic.com on every cold cache, so a flaky network stalls it in
// ECONNRESET retries and a CI without access to Google cannot build at all.
// These are the same latin variable faces, fetched once from the css2
// endpoint and kept here. The build is now offline-capable and deterministic.
export const cormorant = localFont({
  src: [
    { path: "../assets/fonts/cormorant-normal-latin.woff2", style: "normal", weight: "300 700" },
    { path: "../assets/fonts/cormorant-italic-latin.woff2", style: "italic", weight: "300 700" },
  ],
  display: "swap",
  variable: "--font-cormorant",
});

export const jost = localFont({
  src: "../assets/fonts/jost-normal-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-jost",
});

export const notoHy = localFont({
  src: "../assets/fonts/noto-serif-armenian-var.woff2",
  // The file's real wght axis. Declaring the full range lets 400 and 600 both
  // resolve to it without synthetic bolding.
  weight: "100 900",
  display: "swap",
  variable: "--font-hy",
  // THE ARMENIAN SITE WAS RENDERING IN ARIAL (measured 2026-09-01 with
  // CSS.getPlatformFontsForNode: the hero headline came back "Arial (system)
  // x25, Cormorant Garamond Light x2"). Same trap already recorded for Great
  // Vibes below: next/font writes a metric-matched LOCAL ARIAL fallback INSIDE
  // each family variable, and Arial covers Armenian - so var(--font-cormorant)
  // swallowed every Armenian letter before the stack could reach this face.
  //
  // The fix is two halves and needs both: drop this face's own Arial twin, and
  // put it FIRST in the display/body stacks (globals.css). Measured safe: the
  // file carries 2 of 24 Latin glyphs - effectively none - so Latin falls
  // straight through to Cormorant/Jost, whose metric fallbacks stay intact.
  adjustFontFallback: false,
});

// THE KIDS FACES — the birthday cards want rounder, chunkier type than an
// editorial serif. Fredoka (variable 300–700, Latin) for the party headline
// and Noto Sans Armenian (variable 100–900) so an Armenian child's name is set
// in a matching round sans rather than dropping to the serif. Both fetched
// once from the css2 endpoint (OFL) and self-hosted, same reasoning as above.
export const fredoka = localFont({
  src: "../assets/fonts/fredoka-var-latin.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-fredoka",
});

export const notoSansHy = localFont({
  src: "../assets/fonts/noto-sans-armenian-var.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-hy-sans",
});

// THE SCRIPT FACE — the three AreOne-register wedding styles (ticket, pearls,
// dusty blue) set their one-word flourishes («and», «Our wedding day!»,
// «timeline», «please») in a handwriting script. Great Vibes (OFL), latin
// subset only — Armenian flourishes fall through to the italic serif, which
// is the honest result (no Armenian script face exists in this register).
export const greatVibes = localFont({
  src: "../assets/fonts/great-vibes-latin.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-script",
  // next/font hands every family a metric-adjusted LOCAL ARIAL fallback and
  // writes it INSIDE the variable, ahead of anything the token appends. Arial
  // carries Armenian, so it swallowed every Armenian name before the per-glyph
  // fallback could reach our Armenian face — the script hero rendered in a
  // grotesque. The face is decorative and latin-only; it needs no metric twin.
  adjustFontFallback: false,
});

export const fontClass = `${cormorant.variable} ${jost.variable} ${notoHy.variable} ${fredoka.variable} ${notoSansHy.variable} ${greatVibes.variable}`;
