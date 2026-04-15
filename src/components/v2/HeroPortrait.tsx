import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./HeroPortrait.module.css";

function videoDebug(label: string) {
  return {
    onLoadStart: () => console.log(`[Video:${label}] 📡 loadstart`),
    onCanPlay: () => console.log(`[Video:${label}] ✅ canplay`),
    onPlay: () => console.log(`[Video:${label}] ▶️ play`),
    onPlaying: () => console.log(`[Video:${label}] 🎬 playing`),
    onStalled: () => console.log(`[Video:${label}] ⚠️ stalled`),
    onError: (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const v = e.currentTarget;
      console.error(`[Video:${label}] ❌ ERROR — code: ${v.error?.code}, message: "${v.error?.message}", networkState: ${v.networkState}, src: ${v.src}`);
    },
  };
}

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
              src="https://assets.mixkit.co/videos/4623/4623-720.mp4"
              poster="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
              loop
              muted
              autoPlay
              playsInline
              aria-label="Fundador 1 de DOSXM2"
              data-asset-type="portrait"
              {...videoDebug("V2-Portrait-1")}
            />
            <video
              className={styles.portrait}
              src="https://assets.mixkit.co/videos/4625/4625-720.mp4"
              poster="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
              loop
              muted
              autoPlay
              playsInline
              aria-label="Fundador 2 de DOSXM2"
              data-asset-type="portrait"
              {...videoDebug("V2-Portrait-2")}
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
