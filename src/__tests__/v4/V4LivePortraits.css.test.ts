import { describe, test, expect } from "vitest";
import { readV4Css } from "../utils/readCss";

// Walks balanced braces to extract a CSS block by its opening pattern.
// Needed because @media blocks can contain nested @keyframes whose own
// `}` characters defeat a simple lazy regex.
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

describe("V4 live portraits — CSS source", () => {
  const css = readV4Css("V4Diferencial.module.css");
  const shared = readV4Css("v4-animations.module.css");

  test("breath keyframes are defined", () => {
    expect(css).toMatch(/@keyframes\s+v4PortraitBreath\b/);
    expect(css).toMatch(/@keyframes\s+v4PortraitBreathAlt\b/);
  });

  test("breath keyframes are NOT in the shared animations module (FAB leak guard)", () => {
    expect(shared).not.toMatch(/v4PortraitBreath/);
  });

  test("outer card wrapper carries the breath animation (ease-in-out, 6s)", () => {
    // ease-in-out gives a sinusoidal velocity profile. Pass 4 used linear
    // at very small amplitudes and ran ~0.04°/s — below the conscious
    // motion threshold (0.1°/s). At pass-5 amplitudes ease-in-out peaks
    // above threshold at mid-cycle, the breath shape reads naturally,
    // and a casual glance has a ~50% chance of catching peak velocity.
    expect(css).toMatch(
      /\.portraitOuter\s*\{[^}]*animation:\s*v4PortraitBreath\s+6s\s+ease-in-out\s+infinite\s+alternate/
    );
  });

  test("alt modifier carries the alt keyframe with decoupled 8s period + phase offset", () => {
    // Decoupled 6s + 8s (not phase-shifted same period) so the two cards
    // don't read as a synchronised wobble.
    expect(css).toMatch(
      /\.portraitOuterAlt\s*\{[^}]*animation:\s*v4PortraitBreathAlt\s+8s\s+ease-in-out\s+infinite\s+alternate[^}]*animation-delay:\s*-3\.2s/
    );
  });

  test("breath wrapper sits OUTSIDE the frame (whole card moves, not just content)", () => {
    // The core perception fix — see prds/v4_live_portraits_DEBUGGING.md §4
    // and the research pass in §9 (Johansson biological-motion, aperture
    // problem). Old inner-wrapper .portraitBreath must not coexist.
    expect(css).not.toMatch(/\.portraitBreath\b/);
    expect(css).toMatch(/\.portraitFrame\s*\{[^}]*overflow:\s*hidden/);
  });

  test("breath keyframes include rotation to break rigid-translation reading", () => {
    // Rotation is research-grounded: differential motion between corners
    // and center prevents the brain from reading the whole card as a
    // rigid sheet (which never engages biological-motion perception).
    const breathDesktop = sliceBalancedBlock(
      css,
      /@keyframes\s+v4PortraitBreath\s*\{/
    );
    expect(breathDesktop).not.toBeNull();
    const rotateMatches = Array.from(
      breathDesktop!.matchAll(/rotate\(\s*-?[\d.]+deg\s*\)/g)
    );
    expect(rotateMatches.length).toBeGreaterThanOrEqual(2);
  });

  test("mobile media query halves amplitudes (scale 1.05 cap)", () => {
    const mobile = sliceBalancedBlock(
      css,
      /@media\s*\(max-width:\s*600px\)\s*\{/
    );
    expect(mobile).not.toBeNull();
    expect(mobile!).toMatch(/@keyframes\s+v4PortraitBreath\b/);
    expect(mobile!).toMatch(/@keyframes\s+v4PortraitBreathAlt\b/);
    expect(mobile!).toMatch(/scale\(1\.05\)/);
    // Desktop scale value 1.1 must not leak into the mobile block.
    expect(mobile!).not.toMatch(/scale\(1\.1\)/);
  });

  test("reduced-motion block disables breath animation and clears will-change", () => {
    const reduce = sliceBalancedBlock(
      css,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/
    );
    expect(reduce).not.toBeNull();
    expect(reduce!).toMatch(/\.portraitOuter\b/);
    expect(reduce!).toMatch(/\.portraitOuterAlt\b/);
    expect(reduce!).toMatch(/animation:\s*none/);
    expect(reduce!).toMatch(/will-change:\s*auto/);
    // Guard against the old inner-wrapper selector creeping back in.
    expect(reduce!).not.toMatch(/\.portraitBreath\b/);
  });

  test("breath amplitudes — scale ≤1.10, translate ≤3% X, ≤2% Y on desktop", () => {
    // Pass-5: amplitudes restored to pass-3 levels because pass-4
    // (scale 1.04 / ±2%) ran below the conscious detection threshold
    // (live diagnostic: ~0.04°/s, floor ~0.1°/s). The earlier failed
    // pass at these amplitudes was invisible due to the aperture
    // problem (motion inside a clipped frame). With the structural
    // fix (motion on the outer wrapper), these amplitudes clear the
    // detection floor at mid-cycle peak velocity.
    const breathDesktop = sliceBalancedBlock(
      css,
      /@keyframes\s+v4PortraitBreath\s*\{/
    );
    expect(breathDesktop).not.toBeNull();
    const scaleMatches = Array.from(
      breathDesktop!.matchAll(/scale\(([\d.]+)\)/g)
    ).map((m) => parseFloat(m[1]));
    expect(scaleMatches.length).toBeGreaterThanOrEqual(2);
    scaleMatches.forEach((s) => {
      expect(s).toBeGreaterThanOrEqual(1);
      expect(s).toBeLessThanOrEqual(1.1);
    });
    const translateMatches = Array.from(
      breathDesktop!.matchAll(/translate3d\(\s*(-?[\d.]+)%\s*,\s*(-?[\d.]+)%/g)
    );
    expect(translateMatches.length).toBeGreaterThanOrEqual(2);
    translateMatches.forEach(([, x, y]) => {
      expect(Math.abs(parseFloat(x))).toBeLessThanOrEqual(3);
      expect(Math.abs(parseFloat(y))).toBeLessThanOrEqual(2);
    });
  });

  test("portraitFrame keeps its hover lift independent of the breath", () => {
    // Hover lives on the frame; breath lives on the outer wrapper. They
    // compose via the compositor — neither overwrites the other.
    expect(css).toMatch(
      /\.portraitFrame:hover\s*\{[^}]*transform:\s*translateY\(\s*-4px\s*\)/
    );
  });

  test("editorial vertical offset lives on portraitOuter (the grid item)", () => {
    // The new outer wrapper is the direct grid child, so the asymmetric
    // editorial layout must anchor there. If these rules accidentally
    // stay on .portraitFrame as well, layouts compound and break.
    expect(css).toMatch(
      /\.portraitOuter:first-child\s*\{[^}]*margin-top:\s*0/
    );
    expect(css).toMatch(
      /\.portraitOuter:last-child\s*\{[^}]*margin-top:\s*clamp\(/
    );
    expect(css).not.toMatch(
      /\.portraitFrame:first-child\s*\{[^}]*margin-top/
    );
    expect(css).not.toMatch(
      /\.portraitFrame:last-child\s*\{[^}]*margin-top/
    );
  });
});
