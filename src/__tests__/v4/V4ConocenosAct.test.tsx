import { describe, expect, test, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import V4ConocenosAct from "@/components/v4/V4ConocenosAct";
import { FOUNDER_BIOS, FOUNDER_PABLO } from "@/constants/founders";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

const baseProps = {
  id: "pablo",
  headingId: "v4-conocenos-pablo-heading",
  side: "left" as const,
  founder: FOUNDER_PABLO,
  bio: FOUNDER_BIOS.pablo,
};

describe("V4 ConocenosAct — DOM & accessibility", () => {
  test("renders a <section> with the configured id", () => {
    const { container } = render(<V4ConocenosAct {...baseProps} />);
    expect(container.querySelector("section#pablo")).not.toBeNull();
  });

  test("section's aria-labelledby resolves to the <h2>", () => {
    const { container } = render(<V4ConocenosAct {...baseProps} />);
    const section = container.querySelector("section")!;
    const labelledBy = section.getAttribute("aria-labelledby");
    expect(labelledBy).toBe("v4-conocenos-pablo-heading");
    const heading = container.querySelector(`[id="${labelledBy}"]`);
    expect(heading?.tagName).toBe("H2");
  });

  test("data-side reflects the side prop", () => {
    const left = render(<V4ConocenosAct {...baseProps} side="left" />);
    expect(
      left.container.querySelector("section")?.getAttribute("data-side")
    ).toBe("left");
    const right = render(
      <V4ConocenosAct {...baseProps} side="right" id="borja" />
    );
    expect(
      right.container.querySelector("section")?.getAttribute("data-side")
    ).toBe("right");
  });

  test("portrait <img> wires src, alt, data-asset-type, and lazy-loads by default", () => {
    const { container } = render(<V4ConocenosAct {...baseProps} />);
    const img = container.querySelector<HTMLImageElement>(
      "img[data-asset-type='founder-portrait']"
    );
    expect(img).not.toBeNull();
    expect(img!.getAttribute("src")).toBe(FOUNDER_PABLO.portraitUrl);
    expect(img!.getAttribute("alt")).toBe(FOUNDER_PABLO.alt);
    expect(img!.getAttribute("loading")).toBe("lazy");
  });

  test("isLcp flips loading to eager and fetchpriority to high", () => {
    const { container } = render(<V4ConocenosAct {...baseProps} isLcp />);
    const img = container.querySelector<HTMLImageElement>(
      "img[data-asset-type='founder-portrait']"
    )!;
    expect(img.getAttribute("loading")).toBe("eager");
    // React 19 lowercases the attribute when rendered to DOM
    const fp =
      img.getAttribute("fetchpriority") ?? img.getAttribute("fetchPriority");
    expect(fp).toBe("high");
  });

  test("intro line (with badge) and every bio paragraph render in order", () => {
    const { container } = render(<V4ConocenosAct {...baseProps} />);
    expect(container.textContent).toContain("Yo soy Pablo");
    const badge = container.querySelector(
      "img[src='/v4/founders/pablo-emoji.svg']"
    );
    expect(badge).not.toBeNull();
    FOUNDER_BIOS.pablo.paragraphs.forEach((p) => {
      // Match a unique fragment from each paragraph to avoid false positives
      // on short ones.
      const unique = p.slice(0, 30);
      expect(container.textContent).toContain(unique);
    });
  });

  test("copy column carries the stagger + staggerVisible classes when revealed", () => {
    const { container } = render(<V4ConocenosAct {...baseProps} />);
    const copy = container.querySelector("[class*='copyColumn']");
    expect(copy).not.toBeNull();
    expect(copy!.className).toMatch(/stagger/);
    expect(copy!.className).toMatch(/staggerVisible/);
  });

  test("portrait onError hides the image (visibility: hidden) and logs", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(<V4ConocenosAct {...baseProps} />);
    const img = container.querySelector<HTMLImageElement>(
      "img[data-asset-type='founder-portrait']"
    )!;
    fireEvent.error(img);
    expect(img.style.visibility).toBe("hidden");
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  test("decorative tint overlay is aria-hidden", () => {
    const { container } = render(<V4ConocenosAct {...baseProps} />);
    const tint = container.querySelector("[class*='portraitTint']");
    expect(tint?.getAttribute("aria-hidden")).toBe("true");
  });

  test("the rule accent under the heading is aria-hidden", () => {
    const { container } = render(<V4ConocenosAct {...baseProps} />);
    const rule = container.querySelector("[class*='ruleAccent']");
    expect(rule?.getAttribute("aria-hidden")).toBe("true");
  });

  test("portraitOuter wrapper hosts the breathing animation; alt modifier on right side", () => {
    const left = render(<V4ConocenosAct {...baseProps} side="left" />);
    const leftOuter = left.container.querySelector("[class*='portraitOuter']");
    expect(leftOuter).not.toBeNull();
    expect(leftOuter!.className).not.toMatch(/portraitOuterAlt/);

    const right = render(
      <V4ConocenosAct {...baseProps} id="borja" side="right" />
    );
    const rightOuter = right.container.querySelector(
      "[class*='portraitOuter']"
    );
    expect(rightOuter!.className).toMatch(/portraitOuterAlt/);
  });
});
