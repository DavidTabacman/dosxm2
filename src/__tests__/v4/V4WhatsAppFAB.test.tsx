import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act, fireEvent } from "@testing-library/react";
import V4WhatsAppFAB from "@/components/v4/V4WhatsAppFAB";

const DEFAULT_PROPS = {
  phone: "34600123456",
  message: "Hola DOSXM2",
  visible: true,
  portraitAUrl: "https://example.com/a.jpg",
  portraitAAlt: "Retrato A",
  portraitBUrl: "https://example.com/b.jpg",
  portraitBAlt: "Retrato B",
  founderAName: "Borja",
  founderBName: "Diego",
};

describe("V4 WhatsAppFAB", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders a link with a wa.me URL including the phone", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toContain("https://wa.me/34600123456");
  });

  test("encodes the prefilled message in the wa.me URL", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const href = container.querySelector("a")?.getAttribute("href") ?? "";
    expect(href).toContain("text=");
    expect(href).toContain(encodeURIComponent("Hola DOSXM2"));
  });

  test("strips non-digit characters from the phone", () => {
    const { container } = render(
      <V4WhatsAppFAB {...DEFAULT_PROPS} phone="+34 (600) 123-456" />
    );
    const href = container.querySelector("a")?.getAttribute("href") ?? "";
    expect(href).toContain("https://wa.me/34600123456");
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

  test("does NOT render the 'Hablemos por WhatsApp' label as a visible pill", () => {
    // BRD 4.2: portraits themselves are the affordance, no separate pill.
    // The tooltip CONTAINS the text but it's role=tooltip and visually
    // hidden until hover/focus — the FAB itself should never show it as
    // a persistent label next to a WhatsApp icon.
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    // There must be no WhatsApp SVG icon rendered alongside the portraits.
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(0);
  });

  test("exposes the accessible label naming both founders", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const link = container.querySelector("a");
    const ariaLabel = link?.getAttribute("aria-label") ?? "";
    expect(ariaLabel).toContain("Borja");
    expect(ariaLabel).toContain("Diego");
    expect(ariaLabel).toContain("WhatsApp");
  });

  test("includes a tooltip element for hover discoverability", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const tooltip = container.querySelector("[role='tooltip']");
    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent).toContain("Hablemos por WhatsApp");
  });

  test("FAB is hidden before mount delay (armed flag false)", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    // Immediately after render, armed is false → aria-hidden=true
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

  test("link has target=_blank and rel=noopener noreferrer for security", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const link = container.querySelector("a")!;
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("link tabIndex is -1 while hidden, 0 when visible", () => {
    const { container } = render(
      <V4WhatsAppFAB {...DEFAULT_PROPS} visible={false} />
    );
    const link = container.querySelector("a")!;
    expect(link.getAttribute("tabindex")).toBe("-1");
  });

  test("tabIndex is 0 once armed and visible", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const link = container.querySelector("a")!;
    expect(link.getAttribute("tabindex")).toBe("0");
  });

  test("no message prop renders a URL without text= parameter", () => {
    const { container } = render(
      <V4WhatsAppFAB {...DEFAULT_PROPS} message={undefined} />
    );
    const href = container.querySelector("a")?.getAttribute("href") ?? "";
    expect(href).toBe("https://wa.me/34600123456");
  });
});
