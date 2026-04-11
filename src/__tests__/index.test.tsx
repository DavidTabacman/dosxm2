import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import Home from "@/pages/index";

vi.mock("next/head", () => ({
  default: () => null,
}));

describe("Under Construction Page", () => {
  test("renders headline text via sr-only span", () => {
    const { container } = render(<Home />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain("Estamos preparando algo grande");
  });

  test("renders subtext", () => {
    const { container } = render(<Home />);
    const subtext = container.querySelector("p");
    expect(subtext?.textContent).toContain("Menos propiedades");
  });

  test("has exactly one h1", () => {
    const { container } = render(<Home />);
    const headings = container.querySelectorAll("h1");
    expect(headings).toHaveLength(1);
  });

  test("has a main landmark", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main");
    expect(main).not.toBeNull();
  });

  test("background element is decorative (aria-hidden)", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main");
    const bg = main?.querySelector("[aria-hidden='true']");
    expect(bg).not.toBeNull();
  });

  test("card section has aria-labelledby pointing to headline", () => {
    const { container } = render(<Home />);
    const section = container.querySelector("section");
    expect(section?.getAttribute("aria-labelledby")).toBe("headline");
    const headline = section?.querySelector("h1");
    expect(headline?.id).toBe("headline");
  });
});
