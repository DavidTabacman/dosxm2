import { useCallback, useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useVideoPlayback } from "../shared/useVideoPlayback";
import VideoPlayPause from "../shared/VideoPlayPause";
import styles from "./V4HeroSplit.module.css";

/* BRD 4.1 — split-screen videos.
 * - Left: architectural / aspirational (cool detail) — balcony w/ Madrid sun.
 * - Right: lifestyle / warm — reformado interior with natural light.
 * Sources are clips from DOSXM2's own TikTok @dosxm2, downsized for
 * hero use. H.264 MP4 is universally supported and already compresses
 * smaller than the VP9/WebM twins at this resolution, so no fallback
 * tree is needed.
 */
const LEFT_VIDEO = "/v4/hero/hero-left.mp4";
const LEFT_POSTER = "/v4/hero/hero-left-poster.jpg";
const RIGHT_VIDEO = "/v4/hero/hero-right.mp4";
const RIGHT_POSTER = "/v4/hero/hero-right-poster.jpg";

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

  // Respect Save-Data / 2G — skip the hero videos on metered or slow
  // connections. navigator.connection is non-standard and Safari returns
  // undefined, in which case we keep the default video render.
  const [lowData, setLowData] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    type Conn = {
      saveData?: boolean;
      effectiveType?: string;
      addEventListener?: (type: string, cb: () => void) => void;
      removeEventListener?: (type: string, cb: () => void) => void;
    };
    const conn = (navigator as unknown as { connection?: Conn }).connection;
    if (!conn) return;
    const update = () => {
      setLowData(
        conn.saveData === true ||
          conn.effectiveType === "2g" ||
          conn.effectiveType === "slow-2g"
      );
    };
    update();
    conn.addEventListener?.("change", update);
    return () => conn.removeEventListener?.("change", update);
  }, []);

  const skipLeftVideo = leftError || lowData;
  const skipRightVideo = rightError || lowData;

  // Direct DOM mutation — updates the --divider-pos CSS variable based on
  // cursor X. No React state, no re-renders. Mirrors V1's proven approach.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    // Touch devices: leave at fixed 50%. Coarse-pointer + no-hover catches
    // real phones/tablets while excluding hybrid devices (iPad + Magic
    // Keyboard) that misfire with the legacy "ontouchstart" heuristic.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    )
      return;

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

  return (
    <section
      className={styles.hero}
      ref={heroRef}
      style={{ "--divider-pos": "50%" } as React.CSSProperties}
      aria-label="Introducción a DOSXM2"
    >
      {/* Background panels (videos + veils). The text layer is nested inside
         panelLeft so on mobile (stacked flex column) the H1 + CTA sit above
         the fold instead of trailing after both panels' worth of video. On
         desktop, CSS absolutely positions the text inside panelLeft's
         inset:0 containing block, preserving the overlay. */}
      <div className={styles.panelLeft}>
        {skipLeftVideo ? (
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
        <div className={styles.textLayer}>
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
              href="https://valuation.lystos.com/?clientId=cadc5d64-196d-4b14-a542-0858ecf58bd0&utm_source=web&utm_medium=cta&utm_content=hero"
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
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
      </div>

      <div className={styles.panelRight}>
        {skipRightVideo ? (
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
    </section>
  );
}
