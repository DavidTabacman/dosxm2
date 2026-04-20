import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import V4Footer from "@/components/v4/V4Footer";
import { V4_NAV_LINKS } from "@/components/v4/V4StickyHeader";
import { readV4Css } from "../utils/readCss";
import { contrastRatio, flattenRgba } from "../utils/contrast";
import { extractRuleBody, assertMinTapTarget, assertMinHeight44 } from "../utils/touchTargets";

describe("V4 Footer", () => {
  test("renders as a contentinfo landmark", () => {
    const { container } = render(<V4Footer />);
    const footer = container.querySelector("footer[role='contentinfo']");
    expect(footer).not.toBeNull();
  });

  test("renders nav links matching the sticky header", () => {
    const { container } = render(<V4Footer />);
    V4_NAV_LINKS.forEach((link) => {
      const anchor = container.querySelector(`a[href='${link.href}']`);
      expect(anchor).not.toBeNull();
      expect(anchor?.textContent).toBe(link.label);
    });
  });

  test("renders the email as a mailto link", () => {
    const { container } = render(<V4Footer email="hola@dosxm2.com" />);
    const mailto = container.querySelector("a[href='mailto:hola@dosxm2.com']");
    expect(mailto).not.toBeNull();
  });

  test("renders Instagram and TikTok links with safe rel attrs", () => {
    const { container } = render(<V4Footer />);
    const social = container.querySelectorAll("ul[class*='contactSocials'] a");
    expect(social.length).toBe(2);
    social.forEach((link) => {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });

  test("never renders a WhatsApp link in the contact block", () => {
    // Footer intentionally has no WhatsApp entry — the two founder-portrait
    // buttons live in V4WhatsAppFAB and the valorador success state, both of
    // which use real founder numbers. Keeping a generic WhatsApp link here
    // invited a placeholder number to creep in, so it's gone on purpose.
    const { container } = render(<V4Footer />);
    const wa = container.querySelector("a[href*='wa.me']");
    expect(wa).toBeNull();
  });

  test("includes current year in copyright line", () => {
    const { container } = render(<V4Footer />);
    const year = String(new Date().getFullYear());
    expect(container.textContent).toContain(year);
    expect(container.textContent).toContain("DOSXM2");
  });

  test("block h3 uses the primary on-dark text color (not raw accent) for AA contrast", () => {
    const css = readV4Css("V4Footer.module.css");
    const body = extractRuleBody(css, [".block h3"]);
    expect(body).not.toBeNull();
    expect(body!).toMatch(/color:\s*var\(--v4-on-dark-primary\)/);
  });

  test("--v4-on-dark-primary flattened on carbón profundo meets AA 4.5:1", () => {
    const ratio = contrastRatio(
      flattenRgba("rgba(250, 249, 246, 0.95)", "#1c1c1c"),
      "#1c1c1c"
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test(".linkList a meets the 44px min-height tap target", () => {
    const css = readV4Css("V4Footer.module.css");
    const body = extractRuleBody(css, [".linkList", "a"]);
    assertMinHeight44(body, ".linkList a");
  });

  test(".contactSocials .iconLink meets 44x44 tap target", () => {
    const css = readV4Css("V4Footer.module.css");
    const body = extractRuleBody(css, [".contactSocials", ".iconLink"]);
    assertMinTapTarget(body, ".contactSocials .iconLink");
  });

  test("footer responsive breakpoint is 768 (aligned with hamburger cutover)", () => {
    const css = readV4Css("V4Footer.module.css");
    expect(css).toMatch(/@media\s*\(max-width:\s*768px\)/);
    expect(css).not.toMatch(/max-width:\s*820px/);
  });
});
