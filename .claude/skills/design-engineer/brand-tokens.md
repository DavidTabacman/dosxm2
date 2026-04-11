# Brand Design Tokens — DOSXM2

Source of truth: `brandingguide.md` (project root). This file maps brand requirements to CSS custom properties for `src/styles/globals.css`.

## Color Palette

### Brand Colors (from brandingguide.md)

| Role | Description | Recommended Values |
|------|-------------|-------------------|
| Base neutral | Gray | `#6B7280`, `#9CA3AF`, `#D1D5DB`, `#F3F4F6` |
| Base neutral | Beige | `#F5F5DC`, `#FAF8F0`, `#E8E4D9` |
| Base neutral | White | `#FFFFFF` |
| Contrast | Black | `#000000`, `#171717`, `#1A1A1A` |
| Accent | Green (trust/distinction) | `#2E7D32`, `#4CAF50`, `#388E3C`, `#81C784` |

### CSS Custom Properties — Current vs. Target

#### Root (Light Mode)

| Variable | Current | Target | Status |
|----------|---------|--------|--------|
| `--background` | `#ffffff` | `#ffffff` or `#FAF8F0` (warm beige) | OK |
| `--foreground` | `#171717` | `#171717` | OK |
| `--glass-bg` | `hsla(0,0%,100%,0.1)` | `hsla(0,0%,100%,0.1)` | OK |
| `--glass-border` | `hsla(0,0%,100%,0.18)` | `hsla(0,0%,100%,0.18)` | OK |
| `--glass-shadow` | `hsla(0,0%,0%,0.2)` | `hsla(0,0%,0%,0.2)` | OK |
| `--text-hero` | `#ffffff` | `#ffffff` | OK |
| `--text-sub` | `hsla(0,0%,100%,0.75)` | `hsla(0,0%,100%,0.75)` | OK |

#### New Variables Needed

| Variable | Light Mode | Dark Mode | Purpose |
|----------|-----------|-----------|---------|
| `--color-accent` | `#2E7D32` | `#4CAF50` | Primary green accent |
| `--color-accent-light` | `#81C784` | `#A5D6A7` | Hover states, subtle accents |
| `--color-accent-dark` | `#1B5E20` | `#2E7D32` | Active states, emphasis |
| `--color-neutral-100` | `#F3F4F6` | `#1A1A1A` | Lightest neutral surface |
| `--color-neutral-200` | `#E8E4D9` | `#2A2A2A` | Beige-tinted surface |
| `--color-neutral-300` | `#D1D5DB` | `#3A3A3A` | Borders, dividers |
| `--color-neutral-500` | `#6B7280` | `#9CA3AF` | Muted text |
| `--color-neutral-900` | `#171717` | `#EDEDED` | Primary text (alias for --foreground) |
| `--color-black` | `#000000` | `#FFFFFF` | Maximum contrast |
| `--color-white` | `#FFFFFF` | `#0A0A0A` | Inverse of black |

#### Gradient Variables — Current vs. Target

| Variable | Current | Target | Notes |
|----------|---------|--------|-------|
| `--gradient-hue-1` | `220` (blue) | `145` (green) | Brand accent: green |
| `--gradient-hue-2` | `280` (purple) | `160` (teal-green) | Complement to accent |
| `--gradient-l1` | `50%` / `30%` | `40%` / `25%` | Slightly muted for elegance |
| `--gradient-l2` | `40%` / `20%` | `35%` / `20%` | Keep dark mode subtle |

Keyframe hue values in `UnderConstruction.module.css` must also update:
- 0%: hue-1 `145`, hue-2 `160`
- 33%: hue-1 `155`, hue-2 `170`
- 66%: hue-1 `135`, hue-2 `150`
- 100%: hue-1 `145`, hue-2 `160` (loop back)

## Typography

### Brand Spec vs. Current

| Property | Current | Target | Priority |
|----------|---------|--------|----------|
| Primary font | Geist Sans | Montserrat | HIGH |
| Mono/secondary font | Geist Mono | Poppins | MEDIUM |
| Font weights (headlines) | 600 | 600-700 | LOW |
| Font weights (body) | inherited | 400 | LOW |
| Letter spacing (headlines) | `-0.02em` | `-0.01em` to `-0.02em` | OK |

### Font Loading Migration

Replace in `src/pages/_app.tsx`:
```tsx
// Current
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Target
import { Montserrat, Poppins } from "next/font/google";
const montserrat = Montserrat({ variable: "--font-primary", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-secondary",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
```

Update in `src/styles/globals.css`:
```css
body {
  font-family: var(--font-primary), Arial, Helvetica, sans-serif;
}
```

## Spacing Scale

Consistent spacing based on 4px (0.25rem) increments:

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | `0.25rem` | Tight gaps |
| `--space-2` | `0.5rem` | Icon gaps, small padding |
| `--space-3` | `0.75rem` | Compact padding |
| `--space-4` | `1rem` | Standard gap, margins |
| `--space-6` | `1.5rem` | Section padding (mobile) |
| `--space-8` | `2rem` | Section padding (tablet) |
| `--space-10` | `2.5rem` | Card padding |
| `--space-12` | `3rem` | Card padding (desktop) |

## Border Radius Scale

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | `8px` | Buttons, small cards |
| `--radius-md` | `16px` | Medium containers |
| `--radius-lg` | `24px` | Large cards (current `.card`) |
| `--radius-full` | `9999px` | Pills, badges, circular buttons |

## WCAG AA Contrast Reference

Minimum contrast ratios:
- Normal text (<18px bold, <24px regular): **4.5:1**
- Large text (>=18px bold, >=24px regular): **3:1**
- UI components and graphical objects: **3:1**

### Key Color Pairs to Validate

| Foreground | Background | Ratio | Verdict |
|-----------|-----------|-------|---------|
| `--foreground` (#171717) | `--background` (#ffffff) | 15.4:1 | PASS AA+AAA |
| `--color-accent` (#2E7D32) | `--background` (#ffffff) | ~5.1:1 | PASS AA |
| `--color-accent` (#4CAF50) | dark `--background` (#0a0a0a) | ~6.4:1 | PASS AA |
| `--text-hero` (#fff) | green gradient (hsl 145, 70%, 40%) | ~3.2:1 | PASS large text only |
| `--text-sub` (white 75%) | glass-bg on gradient | Verify | Must test with actual backdrop |
| `--color-accent-light` (#81C784) | `--background` (#ffffff) | ~2.8:1 | FAIL — use only for decorative, not text |
