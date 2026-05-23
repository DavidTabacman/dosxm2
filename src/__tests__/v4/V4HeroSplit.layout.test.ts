import { describe, expect, test } from "vitest";
import { readV4Css } from "../utils/readCss";

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

/**
 * Returns every `.textLayer { ... }` rule body in the CSS. The hero file has
 * one base rule and three media-scoped overrides (desktop, mobile, landscape
 * phones); we identify the desktop override by looking for properties only it
 * declares (e.g. `padding-bottom:` outside a shorthand).
 */
function textLayerRules(css: string): string[] {
  return [...css.matchAll(/\.textLayer\s*\{([^}]*)\}/g)].map((m) => m[1]);
}

/**
 * CTA-visibility regression guard for the V4 desktop hero.
 *
 * Background: the "Valora tu propiedad" CTA was being clipped at the bottom
 * of the hero on viewports shorter than ~828px because (a) the textLayer is
 * absolutely positioned to 100vh, (b) the heading was sized only by viewport
 * width, and (c) the hero keeps overflow:hidden for the panelRight clip-path.
 * These tests pin the three structural invariants that keep the CTA above
 * the fold across realistic desktop viewports and zoom levels.
 */
describe("V4 HeroSplit — layout invariants protecting the above-the-fold CTA", () => {
  const css = readV4Css("V4HeroSplit.module.css");

  test("heading font-size is capped by viewport height (min(token, 8vh))", () => {
    expect(css).toMatch(
      /\.heading\s*\{[^}]*font-size:\s*min\(\s*var\(--v4-type-display\)\s*,\s*8vh\s*\)/
    );
  });

  test("no .textLayer override anchors content with justify-content: flex-start", () => {
    // The base rule centers content; the first failed fix overrode this in the
    // desktop block, which silently moved the CTA below the fold.
    textLayerRules(css).forEach((body) => {
      expect(body).not.toMatch(/justify-content:\s*flex-start/);
    });
  });

  test("no max-height: 820px quick-win breakpoint exists", () => {
    expect(css).not.toMatch(/max-height:\s*820px/);
  });

  test("desktop textLayer trims the inherited padding-bottom with a clamp()", () => {
    const desktop = textLayerRules(css).find((body) =>
      /padding-bottom:\s*clamp\(/.test(body)
    );
    expect(desktop).toBeDefined();
  });

  test("desktop textLayer zeroes inherited padding-right so the heading column isn't pinched", () => {
    const desktop = textLayerRules(css).find((body) =>
      /padding-bottom:\s*clamp\(/.test(body)
    );
    expect(desktop).toBeDefined();
    expect(desktop!).toMatch(/padding-right:\s*0/);
  });

  test(".hero retains overflow: hidden (load-bearing for panelRight clip-path)", () => {
    expect(css).toMatch(/\.hero\s*\{[^}]*overflow:\s*hidden/);
  });

  test(".hero declares 100svh with a 100vh fallback for stable iOS viewport", () => {
    expect(css).toMatch(/\.hero\s*\{[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh/);
  });

  test("landscape-phones short-viewport rule is preserved", () => {
    const block = sliceBalancedBlock(
      css,
      /@media\s*\(max-height:\s*500px\)\s*and\s*\(orientation:\s*landscape\)\s*\{/
    );
    expect(block).not.toBeNull();
    expect(block!).toMatch(/\.heading\s*\{[^}]*font-size:\s*clamp\(/);
  });
});
