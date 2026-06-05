/**
 * JSON-LD builders for DOSXM2 (schema.org).
 *
 * Rendered as a native <script type="application/ld+json"> via <Seo> — NOT
 * next/script (Next.js explicitly recommends a native tag for structured data,
 * since JSON-LD is data, not executable code). See prds/seo_audit_v1.md §4.4.
 *
 * POLICY (§4.4): do NOT emit self-serving `aggregateRating`/`Review` markup.
 * Google rules pages where the reviewed entity controls the reviews about
 * itself ineligible for review stars — that includes our on-page reseñas and
 * the "9/10 nos recomiendan" metric. Review stars come from Google Business
 * Profile, not from this file. The reseñas stay as on-page social proof only.
 *
 * Types are kept as plain objects (no schema-dts dependency to install); the
 * shapes below follow Google's LocalBusiness/RealEstateAgent guidance.
 */
import { SITE, absUrl } from "./seo";

type JsonLd = Record<string, unknown>;

/** Stable @id anchors so nodes can reference each other across the graph. */
export const NODE_ID = {
  organization: `${absUrl("/")}/#organization`,
  website: `${absUrl("/")}/#website`,
  realEstateAgent: `${absUrl("/")}/#realestateagent`,
} as const;

/** Brand knowledge entity. */
export function organization(): JsonLd {
  return {
    "@type": "Organization",
    "@id": NODE_ID.organization,
    name: SITE.name,
    legalName: SITE.legalName,
    url: absUrl("/"),
    logo: absUrl("/Nuevo Logo grande.png"),
    image: absUrl(SITE.ogImage),
    email: SITE.emails[0],
    telephone: SITE.telephones[0],
    sameAs: [...SITE.sameAs],
  };
}

/** WebSite node (enables sitelinks/site-name handling). */
export function website(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": NODE_ID.website,
    url: absUrl("/"),
    name: SITE.name,
    inLanguage: "es-ES",
    publisher: { "@id": NODE_ID.organization },
  };
}

/**
 * Primary local entity — most specific LocalBusiness subtype for the use case.
 * Service-area business: `areaServed` instead of a PostalAddress.
 */
export function realEstateAgent(): JsonLd {
  return {
    "@type": "RealEstateAgent",
    "@id": NODE_ID.realEstateAgent,
    name: SITE.name,
    url: absUrl("/"),
    image: absUrl(SITE.ogImage),
    logo: absUrl("/Nuevo Logo grande.png"),
    telephone: SITE.telephones,
    email: SITE.emails,
    priceRange: "€€",
    inLanguage: "es-ES",
    areaServed: SITE.areaServed.map((name) => ({ "@type": "City", name })),
    sameAs: [...SITE.sameAs],
    parentOrganization: { "@id": NODE_ID.organization },
    founder: [
      {
        "@type": "Person",
        name: "Pablo Dupont",
        jobTitle: "Cofundador",
        worksFor: { "@id": NODE_ID.realEstateAgent },
      },
      {
        "@type": "Person",
        name: "Borja Gallego",
        jobTitle: "Cofundador",
        worksFor: { "@id": NODE_ID.realEstateAgent },
      },
    ],
  };
}

/**
 * Compose a full @graph for a page. Pass the per-page nodes you want; they're
 * wrapped in one schema.org graph so the crawler sees a single connected
 * entity set rather than disjoint blobs.
 */
export function graph(...nodes: JsonLd[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/** Homepage: the site-wide entity graph. */
export function homepageGraph(): JsonLd {
  return graph(organization(), website(), realEstateAgent());
}

/** /conocenos: brand + a breadcrumb back to home. */
export function conocenosGraph(): JsonLd {
  return graph(organization(), website(), {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: "Conócenos", item: absUrl("/conocenos") },
    ],
  });
}
