import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Robust video autoplay hook with retry logic and IntersectionObserver-based
 * play/pause for off-screen videos. Follows MDN/Chrome autoplay best practices.
 *
 * Logs only on actual errors — no lifecycle noise.
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

  const tag = label || "video";

  // Attempt to play with a single muted retry on NotAllowedError
  const attemptPlay = useCallback(async (video: HTMLVideoElement) => {
    // Skip if already playing (avoids AbortError from racing with HTML autoplay attribute)
    if (!video.paused) {
      setIsPlaying(true);
      return;
    }

    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          console.warn(`[VideoPlayback:${tag}] Autoplay blocked by browser policy. Retrying muted.`);
          video.muted = true;
          try {
            await video.play();
            setIsPlaying(true);
          } catch (retryError) {
            const retryMsg = retryError instanceof DOMException
              ? `${retryError.name}: ${retryError.message}`
              : String(retryError);
            console.error(`[VideoPlayback:${tag}] Muted retry FAILED — ${retryMsg}. Falling back to poster.`);
            setHasError(true);
          }
        } else if (error.name === "AbortError") {
          // Play interrupted by new load — retry once after short delay
          retryTimerRef.current = setTimeout(() => {
            video.play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }, 100);
        } else {
          console.error(`[VideoPlayback:${tag}] Unexpected error — ${error.name}: ${error.message}. Falling back to poster.`);
          setHasError(true);
        }
      } else {
        console.error(`[VideoPlayback:${tag}] Non-DOM error during play() —`, error);
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

      // Listen for errors on the video element
      const handleError = () => {
        const v = node;
        const err = v.error;
        console.error(
          `[VideoPlayback:${tag}] Video error — ` +
          `code: ${err?.code ?? "?"}, ` +
          `message: "${err?.message ?? "unknown"}", ` +
          `networkState: ${v.networkState} (${["EMPTY","IDLE","LOADING","NO_SOURCE"][v.networkState] ?? "?"}), ` +
          `src: ${v.src?.slice(-60)}`
        );
        setHasError(true);
      };

      const handleStalled = () => {
        console.error(`[VideoPlayback:${tag}] Network stalled — networkState: ${node.networkState}, src: ${node.src?.slice(-40)}`);
      };

      node.addEventListener("error", handleError);
      node.addEventListener("playing", () => setIsPlaying(true));
      node.addEventListener("pause", () => setIsPlaying(false));
      node.addEventListener("stalled", handleStalled);

      // Attempt initial play
      attemptPlay(node);

      // IntersectionObserver: pause off-screen, resume on-screen
      if (typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              node.play()
                .then(() => setIsPlaying(true))
                .catch((err) => {
                  if (err instanceof DOMException && err.name !== "AbortError") {
                    console.error(`[VideoPlayback:${tag}] Resume failed — ${err.name}: ${err.message}`);
                  }
                });
            } else {
              node.pause();
            }
          },
          { threshold: 0.25 }
        );
        observer.observe(node);
        observerRef.current = observer;
      }
    },
    [attemptPlay, tag]
  );

  return { ref, hasError, isPlaying };
}
