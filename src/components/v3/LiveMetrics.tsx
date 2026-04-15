import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useCountUp } from "../shared/useCountUp";
import styles from "./LiveMetrics.module.css";

function useTimestamp() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

const METRICS = [
  { id: "METRIC_01", label: "TIEMPO_VENTA", value: 45, unit: "DÍAS" },
  { id: "METRIC_02", label: "TASA_ÉXITO", value: 100, unit: "%" },
  { id: "METRIC_03", label: "SATISFACCIÓN", value: 5, unit: "/ 5" },
];

export default function LiveMetrics() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const timestamp = useTimestamp();

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.sectionLabel}>[PANEL: MÉTRICAS EN TIEMPO REAL]</div>
      <div className={styles.grid}>
        {METRICS.map((metric) => (
          <MetricCard
            key={metric.id}
            id={metric.id}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
            animate={isVisible}
          />
        ))}
      </div>
      <div className={styles.footer}>
        <span className={styles.statusDot} aria-hidden="true" />
        <span className={styles.timestamp}>SYSTEM ONLINE — {timestamp}</span>
      </div>
    </section>
  );
}

function MetricCard({
  id,
  label,
  value,
  unit,
  animate,
}: {
  id: string;
  label: string;
  value: number;
  unit: string;
  animate: boolean;
}) {
  const count = useCountUp(value, 1500, animate);

  return (
    <div className={styles.card}>
      <div className={styles.metricLabel}>[{id}] {label}</div>
      <div className={styles.metricValue}>{count}</div>
      <div className={styles.metricUnit}>{unit}</div>
    </div>
  );
}
