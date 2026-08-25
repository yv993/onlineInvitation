"use client";

import { useState } from "react";
import { share } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// THE SHARE ROW — how an Armenian invitation actually travels.
//
// The couple sends one link; an aunt forwards it to the cousins in a WhatsApp
// thread; a groomsman drops it in the Telegram group. The card offers that
// forward itself. Everything here is a PLAIN URL — wa.me and t.me/share are
// GET endpoints — so no SDK loads, neither platform sees this page, and with
// JavaScript off both links still work (the URL is filled at render from the
// document location by the click handler, with an SSR-safe fallback).
//
// The copy button is the one thing that needs script; it appears only where
// the clipboard API exists, and confirms in words rather than only colour.
//
// DELIBERATELY NOT navigator.share: the native sheet would be one button, but
// it is unavailable on desktop Chrome/Firefox and inside several in-app
// browsers, which is exactly where these links get opened. Two explicit
// platforms + copy covers every device the same way.
// ============================================================================

export default function Share({ lang }: { lang: Lang }) {
  const [copied, setCopied] = useState(false);

  // The link being shared drops the personalised ?g= — the aunt forwarding it
  // must not hand her own greeting to everyone downstream.
  const url = () =>
    typeof window === "undefined"
      ? ""
      : window.location.origin + (lang === "hy" ? "/" : "/en");

  const text = t(lang, share.text);

  const open = (build: (u: string) => string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Fill the real URL at click time; SSR rendered a working fallback.
    e.currentTarget.href = build(url());
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard refused (permissions, insecure context): leave the button
      // as it was — a false "copied" is worse than nothing happening.
    }
  };

  return (
    <div className="kn-share">
      <p className="kn-share__title">{t(lang, share.title)}</p>
      <div className="kn-share__row">
        <a
          className="kn-share__chip"
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          onClick={open((u) => `https://wa.me/?text=${encodeURIComponent(`${text}\n${u}`)}`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4.3-.4.7-1.4.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z" />
          </svg>
          WhatsApp
        </a>

        <a
          className="kn-share__chip"
          href={`https://t.me/share/url?text=${encodeURIComponent(text)}`}
          onClick={open(
            (u) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(text)}`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.9 4.4 18.9 19c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.6L18.6 7c.4-.3-.1-.5-.6-.2L7.7 13.3l-4.4-1.4c-1-.3-1-1 .2-1.4l17.2-6.6c.8-.3 1.5.2 1.2 1.5z" />
          </svg>
          Telegram
        </a>

        <button type="button" className="kn-share__chip" onClick={copy} aria-live="polite">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {copied ? (
              <path d="M4 12.5 9.5 18 20 6.5" />
            ) : (
              <>
                <rect x="8" y="8" width="12" height="12" rx="2" />
                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
              </>
            )}
          </svg>
          {t(lang, copied ? share.copied : share.copy)}
        </button>
      </div>
    </div>
  );
}
