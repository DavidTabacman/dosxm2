---
name: V4 Conócenos page
description: BRD for the "Conócenos" (about us) page — two founder portraits with translucent/overlay motion that converge into a "why we united" finale
type: brd
---

# BRD — V4 "Conócenos" page

**Owner:** dosxm2 · **Route:** `/v4/conocenos` (new) · **Component family:** `src/components/v4/V4Conocenos*`
**Status:** Draft · **Date:** 2026-05-11

---

## 1. Summary

A standalone V4 page that introduces the two founders the way they actually meet a client: **first as individuals, then as a team.** The page is a three-act scrollytelling sequence — **Pablo**, **Borja**, **Juntos** — where each founder's portrait reads as part of the typography rather than a sidebar headshot, and the closing act resolves both faces into a single frame as the user reads *why DOSXM2 exists*.

The design must feel **young, editorial, professional** — the same emotional register as the V4 homepage, not a separate visual language.

## 2. Why now

- The V4 design will become the live homepage. Today there is **no dedicated "about us"** — the only founder moment on V4 is the *El Diferencial* strip ([V4Diferencial.tsx](src/components/v4/V4Diferencial.tsx)), which is a teaser, not a story.
- Real-estate buyers in Madrid pick agents on **trust before competence**. The two founders' personal stories (Banfield → Madrid; Getafe; Saint-Gobain; UBA) are the strongest trust signal DOSXM2 owns and are currently invisible online.
- The client has supplied finished copy and three commissioned portraits — the asset side is ready, only the design and build remain.

## 3. Inspiration & references

| Pattern | Why it fits | Source |
|---|---|---|
| **Pinned split-screen mask reveal** — fixed portrait stack on one side, flowing copy on the other, image unmasked as the user scrolls through the bio | Lets each founder's face *and* their words share the stage without either dominating | [Lovable — scrolling design patterns 2026](https://lovable.dev/guides/scrolling-designs-patterns-when-to-use), [Codrops — on-scroll SVG clip-path text animations](https://tympanus.net/codrops/2024/01/10/experimental-on-scroll-text-animations-with-svg-clip-path/) |
| **Translucent portrait behind editorial copy** ("traslucir una foto") | Direct translation of the client brief; turns the photo into a watermark of personality rather than a label | [Emil Kowalski — The Magic of Clip Path](https://emilkowal.ski/ui/the-magic-of-clip-path), [PixelFreeStudio — CSS masks for creative designs](https://blog.pixelfreestudio.com/using-css-masks-and-clipping-paths-for-creative-designs/) |
| **Scrollytelling acts** — discrete chapters with their own pinned moment | Matches the brief's three-beat structure (Pablo · Borja · Juntos) | [Maglr — best scrollytelling examples 2026](https://www.maglr.com/blog/best-scrollytelling-examples), [Vev — 11 scrollytelling examples](https://www.vev.design/blog/scrollytelling-examples/) |
| **Editorial diptych closer** — two portraits resolving into one composition | Visual payoff for the "why we united" beat | [DesignRush — best storytelling website designs 2026](https://www.designrush.com/best-designs/websites/storytelling), [Awwwards — Team & About collections](https://www.awwwards.com/awwwards/collections/about-page/) |
| **Cinemagraph-style breathing portraits** (already shipped on V4) | Reuses the motion vocabulary the user already established in *El Diferencial* — page should feel like the same product, not a new one | [V4 Live Portraits BRD](prds/v4_live_portraits.md), [Campaign Creators — Cinemagraph subtlety](https://www.campaigncreators.com/blog/subtle-movements-how-cinemagraphs-break-brands-from-the-boring) |
| **Kinetic editorial type** — name set in Fraunces serif, displayed large, animated on entry | Anchors each act and lets the *person* feel like the headline | [UXPilot — 2026 web design trends](https://uxpilot.ai/blogs/web-design-trends-2026), [Elementor — design inspirations 2026](https://elementor.com/blog/website-design-inspirations-to-define/) |

## 4. Goals

1. A first-time visitor finishes the page knowing **who Pablo is, who Borja is, and why they work together** — without re-reading any sentence.
2. The page is **unmistakably part of V4** — same fonts (Fraunces serif + Inter sans), same accent rule, same colour palette, same motion language as [V4Diferencial](src/components/v4/V4Diferencial.tsx).
3. The portraits feel **alive**, not pasted-in — reusing the breathing loop established in [V4 Live Portraits](prds/v4_live_portraits.md).
4. The "Juntos" finale lands as an **emotional payoff**, not just another section — the user should feel the two faces *arrive together*.
5. The whole experience must work on a 375px mobile viewport without losing the sequential / "first separate, then together" reading order.

## 5. Non-goals

- No CMS, no headless content layer — copy ships hard-coded in TSX (matches every other V4 component today).
- No video. No Lottie. No WebGL. Pure CSS + the existing `useSectionReveal` / scroll hooks.
- No founder-detail sub-pages (e.g. `/conocenos/pablo`). One page, three acts.
- No retake of the *El Diferencial* strip on the homepage — it stays as the teaser, this page is the deep dive.
- No new fonts, no new colours, no new icon family.

## 6. Information architecture & copy (verbatim from client)

**Act 1 — Pablo** (portrait: `/v4/founders/founder_pablo.webp`)

> Yo soy Pablo 🙋🏻‍♂️
> Nací en Banfield, un barrio de la zona sur de Gran Buenos Aires, Argentina.
> Hace ya varios años decidí venir a vivir a Madrid, y aquí encontré no solo una oportunidad profesional, sino también mi lugar.
> Soy graduado de la Universidad de Ciencias Económicas de Buenos Aires (UBA) y durante más de 10 años he trabajado en empresas multinacionales dentro del sector servicios. Esa experiencia me ha dado algo clave: entender a las personas, saber escuchar y encontrar soluciones reales a lo que necesitan.
> Porque al final, esto no va de casas, va de personas. Y mi forma de trabajar siempre ha sido esa, cercanía, claridad y compromiso.

**Act 2 — Borja** (portrait: `/v4/founders/founder_borja.webp`)

> Yo soy Borja 🙋🏻‍♂️
> He crecido en un barrio trabajador de Getafe, y eso me ha marcado.
> Desde pequeño, en casa me enseñaron algo muy simple: si das tu palabra, la cumples. Trabajo, sacrificio y honestidad no son solo valores, es la forma en la que entiendo tanto la vida como mi profesión.
> He pasado casi una década en el grupo Saint-Gobain, asumiendo responsabilidades importantes que me han dado una base muy sólida: organización, toma de decisiones y compromiso real con los resultados.
> Además, siempre he tenido mentalidad emprendedora, lo que me ha llevado a desarrollar mis propios proyectos empresariales.
> Hoy aplico todo eso al sector inmobiliario: hacer las cosas bien, sin rodeos y con responsabilidad.

**Act 3 — ¿Por qué nos unimos?** (portrait: `/v4/founders/together.jpg`)

> DOSxM2 no nace de la casualidad, evidenciamos que juntos éramos realmente mejores.
> Nuestra experiencia en varias inmobiliarias, ha demostrado la calidad de nuestro trabajo.
> La combinación de nuestras cualidades se traduce directamente en lo que hacemos, mayor implicación, más soluciones y, sobre todo, un mejor servicio para ti.
> ¡Somos un equipo que funciona como uno solo!

## 7. Design direction

### 7.1 Act 1 & Act 2 — founder solos

A **pinned split** that fills one viewport while the bio scrolls past:

- **Left column (~45%)**: the founder's portrait, full-bleed, anchored. Lives behind a soft duotone gradient on entry and resolves to full colour as the user scrolls into the section. Inherits the breathing micro-motion from [V4 Live Portraits](prds/v4_live_portraits.md).
- **Right column (~55%)**: the bio, set in Inter, with the name ("**Yo soy Pablo**") in Fraunces italic at display size — that line acts as the chapter heading.
- **Scroll choreography**: when the section enters the viewport, the portrait scales gently from ~1.06 → 1.00 and the duotone tint fades out — this is the "appear over / something with motion" beat the client asked for. The breathing loop then takes over.
- **Translucent variant**: at narrow viewports the portrait shifts to a full-bleed background of the section at ~35% opacity, with the bio reading directly over it. This is the "se puede traslucir una foto con el texto" beat.
- **Side flip**: Act 1 puts the portrait on the left; Act 2 mirrors it (portrait on the right). The asymmetry gives the eye a reason to keep reading.

### 7.2 Act 3 — Juntos

The visual payoff. The two single portraits **converge** into the joint `together.jpg`:

- As the user scrolls out of Act 2 and into Act 3, the standalone portraits slide toward the centre of the viewport and cross-fade into the joint shot.
- The section heading **"¿Por qué nos unimos?"** is set in Fraunces and types in / clip-reveals on entry.
- A single, calm CTA at the bottom — *Hablemos* — linking to the existing `#contacto` anchor of the V4 homepage (or to the WhatsApp number once V4 becomes `/`). No new CTAs invented for this page.

### 7.3 Visual language

- **Type**: Fraunces (display, italic) for names + section headings; Inter for body. No new families.
- **Palette**: V4 ink + cream + the existing accent rule. No new tokens.
- **Section rule**: same `ruleAccent` element used in [V4Diferencial.module.css](src/components/v4/V4Diferencial.module.css).
- **Spacing**: each act fills at least 100vh on desktop so the pinned-image sequence has room to breathe; collapses to natural document flow under 720px.

## 8. Functional requirements

**FR-1 — Three-act structure.** Page is composed of three sibling sections (`<section id="pablo">`, `<section id="borja">`, `<section id="juntos">`) inside a shared `<V4ConocenosLayout>` that supplies the V4 font CSS variables and the sticky header from `V4StickyHeader`.

**FR-2 — Pinned split-screen, gracefully degraded.**
- ≥1024px: portrait column is `position: sticky; top: 0` for the duration of the section; copy scrolls past it.
- 720–1024px: portrait sits at the top of the section, copy below; no pinning.
- <720px: portrait becomes a full-bleed background at ~35% opacity behind the copy ("translucent" mode).

**FR-3 — Scroll-driven reveal.** Each section uses the existing `useSectionReveal` hook (see [V4Diferencial.tsx:30](src/components/v4/V4Diferencial.tsx#L30)) to flip a `data-revealed` flag at 15% visibility. CSS transitions:
- portrait: `transform: scale(1.06) → 1.00`, `filter: saturate(0.6) → 1.0`, 700–900ms ease-out.
- name heading: clip-path reveal, left-to-right, 600ms.
- body paragraphs: stagger fade-in (reuse `anim.stagger` / `anim.staggerVisible` from [v4-animations.module.css](src/components/v4/v4-animations.module.css)).

**FR-4 — Breathing portrait, reused not reinvented.** Each portrait reuses the breathing wrapper introduced in [V4 Live Portraits](prds/v4_live_portraits.md). No new animation file.

**FR-5 — Act-3 convergence.** On entry to `#juntos`:
- The two solo portraits (still rendered as small thumbnails in a sticky strip at the top of the viewport, optional) cross-fade toward the centre over ~800ms.
- The `together.jpg` fades in beneath them at the same tempo; once fully visible, the thumbnails disappear.
- The heading "¿Por qué nos unimos?" clip-reveals.

**FR-6 — Navigation.** Add a link to "Conócenos" in `V4StickyHeader` so the new page is reachable from the homepage. No change to the homepage layout.

**FR-7 — Accessibility.**
- Each section has a labelled `<h2>` (Pablo, Borja, Juntos).
- Portrait `<img alt="">` reuses the same `FOUNDER_A.alt` / `FOUNDER_B.alt` strings already defined in [src/pages/v4.tsx:35-44](src/pages/v4.tsx#L35-L44) for consistency.
- All decorative gradients are `aria-hidden`.
- `prefers-reduced-motion: reduce` disables breathing, scale-on-reveal, clip-reveals, and the Act-3 convergence — content appears static and in final position.

**FR-8 — Performance budget.**
- Portraits served as the existing `.webp` / `.jpg` assets in `/public/v4/founders/` — no re-encoding.
- All animations transform/opacity/filter only — no layout, no paint.
- Lazy-load Act-2 and Act-3 portraits with `loading="lazy"`.
- LCP candidate is the Act-1 portrait; preload it via `<link rel="preload" as="image">` in the page `<Head>`.

**FR-9 — SEO.** Page has its own `<title>` ("Conócenos — DOSXM2") and meta description summarising the two founders. Open Graph image is `together.jpg`.

## 9. Acceptance criteria

- [ ] At 1440×900, scrolling from top to bottom plays the three-act sequence: Pablo's portrait pins → bio reads → Borja's portrait pins on the opposite side → bio reads → portraits converge into `together.jpg` with the "¿Por qué nos unimos?" copy.
- [ ] At 375×812 (iPhone SE), all three acts read top-to-bottom with portraits as translucent backgrounds; no horizontal scroll; the convergence still plays as a cross-fade.
- [ ] All copy from §6 is present verbatim, including emoji.
- [ ] Fonts loaded match V4 (`--font-v4-serif`, `--font-v4-sans`); no new font requests in Network panel.
- [ ] With `prefers-reduced-motion: reduce`, no transforms or filters animate; all content visible in its final state on load.
- [ ] Lighthouse Performance for `/v4/conocenos` ≥ 90 on desktop, ≥ 85 on mobile.
- [ ] Page is reachable from the V4 sticky header (new link "Conócenos").
- [ ] No regression on existing V4 tests (`src/__tests__/v4/*`).

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Pinned split feels heavy on mid-tier laptops | `position: sticky` only, no JS scroll listeners; cap section height at 200vh so the pin window is bounded |
| Translucent-portrait variant makes copy hard to read | Tint with a 35–50% cream overlay between portrait and text; verify WCAG AA on body copy |
| Act-3 convergence reads as "two photos disappearing" rather than "two people meeting" | Choreograph the cross-fade so the thumbnails *move toward each other* before fading; the joint photo appears at the meeting point |
| Page diverges visually from the rest of V4 over time | Hard rule: no new CSS variables, no new fonts, no new motion primitives — reuse modules from `src/components/v4/` |
| Client edits the copy after build | Copy lives in one constants block at the top of `V4Conocenos.tsx`, structured as `{ name, intro, paragraphs[] }` — single edit point |

## 11. Out of scope (future)

- Individual founder detail pages with longer-form interviews / video.
- A "Trayectoria" timeline (UBA → multinacionales → DOSXM2 ; Getafe → Saint-Gobain → DOSXM2).
- Press / awards strip beneath Act 3.
- i18n — page ships Spanish-only, matching the rest of V4.

---

**Sources consulted**
- [Lovable — Scrolling Designs: 8 Patterns and When to Use Each (2026)](https://lovable.dev/guides/scrolling-designs-patterns-when-to-use)
- [Maglr — 10 best scrollytelling examples to inspire your 2026 content](https://www.maglr.com/blog/best-scrollytelling-examples)
- [Vev — 11 Scrollytelling Examples That Bring Web Content to Life](https://www.vev.design/blog/scrollytelling-examples/)
- [DesignRush — Best Storytelling Website Designs of 2026](https://www.designrush.com/best-designs/websites/storytelling)
- [UXPilot — 14 Web Design Trends to Keep up with in 2026](https://uxpilot.ai/blogs/web-design-trends-2026)
- [Elementor — 19 Website Design Inspirations to Define 2026](https://elementor.com/blog/website-design-inspirations-to-define/)
- [Codrops — Experimental On-Scroll Text Animations with SVG Clip-Path](https://tympanus.net/codrops/2024/01/10/experimental-on-scroll-text-animations-with-svg-clip-path/)
- [Emil Kowalski — The Magic of Clip Path](https://emilkowal.ski/ui/the-magic-of-clip-path)
- [PixelFreeStudio — CSS Masks and Clipping Paths for Creative Designs](https://blog.pixelfreestudio.com/using-css-masks-and-clipping-paths-for-creative-designs/)
- [Campaign Creators — Subtle Movements: Cinemagraphs Break Brands from the Boring](https://www.campaigncreators.com/blog/subtle-movements-how-cinemagraphs-break-brands-from-the-boring)
- [Awwwards — Team & About Page collection](https://www.awwwards.com/awwwards/collections/about-page/)
- [Digital Agency Network — Top 13 Inspiring Meet The Team Page Examples](https://digitalagencynetwork.com/top-inspiring-digital-agency-meet-the-team-page-examples/)
- [Shopify — Exemplary Meet the Team Page Examples (2026)](https://www.shopify.com/blog/meet-the-team-page-examples)
- [Internal — V4 Live Portraits BRD](prds/v4_live_portraits.md)
