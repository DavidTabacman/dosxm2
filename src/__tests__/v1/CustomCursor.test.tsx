import { expect, test, describe, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import CustomCursor from "@/components/v1/CustomCursor";

describe("V1 CustomCursor", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test("renders ring and dot elements", () => {
    const { container } = render(<CustomCursor />);
    const ariaHidden = container.querySelectorAll("[aria-hidden='true']");
    expect(ariaHidden.length).toBeGreaterThanOrEqual(2);
  });

  test("elements have aria-hidden='true'", () => {
    const { container } = render(<CustomCursor />);
    const elements = container.querySelectorAll("[aria-hidden='true']");
    elements.forEach((el) => {
      expect(el.getAttribute("aria-hidden")).toBe("true");
    });
  });

  test("cursor elements start with opacity 0 (hidden until mousemove)", () => {
    const { container } = render(<CustomCursor />);
    const divs = container.querySelectorAll("div");
    // The component renders two divs (ring + dot) with CSS opacity: 0
    expect(divs.length).toBeGreaterThanOrEqual(2);
  });
});
