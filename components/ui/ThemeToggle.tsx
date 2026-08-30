"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

// ============================================================================
// THEME TOGGLE — light / dark for the SERVICE pages. The choice lives on
// <html data-theme> and in localStorage; an inline script in Shell.tsx applies
// it BEFORE first paint (reading the store, else prefers-color-scheme), so a
// returning dark-theme visitor never sees an ivory flash. The button reads
// the attribute on mount, so its icon and label agree with the page.
//
// The invitation cards are untouched: a couple chose their card's palette;
// the visitor's OS preference does not repaint a wedding invitation.
// ============================================================================

export default function ThemeToggle({ labels }: { labels: { light: string; dark: string } }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const flip = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("kn-theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      className="kn-chip kn-theme"
      onClick={flip}
      aria-pressed={dark}
      aria-label={dark ? labels.light : labels.dark}
      title={dark ? labels.light : labels.dark}
    >
      {/* THE DESTINATION, not the current state — the same thing the label
          already said. In the dark it offers a sun ("Light theme"); in the
          light it offers a moon ("Dark theme"), so glyph and label agree
          instead of contradicting each other for a screen-reader user. */}
      <Icon name={dark ? "sun" : "moon"} size={16} />
    </button>
  );
}
