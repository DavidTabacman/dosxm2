# DOSXM2 — Complete SEO Audit Plan (v1)

**Plan date:** 2026-06-05
**Author:** Engineering (to be executed with Claude Code)
**Scope:** Full SEO audit of the live site — both routes (`/` homepage, `/conocenos`), the
Pages-Router infrastructure (`_app.tsx`, `_document.tsx`, `next.config.ts`, `apphosting.yaml`),
and off-page/local-SEO foundations (Google Business Profile, NAP, citations).
**Stack under audit:** Next.js 16.2.1 **Pages Router**, React 19, TypeScript, CSS Modules,
`next/font`, **Firebase App Hosting (SSR)**. Spanish (`es-ES`), domain `dosxm2.com` (TLD TBC).
**Use case:** Local lead-gen landing site for a Madrid real-estate agency. Conversion =
WhatsApp / phone to the two founders. Stays ~2 pages — **not** a content/blog site.
**Methodology:** Verified web research (Google Search Central, web.dev, Firebase docs,
Ahrefs/Semrush/BrightLocal, next-sitemap) + full source read of the repo. All claims below were
adversarially fact-checked; citations in §11.

> **Why this matters:** for a 2-page local lead-gen site, SEO success is **~80% local SEO +
> technical hygiene, ~20% on-page**. We are not trying to rank a blog — we are trying to (a) get
> both pages cleanly indexed, (b) win the Madrid local pack / Maps for "inmobiliaria Madrid" and
> founder-name queries, and (c) not leak conversions to slow CWV. This plan is weighted accordingly.

---

## 1. Severity framework

| Priority | Meaning | SLA |
|---|---|---|
| **P0** | Blocks indexing, sends wrong signals to Google, or is a policy risk. Ships today as a real defect. | This sprint |
| **P1** | Materially limits ranking/CTR/Maps visibility or CWV. | This sprint |
| **P2** | Best-practice gap; measurable but secondary. | Next sprint |
| **P3** | Polish / monitoring / nice-to-have. | Backlog |

Each finding is scored on **Impact** (ranking/visibility/CTR effect) × **Effort** (eng time).
Fix order = Impact-desc, then Effort-asc.

---

## 2. Audit scorecard (current state from source read)

Pre-audit triage from reading the repo. The full audit confirms/expands these with live data.

| # | Area | Current state | Sev |
|---|---|---|---|
| A | **robots.txt** | ❌ Absent | **P0** |
| B | **sitemap.xml** | ❌ Absent | **P0** |
| C | **Canonical URLs** | ⚠️ Relative (`/`, `/conocenos`) — must be absolute | **P0** |
| D | **Structured data (JSON-LD)** | ❌ None anywhere | **P0** |
| E | **Canonical host (apex vs www, http→https)** | ❓ Unverified on live domain | **P0** |
| F | **Google Business Profile** | ❓ Exists but optimization unverified | **P0** |
| G | **OG/Twitter cards** | ⚠️ Homepage missing `og:image`, `og:url`, all Twitter tags; relative OG image on `/conocenos` | **P1** |
| H | **`NEXT_PUBLIC_APP_URL`** | ⚠️ Declared in `.env.example`, **never used in code** | **P1** |
| I | **Core Web Vitals** | ❓ Hero videos + fonts + carousel — needs field+lab measurement | **P1** |
| J | **Images** | ⚠️ ~all raw `<img>`/`<video>`; `next/image` optimization off by default on App Hosting | **P1** |
| K | **NAP consistency** | ⚠️ Phones/emails in code; no address; consistency with GBP unverified | **P1** |
| L | **Title/meta quality** | ✅ Present & decent; verify length/pixel width | **P2** |
| M | **Headings (h1/h2)** | ✅ One `h1`/page, sane hierarchy | **P2** |
| N | **`lang` attribute** | ✅ `lang="es"` in `_document.tsx` | OK |
| O | **hreflang / i18n** | ➖ Single locale — only needed if `es-419`/LatAm split is ever wanted | **P3** |
| P | **Security headers** | ❓ No `headers()` in `next.config.ts`; verify on live | **P2** |
| Q | **GA4 / measurement** | ❌ Not installed | **P1** |
| R | **404 / error handling** | ❓ No custom `404.tsx`; verify status codes | **P2** |
| S | **Accessibility-as-SEO** | ⚠️ Alt text mostly present; full axe pass needed | **P2** |

---

## 3. Tooling — what runs in-repo vs. live (Claude Code can drive all of these)

**In-repo / local (Claude Code runs directly, no external account):**
- `next build` + inspect emitted HTML for SSR completeness (view-source must contain content, not just a JS shell).
- **Lighthouse** programmatic / `@lhci/cli` against `next start` (or `next build && next start`) — Performance, SEO, Accessibility, Best-Practices, PWA.
- **axe-core** (via `@axe-core/cli` or Playwright) — accessibility-as-SEO.
- **html-validate** — markup validity.
- **Schema validation** — paste rendered JSON-LD into Google Rich Results Test / Schema.org validator; locally lint with `schema-dts` types at build time.
- **Broken-link check** — `linkinator` or `lychee` against the local server.
- A small **`scripts/seo-check.mjs`** that fetches each route's rendered HTML and asserts: exactly one `<h1>`, `<title>` present & ≤ ~60 chars, `meta[name=description]` present & ≤ ~155 chars, **absolute** canonical, `og:image`/`og:url` present, JSON-LD parses and validates. Wire into `npm test`.

**Live-site / external (need the deployed URL + accounts):**
- **Google Search Console** — Coverage/Pages report, URL Inspection (rendered HTML + indexing status), Sitemaps, Core Web Vitals (field/CrUX), Enhancements (structured data), mobile usability.
- **PageSpeed Insights / CrUX** — real-user field data at the 75th percentile (lab ≠ field).
- **Google Business Profile** dashboard — categories, NAP, photos, reviews, Q&A, posts.
- **Rich Results Test** — live-URL structured-data eligibility.
- **Local citation / NAP audit** — BrightLocal-style consistency check across directories (idealista, Fotocasa, Google, Bing Places, Spanish directories).

> **Note on agentic SEO:** the published "Claude Code SEO audit" playbooks all reduce to the same
> loop — *crawl rendered HTML → assert checklist → diff against Google's docs → produce prioritized
> findings*. Our `scripts/seo-check.mjs` + Lighthouse CI is exactly that, version-controlled.

---

## 4. The audit — by category

Each item: **what to verify → current repo state → fix (Pages-Router + Firebase specific)**.

### 4.1 Crawlability & Indexability — **P0**

- **robots.txt** — *Absent.* Google won't penalize a missing robots.txt, but we want explicit
  `Allow` + a `Sitemap:` directive. **Fix:** serve a real `robots.txt`. In the Pages Router the
  clean options are (a) static `public/robots.txt`, or (b) dynamic. Recommended: `next-sitemap`
  (supports Pages Router; generates `robots.txt` + `sitemap.xml` at build) **or** a tiny
  `pages/robots.txt.ts`-style route. Must reference the **absolute** sitemap URL.
  ⚠️ robots.txt controls *crawling*, **not** indexing — never use it to deindex; use `noindex`/canonical for that.
- **sitemap.xml** — *Absent.* **Fix:** `next-sitemap` with mandatory **absolute** `siteUrl`
  (`https://dosxm2.com`). For 2 URLs a static sitemap is fine too, but `next-sitemap` keeps it
  honest as routes change. Submit in GSC.
- **Rendering crawlability** — Verified principle: Google must be able to fetch the resources
  (CSS/JS/images) needed to render. SSR on App Hosting already emits real HTML — **confirm** via
  `view-source` and GSC URL Inspection "rendered HTML" that hero/contact content is in the DOM and
  not blocked. Ensure no critical content is hidden behind `prefers-reduced-motion`/JS-only paths
  in a way that strips it from SSR output.
- **Indexability** — Confirm neither page emits `noindex`; confirm both are in the sitemap; submit
  via GSC URL Inspection → Request Indexing after fixes deploy.

### 4.2 Canonicalization & canonical host — **P0**

- **Relative canonicals are wrong.** `index.tsx:93` → `<link rel="canonical" href="/">` and
  `conocenos.tsx:37` → `href="/conocenos"`. Google needs **absolute** canonical URLs;
  relative ones are ambiguous/ignored. Same applies to `og:url`/`og:image`.
  **Fix:** introduce a `siteUrl` helper that reads `NEXT_PUBLIC_APP_URL` (already in `.env.example`,
  currently unused) and prefixes every canonical/OG URL. Set `NEXT_PUBLIC_APP_URL=https://dosxm2.com`
  in App Hosting env. Build a small `<Seo>` component (see §5) so this is centralized.
- **One canonical host.** *Open decision:* **apex `dosxm2.com` vs `www.dosxm2.com`** — pick one,
  301 the other. Also force `http→https` and strip trailing-slash duplicates. Verify the live
  redirect chain returns a single 301 hop (no chains). Configure the custom domain in Firebase App
  Hosting and confirm the non-canonical host redirects.
- `next.config.ts` already 301s `/v5`, `/v4`, `/v4/conocenos` → good (kills duplicate/legacy URLs).
  Verify these resolve as single-hop 301s on live.

### 4.3 Metadata: titles, descriptions, social — **P1/P2**

- **Titles** — Homepage and `/conocenos` both have unique, descriptive titles ✅. Verify pixel/length
  (~50–60 chars) so they don't truncate; the homepage title is long — measure SERP rendering.
- **Descriptions** — Present and good ✅; keep ≤ ~155 chars, each unique, with a local hook
  ("Madrid").
- **Open Graph** — *Homepage missing `og:image` and `og:url`.* `/conocenos` has a **relative**
  `og:image` (`/v4/founders/together.webp`) — must be absolute, and OG images should be ≥1200×630.
  **Fix:** add absolute `og:url`, a dedicated 1200×630 `og:image` per page (brand + tagline),
  `og:image:alt`, `og:site_name`.
- **Twitter Card** — *Absent on both.* Add `twitter:card=summary_large_image`, `twitter:title`,
  `twitter:description`, `twitter:image`.
- Centralize all of the above in a reusable `<Seo>` component to prevent drift (§5).

### 4.4 Structured data / JSON-LD — **P0** (highest-leverage local win)

- *None present anywhere.* This is the single biggest on-site local-SEO gap.
- **Type:** Google recommends the **most specific** `LocalBusiness` subtype → **`RealEstateAgent`**.
- **Where:** Site-wide entity on the homepage. **Render JSON-LD as a native `<script type="application/ld+json">`** (Next.js explicitly recommends this and advises **against** `next/script` for JSON-LD). In the Pages Router, inject via `next/head` using
  `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}`.
- **Properties to include:** `@type: RealEstateAgent`, `name`, `url` (absolute), `image`/`logo`,
  `telephone`, `email`, `areaServed` (Madrid + the towns in the reseñas: Getafe, Fuenlabrada,
  Valdemoro…), `priceRange`, `sameAs` (GBP, Instagram, idealista profile, etc.), `founder` ×2
  (Pablo, Borja as `Person`), and **`address`** (`PostalAddress`) — see NAP caveat below.
  Google's only strictly *required* LocalBusiness property is `name`, but `address` + `telephone` +
  `url` + `geo` are what actually power Maps/local relevance — include them.
- **Add `WebSite` + `Organization`** nodes (with `logo`) for the brand knowledge entity; optionally
  a `BreadcrumbList` on `/conocenos`.
- ⚠️ **Critical policy finding — do NOT add self-serving review/aggregateRating schema.** Google:
  *pages where the reviewed entity controls the reviews about itself (LocalBusiness/Organization)
  are **ineligible** for the star review feature* — this includes embedded Google/Facebook review
  widgets. So our real reseñas in `resenasData.ts` and the "9/10 nos recomiendan" metric **must not**
  be marked up as `aggregateRating`/`Review` for rich-result purposes — it earns no stars and risks a
  structured-data warning. **Review stars come from Google Business Profile**, not our JSON-LD. Keep the
  reseñas as on-page social-proof content (good for conversion + E-E-A-T), just unmarked.
- **Validate** every JSON-LD block in Rich Results Test + Schema validator; add a build-time
  `schema-dts` type guard so malformed schema fails CI.

### 4.5 Local SEO (the core of this site's strategy) — **P0/P1**

This is where a 2-page agency site actually wins. On-site is necessary but **GBP is the engine.**

- **Google Business Profile — P0:**
  - Primary category **`Inmobiliaria` / Real estate agency**; add relevant secondary categories.
  - Complete NAP, service area (Madrid + the towns served), hours, description with local keywords,
    high-quality photos (founders, sold properties), enable messaging/WhatsApp + call button.
  - Seed and respond to **reviews** (this is the legitimate path to star ratings in Maps/local pack).
  - Use **Google Posts** for "Historias vendidas" — free, ongoing local signal.
- **NAP consistency — P1:** the site exposes phones (`+34 667006662`, `+34 674527410`) and emails
  but **no postal address**. Decide whether DOSXM2 is a **service-area business** (hide address,
  set `areaServed`) or has a storefront (show address). Whatever is chosen, it must be **byte-identical**
  across the site footer, JSON-LD, GBP, and all citations.
- **Local citations — P1:** create/claim consistent listings on the Spanish real-estate + local
  directories that matter for "inmobiliaria Madrid": **idealista, Fotocasa, pisos.com**, Bing Places,
  Apple Business Connect, Páginas Amarillas, and general directories. Same NAP everywhere. Link
  `sameAs` in JSON-LD.
- **On-page local intent — P1:** even at 2 pages, ensure the homepage `h1`/copy/`title` carry the
  primary local intent ("inmobiliaria en Madrid"), the founder names (brand queries convert highest),
  and the served towns. Add a localized FAQ block (`FAQPage` schema is eligible) answering
  "cuánto tarda en venderse un piso en Madrid", "comisión inmobiliaria", etc. — captures long-tail
  local intent without becoming a blog.
- **Spanish-market note:** idealista/Fotocasa dominate Spanish real-estate discovery; a profile +
  consistent NAP there is closer to "local SEO" than to listings. Prioritize them alongside GBP.

### 4.6 Core Web Vitals & performance — **P1**

- **Thresholds (verified, assessed at the 75th percentile of field data):**
  - **LCP ≤ 2.5 s** (good)
  - **INP < 200 ms** (good) — **INP replaced FID** as the responsiveness vital in **March 2024**.
  - **CLS < 0.1** (good)
- **Measure both lab and field:** Lighthouse / PSI for lab; **CrUX + GSC Core Web Vitals report**
  for field (the one Google ranks on). Field data needs traffic — another reason to ship GA4/GSC early.
- **Site-specific risks to audit:**
  - **Hero videos** (`hero-left.mp4`, `hero-right.mp4`, mobile variant) — large autoplay media is
    the top LCP/bandwidth risk. Verify `poster` (already present), `preload="none"`/lazy, mobile
    variant served by media query, and that the **LCP element is a fast poster image, not the video**.
    Don't let video block LCP.
  - **`next/font`** (Montserrat, Poppins, Fraunces, Inter) — already uses `display: "swap"` ✅;
    confirm fonts are self-hosted by `next/font` (no render-blocking external CSS) and **subset**;
    4 families is a lot — audit whether all weights/styles are used (unused weights = wasted bytes
    + potential CLS).
  - **Embla carousel** + scroll/intersection-observer hooks — audit JS execution for **INP**; ensure
    handlers are passive/throttled and don't cause long tasks on interaction.
  - **Images** — see §4.7; unoptimized `<img>` hurts LCP/bandwidth.
  - Reserve space for media (width/height/aspect-ratio) to keep **CLS < 0.1**.
- Run Lighthouse on **mobile** profile (mobile is the ranking profile) and against the **live** SSR
  build, not just dev.

### 4.7 Images — **P1**

- ~All media is **raw `<img>`/`<video>`**; only the two header logos use `next/image`.
- ⚠️ **Firebase App Hosting nuance:** Next.js built-in image optimization is **disabled by default on
  App Hosting** — re-enable with `images: { unoptimized: false }` in `next.config.ts` **or** a custom
  loader. **This is the opposite flag from the `unoptimized: true` that CLAUDE.md forbids** (that one
  is for static export and would break the App Hosting SSR build) — so there is no conflict, but the
  two must not be confused.
- **Fix path:** enable optimization, migrate hero/founder/property `<img>` to `next/image` with
  correct `sizes`, `priority` on the LCP image only, explicit dimensions, and modern formats
  (WebP/AVIF — several assets already ship `.webp`). Keep `<video>` raw but lazy.
- Verify every image has meaningful **`alt`** (founder portraits already do ✅) — alt = accessibility +
  image SEO.

### 4.8 Mobile-friendliness — **P1**

- Verified nuance: **mobile-first indexing is in effect**, but mobile-friendliness is **not a hard
  gate on indexing** — it *is* a major ranking + UX/CWV factor. (Common "you won't be indexed if not
  mobile-friendly" advice was **refuted** in research — don't repeat it.)
- Cross-reference the existing `prds/audit_v4_mobile.md` findings; ensure no P0 mobile defects remain
  on the live V5 homepage. Run Lighthouse mobile + GSC mobile usability.

### 4.9 HTTPS / security / headers — **P2**

- Confirm HTTPS enforced + valid cert on the custom domain (App Hosting provisions this).
- `next.config.ts` has no `headers()`. Add baseline security headers (`Strict-Transport-Security`,
  `X-Content-Type-Options`, `Referrer-Policy`, a sensible `Content-Security-Policy`). Best-practice +
  small Lighthouse "Best Practices" win. Verify App Hosting doesn't strip them.

### 4.10 Caching / Firebase App Hosting specifics — **P1/P2**

- Verified: App Hosting CDN caching has constraints — responses with **`Vary` headers containing
  values not on the allow-list won't be cached**, and **using Next.js middleware limits caching**.
  We have no middleware (good). Audit `Cache-Control` on static assets vs HTML; set long-lived
  immutable caching for hashed assets, short/SWR for HTML.
- Confirm `apphosting.yaml` `runConfig` (currently `minInstances: 0`) doesn't cause cold-start TTFB
  that hurts LCP for the crawler/first users; consider `minInstances: 1` if TTFB is poor.
- Confirm SSR HTML (not a JS shell) is what Google fetches (URL Inspection).

### 4.11 Internationalization / hreflang — **P3**

- Single `es-ES` locale → no `hreflang` needed today. Only revisit if a LatAm (`es-419`) or English
  variant is ever added. `lang="es"` in `_document.tsx` is correct; consider `es-ES` for precision.

### 4.12 Accessibility-as-SEO — **P2**

- Run **axe-core** on both routes. Focus: heading order, link/button names, color contrast (tie to
  brandingguide.md), focus states, reduced-motion fallbacks that don't strip SSR content,
  form labels on the V5 contacto form. Overlaps with the mobile audit; clean a11y also lifts
  Lighthouse + UX signals.

### 4.13 Analytics & measurement — **P1**

- **GA4 not installed.** Install GA4 (Pages Router: load via `next/script` `afterInteractive` in
  `_app.tsx`, gated on consent). Define **conversions**: WhatsApp click, phone click, form submit.
  Link GA4 ↔ GSC. Without this we're flying blind on whether SEO work converts.

---

## 5. Recommended code architecture for fixes (Pages Router)

A single source of truth prevents the relative-URL / missing-tag drift we already see:

```
src/lib/seo.ts            # siteUrl() from NEXT_PUBLIC_APP_URL; absUrl(path); default meta
src/lib/jsonld.ts         # realEstateAgent(), website(), faqPage() builders (schema-dts typed)
src/components/Seo.tsx     # <Head> wrapper: title, description, canonical(abs),
                           #   OG (incl. og:image abs + og:url), Twitter card, JSON-LD <script>
next-sitemap.config.js     # siteUrl: https://dosxm2.com, generates robots.txt + sitemap.xml
scripts/seo-check.mjs      # asserts the checklist against rendered HTML; runs in `npm test`
```

Then `index.tsx` / `conocenos.tsx` each render `<Seo .../>` with page-specific props + the
right JSON-LD node. JSON-LD via native `<script type="application/ld+json">` (not `next/script`).

---

## 6. Claude Code execution playbook (phased)

**Phase 0 — Baseline & access (½ day)**
1. Confirm exact canonical host (apex vs www) + live URL. Set `NEXT_PUBLIC_APP_URL`.
2. Verify GSC + GBP access; create GA4 property.
3. `next build && next start`; capture rendered HTML of both routes (the audit baseline).

**Phase 1 — Automated lab audit in-repo (1 day)**
4. Add dev-deps: `@lhci/cli`, `@axe-core/cli`, `html-validate`, `linkinator`, `schema-dts`.
5. Run Lighthouse (mobile+desktop), axe, html-validate, link check on the local SSR build.
6. Write `scripts/seo-check.mjs`; record all failures as findings with severity.

**Phase 2 — Live audit (1 day, needs deployed URL)**
7. GSC: Coverage, URL Inspection (rendered HTML + index status), CWV field report, Enhancements.
8. PSI/CrUX field data for both routes. Rich Results Test on live JSON-LD (after Phase 3 ships).
9. GBP audit + NAP/citation consistency sweep.

**Phase 3 — Implement fixes (P0→P1→P2), each as its own commit/PR**
10. robots.txt + sitemap.xml (`next-sitemap`).
11. `src/lib/seo.ts` + `<Seo>` component → absolute canonicals, OG (`og:url`/`og:image`), Twitter.
12. JSON-LD `RealEstateAgent` + `WebSite`/`Organization` (+ optional `FAQPage`). **No review schema.**
13. Image optimization on (`unoptimized: false`) + migrate key `<img>`→`next/image`.
14. CWV: hero video/poster/LCP, font subsetting, INP on carousel/observers.
15. Security headers, GA4 + conversion events, custom `404.tsx`.
16. Each fix: deploy (push to `main`), re-run `seo-check` + Lighthouse, request re-index in GSC.

**Phase 4 — Verify & report**
17. Re-run all automated checks; confirm green. Produce the deliverable report (§7).
18. Set up ongoing monitoring (§8).

> Deploy reminder (CLAUDE.md): **deploy = `git push origin main`**; Firebase builds/deploys.
> Never add `output: "export"`, `basePath`, or `images.unoptimized: true`.

---

## 7. Deliverable report format (`prds/seo_audit_report_v1.md`)

1. **Executive summary** — scorecard table (P0/P1/P2/P3 counts), headline issues, expected impact.
2. **Findings** — one row each: ID · area · severity · evidence (file:line or live URL + screenshot)
   · recommendation · effort · status.
3. **Before/after metrics** — Lighthouse scores, CWV field values, indexed-pages count, GBP
   completeness, structured-data eligibility.
4. **Local SEO appendix** — GBP checklist, NAP source-of-truth, citation tracker.
5. **Roadmap** — sprinted fix order with owners.
6. **Appendix** — raw tool outputs, JSON-LD payloads, methodology, citations.

---

## 8. Ongoing monitoring (after the audit)

- `seo-check.mjs` + Lighthouse CI in `npm test` (and optionally a pre-deploy check) — catch
  regressions before they ship.
- Monthly: GSC (coverage, CWV, queries), GBP (reviews, insights), CrUX trend, citation drift.
- Re-run the full audit each time a page is added or the design is reworked.

---

## 9. Open decisions (need owner input)

1. **Canonical host:** apex `dosxm2.com` vs `www.` — and confirm the exact TLD (`.com`/`.es`).
2. **Address model:** service-area business (hide address, `areaServed`) vs storefront (publish
   `PostalAddress`). Drives JSON-LD `address` + GBP + NAP.
3. **`og:image` art:** need a 1200×630 branded share image per page (design task).
4. **FAQ block:** approve adding a localized FAQ section (captures long-tail local intent, eligible
   for `FAQPage` rich result) — only meaningful net-new content for a 2-page site.

---

## 10. Out of scope

- Paid search / SEM, link-building outreach, multi-language, a blog/content engine, property-listing
  templates (revisit if scope changes from lead-gen to listings/content).

---

## 11. Sources (verified during research, 2024–2026)

**Primary (Google / Firebase / web.dev / Next.js):**
- Google Search Central — SEO Starter Guide, Get Started, **LocalBusiness structured data**,
  **Review snippet** (self-serving policy), structured-data general guidelines.
- web.dev — *Defining Core Web Vitals thresholds*, *INP is a Core Web Vital* (launch, Mar 2024).
- Firebase — App Hosting **custom domain**, **optimize cache**, **troubleshooting** (image
  optimization disabled by default; `Vary`/middleware caching limits).
- Next.js docs — JSON-LD guidance (native `<script>`, not `next/script`).
- next-sitemap (GitHub) — Pages-Router support, mandatory absolute `siteUrl`, config file.
- Lighthouse CI (GoogleChrome/lighthouse-ci) — `@lhci/cli` audits perf/SEO/a11y/best-practices.

**Secondary / practitioner:** Ahrefs (technical SEO audit, SEO audit), Semrush (technical SEO
checklist), Backlinko (technical SEO guide), BrightLocal (review schema), schemavalidator.org
(LocalBusiness guide), unlighthouse (Lighthouse CI), adriatorreno.com & berzerk.es (SEO para
inmobiliarias / GBP local, ES market).

**Claims explicitly refuted in research (do NOT act on):**
- "Mobile crawler is the default for all sites, making mobile-friendliness a baseline requirement
  *for indexing*" — refuted; mobile-first indexing is real but isn't a hard indexing gate.
- "There is one canonical 8-step technical-SEO-audit structure" — refuted; structure varies by site.
