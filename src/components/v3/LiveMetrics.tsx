import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useCountUp } from "../shared/useCountUp";
import styles from "./LiveMetrics.module.css";

export default function LiveMetrics() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
  const [showSecond, setShowSecond] = useState(false);

  const count45 = useCountUp(45, 2000, isVisible);
  const count68 = useCountUp(68, 2000, showSecond);

  // Sequential fade: second number starts 600ms after section becomes visible
  useEffect(() => {
    if (!isVisible) {
      console.log(`[V3-LiveMetrics] ⏸️ Waiting for section visibility | targets: 45 días, 68%`);
      return;
    }
    console.log(`[V3-LiveMetrics] ✅ Section visible! Starting count-up for 45 días. Second count (68%) in 600ms.`);
    const id = setTimeout(() => { setShowSecond(true); console.log(`[V3-LiveMetrics] 🚀 Second count-up triggered (68%)`); }, 600);
    return () => clearTimeout(id);
  }, [isVisible]);

  return (
    <section className={styles.section} ref={ref}>
      <p className={styles.prose}>
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
