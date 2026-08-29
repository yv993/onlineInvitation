import type { ReactNode } from "react";
import Shell, { buildMetadata, viewport as shellViewport } from "@/components/Shell";

// The Russian route group carries the GUEST surface only — /ru/invitation/<id>
// and /ru/invitations/<slug> — the third language a couple can send their
// guests. The marketing site stays hy/en; any label without a `ru` falls back
// to English (lib/i18n.ts → t).
export const viewport = shellViewport;

export const metadata = buildMetadata("ru");

export default function RuLayout({ children }: { children: ReactNode }) {
  return <Shell lang="ru">{children}</Shell>;
}
