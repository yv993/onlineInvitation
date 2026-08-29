import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import { SiteJsonld } from "@/components/Jsonld";
import ServiceHome from "@/components/ServiceHome";

export const metadata: Metadata = pageMeta("en", "/", {
  title: "KNIQ — Digital invitations",
  description:
    "Choose a style, send us your day, and hand your guests one link — with the programme, the maps, the countdown and the RSVP.",
});

export default function Page() {
  return (
    <>
      <SiteJsonld
        lang="en"
        path="/en"
        name="KNIQ — Digital invitations"
        description="Choose a style, send us your day, and hand your guests one link — with the programme, the maps, the countdown and the RSVP."
      />
      <ServiceHome lang="en" />
    </>
  );
}
