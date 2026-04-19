import { useCallback, useEffect, useRef } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useVideoPlayback } from "../shared/useVideoPlayback";
import VideoPlayPause from "../shared/VideoPlayPause";
import styles from "./V4HeroSplit.module.css";

/* BRD 4.1 — split-screen videos.
 * - Left: architectural / aspirational (cool detail).
 * - Right: lifestyle / warm.
 * Using Mixkit CDN for V1 parity with fallback posters from Unsplash.
 * When licensed Madrid footage is delivered, swap these URLs for
 * files under /public/v4/hero/ and update the <source type="video/webm">
 * first for broader codec support.
 */
const LEFT_VIDEO = "https://assets.mixkit.co/videos/4030/4030-720.mp4";
const LEFT_POSTER =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&h=1000&fit=crop";
const RIGHT_VIDEO = "https://assets.mixkit.co/videos/4488/4488-720.mp4";
const RIGHT_POSTER =
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&h=1000&fit=crop";

export default function V4HeroSplit() {
  const heroRef = useRef<HTMLElement>(null);
  const leftVideoElRef = useRef<HTMLVideoElement>(null);

  // We only need the ref from this observer — it keeps the right video's
  // playback lifecycle in sync with its visibility, and letting the element
  // report intersection guards against off-screen autoplay jank.
  const [rightInViewRef] = useIntersectionObserver({ threshold: 0.3 });

  const { ref: leftPlaybackRef, hasError: leftError } =
    useVideoPlayback("V4-Hero-Left");
  const { ref: rightPlaybackRef, hasError: rightError } =
    useVideoPlayback("V4-Hero-Right");

  // Direct DOM mutation — updates the --divider-pos CSS variable based on
  // cursor X. No React state, no re-renders. Mirrors V1's proven approach.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    // Touch devices: leave at fixed 50%.
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    let rafId = 0;

    function handleMouseMove(e: MouseEvent) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const dividerPos = 30 + x * 40; // clamp 30%..70%
        el.style.setProperty("--divider-pos", `${dividerPos}%`);
      });
    }

    el.addEventListener("mousemove", handleMouseMove);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const setLeftVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      leftVideoElRef.current = node;
      leftPlaybackRef(node);
    },
    [leftPlaybackRef]
  );

  const setRightVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      rightPlaybackRef(node);
      rightInViewRef(node);
    },
    [rightPlaybackRef, rightInViewRef]
  );

  function handleCtaClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (typeof document === "undefined") return;
    const target = document.querySelector("#valorador");
    if (!target) {
      console.warn(
        `[V4-HeroSplit] ⚠️ CTA target "#valorador" not found — smooth scroll skipped. ` +
          `Reason: Valorador section has not mounted yet.`
      );
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof history !== "undefined") {
      history.replaceState(null, "", "#valorador");
    }
    console.log(`[V4-HeroSplit] 🔗 CTA clicked — scrolling to valorador`);
  }

  return (
    <section
      className={styles.hero}
      ref={heroRef}
      style={{ "--divider-pos": "50%" } as React.CSSProperties}
      aria-label="Introducción a DOSXM2"
    >
      {/* Background panels (videos + veils) */}
      <div className={styles.panelLeft}>
        {leftError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.panelBg}
            src={LEFT_POSTER}
            alt=""
            aria-hidden="true"
            data-asset-type="hero-bg-fallback"
          />
        ) : (
          <video
            ref={setLeftVideoRef}
            className={styles.panelBg}
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
      </div>

      <div className={styles.panelRight}>
        {rightError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.panelBg}
            src={RIGHT_POSTER}
            alt=""
            aria-hidden="true"
            data-asset-type="hero-bg-fallback"
          />
        ) : (
          <video
            ref={setRightVideoRef}
            className={styles.panelBg}
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
      </div>

      <div className={styles.divider} aria-hidden="true" />

      {/* Text layer — desktop: single overlay on the dark (left) panel.
         mobile: stacked under each panel via CSS. */}
      <div className={styles.textLayer}>
        <span className={styles.eyebrow}>Inmobiliaria Madrid</span>
        <h1 className={styles.heading}>
          Detrás de cada casa hay{" "}
          <span className={styles.headingAccent}>una historia.</span>
        </h1>
        <p className={styles.sub}>
          Vendemos tu casa como si fuese la nuestra. Doble compromiso, trato
          personal y resultados demostrables en Madrid.
        </p>
        <div className={styles.ctaRow}>
          <a
            href="#valorador"
            className={styles.cta}
            onClick={handleCtaClick}
          >
            Valora tu propiedad
            <svg
              className={styles.ctaArrow}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10m0 0L9 4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <VideoPlayPause videoRef={leftVideoElRef} label="V4-Hero-Left" />
        </div>
      </div>

    </section>
  );
}
