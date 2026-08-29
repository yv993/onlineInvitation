"use client";

import { useEffect } from "react";
import SiteNav from "@/components/SiteNav";
import Oops from "@/components/Oops";

export default function GroupError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[kniq] render error", error);
  }, [error]);

  return (
    <div className="kn-svc">
      <SiteNav lang="en" onLanding={false} />
      <div className="kn-back" aria-hidden="true" />
      <Oops lang="en" kind="crash" base="/en" onRetry={reset} detail={error.digest} />
    </div>
  );
}
