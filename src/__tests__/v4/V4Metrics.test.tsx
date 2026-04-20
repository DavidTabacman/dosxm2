import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import V4Metrics from "@/components/v4/V4Metrics";

// V4Metrics uses TWO visibility hooks:
// - useSectionReveal (fire-once) for the editorial header block
// - useSectionVisible (repeatable) for the counter grid
// Tests control each independently via shared mutable refs.
const headerRevealedRef = { current: true };
vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, headerRevealedRef.current],
}));

const gridVisibleRef = { current: true };
vi.mock("@/components/shared/useSectionVisible", () => ({
  useSectionVisible: () => [() => {}, gridVisibleRef.current],
}));

const METRICS = [
  { value: 30, suffix: " días", label: "Tiempo promedio", caption: "cap 1" },
  { value: 100, suffix: "%", label: "Tasa de éxito", caption: "cap 2" },
  {
    value: null,
    staticValue: "24/7",
    label: "Disponibilidad",
    caption: "cap 3",
  },
] as const;

describe("V4 Metrics", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    headerRevealedRef.current = true;
    gridVisibleRef.current = true;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("uses #resultados as default section id", () => {
    const { container } = render(<V4Metrics metrics={METRICS} />);
    expect(container.querySelector("section#resultados")).not.toBeNull();
  });

  test("renders heading from props", () => {
    const { container } = render(
      <V4Metrics metrics={METRICS} heading="Mi título" />
    );
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Mi título");
  });

  test("renders all metric labels", () => {
    const { container } = render(<V4Metrics metrics={METRICS} />);
    expect(container.textContent).toContain("Tiempo promedio");
    expect(container.textContent).toContain("Tasa de éxito");
    expect(container.textContent).toContain("Disponibilidad");
  });

  test("renders metric captions", () => {
    const { container } = render(<V4Metrics metrics={METRICS} />);
    expect(container.textContent).toContain("cap 1");
    expect(container.textContent).toContain("cap 2");
    expect(container.textContent).toContain("cap 3");
  });

  test("static non-numeric values are rendered verbatim", () => {
    const { container } = render(<V4Metrics metrics={METRICS} />);
    expect(container.textContent).toContain("24/7");
  });

  test("numeric metrics animate to final value after count-up duration", () => {
    const { container } = render(<V4Metrics metrics={METRICS} />);

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(container.textContent).toContain("30");
    expect(container.textContent).toContain("100");
  });

  test("numeric metrics display suffixes (e.g. %, days)", () => {
    const { container } = render(<V4Metrics metrics={METRICS} />);
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(container.textContent).toContain("días");
    expect(container.textContent).toContain("%");
  });

  test("heading has aria-labelledby connection via id", () => {
    const { container } = render(<V4Metrics metrics={METRICS} />);
    const section = container.querySelector("section");
    const labelledBy = section?.getAttribute("aria-labelledby");
    expect(labelledBy).toBe("v4-metrics-heading");
    expect(container.querySelector(`[id="${labelledBy}"]`)).not.toBeNull();
  });

  test("renders exactly one tile per metric", () => {
    const { container } = render(<V4Metrics metrics={METRICS} />);
    // Grid is the second child of .inner (header block is first).
    const inner = container.querySelector("section")!.firstElementChild!;
    const grid = inner.children[inner.children.length - 1];
    expect(grid.children.length).toBe(METRICS.length);
  });

  test("count-up resets to 0 when the grid leaves the viewport", () => {
    gridVisibleRef.current = true;
    const { container, rerender } = render(<V4Metrics metrics={METRICS} />);
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(container.textContent).toContain("30");
    expect(container.textContent).toContain("100");

    gridVisibleRef.current = false;
    rerender(<V4Metrics metrics={METRICS} />);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(container.textContent).not.toContain("30");
    expect(container.textContent).not.toContain("100");
  });

  test("count-up replays on every re-entry (not fire-once)", () => {
    gridVisibleRef.current = true;
    const { container, rerender } = render(<V4Metrics metrics={METRICS} />);
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(container.textContent).toContain("30");

    gridVisibleRef.current = false;
    rerender(<V4Metrics metrics={METRICS} />);
    act(() => {
      vi.advanceTimersByTime(0);
    });

    gridVisibleRef.current = true;
    rerender(<V4Metrics metrics={METRICS} />);
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(container.textContent).toContain("30");
    expect(container.textContent).toContain("100");
  });

  test("header block stays revealed across grid visibility toggles (header is fire-once)", () => {
    // Header should NOT re-animate on scroll-in — only the counters should.
    headerRevealedRef.current = true;
    gridVisibleRef.current = true;

    const { container, rerender } = render(<V4Metrics metrics={METRICS} />);
    const initialHeader = container.querySelector("h2")?.parentElement;
    expect(initialHeader?.className).toMatch(/staggerVisible/);

    // Simulate grid scrolling out (counter replay resets), but header
    // reveal is fire-once so it stays revealed.
    gridVisibleRef.current = false;
    rerender(<V4Metrics metrics={METRICS} />);
    const afterHeader = container.querySelector("h2")?.parentElement;
    expect(afterHeader?.className).toMatch(/staggerVisible/);
  });

  test("Metrics CSS declares a landscape-phone 3-col branch", async () => {
    const { readV4Css } = await import("../utils/readCss");
    const css = readV4Css("V4Metrics.module.css");
    expect(css).toMatch(
      /@media\s*\(max-height:\s*500px\)\s*and\s*\(orientation:\s*landscape\)/
    );
  });
});
