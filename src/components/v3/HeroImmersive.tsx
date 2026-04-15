import { useEffect, useRef } from "react";
import styles from "./HeroImmersive.module.css";

export default function HeroImmersive() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) { console.warn(`[V3-HeroImmersive] ⚠️ sectionRef is null — scroll morph won't work`); return; }

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      console.log(`[V3-HeroImmersive] ♿ prefers-reduced-motion — scroll morph disabled`);
      return;
    }

    console.log(`[V3-HeroImmersive] 🎬 Scroll morph effect INITIALIZED — section height: ${el.offsetHeight}px`);

    function update() {
      if (!el) return;
      // Progress over the full 200vh height
      const progress = Math.min(
        Math.max(window.scrollY / el.offsetHeight, 0),
        1
      );

      if (progress <= 0.5) {
        // Phase 1: original behavior — scale down, fade text
        const phase1 = progress * 2; // normalize to 0-1
        el.style.setProperty("--morph-scale", String(1 - phase1 * 0.15));
        el.style.setProperty("--morph-radius", "0px");
        el.style.setProperty("--morph-x", "0px");
        el.style.setProperty("--morph-y", "0px");
        el.style.setProperty("--text-opacity", String(1 - phase1 * 1.5));
        el.style.setProperty("--gradient-opacity", String(phase1));
      } else {
        // Phase 2: morph into card — shrink, round corners, shift position
        const phase2 = (progress - 0.5) * 2; // normalize to 0-1
        const eased = phase2 * phase2 * (3 - 2 * phase2); // smoothstep
        el.style.setProperty("--morph-scale", String(0.85 - eased * 0.4));
        el.style.setProperty("--morph-radius", `${eased * 12}px`);
        el.style.setProperty("--morph-x", `${eased * 10}vw`);
        el.style.setProperty("--morph-y", `${eased * 5}vh`);
        el.style.setProperty("--text-opacity", "0");
        el.style.setProperty("--gradient-opacity", String(1 + eased * 0.5));
      }
    }

    function handleScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className={styles.hero} ref={sectionRef}>
      <div className={styles.stickyFrame}>
        <div className={styles.imageWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.image}
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop"
            alt="Interior de propiedad en Madrid"
            data-asset-type="hero-video-poster"
            loading="eager"
          />
        </div>

        <div className={styles.overlay}>
          <h1 className={styles.heading}>Tu casa.</h1>
          <p className={styles.subheading}>
            Nuestra dedicación. El poder de dos expertos trabajando para ti.
          </p>
        </div>
      </div>
    </section>
  );
}
