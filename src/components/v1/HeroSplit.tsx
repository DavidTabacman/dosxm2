import { useRef } from "react";
import { useMousePosition } from "../shared/useMousePosition";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useVideoPlayback } from "../shared/useVideoPlayback";
import VideoPlayPause from "../shared/VideoPlayPause";
import styles from "./HeroSplit.module.css";

const LEFT_VIDEO = "https://assets.mixkit.co/videos/4814/4814-720.mp4";
const LEFT_POSTER =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop";
const RIGHT_VIDEO = "https://assets.mixkit.co/videos/4818/4818-720.mp4";
const RIGHT_POSTER =
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop";

export default function HeroSplit() {
  const heroRef = useRef<HTMLElement>(null);
  const leftVideoElRef = useRef<HTMLVideoElement>(null);
  const rightVideoElRef = useRef<HTMLVideoElement>(null);

  const { x } = useMousePosition(heroRef);
  const [rightRef, rightVisible] = useIntersectionObserver({ threshold: 0.3 });
  const [leftInViewRef, leftInView] = useIntersectionObserver({ threshold: 0.3 });

  const {
    ref: leftPlaybackRef,
    hasError: leftError,
  } = useVideoPlayback("HeroSplit-Left");
  const {
    ref: rightPlaybackRef,
    hasError: rightError,
  } = useVideoPlayback("HeroSplit-Right");

  // Clamp divider between 30% and 70%
  const dividerPos = 30 + x * 40;

  // Log split reveal state for debugging
  if (typeof window !== "undefined") {
    console.log(
      `[HeroSplit] 🎞️ Split Reveal — dividerPos: ${dividerPos.toFixed(1)}% | ` +
      `mouseX: ${x.toFixed(3)} | ` +
      `leftVideo: ${leftError ? "❌ ERROR (poster fallback)" : "✅ OK"} | ` +
      `rightVideo: ${rightError ? "❌ ERROR (poster fallback)" : "✅ OK"} | ` +
      `leftInView: ${leftInView} | rightVisible: ${rightVisible}`
    );
  }

  // Combine refs for left video: playback + element ref + inView
  const setLeftVideoRef = (node: HTMLVideoElement | null) => {
    leftVideoElRef.current = node;
    leftPlaybackRef(node);
    leftInViewRef(node);
  };

  // Combine refs for right video: playback + element ref
  const setRightVideoRef = (node: HTMLVideoElement | null) => {
    rightVideoElRef.current = node;
    rightPlaybackRef(node);
  };

  return (
    <section
      className={styles.hero}
      ref={heroRef}
      data-cursor="split"
      style={{ "--divider-pos": `${dividerPos}%` } as React.CSSProperties}
    >
      <div className={styles.panelLeft}>
        {leftError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.panelBg}
            src={LEFT_POSTER}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <video
            ref={setLeftVideoRef}
            className={`${styles.panelBg} ${leftInView ? styles.videoInView : ""}`}
            src={LEFT_VIDEO}
            poster={LEFT_POSTER}
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            data-asset-type="hero-bg"
          />
        )}
        <VideoPlayPause videoRef={leftVideoElRef} label="HeroSplit-Left" />
        <h1 className={styles.headingLeft}>Vendemos tu casa</h1>
        <p className={styles.subheading}>
          En un sector donde la mayoría trabaja solo, nosotros somos dos.
        </p>
      </div>

      <div
        className={styles.divider}
        aria-hidden="true"
      />

      <div
        className={`${styles.panelRight} ${rightVisible ? styles.mobileVisible : styles.mobileHidden}`}
        ref={rightRef}
      >
        {rightError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.panelBg}
            src={RIGHT_POSTER}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <video
            ref={setRightVideoRef}
            className={`${styles.panelBg} ${rightVisible ? styles.videoInView : ""}`}
            src={RIGHT_VIDEO}
            poster={RIGHT_POSTER}
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            data-asset-type="hero-bg"
          />
        )}
        <VideoPlayPause videoRef={rightVideoElRef} label="HeroSplit-Right" />
        <p className={styles.headingRight}>como si fuese la nuestra.</p>
      </div>
    </section>
  );
}
