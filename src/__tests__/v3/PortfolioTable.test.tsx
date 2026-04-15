import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import HistoriasVendidas from "@/components/v3/PortfolioTable";

describe("V3 PortfolioTable (HistoriasVendidas)", () => {
  test("renders heading 'Historias Vendidas'", () => {
    const { container } = render(<HistoriasVendidas />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Historias Vendidas");
  });

  test("renders 5 story cards", () => {
    const { container } = render(<HistoriasVendidas />);
    const images = container.querySelectorAll("img[data-asset-type='property-story']");
    expect(images).toHaveLength(5);
  });

  test("each card shows zona name", () => {
    const { container } = render(<HistoriasVendidas />);
    const text = container.textContent ?? "";
    expect(text).toContain("Chamberí");
    expect(text).toContain("Salamanca");
    expect(text).toContain("Retiro");
    expect(text).toContain("Moncloa");
    expect(text).toContain("Chamartín");
  });

  test("each card shows 'Vendido en X días'", () => {
    const { container } = render(<HistoriasVendidas />);
    const text = container.textContent ?? "";
    expect(text).toContain("Vendido en 18 días");
    expect(text).toContain("Vendido en 22 días");
    expect(text).toContain("Vendido en 31 días");
    expect(text).toContain("Vendido en 14 días");
    expect(text).toContain("Vendido en 27 días");
  });

  test("cards have alt text containing zona name", () => {
    const { container } = render(<HistoriasVendidas />);
    const images = container.querySelectorAll("img[data-asset-type='property-story']");
    expect(images[0].getAttribute("alt")).toContain("Chamberí");
    expect(images[1].getAttribute("alt")).toContain("Salamanca");
    expect(images[2].getAttribute("alt")).toContain("Retiro");
    expect(images[3].getAttribute("alt")).toContain("Moncloa");
    expect(images[4].getAttribute("alt")).toContain("Chamartín");
  });
});
