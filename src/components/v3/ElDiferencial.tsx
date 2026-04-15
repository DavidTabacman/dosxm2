import { useCallback, useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./ElDiferencial.module.css";

export default function ElDiferencial() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const parallaxRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setHasRevealed(true);
      console.log(`[V3-ElDiferencial] ✅ Reveal mask animation TRIGGERED`);
    } else {
      console.log(`[V3-ElDiferencial] ⏸️ Waiting for section visibility to trigger reveal mask`);
    }
  }, [isVisible]);

  // Parallax JS fallback — only runs when CSS scroll-driven animations aren't supported
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cssParallaxSupported =
      typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline: view()");

    if (cssParallaxSupported) {
      console.log(
        `[V3-ElDiferencial] ✅ CSS scroll-driven parallax supported — JS fallback skipped`
      );
      return;
    }

    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        console.log(`[V3-ElDiferencial] ♿ prefers-reduced-motion — parallax disabled`);
        return;
      }
    } catch (err) {
      console.error(
        `[V3-ElDiferencial] ❌ Failed to query prefers-reduced-motion — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    const el = parallaxRef.current;
    if (!el) {
      console.warn(
        `[V3-ElDiferencial] ⚠️ parallaxRef is null — JS parallax fallback won't work. ` +
        `Reason: section element not mounted or ref not attached.`
      );
      return;
    }

    console.log(
      `[V3-ElDiferencial] 🎬 JS parallax fallback INITIALIZED — ` +
      `CSS animation-timeline: view() not supported in this browser`
    );

    function update() {
      if (!el) return;
      try {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        el.style.setProperty("--el-diff-scroll", String(progress));
      } catch (err) {
        console.error(
          `[V3-ElDiferencial] ❌ Parallax update FAILED — ` +
          `Reason: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    function handleScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    try {
      window.addEventListener("scroll", handleScroll, { passive: true });
      update();
    } catch (err) {
      console.error(
        `[V3-ElDiferencial] ❌ Failed to attach parallax scroll listener — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Combine refs: sectionRef (IO) + parallaxRef (parallax)
  const combinedRef = useCallback(
    (node: HTMLElement | null) => {
      if (typeof sectionRef === "function") sectionRef(node);
      parallaxRef.current = node;
    },
    [sectionRef]
  );

  return (
    <section
      className={`${styles.section} ${hasRevealed ? styles.revealed : ""}`}
      ref={combinedRef}
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
          <div className={styles.imageParallax}>
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
      </div>

      <div className={styles.secondRow}>
        <div className={styles.secondImageBlock}>
          <div className={styles.revealBlock} aria-hidden="true" />
          <div className={styles.imageParallax}>
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
      </div>
    </section>
  );
}
