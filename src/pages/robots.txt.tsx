import type { GetServerSideProps } from "next";
import { absUrl } from "@/lib/seo";

/**
 * Dynamic robots.txt (Pages Router SSR route). Emitting it from code — rather
 * than a static public/robots.txt — keeps the absolute Sitemap: URL in sync
 * with NEXT_PUBLIC_APP_URL across environments (audit §4.1).
 *
 * robots.txt controls CRAWLING, not indexing — we Allow everything and point
 * to the sitemap; deindexing is handled via noindex/canonical, never here.
 */
function buildRobots(): string {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${absUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800");
  res.write(buildRobots());
  res.end();
  return { props: {} };
};

export default function Robots() {
  return null;
}
