import { useEffect, useRef, useState } from "react";
import { buildWhatsAppUrl } from "../shared/whatsApp";
import styles from "./V4WhatsAppFAB.module.css";

export interface V4WhatsAppFABProps {
  /** Phone in international format without "+" (for wa.me URL). */
  phone: string;
  /** Prefilled message. Will be URI-encoded. */
  message?: string;
  /**
   * External "should show" signal, normally produced by
   * `useScrollPastAnchor("#diferencial")` in the parent page. When true,
   * the FAB rises into view; when false, it hides.
   */
  visible: boolean;
  /** Left-side (first) founder portrait URL. */
  portraitAUrl: string;
  /** Left-side portrait alt text. */
  portraitAAlt: string;
  /** Right-side (second) founder portrait URL. */
  portraitBUrl: string;
  portraitBAlt: string;
  /** Founder A first name, used in accessible label. */
  founderAName: string;
  /** Founder B first name, used in accessible label. */
  founderBName: string;
  /**
   * Tooltip text revealed on hover/focus. Not rendered as a visible pill
   * label — the portraits themselves are the affordance (BRD 4.2).
   */
  tooltip?: string;
}

/**
 * Mounted once per page. Renders the two founder portraits as a circular
 * floating button in the bottom-right corner. Per BRD 4.2, this is the
 * "detached" continuation of the Diferencial section's portraits — no
 * separate WhatsApp button, no visible label pill. Clicking opens WhatsApp.
 */
export default function V4WhatsAppFAB({
  phone,
  message,
  visible,
  portraitAUrl,
  portraitAAlt,
  portraitBUrl,
  portraitBAlt,
  founderAName,
  founderBName,
  tooltip = "Hablemos por WhatsApp",
}: V4WhatsAppFABProps) {
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

  const show = armed && visible;
  const url = buildWhatsAppUrl(phone, message);
  const ariaLabel = `Hablemos con ${founderAName} y ${founderBName} por WhatsApp`;

  return (
    <div
      className={`${styles.fab} ${show ? "" : styles.fabHidden}`}
      aria-hidden={!show}
      data-testid="v4-whatsapp-fab"
    >
      <a
        href={url}
        className={styles.button}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        aria-label={ariaLabel}
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
        <span className={styles.tooltip} role="tooltip">
          {tooltip}
        </span>
      </a>
    </div>
  );
}
