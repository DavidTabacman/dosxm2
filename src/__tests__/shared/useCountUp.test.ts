import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountUp } from "@/components/shared/useCountUp";

describe("useCountUp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  test("does not re-animate after trigger changes from true to false and back", () => {
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
});
