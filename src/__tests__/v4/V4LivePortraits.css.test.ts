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

  test("breath wrapper carries the breath animation", () => {
    expect(css).toMatch(
      /\.portraitBreath\s*\{[^}]*animation:\s*v4PortraitBreath\s+10s\s+ease-in-out\s+infinite\s+alternate/
    );
  });

  test("second founder uses Alt keyframe with -5s phase offset", () => {
    expect(css).toMatch(
      /\.portraitFrame:nth-of-type\(2\)\s+\.portraitBreath\s*\{[^}]*animation-name:\s*v4PortraitBreathAlt[^}]*animation-delay:\s*-5s/
    );
  });

  test("mobile media query reduces breath amplitudes", () => {
    const mobile = sliceBalancedBlock(css, /@media\s*\(max-width:\s*600px\)\s*\{/);
    expect(mobile).not.toBeNull();
    expect(mobile!).toMatch(/@keyframes\s+v4PortraitBreath\b/);
    expect(mobile!).toMatch(/@keyframes\s+v4PortraitBreathAlt\b/);
    expect(mobile!).toMatch(/scale\(1\.015\)/);
    expect(mobile!).not.toMatch(/scale\(1\.03\)/);
  });

  test("reduced-motion block disables breath animation and clears will-change", () => {
    const reduce = sliceBalancedBlock(
      css,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/
    );
    expect(reduce).not.toBeNull();
    expect(reduce!).toMatch(/\.portraitBreath/);
    expect(reduce!).toMatch(/animation:\s*none/);
    expect(reduce!).toMatch(/will-change:\s*auto/);
  });

  test("breath wrapper sits absolutely inside its frame", () => {
    expect(css).toMatch(
      /\.portraitBreath\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0/
    );
  });

  test("breath amplitudes stay within BRD caps (scale <=1.03, translate <=0.6%)", () => {
    // Slice the first (desktop) v4PortraitBreath keyframes — the mobile
    // copy lives inside the @media block and uses smaller amplitudes.
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
      expect(s).toBeLessThanOrEqual(1.03);
    });
    const translateMatches = Array.from(
      breathDesktop!.matchAll(/translate3d\(\s*(-?[\d.]+)%\s*,\s*(-?[\d.]+)%/g)
    );
    expect(translateMatches.length).toBeGreaterThanOrEqual(2);
    translateMatches.forEach(([, x, y]) => {
      expect(Math.abs(parseFloat(x))).toBeLessThanOrEqual(0.6);
      expect(Math.abs(parseFloat(y))).toBeLessThanOrEqual(0.6);
    });
  });
});
