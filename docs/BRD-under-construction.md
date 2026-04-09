# BRD: "Under Construction" Landing Page

**Author:** David Tabacman
**Date:** 2026-04-09
**Status:** Draft
**Project:** dosxm2

---

## 1. Objective

Ship a polished, memorable "Under Construction" landing page that communicates professionalism and builds anticipation while the main site is in development. The page should feel alive, modern, and young — not like a generic placeholder.

**Language:** All user-facing content on the site (including this page) must be in **Spanish (Spain / es-ES)**. The HTML `lang` attribute should be set to `es`.

## 2. Design Direction

**Core concept: Animated Gradient Mesh + Kinetic Typography**

A full-viewport morphing gradient background (aurora/mesh style) with a single bold, animated headline that reveals letter-by-letter. Minimal content, maximum impact. One frosted-glass card floats at center with the essentials.

**Visual pillars:**
- **Restraint** — one hero animation, generous whitespace, 2-3 colors max
- **Motion** — smooth 60fps gradient shifts + staggered text reveal
- **Depth** — glassmorphism card over the living background

## 3. Content & Components

| Element | Description |
|---|---|
| **Background** | CSS animated gradient mesh (3-4 colors, slow morph cycle) |
| **Logo/Brand** | Site name displayed in bold, clean typography (Geist Sans) |
| **Headline** | "Estamos preparando algo grande" — animated letter-by-letter reveal |
| **Subtext** | One-liner teaser, e.g. "Estamos creando algo especial. Muy pronto." |
| **Email capture** | Single input + button with animated success state (optional, phase 2) |
| **Social links** | Subtle icon row at the bottom (optional) |

## 4. Technical Approach

| Aspect | Decision |
|---|---|
| **Framework** | Next.js 16 (Pages Router, existing setup) |
| **Styling** | CSS Modules + CSS `@property` for gradient animation |
| **Animations** | Pure CSS for gradients; lightweight JS for text reveal (no heavy libs) |
| **Glassmorphism** | `backdrop-filter: blur()` with layered opacity |
| **Fonts** | Geist Sans (already configured) |
| **Responsiveness** | Mobile-first, fluid typography with `clamp()` |
| **Performance** | No external dependencies — pure CSS/JS animations, sub-1s LCP |

## 5. Requirements

### Must Have
- All content in Spanish (Spain / es-ES), with `<html lang="es">`
- Animated gradient mesh background (CSS-only, no canvas)
- Frosted-glass centered card with brand name and tagline
- Animated text reveal on page load
- Fully responsive (mobile, tablet, desktop)
- Dark-mode ready (leveraging existing CSS variables)
- Accessible (proper contrast, reduced-motion media query support)

### Nice to Have
- Email capture input with animated success feedback
- Subtle mouse-follow parallax on the glass card
- Social media icon links

### Out of Scope
- Countdown timer (no confirmed launch date yet)
- 3D elements / Three.js (overkill for current needs)
- CMS integration

## 6. Success Criteria

- Page loads in under 1 second (no heavy dependencies)
- Looks premium on both mobile and desktop
- Passes Lighthouse accessibility audit (90+)
- Zero external runtime dependencies added
- Visitors understand the site is coming soon and feel intrigued

## 7. Inspiration & References

| Trend | What to borrow |
|---|---|
| Animated gradient meshes | Living, breathing background — aurora/nebula feel |
| Glassmorphism | Frosted card as the single content container |
| Kinetic typography | Staggered letter reveal for the headline |
| Micro-interactions | Smooth hover states on any interactive elements |

---

*This page is temporary. It will be replaced by the full site once development is complete.*
