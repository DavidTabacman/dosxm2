import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import PruebaSocial from "@/components/v3/PruebaSocial";

describe("V3 PruebaSocial", () => {
  test("renders blockquote with quote text", () => {
    const { container } = render(<PruebaSocial />);
    const blockquote = container.querySelector("blockquote");
    expect(blockquote).not.toBeNull();
    expect(blockquote?.textContent).toContain(
      "Entendieron el valor de nuestra casa desde el primer minuto."
    );
  });

  test("renders cite with author attribution", () => {
    const { container } = render(<PruebaSocial />);
    const cite = container.querySelector("cite");
    expect(cite?.textContent).toContain("Familia García, Salamanca");
  });

  test("background image is decorative", () => {
    const { container } = render(<PruebaSocial />);
    const bgImg = container.querySelector("img[data-asset-type='testimonial-bg']");
    expect(bgImg?.getAttribute("alt")).toBe("");
    expect(bgImg?.getAttribute("aria-hidden")).toBe("true");
  });
});
