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
    if (!isVisible) return;
    const id = setTimeout(() => setShowSecond(true), 600);
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
