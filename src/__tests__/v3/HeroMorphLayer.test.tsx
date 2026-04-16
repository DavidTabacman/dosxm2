import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import { HeroMorphProvider } from "@/components/v3/HeroMorphContext";
import HeroMorphLayer from "@/components/v3/HeroMorphLayer";

function renderWithContext() {
  return render(
    <HeroMorphProvider>
      <HeroMorphLayer />
    </HeroMorphProvider>
  );
}

describe("V3 HeroMorphLayer", () => {
  test("renders an image with the hero src", () => {
    const { container } = renderWithContext();
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toContain("photo-1600596542815");
  });

  test("container has aria-hidden='true'", () => {
    const { container } = renderWithContext();
    const layer = container.firstElementChild;
    expect(layer?.getAttribute("aria-hidden")).toBe("true");
  });

  test("image loads eagerly", () => {
    const { container } = renderWithContext();
    const img = container.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("eager");
  });

  test("image has empty alt (decorative)", () => {
    const { container } = renderWithContext();
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("");
  });
});
