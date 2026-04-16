import { useCallback, useEffect, useRef, useState } from "react";

let aliveIdCounter = 0;

/**
 * Two-phase scroll reveal hook with CSS Scroll-Driven Animations detection.
 *
 * When the browser supports `animation-timeline: view()` (Chrome 115+, Safari 26+),
 * this hook returns [ref, true, true] immediately — CSS handles the animations.
 *
 * When unsupported (Firefox, older browsers), falls back to two fire-once
 * IntersectionObservers at different thresholds:
 *   - isEntered (low threshold): card fades in, still B&W
 *   - isAlive (high threshold): card transitions to color, video can start
 *
 * Respects prefers-reduced-motion and SSR safety.
 */
export function useScrollAlive(
  entranceThreshold = 0.15,
  aliveThreshold = 0.5
): [ref: (node: Element | null) => void, isEntered: boolean, isAlive: boolean] {
  const [isEntered, setIsEntered] = useState(false);
  const [isAlive, setIsAlive] = useState(false);
  const entranceObserverRef = useRef<IntersectionObserver | null>(null);
  const aliveObserverRef = useRef<IntersectionObserver | null>(null);
  const debugId = useRef(++aliveIdCounter);

  // Check if CSS scroll-driven animations are supported
  const cssSupported = useRef(
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline", "view()")
  );

  useEffect(() => {
    return () => {
      entranceObserverRef.current?.disconnect();
      aliveObserverRef.current?.disconnect();
    };
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      entranceObserverRef.current?.disconnect();
      aliveObserverRef.current?.disconnect();

      if (!node) return;

      const tag = `ScrollAlive#${debugId.current}`;
      const elLabel = `${node.tagName?.toLowerCase()}.${(node.className?.toString() || "").slice(0, 40)}`;

      // If CSS scroll-driven animations handle everything, skip JS
      if (cssSupported.current) {
        console.log(
          `[${tag}] ✅ CSS animation-timeline:view() supported — ` +
          `skipping JS observers, both phases immediately active. Element: ${elLabel}`
        );
        setIsEntered(true);
        setIsAlive(true);
        return;
      }

      // SSR safety
      if (typeof IntersectionObserver === "undefined") {
        console.warn(
          `[${tag}] ⚠️ IntersectionObserver unavailable (SSR?) — ` +
          `forcing both phases active. Element: ${elLabel}`
        );
        setIsEntered(true);
        setIsAlive(true);
        return;
      }

      // Reduced motion — show everything immediately
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        console.log(
          `[${tag}] ♿ prefers-reduced-motion — forcing both phases active. Element: ${elLabel}`
        );
        setIsEntered(true);
        setIsAlive(true);
        return;
      }

      console.log(
        `[${tag}] 🎬 JS fallback active (CSS animation-timeline not supported) — ` +
        `observing with thresholds: entrance=${entranceThreshold}, alive=${aliveThreshold}. ` +
        `Element: ${elLabel}`
      );

      // Observer 1: entrance (low threshold) — card fades in, still B&W
      const entranceObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log(
              `[${tag}] 👁️ ENTERED — ratio: ${(entry.intersectionRatio ?? 0).toFixed(2)}, ` +
              `threshold: ${entranceThreshold}. Card should now be visible in B&W.`
            );
            setIsEntered(true);
            entranceObs.unobserve(node);
          }
        },
        { threshold: entranceThreshold }
      );
      entranceObs.observe(node);
      entranceObserverRef.current = entranceObs;

      // Observer 2: alive (high threshold) — card colorizes, video starts
      const aliveObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log(
              `[${tag}] 🎨 ALIVE — ratio: ${(entry.intersectionRatio ?? 0).toFixed(2)}, ` +
              `threshold: ${aliveThreshold}. Card should now colorize + video should start.`
            );
            setIsAlive(true);
            aliveObs.unobserve(node);
          }
        },
        { threshold: aliveThreshold }
      );
      aliveObs.observe(node);
      aliveObserverRef.current = aliveObs;
    },
    [entranceThreshold, aliveThreshold]
  );

  return [ref, isEntered, isAlive];
}
