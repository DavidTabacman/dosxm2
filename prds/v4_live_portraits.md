# BRD — V4 "Live Portraits" in El Diferencial

**Owner:** dosxm2 · **Section:** [src/components/v4/V4Diferencial.tsx](src/components/v4/V4Diferencial.tsx)
**Status:** Draft · **Date:** 2026-05-11

---

## 1. Summary

Give the two founder portraits in the *El Diferencial* strip a constant, gentle sense of life — as if the photographs are quietly breathing. The effect must read as **deliberate craft**, not novelty: a viewer should feel the warmth before they consciously notice the motion.

## 2. Why now

The strip is the only place on V4 where the founders look the visitor in the eye. Today the portraits already carry a slow Ken Burns + scroll-driven pan (see [V4Diferencial.module.css:126-195](src/components/v4/V4Diferencial.module.css#L126-L195)), but the motion is calibrated almost to invisibility. Across the 2026 web-design landscape — agency sites, editorial homepages, founder-led brands — **cinemagraph-style micro-motion** has become the signal of a premium, human team. Adding it here reinforces the "Dos visiones, un único objetivo" promise: the photos should feel as *present* as the copy beside them.

## 3. Inspiration & references

| Pattern | Why it fits | Source |
|---|---|---|
| **Cinemagraph portraits** — one element loops, the rest holds still | Premium, editorial, never gimmicky | [Campaign Creators — Subtle Movements](https://www.campaigncreators.com/blog/subtle-movements-how-cinemagraphs-break-brands-from-the-boring), [Skya Designs — Cinemagraph trend](https://www.skyadesigns.co.uk/web-design-insights/top-web-trend-in-2024-cinemagraphs/) |
| **Ken Burns micro-pan** — slow scale + translate loop | GPU-cheap, framework-free, ages well | [Kirupa — Ken Burns in CSS](https://www.kirupa.com/html5/ken_burns_effect_css.htm), [Codrops — parallax gallery](https://tympanus.net/codrops/2026/02/19/creating-a-smooth-horizontal-parallax-gallery-from-dom-to-webgl/) |
| **Scroll-driven parallax** — pure CSS via `animation-timeline: view()` | No JS, compositor-only, 60fps | [CSS-Tricks — scroll-driven parallax](https://css-tricks.com/bringing-back-parallax-with-scroll-driven-css-animations/) |
| **Breathing-style ambient motion** — looped easing on transform/opacity | Reads as "alive" rather than "animated" | [Format — cinemagraph ideas](https://www.format.com/magazine/resources/photography/creative-cinemagraph-photography-ideas), [Vev — micro-animation best practices](https://www.vev.design/blog/micro-animation/) |
| **Modern motion trends 2026** — short, smooth, looping, ambient | Validates direction with current zeitgeist | [GDJ — Video & motion trends 2026](https://graphicdesignjunction.com/2026/01/video-and-motion-creative-trends-2026/) |

## 4. Goals

1. The portraits look **alive** within 1–2 seconds of entering the viewport.
2. The motion is **perceptible but not distracting** — a visitor reading the adjacent copy should not feel pulled away from it.
3. The two founders feel **coupled but not identical** — same language of motion, slightly offset, like two people breathing in the same room.
4. The effect must **layer cleanly** with the existing `portraitsDetached` exit transition and the scroll-driven Ken Burns already in place.

## 5. Non-goals

- No video assets, no GIFs, no Lottie, no WebGL. Pure CSS transforms on the existing `<img>`.
- No face-tracking, no AI re-animation, no per-photo bespoke masks (V2 territory).
- No motion on hover beyond what already exists (lift on `.portraitFrame:hover`).

## 6. Functional requirements

**FR-1 — Ambient "breathing" loop.** Each portrait runs a continuous, looped transform combining:
- A gentle scale oscillation (~1.00 → ~1.03) on a long period (8–12s).
- A sub-pixel-friendly translate sway (≤1.5% on each axis) so the eye line drifts naturally.
- `ease-in-out` with `alternate` direction so there are no visible "snap" points.

**FR-2 — Offset between the two founders.** Founder B starts with a negative animation-delay (~half-period) so the two portraits are always in opposing phases — one inhaling while the other exhales. Avoids the "video wall" feeling of synchronised loops.

**FR-3 — Compose, don't replace.** The breathing loop must coexist with the existing scroll-driven Ken Burns ([V4Diferencial.module.css:167-195](src/components/v4/V4Diferencial.module.css#L167-L195)). Strategy: keep scroll-driven motion on the `<img>` itself; move the breathing loop onto an inner wrapper (or `transform` on `.portraitFrame`'s inner layer) so the two transforms multiply rather than overwrite. The composed motion should still feel like one effect, not two.

**FR-4 — Performance budget.** Animate only `transform` (and at most `filter` for an optional ultra-subtle brightness pulse). No `top`/`left`/`width`/`height`. Use `will-change: transform` only on the animated layer. Target: zero layout, zero paint, ≤1 composite layer added per portrait.

**FR-5 — `prefers-reduced-motion`.** When the user opts out, the breathing loop is fully disabled — portraits stay perfectly still, matching today's behavior at [V4Diferencial.module.css:236-257](src/components/v4/V4Diferencial.module.css#L236-L257).

**FR-6 — Detached exit still works.** When `portraitsDetached` flips true, the fade-out + scale-down transition wins; the breathing animation must not fight it.

## 7. Acceptance criteria

- [ ] On a fresh page load, both portraits show visible idle motion within 2s.
- [ ] At any frozen frame, the two founders are in different positions (no synchronised loop).
- [ ] DevTools "Layers" panel shows compositor-only transforms; "Rendering > Paint flashing" stays dark over the portraits.
- [ ] Lighthouse Performance score for `/v4` does not drop by more than 1 point vs. main.
- [ ] With `prefers-reduced-motion: reduce`, both portraits are perfectly static.
- [ ] Detach transition into the WhatsApp FAB still reads as a single, clean fade.
- [ ] Existing tests in [src/__tests__/v4/V4Diferencial.test.tsx](src/__tests__/v4/V4Diferencial.test.tsx) continue to pass.

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Motion reads as "twitchy" on small mobile screens | Reduce amplitude (~50%) under `@media (max-width: 600px)` (aligns with the V4 consolidated breakpoint set enforced by [v4-breakpoints.test.ts](../src/__tests__/v4/v4-breakpoints.test.ts)) |
| Two stacked transforms (breathing + Ken Burns) cancel or fight | Layered DOM: outer frame stays still, inner wrapper breathes, `<img>` does Ken Burns |
| Looks gimmicky to a serious buyer demographic | Cap scale delta at 1.06 and period at ≥8s; hold ease-in-out so the loop never feels mechanical. (Initial 1.03 cap proved too subtle to perceive on the live site — see commit history.) |
| Battery / CPU on low-end Android | Pure `transform` keeps it on the compositor; ship behind `prefers-reduced-motion` opt-out anyway |

## 9. Out of scope (future)

- True cinemagraphs (a real eye-blink loop) sourced from short founder video clips.
- Scroll-velocity-reactive motion (faster scroll → faster breath).
- Cursor-tracked subtle head-turn (mouse parallax on the eye line).

---

**Sources consulted**
- [Builder.io — Parallax scrolling in 2026](https://www.builder.io/blog/parallax-scrolling-effect)
- [Codrops — Smooth horizontal parallax gallery (Feb 2026)](https://tympanus.net/codrops/2026/02/19/creating-a-smooth-horizontal-parallax-gallery-from-dom-to-webgl/)
- [CSS-Tricks — Scroll-driven parallax animations](https://css-tricks.com/bringing-back-parallax-with-scroll-driven-css-animations/)
- [Kirupa — Ken Burns effect in CSS](https://www.kirupa.com/html5/ken_burns_effect_css.htm)
- [Campaign Creators — Cinemagraphs break brands from the boring](https://www.campaigncreators.com/blog/subtle-movements-how-cinemagraphs-break-brands-from-the-boring)
- [Skya Designs — Cinemagraphs as a web trend](https://www.skyadesigns.co.uk/web-design-insights/top-web-trend-in-2024-cinemagraphs/)
- [Format — Creative cinemagraph ideas for portraits](https://www.format.com/magazine/resources/photography/creative-cinemagraph-photography-ideas)
- [Graphic Design Junction — Video & motion trends 2026](https://graphicdesignjunction.com/2026/01/video-and-motion-creative-trends-2026/)
- [Vev — Micro-animation 101](https://www.vev.design/blog/micro-animation/)
- [Awwwards — Team page hover effect inspiration](https://www.awwwards.com/inspiration/team-page-hover-effect)
