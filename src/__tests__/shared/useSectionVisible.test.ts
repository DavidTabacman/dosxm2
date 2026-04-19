import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSectionVisible } from "@/components/shared/useSectionVisible";

describe("useSectionVisible (repeatable)", () => {
  let originalIO: typeof IntersectionObserver;
  let observeCallback:
    | ((entries: Partial<IntersectionObserverEntry>[]) => void)
    | null;
  let mockDisconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    originalIO = globalThis.IntersectionObserver;
    observeCallback = null;
    mockDisconnect = vi.fn();

    globalThis.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback
    ) {
      observeCallback = callback as (
        entries: Partial<IntersectionObserverEntry>[]
      ) => void;
      this.observe = vi.fn();
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
  });

  test("returns false initially", () => {
    const { result } = renderHook(() => useSectionVisible());
    expect(result.current[1]).toBe(false);
  });

  test("returns true when IO reports intersecting", () => {
    const { result } = renderHook(() => useSectionVisible());
    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });
    act(() => {
      observeCallback?.([{ isIntersecting: true }]);
    });
    expect(result.current[1]).toBe(true);
  });

  test("toggles back to false when section leaves viewport", () => {
    const { result } = renderHook(() => useSectionVisible());
    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });
    act(() => {
      observeCallback?.([{ isIntersecting: true }]);
    });
    expect(result.current[1]).toBe(true);

    act(() => {
      observeCallback?.([{ isIntersecting: false }]);
    });
    expect(result.current[1]).toBe(false);
  });

  test("toggles true→false→true across multiple cycles (not fire-once)", () => {
    const { result } = renderHook(() => useSectionVisible());
    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    for (let i = 0; i < 3; i++) {
      act(() => {
        observeCallback?.([{ isIntersecting: true }]);
      });
      expect(result.current[1]).toBe(true);
      act(() => {
        observeCallback?.([{ isIntersecting: false }]);
      });
      expect(result.current[1]).toBe(false);
    }
  });

  test("locks to true under prefers-reduced-motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    const { result } = renderHook(() => useSectionVisible());
    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });
    expect(result.current[1]).toBe(true);

    window.matchMedia = original;
  });

  test("disconnects on unmount", () => {
    const { result, unmount } = renderHook(() => useSectionVisible());
    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
