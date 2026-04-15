import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./ElDiferencial.module.css";

export default function ElDiferencial() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section
      className={`${styles.section} ${isVisible ? styles.revealed : ""}`}
      ref={sectionRef}
    >
      <div className={styles.grid}>
        <div className={styles.textBlock}>
          <div className={styles.revealBlock} aria-hidden="true" />
          <div className={styles.sectionLabel}>El Diferencial</div>
          <h2 className={styles.heading}>Dos visiones. Un objetivo.</h2>
          <p className={styles.body}>
            No somos una agencia tradicional. Somos un equipo dedicado a contar
            la historia de tu propiedad y encontrar al comprador perfecto.
          </p>
        </div>

        <div className={styles.imageBlock}>
          <div className={styles.revealBlock} aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.image}
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1000&fit=crop"
            alt="Los fundadores de DOSXM2 trabajando juntos"
            data-asset-type="editorial-portrait"
            loading="lazy"
          />
        </div>
      </div>

      <div className={styles.secondRow}>
        <div className={styles.secondImageBlock}>
          <div className={styles.revealBlock} aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.image}
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
            alt="Interior de propiedad elegante"
            data-asset-type="editorial-interior"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
