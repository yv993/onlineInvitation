import type { ReactNode } from "react";
import Shell, { buildMetadata } from "@/components/Shell";

export const metadata = buildMetadata("en");

export default function EnLayout({ children }: { children: ReactNode }) {
  return <Shell lang="en">{children}</Shell>;
}
