import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./PruebaSocial.module.css";

export default function PruebaSocial() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className={styles.section} ref={ref}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`${styles.bgImage} ${isVisible ? styles.bgImageActive : ""}`}
        src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&h=1080&fit=crop"
        alt=""
        aria-hidden="true"
        data-asset-type="testimonial-bg"
        loading="lazy"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <blockquote className={styles.content}>
        <p className={styles.quote}>
          &ldquo;Entendieron el valor de nuestra casa desde el primer
          minuto.&rdquo;
        </p>
        <cite className={styles.author}>Familia García, Salamanca</cite>
      </blockquote>
    </section>
  );
}
