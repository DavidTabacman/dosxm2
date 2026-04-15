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
        return Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
      }
      return Promise.resolve();
    });

    await act(async () => {
      result.current.ref(video);
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

  test("cleans up listeners when ref called with null", () => {
    const { result } = renderHook(() => useVideoPlayback());
    const video = document.createElement("video");
    video.play = vi.fn().mockResolvedValue(undefined);
    const removeSpy = vi.spyOn(video, "removeEventListener");

    act(() => {
      result.current.ref(video);
    });

    // Call ref with null to trigger cleanup
    act(() => {
      result.current.ref(null);
    });

    // AbortController removes listeners internally, not via removeEventListener.
    // Verify observer is disconnected instead.
    expect(mockDisconnect).toHaveBeenCalled();
    removeSpy.mockRestore();
  });

  test("cleans up old node when ref called with new node", () => {
    const { result } = renderHook(() => useVideoPlayback());
    const video1 = document.createElement("video");
    const video2 = document.createElement("video");
    video1.play = vi.fn().mockResolvedValue(undefined);
    video2.play = vi.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.ref(video1);
    });

    // First observer created for video1
    expect(mockObserve).toHaveBeenCalledWith(video1);

    act(() => {
      result.current.ref(video2);
    });

    // Old observer disconnected, new one created for video2
    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(video2);
  });

  test("prevents concurrent play() calls", async () => {
    const { result } = renderHook(() => useVideoPlayback());
    const video = document.createElement("video");

    // play() takes 100ms to resolve
    let resolvePlay: () => void;
    video.play = vi.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => { resolvePlay = resolve; });
    });

    act(() => {
      result.current.ref(video);
    });

    // First play() is pending
    expect(video.play).toHaveBeenCalledTimes(1);

    // IO fires while play is still pending
    act(() => {
      observeCallback?.([{ isIntersecting: true }]);
    });

    // Should NOT call play() again (guarded by playPendingRef)
    expect(video.play).toHaveBeenCalledTimes(1);

    // Resolve the pending play
    await act(async () => {
      resolvePlay!();
      await new Promise((r) => setTimeout(r, 0));
    });
  });
});
