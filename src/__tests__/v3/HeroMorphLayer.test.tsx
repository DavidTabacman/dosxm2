import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import { HeroMorphProvider } from "@/components/v3/HeroMorphContext";
import HeroMorphLayer from "@/components/v3/HeroMorphLayer";

vi.mock("@/components/shared/useVideoPlayback", () => ({
  useVideoPlayback: () => ({
    ref: () => {},
    hasError: false,
    isPlaying: false,
    play: () => {},
  }),
}));

function renderWithContext() {
  return render(
    <HeroMorphProvider>
      <HeroMorphLayer />
    </HeroMorphProvider>
  );
}

describe("V3 HeroMorphLayer", () => {
  test("renders a video element with hero video src", () => {
    const { container } = renderWithContext();
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    expect(video?.getAttribute("src")).toContain("mixkit.co/videos/4029");
  });

  test("video has poster with hero image", () => {
    const { container } = renderWithContext();
    const video = container.querySelector("video");
    expect(video?.getAttribute("poster")).toContain("photo-1600596542815");
  });

  test("video has correct playback attributes", () => {
    const { container } = renderWithContext();
    const video = container.querySelector("video");
    // React sets muted as a DOM property, not an HTML attribute in jsdom
    expect((video as HTMLVideoElement)?.muted).toBe(true);
    expect(video?.hasAttribute("loop")).toBe(true);
    expect(video?.getAttribute("preload")).toBe("auto");
    expect(video?.getAttribute("data-asset-type")).toBe("hero-video");
  });

  test("container has aria-hidden='true'", () => {
    const { container } = renderWithContext();
    const layer = container.firstElementChild;
    expect(layer?.getAttribute("aria-hidden")).toBe("true");
  });

  test("falls back to img when video has error", () => {
    vi.resetModules();
    // Re-mock with hasError: true
    vi.doMock("@/components/shared/useVideoPlayback", () => ({
      useVideoPlayback: () => ({
        ref: () => {},
        hasError: true,
        isPlaying: false,
        play: () => {},
      }),
    }));

    // Dynamic import to pick up the new mock
    return import("@/components/v3/HeroMorphLayer").then((mod) => {
      const { container } = render(
        <HeroMorphProvider>
          <mod.default />
        </HeroMorphProvider>
      );
      const img = container.querySelector("img");
      expect(img).toBeTruthy();
      expect(img?.getAttribute("src")).toContain("photo-1600596542815");
      expect(img?.getAttribute("loading")).toBe("eager");
      expect(img?.getAttribute("alt")).toBe("");
    });
  });
});
