import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

/**
 * Context-aware custom cursor for V1 layout.
 * Uses translate3d for GPU compositing, lerp for smooth trailing.
 * Reads data-cursor attributes from hovered elements for state changes.
 * Hidden on touch devices and when prefers-reduced-motion is active.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) {
      console.error("[CustomCursor] Ring or dot ref is null — cursor elements not mounted.");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function animate() {
      if (reducedMotion) {
        current.current.x = target.current.x;
        current.current.y = target.current.y;
      } else {
        current.current.x = lerp(current.current.x, target.current.x, 0.15);
        current.current.y = lerp(current.current.y, target.current.y, 0.15);
      }

      if (ring) {
        ring.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      if (!visibleRef.current) {
        visibleRef.current = true;
        ring!.style.opacity = "1";
        dot!.style.opacity = "1";
      }
    }

    function onMouseOver(e: MouseEvent) {
      const el = (e.target as HTMLElement).closest("[data-cursor]");
      if (el && ring) {
        ring.dataset.state = el.getAttribute("data-cursor") || "hover";
      }
    }

    function onMouseOut(e: MouseEvent) {
      const el = (e.relatedTarget as HTMLElement | null)?.closest?.("[data-cursor]");
      if (!el && ring) {
        ring.dataset.state = "";
      }
    }

    function onMouseLeave() {
      visibleRef.current = false;
      if (ring) ring.style.opacity = "0";
      if (dot) dot.style.opacity = "0";
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  );
}
