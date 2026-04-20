import { buildWhatsAppUrl } from "../shared/whatsApp";
import styles from "./V4FounderLinks.module.css";

export interface V4FounderLinksProps {
  founderAPhone: string;
  founderBPhone: string;
  founderAName: string;
  founderBName: string;
  portraitAUrl: string;
  portraitAAlt: string;
  portraitBUrl: string;
  portraitBAlt: string;
  /** Prefilled message (shared between both founders). URI-encoded by the builder. */
  message?: string;
  /**
   * When false, both links render with tabIndex=-1 — used by V4WhatsAppFAB while
   * the FAB is hidden, so keyboard users don't tab into invisible controls.
   */
  focusable?: boolean;
}

/**
 * Presentation-only pair of circular founder-portrait WhatsApp links. Used
 * by V4WhatsAppFAB (fixed corner dock) and by V4Valorador's success state
 * (inline under the thank-you copy).
 */
export default function V4FounderLinks({
  founderAPhone,
  founderBPhone,
  founderAName,
  founderBName,
  portraitAUrl,
  portraitAAlt,
  portraitBUrl,
  portraitBAlt,
  message,
  focusable = true,
}: V4FounderLinksProps) {
  const urlA = buildWhatsAppUrl(founderAPhone, message);
  const urlB = buildWhatsAppUrl(founderBPhone, message);
  const tabIndex = focusable ? 0 : -1;

  return (
    <div className={styles.portraitStack}>
      <a
        href={urlA}
        className={styles.portraitLink}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={tabIndex}
        aria-label={`Escribir a ${founderAName} por WhatsApp`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.portrait}
          src={portraitAUrl}
          alt={portraitAAlt}
          data-asset-type="founder-portrait"
          loading="lazy"
          onError={(e) => {
            console.error(
              `[V4-FounderLinks] ❌ Portrait A load FAILED — src: ${e.currentTarget.src}. ` +
                `Reason: image URL unreachable or blocked. Hiding element to keep UI consistent.`
            );
            e.currentTarget.style.visibility = "hidden";
          }}
        />
        <span className={styles.tooltip} role="tooltip">
          Escribir a {founderAName}
        </span>
      </a>
      <a
        href={urlB}
        className={styles.portraitLink}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={tabIndex}
        aria-label={`Escribir a ${founderBName} por WhatsApp`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.portrait}
          src={portraitBUrl}
          alt={portraitBAlt}
          data-asset-type="founder-portrait"
          loading="lazy"
          onError={(e) => {
            console.error(
              `[V4-FounderLinks] ❌ Portrait B load FAILED — src: ${e.currentTarget.src}. ` +
                `Reason: image URL unreachable or blocked. Hiding element to keep UI consistent.`
            );
            e.currentTarget.style.visibility = "hidden";
          }}
        />
        <span className={styles.tooltip} role="tooltip">
          Escribir a {founderBName}
        </span>
      </a>
    </div>
  );
}
