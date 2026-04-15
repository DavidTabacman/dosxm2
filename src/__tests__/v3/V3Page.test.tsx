import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import V3Page from "@/pages/v3";

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("next/font/google", () => ({
  Instrument_Serif: () => ({ variable: "mock-instrument-serif" }),
  Inter: () => ({ variable: "mock-inter" }),
}));

describe("V3 Page", () => {
  test("renders all 6 sections", () => {
    const { container } = render(<V3Page />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(6);
  });

  test("contains key section headings", () => {
    const { container } = render(<V3Page />);
    const text = container.textContent ?? "";
    expect(text).toContain("Tu casa.");
    expect(text).toContain("Dos visiones. Un objetivo.");
    expect(text).toContain("Historias Vendidas");
    expect(text).toContain("Comencemos tu historia.");
  });

  test("contains meta description text", () => {
    const { container } = render(<V3Page />);
    const text = container.textContent ?? "";
    expect(text).toContain("Nuestra dedicación. El poder de dos expertos trabajando para ti.");
  });
});
