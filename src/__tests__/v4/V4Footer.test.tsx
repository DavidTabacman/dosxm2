import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import V4Footer from "@/components/v4/V4Footer";
import { V4_NAV_LINKS } from "@/components/v4/V4StickyHeader";

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
    const social = container.querySelectorAll("ul[class*='socialList'] a");
    expect(social.length).toBe(2);
    social.forEach((link) => {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });

  test("renders WhatsApp link when URL is provided", () => {
    const { container } = render(
      <V4Footer whatsappUrl="https://wa.me/34600" />
    );
    const wa = container.querySelector("a[href='https://wa.me/34600']");
    expect(wa).not.toBeNull();
  });

  test("omits WhatsApp link when URL is absent", () => {
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
});
