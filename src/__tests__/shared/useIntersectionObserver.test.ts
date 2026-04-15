import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIntersectionObserver } from "@/components/shared/useIntersectionObserver";

describe("useIntersectionObserver", () => {
  let originalIO: typeof IntersectionObserver;
  let observeCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null;

  beforeEach(() => {
    originalIO = globalThis.IntersectionObserver;
    observeCallback = null;

    globalThis.IntersectionObserver = vi.fn(function (this: IntersectionObserver, callback: IntersectionObserverCallback) {
      observeCallback = callback as (entries: Partial<IntersectionObserverEntry>[]) => void;
      this.observe = vi.fn();
      this.disconnect = vi.fn();
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
    const { result } = renderHook(() => useIntersectionObserver());
    expect(result.current[1]).toBe(false);
  });

  test("returns true when element is intersecting", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate calling the ref with a DOM node
    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    // Simulate intersection
    act(() => {
      observeCallback?.([{ isIntersecting: true }]);
    });

    expect(result.current[1]).toBe(true);
  });

  test("returns false when element leaves viewport", () => {
    const { result } = renderHook(() => useIntersectionObserver());

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

    const { result } = renderHook(() => useIntersectionObserver());

    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    expect(result.current[1]).toBe(true);

    window.matchMedia = original;
  });

  test("returns true when IntersectionObserver is undefined (SSR)", () => {
    // Remove IntersectionObserver to simulate SSR
    const saved = globalThis.IntersectionObserver;
    // @ts-expect-error simulating SSR
    delete globalThis.IntersectionObserver;

    const { result } = renderHook(() => useIntersectionObserver());

    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    expect(result.current[1]).toBe(true);

    globalThis.IntersectionObserver = saved;
  });
});
