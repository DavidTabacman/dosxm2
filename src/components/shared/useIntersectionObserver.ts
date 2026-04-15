import { useCallback, useEffect, useRef, useState } from "react";

let observerIdCounter = 0;

export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [ref: (node: Element | null) => void, isIntersecting: boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debugId = useRef(++observerIdCounter);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const ref = useCallback((node: Element | null) => {
    // Cleanup previous observer
    observerRef.current?.disconnect();

    if (!node) {
      console.log(`[IntersectionObserver #${debugId.current}] ref called with null node`);
      return;
    }

    const tag = node.tagName.toLowerCase();
    const cls = node.className?.toString().slice(0, 60) || "(no class)";
    const label = `${tag}.${cls}`;

    // SSR safety
    if (typeof IntersectionObserver === "undefined") {
      console.warn(`[IntersectionObserver #${debugId.current}] ⚠️ IntersectionObserver API not available (SSR?). Forcing visible. Element: ${label}`);
      setIsIntersecting(true);
      return;
    }

    // Respect reduced motion — treat as always visible
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      console.log(`[IntersectionObserver #${debugId.current}] ♿ prefers-reduced-motion detected. Forcing visible. Element: ${label}`);
      setIsIntersecting(true);
      return;
    }

    const mergedOptions = { threshold: 0.1, rootMargin: "0px", ...optionsRef.current };
    console.log(`[IntersectionObserver #${debugId.current}] 👁️ Observing element: ${label} | threshold: ${mergedOptions.threshold} | rootMargin: ${mergedOptions.rootMargin}`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          console.log(`[IntersectionObserver #${debugId.current}] ✅ NOW VISIBLE — ratio: ${(entry.intersectionRatio ?? 0).toFixed(2)} | Element: ${label}`);
        }
      },
      mergedOptions
    );

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return [ref, isIntersecting];
}
