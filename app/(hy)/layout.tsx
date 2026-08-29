import type { ReactNode } from "react";
import Shell, { buildMetadata, viewport as shellViewport } from "@/components/Shell";

export const viewport = shellViewport;

export const metadata = buildMetadata("hy");

export default function HyLayout({ children }: { children: ReactNode }) {
  return <Shell lang="hy">{children}</Shell>;
}
