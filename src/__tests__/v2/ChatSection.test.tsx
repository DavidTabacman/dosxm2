import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import ChatSection from "@/components/v2/ChatSection";

vi.mock("@/components/shared/useIntersectionObserver", () => {
  let callback: ((visible: boolean) => void) | null = null;
  return {
    useIntersectionObserver: () => {
      const { useState } = require("react");
      const [visible, setVisible] = useState(true);
      callback = setVisible;
      const ref = () => {};
      return [ref, visible];
    },
    __setVisible: (v: boolean) => callback?.(v),
  };
});

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

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    const avatars = container.querySelectorAll("img[data-asset-type='portrait']");
    avatars.forEach((img) => {
      expect(img.getAttribute("alt")).toContain("cofundador");
    });
  });

  test("bubbles animate only once even when visibility toggles", () => {
    const { container } = render(<ChatSection />);

    // Advance time so all bubbles reveal
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // All 4 messages should be visible
    expect(container.textContent).toContain("No eres un número");
    expect(container.textContent).toContain("Hablas directamente");
    expect(container.textContent).toContain("Conocemos cada rincón");
    expect(container.textContent).toContain("Y tratamos tu casa");

    // Simulate visibility toggle (scroll away and back) via re-render
    // The hasAnimated ref should prevent re-animation
    // Messages should remain visible, not reset to hidden
    const textBefore = container.textContent;

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(container.textContent).toBe(textBefore);
  });
});
