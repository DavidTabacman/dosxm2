import { expect, test, describe } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";

/**
 * Regression guard: every editorial typography role on V4 must resolve
 * to the serif variable. This prevents accidental drift back to sans on
 * H1/H2/lede/signature — the BRD 2.2 editorial voice depends on it.
 *
 * We inspect CSS source files directly (not computed styles) because the
 * test harness does not load fonts and CSS Modules rewrite class names.
 */
const V4_COMPONENTS_DIR = resolve(__dirname, "../../components/v4");

/**
 * Classes that must resolve to serif across ALL V4 CSS modules. Only the
 * truly editorial roles belong here — generic names like `.label` collide
 * with legitimate sans-serif uses (e.g. metric labels, form fields) and
 * would produce false positives.
 */
const SERIF_CLASSES = [
  "heading",
  "lede",
  "signature",
  "headingAccent",
  "backTitle",
  "cardTitle",
  "successHeading",
  "logo",
  "tagline",
];

describe("V4 typography (BRD 2.2)", () => {
  const cssFiles = readdirSync(V4_COMPONENTS_DIR).filter((f) =>
    f.endsWith(".module.css")
  );

  cssFiles.forEach((file) => {
    const path = resolve(V4_COMPONENTS_DIR, file);
    const css = readFileSync(path, "utf-8");

    SERIF_CLASSES.forEach((klass) => {
      // Match rules whose selector list mentions .klass as a whole class name.
      const blockRegex = new RegExp(
        `\\.${klass}\\b[^{]*\\{([^}]*)\\}`,
        "g"
      );
      const matches = Array.from(css.matchAll(blockRegex));
      if (matches.length === 0) return; // class not used in this file

      matches.forEach((m) => {
        const body = m[1];
        const mentionsFont = /font-family\s*:/i.test(body);
        if (!mentionsFont) return; // only rules that set font-family are load-bearing
        test(`${file}: .${klass} uses --v4-font-serif`, () => {
          expect(body).toMatch(/var\(--v4-font-serif\)/);
        });
      });
    });
  });
});
