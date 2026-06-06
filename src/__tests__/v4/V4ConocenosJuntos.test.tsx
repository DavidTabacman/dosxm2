import { describe, expect, test, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import V4ConocenosJuntos from "@/components/v4/V4ConocenosJuntos";
import {
  FOUNDER_BORJA,
  FOUNDER_PABLO,
  JUNTOS_HEADING,
  JUNTOS_PARAGRAPHS,
  TOGETHER_IMAGE,
} from "@/constants/founders";

// V4ConocenosJuntos calls useSectionReveal twice (0.15 for the heading +
// copy stagger, 0.6 fire-once for the strip convergence). The shared mock
// returns the revealed state for both — tests therefore see the locked,
// post-converged DOM.
vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

describe("V4 ConocenosJuntos — DOM & accessibility", () => {
  test("renders the section with default id 'juntos'", () => {
    const { container } = render(<V4ConocenosJuntos />);
    expect(container.querySelector("section[id='juntos']")).not.toBeNull();
  });

  test("aria-labelledby resolves to the <h2>", () => {
    const { container } = render(<V4ConocenosJuntos />);
    const section = container.querySelector("section")!;
    expect(section.getAttribute("aria-labelledby")).toBe(
      "v4-conocenos-juntos-heading"
    );
    const heading = container.querySelector(
      "[id='v4-conocenos-juntos-heading']"
    );
    expect(heading?.tagName).toBe("H2");
    expect(heading?.textContent).toContain(JUNTOS_HEADING);
  });

  test("diptych contains exactly 3 imagery slots: Pablo, together, Borja", () => {
    const { container } = render(<V4ConocenosJuntos />);
    const diptych = container.querySelector("[class*='diptych']")!;
    const slots = diptych.querySelectorAll("[class*='diptychSlot']");
    expect(slots).toHaveLength(2);
    const together = diptych.querySelector("[class*='togetherFrame']");
    expect(together).not.toBeNull();
    // Slot indices are explicit data attributes for the convergence CSS.
    expect(slots[0].getAttribute("data-slot-index")).toBe("0");
    expect(slots[1].getAttribute("data-slot-index")).toBe("1");
  });

  test("solo portraits are decorative (aria-hidden, empty alt) and use lazy loading", () => {
    const { container } = render(<V4ConocenosJuntos />);
    const slots = container.querySelectorAll("[class*='diptychSlot']");
    slots.forEach((slot) => {
      expect(slot.getAttribute("aria-hidden")).toBe("true");
      const img = slot.querySelector("img");
      expect(img?.getAttribute("alt")).toBe("");
      expect(img?.getAttribute("loading")).toBe("lazy");
    });
    // Pablo first, Borja second — matches the convergence narrative.
    // next/image rewrites src to the optimizer URL; assert it wraps the source.
    expect(
      decodeURIComponent(slots[0].querySelector("img")!.getAttribute("src")!)
    ).toContain(FOUNDER_PABLO.portraitUrl);
    expect(
      decodeURIComponent(slots[1].querySelector("img")!.getAttribute("src")!)
    ).toContain(FOUNDER_BORJA.portraitUrl);
  });

  test("together image is a single optimized <img> (next/image auto-negotiates AVIF/WebP)", () => {
    const { container } = render(<V4ConocenosJuntos />);
    // The manual <picture>/<source webp> tree was dropped in favour of
    // next/image, which serves AVIF/WebP via the optimizer's Accept negotiation.
    expect(container.querySelector("picture")).toBeNull();
    const img = container.querySelector<HTMLImageElement>(
      "img[data-asset-type='together']"
    );
    expect(img).not.toBeNull();
    expect(decodeURIComponent(img!.getAttribute("src")!)).toContain(
      TOGETHER_IMAGE.jpgFallback
    );
    expect(img!.getAttribute("alt")).toBe(TOGETHER_IMAGE.alt);
  });

  test("all 4 BRD §6 paragraphs render in the copy block", () => {
    const { container } = render(<V4ConocenosJuntos />);
    JUNTOS_PARAGRAPHS.forEach((p) => {
      expect(container.textContent).toContain(p.slice(0, 30));
    });
  });

  test("closing CTA links to /#contacto with label 'Hablemos' by default", () => {
    const { container } = render(<V4ConocenosJuntos />);
    const cta = container.querySelector("a[class*='cta']") as HTMLAnchorElement;
    expect(cta).not.toBeNull();
    expect(cta.getAttribute("href")).toBe("/#contacto");
    expect(cta.textContent).toContain("Hablemos");
  });

  test("ctaHref and ctaLabel props override defaults", () => {
    const { container } = render(
      <V4ConocenosJuntos ctaHref="/v4/contacto-alt" ctaLabel="Escríbenos" />
    );
    const cta = container.querySelector("a[class*='cta']") as HTMLAnchorElement;
    expect(cta.getAttribute("href")).toBe("/v4/contacto-alt");
    expect(cta.textContent).toContain("Escríbenos");
  });

  test("data-converging locks to 'true' once the strip is revealed", () => {
    // The strip uses a fire-once useSectionReveal(0.6), so once the
    // founders have visually joined, the joint state holds forever —
    // no reversal when scrolling past the section or back up + down.
    const { container } = render(<V4ConocenosJuntos />);
    const diptych = container.querySelector("[class*='diptych']");
    expect(diptych?.getAttribute("data-converging")).toBe("true");
  });

  test("together image onError hides without removing the element", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(<V4ConocenosJuntos />);
    const img = container.querySelector(
      "img[data-asset-type='together']"
    ) as HTMLImageElement;
    fireEvent.error(img);
    expect(img.style.visibility).toBe("hidden");
    expect(img.isConnected).toBe(true);
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  test("copy block uses stagger + staggerVisible classes when revealed", () => {
    const { container } = render(<V4ConocenosJuntos />);
    const copy = container.querySelector("[class*='copy']");
    expect(copy?.className).toMatch(/stagger/);
    expect(copy?.className).toMatch(/staggerVisible/);
  });
});
