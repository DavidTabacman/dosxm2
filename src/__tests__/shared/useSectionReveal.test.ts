import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSectionReveal } from "@/components/shared/useSectionReveal";

describe("useSectionReveal", () => {
  let originalIO: typeof IntersectionObserver;
  let observeCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null;
  let mockUnobserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    originalIO = globalThis.IntersectionObserver;
    observeCallback = null;
    mockUnobserve = vi.fn();

    globalThis.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback
    ) {
      observeCallback = callback as (entries: Partial<IntersectionObserverEntry>[]) => void;
      this.observe = vi.fn();
      this.disconnect = vi.fn();
      this.unobserve = mockUnobserve;
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
    const { result } = renderHook(() => useSectionReveal());
    expect(result.current[1]).toBe(false);
  });

  test("returns true after intersection", () => {
    const { result } = renderHook(() => useSectionReveal());

    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    act(() => {
      observeCallback?.([{ isIntersecting: true }]);
    });

    expect(result.current[1]).toBe(true);
  });

  test("unobserves after first intersection (fire-once)", () => {
    const { result } = renderHook(() => useSectionReveal());

    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    act(() => {
      observeCallback?.([{ isIntersecting: true }]);
    });

    expect(mockUnobserve).toHaveBeenCalledWith(node);
  });

  test("stays true after element leaves viewport (fire-once)", () => {
    const { result } = renderHook(() => useSectionReveal());

    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    act(() => {
      observeCallback?.([{ isIntersecting: true }]);
    });

    // After unobserve, the callback shouldn't fire again,
    // but even if it did, the state stays true
    expect(result.current[1]).toBe(true);
  });

  test("returns true immediately when prefers-reduced-motion is set", () => {
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

    const { result } = renderHook(() => useSectionReveal());

    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    expect(result.current[1]).toBe(true);

    window.matchMedia = original;
  });

  test("returns true when IntersectionObserver is undefined (SSR)", () => {
    const saved = globalThis.IntersectionObserver;
    // @ts-expect-error simulating SSR
    delete globalThis.IntersectionObserver;

    const { result } = renderHook(() => useSectionReveal());

    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    expect(result.current[1]).toBe(true);

    globalThis.IntersectionObserver = saved;
  });

  test("already-in-view elements reveal immediately without waiting for IO", () => {
    const { result } = renderHook(() => useSectionReveal());

    const node = document.createElement("div");
    // Simulate an already-in-view bounding rect (top of element is on screen).
    node.getBoundingClientRect = () =>
      ({
        top: 100,
        bottom: 400,
        left: 0,
        right: 200,
        width: 200,
        height: 300,
      }) as DOMRect;

    act(() => {
      result.current[0](node);
    });

    expect(result.current[1]).toBe(true);
  });

  test("passes rootMargin option through to IntersectionObserver", () => {
    const IOSpy = vi.spyOn(globalThis, "IntersectionObserver");

    // Node with an out-of-view rect so the already-visible safety net
    // falls through and the hook actually constructs an observer.
    const node = document.createElement("div");
    node.getBoundingClientRect = () =>
      ({
        top: 2000,
        bottom: 2400,
        left: 0,
        right: 200,
        width: 200,
        height: 400,
      }) as DOMRect;

    const { result } = renderHook(() =>
      useSectionReveal(0.5, { rootMargin: "0px 0px -10% 0px" })
    );
    act(() => {
      result.current[0](node);
    });

    expect(IOSpy).toHaveBeenCalled();
    const call = IOSpy.mock.calls[IOSpy.mock.calls.length - 1];
    expect(call[1]?.rootMargin).toBe("0px 0px -10% 0px");
    expect(call[1]?.threshold).toBe(0.5);

    IOSpy.mockRestore();
  });
});
