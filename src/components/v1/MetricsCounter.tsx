import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useCountUp } from "../shared/useCountUp";
import styles from "./MetricsCounter.module.css";

const METRICS = [
  { value: 45, suffix: "", label: "Días Promedio", decimals: 0 },
  { value: 68, suffix: "%", label: "Éxito", decimals: 0 },
  { value: 3.5, suffix: "/5", label: "Satisfacción", decimals: 1 },
];

function Metric({
  value,
  suffix,
  label,
  animate,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  animate: boolean;
  decimals?: number;
}) {
  const count = useCountUp(value, 2000, animate, decimals);

  return (
    <div className={styles.metric}>
      <div className={styles.value}>
        {decimals > 0 ? count.toFixed(decimals) : count}
        {suffix}
      </div>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default function MetricsCounter() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  if (typeof window !== "undefined") {
    console.log(
      `[V1-MetricsCounter] 📊 isVisible: ${isVisible} | ` +
      `targets: ${METRICS.map((m) => `${m.value}${m.suffix}`).join(", ")} | ` +
      `reveal animation: ${isVisible ? "✅ triggered" : "⏸️ waiting"}`
    );
  }

  return (
    <section className={styles.section} ref={ref}>
      <div className={`${styles.grid} ${isVisible ? styles.revealed : ""}`}>
        {METRICS.map((m) => (
          <Metric
            key={m.label}
            value={m.value}
            suffix={m.suffix}
            label={m.label}
            animate={isVisible}
            decimals={m.decimals}
          />
        ))}
      </div>
    </section>
  );
}
