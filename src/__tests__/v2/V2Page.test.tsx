import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import V2Page from "@/pages/v2";

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("next/font/google", () => ({
  DM_Sans: () => ({ variable: "mock-dm-sans" }),
}));

describe("V2 Page", () => {
  test("renders all 6 sections", () => {
    const { container } = render(<V2Page />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(6);
  });

  test("contains key section headings", () => {
    const { container } = render(<V2Page />);
    const text = container.textContent ?? "";
    expect(text).toContain("Hola. Somos DOSXM2.");
    expect(text).toContain("Una conversación, no un formulario.");
    expect(text).toContain("Cada casa tiene su historia.");
    expect(text).toContain("Cuéntanos sobre tu casa.");
  });
});
