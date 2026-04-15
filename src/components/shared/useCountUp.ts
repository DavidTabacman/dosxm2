import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(
  end: number,
  duration = 2000,
  trigger = true,
  decimals = 0
): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) {
      if (!trigger) console.log(`[useCountUp] ⏸️ Waiting for trigger — target: ${end}${decimals > 0 ? ` (${decimals} decimals)` : ""}`);
      return;
    }
    hasAnimated.current = true;
    console.log(`[useCountUp] 🚀 Animation STARTED — target: ${end}, duration: ${duration}ms, decimals: ${decimals}`);

    const start = performance.now();

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
  }, [trigger, end, duration, decimals]);

  return value;
}
