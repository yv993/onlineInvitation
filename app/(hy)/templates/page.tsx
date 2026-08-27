import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Motion from "@/components/Motion";
import TemplatesPage from "@/components/TemplatesPage";
import { tplPage } from "@/lib/content";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: `ԿՆԻՔ — ${t("hy", tplPage.title)}`, description: t("hy", tplPage.lead) };

export default function Page() {
  return (
    <div className="kn-svc">
      <SiteNav lang="hy" />
      <Motion />
      <div className="kn-back" aria-hidden="true" />
      <TemplatesPage lang="hy" />
      <SiteFooter lang="hy" />
    </div>
  );
}
