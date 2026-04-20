import { afterEach, describe, expect, test, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useMousePosition } from "@/components/shared/useMousePosition";

function mockCoarsePointer(matches: boolean) {
  (window as Window).__setMatchMedia?.((q) => ({
    matches:
      matches && q.includes("hover: none") && q.includes("pointer: coarse"),
    media: q,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

afterEach(() => {
  (window as Window).__setMatchMedia?.(null);
  vi.restoreAllMocks();
});

describe("useMousePosition", () => {
  test("desktop (fine pointer): attaches mousemove and updates position", () => {
    mockCoarsePointer(false);

    const el = document.createElement("div");
    document.body.appendChild(el);
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 500,
      top: 0,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

    const { result } = renderHook(() => {
      const ref = useRef(el);
      return useMousePosition(ref);
    });

    // Initial position is 0.5/0.5.
    expect(result.current.x).toBe(0.5);

    // Synthetic mousemove updates position (flush React state via act).
    act(() => {
      el.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 250, clientY: 100 })
      );
    });

    expect(result.current.x).toBeCloseTo(0.5);
    expect(result.current.y).toBeCloseTo(0.2);

    document.body.removeChild(el);
    rafSpy.mockRestore();
  });

  test("coarse pointer (real phone): mousemove NOT attached, stays at default", () => {
    mockCoarsePointer(true);

    const el = document.createElement("div");
    document.body.appendChild(el);
    const addSpy = vi.spyOn(el, "addEventListener");

    const { result } = renderHook(() => {
      const ref = useRef(el);
      return useMousePosition(ref);
    });

    const registered = addSpy.mock.calls.some(
      ([event]) => event === "mousemove"
    );
    expect(registered).toBe(false);
    expect(result.current.x).toBe(0.5);
    expect(result.current.y).toBe(0.5);

    document.body.removeChild(el);
  });

  test("cleans up listener on unmount (desktop)", () => {
    mockCoarsePointer(false);
    const el = document.createElement("div");
    document.body.appendChild(el);
    const removeSpy = vi.spyOn(el, "removeEventListener");

    const { unmount } = renderHook(() => {
      const ref = useRef(el);
      return useMousePosition(ref);
    });

    unmount();

    const cleaned = removeSpy.mock.calls.some(
      ([event]) => event === "mousemove"
    );
    expect(cleaned).toBe(true);
    document.body.removeChild(el);
  });
});
