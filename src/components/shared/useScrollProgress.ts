import { type RefObject, useEffect, useRef } from "react";

/**
 * Sets a CSS custom property (default `--scroll-progress`) on the referenced
 * element, updated on every scroll frame via direct DOM mutation.
 *
 * Value range: 0 (element bottom entering viewport) to 1 (element top leaving).
 *
 * Zero React re-renders — consumers read the value via CSS calc().
 * Respects prefers-reduced-motion (leaves property unset).
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  propertyName = "--scroll-progress"
): void {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const el = ref.current;

    function update() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (vh + rect.height);
      el.style.setProperty(propertyName, String(Math.max(0, Math.min(1, raw))));
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
  }, [ref, propertyName]);
}
