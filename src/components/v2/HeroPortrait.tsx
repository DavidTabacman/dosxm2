import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./HeroPortrait.module.css";

export default function HeroPortrait() {
  const [heroRef, heroVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [mounted, setMounted] = useState(false);

  // Delay FAB appearance to avoid flash on initial load
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(id);
  }, []);

  const showFab = mounted && !heroVisible;

  return (
    <>
      <section className={styles.hero} ref={heroRef}>
        <h1 className={styles.heading}>Hola. Somos DOSXM2.</h1>
        <p className={styles.subheading}>
          Y vendemos tu casa como si fuese la nuestra. Literalmente.
        </p>

        {/* Portraits in hero — cinemagraph videos for "Living Portrait" effect */}
        {!showFab && (
          <div className={styles.portraits}>
            <video
              className={styles.portrait}
              src="https://videos.pexels.com/video-files/4625518/4625518-uhd_2560_1440_24fps.mp4"
              poster="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
              loop
              muted
              autoPlay
              playsInline
              aria-label="Fundador 1 de DOSXM2"
              data-asset-type="portrait"
            />
            <video
              className={styles.portrait}
              src="https://videos.pexels.com/video-files/4623581/4623581-uhd_2560_1440_24fps.mp4"
              poster="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
              loop
              muted
              autoPlay
              playsInline
              aria-label="Fundador 2 de DOSXM2"
              data-asset-type="portrait"
            />
          </div>
        )}
      </section>

      {/* FAB (visible when hero scrolls out) */}
      {showFab && (
        <>
          <div className={styles.fabBg} aria-hidden="true" />
          <div className={styles.fab} aria-label="Fundadores de DOSXM2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.portrait}
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=face"
              alt="Fundador 1"
              data-asset-type="portrait"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.portrait}
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
              alt="Fundador 2"
              data-asset-type="portrait"
            />
          </div>
        </>
      )}
    </>
  );
}
