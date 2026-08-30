"use client";

import { useEffect, useRef } from "react";

// ============================================================================
// WHAT A DIALOG OWES A KEYBOARD.
//
// `role="dialog" aria-modal="true"` is a PROMISE, not a behaviour. The editor's
// two drawers made that promise and kept none of it — measured on the running
// page: the template switcher and the publish drawer both opened, Escape did
// nothing, and document.activeElement stayed on <body>. A keyboard reader could
// open the publish drawer over the whole editor and then had no way to close it
// or reach into it; the only exit was tabbing through the entire page behind.
// This is the surface a couple spends an evening in.
//
// Four things, which is all "modal" actually means:
//   1. Escape closes it.
//   2. Focus MOVES IN when it opens — to the first control, else the box.
//   3. Focus RETURNS to whatever opened it when it closes, so the reader is put
//      back where they were rather than at the top of the document.
//   4. The page behind stops scrolling.
//
// `onClose` is held in a ref rather than listed as a dependency on purpose:
// every caller passes an inline arrow, so a dependency would rebuild the effect
// on every render and steal focus back into the dialog while someone was typing.
// The effect depends on `open` alone.
// ============================================================================

export function useDialog(open: boolean, onClose: () => void) {
  const box = useRef<HTMLDivElement | null>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!open) return;

    const prev = document.activeElement as HTMLElement | null;
    const scroll = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const first = box.current?.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    (first ?? box.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // stop it here: a drawer opened over another surface should close only
      // itself, not every ancestor listening for the same key
      e.stopPropagation();
      close.current();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = scroll;
      // the opener may have unmounted (a card that closed with the drawer);
      // focus() on a detached node throws, so ask before calling
      if (prev && prev.isConnected) prev.focus();
    };
  }, [open]);

  return box;
}
