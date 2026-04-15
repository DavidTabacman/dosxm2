import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
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
