import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountUp } from "@/components/shared/useCountUp";

describe("useCountUp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    (window as Window).__setMatchMedia?.(null);
  });

  test("returns 0 when trigger is false", () => {
    const { result } = renderHook(() => useCountUp(100, 2000, false));
    expect(result.current).toBe(0);
  });

  test("animates to target value when triggered", () => {
    const { result } = renderHook(() => useCountUp(45, 2000, true));

    // Advance past the animation duration
    act(() => {
      vi.advanceTimersByTime(2100);
    });

    expect(result.current).toBe(45);
  });

  test("does not re-animate after trigger changes from true to false and back (default fire-once)", () => {
    // Regression guard for V1/V2/V3 callers that rely on fire-once.
    const { result, rerender } = renderHook(
      ({ trigger }) => useCountUp(100, 2000, trigger),
      { initialProps: { trigger: true } }
    );

    act(() => {
      vi.advanceTimersByTime(2100);
    });

    expect(result.current).toBe(100);

    // Toggle trigger off and back on
    rerender({ trigger: false });
    rerender({ trigger: true });

    // Value should remain at 100 (hasAnimated prevents re-animation)
    expect(result.current).toBe(100);
  });

  test("returns 0 initially before animation starts", () => {
    const { result } = renderHook(() => useCountUp(50, 2000, true));
    // Before any RAF fires, value is 0
    expect(result.current).toBe(0);
  });

  describe("replay option", () => {
    test("resets value to 0 when trigger goes false", () => {
      const { result, rerender } = renderHook(
        ({ trigger }) =>
          useCountUp(45, 2000, trigger, 0, { replay: true }),
        { initialProps: { trigger: true } }
      );
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(result.current).toBe(45);

      rerender({ trigger: false });
      // Effect runs and resets value to 0
      expect(result.current).toBe(0);
    });

    test("restarts animation on true → false → true cycle", () => {
      const { result, rerender } = renderHook(
        ({ trigger }) =>
          useCountUp(45, 2000, trigger, 0, { replay: true }),
        { initialProps: { trigger: true } }
      );
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(result.current).toBe(45);

      // Scroll out
      rerender({ trigger: false });
      expect(result.current).toBe(0);

      // Scroll back in — animation restarts
      rerender({ trigger: true });
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(result.current).toBe(45);
    });

    test("multiple cycles all animate cleanly (not fire-once)", () => {
      const { result, rerender } = renderHook(
        ({ trigger }) =>
          useCountUp(30, 2000, trigger, 0, { replay: true }),
        { initialProps: { trigger: true } }
      );

      for (let cycle = 0; cycle < 3; cycle++) {
        act(() => {
          vi.advanceTimersByTime(2100);
        });
        expect(result.current).toBe(30);
        rerender({ trigger: false });
        expect(result.current).toBe(0);
        rerender({ trigger: true });
      }
    });

    test("staying at trigger=true after completion does NOT restart (no infinite loop)", () => {
      const { result, rerender } = renderHook(
        ({ end }) => useCountUp(end, 2000, true, 0, { replay: true }),
        { initialProps: { end: 45 } }
      );
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(result.current).toBe(45);

      // Rerender without toggling trigger — animation should not restart.
      rerender({ end: 45 });
      expect(result.current).toBe(45);
    });

    test("respects decimals during replay runs", () => {
      const { result, rerender } = renderHook(
        ({ trigger }) =>
          useCountUp(12.5, 2000, trigger, 1, { replay: true }),
        { initialProps: { trigger: true } }
      );
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(result.current).toBe(12.5);

      rerender({ trigger: false });
      expect(result.current).toBe(0);

      rerender({ trigger: true });
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(result.current).toBe(12.5);
    });
  });

  describe("reduced motion support", () => {
    function mockReducedMotion(matches: boolean) {
      (window as Window).__setMatchMedia?.((q) => ({
        matches: q.includes("prefers-reduced-motion") ? matches : false,
        media: q,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }));
    }

    test("snaps to end immediately when reduced-motion matches (fire-once)", () => {
      mockReducedMotion(true);
      const rafSpy = vi.spyOn(window, "requestAnimationFrame");
      const { result } = renderHook(() => useCountUp(100, 2000, true));
      expect(result.current).toBe(100);
      expect(rafSpy).not.toHaveBeenCalled();
      rafSpy.mockRestore();
    });

    test("subsequent trigger toggles do NOT restart (fire-once preserved)", () => {
      mockReducedMotion(true);
      const { result, rerender } = renderHook(
        ({ trigger }) => useCountUp(100, 2000, trigger),
        { initialProps: { trigger: true } }
      );
      expect(result.current).toBe(100);
      rerender({ trigger: false });
      rerender({ trigger: true });
      expect(result.current).toBe(100);
    });

    test("reduced-motion off (default) runs the RAF animation (regression guard for V1/V2/V3)", () => {
      mockReducedMotion(false);
      const { result } = renderHook(() => useCountUp(45, 2000, true));
      expect(result.current).toBe(0);
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(result.current).toBe(45);
    });

    test("reduced-motion + trigger:false stays at 0 (no snap before trigger)", () => {
      mockReducedMotion(true);
      const { result } = renderHook(() => useCountUp(100, 2000, false));
      expect(result.current).toBe(0);
    });

    test("reduced-motion + replay: snaps to end on trigger-on, resets on trigger-off", () => {
      mockReducedMotion(true);
      const { result, rerender } = renderHook(
        ({ trigger }) =>
          useCountUp(30, 2000, trigger, 0, { replay: true }),
        { initialProps: { trigger: true } }
      );
      expect(result.current).toBe(30);
      rerender({ trigger: false });
      expect(result.current).toBe(0);
      rerender({ trigger: true });
      expect(result.current).toBe(30);
    });
  });
});
