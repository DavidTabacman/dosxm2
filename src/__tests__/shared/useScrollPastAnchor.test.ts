import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollPastAnchor } from "@/components/shared/useScrollPastAnchor";

describe("useScrollPastAnchor", () => {
  let originalIO: typeof IntersectionObserver;
  let observeCallback: IntersectionObserverCallback | null;
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let anchor: HTMLElement;

  beforeEach(() => {
    originalIO = globalThis.IntersectionObserver;
    observeCallback = null;
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    globalThis.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback
    ) {
      observeCallback = callback;
      this.observe = mockObserve;
      this.disconnect = mockDisconnect;
      this.unobserve = vi.fn();
      this.root = null;
      this.rootMargin = "";
      this.thresholds = [];
      this.takeRecords = () => [];
    }) as unknown as typeof IntersectionObserver;

    anchor = document.createElement("section");
    anchor.id = "test-anchor";
    document.body.appendChild(anchor);
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIO;
    if (anchor.parentNode) anchor.parentNode.removeChild(anchor);
  });

  function fireIO(bottom: number) {
    if (!observeCallback) throw new Error("IO callback not set");
    const entry = {
      boundingClientRect: { bottom } as DOMRectReadOnly,
      isIntersecting: bottom > 0,
      target: anchor,
    } as unknown as IntersectionObserverEntry;
    observeCallback(
      [entry],
      {} as IntersectionObserver
    );
  }

  test("returns false initially", () => {
    const { result } = renderHook(() => useScrollPastAnchor("#test-anchor"));
    expect(result.current).toBe(false);
  });

  test("returns true when boundingClientRect.bottom <= 0 (scrolled past)", () => {
    const { result } = renderHook(() => useScrollPastAnchor("#test-anchor"));
    act(() => {
      fireIO(-50);
    });
    expect(result.current).toBe(true);
  });

  test("returns false when anchor is still in or below viewport", () => {
    const { result } = renderHook(() => useScrollPastAnchor("#test-anchor"));
    act(() => {
      fireIO(400);
    });
    expect(result.current).toBe(false);
  });

  test("toggles back to false when scrolling up past the anchor", () => {
    const { result } = renderHook(() => useScrollPastAnchor("#test-anchor"));
    act(() => {
      fireIO(-100);
    });
    expect(result.current).toBe(true);

    act(() => {
      fireIO(50);
    });
    expect(result.current).toBe(false);
  });

  test("disconnects on unmount", () => {
    const { unmount } = renderHook(() => useScrollPastAnchor("#test-anchor"));
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
