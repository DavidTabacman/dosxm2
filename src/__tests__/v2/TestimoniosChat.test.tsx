import { expect, test, describe, vi } from "vitest";
import { render, act } from "@testing-library/react";
import TestimoniosChat from "@/components/v2/TestimoniosChat";

// Mock useSectionReveal to immediately report revealed
vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => {
    const ref = () => {};
    return [ref, true];
  },
}));

describe("V2 TestimoniosChat", () => {
  test("renders heading", () => {
    const { container } = render(<TestimoniosChat />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Lo que nos dicen nuestros clientes.");
  });

  test("renders 3 chat bubbles after typing animation", async () => {
    vi.useFakeTimers();
    const { container } = render(<TestimoniosChat />);

    // Advance past all typing + reveal delays (3 bubbles * 1200ms + 800ms)
    await act(() => vi.advanceTimersByTime(4500));

    const messages = [
      "¡Chicos, sois los mejores!",
      "Nos habéis cambiado la vida",
      "Profesionales de verdad",
    ];
    for (const msg of messages) {
      expect(container.textContent).toContain(msg);
    }

    vi.useRealTimers();
  });

  test("renders sender names with locations after animation", async () => {
    vi.useFakeTimers();
    const { container } = render(<TestimoniosChat />);

    await act(() => vi.advanceTimersByTime(4500));

    expect(container.textContent).toContain("Ana, Malasaña");
    expect(container.textContent).toContain("Pedro y Lucía, Chamberí");
    expect(container.textContent).toContain("Javier, Salamanca");

    vi.useRealTimers();
  });

  test("renders timestamps after animation", async () => {
    vi.useFakeTimers();
    const { container } = render(<TestimoniosChat />);

    await act(() => vi.advanceTimersByTime(4500));

    expect(container.textContent).toContain("14:32");
    expect(container.textContent).toContain("16:45");
    expect(container.textContent).toContain("10:15");

    vi.useRealTimers();
  });

  test("shows typing indicator before revealing message", async () => {
    vi.useFakeTimers();
    const { container } = render(<TestimoniosChat />);

    // First bubble typing state (index 0 * 1200ms = 0ms)
    await act(() => vi.advanceTimersByTime(50));

    const typingDots = container.querySelectorAll("[aria-label='Escribiendo...']");
    expect(typingDots.length).toBeGreaterThan(0);

    vi.useRealTimers();
  });

  test("renders section label 'Prueba Social'", () => {
    const { container } = render(<TestimoniosChat />);
    expect(container.textContent).toContain("Prueba Social");
  });

  test("heading area has reveal animation class", () => {
    const { container } = render(<TestimoniosChat />);
    const section = container.querySelector("section");
    const headingWrapper = section?.querySelector("div");
    expect(headingWrapper?.className).toContain("revealTarget");
    expect(headingWrapper?.className).toContain("revealTargetVisible");
  });
});
