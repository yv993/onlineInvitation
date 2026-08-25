import type { ReactNode } from "react";
import Shell, { buildMetadata } from "@/components/Shell";

export const metadata = buildMetadata("hy");

export default function HyLayout({ children }: { children: ReactNode }) {
  return <Shell lang="hy">{children}</Shell>;
}
