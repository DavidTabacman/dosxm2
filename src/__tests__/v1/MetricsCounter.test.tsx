import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import MetricsCounter from "@/components/v1/MetricsCounter";

describe("V1 MetricsCounter", () => {
  test("renders 3 metrics", () => {
    const { container } = render(<MetricsCounter />);
    expect(container.textContent).toContain("Días Promedio");
    expect(container.textContent).toContain("Éxito");
    expect(container.textContent).toContain("Satisfacción");
  });

  test("metric labels match PRD specification", () => {
    const { container } = render(<MetricsCounter />);
    const labels = ["Días Promedio", "Éxito", "Satisfacción"];
    for (const label of labels) {
      expect(container.textContent).toContain(label);
    }
  });

  test("renders divider elements between value and label", () => {
    const { container } = render(<MetricsCounter />);
    const dividers = container.querySelectorAll("[aria-hidden='true']");
    expect(dividers.length).toBeGreaterThanOrEqual(3);
  });
});
