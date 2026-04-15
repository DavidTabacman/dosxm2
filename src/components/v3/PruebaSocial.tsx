import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useSectionReveal } from "../shared/useSectionReveal";
import styles from "./PruebaSocial.module.css";
import anim from "./v3-animations.module.css";

export default function PruebaSocial() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [contentRef, contentRevealed] = useSectionReveal(0.2);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setHasStarted(true);
      console.log(
        `[V3-PruebaSocial] ✅ Ken Burns animation STARTED — ` +
        `bgImageActive class applied, animation-play-state set to running`
      );
    } else {
      console.log(
        `[V3-PruebaSocial] ⏸️ Waiting for section visibility to start Ken Burns ` +
        `(threshold: 0.1)`
      );
    }
  }, [isVisible]);

  // Verify the Ken Burns animation is actually running after trigger
  useEffect(() => {
    if (!hasStarted || typeof window === "undefined") return;

    const timer = setTimeout(() => {
      try {
        const bgImg = document.querySelector(
          `img[data-asset-type="testimonial-bg"].${styles.bgImageActive}`
        );
        if (!bgImg) {
          console.warn(
            `[V3-PruebaSocial] ⚠️ Ken Burns bg image element not found with .bgImageActive class — ` +
            `Reason: CSS class may not have been applied, or the image element was not rendered. ` +
            `Check that styles.bgImageActive is being toggled correctly.`
          );
          return;
        }
        const computedStyle = window.getComputedStyle(bgImg);
        const playState = computedStyle.animationPlayState;
        if (playState === "paused") {
          console.warn(
            `[V3-PruebaSocial] ⚠️ Ken Burns animation is PAUSED despite trigger — ` +
            `Reason: animation-play-state is "${playState}". ` +
            `Check if prefers-reduced-motion is overriding the animation, ` +
            `or if the .bgImageActive CSS rule is not setting play-state to running.`
          );
        } else {
          console.log(
            `[V3-PruebaSocial] ✅ Ken Burns animation confirmed running — ` +
            `play-state: "${playState}"`
          );
        }
      } catch (err) {
        console.error(
          `[V3-PruebaSocial] ❌ Failed to verify Ken Burns animation state — ` +
          `Reason: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [hasStarted]);

  return (
    <section className={styles.section} ref={ref}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`${styles.bgImage} ${hasStarted ? styles.bgImageActive : ""}`}
        src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&h=1080&fit=crop"
        alt=""
        aria-hidden="true"
        data-asset-type="testimonial-bg"
        loading="lazy"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <blockquote
        className={`${styles.content} ${anim.revealTarget} ${contentRevealed ? anim.revealTargetVisible : ""}`}
        ref={contentRef}
      >
        <p className={styles.quote}>
          &ldquo;Entendieron el valor de nuestra casa desde el primer
          minuto.&rdquo;
        </p>
        <cite className={styles.author}>Familia García, Salamanca</cite>
      </blockquote>
    </section>
  );
}
