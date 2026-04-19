import { useCallback, useEffect, useRef, useState } from "react";

let visibleIdCounter = 0;

/**
 * Repeatable scroll visibility hook — the counterpart to
 * `useSectionReveal` which is fire-once.
 *
 * Use this when an animation must replay every time the user scrolls
 * the section back into view (e.g. V4 Reseñas typing animation, BRD 4.5).
 *
 * Respects `prefers-reduced-motion: reduce` by locking the return to `true`
 * so consumers bypass entrance effects and render the final state.
 */
export function useSectionVisible(
  threshold = 0.2,
  rootMargin = "0px"
): [ref: (node: Element | null) => void, isVisible: boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debugId = useRef(++visibleIdCounter);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node) return;

      const tag = node.tagName?.toLowerCase() || "?";
      const cls = node.className?.toString().slice(0, 50) || "(no class)";
      const label = `${tag}.${cls}`;

      if (typeof IntersectionObserver === "undefined") {
        console.warn(
          `[SectionVisible #${debugId.current}] ⚠️ IntersectionObserver not available (SSR?). Forcing visible. Element: ${label}`
        );
        setIsVisible(true);
        return;
      }

      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        console.log(
          `[SectionVisible #${debugId.current}] ♿ prefers-reduced-motion — locked visible. Element: ${label}`
        );
        setIsVisible(true);
        return;
      }

      console.log(
        `[SectionVisible #${debugId.current}] 👁️ Observing ${label} | threshold: ${threshold} | rootMargin: ${rootMargin}`
      );

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold, rootMargin }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold, rootMargin]
  );

  return [ref, isVisible];
}
