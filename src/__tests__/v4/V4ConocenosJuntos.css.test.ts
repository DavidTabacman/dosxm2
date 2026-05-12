import { describe, expect, test } from "vitest";
import { statSync } from "node:fs";
import { resolve } from "node:path";
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

describe("V4 ConocenosJuntos — CSS source", () => {
  const css = readV4Css("V4ConocenosJuntos.module.css");

  test("section reserves the sticky-header offset via scroll-margin-top", () => {
    expect(css).toMatch(
      /\.section\s*\{[^}]*scroll-margin-top:\s*calc\(var\(--v4-header-h\)\s*\+\s*16px\)/
    );
  });

  test("diptych is a 3-column grid on desktop", () => {
    expect(css).toMatch(
      /\.diptych\s*\{[^}]*grid-template-columns:\s*1fr\s+1\.4fr\s+1fr/
    );
  });

  test("diptychSlot transition uses transform 800ms + opacity 700ms ease-out", () => {
    expect(css).toMatch(
      /\.diptychSlot\s*\{[\s\S]*?transition:\s*transform\s+800ms\s+cubic-bezier\(0\.7,\s*0,\s*0\.3,\s*1\),\s*opacity\s+700ms\s+ease-out/
    );
  });

  test("converging state translates left slot right and right slot left, both fading", () => {
    expect(css).toMatch(
      /\.diptych\[data-converging="true"\]\s+\.diptychSlot\[data-slot-index="0"\]\s*\{[^}]*transform:\s*translateX\(40%\)\s+scale\(0\.88\)[^}]*opacity:\s*0/
    );
    expect(css).toMatch(
      /\.diptych\[data-converging="true"\]\s+\.diptychSlot\[data-slot-index="1"\]\s*\{[^}]*transform:\s*translateX\(-40%\)\s+scale\(0\.88\)[^}]*opacity:\s*0/
    );
  });

  test("togetherFrame starts hidden (opacity 0, scale 0.96) and resolves on converging", () => {
    expect(css).toMatch(
      /\.togetherFrame\s*\{[^}]*opacity:\s*0[^}]*transform:\s*scale\(0\.96\)/
    );
    expect(css).toMatch(
      /\.diptych\[data-converging="true"\]\s+\.togetherFrame\s*\{[^}]*transform:\s*scale\(1\)[^}]*opacity:\s*1/
    );
    // 100ms transition-delay sells "they meet, then the joint photo appears".
    expect(css).toMatch(
      /\.togetherFrame\s*\{[\s\S]*?transition:\s*transform\s+800ms[^;]*100ms,\s*opacity\s+700ms\s+ease-out\s+100ms/
    );
  });

  test("headingClip wipes in with clip-path inset, 700ms cubic-bezier, 200ms delay", () => {
    expect(css).toMatch(
      /\.headingClip\s*\{[^}]*clip-path:\s*inset\(0\s+100%\s+0\s+0\)/
    );
    expect(css).toMatch(
      /\.headingClip\s*\{[^}]*transition:\s*clip-path\s+700ms\s+cubic-bezier\([^)]+\)\s+200ms/
    );
    expect(css).toMatch(
      /\.sectionRevealed\s*\.headingClip\s*\{[^}]*clip-path:\s*inset\(0\s+0\s+0\s+0\)/
    );
  });

  test("mobile (max-width: 600px) switches convergence translate to Y axis", () => {
    const mobile = sliceBalancedBlock(
      css,
      /@media\s*\(max-width:\s*600px\)\s*\{/
    );
    expect(mobile).not.toBeNull();
    expect(mobile!).toMatch(/grid-template-columns:\s*1fr/);
    expect(mobile!).toMatch(/translateY\(40%\)/);
    expect(mobile!).toMatch(/translateY\(-40%\)/);
  });

  test("mobile CTA goes full-width with min-height 52px", () => {
    const mobile = sliceBalancedBlock(
      css,
      /@media\s*\(max-width:\s*600px\)\s*\{/
    );
    expect(mobile!).toMatch(
      /\.cta\s*\{[^}]*width:\s*100%[^}]*min-height:\s*52px/
    );
  });

  test("desktop CTA meets the 44px tap-target floor (WCAG 2.5.5)", () => {
    // The CTA must have min-height ≥ 44px somewhere. We allow values
    // 44–80px so the test doesn't lock in the exact 48px tuning.
    const ctaBlock = css.match(/\.cta\s*\{[^}]*\}/);
    expect(ctaBlock).not.toBeNull();
    const minH = ctaBlock![0].match(/min-height:\s*(\d+)px/);
    expect(minH).not.toBeNull();
    expect(Number(minH![1])).toBeGreaterThanOrEqual(44);
    expect(Number(minH![1])).toBeLessThanOrEqual(80);
  });

  test("reduced-motion block clears transforms, transitions, and clip-path", () => {
    const reduce = sliceBalancedBlock(
      css,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/
    );
    expect(reduce).not.toBeNull();
    expect(reduce!).toMatch(/transition:\s*none/);
    expect(reduce!).toMatch(/transform:\s*none/);
    expect(reduce!).toMatch(/opacity:\s*1/);
    expect(reduce!).toMatch(/clip-path:\s*none/);
  });

  test("breath keyframes are NOT in this module (they live only in act + diferencial)", () => {
    // Defence in depth: if someone tries to copy the keyframes here too,
    // CSS Modules scoping would shadow the act's keyframes when both files
    // load on the same page. Keep the convergence file pure.
    expect(css).not.toMatch(/@keyframes\s+v4PortraitBreath\b/);
  });
});

describe("V4 ConocenosJuntos — shipped image assets", () => {
  test("public/v4/founders/together.webp exists and is ≤ 250KB", () => {
    const filePath = resolve(
      process.cwd(),
      "public/v4/founders/together.webp"
    );
    const stat = statSync(filePath);
    expect(stat.isFile()).toBe(true);
    // BRD §F.2 cap (220KB target with 30KB slack for re-encoding variance).
    expect(stat.size).toBeLessThanOrEqual(250 * 1024);
  });

  test("public/v4/founders/together-1200.jpg fallback exists and is ≤ 200KB", () => {
    const filePath = resolve(
      process.cwd(),
      "public/v4/founders/together-1200.jpg"
    );
    const stat = statSync(filePath);
    expect(stat.isFile()).toBe(true);
    expect(stat.size).toBeLessThanOrEqual(200 * 1024);
  });

  // The 13MB source image (`together-original.jpg`) is intentionally
  // untracked and .gitignore'd — it lives only on the operator's local
  // disk so Firebase App Hosting doesn't deploy 13MB of binary nobody
  // ever fetches. There is no test for its presence; if a future re-
  // encode is needed, the source has to be re-acquired from the client.
});
