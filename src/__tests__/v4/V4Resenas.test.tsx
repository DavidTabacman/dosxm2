import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import V4Resenas from "@/components/v4/V4Resenas";
import { RESENAS } from "@/components/v4/resenasData";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

describe("V4 Resenas", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("uses #resenas as default section id", () => {
    const { container } = render(<V4Resenas />);
    expect(container.querySelector("section#resenas")).not.toBeNull();
  });

  test("heading announces the section via aria-labelledby", () => {
    const { container } = render(<V4Resenas />);
    const section = container.querySelector("section");
    const labelledBy = section?.getAttribute("aria-labelledby");
    expect(labelledBy).toBe("v4-resenas-heading");
    expect(container.querySelector(`[id="${labelledBy}"]`)).not.toBeNull();
  });

  test("bubbles are hidden initially (each row has zero meaningful content)", () => {
    const { container } = render(<V4Resenas />);
    // No review text should be visible before timers advance.
    const firstReview = RESENAS[0];
    expect(container.textContent).not.toContain(firstReview.text);
  });

  test("first review typing indicator appears at 0ms", () => {
    const { container } = render(<V4Resenas />);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    // Typing UI has aria-label "Escribiendo…"
    const typing = container.querySelector("[aria-label='Escribiendo…']");
    expect(typing).not.toBeNull();
  });

  test("first review text is revealed after 800ms", () => {
    const { container } = render(<V4Resenas />);
    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(container.textContent).toContain(RESENAS[0].text);
  });

  test("subsequent reviews appear at 1200ms stagger increments", () => {
    const { container } = render(<V4Resenas />);
    act(() => {
      // 1200 (second typing) + 800 (visible buffer) + buffer
      vi.advanceTimersByTime(2100);
    });
    expect(container.textContent).toContain(RESENAS[1].text);
  });

  test("all reviews are revealed once timers have fully elapsed", () => {
    const { container } = render(<V4Resenas />);
    act(() => {
      vi.advanceTimersByTime(1200 * RESENAS.length + 1000);
    });
    RESENAS.forEach((r) => {
      expect(container.textContent).toContain(r.text);
    });
  });

  test("bubbles use side-specific classes (left vs right)", () => {
    const { container } = render(<V4Resenas />);
    act(() => {
      vi.advanceTimersByTime(1200 * RESENAS.length + 1000);
    });
    const rowRights = container.querySelectorAll("[class*='rowRight']");
    const expectedRightCount = RESENAS.filter((r) => r.side === "right").length;
    // Placeholder rows also carry the rowRight class when they are on the right side,
    // but by this point all rows are revealed, so count should match total rightside reviews.
    expect(rowRights.length).toBeGreaterThanOrEqual(expectedRightCount);
  });
});
