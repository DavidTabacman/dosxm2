import { useCallback, useEffect, useRef, useState } from "react";

let revealIdCounter = 0;

export interface UseSectionRevealOptions {
  /**
   * IntersectionObserver rootMargin. Useful for sections that should
   * reveal slightly before fully entering the viewport (e.g. V4 Métricas
   * fires with `"0px 0px -10% 0px"` so short viewports still trigger).
   */
  rootMargin?: string;
}

/**
 * Scroll-triggered entrance animation hook (fire-once).
 * Returns [ref, isRevealed] — apply the ref to the element and toggle
 * CSS classes based on isRevealed.
 *
 * Respects prefers-reduced-motion by immediately returning true.
 */
export function useSectionReveal(
  threshold = 0.15,
  options: UseSectionRevealOptions = {}
): [ref: (node: Element | null) => void, isRevealed: boolean] {
  const { rootMargin = "0px" } = options;
  const [isRevealed, setIsRevealed] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debugId = useRef(++revealIdCounter);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      observerRef.current?.disconnect();

      if (!node) return;

      const tag = node.tagName?.toLowerCase() || "?";
      const cls = node.className?.toString().slice(0, 50) || "(no class)";
      const label = `${tag}.${cls}`;

      // SSR safety
      if (typeof IntersectionObserver === "undefined") {
        console.warn(`[SectionReveal #${debugId.current}] ⚠️ IntersectionObserver not available (SSR?). Forcing revealed. Element: ${label}`);
        setIsRevealed(true);
        return;
      }

      // Respect reduced motion
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        console.log(`[SectionReveal #${debugId.current}] ♿ prefers-reduced-motion active — forcing revealed immediately. Element: ${label}`);
        setIsRevealed(true);
        return;
      }

      // Already-visible safety net: if the element is already within the
      // viewport when the ref attaches (e.g. direct-link nav with #hash),
      // fire immediately — IntersectionObserver's initial callback can
      // otherwise arrive too late or appear skipped.
      if (typeof window !== "undefined") {
        const rect = node.getBoundingClientRect();
        const inView =
          rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0;
        if (inView) {
          console.log(
            `[SectionReveal #${debugId.current}] ⚡ Already in view on mount — revealing immediately. Element: ${label}`
          );
          setIsRevealed(true);
          return;
        }
      }

      console.log(`[SectionReveal #${debugId.current}] 👁️ Observing element: ${label} | threshold: ${threshold} | rootMargin: ${rootMargin}`);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log(`[SectionReveal #${debugId.current}] ✅ Revealed — ratio: ${(entry.intersectionRatio ?? 0).toFixed(2)} | Element: ${label}`);
            setIsRevealed(true);
            observer.unobserve(node); // Fire once
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold, rootMargin]
  );

  return [ref, isRevealed];
}
