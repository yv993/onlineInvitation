"use client";

import { useEffect } from "react";
import Oops from "@/components/Oops";

export default function GroupError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[kniq] render error", error);
  }, [error]);

  return (
    <div className="kn-svc">
      <div className="kn-back" aria-hidden="true" />
      <Oops lang="ru" kind="crash" base="" onRetry={reset} detail={error.digest} />
    </div>
  );
}
