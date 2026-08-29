"use client";

import { useEffect } from "react";
import { fontClass } from "@/app/fonts";
import Oops from "@/components/Oops";
import "@/app/globals.css";

// The last net: an error thrown in a ROOT LAYOUT itself, which the per-group
// error.tsx files sit inside of and therefore cannot catch. It replaces the
// whole document, so — like app/not-found.tsx — it renders its own html/body.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[kniq] root error", error);
  }, [error]);

  return (
    <html lang="hy-AM" className={fontClass} suppressHydrationWarning>
      <body>
        <div className="kn-svc">
          <div className="kn-back" aria-hidden="true" />
          <Oops lang="hy" kind="crash" base="" onRetry={reset} detail={error.digest} />
        </div>
      </body>
    </html>
  );
}
