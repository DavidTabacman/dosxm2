import type { NextConfig } from "next";

/**
 * Baseline security headers applied to every response (audit §4.9). HSTS,
 * nosniff, referrer policy, anti-clickjacking, and a conservative
 * Permissions-Policy. A full Content-Security-Policy is intentionally NOT set
 * here yet — it needs to be validated against the live site (next/font, the
 * external Lystos valorador, GA4, Instagram/TikTok) to avoid silently breaking
 * resources, and is tracked as a follow-up in the audit report.
 */
const securityHeaders = [
  {
    // 1-year HSTS with subdomains. Deliberately NO `preload` — that's a
    // hard-to-reverse browser-preload-list enrollment that should be an
    // explicit owner decision, not a default.
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // NOTE: no `images` config block on purpose. next/image optimization is
  // already Next's default and only the two header logos use it today (the
  // raw-<img> migration is deferred — audit report §5 item 8). Adding an explicit
  // `images: { unoptimized: false, formats: [...] }` here yields ~no benefit at
  // 2 logos and is better landed WITH that migration so both are verified on a
  // live App Hosting deploy at once (App Hosting's optimizer behavior differs
  // from `next start` and must be confirmed there).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Stable, non-hashed media in /public/v4 — cache at the CDN with a
        // day TTL + a week of stale-while-revalidate so asset swaps still
        // propagate without re-fetching on every request.
        source: "/v4/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/v5", destination: "/", permanent: true },
      { source: "/v4", destination: "/", permanent: true },
      { source: "/v4/conocenos", destination: "/conocenos", permanent: true },
    ];
  },
};

export default nextConfig;
