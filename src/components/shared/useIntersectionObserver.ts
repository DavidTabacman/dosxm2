import { useCallback, useEffect, useRef, useState } from "react";

export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [ref: (node: Element | null) => void, isIntersecting: boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
      return;
    }

    // SSR safety
    if (typeof IntersectionObserver === "undefined") {
      setIsIntersecting(true);
      return;
    }

    // Respect reduced motion — treat as always visible
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px", ...optionsRef.current }
    );

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return [ref, isIntersecting];
}
