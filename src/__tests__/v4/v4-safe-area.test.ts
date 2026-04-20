import { describe, expect, test } from "vitest";
import { readV4Css } from "../utils/readCss";

describe("V4 safe-area-inset coverage", () => {
  test("StickyHeader padding respects left + right safe-area on iOS landscape", () => {
    const css = readV4Css("V4StickyHeader.module.css");
    expect(css).toContain("env(safe-area-inset-left)");
    expect(css).toContain("env(safe-area-inset-right)");
  });

  test("StickyHeader drawer respects bottom + right safe-area", () => {
    const css = readV4Css("V4StickyHeader.module.css");
    expect(css).toContain("env(safe-area-inset-bottom)");
  });

  test("WhatsApp FAB respects bottom + right safe-area", () => {
    const css = readV4Css("V4WhatsAppFAB.module.css");
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain("env(safe-area-inset-right)");
  });
});
