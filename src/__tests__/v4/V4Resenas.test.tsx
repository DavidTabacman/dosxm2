import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import V4Resenas from "@/components/v4/V4Resenas";
import { RESENAS } from "@/components/v4/resenasData";

// The header uses the fire-once reveal (should NOT replay).
vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

// The chat uses the repeatable visibility hook — tests drive its boolean
// return via a shared mutable ref so we can flip visibility in-test.
const visibleRef = { current: true };
vi.mock("@/components/shared/useSectionVisible", () => ({
  useSectionVisible: () => [() => {}, visibleRef.current],
}));

describe("V4 Resenas", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    visibleRef.current = true;
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
    visibleRef.current = false;
    const { container } = render(<V4Resenas />);
    const firstReview = RESENAS[0];
    expect(container.textContent).not.toContain(firstReview.text);
  });

  test("first review typing indicator appears at 0ms", () => {
    const { container } = render(<V4Resenas />);
    act(() => {
      vi.advanceTimersByTime(0);
    });
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
    expect(rowRights.length).toBeGreaterThanOrEqual(expectedRightCount);
  });

  test("chat wrapper has role=log for screen readers", () => {
    const { container } = render(<V4Resenas />);
    const log = container.querySelector("[role='log']");
    expect(log).not.toBeNull();
  });

  test("leaving the viewport resets bubbles to hidden (replay-ready)", () => {
    visibleRef.current = true;
    const { container, rerender } = render(<V4Resenas />);
    act(() => {
      vi.advanceTimersByTime(1200 * RESENAS.length + 1000);
    });
    RESENAS.forEach((r) => {
      expect(container.textContent).toContain(r.text);
    });

    // Section leaves viewport — bubbles must reset.
    visibleRef.current = false;
    rerender(<V4Resenas />);
    RESENAS.forEach((r) => {
      expect(container.textContent).not.toContain(r.text);
    });
  });

  test("prefers-reduced-motion shows all reviews immediately, no typing indicator", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    try {
      visibleRef.current = true;
      const { container } = render(<V4Resenas />);

      // All reviews render immediately at mount — no 800ms wait, no
      // 1200ms stagger, no "Escribiendo…" indicator.
      RESENAS.forEach((r) => {
        expect(container.textContent).toContain(r.text);
      });
      const typing = container.querySelector("[aria-label='Escribiendo…']");
      expect(typing).toBeNull();
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  test("re-entering the section replays typing from index 0", () => {
    visibleRef.current = true;
    const { container, rerender } = render(<V4Resenas />);
    act(() => {
      vi.advanceTimersByTime(1200 * RESENAS.length + 1000);
    });
    expect(container.textContent).toContain(RESENAS[0].text);

    // Leave → bubbles reset
    visibleRef.current = false;
    rerender(<V4Resenas />);
    expect(container.textContent).not.toContain(RESENAS[0].text);

    // Re-enter → typing cascade should start fresh
    visibleRef.current = true;
    rerender(<V4Resenas />);
    // Immediately after re-entry, first bubble is in typing state
    act(() => {
      vi.advanceTimersByTime(0);
    });
    const typing = container.querySelector("[aria-label='Escribiendo…']");
    expect(typing).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1200 * RESENAS.length + 1000);
    });
    RESENAS.forEach((r) => {
      expect(container.textContent).toContain(r.text);
    });
  });
});
