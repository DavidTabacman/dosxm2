import Head from "next/head";
import { SITE, absUrl } from "@/lib/seo";

export interface SeoProps {
  /** SERP/browser title. Keep ≤ ~60 chars to avoid truncation. */
  title: string;
  /** Meta description. Keep ≤ ~155 chars, unique per page, with a local hook. */
  description: string;
  /** Root-relative path of THIS page (e.g. "/" or "/conocenos"). Drives the
   *  absolute canonical and og:url. */
  path: string;
  /** Per-page OG/Twitter image (root-relative or absolute). Defaults to the
   *  brand share card. Should be ≥1200×630. */
  ogImage?: string;
  ogImageAlt?: string;
  /** og:type — "website" (default) for both routes today. */
  ogType?: "website" | "article" | "profile";
  /** One JSON-LD object (typically a @graph). Rendered as a native
   *  <script type="application/ld+json"> with XSS-safe `<` escaping. */
  jsonLd?: Record<string, unknown>;
  /** Optional <link rel="preload" as="image"> for the page's LCP image. */
  preloadImage?: { href: string; type?: string };
  /** Emit robots noindex (not used on the two live routes). */
  noindex?: boolean;
}

/**
 * Centralized <Head> for every page — the single source that fixes the
 * relative-canonical / missing-OG / missing-Twitter drift the SEO audit
 * found (prds/seo_audit_v1.md §4.2–4.3). Absolute canonical + og:url,
 * full OG + Twitter cards, icons, viewport, and optional JSON-LD all live
 * here so pages can't forget a tag.
 */
export default function Seo({
  title,
  description,
  path,
  ogImage = SITE.ogImage,
  ogImageAlt,
  ogType = "website",
  jsonLd,
  preloadImage,
  noindex = false,
}: SeoProps) {
  const canonical = absUrl(path);
  const image = absUrl(ogImage);
  const imageAlt = ogImageAlt ?? title;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta httpEquiv="content-language" content="es" />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Canonical — ABSOLUTE (relative canonicals are ignored by Google). */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={SITE.twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {preloadImage && (
        <link
          rel="preload"
          as="image"
          href={preloadImage.href}
          type={preloadImage.type}
          fetchPriority="high"
        />
      )}

      {jsonLd && (
        <script
          type="application/ld+json"
          // XSS-safe: escape `<` per Next.js JSON-LD guidance.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </Head>
  );
}
