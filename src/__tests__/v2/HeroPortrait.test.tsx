import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import HeroPortrait from "@/components/v2/HeroPortrait";

describe("V2 HeroPortrait", () => {
  test("renders heading 'Hola. Somos DOSXM2.'", () => {
    const { container } = render(<HeroPortrait />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Hola. Somos DOSXM2.");
  });

  test("renders subheading", () => {
    const { container } = render(<HeroPortrait />);
    expect(container.textContent).toContain(
      "Y vendemos tu casa como si fuese la nuestra. Literalmente."
    );
  });

  test("renders 2 founder portrait videos in hero", () => {
    const { container } = render(<HeroPortrait />);
    const portraits = container.querySelectorAll("video[data-asset-type='portrait']");
    expect(portraits).toHaveLength(2);
  });

  test("portraits have meaningful aria-labels", () => {
    const { container } = render(<HeroPortrait />);
    const portraits = container.querySelectorAll("video[data-asset-type='portrait']");
    expect(portraits[0].getAttribute("aria-label")).toContain("Fundador 1");
    expect(portraits[1].getAttribute("aria-label")).toContain("Fundador 2");
  });
});
