import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act, fireEvent } from "@testing-library/react";
import HeroPortrait from "@/components/v2/HeroPortrait";

describe("V2 HeroPortrait", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders heading 'Hola. Somos DOSXM2.'", () => {
    const { container } = render(<HeroPortrait />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Hola. Somos DOSXM2.");
  });

  test("renders subheading", () => {
    const { container } = render(<HeroPortrait />);
    expect(container.textContent).toContain(
      "Y vendemos tu casa como si fuese la nuestra. Literalmente."
    );
  });

  test("renders 2 founder portrait videos in hero", () => {
    const { container } = render(<HeroPortrait />);
    const portraits = container.querySelectorAll("video[data-asset-type='portrait']");
    expect(portraits).toHaveLength(2);
  });

  test("portraits have descriptive aria-labels", () => {
    const { container } = render(<HeroPortrait />);
    const portraits = container.querySelectorAll("video[data-asset-type='portrait']");
    expect(portraits[0].getAttribute("aria-label")).toContain("cofundador");
    expect(portraits[1].getAttribute("aria-label")).toContain("cofundador");
  });

  test("videos always present in DOM regardless of scroll state", () => {
    const { container } = render(<HeroPortrait />);
    // Videos should always be in the DOM (not conditionally rendered)
    const videos = container.querySelectorAll("video[data-asset-type='portrait']");
    expect(videos).toHaveLength(2);
  });

  test("FAB images present after mount delay", () => {
    const { container } = render(<HeroPortrait />);

    // Advance past the 100ms mount delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    const fabImages = container.querySelectorAll("img[data-asset-type='portrait']");
    expect(fabImages).toHaveLength(2);
  });

  test("FAB image fallback on error", () => {
    const { container } = render(<HeroPortrait />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const fabImages = container.querySelectorAll("img[data-asset-type='portrait']");
    expect(fabImages.length).toBeGreaterThan(0);

    fireEvent.error(fabImages[0]);
    expect((fabImages[0] as HTMLImageElement).style.display).toBe("none");
  });
});
