"use client";

import { useEffect } from "react";
import SiteNav from "@/components/SiteNav";
import Oops from "@/components/Oops";

// The Armenian group's render-error boundary. Without one, a throw anywhere
// under this layout unmounted the whole tree to Next's stock error screen —
// on a guest's phone, mid-invitation, with no way back to the site.
export default function GroupError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // no analytics endpoint exists yet; the console is where this is readable
    console.error("[kniq] render error", error);
  }, [error]);

  return (
    <div className="kn-svc">
      <SiteNav lang="hy" onLanding={false} />
      <div className="kn-back" aria-hidden="true" />
      <Oops lang="hy" kind="crash" base="" onRetry={reset} detail={error.digest} />
    </div>
  );
}
