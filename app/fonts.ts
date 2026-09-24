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
  // the same Arial twin the serif above had to drop, for the same reason:
  // this face is the ONLY way an Armenian word can be set in a sans, and it
  // only gets the chance if it stands ahead of a fallback that covers
  // Armenian. Without this the kids' cards were in Arial too.
  adjustFontFallback: false,
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

// THE INK LINE's faces (wedding-3, 2026-09-24) — exactly the four the
// client's Figma file «Wedding» sets its type in, read off the file's own
// "Copy as CSS": Hurricane (the script — names, titles, the hours), Montaga
// (the serif — letters, labels, the form), Montagu Slab (the slab — the date,
// the week, «gifts», the venue; variable in weight AND optical size, so the
// browser picks the same opsz instance by size that Figma does) and
// Montserrat 500 (one button). All OFL, latin subset, self-hosted like the
// rest. PRELOAD OFF: fontClass sits on every page's <html>, and only this one
// template uses them — a browser fetches a face when text first needs it.
// No metric twin, for the reason greatVibes gives: a latin-only face must not
// carry an Arial fallback that swallows Armenian ahead of the Armenian face.
export const hurricane = localFont({
  src: "../assets/fonts/hurricane-latin.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-ink-script",
  preload: false,
  adjustFontFallback: false,
});
export const montaga = localFont({
  src: "../assets/fonts/montaga-latin.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-ink-serif",
  preload: false,
  adjustFontFallback: false,
});
export const montaguSlab = localFont({
  src: "../assets/fonts/montagu-slab-var-latin.woff2",
  weight: "100 700",
  display: "swap",
  variable: "--font-ink-slab",
  preload: false,
  adjustFontFallback: false,
});
export const montserrat = localFont({
  src: "../assets/fonts/montserrat-500-latin.woff2",
  weight: "500",
  display: "swap",
  variable: "--font-ink-sans",
  preload: false,
  adjustFontFallback: false,
});

// HURRICANE HAS NO ARMENIAN. Per-glyph fallback sends an Armenian title to
// Noto Serif Armenian — at the SCRIPT's sizes (220 of the file's 1920), where
// a text serif runs twice as long as the script and broke out of its boxes
// («Որտեղ է ամեն ինչ կատարվելու» overflowed its 1063). This is the same file
// under a second name, drawn at 60%: measured per 100 px, Noto's 'ո' stands
// 51 tall to Hurricane's 'o' 31, and at 60% an Armenian title runs about as
// long as the file's English one. unicode-range keeps it to Armenian letters
// alone (the ampersand, the digits, the spaces stay Hurricane's), and only
// the script stack lists it (globals.css, --f-ink-script).
// PRELOAD STAYS ON, unlike the ink faces above, and on purpose: next/font
// names a preloaded file `<hash>.p.woff2` and a lazy one `<hash>.woff2`, so
// with preload off this alias shipped the SAME bytes as notoHy under a second
// URL and an Armenian page fetched them twice (measured in .next/static/media,
// 2026-09-24). Preloaded, it resolves to notoHy's own file — one download.
export const inkHyScript = localFont({
  src: "../assets/fonts/noto-serif-armenian-var.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-ink-hy",
  adjustFontFallback: false,
  declarations: [
    { prop: "size-adjust", value: "60%" },
    { prop: "unicode-range", value: "U+0531-0556, U+0559-058A, U+058D-058F, U+FB13-FB17" },
  ],
});

export const fontClass = `${cormorant.variable} ${jost.variable} ${notoHy.variable} ${fredoka.variable} ${notoSansHy.variable} ${greatVibes.variable} ${hurricane.variable} ${montaga.variable} ${montaguSlab.variable} ${montserrat.variable} ${inkHyScript.variable}`;
