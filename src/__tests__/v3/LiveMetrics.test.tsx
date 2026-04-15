import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import LiveMetrics from "@/components/v3/LiveMetrics";

describe("V3 LiveMetrics", () => {
  test("renders text containing 'días'", () => {
    const { container } = render(<LiveMetrics />);
    expect(container.textContent).toContain("días");
  });

  test("renders text containing '%'", () => {
    const { container } = render(<LiveMetrics />);
    expect(container.textContent).toContain("%");
  });

  test("renders prose text about selling speed", () => {
    const { container } = render(<LiveMetrics />);
    expect(container.textContent).toContain("Vendemos en un promedio de");
    expect(container.textContent).toContain("con una tasa de éxito del");
  });

  test("renders two number spans", () => {
    const { container } = render(<LiveMetrics />);
    const numbers = container.querySelectorAll("span");
    expect(numbers.length).toBeGreaterThanOrEqual(2);
  });
});
