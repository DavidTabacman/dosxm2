import { useCountUp } from "../shared/useCountUp";
import { useSectionReveal } from "../shared/useSectionReveal";
import styles from "./V4Metrics.module.css";
import anim from "./v4-animations.module.css";

export interface V4Metric {
  /** Numeric value to animate to. For non-numeric metrics (e.g. "24/7"),
   * leave as null and set `staticValue` instead. */
  value: number | null;
  /** Optional static label shown in place of the count-up (e.g. "24/7"). */
  staticValue?: string;
  /** Prefix rendered before the number (e.g. "+"). */
  prefix?: string;
  /** Suffix rendered after the number (e.g. "%", "días"). */
  suffix?: string;
  /** Label shown under the number. */
  label: string;
  /** Optional caption under the label for added context. */
  caption?: string;
  /** Number of decimals the count-up should interpolate to. */
  decimals?: number;
}

export interface V4MetricsProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  sub?: string;
  metrics: ReadonlyArray<V4Metric>;
}

function Tile({ metric, animate }: { metric: V4Metric; animate: boolean }) {
  const { value, staticValue, prefix, suffix, label, caption, decimals = 0 } =
    metric;

  // useCountUp is fire-once via internal hasAnimated ref — animation never
  // resets even if the section re-enters the viewport (BRD 4.3 requirement).
  const count = useCountUp(value ?? 0, 2000, animate && value !== null, decimals);
  const displayValue =
    value === null
      ? staticValue ?? ""
      : decimals > 0
        ? count.toFixed(decimals)
        : String(count);

  return (
    <div className={styles.tile}>
      <div className={styles.value}>
        {prefix}
        {displayValue}
        {suffix ? <span className={styles.valueSuffix}>{suffix}</span> : null}
      </div>
      <div className={styles.label}>{label}</div>
      {caption ? <div className={styles.caption}>{caption}</div> : null}
    </div>
  );
}

export default function V4Metrics({
  id = "resultados",
  eyebrow = "Resultados",
  heading = "Números que hablan por sí solos.",
  sub = "Lo que pasa cuando dos expertos se dedican a tu casa como si fuese la suya.",
  metrics,
}: V4MetricsProps) {
  // useSectionReveal is fire-once — isRevealed goes true and stays true.
  const [ref, isRevealed] = useSectionReveal(0.25);

  return (
    <section
      id={id}
      className={styles.section}
      ref={ref}
      aria-labelledby="v4-metrics-heading"
    >
      <div className={`${styles.inner} ${anim.stagger} ${isRevealed ? anim.staggerVisible : ""}`}>
        <div>
          <div className={styles.eyebrow}>{eyebrow}</div>
          <h2 id="v4-metrics-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.sub}>{sub}</p>
        </div>
        <div className={styles.grid}>
          {metrics.map((metric) => (
            <Tile
              key={metric.label}
              metric={metric}
              animate={isRevealed}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
