import { useEffect, useRef, useState } from "react";
import V4FounderLinks from "./V4FounderLinks";
import styles from "./V4WhatsAppFAB.module.css";

export interface V4WhatsAppFABProps {
  /** Founder A (left) phone in international format without "+". */
  founderAPhone: string;
  /** Founder B (right) phone in international format without "+". */
  founderBPhone: string;
  /** Prefilled message (shared between both founders). Will be URI-encoded. */
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
  /** Founder A first name, used in accessible label and tooltip. */
  founderAName: string;
  /** Founder B first name, used in accessible label and tooltip. */
  founderBName: string;
}

/**
 * Mounted once per page. Renders the two founder portraits as circular
 * floating buttons in the bottom-right corner. Per BRD 4.2, this is the
 * "detached" continuation of the Diferencial section's portraits — no
 * separate WhatsApp button, no visible label pill. Each portrait is its
 * own link, routing WhatsApp to that specific founder's number.
 */
export default function V4WhatsAppFAB({
  founderAPhone,
  founderBPhone,
  message,
  visible,
  portraitAUrl,
  portraitAAlt,
  portraitBUrl,
  portraitBAlt,
  founderAName,
  founderBName,
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

  return (
    <div
      className={`${styles.fab} ${show ? "" : styles.fabHidden}`}
      aria-hidden={!show}
      data-testid="v4-whatsapp-fab"
    >
      <V4FounderLinks
        founderAPhone={founderAPhone}
        founderBPhone={founderBPhone}
        founderAName={founderAName}
        founderBName={founderBName}
        portraitAUrl={portraitAUrl}
        portraitAAlt={portraitAAlt}
        portraitBUrl={portraitBUrl}
        portraitBAlt={portraitBAlt}
        message={message}
        focusable={show}
      />
    </div>
  );
}
