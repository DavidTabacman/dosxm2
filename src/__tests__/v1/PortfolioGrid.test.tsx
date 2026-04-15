import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import PortfolioGrid from "@/components/v1/PortfolioGrid";

vi.mock("@/components/shared/useVideoPlayback", () => ({
  useVideoPlayback: () => ({
    ref: () => {},
    hasError: false,
    isPlaying: false,
  }),
}));

describe("V1 PortfolioGrid", () => {
  test("renders 'Historias Vendidas' heading", () => {
    const { container } = render(<PortfolioGrid />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Historias Vendidas");
  });

  test("renders 5 property cards", () => {
    const { container } = render(<PortfolioGrid />);
    const videos = container.querySelectorAll("video[data-asset-type='video']");
    expect(videos).toHaveLength(5);
  });

  test("renders all 5 zonas", () => {
    const { container } = render(<PortfolioGrid />);
    const zonas = ["Chamberí", "Salamanca", "Retiro", "Moncloa", "Chamartín"];
    for (const zona of zonas) {
      expect(container.textContent).toContain(zona);
    }
  });

  test("renders 'Video Tour' labels without aria-hidden", () => {
    const { container } = render(<PortfolioGrid />);
    const spans = container.querySelectorAll("span");
    const videoLabels = Array.from(spans).filter(
      (el) => el.textContent === "Video Tour"
    );
    expect(videoLabels).toHaveLength(5);
    // Video Tour labels should NOT have aria-hidden (they're informational)
    videoLabels.forEach((label) => {
      expect(label.getAttribute("aria-hidden")).toBeNull();
    });
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

  test("each card has role='group' and aria-label with zona", () => {
    const { container } = render(<PortfolioGrid />);
    const cards = container.querySelectorAll("[role='group']");
    expect(cards).toHaveLength(5);

    const zonas = ["Chamberí", "Salamanca", "Retiro", "Moncloa", "Chamartín"];
    cards.forEach((card, i) => {
      expect(card.getAttribute("aria-label")).toBe(`Propiedad en ${zonas[i]}`);
    });
  });

  test("each card has data-cursor='pointer'", () => {
    const { container } = render(<PortfolioGrid />);
    const cards = container.querySelectorAll("[data-cursor='pointer']");
    expect(cards).toHaveLength(5);
  });

  test("cards have --stagger-index CSS variable", () => {
    const { container } = render(<PortfolioGrid />);
    const cards = container.querySelectorAll("[role='group']");
    cards.forEach((card, i) => {
      const style = (card as HTMLElement).style;
      expect(style.getPropertyValue("--stagger-index")).toBe(String(i % 3));
    });
  });

  test("renders VideoPlayPause buttons for each card", () => {
    const { container } = render(<PortfolioGrid />);
    // Videos start paused in jsdom, so buttons show "Reproducir video"
    const buttons = container.querySelectorAll("button[aria-label='Reproducir video']");
    expect(buttons).toHaveLength(5);
  });
});
