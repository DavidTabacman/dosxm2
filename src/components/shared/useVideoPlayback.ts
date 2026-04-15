import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Robust video autoplay hook with:
 * - AbortController-based listener cleanup (no leaks on ref re-calls)
 * - play() concurrency guard (prevents AbortError cascades)
 * - IntersectionObserver-based off-screen pause/resume
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
  const abortRef = useRef<AbortController | null>(null);
  const playPendingRef = useRef(false);

  const tag = label || "video";

  // Guarded play — prevents concurrent play() calls
  const safePlay = useCallback(async (video: HTMLVideoElement): Promise<boolean> => {
    if (playPendingRef.current || !video.paused) {
      return !video.paused;
    }

    playPendingRef.current = true;
    try {
      await video.play();
      return true;
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          console.warn(`[VideoPlayback:${tag}] Autoplay blocked. Retrying muted.`);
          video.muted = true;
          try {
            await video.play();
            return true;
          } catch (retryError) {
            const msg = retryError instanceof DOMException
              ? `${retryError.name}: ${retryError.message}`
              : String(retryError);
            console.error(`[VideoPlayback:${tag}] Muted retry FAILED — ${msg}`);
            setHasError(true);
            return false;
          }
        } else if (error.name === "AbortError") {
          // Interrupted — not a real failure, will retry via IO
          return false;
        } else {
          console.error(`[VideoPlayback:${tag}] Play error — ${error.name}: ${error.message}`);
          setHasError(true);
          return false;
        }
      }
      console.error(`[VideoPlayback:${tag}] Non-DOM play error —`, error);
      setHasError(true);
      return false;
    } finally {
      playPendingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      observerRef.current?.disconnect();
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const ref = useCallback(
    (node: HTMLVideoElement | null) => {
      // === CLEANUP previous node ===
      // AbortController removes ALL event listeners at once
      abortRef.current?.abort();
      abortRef.current = null;
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      playPendingRef.current = false;

      if (!node) {
        videoRef.current = null;
        return;
      }

      videoRef.current = node;

      // === SETUP new node ===
      const abort = new AbortController();
      const { signal } = abort;
      abortRef.current = abort;

      // Event listeners — all removed when abort.abort() is called
      node.addEventListener("error", () => {
        const err = node.error;
        console.error(
          `[VideoPlayback:${tag}] Video error — ` +
          `code: ${err?.code ?? "?"}, message: "${err?.message ?? "unknown"}", ` +
          `networkState: ${node.networkState}, src: ${node.src?.slice(-60)}`
        );
        setHasError(true);
      }, { signal });

      node.addEventListener("playing", () => setIsPlaying(true), { signal });
      node.addEventListener("pause", () => setIsPlaying(false), { signal });

      node.addEventListener("stalled", () => {
        console.error(`[VideoPlayback:${tag}] Network stalled — src: ${node.src?.slice(-40)}`);
      }, { signal });

      // Initial play attempt
      safePlay(node).then((ok) => {
        if (ok) setIsPlaying(true);
        else if (!node.paused) setIsPlaying(true);
      });

      // IntersectionObserver: pause off-screen, resume on-screen
      if (typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (signal.aborted) return; // Skip if node was cleaned up
            if (entry.isIntersecting) {
              safePlay(node).then((ok) => {
                if (ok) setIsPlaying(true);
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
    [safePlay, tag]
  );

  return { ref, hasError, isPlaying };
}
