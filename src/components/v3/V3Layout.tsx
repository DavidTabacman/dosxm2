import { useEffect, useRef, type ReactNode } from "react";
import styles from "./V3Layout.module.css";

interface V3LayoutProps {
  children: ReactNode;
  fontClassName: string;
}

export default function V3Layout({ children, fontClassName }: V3LayoutProps) {
  const barRef = useRef<HTMLDivElement>(null);

  // JS fallback for browsers without CSS scroll-driven animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cssScrollAnimSupported =
      typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline: scroll()");

    if (cssScrollAnimSupported) {
      console.log(
        `[V3-Layout] ✅ CSS scroll-driven progress bar supported — JS fallback skipped`
      );
      return;
    }

    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        console.log(`[V3-Layout] ♿ prefers-reduced-motion — progress bar hidden`);
        return;
      }
    } catch (err) {
      console.error(
        `[V3-Layout] ❌ Failed to query prefers-reduced-motion — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    const bar = barRef.current;
    if (!bar) {
      console.warn(
        `[V3-Layout] ⚠️ Progress bar ref is null — scroll progress won't work. ` +
        `Reason: the progress bar element has not mounted or ref was not attached.`
      );
      return;
    }

    console.log(
      `[V3-Layout] 🎬 JS scroll progress fallback INITIALIZED — ` +
      `CSS animation-timeline: scroll() not supported in this browser`
    );

    function onScroll() {
      try {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) {
          console.warn(
            `[V3-Layout] ⚠️ Scroll progress cannot compute — ` +
            `Reason: scrollable height is ${scrollHeight}px (page is not scrollable or not yet laid out)`
          );
          return;
        }
        const progress = document.documentElement.scrollTop / scrollHeight;
        if (bar) bar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
      } catch (err) {
        console.error(
          `[V3-Layout] ❌ Scroll progress update FAILED — ` +
          `Reason: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    try {
      window.addEventListener("scroll", onScroll, { passive: true });
    } catch (err) {
      console.error(
        `[V3-Layout] ❌ Failed to attach scroll listener — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${styles.root} ${fontClassName}`}>
      <div className={styles.progressBar} ref={barRef} aria-hidden="true" />
      {children}
    </div>
  );
}
