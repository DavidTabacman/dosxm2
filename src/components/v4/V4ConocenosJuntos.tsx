import Link from "next/link";
import { useSectionReveal } from "../shared/useSectionReveal";
import {
  FOUNDER_BORJA,
  FOUNDER_PABLO,
  JUNTOS_HEADING,
  JUNTOS_PARAGRAPHS,
  TOGETHER_IMAGE,
} from "@/constants/founders";
import styles from "./V4ConocenosJuntos.module.css";
import anim from "./v4-animations.module.css";

export interface V4ConocenosJuntosProps {
  id?: string;
  /** CTA destination — defaults to the homepage contact section. */
  ctaHref?: string;
  ctaLabel?: string;
}

export default function V4ConocenosJuntos({
  id = "juntos",
  ctaHref = "/v4#contacto",
  ctaLabel = "Hablemos",
}: V4ConocenosJuntosProps) {
  const [revealRef, isRevealed] = useSectionReveal(0.15);
  // Higher threshold (0.6) so convergence fires when the section is
  // dominant in the viewport, not at first sliver — prevents the
  // "they meet too early" abruptness flagged in the BRD risk table.
  // Fire-once (useSectionReveal, not useSectionVisible) so once the
  // founders have "joined", the joint photo locks in place: scrolling
  // past the section, scrolling back up, then scrolling down again
  // never reverses the convergence into a separation.
  const [stripRef, stripActive] = useSectionReveal(0.6);

  return (
    <section
      id={id}
      ref={revealRef}
      aria-labelledby="v4-conocenos-juntos-heading"
      className={`${styles.section} ${
        isRevealed ? styles.sectionRevealed : ""
      }`}
    >
      <div className={styles.layout}>
        <div
          ref={stripRef}
          className={styles.diptych}
          data-converging={stripActive ? "true" : "false"}
        >
          <div
            className={styles.diptychSlot}
            data-slot-index="0"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOUNDER_PABLO.portraitUrl}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>

          <picture className={styles.togetherFrame}>
            <source srcSet={TOGETHER_IMAGE.webp} type="image/webp" />
            <img
              src={TOGETHER_IMAGE.jpgFallback}
              alt={TOGETHER_IMAGE.alt}
              data-asset-type="together"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const img = e.currentTarget;
                console.error(
                  `[V4-Conocenos] ❌ Together image load FAILED — ` +
                    `src: ${img.src}. Reason: file missing or blocked.`
                );
                img.style.visibility = "hidden";
              }}
            />
          </picture>

          <div
            className={styles.diptychSlot}
            data-slot-index="1"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOUNDER_BORJA.portraitUrl}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div
          className={`${styles.copy} ${anim.stagger} ${
            isRevealed ? anim.staggerVisible : ""
          }`}
        >
          <h2
            id="v4-conocenos-juntos-heading"
            className={styles.heading}
          >
            <span className={styles.headingClip}>{JUNTOS_HEADING}</span>
          </h2>
          <div className={styles.ruleAccent} aria-hidden="true" />
          {JUNTOS_PARAGRAPHS.map((p, i) => (
            <p key={i} className={styles.body}>
              {p}
            </p>
          ))}
          <div className={styles.ctaRow}>
            <Link href={ctaHref} className={styles.cta}>
              <span>{ctaLabel}</span>
              <svg
                className={styles.ctaArrow}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10m0 0L9 4m4 4l-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
