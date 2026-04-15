import { useEffect, useRef, useState } from "react";
import styles from "./VideoPlayPause.module.css";

interface VideoPlayPauseProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  label?: string;
}

/**
 * Accessible play/pause toggle button for video containers.
 * Positioned in the bottom-right corner, visible on parent hover and keyboard focus.
 * Syncs with the video element's actual play/pause state (handles external
 * pause/resume from IntersectionObserver or other sources).
 */
export default function VideoPlayPause({ videoRef, label }: VideoPlayPauseProps) {
  const [isPaused, setIsPaused] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const tag = label || "unknown";

  // Sync isPaused with the video element's actual state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPaused(false);
    const onPause = () => setIsPaused(true);

    // Set initial state
    setIsPaused(video.paused);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [videoRef]);

  function handleToggle() {
    const video = videoRef.current;
    if (!video) {
      console.warn(`[VideoPlayPause:${tag}] ⚠️ Toggle failed — video ref is null. The video element may not be mounted.`);
      return;
    }

    if (video.paused) {
      console.log(`[VideoPlayPause:${tag}] ▶️ User pressed play — resuming video`);
      video.play().catch((err) => {
        const msg = err instanceof DOMException ? `${err.name}: ${err.message}` : String(err);
        console.error(`[VideoPlayPause:${tag}] ❌ Play failed after user toggle — ${msg}`);
      });
    } else {
      console.log(`[VideoPlayPause:${tag}] ⏸️ User pressed pause — pausing video`);
      video.pause();
    }
  }

  return (
    <button
      ref={buttonRef}
      className={styles.button}
      onClick={handleToggle}
      aria-label={isPaused ? "Reproducir video" : "Pausar video"}
      type="button"
    >
      {isPaused ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <polygon points="3,1 13,8 3,15" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="2" y="1" width="4" height="14" />
          <rect x="10" y="1" width="4" height="14" />
        </svg>
      )}
    </button>
  );
}
