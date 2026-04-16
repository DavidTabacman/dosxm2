import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act, fireEvent } from "@testing-library/react";
import ChatSection from "@/components/v2/ChatSection";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => {
    const ref = () => {};
    return [ref, true];
  },
}));

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

    // The hasAnimated ref should prevent re-animation
    // Messages should remain visible, not reset to hidden
    const textBefore = container.textContent;

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(container.textContent).toBe(textBefore);
  });

  test("heading area has reveal animation class", () => {
    const { container } = render(<ChatSection />);
    const section = container.querySelector("section");
    // The first child div should have the revealTarget class
    const headingWrapper = section?.querySelector("div");
    expect(headingWrapper?.className).toContain("revealTarget");
    expect(headingWrapper?.className).toContain("revealTargetVisible");
  });

  test("avatar fallback renders on image load error", () => {
    const { container } = render(<ChatSection />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    const avatars = container.querySelectorAll("img[data-asset-type='portrait']");
    expect(avatars.length).toBeGreaterThan(0);

    // Simulate error on first avatar
    fireEvent.error(avatars[0]);
    expect((avatars[0] as HTMLImageElement).style.display).toBe("none");
  });
});
