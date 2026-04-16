import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollAlive } from "@/components/shared/useScrollAlive";

describe("useScrollAlive", () => {
  let originalIO: typeof IntersectionObserver;
  let originalCSS: typeof CSS;
  const observeCallbacks: Array<(entries: Partial<IntersectionObserverEntry>[]) => void> = [];
  let mockObserves: Array<ReturnType<typeof vi.fn>>;
  let mockDisconnects: Array<ReturnType<typeof vi.fn>>;
  let mockUnobserves: Array<ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    originalIO = globalThis.IntersectionObserver;
    originalCSS = globalThis.CSS;
    observeCallbacks.length = 0;
    mockObserves = [];
    mockDisconnects = [];
    mockUnobserves = [];

    globalThis.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback
    ) {
      observeCallbacks.push(callback as (entries: Partial<IntersectionObserverEntry>[]) => void);
      const obs = vi.fn();
      const disc = vi.fn();
      const unobs = vi.fn();
      mockObserves.push(obs);
      mockDisconnects.push(disc);
      mockUnobserves.push(unobs);
      this.observe = obs;
      this.disconnect = disc;
      this.unobserve = unobs;
      this.root = null;
      this.rootMargin = "";
      this.thresholds = [];
      this.takeRecords = () => [];
    }) as unknown as typeof IntersectionObserver;

    // Default: CSS scroll-driven animations NOT supported
    globalThis.CSS = {
      supports: vi.fn().mockReturnValue(false),
      escape: CSS?.escape ?? ((s: string) => s),
    } as unknown as typeof CSS;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIO;
    globalThis.CSS = originalCSS;
    vi.restoreAllMocks();
  });

  test("returns [ref, false, false] initially when CSS unsupported", () => {
    const { result } = renderHook(() => useScrollAlive());
    expect(result.current[1]).toBe(false); // isEntered
    expect(result.current[2]).toBe(false); // isAlive
  });

  test("CSS supported: isEntered true immediately, isAlive deferred to IO", () => {
    (CSS.supports as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const { result } = renderHook(() => useScrollAlive());

    const node = document.createElement("div");
    act(() => {
      result.current[0](node);
    });

    // isEntered is true immediately (CSS handles entrance animation)
    expect(result.current[1]).toBe(true);
    // isAlive waits for IO (triggers side effects like video playback)
    expect(result.current[2]).toBe(false);
    // One IO created for the alive threshold
    expect(observeCallbacks).toHaveLength(1);
    expect(mockObserves[0]).toHaveBeenCalledWith(node);

    // Fire the alive observer
    act(() => {
      observeCallbacks[0]([{ isIntersecting: true }]);
    });

    expect(result.current[2]).toBe(true);
    // Fire-once: unobserves after triggering
    expect(mockUnobserves[0]).toHaveBeenCalledWith(node);
  });

  test("creates two IntersectionObservers when CSS unsupported", () => {
    const { result } = renderHook(() => useScrollAlive());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    expect(observeCallbacks).toHaveLength(2);
    expect(mockObserves[0]).toHaveBeenCalledWith(node);
    expect(mockObserves[1]).toHaveBeenCalledWith(node);
  });

  test("isEntered fires at low threshold, isAlive stays false", () => {
    const { result } = renderHook(() => useScrollAlive());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    // Fire entrance observer (first one created)
    act(() => {
      observeCallbacks[0]([{ isIntersecting: true }]);
    });

    expect(result.current[1]).toBe(true);  // isEntered
    expect(result.current[2]).toBe(false); // isAlive still false
  });

  test("isAlive fires at high threshold", () => {
    const { result } = renderHook(() => useScrollAlive());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    // Fire alive observer (second one created)
    act(() => {
      observeCallbacks[1]([{ isIntersecting: true }]);
    });

    expect(result.current[2]).toBe(true); // isAlive
  });

  test("both are fire-once (stay true after leaving viewport)", () => {
    const { result } = renderHook(() => useScrollAlive());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    // Fire both
    act(() => {
      observeCallbacks[0]([{ isIntersecting: true }]);
      observeCallbacks[1]([{ isIntersecting: true }]);
    });

    expect(result.current[1]).toBe(true);
    expect(result.current[2]).toBe(true);

    // Unobserve should have been called (fire-once)
    expect(mockUnobserves[0]).toHaveBeenCalledWith(node);
    expect(mockUnobserves[1]).toHaveBeenCalledWith(node);
  });

  test("reduced motion: both true immediately", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;

    const { result } = renderHook(() => useScrollAlive());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    expect(result.current[1]).toBe(true);
    expect(result.current[2]).toBe(true);
    expect(observeCallbacks).toHaveLength(0);

    window.matchMedia = original;
  });

  test("SSR (no IntersectionObserver): both true", () => {
    // Remove IO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).IntersectionObserver;

    const { result } = renderHook(() => useScrollAlive());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    expect(result.current[1]).toBe(true);
    expect(result.current[2]).toBe(true);
  });

  test("disconnects both observers on unmount", () => {
    const { result, unmount } = renderHook(() => useScrollAlive());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    unmount();

    expect(mockDisconnects[0]).toHaveBeenCalled();
    expect(mockDisconnects[1]).toHaveBeenCalled();
  });
});
