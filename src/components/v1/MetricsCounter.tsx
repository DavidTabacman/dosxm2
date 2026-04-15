import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useCountUp } from "../shared/useCountUp";
import styles from "./MetricsCounter.module.css";

const METRICS = [
  { value: 45, suffix: "", label: "Días Promedio" },
  { value: 100, suffix: "%", label: "Éxito" },
  { value: 5, suffix: "/5", label: "Satisfacción" },
];

function Metric({
  value,
  suffix,
  label,
  animate,
}: {
  value: number;
  suffix: string;
  label: string;
  animate: boolean;
}) {
  const count = useCountUp(value, 2000, animate);

  return (
    <div className={styles.metric}>
      <div className={styles.value}>
        {count}
        {suffix}
      </div>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default function MetricsCounter() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.grid}>
        {METRICS.map((m) => (
          <Metric
            key={m.label}
            value={m.value}
            suffix={m.suffix}
            label={m.label}
            animate={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
