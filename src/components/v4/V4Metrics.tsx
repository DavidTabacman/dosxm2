import { useCountUp } from "../shared/useCountUp";
import { useSectionReveal } from "../shared/useSectionReveal";
import { useSectionVisible } from "../shared/useSectionVisible";
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

  // replay=true so the count-up restarts every time the grid re-enters
  // the viewport. Requested behavior: counters animate on every scroll-in.
  const count = useCountUp(
    value ?? 0,
    2000,
    animate && value !== null,
    decimals,
    { replay: true }
  );
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
  // Header entrance is fire-once — the editorial h2/sub should not
  // re-slide in every time the user scrolls past and back.
  const [headerRef, isHeaderRevealed] = useSectionReveal(0.15, {
    rootMargin: "0px 0px -10% 0px",
  });

  // Grid visibility is repeatable — drives count-up replay on every
  // viewport entry. Separate observer, separate target.
  const [gridRef, isGridVisible] = useSectionVisible(
    0.15,
    "0px 0px -10% 0px"
  );

  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby="v4-metrics-heading"
    >
      <div className={styles.inner}>
        <div
          ref={headerRef}
          className={`${styles.headerBlock} ${anim.stagger} ${
            isHeaderRevealed ? anim.staggerVisible : ""
          }`}
        >
          <div className={styles.eyebrow}>{eyebrow}</div>
          <h2 id="v4-metrics-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.sub}>{sub}</p>
        </div>
        <div ref={gridRef} className={styles.grid}>
          {metrics.map((metric) => (
            <Tile
              key={metric.label}
              metric={metric}
              animate={isGridVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
