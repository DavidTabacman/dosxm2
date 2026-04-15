import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVideoPlayback } from "@/components/shared/useVideoPlayback";

describe("useVideoPlayback", () => {
  let originalIO: typeof IntersectionObserver;
  let observeCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null;
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    originalIO = globalThis.IntersectionObserver;
    observeCallback = null;
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    globalThis.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback
    ) {
      observeCallback = callback as (entries: Partial<IntersectionObserverEntry>[]) => void;
      this.observe = mockObserve;
      this.disconnect = mockDisconnect;
      this.unobserve = vi.fn();
      this.root = null;
      this.rootMargin = "";
      this.thresholds = [];
      this.takeRecords = () => [];
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIO;
    vi.restoreAllMocks();
  });

  test("returns hasError false and isPlaying false initially", () => {
    const { result } = renderHook(() => useVideoPlayback());
    expect(result.current.hasError).toBe(false);
    expect(result.current.isPlaying).toBe(false);
  });

  test("calls play() when ref is attached to a video element", async () => {
    const { result } = renderHook(() => useVideoPlayback());
    const video = document.createElement("video");
    video.play = vi.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.ref(video);
    });

    expect(video.play).toHaveBeenCalled();
  });

  test("retries with muted=true on NotAllowedError", async () => {
    const { result } = renderHook(() => useVideoPlayback());
    const video = document.createElement("video");
    let callCount = 0;
    video.play = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        const error = new DOMException("Autoplay blocked", "NotAllowedError");
        return Promise.reject(error);
      }
      return Promise.resolve();
    });

    await act(async () => {
      result.current.ref(video);
      // Allow microtasks to resolve
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(video.muted).toBe(true);
    expect(video.play).toHaveBeenCalledTimes(2);
  });

  test("sets hasError after second NotAllowedError failure", async () => {
    const { result } = renderHook(() => useVideoPlayback());
    const video = document.createElement("video");
    const error = new DOMException("Autoplay blocked", "NotAllowedError");
    video.play = vi.fn().mockRejectedValue(error);

    await act(async () => {
      result.current.ref(video);
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.hasError).toBe(true);
  });

  test("sets up IntersectionObserver on the video element", () => {
    const { result } = renderHook(() => useVideoPlayback());
    const video = document.createElement("video");
    video.play = vi.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.ref(video);
    });

    expect(mockObserve).toHaveBeenCalledWith(video);
  });

  test("pauses video when IntersectionObserver reports not visible", () => {
    const { result } = renderHook(() => useVideoPlayback());
    const video = document.createElement("video");
    video.play = vi.fn().mockResolvedValue(undefined);
    video.pause = vi.fn();

    act(() => {
      result.current.ref(video);
    });

    act(() => {
      observeCallback?.([{ isIntersecting: false }]);
    });

    expect(video.pause).toHaveBeenCalled();
  });

  test("cleans up observer on unmount", () => {
    const { result, unmount } = renderHook(() => useVideoPlayback());
    const video = document.createElement("video");
    video.play = vi.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.ref(video);
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
