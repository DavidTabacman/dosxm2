import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * Returns a 0..1 value representing how far a referenced element
 * has scrolled through the viewport (0 = bottom edge entering, 1 = top edge leaving).
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // SSR safety
    if (typeof window === "undefined" || !ref.current) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(0);
      return;
    }

    const el = ref.current;

    function update() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when element top is at viewport bottom, 1 when element bottom is at viewport top
      const raw = (vh - rect.top) / (vh + rect.height);
      setProgress(Math.max(0, Math.min(1, raw)));
    }

    function handleScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [ref]);

  return progress;
}
