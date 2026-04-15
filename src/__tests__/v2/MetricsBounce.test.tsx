import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import MetricsBounce from "@/components/v2/MetricsBounce";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => {
    const ref = () => {};
    return [ref, true];
  },
}));

describe("V2 MetricsBounce", () => {
  test("renders 3 metric labels", () => {
    const { container } = render(<MetricsBounce />);
    expect(container.textContent).toContain("Vendemos en");
    expect(container.textContent).toContain("De éxito");
    expect(container.textContent).toContain("Clientes felices");
  });

  test("renders metric suffixes", () => {
    const { container } = render(<MetricsBounce />);
    expect(container.textContent).toContain("días");
    expect(container.textContent).toContain("%");
    expect(container.textContent).toContain("+");
  });

  test("renders a section element", () => {
    const { container } = render(<MetricsBounce />);
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
  });

  test("circles have aria-label with real metric values", () => {
    const { container } = render(<MetricsBounce />);
    const circles = container.querySelectorAll("[aria-label]");
    const labels = Array.from(circles).map((c) => c.getAttribute("aria-label"));
    expect(labels).toContain("Vendemos en: 45 días");
    expect(labels).toContain("De éxito: 68%");
    expect(labels).toContain("Clientes felices: 35+");
  });
});

describe("V2 MetricsBounce timeout fallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("metrics animate after timeout fallback when observer does not fire", async () => {
    // Reset module to use a non-triggering mock
    vi.resetModules();
    vi.doMock("@/components/shared/useSectionReveal", () => ({
      useSectionReveal: () => {
        const ref = () => {};
        return [ref, false]; // Never triggers
      },
    }));

    const { default: MetricsBounceLocal } = await import(
      "@/components/v2/MetricsBounce"
    );
    const { container } = render(<MetricsBounceLocal />);

    // Before timeout, circles should not have inView class
    const circlesBefore = container.querySelectorAll("[class*='inView']");
    expect(circlesBefore).toHaveLength(0);

    // After 3s timeout, forceShow kicks in
    act(() => {
      vi.advanceTimersByTime(3100);
    });

    const circlesAfter = container.querySelectorAll("[class*='inView']");
    expect(circlesAfter).toHaveLength(3);
  });
});
