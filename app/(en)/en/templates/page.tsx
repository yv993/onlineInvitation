import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Motion from "@/components/Motion";
import TemplatesPage from "@/components/TemplatesPage";
import { tplPage } from "@/lib/content";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: `KNIQ — ${t("en", tplPage.title)}`, description: t("en", tplPage.lead) };

export default function Page() {
  return (
    <div className="kn-svc">
      <SiteNav lang="en" />
      <Motion />
      <div className="kn-back" aria-hidden="true" />
      <TemplatesPage lang="en" />
      <SiteFooter lang="en" />
    </div>
  );
}
