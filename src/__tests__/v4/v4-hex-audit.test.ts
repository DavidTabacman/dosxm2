import { describe, expect, test } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { readV4Css } from "../utils/readCss";
import { contrastRatio } from "../utils/contrast";

/**
 * Regression fence — prevents per-component color drift. After Phase 4 every
 * V4 color that used to be a raw hex/rgba literal must reference a token
 * declared in V4Layout.module.css.
 */
const BANNED_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "#c14d3a (old error rose)", regex: /#c14d3a/i },
  { label: "#e9c996 (warm accent)", regex: /#e9c996/i },
  { label: "#f3e3c9 (cream accent)", regex: /#f3e3c9/i },
  { label: "#ffffff (white)", regex: /#ffffff/i },
  { label: "rgba(250, 249, 246, …) paper alpha", regex: /rgba\(250,\s*249,\s*246/ },
];

describe("V4 hex audit (post-Phase-4)", () => {
  const v4Dir = resolve(process.cwd(), "src/components/v4");
  const files = readdirSync(v4Dir).filter(
    (f) => f.endsWith(".module.css") && f !== "V4Layout.module.css"
  );

  test.each(files)("%s contains no banned color literals", (file) => {
    const css = readV4Css(file);
    for (const { label, regex } of BANNED_PATTERNS) {
      expect(regex.test(css), `${file}: must not contain ${label}`).toBe(false);
    }
  });
});

describe("V4 error token meets contrast requirement", () => {
  test("--v4-error #a8371f meets 6:1 on Papel Cálido", () => {
    expect(contrastRatio("#a8371f", "#faf9f6")).toBeGreaterThanOrEqual(6.0);
  });

  test("--v4-error #a8371f meets 5.5:1 on surface-elevated", () => {
    expect(contrastRatio("#a8371f", "#f3efe7")).toBeGreaterThanOrEqual(5.5);
  });
});
