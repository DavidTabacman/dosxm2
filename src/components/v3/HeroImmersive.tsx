import { useEffect, useRef } from "react";
import { useHeroMorph } from "./HeroMorphContext";
import styles from "./HeroImmersive.module.css";

export default function HeroImmersive() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const { registerHeroRef } = useHeroMorph();

  // Register hero section with morph context
  useEffect(() => {
    registerHeroRef(sectionRef.current);
    return () => registerHeroRef(null);
  }, [registerHeroRef]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) {
      console.warn(
        `[V3-HeroImmersive] ⚠️ sectionRef is null — text fade won't work. ` +
        `Reason: the <section> element has not mounted or ref was not attached.`
      );
      return;
    }

    // Respect reduced motion
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        console.log(`[V3-HeroImmersive] ♿ prefers-reduced-motion — text fade disabled`);
        return;
      }
    } catch {
      // matchMedia not available
    }

    if (el.offsetHeight === 0) {
      console.warn(
        `[V3-HeroImmersive] ⚠️ Section height is 0px — text fade will not produce visible results.`
      );
      return;
    }

    console.log(
      `[V3-HeroImmersive] 🎬 Text fade INITIALIZED — ` +
      `sectionHeight: ${el.offsetHeight}px, viewportHeight: ${window.innerHeight}px`
    );

    function update() {
      if (!el || el.offsetHeight === 0) return;
      try {
        // Text fade and gradient — progress over the hero's scroll height
        const progress = Math.min(
          Math.max(window.scrollY / el.offsetHeight, 0),
          1
        );

        // Fade text out over the first half of scroll
        const textOpacity = Math.max(0, 1 - progress * 2.5);
        el.style.setProperty("--text-opacity", String(textOpacity));

        // Gradient fades in
        el.style.setProperty("--gradient-opacity", String(progress));
      } catch (err) {
        console.error(
          `[V3-HeroImmersive] ❌ Text fade update FAILED — ` +
          `Reason: ${err instanceof Error ? err.message : String(err)}`
        );
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
        {/* Fallback image — visible on mobile and reduced-motion
            (when the fixed morph layer is hidden) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.fallbackImage}
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop"
          alt="Interior de propiedad en Madrid"
          data-asset-type="hero-video-poster"
          loading="eager"
        />

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
