import type { Metadata } from "next";
import ServiceHome from "@/components/ServiceHome";

export const metadata: Metadata = {
  title: "KNIQ — Digital invitations",
  description:
    "Choose a style, send us your day, and hand your guests one link — with the programme, the maps, the countdown and the RSVP.",
};

export default function Page() {
  return <ServiceHome lang="en" />;
}
