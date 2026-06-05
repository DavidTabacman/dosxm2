/**
 * Single source of truth for SEO/canonical URLs.
 *
 * Every canonical, OG, Twitter, sitemap, robots, and JSON-LD URL on the site
 * must be ABSOLUTE (Google ignores/treats-as-ambiguous relative canonicals).
 * Centralizing the origin here is what prevents the relative-URL drift the
 * SEO audit (prds/seo_audit_v1.md §4.2) found in the per-page <Head> blocks.
 *
 * Origin precedence:
 *   1. NEXT_PUBLIC_APP_URL  — set in Firebase App Hosting env to the canonical
 *      host (apex `https://dosxm2.com`). Declared in .env.example.
 *   2. Fallback to the production apex so a missing env var never emits a
 *      `localhost` canonical into a production build.
 *
 * The value is normalized to have NO trailing slash so `absUrl("/")` yields a
 * clean origin and `absUrl("/conocenos")` never doubles a slash.
 */
const DEFAULT_ORIGIN = "https://dosxm2.com";

function normalizeOrigin(raw: string | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return DEFAULT_ORIGIN;
  return value.replace(/\/+$/, "");
}

export const SITE_ORIGIN = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL);

/** Resolve a root-relative path (or already-absolute URL) to an absolute URL.
 *  Internal paths are passed through encodeURI so assets with spaces in their
 *  filename (e.g. "/Nuevo Logo grande.png") emit a VALID URL — important for
 *  JSON-LD logo/image fields that schema validators reject if unescaped.
 *  encodeURI is idempotent for already-escaped sequences (%20 stays %20). */
export function absUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(`${SITE_ORIGIN}${suffix === "/" ? "" : suffix}`) || SITE_ORIGIN;
}

/** Site-wide brand + contact constants reused across meta and JSON-LD. */
export const SITE = {
  name: "DOSXM2",
  legalName: "DOSXM2",
  /**
   * Default share image. Uses the existing 1200-wide founders photo until a
   * dedicated 1200×630 branded share card is designed (audit §9.3). Width/
   * height are intentionally NOT asserted in meta since this asset's exact
   * dimensions aren't 1200×630.
   */
  ogImage: "/v4/founders/together-1200.jpg",
  locale: "es_ES",
  twitterCard: "summary_large_image",
  /** E.164-ish display phones (match GBP + footer + JSON-LD byte-for-byte). */
  telephones: ["+34 667 00 66 62", "+34 674 52 74 10"],
  emails: ["borja.gallego@dosxm2.com", "pablo.dupont@dosxm2.com"],
  /**
   * Service-area business (no public storefront): we expose areaServed, NOT a
   * PostalAddress. Madrid + the towns that appear in the real reseñas.
   * Keep in sync with GBP service area.
   */
  areaServed: ["Madrid", "Getafe", "Fuenlabrada", "Valdemoro", "Guadalajara"],
  sameAs: [
    "https://www.instagram.com/dosxm2/",
    "https://www.tiktok.com/@dosxm2",
  ],
} as const;

/** The two indexable routes — single source for the sitemap. */
export const ROUTES: ReadonlyArray<{ path: string; priority: number; changefreq: string }> = [
  { path: "/", priority: 1.0, changefreq: "monthly" },
  { path: "/conocenos", priority: 0.8, changefreq: "monthly" },
];
