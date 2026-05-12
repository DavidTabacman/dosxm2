import { describe, expect, test } from "vitest";
import { readV4Css } from "../utils/readCss";

/**
 * Byte-equality regression test: the breath / Ken-Burns / scroll keyframes
 * are duplicated verbatim from V4Diferencial.module.css into
 * V4ConocenosAct.module.css. CSS Modules' built-in scoping keeps the two
 * sets independent at runtime; this test guarantees they don't drift.
 *
 * If a future edit changes the keyframes in one file but not the other,
 * this test fails and the two surfaces diverge before anyone notices.
 */

const KEYFRAME_NAMES = [
  "v4PortraitBreath",
  "v4PortraitBreathAlt",
  "v4KenBurns",
  "v4KenBurnsAlt",
  "v4PortraitScroll",
  "v4PortraitScrollAlt",
] as const;

// Walks balanced braces — handles nested @media { @keyframes { ... } }.
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

// Extract every top-level (i.e. non-@media-nested) @keyframes block with the
// given name. Some names appear twice — once at file scope (desktop) and
// once inside the mobile @media block — we want both.
function extractAllKeyframes(css: string, name: string): string[] {
  const matches: string[] = [];
  let cursor = 0;
  const pattern = new RegExp(`@keyframes\\s+${name}\\s*\\{`, "g");
  pattern.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(css)) !== null) {
    // Slice from the match index using the balanced walker.
    const block = sliceBalancedBlock(
      css.slice(m.index),
      new RegExp(`@keyframes\\s+${name}\\s*\\{`)
    );
    if (block) matches.push(block);
    cursor = m.index + 1;
    if (cursor >= css.length) break;
  }
  return matches;
}

describe("V4 Conocenos — keyframe parity with Diferencial", () => {
  const diferencial = readV4Css("V4Diferencial.module.css");
  const conocenos = readV4Css("V4ConocenosAct.module.css");

  test.each(KEYFRAME_NAMES)(
    "%s keyframe blocks are byte-equal between Diferencial and Conocenos",
    (name) => {
      const a = extractAllKeyframes(diferencial, name);
      const b = extractAllKeyframes(conocenos, name);
      // Both files must define the keyframe; both must define the same
      // number of variants (desktop + mobile for the breath keyframes).
      expect(a.length).toBeGreaterThan(0);
      expect(b.length).toBe(a.length);
      a.forEach((block, i) => {
        expect(b[i]).toBe(block);
      });
    }
  );

  test("both files declare the breath wrapper animation (ease-in-out, 6s/8s)", () => {
    // The CONSUMING rules are allowed to differ in selector name —
    // Diferencial uses .portraitOuter, Conocenos may too — but both must
    // wire 6s ease-in-out to the breath keyframe so the perception is the same.
    expect(diferencial).toMatch(
      /animation:\s*v4PortraitBreath\s+6s\s+ease-in-out\s+infinite\s+alternate/
    );
    expect(conocenos).toMatch(
      /animation:\s*v4PortraitBreath\s+6s\s+ease-in-out\s+infinite\s+alternate/
    );
    expect(diferencial).toMatch(
      /animation:\s*v4PortraitBreathAlt\s+8s\s+ease-in-out\s+infinite\s+alternate/
    );
    expect(conocenos).toMatch(
      /animation:\s*v4PortraitBreathAlt\s+8s\s+ease-in-out\s+infinite\s+alternate/
    );
  });

  test("both files reduce breath amplitudes at the 600px breakpoint", () => {
    [diferencial, conocenos].forEach((css) => {
      const mobile = sliceBalancedBlock(
        css,
        /@media\s*\(max-width:\s*600px\)\s*\{/
      );
      expect(mobile).not.toBeNull();
      expect(mobile!).toMatch(/@keyframes\s+v4PortraitBreath\b/);
      expect(mobile!).toMatch(/scale\(1\.05\)/);
    });
  });

  test("both files disable animations under prefers-reduced-motion", () => {
    [diferencial, conocenos].forEach((css) => {
      const reduce = sliceBalancedBlock(
        css,
        /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/
      );
      expect(reduce).not.toBeNull();
      expect(reduce!).toMatch(/animation:\s*none/);
    });
  });
});
