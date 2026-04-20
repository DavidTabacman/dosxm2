import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export interface UseCountUpOptions {
  /**
   * When true, the animation replays every time `trigger` transitions
   * from false → true. When trigger goes back to false, the value
   * resets to 0 so the next run starts from the bottom.
   *
   * Default: false (fire-once — animation plays on first trigger and
   * then stays fixed at `end`, which is what V1/V2/V3 currently rely on).
   */
  replay?: boolean;
}

export function useCountUp(
  end: number,
  duration = 2000,
  trigger = true,
  decimals = 0,
  options: UseCountUpOptions = {}
): number {
  const { replay = false } = options;
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger) {
      console.log(`[useCountUp] ⏸️ Waiting for trigger — target: ${end}${decimals > 0 ? ` (${decimals} decimals)` : ""}`);
      if (replay) {
        // Reset so the next trigger=true starts fresh from 0. This is a
        // legitimate "sync external state with prop change" pattern — the
        // React 19 rule flags it, but it's the right shape here.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValue(0);
        hasAnimated.current = false;
      }
      return;
    }

    // Fire-once semantics — used by V1/V2/V3 and (by default) V4 dark
    // metrics. Once animated, stays at `end` even if trigger flickers.
    if (!replay && hasAnimated.current) return;

    hasAnimated.current = true;
    console.log(`[useCountUp] 🚀 Animation STARTED — target: ${end}, duration: ${duration}ms, decimals: ${decimals}, replay: ${replay}`);

    const start = performance.now();
    // Restart from 0 on replay runs so the animation is visibly kinetic,
    // not just a final-value snap.
    setValue(0);

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      setValue(
        decimals > 0
          ? parseFloat((eased * end).toFixed(decimals))
          : Math.round(eased * end)
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        console.log(`[useCountUp] ✅ Animation COMPLETE — final value: ${end}`);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, end, duration, decimals, replay]);

  return value;
}
