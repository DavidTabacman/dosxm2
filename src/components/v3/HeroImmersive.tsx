import { useEffect, useRef } from "react";
import styles from "./HeroImmersive.module.css";

export default function HeroImmersive() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function update() {
      if (!el) return;
      const progress = Math.min(
        Math.max(window.scrollY / window.innerHeight, 0),
        1
      );
      el.style.setProperty("--scroll-progress", String(progress));
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
    </section>
  );
}
