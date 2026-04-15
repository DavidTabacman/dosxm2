import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import PortfolioGrid from "@/components/v1/PortfolioGrid";

describe("V1 PortfolioGrid", () => {
  test("renders 'Historias Vendidas' heading", () => {
    const { container } = render(<PortfolioGrid />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Historias Vendidas");
  });

  test("renders 5 property cards", () => {
    const { container } = render(<PortfolioGrid />);
    const images = container.querySelectorAll("img[data-asset-type='video']");
    expect(images).toHaveLength(5);
  });

  test("renders all 5 zonas", () => {
    const { container } = render(<PortfolioGrid />);
    const zonas = ["Chamberí", "Salamanca", "Retiro", "Moncloa", "Chamartín"];
    for (const zona of zonas) {
      expect(container.textContent).toContain(zona);
    }
  });

  test("renders 'Video Tour' labels", () => {
    const { container } = render(<PortfolioGrid />);
    const labels = container.querySelectorAll("[aria-hidden='true']");
    const videoLabels = Array.from(labels).filter(
      (el) => el.textContent === "Video Tour"
    );
    expect(videoLabels).toHaveLength(5);
  });

  test("each card has meta text with 'Vendido en'", () => {
    const { container } = render(<PortfolioGrid />);
    const text = container.textContent ?? "";
    expect((text.match(/Vendido en/g) ?? []).length).toBe(5);
  });

  test("renders section label 'Nuestro Portfolio'", () => {
    const { container } = render(<PortfolioGrid />);
    expect(container.textContent).toContain("Nuestro Portfolio");
  });
});
