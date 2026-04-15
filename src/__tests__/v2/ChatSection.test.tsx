import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
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

  test("avatar images have descriptive alt text", () => {
    const { container } = render(<ChatSection />);

    // Advance timers to reveal all messages
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    const avatars = container.querySelectorAll("img[data-asset-type='portrait']");
    avatars.forEach((img) => {
      expect(img.getAttribute("alt")).toContain("cofundador");
    });
  });
});
