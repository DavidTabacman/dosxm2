import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act, fireEvent } from "@testing-library/react";
import V4WhatsAppFAB from "@/components/v4/V4WhatsAppFAB";
import { readV4Css } from "../utils/readCss";

const DEFAULT_PROPS = {
  founderAPhone: "34667006662",
  founderBPhone: "34674527410",
  message: "Hola DOSXM2",
  visible: true,
  portraitAUrl: "https://example.com/a.jpg",
  portraitAAlt: "Retrato A",
  portraitBUrl: "https://example.com/b.jpg",
  portraitBAlt: "Retrato B",
  founderAName: "Borja",
  founderBName: "Pablo",
};

describe("V4 WhatsAppFAB", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders two links, one per founder, each with its own wa.me URL", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toContain("https://wa.me/34667006662");
    expect(links[1].getAttribute("href")).toContain("https://wa.me/34674527410");
  });

  test("encodes the prefilled message in both wa.me URLs", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      expect(href).toContain("text=");
      expect(href).toContain(encodeURIComponent("Hola DOSXM2"));
    });
  });

  test("strips non-digit characters from each founder's phone", () => {
    const { container } = render(
      <V4WhatsAppFAB
        {...DEFAULT_PROPS}
        founderAPhone="+34 (667) 00-66-62"
        founderBPhone="+34 674 52 74 10"
      />
    );
    const links = container.querySelectorAll("a");
    expect(links[0].getAttribute("href")).toContain("https://wa.me/34667006662");
    expect(links[1].getAttribute("href")).toContain("https://wa.me/34674527410");
  });

  test("renders two portrait images with correct alt text", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const portraits = container.querySelectorAll(
      "img[data-asset-type='founder-portrait']"
    );
    expect(portraits).toHaveLength(2);
    expect(portraits[0].getAttribute("alt")).toBe("Retrato A");
    expect(portraits[1].getAttribute("alt")).toBe("Retrato B");
  });

  test("does NOT render a WhatsApp SVG icon alongside the portraits", () => {
    // BRD 4.2: portraits themselves are the affordance, no separate pill/icon.
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(0);
  });

  test("each link exposes an accessible label naming its founder", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    const labelA = links[0].getAttribute("aria-label") ?? "";
    const labelB = links[1].getAttribute("aria-label") ?? "";
    expect(labelA).toContain("Borja");
    expect(labelA).toContain("WhatsApp");
    expect(labelB).toContain("Pablo");
    expect(labelB).toContain("WhatsApp");
  });

  test("renders a per-founder tooltip on each link", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const tooltips = container.querySelectorAll("[role='tooltip']");
    expect(tooltips).toHaveLength(2);
    expect(tooltips[0].textContent).toContain("Borja");
    expect(tooltips[1].textContent).toContain("Pablo");
  });

  test("FAB is hidden before mount delay (armed flag false)", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
  });

  test("FAB becomes visible after mount delay when visible=true", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("false");
  });

  test("FAB stays hidden when visible=false even after mount delay", () => {
    const { container } = render(
      <V4WhatsAppFAB {...DEFAULT_PROPS} visible={false} />
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
  });

  test("portraits hide on image error (graceful degradation)", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const portrait = container.querySelector(
      "img[data-asset-type='founder-portrait']"
    ) as HTMLImageElement;
    fireEvent.error(portrait);
    expect(portrait.style.visibility).toBe("hidden");
  });

  test("both links have target=_blank and rel=noopener noreferrer for security", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });

  test("link tabIndex is -1 while hidden", () => {
    const { container } = render(
      <V4WhatsAppFAB {...DEFAULT_PROPS} visible={false} />
    );
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("tabindex")).toBe("-1");
    });
  });

  test("tabIndex is 0 once armed and visible", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("tabindex")).toBe("0");
    });
  });

  test("portrait overlap reduced to -0.2 so the left portrait exposes >=44px tap area", () => {
    const css = readV4Css("V4WhatsAppFAB.module.css");
    expect(css).toMatch(
      /\.portraitLink \+ \.portraitLink\s*{[^}]*margin-left:\s*calc\(var\(--v4-fab-size\) \* -0\.2\)/
    );
  });

  test("no message prop renders URLs without text= parameter", () => {
    const { container } = render(
      <V4WhatsAppFAB {...DEFAULT_PROPS} message={undefined} />
    );
    const links = container.querySelectorAll("a");
    expect(links[0].getAttribute("href")).toBe("https://wa.me/34667006662");
    expect(links[1].getAttribute("href")).toBe("https://wa.me/34674527410");
  });
});
