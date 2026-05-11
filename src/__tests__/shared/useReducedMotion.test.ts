import { expect, test, describe, beforeEach, afterEach, vi, type Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReducedMotion } from "@/components/shared/useReducedMotion";

type Listener = (e: MediaQueryListEvent) => void;

interface MockMql {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: Mock;
  removeListener: Mock;
  addEventListener: Mock;
  removeEventListener: Mock;
  dispatchEvent: Mock;
  _listeners: Listener[];
}

function makeMql(initialMatches: boolean): MockMql {
  const listeners: Listener[] = [];
  return {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event: string, cb: Listener) => {
      if (event === "change") listeners.push(cb);
    }),
    removeEventListener: vi.fn((event: string, cb: Listener) => {
      if (event === "change") {
        const i = listeners.indexOf(cb);
        if (i >= 0) listeners.splice(i, 1);
      }
    }),
    dispatchEvent: vi.fn(() => false),
    _listeners: listeners,
  };
}

describe("useReducedMotion", () => {
  let mql: MockMql;

  beforeEach(() => {
    mql = makeMql(false);
    (window as Window).__setMatchMedia?.(() => mql);
  });

  afterEach(() => {
    (window as Window).__setMatchMedia?.(null);
  });

  test("returns false when matchMedia does not match", () => {
    mql = makeMql(false);
    (window as Window).__setMatchMedia?.(() => mql);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  test("returns true when matchMedia matches on mount", () => {
    mql = makeMql(true);
    (window as Window).__setMatchMedia?.(() => mql);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  test("updates when the matchMedia change event fires", () => {
    mql = makeMql(false);
    (window as Window).__setMatchMedia?.(() => mql);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    // useSyncExternalStore re-reads the snapshot when the subscriber
    // callback fires — so we flip `matches` on the mock first, then
    // invoke the captured listener to signal a change.
    act(() => {
      mql.matches = true;
      mql._listeners.forEach((cb) => cb({} as MediaQueryListEvent));
    });
    expect(result.current).toBe(true);

    act(() => {
      mql.matches = false;
      mql._listeners.forEach((cb) => cb({} as MediaQueryListEvent));
    });
    expect(result.current).toBe(false);
  });

  test("subscribes to change events and unsubscribes on unmount", () => {
    mql = makeMql(false);
    (window as Window).__setMatchMedia?.(() => mql);
    const { unmount } = renderHook(() => useReducedMotion());
    expect(mql.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );

    unmount();
    expect(mql.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });
});
