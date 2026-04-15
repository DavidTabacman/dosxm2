import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import V1Page from "@/pages/v1";

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("next/font/google", () => ({
  Playfair_Display: () => ({ variable: "mock-playfair" }),
  Space_Grotesk: () => ({ variable: "mock-space" }),
}));

describe("V1 Page", () => {
  test("renders all 6 sections", () => {
    const { container } = render(<V1Page />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(6);
  });

  test("contains key section headings", () => {
    const { container } = render(<V1Page />);
    const text = container.textContent ?? "";
    expect(text).toContain("Vendemos tu casa");
    expect(text).toContain("Dos visiones. Un objetivo.");
    expect(text).toContain("Historias Vendidas");
    expect(text).toContain("¿Cuánto vale tu historia?");
  });
});
