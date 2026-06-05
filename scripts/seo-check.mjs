#!/usr/bin/env node
/**
 * seo-check — asserts the SEO checklist against rendered HTML (audit §3).
 *
 * Crawl rendered HTML → assert checklist → fail loudly. This is the
 * version-controlled core of the "agentic SEO audit" loop, runnable in CI.
 *
 * Usage:
 *   1. next build && next start            (serve the production SSR build)
 *   2. node scripts/seo-check.mjs          (defaults to http://localhost:3000)
 *      BASE_URL=https://dosxm2.com node scripts/seo-check.mjs   (against live)
 *
 * Asserts per page: exactly one <h1>; <title> present & ≤60 chars; meta
 * description present & ≤155; ABSOLUTE canonical; og:image + og:url + og:title;
 * twitter:card; at least one parseable JSON-LD block. Plus site-level:
 * robots.txt reachable with a Sitemap: line, sitemap.xml reachable with
 * absolute <loc>s.
 */

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const ROUTES = ["/", "/conocenos"];

let failures = 0;
const pass = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg) => {
  console.log(`  ❌ ${msg}`);
  failures++;
};
const check = (cond, ok, bad) => (cond ? pass(ok) : fail(bad));

async function getText(path) {
  const res = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
  return { status: res.status, body: await res.text(), headers: res.headers };
}

function attr(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

async function checkPage(path) {
  console.log(`\n▶ ${path}`);
  const { status, body } = await getText(path);
  check(status === 200, `200 OK`, `expected 200, got ${status}`);

  // exactly one <h1>
  const h1s = (body.match(/<h1[\s>]/gi) || []).length;
  check(h1s === 1, `exactly one <h1>`, `expected 1 <h1>, found ${h1s}`);

  // title ≤ 60
  const title = attr(body, /<title[^>]*>([^<]*)<\/title>/i);
  check(!!title, `<title> present`, `<title> missing`);
  if (title) {
    check(title.length <= 60, `title ≤60 chars (${title.length})`, `title too long (${title.length}): "${title}"`);
  }

  // description ≤ 155
  const desc = attr(body, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  check(!!desc, `meta description present`, `meta description missing`);
  if (desc) {
    check(desc.length <= 155, `description ≤155 chars (${desc.length})`, `description too long (${desc.length})`);
  }

  // absolute canonical
  const canonical = attr(body, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    || attr(body, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  check(!!canonical, `canonical present`, `canonical missing`);
  if (canonical) {
    check(/^https?:\/\//i.test(canonical), `canonical is absolute (${canonical})`, `canonical not absolute: "${canonical}"`);
  }

  // OG
  check(/property=["']og:image["']/i.test(body), `og:image present`, `og:image missing`);
  check(/property=["']og:url["']/i.test(body), `og:url present`, `og:url missing`);
  check(/property=["']og:title["']/i.test(body), `og:title present`, `og:title missing`);
  const ogUrl = attr(body, /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["']/i);
  if (ogUrl) check(/^https?:\/\//i.test(ogUrl), `og:url absolute`, `og:url not absolute: "${ogUrl}"`);

  // Twitter
  check(/name=["']twitter:card["']/i.test(body), `twitter:card present`, `twitter:card missing`);

  // JSON-LD parses
  const blocks = [...body.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  check(blocks.length > 0, `${blocks.length} JSON-LD block(s)`, `no JSON-LD found`);
  for (const [, raw] of blocks) {
    try {
      JSON.parse(raw.replace(/\\u003c/g, "<"));
      pass(`JSON-LD parses`);
    } catch (e) {
      fail(`JSON-LD does not parse: ${e.message}`);
    }
  }
}

async function checkRobots() {
  console.log(`\n▶ /robots.txt`);
  const { status, body } = await getText("/robots.txt");
  check(status === 200, `200 OK`, `expected 200, got ${status}`);
  check(/sitemap:\s*https?:\/\//i.test(body), `Sitemap: absolute URL present`, `Sitemap: line missing/relative`);
}

async function checkSitemap() {
  console.log(`\n▶ /sitemap.xml`);
  const { status, body } = await getText("/sitemap.xml");
  check(status === 200, `200 OK`, `expected 200, got ${status}`);
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1]);
  check(locs.length > 0, `${locs.length} <loc> entries`, `no <loc> entries`);
  check(locs.every((l) => /^https?:\/\//i.test(l)), `all <loc> absolute`, `some <loc> not absolute: ${locs.join(", ")}`);
}

async function main() {
  console.log(`SEO check against ${BASE_URL}`);
  try {
    for (const r of ROUTES) await checkPage(r);
    await checkRobots();
    await checkSitemap();
  } catch (e) {
    console.error(`\nFATAL: could not reach ${BASE_URL} — is the server running? (${e.message})`);
    process.exit(2);
  }
  console.log(`\n${failures === 0 ? "✅ All SEO checks passed" : `❌ ${failures} SEO check(s) failed`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
