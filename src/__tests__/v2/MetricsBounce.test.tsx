import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import MetricsBounce from "@/components/v2/MetricsBounce";

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
});
