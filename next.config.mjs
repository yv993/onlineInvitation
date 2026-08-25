/** @type {import('next').NextConfig} */

// Every photograph is a STATIC IMPORT from assets/ — no remote hosts, so there
// are no remotePatterns here on purpose. A guest opening this on a phone in
// Yerevan contacts exactly one origin: ours. (Same rule as KAR and NORATUN.)
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },

  async headers() {
    // Dev needs eval for the React refresh runtime; a CSP that forbids it turns
    // the dev server into a wall of console errors. Production only.
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-inline' is NOT optional here: the App Router ships its
              // RSC payload and its pre-paint scripts (html.js, the theme) as
              // inline <script>s. `script-src 'self'` alone blocked every one
              // of them under `next start` — React never received the Flight
              // stream ("Connection closed") and EVERY page unmounted to a blank
              // ground; `next build` passing never exercised it. The strict
              // upgrade is a per-request nonce from middleware ('strict-dynamic'),
              // which costs static prerendering — noted in the README.
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "media-src 'self' https:", // a couple's own track may live on their host
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'self'", // the wizard's Live Demo frames our own pages
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
