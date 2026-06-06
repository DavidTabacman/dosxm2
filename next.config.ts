import type { NextConfig } from "next";

/**
 * Content-Security-Policy (audit report §5 item 10). Pragmatic, enforced.
 *
 * - `script-src`/`style-src` keep `'unsafe-inline'`: the JSON-LD block
 *   (components/Seo.tsx) and GA4 init (components/Analytics.tsx) are inline
 *   scripts whose content varies per page (hashes impractical), and next/image
 *   `fill`/`width` emit inline `style` attributes that nonces don't cover.
 * - All images, fonts (self-hosted via next/font), and Next runtime load from
 *   `'self'`; GA4 (googletagmanager.com + GA endpoints) is allowlisted for
 *   when NEXT_PUBLIC_GA_ID is set. Lystos/IG/TikTok/Maps are `target="_blank"`
 *   links, not embeds, so no `frame-src` is needed (`default-src 'self'`).
 * - Dev only: `'unsafe-eval'` + `ws:` so React Refresh / HMR aren't blocked.
 *   Production stays strict.
 */
const isDev = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  `connect-src 'self'${isDev ? " ws:" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com`,
  "upgrade-insecure-requests",
].join("; ");

/**
 * Baseline security headers applied to every response (audit §4.9). HSTS,
 * nosniff, referrer policy, anti-clickjacking, a conservative
 * Permissions-Policy, and the Content-Security-Policy defined above.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
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
  // All site imagery now flows through next/image (audit report §5 item 8).
  // Prefer AVIF, falling back to WebP, then the original format. Every source
  // is a local /public asset, so no `remotePatterns` are required.
  images: {
    formats: ["image/avif", "image/webp"],
  },
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
