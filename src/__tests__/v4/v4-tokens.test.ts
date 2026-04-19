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

  test("Valorador success CTA uses ochre background", () => {
    const css = readCss("V4Valorador.module.css");
    expect(css).toMatch(
      /\.successCta\s*{[^}]*background:\s*var\(--v4-accent\)/
    );
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

  test("WhatsApp FAB uses a soft ochre halo on focus", () => {
    const css = readCss("V4WhatsAppFAB.module.css");
    expect(css).toMatch(/var\(--v4-accent-soft\)/);
  });
});
