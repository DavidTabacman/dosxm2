import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useCountUp } from "../shared/useCountUp";
import { useSectionReveal } from "../shared/useSectionReveal";
import styles from "./LiveMetrics.module.css";
import anim from "./v3-animations.module.css";

export default function LiveMetrics() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
  const [revealRef, isRevealed] = useSectionReveal(0.15);
  const [showSecond, setShowSecond] = useState(false);

  const count45 = useCountUp(45, 2000, isVisible);
  const count68 = useCountUp(68, 2000, showSecond);

  // Sequential fade: second number starts 600ms after section becomes visible
  useEffect(() => {
    if (!isVisible) {
      console.log(`[V3-LiveMetrics] ⏸️ Waiting for section visibility | targets: 45 días, 68%`);
      return;
    }
    console.log(
      `[V3-LiveMetrics] ✅ Section visible — starting count-up for 45 días. ` +
      `Second count (68%) scheduled in 600ms.`
    );
    const id = setTimeout(() => {
      try {
        setShowSecond(true);
        console.log(`[V3-LiveMetrics] 🚀 Second count-up triggered (68%)`);
      } catch (err) {
        console.error(
          `[V3-LiveMetrics] ❌ Failed to trigger second count-up — ` +
          `Reason: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }, 600);
    return () => clearTimeout(id);
  }, [isVisible]);

  // Verify count-up values are being produced (using ref to avoid stale closures)
  const count45Ref = useRef(count45);
  count45Ref.current = count45;

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      if (count45Ref.current === 0) {
        console.warn(
          `[V3-LiveMetrics] ⚠️ count45 is still 0 after 2500ms of visibility — ` +
          `Reason: useCountUp may not be animating. Check if IntersectionObserver threshold (0.3) ` +
          `is being reached — section may be too tall or not scrolled into view far enough.`
        );
      }
    }, 2500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [isVisible]);

  return (
    <section className={styles.section} ref={ref}>
      <p
        className={`${styles.prose} ${anim.revealTarget} ${isRevealed ? anim.revealTargetVisible : ""}`}
        ref={revealRef}
      >
        Vendemos en un promedio de{" "}
        <span
          className={`${styles.number} ${isVisible ? styles.numberVisible : ""}`}
        >
          {count45} días
        </span>
        , con una tasa de éxito del{" "}
        <span
          className={`${styles.number} ${showSecond ? styles.numberVisible : ""}`}
        >
          {count68}%
        </span>
        .
      </p>
    </section>
  );
}
