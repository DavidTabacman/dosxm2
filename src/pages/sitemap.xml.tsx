import type { GetServerSideProps } from "next";
import { ROUTES, absUrl } from "@/lib/seo";

/**
 * Dynamic sitemap.xml (Pages Router SSR route) built from the single ROUTES
 * source in lib/seo.ts, with mandatory ABSOLUTE <loc> URLs (audit §4.1). New
 * indexable routes are picked up by adding them to ROUTES — no static file to
 * forget to update. Submit this URL in Google Search Console.
 */
function buildSitemap(): string {
  const urls = ROUTES.map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${absUrl(path)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800");
  res.write(buildSitemap());
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
