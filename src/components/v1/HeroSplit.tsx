import { useRef, useCallback } from "react";
import { useMousePosition } from "../shared/useMousePosition";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./HeroSplit.module.css";

function useVideoDebug(label: string) {
  return {
    onLoadStart: () => console.log(`[Video:${label}] 📡 loadstart — browser began fetching`),
    onLoadedData: () => console.log(`[Video:${label}] 📦 loadeddata — first frame available`),
    onCanPlay: () => console.log(`[Video:${label}] ✅ canplay — ready to play`),
    onPlay: () => console.log(`[Video:${label}] ▶️ play — playback started`),
    onPlaying: () => console.log(`[Video:${label}] 🎬 playing — actually rendering frames`),
    onWaiting: () => console.log(`[Video:${label}] ⏳ waiting — buffering...`),
    onStalled: () => console.log(`[Video:${label}] ⚠️ stalled — network stall`),
    onError: (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const v = e.currentTarget;
      const err = v.error;
      console.error(`[Video:${label}] ❌ ERROR — code: ${err?.code}, message: "${err?.message}", networkState: ${v.networkState}, readyState: ${v.readyState}, src: ${v.src}`);
    },
    onSuspend: () => console.log(`[Video:${label}] 💤 suspend — browser paused fetching (intentional)`),
  };
}

export default function HeroSplit() {
  const heroRef = useRef<HTMLElement>(null);
  const { x } = useMousePosition(heroRef);
  const [rightRef, rightVisible] = useIntersectionObserver({ threshold: 0.3 });

  // Clamp divider between 30% and 70%
  const dividerPos = 30 + x * 40;

  return (
    <section className={styles.hero} ref={heroRef}>
      <div
        className={styles.panelLeft}
        style={{ flexBasis: `${dividerPos}%` }}
      >
        <video
          className={styles.panelBg}
          src="https://assets.mixkit.co/videos/4814/4814-720.mp4"
          poster="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop"
          loop
          muted
          autoPlay
          playsInline
          aria-hidden="true"
          data-asset-type="hero-bg"
          {...useVideoDebug("V1-Hero-Left")}
        />
        <h1 className={styles.headingLeft}>Vendemos tu casa</h1>
        <p className={styles.subheading}>
          En un sector donde la mayoría trabaja solo, nosotros somos dos.
        </p>
      </div>

      <div
        className={styles.divider}
        style={{ left: `${dividerPos}%` }}
        aria-hidden="true"
      />

      <div
        className={`${styles.panelRight} ${rightVisible ? styles.mobileVisible : styles.mobileHidden}`}
        ref={rightRef}
        style={{ flexBasis: `${100 - dividerPos}%` }}
      >
        <video
          className={styles.panelBg}
          src="https://assets.mixkit.co/videos/4818/4818-720.mp4"
          poster="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop"
          loop
          muted
          autoPlay
          playsInline
          aria-hidden="true"
          data-asset-type="hero-bg"
          {...useVideoDebug("V1-Hero-Right")}
        />
        <p className={styles.headingRight}>como si fuese la nuestra.</p>
      </div>
    </section>
  );
}
