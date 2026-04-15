import { useEffect, useRef } from "react";
import styles from "./HeroImmersive.module.css";

export default function HeroImmersive() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) {
      console.warn(
        `[V3-HeroImmersive] ⚠️ sectionRef is null — scroll morph won't work. ` +
        `Reason: the <section> element has not mounted or ref was not attached.`
      );
      return;
    }

    // Respect reduced motion
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        console.log(`[V3-HeroImmersive] ♿ prefers-reduced-motion — scroll morph disabled`);
        return;
      }
    } catch (err) {
      console.error(
        `[V3-HeroImmersive] ❌ Failed to query prefers-reduced-motion — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    if (el.offsetHeight === 0) {
      console.warn(
        `[V3-HeroImmersive] ⚠️ Section height is 0px — scroll morph will not produce visible results. ` +
        `Reason: element may be hidden via CSS (display:none) or not yet laid out.`
      );
    }

    console.log(
      `[V3-HeroImmersive] 🎬 Scroll morph INITIALIZED — ` +
      `sectionHeight: ${el.offsetHeight}px, viewportHeight: ${window.innerHeight}px`
    );

    function update() {
      if (!el || el.offsetHeight === 0) return;
      try {
        // Progress over the full 200vh height
        const progress = Math.min(
          Math.max(window.scrollY / el.offsetHeight, 0),
          1
        );

        if (progress <= 0.5) {
          // Phase 1: scale down, fade text
          const phase1 = progress * 2; // normalize to 0-1
          el.style.setProperty("--morph-scale", String(1 - phase1 * 0.15));
          el.style.setProperty("--morph-radius", "0px");
          el.style.setProperty("--morph-x", "0px");
          el.style.setProperty("--morph-y", "0px");
          el.style.setProperty("--text-opacity", String(1 - phase1 * 1.5));
          el.style.setProperty("--gradient-opacity", String(phase1));
          el.style.setProperty("--morph-shadow", "none");
          el.style.setProperty("--morph-width", "100%");
        } else {
          // Phase 2: morph into card — shrink, round corners, center, add shadow
          const phase2 = (progress - 0.5) * 2; // normalize to 0-1
          const eased = phase2 * phase2 * (3 - 2 * phase2); // smoothstep
          el.style.setProperty("--morph-scale", String(0.85 - eased * 0.2));
          el.style.setProperty("--morph-radius", `${eased * 12}px`);
          el.style.setProperty("--morph-x", "0px");
          el.style.setProperty("--morph-y", `${eased * 10}vh`);
          el.style.setProperty("--text-opacity", "0");
          el.style.setProperty("--gradient-opacity", String(1 + eased * 0.5));
          el.style.setProperty(
            "--morph-shadow",
            `0 ${eased * 20}px ${eased * 60}px rgba(0,0,0,${(eased * 0.15).toFixed(3)})`
          );
          el.style.setProperty(
            "--morph-width",
            `${100 - eased * 40}%`
          );
        }
      } catch (err) {
        console.error(
          `[V3-HeroImmersive] ❌ Scroll morph update FAILED — ` +
          `Reason: ${err instanceof Error ? err.message : String(err)}. ` +
          `scrollY: ${window.scrollY}, sectionHeight: ${el?.offsetHeight ?? "N/A"}`
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
        `[V3-HeroImmersive] ❌ Failed to attach scroll listener — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
      );
    }

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
