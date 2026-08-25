import type { Metadata } from "next";
import ServiceHome from "@/components/ServiceHome";

// The root is the SERVICE — KNIQ selling invitations. The invitations
// themselves live at /i/<style>, one live preview per catalog entry.
export const metadata: Metadata = {
  title: "ԿՆԻՔ — Թվային հրավիրատոմսեր",
  description:
    "Ընտրեք ոճը, ուղարկեք ձեր օրվա մանրամասները, և հյուրերին տվեք մեկ հղում՝ ծրագրով, քարտեզներով, հետհաշվարկով և պատասխանի ձևով։",
};

export default function Page() {
  return <ServiceHome lang="hy" />;
}
