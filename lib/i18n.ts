import type { Lang, T } from "./content";

// ============================================================================
// LANGUAGE IS A ROUTE, NOT A STATE.
//
// `/` is Armenian, `/en` is English. Both are server-rendered, both are
// indexable, both work with JavaScript switched off, and the toggle between
// them is an ordinary <a>. The alternative — a client-side toggle reading
// localStorage — cannot render the right language on the first paint without
// either a hydration mismatch or a flash of the wrong alphabet, and it hides
// half the content from search engines. One route each costs a few kB and
// removes the entire class of problem.
//
// iStudio has a client-side am/en switch; NAIVA has no English at all.
// ============================================================================

/** The SITE's languages — the marketing pages and their toggle. Russian is a
 *  guest-surface language only (GUEST_LANGS): a couple shares a /ru guest
 *  link, but the service is sold in Armenian and English. */
export const LANGS: Lang[] = ["hy", "en"];
/** The languages a guest link exists in — hy at the root, /en, /ru. */
export const GUEST_LANGS: Lang[] = ["hy", "en", "ru"];
export const DEFAULT_LANG: Lang = "hy";

/** Read one language of a T. Armenian and English always exist; Russian is
 *  optional and falls back to English — a /ru guest page shows the couple's
 *  own words (stored in both required slots) and the translated labels, and
 *  any label not yet translated appears in English rather than vanishing. */
export function t(lang: Lang, v: T): string {
  return v[lang] ?? v.en;
}

/** The other SITE language — what the marketing toggle links to. */
export function other(lang: Lang): Lang {
  return lang === "hy" ? "en" : "hy";
}

/** The URL prefix a language lives under. */
export function langPrefix(lang: Lang): string {
  return lang === "hy" ? "" : `/${lang}`;
}

/** Path for a language, preserving the sub-path (e.g. "/i/luys") and the
 *  personalised-guest parameter. With no sub-path this is the service root. */
export function pathFor(lang: Lang, guest?: string, sub = ""): string {
  let base = langPrefix(lang) + sub;
  if (base === "") base = "/";
  if (!guest) return base;
  return `${base}?g=${encodeURIComponent(guest)}`;
}

/** BCP-47 tag for <html lang> and hreflang. */
export function htmlLang(lang: Lang): string {
  return lang === "hy" ? "hy-AM" : lang;
}

// ---------------------------------------------------------------------------
// THE PERSONALISED GREETING
//
// A link like /?g=Անի makes the card open with the guest's own name on it.
// It is the cheapest luxury in the category and neither reference has it.
//
// It is also the one place a stranger's text reaches the page, so it is
// treated as hostile: letters, marks, spaces, hyphens and apostrophes only,
// 40 characters, and never rendered as anything but a text node. No HTML can
// survive this, and neither can a 900-character name designed to break the
// layout.
// ---------------------------------------------------------------------------

const NAME_OK = /[^\p{L}\p{M}\s'’-]/gu;

export function cleanGuest(raw: string | string[] | undefined): string {
  if (typeof raw !== "string") return "";
  const s = raw.replace(NAME_OK, "").replace(/\s+/g, " ").trim().slice(0, 40);
  // A name of only punctuation is not a name.
  return /\p{L}/u.test(s) ? s : "";
}
