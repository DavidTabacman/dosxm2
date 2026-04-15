import { useIntersectionObserver } from "../shared/useIntersectionObserver";
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

  return (
    <div
      className={`${styles.circle} ${animate ? styles.inView : ""}`}
      style={{ animationDelay: `${index * 200}ms` }}
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
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        {METRICS.map((m, i) => (
          <MetricCircle
            key={m.label}
            value={m.value}
            suffix={m.suffix}
            label={m.label}
            animate={isVisible}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
