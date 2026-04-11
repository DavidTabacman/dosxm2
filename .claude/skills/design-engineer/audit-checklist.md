# Brand Compliance Audit Checklist — DOSXM2

Use this checklist for every `audit` and `fix` operation. Check every item against the source files.

## 1. Color Compliance

### 1.1 Gradient Hues
- [ ] `--gradient-hue-1` uses green range (120-160), NOT blue (200-240)
- [ ] `--gradient-hue-2` uses green/teal range (140-180), NOT purple (260-300)
- [ ] Keyframe animations (`@keyframes meshRotate` and similar) use brand-compliant hues throughout all steps
- [ ] No hardcoded `hsl(220, ...)` or `hsl(280, ...)` anywhere in CSS files

### 1.2 Accent Colors
- [ ] `--color-accent` (green) is defined in `globals.css` `:root`
- [ ] Any accent/highlight uses green tones, not blue or purple
- [ ] Hover/focus states use `--color-accent-light` or similar green token
- [ ] Active states use `--color-accent-dark` or similar green token

### 1.3 Neutral Palette
- [ ] Backgrounds use white, beige, or gray — not tinted with blue or purple
- [ ] Dark mode backgrounds use near-black neutrals (#0a0a0a range)
- [ ] No saturated background colors outside the brand palette

### 1.4 Hardcoded Values
- [ ] No hardcoded hex colors in `.module.css` files (must use `var(--*)`)
- [ ] No hardcoded hex colors in `.tsx` inline `style` props (except dynamic calculations)
- [ ] No hardcoded `rgb()` or `hsl()` outside of `globals.css` variable definitions
- [ ] All color values traceable to a CSS custom property defined in `globals.css`

## 2. Typography Compliance

### 2.1 Font Family
- [ ] Primary font is Montserrat (brand spec), not Geist
- [ ] Font loaded via `next/font/google` in `src/pages/_app.tsx`
- [ ] CSS variable `--font-primary` (or equivalent) set on `body` in `globals.css`
- [ ] Fallback stack includes `Arial, Helvetica, sans-serif`

### 2.2 Font Weights
- [ ] Headlines use weight 600 or 700
- [ ] Body text uses weight 400 or 500
- [ ] No weight 800 or 900 (too heavy for brand aesthetic)

### 2.3 Font Sizes
- [ ] Fluid sizing with `clamp()` for all text — format: `clamp(min, preferred, max)`
- [ ] Minimum readable size >= 16px (1rem) for body text
- [ ] Headlines scale down to at least 1.5rem on small screens
- [ ] No font sizes below 14px on any breakpoint

### 2.4 Line Height and Letter Spacing
- [ ] Headlines: `line-height` between 1.1 and 1.3
- [ ] Body text: `line-height` between 1.5 and 1.7
- [ ] No `line-height` below 1.1 (accessibility concern)
- [ ] Headlines: `letter-spacing` between `-0.02em` and `-0.01em`

## 3. Accessibility (WCAG AA)

### 3.1 Contrast Ratios
- [ ] All normal text has >= 4.5:1 contrast against its background
- [ ] All large text (>=18px bold or >=24px regular) has >= 3:1 contrast
- [ ] Interactive elements have >= 3:1 contrast against adjacent colors
- [ ] Focus indicators have >= 3:1 contrast
- [ ] Glass/blur backgrounds: verify text contrast against BOTH the glass layer AND the worst-case gradient position behind it

### 3.2 Screen Reader Support
- [ ] All decorative elements have `aria-hidden="true"`
- [ ] All meaningful images have `alt` text in Spanish
- [ ] `.srOnly` class used for visually hidden screen-reader-visible text
- [ ] `.srOnly` matches the standard pattern: `position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0`
- [ ] No `aria-*` attributes with empty or incorrect values
- [ ] `id` values referenced by `aria-labelledby` actually exist in the DOM

### 3.3 Semantic HTML
- [ ] Heading hierarchy is correct (h1 -> h2 -> h3, no skipped levels)
- [ ] Only one `<h1>` per page
- [ ] Interactive elements use `<button>` or `<a>`, not `<div onClick>`
- [ ] Landmark elements used appropriately: `<main>`, `<section>`, `<nav>`, `<header>`, `<footer>`
- [ ] `<section>` elements have `aria-labelledby` or `aria-label`

### 3.4 Motion and Animation
- [ ] Every file with `animation` has a `@media (prefers-reduced-motion: reduce)` override
- [ ] Every file with `transition` has a `@media (prefers-reduced-motion: reduce)` override
- [ ] Reduced motion sets `animation: none` and `opacity: 1` (content must be visible without animation)
- [ ] No content is only accessible via animation (text revealed by keyframes must have `.srOnly` backup)

### 3.5 Focus Management
- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicators use `outline` (not just `box-shadow` which can be clipped)
- [ ] No `outline: none` without a visible replacement
- [ ] Tab order follows visual reading order

## 4. CSS Architecture

### 4.1 CSS Modules
- [ ] Every component has a co-located `.module.css` file
- [ ] No global CSS classes defined outside `globals.css`
- [ ] Class names are semantic (`.headline`, `.card`), not utility-like (`.mt-4`, `.flex`)
- [ ] No `!important` except inside `@media (prefers-reduced-motion: reduce)` overrides

### 4.2 Custom Properties
- [ ] All theme colors defined in `globals.css` `:root` block
- [ ] Dark mode overrides in `@media (prefers-color-scheme: dark)` block within `globals.css`
- [ ] No circular variable references
- [ ] New tokens (spacing, radius, accent) added to the system if referenced

### 4.3 Responsive Design
- [ ] At minimum two breakpoints: 768px (tablet) and 600px (mobile)
- [ ] No horizontal overflow at any viewport width (`max-width: 100vw` on html/body)
- [ ] Touch targets >= 44x44px on mobile for all interactive elements
- [ ] Font sizes never below 14px on any viewport

### 4.4 Performance
- [ ] No unused CSS classes (defined in `.module.css` but never imported in `.tsx`)
- [ ] `backdrop-filter` always paired with `-webkit-backdrop-filter` for Safari
- [ ] Animations use `transform` and `opacity` (GPU-accelerated), not `top`/`left`/`width`/`height`
- [ ] No CSS imports of external URLs (fonts loaded via `next/font`)

## 5. Spanish Language and Tone

### 5.1 Language Attributes
- [ ] `<Html lang="es">` set in `src/pages/_document.tsx`
- [ ] All `<meta name="description">` content is in Spanish
- [ ] No English text visible in the UI (code comments in English are fine)

### 5.2 Tone Compliance (per brandingguide.md)
- [ ] Text is clear and direct — no excessive technical jargon
- [ ] Messages are brief and impactful
- [ ] CTAs are clear and create urgency (e.g., "Hablamos?", "Descubre", "Empieza ahora")
- [ ] Tone is professional but approachable — not cold/corporate, not casual/slang
- [ ] Content conveys confidence, enthusiasm, positive energy, and security
- [ ] Slight aspirational quality present — generates desire and trust
- [ ] Consistent use of "tu" (informal) address — brand uses familiar tone

### 5.3 Content Quality
- [ ] No placeholder or lorem ipsum text
- [ ] Proper Spanish punctuation (inverted question marks, inverted exclamation marks where needed)
- [ ] No untranslated English strings in user-facing elements

## 6. Known Issues (Always Flag)

These are known deviations in the current codebase that must always appear in audit reports:

1. **MAJOR — Gradient hues are blue/purple (220/280)** — should be green (145/160) per brand palette
2. **MAJOR — Geist font family** — should be Montserrat per brand typography spec
3. **MAJOR — No green accent color defined** — `--color-accent` missing from `globals.css`
4. **MINOR — No spacing token system** — hardcoded rem/px values in `.module.css` files
5. **MINOR — No border radius tokens** — hardcoded `24px` in `.card` class
6. **CRITICAL — Glass text contrast** — `--text-sub` on glass over gradient may fail WCAG AA depending on gradient phase
