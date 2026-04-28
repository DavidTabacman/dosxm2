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

function readCss(name: string) {
  return readFileSync(resolve(V4_COMPONENTS_DIR, name), "utf-8");
}

describe("V4 body-copy 16px floor (P2-5)", () => {
  function firstClampArg(css: string, selectorRegex: RegExp): string {
    const match = css.match(selectorRegex);
    if (!match) throw new Error("rule not found");
    return match[1];
  }

  test("HeroSplit .sub body text starts at 1rem", () => {
    const css = readCss("V4HeroSplit.module.css");
    const arg = firstClampArg(
      css,
      /\.sub\s*{[^}]*font-size:\s*clamp\(([^,]+),/
    );
    expect(arg.trim()).toBe("1rem");
  });

  test("Resenas .message body text is at least 1rem", () => {
    const css = readCss("V4Resenas.module.css");
    expect(css).toMatch(/\.message\s*{[^}]*font-size:\s*1rem/);
  });

  test("Historias .backStory body text is at least 1rem", () => {
    const css = readCss("V4Historias.module.css");
    expect(css).toMatch(/\.backStory\s*{[^}]*font-size:\s*1rem/);
  });

  test("Footer .linkList a body text is at least 1rem", () => {
    const css = readCss("V4Footer.module.css");
    expect(css).toMatch(/\.linkList a\s*{[^}]*font-size:\s*1rem/);
  });
});

describe("V4 type-scale token adoption (Phase 4)", () => {

  test("Hero heading uses --v4-type-display", () => {
    const css = readCss("V4HeroSplit.module.css");
    expect(css).toMatch(
      /\.heading\s*{[^}]*font-size:\s*var\(--v4-type-display\)/
    );
  });

  test("Diferencial heading uses --v4-type-h1", () => {
    const css = readCss("V4Diferencial.module.css");
    expect(css).toMatch(/\.heading\s*{[^}]*font-size:\s*var\(--v4-type-h1\)/);
  });

  test("Historias heading uses --v4-type-h2", () => {
    const css = readCss("V4Historias.module.css");
    expect(css).toMatch(/\.heading\s*{[^}]*font-size:\s*var\(--v4-type-h2\)/);
  });

  test("Resenas heading uses --v4-type-h2", () => {
    const css = readCss("V4Resenas.module.css");
    expect(css).toMatch(/\.heading\s*{[^}]*font-size:\s*var\(--v4-type-h2\)/);
  });

  test("Contacto heading uses --v4-type-h2", () => {
    const css = readCss("V4Contacto.module.css");
    expect(css).toMatch(/\.heading\s*{[^}]*font-size:\s*var\(--v4-type-h2\)/);
  });

  test("Metrics value uses --v4-type-metric", () => {
    const css = readCss("V4Metrics.module.css");
    expect(css).toMatch(
      /\.value\s*{[^}]*font-size:\s*var\(--v4-type-metric\)/
    );
  });
});

describe("V4 Phase 8 typography polish", () => {
  test("Historias heading relaxed to 26ch (was 22ch — orphan line fix)", () => {
    const css = readCss("V4Historias.module.css");
    expect(css).toMatch(/\.heading\s*{[^}]*max-width:\s*26ch/);
  });

  test("Resenas senderName relaxed to 0.08em tracking below 600px", () => {
    const css = readCss("V4Resenas.module.css");
    expect(css).toMatch(
      /@media \(max-width:\s*600px\)\s*{[^}]*\.senderName\s*{[^}]*letter-spacing:\s*0\.08em/
    );
  });
});

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
