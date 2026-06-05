# DOSXM2 — SEO Audit Report (v1)

**Report date:** 2026-06-05
**Audit plan:** [prds/seo_audit_v1.md](seo_audit_v1.md)
**Scope executed:** All **in-repo** P0→P2 fixes from the plan, verified against a
production SSR build (`next build && next start`). **Live-site / external** items
(GSC, GBP, CrUX field data, citations) require the deployed URL + accounts and
are listed as remaining owner work in §5.
**Canonical host (owner decision):** apex **`https://dosxm2.com`** ·
**service-area business** (no postal address; `areaServed` used) · FAQ block
deferred · GA4 scaffolded behind an env var.

---

## 1. Executive summary

The site had **zero structured data, no robots.txt/sitemap, relative canonicals,
and missing OG/Twitter tags** — the four highest-leverage technical gaps for a
local lead-gen site. All are now fixed in code and verified in a production
build. A new version-controlled `seo-check` asserts the whole checklist and runs
green.

| Severity | Found | Fixed in this pass | Remaining (needs live/owner) |
|---|---|---|---|
| **P0** | 5 | 4 (robots, sitemap, canonicals, JSON-LD) | 1 — GBP optimization, canonical-host DNS/redirect verify |
| **P1** | 7 | 4 (OG/Twitter, `APP_URL` wired, GA4 scaffold, asset-caching headers) | 3 — NAP/citations, CWV **field** data, image opt + `next/image` migration |
| **P2** | 5 | 3 (security headers, 404, title/desc length) | 2 — full axe a11y pass, CSP |
| **P3** | 1 | 0 (correctly out of scope) | hreflang only if LatAm split added |

**Headline wins shipped**
- **`RealEstateAgent` + `Organization` + `WebSite` JSON-LD** (homepage) and
  `Organization` + `WebSite` + `BreadcrumbList` (/conocenos) — the single
  biggest local on-site gap. **No self-serving review schema** (policy-correct).
- **robots.txt + sitemap.xml** as SSR routes with **absolute** URLs from one
  `ROUTES` source.
- **Absolute canonicals + og:url** + full **Open Graph + Twitter** cards on both
  pages, centralized in one `<Seo>` component so the drift can't recur.
- **Baseline security headers** + **CDN caching** for `/v4` assets, **GA4 +
  conversion events** scaffolded, branded **404**. (Image-optimization flag
  deferred to land with the `next/image` migration — see §2 J and §5.8.)

**Verification:** production build compiles clean; `npm run seo:check` → **all
checks pass**; type-check clean on all touched source; test suite green except
**2 pre-existing, unrelated v4 CSS-source test failures** (proven pre-existing on
clean HEAD — this work touches zero CSS).

---

## 2. Findings & fixes

Evidence = `file:line` (pre-fix) → resolution. Status: ✅ shipped · ⏳ owner/live.

| ID | Area | Sev | Evidence (before) | Fix | Status |
|---|---|---|---|---|---|
| A | robots.txt absent | P0 | none in repo | [src/pages/robots.txt.tsx](src/pages/robots.txt.tsx) — SSR, absolute `Sitemap:` | ✅ |
| B | sitemap.xml absent | P0 | none in repo | [src/pages/sitemap.xml.tsx](src/pages/sitemap.xml.tsx) — absolute `<loc>`s from `ROUTES` | ✅ |
| C | Relative canonicals | P0 | `index.tsx:93` `href="/"`; `conocenos.tsx:37` `href="/conocenos"` | `<Seo>` emits `absUrl(path)` | ✅ |
| D | No JSON-LD | P0 | none anywhere | [src/lib/jsonld.ts](src/lib/jsonld.ts) `RealEstateAgent`/`Organization`/`WebSite`/`BreadcrumbList` via native `<script>` | ✅ |
| D2 | Invalid logo URL in JSON-LD | P1 | logo filename has spaces → `…/Nuevo Logo grande.png` | `absUrl` now `encodeURI`s internal paths → `Nuevo%20Logo%20grande.png` | ✅ |
| E | Canonical host (apex/www, http→https) | P0 | unverified on live | Decision: apex `https://dosxm2.com`; **verify the live 301 chain + DNS in Firebase** | ⏳ |
| F | Google Business Profile | P0 | unverified | Off-site; see §5 checklist | ⏳ |
| G | OG/Twitter incomplete | P1 | homepage missing `og:image`/`og:url`/all Twitter; `/conocenos` relative og:image | `<Seo>` adds absolute og:url/og:image + `og:site_name`/`og:image:alt` + full Twitter card | ✅ |
| H | `NEXT_PUBLIC_APP_URL` unused | P1 | declared in `.env.example`, never read | [src/lib/seo.ts](src/lib/seo.ts) `SITE_ORIGIN` reads it (fallback apex) | ✅ |
| I | CWV — cold start / TTFB | P1 | `apphosting.yaml minInstances: 0` | Documented; needs **field** data before flipping to `1` (§5) | ⏳ |
| J | Images unoptimized on App Hosting | P1 | raw `<img>`/`<video>`; opt off by default | **Deferred** — enabling `images.unoptimized:false` now has no benefit (only 2 logos use `next/image`) but risks breaking those logos via the App Hosting optimizer. Land it WITH J2 and verify on deploy. | ⏳ |
| J2 | Raw `<img>` → `next/image` migration | P1 | founder/property `<img>` | **Deferred** — layout-risky against tuned V5 CSS + tests; see §5 | ⏳ |
| K | NAP consistency | P1 | phones/emails in code, no address | Service-area model set in JSON-LD `areaServed`; align GBP + citations (§5) | ⏳ |
| L | Title/desc length | P2 | homepage title 73 chars; `/conocenos` desc 171 chars | Title→49, conócenos desc→153, homepage desc 113 (all asserted by `seo:check`) | ✅ |
| P | No security headers | P2 | no `headers()` | HSTS (1y, includeSubDomains, **no preload** — preload left as an explicit owner decision), nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy | ✅ |
| P2 | Content-Security-Policy | P2 | none | **Deferred** — needs live validation vs next/font, Lystos, GA, IG/TikTok (§5) | ⏳ |
| Q | GA4 not installed | P1 | none | [src/lib/analytics.ts](src/lib/analytics.ts) + `<Analytics>`; events: WhatsApp/phone/form; no-op until `NEXT_PUBLIC_GA_ID` set | ✅ (scaffold) |
| R | No custom 404 | P2 | none | [src/pages/404.tsx](src/pages/404.tsx) branded, `noindex`, real 404 status | ✅ |
| S | Accessibility-as-SEO | P2 | partial | Alt/labels already strong; **full axe pass** still owed (§5) | ⏳ |

---

## 3. What changed (architecture)

Single source of truth, exactly as the plan's §5 prescribed:

```
src/lib/seo.ts          SITE_ORIGIN (env-driven), absUrl() (encodes spaces),
                        SITE constants (phones/emails/areaServed/sameAs), ROUTES
src/lib/jsonld.ts       organization()/website()/realEstateAgent()/graph()
                        builders; homepageGraph(), conocenosGraph(). NO review schema.
src/components/Seo.tsx   <Head> wrapper: title, desc, viewport, robots,
                        absolute canonical + OG (og:url/og:image/og:image:alt) +
                        Twitter card, icons, optional preload, JSON-LD (<-escaped)
src/lib/analytics.ts +  GA4 scaffold (no-op until NEXT_PUBLIC_GA_ID); pageview +
src/components/Analytics.tsx   whatsapp_click / phone_click / form_submit events
src/pages/robots.txt.tsx + sitemap.xml.tsx   SSR routes, absolute URLs
src/pages/404.tsx        branded noindex dead-end
scripts/seo-check.mjs    asserts the checklist vs rendered HTML; `npm run seo:check`
```

Pages now render `<Seo …/>` with page-specific props + the right JSON-LD node;
`_app.tsx` mounts `<Analytics>` and reports SPA pageviews.

---

## 4. Before / after (lab, from the production SSR build)

`npm run seo:check` against `next start` (`NEXT_PUBLIC_APP_URL=https://dosxm2.com`):

| Check | `/` before | `/` after | `/conocenos` before | `/conocenos` after |
|---|---|---|---|---|
| Canonical | relative `/` | ✅ `https://dosxm2.com` | relative | ✅ `https://dosxm2.com/conocenos` |
| og:url / og:image | ❌ missing | ✅ absolute | relative img | ✅ absolute |
| Twitter card | ❌ none | ✅ summary_large_image | ❌ none | ✅ |
| JSON-LD | ❌ none | ✅ 3-node @graph, parses | ❌ none | ✅ 3-node @graph, parses |
| Title length | 73 | ✅ 49 | 18 | ✅ 41 |
| Description length | 113 | ✅ 113 | **171** | ✅ 153 |
| robots.txt / sitemap.xml | ❌ / ❌ | ✅ absolute / ✅ 2 absolute locs | — | — |
| Security headers | none | ✅ HSTS(1y)+nosniff+referrer+frame+permissions | | |
| Image optimization | next/image default (logos already optimized; live App Hosting behavior unverified) | **unchanged by this work** — explicit config + raw-`<img>` migration deferred to land & verify together | | |

> Lighthouse/PSI **lab + field** scores still need to be captured against the
> deployed URL (no headless Chrome in this environment) — see §5.

**Rendered homepage JSON-LD** (validated as parseable; run through Rich Results
Test on the live URL post-deploy):

```jsonc
{ "@context":"https://schema.org", "@graph":[
  { "@type":"Organization", "@id":".../#organization", "logo":".../Nuevo%20Logo%20grande.png", … },
  { "@type":"WebSite", "@id":".../#website", "publisher":{"@id":".../#organization"} },
  { "@type":"RealEstateAgent", "@id":".../#realestateagent",
    "telephone":["+34 667 00 66 62","+34 674 52 74 10"],
    "areaServed":[Madrid, Getafe, Fuenlabrada, Valdemoro, Guadalajara],
    "founder":[Pablo Dupont, Borja Gallego], "sameAs":[IG, TikTok] } ] }
```

---

## 5. Remaining work (owner / live-site — cannot be done from the repo)

**Deploy first** (`git push origin main`), then:

1. **Canonical host (P0):** in Firebase App Hosting, point the apex
   `dosxm2.com` custom domain, confirm `www`→apex and `http`→`https` are
   **single-hop 301s**, and set env `NEXT_PUBLIC_APP_URL=https://dosxm2.com`.
   Confirm the exact TLD (`.com` vs `.es`).
2. **Google Search Console (P0):** verify property, submit `/sitemap.xml`,
   URL-Inspect both routes (confirm rendered HTML + indexed), watch Enhancements
   for the structured data, request indexing.
3. **Rich Results Test (P0):** run both live URLs; confirm `RealEstateAgent`
   eligibility and **no review-snippet warnings**.
4. **Google Business Profile (P0):** category *Inmobiliaria*, service area =
   the 5 `areaServed` towns, hours, photos, WhatsApp/call button, seed + respond
   to reviews (this — not our JSON-LD — is the source of Maps stars).
5. **NAP + citations (P1):** keep phones byte-identical across footer / JSON-LD /
   GBP; claim idealista, Fotocasa, pisos.com, Bing Places, Apple Business Connect;
   add their profile URLs to `SITE.sameAs` in `src/lib/seo.ts`.
6. **GA4 (P1):** create the property, set `NEXT_PUBLIC_GA_ID` in App Hosting env,
   **add a GDPR consent gate** before the loader (Spain requires prior consent),
   mark `whatsapp_click`/`phone_click`/`form_submit` as conversions, link GA4↔GSC.
7. **Core Web Vitals (P1):** capture PSI/CrUX **field** data (mobile, p75);
   only then decide `apphosting.yaml minInstances: 1` if TTFB hurts LCP.
8. **Image optimization + `next/image` migration (P1):** enable
   `images: { unoptimized: false, formats: ["image/avif","image/webp"] }` in
   `next.config.ts` **and** migrate hero poster / founder / property `<img>`
   with `sizes` + `priority` on the LCP image **only**, as ONE change — then
   **verify on the live deploy that the header logos still load** (the App
   Hosting image optimizer must be provisioned). Both were deferred here because
   the flag alone risks breaking the working logos for no benefit, and the
   migration is layout-risky against the tuned V5 CSS + visual tests.
9. **On-page local intent in hero copy (P1, owner/design):** the title, JSON-LD
   and meta now carry "inmobiliaria en Madrid", but the homepage `<h1>`
   ("Detrás de cada casa hay una historia") is brand-evocative, not keyword-
   local. Hero copy wasn't rewritten here (it's a design/brand-voice decision +
   animated styling). Consider weaving Madrid/founder/served-town intent into the
   hero `<h1>`/subhead or a nearby `<h2>` if you want that on-page signal.
10. **CSP (P2)** and **full axe-core a11y pass (P2):** add a Content-Security-Policy
   validated against next/font, the Lystos valorador, GA4, and IG/TikTok; run axe
   on both routes for heading order, contrast, focus, form labels.

---

## 6. Ongoing monitoring

- `npm run seo:check` after every deploy (and wire into CI alongside `vitest`).
- Monthly: GSC (coverage, CWV, queries), GBP (reviews/insights), CrUX trend,
  NAP/citation drift.
- Re-run the full audit whenever a route is added or the design is reworked.

---

## 7. Notes on test state

- The full `vitest` suite is green **except two pre-existing failures** in v4
  CSS-source tests (`v4-typography.test.ts` "HeroSplit .sub … 1rem" and
  `V4ConocenosJuntos.css.test.ts` "convergence translate to Y axis"). Both were
  confirmed failing on a clean `HEAD` with all SEO changes stashed; this work
  modifies **no CSS**.
- `V4ConocenosPage.test.tsx` "page metadata" was **updated** to assert the now-
  **absolute** canonical/OG URLs (it previously hard-coded the relative-URL bug).
