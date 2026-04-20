import { expect, test, describe } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Regression tests for V4 design tokens. If these fail, the BRD palette
 * has drifted from the agreed values — check with the client before
 * updating.
 */
describe("V4 design tokens (BRD 2.1)", () => {
  const css = readFileSync(
    resolve(__dirname, "../../components/v4/V4Layout.module.css"),
    "utf-8"
  );

  test("declares --v4-bg as Papel Cálido (#faf9f6)", () => {
    expect(css).toMatch(/--v4-bg:\s*#faf9f6/i);
  });

  test("declares --v4-fg as Carbón Profundo (#1c1c1c)", () => {
    expect(css).toMatch(/--v4-fg:\s*#1c1c1c/i);
  });

  test("declares --v4-accent as Ocre Terroso (#8b5a2b)", () => {
    expect(css).toMatch(/--v4-accent:\s*#8b5a2b/i);
  });

  test("defines a sticky-header height token", () => {
    expect(css).toMatch(/--v4-header-h/);
  });

  test("declares --v4-error at AA-capable strength", () => {
    expect(css).toMatch(/--v4-error:\s*#a8371f/i);
  });

  test("declares --v4-error-soft focus-ring scaffold", () => {
    expect(css).toMatch(/--v4-error-soft:\s*rgba\(168,\s*55,\s*31,\s*0\.1\)/);
  });

  test("declares --v4-accent-warm cream family token", () => {
    expect(css).toMatch(/--v4-accent-warm:\s*#e9c996/i);
  });

  test("declares --v4-accent-cream italic-accent token", () => {
    expect(css).toMatch(/--v4-accent-cream:\s*#f3e3c9/i);
  });

  test("declares --v4-on-accent white text-over-accent token", () => {
    expect(css).toMatch(/--v4-on-accent:\s*#ffffff/i);
  });

  test("declares the on-dark text scale (primary/secondary/tertiary)", () => {
    expect(css).toMatch(/--v4-on-dark-primary:\s*rgba\(250,\s*249,\s*246,\s*0\.95\)/);
    expect(css).toMatch(/--v4-on-dark-secondary:\s*rgba\(250,\s*249,\s*246,\s*0\.75\)/);
    expect(css).toMatch(/--v4-on-dark-tertiary:\s*rgba\(250,\s*249,\s*246,\s*0\.55\)/);
    expect(css).toMatch(/--v4-on-dark-hairline:\s*rgba\(250,\s*249,\s*246,\s*0\.12\)/);
  });

  test("declares type-scale tokens (display/h1/h2/metric)", () => {
    expect(css).toMatch(/--v4-type-display:\s*clamp\(2\.5rem,\s*6\.5vw,\s*5\.25rem\)/);
    expect(css).toMatch(/--v4-type-h1:\s*clamp\(2rem,\s*4\.5vw,\s*3\.5rem\)/);
    expect(css).toMatch(/--v4-type-h2:\s*clamp\(2rem,\s*4\.5vw,\s*3\.25rem\)/);
    expect(css).toMatch(/--v4-type-metric:\s*clamp\(2\.75rem,\s*7\.5vw,\s*5\.25rem\)/);
  });
});

describe("V4 animation primitives (motion-first pattern)", () => {
  const css = readFileSync(
    resolve(__dirname, "../../components/v4/v4-animations.module.css"),
    "utf-8"
  );

  test("revealTarget base state is visible (safe for reduced motion)", () => {
    // Outside the media query the base state should have opacity 1.
    const base = css.split("@media (prefers-reduced-motion: no-preference)")[0];
    expect(base).toMatch(/\.revealTarget\s*{[^}]*opacity:\s*1/);
  });

  test("stagger animations are scoped behind prefers-reduced-motion: no-preference", () => {
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
    // Each stagger delay should be inside the media block (cheap presence check).
    expect(css).toMatch(/staggerVisible > \*:nth-child/);
  });
});

describe("V4 ochre presence (BRD 2.1 brand motif)", () => {
  function readCss(name: string) {
    return readFileSync(
      resolve(__dirname, `../../components/v4/${name}`),
      "utf-8"
    );
  }

  test("Hero CTA uses ochre background", () => {
    const css = readCss("V4HeroSplit.module.css");
    expect(css).toMatch(/\.cta\s*{[^}]*background:\s*var\(--v4-accent\)/);
  });

  test("Valorador submit button uses ochre background", () => {
    const css = readCss("V4Valorador.module.css");
    expect(css).toMatch(/\.btnPrimary\s*{[^}]*background:\s*var\(--v4-accent\)/);
  });

  test("Sticky header nav underline uses ochre", () => {
    const css = readCss("V4StickyHeader.module.css");
    expect(css).toMatch(
      /\.navLink::after\s*{[^}]*background:\s*var\(--v4-accent\)/
    );
  });

  test("Metrics tiles carry an ochre whisker accent", () => {
    const css = readCss("V4Metrics.module.css");
    expect(css).toMatch(
      /\.tile::before\s*{[^}]*background:\s*var\(--v4-accent\)/
    );
  });

  test("Historias cards carry an ochre decorative numeral", () => {
    const css = readCss("V4Historias.module.css");
    expect(css).toMatch(
      /\.card::before\s*{[^}]*color:\s*var\(--v4-accent\)/
    );
  });

  test("founder portrait links use a soft ochre halo on focus", () => {
    // Halo rule moved from V4WhatsAppFAB.module.css to V4FounderLinks.module.css
    // when the portrait-stack markup was shared with the valorador success state.
    const css = readCss("V4FounderLinks.module.css");
    expect(css).toMatch(/var\(--v4-accent-soft\)/);
  });
});
