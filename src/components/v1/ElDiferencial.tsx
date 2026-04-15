import { useRef } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useScrollProgress } from "../shared/useScrollProgress";
import styles from "./ElDiferencial.module.css";

export default function ElDiferencial() {
  const sectionRef = useRef<HTMLElement>(null);
  const [textRef, textVisible] = useIntersectionObserver({ threshold: 0.3 });

  // Sets --scroll-progress on sectionRef via direct DOM mutation (zero re-renders)
  useScrollProgress(sectionRef);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.grid}>
        <div
          className={`${styles.textColumn} ${textVisible ? styles.inView : ""}`}
          ref={textRef}
        >
          <div className={styles.sectionLabel}>El Diferencial</div>
          <h2 className={styles.heading}>Dos visiones. Un objetivo.</h2>
          <p className={styles.body}>
            No somos una franquicia. No somos un algoritmo. Somos dos expertos
            dedicados a maximizar el valor de tu propiedad en Madrid.
          </p>
        </div>

        <div className={styles.portraitColumn}>
          <div className={styles.portraitWrapper1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.portrait1}
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&crop=face"
              alt="Fundador 1 de DOSXM2"
              data-asset-type="portrait"
              loading="lazy"
            />
          </div>
          <div className={styles.portraitWrapper2}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.portrait2}
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=face"
              alt="Fundador 2 de DOSXM2"
              data-asset-type="portrait"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
