import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import V4Metrics from "@/components/v4/V4Metrics";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
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

    // Drive the count-up RAF loop to completion (2000ms duration + buffer).
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
    const grid = container.querySelector("section")!.querySelector("div > div:last-child");
    const tiles = grid?.children ?? [];
    expect(tiles.length).toBe(METRICS.length);
  });
});
