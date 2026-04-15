import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import HeroSplit from "@/components/v1/HeroSplit";

vi.mock("@/components/shared/useMousePosition", () => ({
  useMousePosition: () => ({ x: 0.5, y: 0.5 }),
}));

describe("V1 HeroSplit", () => {
  test("renders heading 'Vendemos tu casa'", () => {
    const { container } = render(<HeroSplit />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Vendemos tu casa");
  });

  test("renders right panel copy 'como si fuese la nuestra.'", () => {
    const { container } = render(<HeroSplit />);
    expect(container.textContent).toContain("como si fuese la nuestra.");
  });

  test("renders subheading with correct copy", () => {
    const { container } = render(<HeroSplit />);
    expect(container.textContent).toContain(
      "En un sector donde la mayoría trabaja solo, nosotros somos dos."
    );
  });

  test("renders two background images with data-asset-type", () => {
    const { container } = render(<HeroSplit />);
    const images = container.querySelectorAll("img[data-asset-type='hero-bg']");
    expect(images).toHaveLength(2);
  });

  test("renders divider element", () => {
    const { container } = render(<HeroSplit />);
    const divider = container.querySelector("[aria-hidden='true']");
    expect(divider).not.toBeNull();
  });
});
