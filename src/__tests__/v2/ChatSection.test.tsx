import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import ChatSection from "@/components/v2/ChatSection";

describe("V2 ChatSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders heading 'Una conversación, no un formulario.'", () => {
    const { container } = render(<ChatSection />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Una conversación, no un formulario.");
  });

  test("renders section label 'El Diferencial'", () => {
    const { container } = render(<ChatSection />);
    expect(container.textContent).toContain("El Diferencial");
  });

  test("renders section element", () => {
    const { container } = render(<ChatSection />);
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
  });
});
