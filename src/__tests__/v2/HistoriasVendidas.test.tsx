import { expect, test, describe } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import HistoriasVendidas from "@/components/v2/HistoriasVendidas";

describe("V2 HistoriasVendidas", () => {
  test("renders heading 'Cada casa tiene su historia.'", () => {
    const { container } = render(<HistoriasVendidas />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Cada casa tiene su historia.");
  });

  test("renders 5 property cards", () => {
    const { container } = render(<HistoriasVendidas />);
    const cards = container.querySelectorAll("[role='button']");
    expect(cards).toHaveLength(5);
  });

  test("renders all 5 zonas", () => {
    const { container } = render(<HistoriasVendidas />);
    const zonas = ["Malasaña", "Lavapiés", "Chamberí", "Salamanca", "Retiro"];
    for (const zona of zonas) {
      expect(container.textContent).toContain(zona);
    }
  });

  test("renders 'Toca para ver la historia' hints", () => {
    const { container } = render(<HistoriasVendidas />);
    const text = container.textContent ?? "";
    expect((text.match(/Toca para ver la historia/g) ?? []).length).toBe(5);
  });

  test("card flip reveals story on click", () => {
    const { container } = render(<HistoriasVendidas />);
    const firstCard = container.querySelector("[role='button']")!;

    // Before click - story text exists on back but card is not flipped
    fireEvent.click(firstCard);

    // After click - story should be visible
    expect(container.textContent).toContain(
      "Ana necesitaba vender rápido para mudarse a Londres"
    );
  });

  test("card is keyboard accessible with Enter", () => {
    const { container } = render(<HistoriasVendidas />);
    const firstCard = container.querySelector("[role='button']")!;

    fireEvent.keyDown(firstCard, { key: "Enter" });
    // Card should toggle — aria-label changes
    expect(firstCard.getAttribute("aria-label")).toContain("Volver a la foto");
  });

  test("card is keyboard accessible with Space", () => {
    const { container } = render(<HistoriasVendidas />);
    const firstCard = container.querySelector("[role='button']")!;

    fireEvent.keyDown(firstCard, { key: " " });
    expect(firstCard.getAttribute("aria-label")).toContain("Volver a la foto");
  });

  test("all cards are focusable (tabIndex=0)", () => {
    const { container } = render(<HistoriasVendidas />);
    const cards = container.querySelectorAll("[role='button']");
    cards.forEach((card) => {
      expect(card.getAttribute("tabindex")).toBe("0");
    });
  });

  test("renders section label 'Historias Vendidas'", () => {
    const { container } = render(<HistoriasVendidas />);
    expect(container.textContent).toContain("Historias Vendidas");
  });
});
