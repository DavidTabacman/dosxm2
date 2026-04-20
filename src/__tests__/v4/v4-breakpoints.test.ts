import { describe, expect, test } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { readV4Css } from "../utils/readCss";

/**
 * Regression fence — enforces that every V4 @media breakpoint belongs to
 * the agreed set. 400 is an exceptional iPhone-SE-specific cutoff for the
 * Resenas bubble width; the remaining values form the responsive grid.
 *
 * Re-introducing 560, 820, or 900 means someone forgot to consolidate.
 */
const ALLOWED = new Set([400, 600, 768, 769, 1024]);

describe("V4 breakpoint consolidation (Phase 7)", () => {
  const v4Dir = resolve(process.cwd(), "src/components/v4");
  const files = readdirSync(v4Dir).filter((f) => f.endsWith(".module.css"));

  test.each(files)("%s only uses allowed breakpoints", (file) => {
    const css = readV4Css(file);
    const mediaRegex = /@media\s*\([^)]*?(min|max)-width:\s*(\d+)px/g;
    let match: RegExpExecArray | null;
    const found: number[] = [];
    while ((match = mediaRegex.exec(css)) !== null) {
      found.push(Number(match[2]));
    }
    for (const px of found) {
      expect(ALLOWED.has(px), `${file}: breakpoint ${px}px not in allowed set ${[...ALLOWED].join(", ")}`).toBe(
        true
      );
    }
  });
});
