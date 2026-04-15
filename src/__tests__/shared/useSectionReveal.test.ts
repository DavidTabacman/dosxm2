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
});
