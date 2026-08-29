"use client";

import Link from "next/link";
import { errors } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// The panel behind every 404 and every caught render error.
//
// A client component so error.tsx (which must be one, to receive `reset`) and
// not-found.tsx (which need not be) can share exactly one design. The wax seal
// is drawn in CSS rather than imported, so this page renders even if the thing
// that broke was an asset route.
// ============================================================================

export default function Oops({
  lang,
  kind,
  base = "",
  onRetry,
  detail,
}: {
  lang: Lang;
  kind: "notFound" | "crash";
  /** "" for Armenian, "/en" for English — keeps the buttons in-language */
  base?: string;
  onRetry?: () => void;
  /** a digest or message, shown small: useful to a person reporting it */
  detail?: string;
}) {
  const c = kind === "notFound" ? errors.notFound : errors.crash;

  return (
    <main className="kn-oops" id="card">
      <div className="kn-oops__seal" aria-hidden="true">
        <span>{kind === "notFound" ? t(lang, errors.notFound.code) : "!"}</span>
      </div>
      <h1 className="kn-oops__h">{t(lang, c.title)}</h1>
      <p className="kn-oops__p">{t(lang, c.body)}</p>

      <div className="kn-oops__row">
        {kind === "crash" ? (
          <button type="button" className="kn-btn kn-btn--big" onClick={onRetry}>
            {t(lang, errors.crash.retry)}
          </button>
        ) : null}
        <Link className={`kn-btn kn-btn--big${kind === "crash" ? " kn-btn--ghost" : ""}`} href={base || "/"}>
          {t(lang, errors.notFound.home)}
        </Link>
        {kind === "notFound" ? (
          <Link className="kn-btn kn-btn--big kn-btn--ghost" href={`${base}/templates`}>
            {t(lang, errors.notFound.browse)}
          </Link>
        ) : null}
      </div>

      {detail ? <p className="kn-oops__d">{detail}</p> : null}
    </main>
  );
}
