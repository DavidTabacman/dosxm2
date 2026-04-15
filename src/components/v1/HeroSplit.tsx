import { useRef } from "react";
import { useMousePosition } from "../shared/useMousePosition";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./HeroSplit.module.css";

export default function HeroSplit() {
  const heroRef = useRef<HTMLElement>(null);
  const { x } = useMousePosition(heroRef);
  const [rightRef, rightVisible] = useIntersectionObserver({ threshold: 0.3 });

  // Clamp divider between 30% and 70%
  const dividerPos = 30 + x * 40;

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div
        className={styles.panelLeft}
        style={{ flexBasis: `${dividerPos}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.panelBg}
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop"
          alt=""
          aria-hidden="true"
          data-asset-type="hero-bg"
        />
        <h1 className={styles.headingLeft}>Vendemos tu casa</h1>
        <p className={styles.subheading}>
          En un sector donde la mayoría trabaja solo, nosotros somos dos.
        </p>
      </div>

      <div
        className={styles.divider}
        style={{ left: `${dividerPos}%` }}
        aria-hidden="true"
      />

      <div
        className={`${styles.panelRight} ${rightVisible ? styles.mobileVisible : styles.mobileHidden}`}
        ref={rightRef}
        style={{ flexBasis: `${100 - dividerPos}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.panelBg}
          src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop"
          alt=""
          aria-hidden="true"
          data-asset-type="hero-bg"
        />
        <p className={styles.headingRight}>como si fuese la nuestra.</p>
      </div>
    </section>
  );
}
