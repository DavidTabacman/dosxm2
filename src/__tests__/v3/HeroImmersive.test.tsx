import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import { HeroMorphProvider } from "@/components/v3/HeroMorphContext";
import HeroImmersive from "@/components/v3/HeroImmersive";

function renderWithContext() {
  return render(
    <HeroMorphProvider>
      <HeroImmersive />
    </HeroMorphProvider>
  );
}

describe("V3 HeroImmersive", () => {
  test("renders heading 'Tu casa.'", () => {
    const { container } = renderWithContext();
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Tu casa.");
  });

  test("renders subheading text", () => {
    const { container } = renderWithContext();
    expect(container.textContent).toContain(
      "Nuestra dedicación. El poder de dos expertos trabajando para ti."
    );
  });

  test("fallback image has correct alt text", () => {
    const { container } = renderWithContext();
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("Interior de propiedad en Madrid");
  });

  test("fallback image loads eagerly", () => {
    const { container } = renderWithContext();
    const img = container.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("eager");
  });

  test("fallback image has data-asset-type attribute", () => {
    const { container } = renderWithContext();
    const img = container.querySelector("img");
    expect(img?.getAttribute("data-asset-type")).toBe("hero-video-poster");
  });
});
