import type { ReactNode } from "react";
import Shell, { buildMetadata, viewport as shellViewport } from "@/components/Shell";

export const viewport = shellViewport;

export const metadata = buildMetadata("en");

export default function EnLayout({ children }: { children: ReactNode }) {
  return <Shell lang="en">{children}</Shell>;
}
