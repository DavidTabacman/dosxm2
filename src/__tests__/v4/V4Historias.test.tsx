import { expect, test, describe, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import V4Historias from "@/components/v4/V4Historias";
import { HISTORIAS } from "@/components/v4/historiasData";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

describe("V4 Historias", () => {
  test("uses #historias as default section id", () => {
    const { container } = render(<V4Historias />);
    expect(container.querySelector("section#historias")).not.toBeNull();
  });

  test("renders one card per history item", () => {
    const { container } = render(<V4Historias />);
    const cards = container.querySelectorAll("[role='button']");
    expect(cards.length).toBe(HISTORIAS.length);
  });

  test("each card is keyboard-focusable", () => {
    const { container } = render(<V4Historias />);
    container.querySelectorAll("[role='button']").forEach((card) => {
      expect(card.getAttribute("tabindex")).toBe("0");
    });
  });

  test("cards use aria-pressed to indicate flip state", () => {
    const { container } = render(<V4Historias />);
    const firstCard = container.querySelector("[role='button']")!;
    expect(firstCard.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(firstCard);
    expect(firstCard.getAttribute("aria-pressed")).toBe("true");
  });

  test("card click reveals the story copy", () => {
    const { container } = render(<V4Historias />);
    const firstCard = container.querySelector("[role='button']")!;
    fireEvent.click(firstCard);
    // The first fixture is the "Retiro ático" story; verify narrative phrase.
    expect(container.textContent).toContain(
      "En 22 días encontramos un comprador"
    );
  });

  test("aria-label toggles between 'Ver historia' and 'Volver a la foto'", () => {
    const { container } = render(<V4Historias />);
    const firstCard = container.querySelector("[role='button']")!;
    expect(firstCard.getAttribute("aria-label")).toContain("Ver historia");
    fireEvent.click(firstCard);
    expect(firstCard.getAttribute("aria-label")).toContain("Volver a la foto");
  });

  test("Enter key flips the card", () => {
    const { container } = render(<V4Historias />);
    const firstCard = container.querySelector("[role='button']")!;
    fireEvent.keyDown(firstCard, { key: "Enter" });
    expect(firstCard.getAttribute("aria-pressed")).toBe("true");
  });

  test("Space key flips the card", () => {
    const { container } = render(<V4Historias />);
    const firstCard = container.querySelector("[role='button']")!;
    fireEvent.keyDown(firstCard, { key: " " });
    expect(firstCard.getAttribute("aria-pressed")).toBe("true");
  });

  test("all property images carry lazy-loading and descriptive alt", () => {
    const { container } = render(<V4Historias />);
    const imgs = container.querySelectorAll(
      "img[data-asset-type='property-story']"
    );
    expect(imgs.length).toBe(HISTORIAS.length);
    imgs.forEach((img) => {
      expect(img.getAttribute("loading")).toBe("lazy");
      const alt = img.getAttribute("alt") ?? "";
      expect(alt.length).toBeGreaterThan(0);
    });
  });

  test("card image hides on load error (no broken UI)", () => {
    const { container } = render(<V4Historias />);
    const img = container.querySelector(
      "img[data-asset-type='property-story']"
    ) as HTMLImageElement;
    fireEvent.error(img);
    expect(img.style.visibility).toBe("hidden");
  });

  test("renders BRD heading 'Cada casa tiene su historia.'", () => {
    const { container } = render(<V4Historias />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent?.trim().replace(/\s+/g, " ")).toContain(
      "Cada casa tiene"
    );
    expect(h2?.textContent).toContain("su historia");
  });

  test("supports a custom items prop to render a limited subset", () => {
    const subset = HISTORIAS.slice(0, 2);
    const { container } = render(<V4Historias items={subset} />);
    const cards = container.querySelectorAll("[role='button']");
    expect(cards.length).toBe(2);
  });

  test("outcome text appears on the flipped (back) face", () => {
    const { container } = render(<V4Historias />);
    const firstCard = container.querySelector("[role='button']")!;
    fireEvent.click(firstCard);
    // First fixture outcome string
    expect(container.textContent).toContain(
      "Vendido en 22 días"
    );
  });
});
