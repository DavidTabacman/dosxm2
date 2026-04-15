import { useEffect, useRef, useState } from "react";
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
  const [forceShow, setForceShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timeout fallback: if IntersectionObserver doesn't fire within 3s, force-show
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setForceShow(true);
      console.warn(`[V2-MetricsBounce] ⏰ Timeout fallback triggered — IntersectionObserver did not fire within 3s. Forcing animation. Reason: observer may have failed silently (element not in viewport, zero-height edge case, or browser timing issue)`);
    }, 3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Clear timeout once observer fires — prevents false warning
  useEffect(() => {
    if (isRevealed && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log(`[V2-MetricsBounce] 👁️ Section revealed via IntersectionObserver — starting count-up for targets: 45 días, 68%, 35+`);
    }
  }, [isRevealed]);

  const animate = isRevealed || forceShow;

  useEffect(() => {
    if (!animate) {
      console.log(`[V2-MetricsBounce] ⏸️ Waiting — isRevealed: ${isRevealed}, forceShow: ${forceShow}`);
    }
  }, [animate, isRevealed, forceShow]);

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        {METRICS.map((m, i) => (
          <MetricCircle
            key={m.label}
            value={m.value}
            suffix={m.suffix}
            label={m.label}
            animate={animate}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
