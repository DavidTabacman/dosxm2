import { useCallback, useEffect, useRef, useState } from "react";

let playbackIdCounter = 0;

/**
 * Robust video autoplay hook with retry logic and IntersectionObserver-based
 * play/pause for off-screen videos. Follows MDN/Chrome autoplay best practices.
 */
export function useVideoPlayback(label?: string): {
  ref: (node: HTMLVideoElement | null) => void;
  hasError: boolean;
  isPlaying: boolean;
} {
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debugId = useRef(++playbackIdCounter);

  const tag = label || `#${debugId.current}`;

  // Attempt to play with a single muted retry on NotAllowedError
  const attemptPlay = useCallback(async (video: HTMLVideoElement) => {
    // Skip if already playing (avoids AbortError from racing with HTML autoplay attribute)
    if (!video.paused) {
      console.log(`[VideoPlayback:${tag}] ✅ Already playing — skipping manual play()`);
      setIsPlaying(true);
      return;
    }

    console.log(`[VideoPlayback:${tag}] ▶️ Attempting play — src: ${video.src?.slice(-40)}, muted: ${video.muted}, readyState: ${video.readyState}`);

    try {
      await video.play();
      console.log(`[VideoPlayback:${tag}] ✅ Playback started successfully`);
      setIsPlaying(true);
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          console.warn(`[VideoPlayback:${tag}] ⚠️ NotAllowedError — autoplay blocked by browser policy. Retrying with muted=true...`);
          // Ensure muted, retry once
          video.muted = true;
          try {
            await video.play();
            console.log(`[VideoPlayback:${tag}] ✅ Muted retry succeeded`);
            setIsPlaying(true);
          } catch (retryError) {
            const retryMsg = retryError instanceof DOMException
              ? `${retryError.name}: ${retryError.message}`
              : String(retryError);
            console.error(`[VideoPlayback:${tag}] ❌ Muted retry FAILED — ${retryMsg}. Falling back to poster image.`);
            setHasError(true);
          }
        } else if (error.name === "AbortError") {
          console.warn(`[VideoPlayback:${tag}] ⏳ AbortError — play() interrupted (likely by a new load request). Will retry in 100ms.`);
          // Play interrupted by new load — safe to retry after short delay
          retryTimerRef.current = setTimeout(() => {
            video.play()
              .then(() => {
                console.log(`[VideoPlayback:${tag}] ✅ Delayed retry succeeded after AbortError`);
                setIsPlaying(true);
              })
              .catch((delayedErr) => {
                const msg = delayedErr instanceof DOMException
                  ? `${delayedErr.name}: ${delayedErr.message}`
                  : String(delayedErr);
                console.warn(`[VideoPlayback:${tag}] ⚠️ Delayed retry also failed — ${msg}. Video may play when visible.`);
              });
          }, 100);
        } else {
          console.error(`[VideoPlayback:${tag}] ❌ Unexpected DOMException — name: "${error.name}", message: "${error.message}". Falling back to poster image.`);
          setHasError(true);
        }
      } else {
        console.error(`[VideoPlayback:${tag}] ❌ Non-DOM error during play() —`, error);
        setHasError(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const ref = useCallback(
    (node: HTMLVideoElement | null) => {
      // Cleanup previous
      observerRef.current?.disconnect();
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

      if (!node) {
        videoRef.current = null;
        return;
      }

      videoRef.current = node;
      console.log(`[VideoPlayback:${tag}] 🎬 Ref attached — src: ${node.src?.slice(-40)}, networkState: ${node.networkState}, readyState: ${node.readyState}`);

      // Listen for errors on the video element
      const handleError = () => {
        const v = node;
        const err = v.error;
        console.error(
          `[VideoPlayback:${tag}] ❌ Video error event — ` +
          `code: ${err?.code ?? "?"}, ` +
          `message: "${err?.message ?? "unknown"}", ` +
          `networkState: ${v.networkState} (${["EMPTY","IDLE","LOADING","NO_SOURCE"][v.networkState] ?? "?"}), ` +
          `readyState: ${v.readyState}, ` +
          `src: ${v.src?.slice(-60)}`
        );
        setHasError(true);
      };

      const handlePlaying = () => {
        console.log(`[VideoPlayback:${tag}] 🎬 Playing — rendering frames`);
        setIsPlaying(true);
      };

      const handlePause = () => {
        console.log(`[VideoPlayback:${tag}] ⏸️ Paused`);
        setIsPlaying(false);
      };

      const handleStalled = () => {
        console.warn(`[VideoPlayback:${tag}] ⚠️ Stalled — network fetch stalled, networkState: ${node.networkState}`);
      };

      const handleWaiting = () => {
        console.log(`[VideoPlayback:${tag}] ⏳ Waiting — buffering, readyState: ${node.readyState}`);
      };

      const handleSuspend = () => {
        console.log(`[VideoPlayback:${tag}] 💤 Suspend — browser paused fetching intentionally`);
      };

      node.addEventListener("error", handleError);
      node.addEventListener("playing", handlePlaying);
      node.addEventListener("pause", handlePause);
      node.addEventListener("stalled", handleStalled);
      node.addEventListener("waiting", handleWaiting);
      node.addEventListener("suspend", handleSuspend);

      // Attempt initial play
      attemptPlay(node);

      // IntersectionObserver: pause off-screen, resume on-screen
      if (typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              console.log(`[VideoPlayback:${tag}] 👁️ Visible — resuming playback`);
              node.play()
                .then(() => setIsPlaying(true))
                .catch((err) => {
                  const msg = err instanceof DOMException ? `${err.name}: ${err.message}` : String(err);
                  console.warn(`[VideoPlayback:${tag}] ⚠️ Resume play failed — ${msg}`);
                });
            } else {
              console.log(`[VideoPlayback:${tag}] 🙈 Off-screen — pausing to save resources`);
              node.pause();
            }
          },
          { threshold: 0.25 }
        );
        observer.observe(node);
        observerRef.current = observer;
      } else {
        console.warn(`[VideoPlayback:${tag}] ⚠️ IntersectionObserver not available — off-screen pause disabled`);
      }
    },
    [attemptPlay, tag]
  );

  return { ref, hasError, isPlaying };
}
