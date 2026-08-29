import type { MetadataRoute } from "next";

// ============================================================================
// The web app manifest.
//
// Two reasons this exists, and neither is a checklist tick:
//
//  1. A COUPLE lives in the builder for an evening. /edit and /customize are
//     long sessions on a phone, and without a manifest the only way back is a
//     browser tab among twenty. Installed, KNIQ is an icon on the home screen
//     that reopens where they were.
//  2. A GUEST is handed a link in WhatsApp and opens it in an in-app browser.
//     `display: browser` is deliberate here rather than "standalone": an
//     invitation is a LINK, and a guest must be able to see the address, share
//     it onward and trust it. Hiding the URL bar on someone else's wedding
//     invitation is the wrong kind of app-like.
//
// The start_url is the Armenian front door — the site's own default language.
// The icons are rendered from app/icon.svg (the wax seal), including a padded
// MASKABLE variant, because Android crops a non-maskable icon to a circle and
// would otherwise shave the wax rim off the mark the product is named for.
// ============================================================================

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ԿՆԻՔ — Թվային հրավիրատոմսեր",
    short_name: "ԿՆԻՔ",
    description:
      "Ընտրեք ոճը, ուղարկեք ձեր օրվա մանրամասները, և հյուրերին տվեք մեկ հղում՝ ծրագրով, քարտեզներով, հետհաշվարկով և պատասխանի ձևով։",
    lang: "hy-AM",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#f3efe7",
    theme_color: "#f3efe7",
    categories: ["lifestyle", "social", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Ձևանմուշներ", short_name: "Ձևանմուշներ", url: "/templates" },
      { name: "Խմբագրիչ", short_name: "Խմբագրիչ", url: "/edit" },
      { name: "Իմ հրավերները", short_name: "Իմ հրավերները", url: "/my" },
    ],
  };
}
