import { useEffect, useRef, useState } from "react";
import styles from "./V4WhatsAppFAB.module.css";

export interface V4WhatsAppFABProps {
  /** Phone in international format without "+" (for wa.me URL). */
  phone: string;
  /** Prefilled message. Will be URI-encoded. */
  message?: string;
  /** Selector for the section whose portraits transform into the FAB. */
  anchorSelector?: string;
  /** Left-side (first) founder portrait URL. */
  portraitAUrl: string;
  /** Left-side portrait alt text. */
  portraitAAlt: string;
  /** Right-side (second) founder portrait URL. */
  portraitBUrl: string;
  portraitBAlt: string;
  /** Visible label. */
  label?: string;
}

function buildWhatsAppUrl(phone: string, message?: string) {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  const base = `https://wa.me/${cleanPhone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Global FAB mounted once per page. Appears when the anchor section
 * (e.g. Differential) scrolls out of viewport, giving the visual
 * impression that the founder portraits detached and docked to the
 * corner. Portraits are static images (no video) to avoid the video
 * flash class of bugs the team fixed for V2.
 */
export default function V4WhatsAppFAB({
  phone,
  message,
  anchorSelector = "#diferencial",
  portraitAUrl,
  portraitAAlt,
  portraitBUrl,
  portraitBAlt,
  label = "Hablemos por WhatsApp",
}: V4WhatsAppFABProps) {
  const [visible, setVisible] = useState(false);
  // 100ms arming delay prevents flash during initial layout / font loading.
  const [armed, setArmed] = useState(false);
  const armedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    armedTimerRef.current = setTimeout(() => {
      setArmed(true);
      console.log(`[V4-WhatsAppFAB] ⏱️ Mount delay complete — FAB armed`);
    }, 100);
    return () => {
      if (armedTimerRef.current) clearTimeout(armedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const target = document.querySelector(anchorSelector);
    if (!target) {
      console.warn(
        `[V4-WhatsAppFAB] ⚠️ Anchor "${anchorSelector}" not found — FAB visibility cannot sync to Differential. ` +
          `Reason: section has not mounted yet or selector is wrong.`
      );
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      console.warn(
        `[V4-WhatsAppFAB] ⚠️ IntersectionObserver unavailable — defaulting FAB to visible. ` +
          `Reason: SSR pre-hydration or very old browser.`
      );
      // Client-only fallback: can't lazy-init (would cause hydration mismatch).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show FAB once the user has scrolled PAST the anchor section.
        // Per BRD 4.2, portraits "detach" on scroll — showing a FAB for
        // portraits the user hasn't seen yet (e.g. at initial hero load)
        // contradicts the narrative. `boundingClientRect.bottom <= 0` means
        // the section's bottom edge is above the viewport's top edge,
        // i.e. the user has scrolled fully past it.
        const hasScrolledPast = entry.boundingClientRect.bottom <= 0;
        setVisible(hasScrolledPast);
      },
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(target);
    console.log(`[V4-WhatsAppFAB] 👁️ Observing "${anchorSelector}"`);
    return () => observer.disconnect();
  }, [anchorSelector]);

  const show = armed && visible;

  const url = buildWhatsAppUrl(phone, message);

  return (
    <div
      className={`${styles.fab} ${show ? "" : styles.fabHidden}`}
      aria-hidden={!show}
    >
      <div className={styles.fabContainer}>
        <a
          href={url}
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          aria-label={`${label} — escribir a DOSXM2`}
        >
          <span className={styles.portraitStack}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.portrait}
              src={portraitAUrl}
              alt={portraitAAlt}
              data-asset-type="founder-portrait"
              loading="lazy"
              onError={(e) => {
                console.error(
                  `[V4-WhatsAppFAB] ❌ Portrait A load FAILED — src: ${e.currentTarget.src}. ` +
                    `Reason: image URL unreachable or blocked. Hiding element to keep UI consistent.`
                );
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.portrait}
              src={portraitBUrl}
              alt={portraitBAlt}
              data-asset-type="founder-portrait"
              loading="lazy"
              onError={(e) => {
                console.error(
                  `[V4-WhatsAppFAB] ❌ Portrait B load FAILED — src: ${e.currentTarget.src}. ` +
                    `Reason: image URL unreachable or blocked. Hiding element to keep UI consistent.`
                );
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </span>
          <svg
            className={styles.whatsAppIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.78.48 3.48 1.34 4.96L2 22l5.25-1.42c1.44.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.2 14.09c-.22.62-1.1 1.18-1.64 1.22-.5.04-1.12.05-1.8-.12-.42-.13-.95-.3-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.2-1.17-1.55-1.17-2.96 0-1.41.74-2.1 1-2.39.26-.29.56-.36.75-.36.19 0 .38 0 .54.01.17.01.4-.07.63.48.22.53.76 1.85.83 1.98.07.13.11.29.02.47-.09.18-.13.29-.26.45-.13.16-.27.35-.39.47-.13.13-.27.27-.11.54.16.27.7 1.16 1.51 1.88 1.04.93 1.92 1.21 2.19 1.35.27.13.42.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.87.27.13.45.2.52.31.07.12.07.67-.15 1.29z" />
          </svg>
          <span className={styles.label}>{label}</span>
        </a>
      </div>
    </div>
  );
}
