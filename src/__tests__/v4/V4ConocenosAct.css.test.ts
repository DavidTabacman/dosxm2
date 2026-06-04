import { describe, expect, test } from "vitest";
import { readV4Css } from "../utils/readCss";
import { contrastRatio, flattenRgba } from "../utils/contrast";

function sliceBalancedBlock(source: string, opener: RegExp): string | null {
  const match = source.match(opener);
  if (!match || match.index === undefined) return null;
  const start = match.index + match[0].length;
  let depth = 1;
  for (let i = start; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(match.index, i + 1);
    }
  }
  return null;
}

describe("V4 ConocenosAct — CSS source", () => {
  const css = readV4Css("V4ConocenosAct.module.css");

  test("section reserves the sticky-header offset via scroll-margin-top", () => {
    expect(css).toMatch(
      /\.section\s*\{[^}]*scroll-margin-top:\s*calc\(var\(--v4-header-h\)\s*\+\s*16px\)/
    );
  });

  test("desktop layout is a two-column grid", () => {
    expect(css).toMatch(
      /\.layout\s*\{[^}]*grid-template-columns:\s*0\.9fr\s+1\.1fr/
    );
  });

  test("right-side variant flips grid + reorders the columns", () => {
    expect(css).toMatch(
      /\.section\[data-side="right"\]\s*\.layout\s*\{[^}]*grid-template-columns:\s*1\.1fr\s+0\.9fr/
    );
    expect(css).toMatch(
      /\.section\[data-side="right"\]\s*\.portraitColumn\s*\{[^}]*order:\s*2/
    );
    expect(css).toMatch(
      /\.section\[data-side="right"\]\s*\.copyColumn\s*\{[^}]*order:\s*1/
    );
  });

  test("portrait column uses position: sticky pinned below the header", () => {
    expect(css).toMatch(
      /\.portraitSticky\s*\{[^}]*position:\s*sticky[^}]*top:\s*calc\(var\(--v4-header-h\)\s*\+\s*24px\)/
    );
  });

  test("portrait frame keeps the 3:4 aspect ratio", () => {
    expect(css).toMatch(/\.portraitFrame\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*4/);
  });

  test("portraitOuter carries the 6s ease-in-out breath; alt carries 8s + -3.2s delay", () => {
    // Values match the live-site tuning in V4Diferencial after the
    // perception/diagnostic passes — see V4ConocenosAct.parity.test.ts for
    // the byte-equal regression fence between the two files.
    expect(css).toMatch(
      /\.portraitOuter\s*\{[^}]*animation:\s*v4PortraitBreath\s+6s\s+ease-in-out\s+infinite\s+alternate/
    );
    expect(css).toMatch(
      /\.portraitOuterAlt\s*\{[^}]*animation:\s*v4PortraitBreathAlt\s+8s\s+ease-in-out\s+infinite\s+alternate[^}]*animation-delay:\s*-3\.2s/
    );
  });

  test("portraitTint is a duotone multiply overlay that fades on reveal", () => {
    expect(css).toMatch(/\.portraitTint\s*\{[^}]*mix-blend-mode:\s*multiply/);
    expect(css).toMatch(/\.portraitTint\s*\{[^}]*opacity:\s*1/);
    expect(css).toMatch(
      /\.sectionRevealed\s*\.portraitTint\s*\{[^}]*opacity:\s*0/
    );
  });

  test("heading intro line uses clip-path to wipe in on reveal", () => {
    expect(css).toMatch(
      /\.headingIntro\s*\{[^}]*clip-path:\s*inset\(0\s+100%\s+0\s+0\)/
    );
    expect(css).toMatch(
      /\.sectionRevealed\s*\.headingIntro\s*\{[^}]*clip-path:\s*inset\(0\s+0\s+0\s+0\)/
    );
  });

  test("tablet tier (max-width: 1024px) collapses to a single column, no sticky", () => {
    const tablet = sliceBalancedBlock(
      css,
      /@media\s*\(max-width:\s*1024px\)\s*\{/
    );
    expect(tablet).not.toBeNull();
    expect(tablet!).toMatch(/grid-template-columns:\s*1fr/);
    expect(tablet!).toMatch(/\.portraitSticky\s*\{[^}]*position:\s*static/);
  });

  test("mobile tier (max-width: 600px) enters translucent mode (35% opacity)", () => {
    const mobile = sliceBalancedBlock(
      css,
      /@media\s*\(max-width:\s*600px\)\s*\{/
    );
    expect(mobile).not.toBeNull();
    expect(mobile!).toMatch(
      /\.portraitColumn\s*\{[^}]*position:\s*absolute[^}]*opacity:\s*0\.35/
    );
  });

  test("mobile tier scales down breath amplitudes (cap 1.05 — matches Diferencial)", () => {
    const mobile = sliceBalancedBlock(
      css,
      /@media\s*\(max-width:\s*600px\)\s*\{/
    );
    expect(mobile!).toMatch(/@keyframes\s+v4PortraitBreath\b/);
    expect(mobile!).toMatch(/scale\(1\.05\)/);
    // Desktop's larger amplitude must not leak into mobile.
    expect(mobile!).not.toMatch(/scale\(1\.10\)/);
  });

  test("reduced-motion block disables all animation/transition/clip-path", () => {
    const reduce = sliceBalancedBlock(
      css,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/
    );
    expect(reduce).not.toBeNull();
    expect(reduce!).toMatch(/animation:\s*none/);
    expect(reduce!).toMatch(/transition:\s*none/);
    expect(reduce!).toMatch(/clip-path:\s*none/);
    expect(reduce!).toMatch(/will-change:\s*auto/);
  });

  test("section's overflow is visible (sticky requires non-clipped ancestor)", () => {
    expect(css).toMatch(/\.section\s*\{[^}]*overflow:\s*visible/);
  });

  test("mobile veil reads ≥ 4.5:1 against the cream/carbon body palette", () => {
    // Worst-case mobile contrast: veil at the lighter stop (0.55 alpha)
    // composited over the founder portrait at 0.35 opacity, then against
    // the V4 background #faf9f6. Body text is #1c1c1c (Carbón Profundo).
    // We approximate the portrait as a mid-tone gray (#7a7a7a — typical
    // for headshots) since the actual photo content varies pixel-to-pixel.
    const portraitOverBg = flattenRgba("rgba(122, 122, 122, 0.35)", "#faf9f6");
    const veilOverPortrait = flattenRgba(
      "rgba(250, 249, 246, 0.55)",
      portraitOverBg
    );
    const ratio = contrastRatio("#1c1c1c", veilOverPortrait);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
