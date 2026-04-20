import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import V4FounderLinks from "@/components/v4/V4FounderLinks";

const DEFAULT_PROPS = {
  founderAPhone: "34667006662",
  founderBPhone: "34674527410",
  founderAName: "Borja",
  founderBName: "Pablo",
  portraitAUrl: "https://example.com/a.jpg",
  portraitAAlt: "Retrato de Borja",
  portraitBUrl: "https://example.com/b.jpg",
  portraitBAlt: "Retrato de Pablo",
  message: "Hola DOSXM2",
};

describe("V4 FounderLinks", () => {
  test("renders two links, one per founder, with the correct wa.me URL", () => {
    const { container } = render(<V4FounderLinks {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toContain(
      "https://wa.me/34667006662"
    );
    expect(links[1].getAttribute("href")).toContain(
      "https://wa.me/34674527410"
    );
  });

  test("encodes the prefilled message in both wa.me URLs", () => {
    const { container } = render(<V4FounderLinks {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      expect(href).toContain("text=");
      expect(href).toContain(encodeURIComponent("Hola DOSXM2"));
    });
  });

  test("strips non-digit characters from each founder's phone", () => {
    const { container } = render(
      <V4FounderLinks
        {...DEFAULT_PROPS}
        founderAPhone="+34 (667) 00-66-62"
        founderBPhone="+34 674 52 74 10"
      />
    );
    const links = container.querySelectorAll("a");
    expect(links[0].getAttribute("href")).toContain(
      "https://wa.me/34667006662"
    );
    expect(links[1].getAttribute("href")).toContain(
      "https://wa.me/34674527410"
    );
  });

  test("gives each link an accessible label naming the founder", () => {
    const { container } = render(<V4FounderLinks {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    expect(links[0].getAttribute("aria-label")).toBe(
      "Escribir a Borja por WhatsApp"
    );
    expect(links[1].getAttribute("aria-label")).toBe(
      "Escribir a Pablo por WhatsApp"
    );
  });

  test("renders both portrait images with the provided alt text", () => {
    const { container } = render(<V4FounderLinks {...DEFAULT_PROPS} />);
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(2);
    expect(imgs[0].getAttribute("alt")).toBe("Retrato de Borja");
    expect(imgs[1].getAttribute("alt")).toBe("Retrato de Pablo");
  });

  test("opens each link in a new tab with safe rel attributes", () => {
    const { container } = render(<V4FounderLinks {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });

  test("defaults to focusable — tabIndex is 0 on both links", () => {
    const { container } = render(<V4FounderLinks {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("tabindex")).toBe("0");
    });
  });

  test("focusable={false} makes both links unreachable via tab", () => {
    const { container } = render(
      <V4FounderLinks {...DEFAULT_PROPS} focusable={false} />
    );
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("tabindex")).toBe("-1");
    });
  });
});
