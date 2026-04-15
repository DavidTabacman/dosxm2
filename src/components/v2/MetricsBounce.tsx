import { useEffect, useRef } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import { useCountUp } from "../shared/useCountUp";
import styles from "./MetricsBounce.module.css";

const METRICS = [
  { value: 45, suffix: " días", label: "Vendemos en" },
  { value: 68, suffix: "%", label: "De éxito" },
  { value: 35, suffix: "+", label: "Clientes felices" },
];

function MetricCircle({
  value,
  suffix,
  label,
  animate,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  animate: boolean;
  index: number;
}) {
  const count = useCountUp(value, 2000, animate);
  const prevAnimate = useRef(animate);

  useEffect(() => {
    if (animate && !prevAnimate.current) {
      console.log(`[V2-MetricsBounce] 🚀 Circle "${label}" — count-up started → target: ${value}${suffix}, delay: ${index * 200}ms`);
    }
    prevAnimate.current = animate;
  }, [animate, label, value, suffix, index]);

  return (
    <div
      className={`${styles.circle} ${animate ? styles.inView : ""}`}
      style={{ animationDelay: `${index * 200}ms` }}
      aria-label={`${label}: ${value}${suffix}`}
    >
      <div className={styles.value}>
        {count}
        {suffix}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default function MetricsBounce() {
  const [ref, isRevealed] = useSectionReveal(0.3);

  useEffect(() => {
    if (isRevealed) {
      console.log(`[V2-MetricsBounce] 👁️ Section revealed — starting count-up for targets: 45 días, 68%, 35+`);
    }
  }, [isRevealed]);

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        {METRICS.map((m, i) => (
          <MetricCircle
            key={m.label}
            value={m.value}
            suffix={m.suffix}
            label={m.label}
            animate={isRevealed}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
