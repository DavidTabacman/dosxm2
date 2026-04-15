import { expect, test, describe, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import VideoPlayPause from "@/components/shared/VideoPlayPause";

function Wrapper() {
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <div>
      <video ref={ref} data-testid="video" />
      <VideoPlayPause videoRef={ref} />
    </div>
  );
}

describe("VideoPlayPause", () => {
  test("renders button that syncs with video paused state", () => {
    const { container } = render(<Wrapper />);
    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    // jsdom videos start paused, so initial label is "Reproducir video"
    expect(button?.getAttribute("aria-label")).toBe("Reproducir video");
  });

  test("shows 'Pausar video' after clicking play on a paused video", () => {
    const { container } = render(<Wrapper />);
    const button = container.querySelector("button")!;
    const video = container.querySelector("video")!;

    // Video starts paused in jsdom, click to play
    Object.defineProperty(video, "paused", { value: true, writable: true });
    video.play = vi.fn().mockResolvedValue(undefined);
    fireEvent.click(button);

    expect(video.play).toHaveBeenCalled();
    // After clicking play, the play event listener syncs state
    fireEvent(video, new Event("play"));
    expect(button.getAttribute("aria-label")).toBe("Pausar video");
  });

  test("shows 'Reproducir video' after clicking pause on a playing video", () => {
    const { container } = render(<Wrapper />);
    const button = container.querySelector("button")!;
    const video = container.querySelector("video")!;

    // Simulate video currently playing
    Object.defineProperty(video, "paused", { value: false, writable: true });
    // Fire play event so the component syncs
    fireEvent(video, new Event("play"));
    expect(button.getAttribute("aria-label")).toBe("Pausar video");

    // Now click to pause
    video.pause = vi.fn();
    fireEvent.click(button);

    expect(video.pause).toHaveBeenCalled();
    fireEvent(video, new Event("pause"));
    expect(button.getAttribute("aria-label")).toBe("Reproducir video");
  });

  test("renders SVG icons", () => {
    const { container } = render(<Wrapper />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });
});
