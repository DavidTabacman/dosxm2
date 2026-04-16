import { useCallback, useEffect, useRef } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useVideoPlayback } from "../shared/useVideoPlayback";
import VideoPlayPause from "../shared/VideoPlayPause";
import styles from "./HeroSplit.module.css";

const LEFT_VIDEO = "https://assets.mixkit.co/videos/4030/4030-720.mp4";
const LEFT_POSTER =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop";
const RIGHT_VIDEO = "https://assets.mixkit.co/videos/4488/4488-720.mp4";
const RIGHT_POSTER =
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop";

export default function HeroSplit() {
  const heroRef = useRef<HTMLElement>(null);
  const leftVideoElRef = useRef<HTMLVideoElement>(null);
  const rightVideoElRef = useRef<HTMLVideoElement>(null);

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

  // Direct DOM mutation for mouse tracking — NO useState, NO re-renders
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    // Touch devices: leave at 50%
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    let rafId = 0;

    function handleMouseMove(e: MouseEvent) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const dividerPos = 30 + x * 40; // Clamp between 30% and 70%
        el!.style.setProperty("--divider-pos", `${dividerPos}%`);
      });
    }

    el.addEventListener("mousemove", handleMouseMove);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Stable combined refs — useCallback prevents re-creation on every render
  const setLeftVideoRef = useCallback((node: HTMLVideoElement | null) => {
    leftVideoElRef.current = node;
    leftPlaybackRef(node);
    leftInViewRef(node);
  }, [leftPlaybackRef, leftInViewRef]);

  const setRightVideoRef = useCallback((node: HTMLVideoElement | null) => {
    rightVideoElRef.current = node;
    rightPlaybackRef(node);
  }, [rightPlaybackRef]);

  return (
    <section
      className={styles.hero}
      ref={heroRef}
      style={{ "--divider-pos": "50%" } as React.CSSProperties}
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
