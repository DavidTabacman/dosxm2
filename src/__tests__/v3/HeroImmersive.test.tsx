import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import HeroImmersive from "@/components/v3/HeroImmersive";

describe("V3 HeroImmersive", () => {
  test("renders heading 'Tu casa.'", () => {
    const { container } = render(<HeroImmersive />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Tu casa.");
  });

  test("renders subheading text", () => {
    const { container } = render(<HeroImmersive />);
    expect(container.textContent).toContain(
      "Nuestra dedicación. El poder de dos expertos trabajando para ti."
    );
  });

  test("hero image has correct alt text", () => {
    const { container } = render(<HeroImmersive />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("Interior de propiedad en Madrid");
  });

  test("hero image loads eagerly", () => {
    const { container } = render(<HeroImmersive />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("eager");
  });

  test("hero image has data-asset-type attribute", () => {
    const { container } = render(<HeroImmersive />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("data-asset-type")).toBe("hero-video-poster");
  });
});
