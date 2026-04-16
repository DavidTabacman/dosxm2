import { expect, test, describe } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("globals.css overflow safety", () => {
  const css = readFileSync(
    resolve(__dirname, "../styles/globals.css"),
    "utf-8"
  );

  test("html,body uses overflow-x: clip to preserve position: sticky", () => {
    // overflow-x: clip does not create a scroll container, preserving
    // position: sticky in V3 HeroImmersive and PortfolioTable.
    // overflow-x: hidden breaks sticky — see CSS Overflow Module Level 3.
    expect(css).toContain("overflow-x: clip");
  });

  test("overflow-x: hidden fallback appears before clip for old browsers", () => {
    const hiddenIndex = css.indexOf("overflow-x: hidden");
    const clipIndex = css.indexOf("overflow-x: clip");
    expect(hiddenIndex).toBeGreaterThan(-1);
    expect(clipIndex).toBeGreaterThan(-1);
    expect(hiddenIndex).toBeLessThan(clipIndex);
  });
});
