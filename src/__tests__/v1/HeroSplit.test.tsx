import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import HeroSplit from "@/components/v1/HeroSplit";

vi.mock("@/components/shared/useMousePosition", () => ({
  useMousePosition: () => ({ x: 0.5, y: 0.5 }),
}));

vi.mock("@/components/shared/useVideoPlayback", () => ({
  useVideoPlayback: () => ({
    ref: () => {},
    hasError: false,
    isPlaying: false,
  }),
}));

describe("V1 HeroSplit", () => {
  test("renders heading 'Vendemos tu casa'", () => {
    const { container } = render(<HeroSplit />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Vendemos tu casa");
  });

  test("renders right panel copy 'como si fuese la nuestra.'", () => {
    const { container } = render(<HeroSplit />);
    expect(container.textContent).toContain("como si fuese la nuestra.");
  });

  test("renders subheading with correct copy", () => {
    const { container } = render(<HeroSplit />);
    expect(container.textContent).toContain(
      "En un sector donde la mayoría trabaja solo, nosotros somos dos."
    );
  });

  test("renders two background videos with data-asset-type", () => {
    const { container } = render(<HeroSplit />);
    const videos = container.querySelectorAll("video[data-asset-type='hero-bg']");
    expect(videos).toHaveLength(2);
  });

  test("renders divider element", () => {
    const { container } = render(<HeroSplit />);
    const divider = container.querySelector("[aria-hidden='true']");
    expect(divider).not.toBeNull();
  });

  test("sets --divider-pos CSS variable on hero container", () => {
    const { container } = render(<HeroSplit />);
    const section = container.querySelector("section");
    // With x=0.5, dividerPos = 30 + 0.5 * 40 = 50
    expect(section?.style.getPropertyValue("--divider-pos")).toBe("50%");
  });

  test("hero section has data-cursor='split' attribute", () => {
    const { container } = render(<HeroSplit />);
    const section = container.querySelector("[data-cursor='split']");
    expect(section).not.toBeNull();
  });

  test("renders VideoPlayPause buttons for accessibility", () => {
    const { container } = render(<HeroSplit />);
    const buttons = container.querySelectorAll("button[aria-label]");
    const videoButtons = Array.from(buttons).filter(
      (b) =>
        b.getAttribute("aria-label") === "Pausar video" ||
        b.getAttribute("aria-label") === "Reproducir video"
    );
    expect(videoButtons).toHaveLength(2);
  });

  test("videos have preload='metadata' for above-fold optimization", () => {
    const { container } = render(<HeroSplit />);
    const videos = container.querySelectorAll("video");
    videos.forEach((video) => {
      expect(video.getAttribute("preload")).toBe("metadata");
    });
  });
});

describe("V1 HeroSplit video fallback", () => {
  test("shows poster image when video has error", () => {
    vi.resetModules();

    // Re-mock with hasError = true
    vi.doMock("@/components/shared/useVideoPlayback", () => ({
      useVideoPlayback: () => ({
        ref: () => {},
        hasError: true,
        isPlaying: false,
      }),
    }));
    vi.doMock("@/components/shared/useMousePosition", () => ({
      useMousePosition: () => ({ x: 0.5, y: 0.5 }),
    }));

    // Dynamic import to get the re-mocked version
    return import("@/components/v1/HeroSplit").then(({ default: HeroSplitFallback }) => {
      const { container } = render(<HeroSplitFallback />);
      const imgs = container.querySelectorAll("img[aria-hidden='true']");
      expect(imgs.length).toBeGreaterThanOrEqual(2);
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(0);
    });
  });
});
