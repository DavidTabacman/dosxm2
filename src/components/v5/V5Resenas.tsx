import { useEffect, useState } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import { useSectionVisible } from "../shared/useSectionVisible";
import { RESENAS, type ResenaItem } from "./resenasData";
import styles from "./V5Resenas.module.css";
import anim from "./v5-animations.module.css";

const TYPING_MS = 800;
const STAGGER_MS = 1200;

type BubbleState = "hidden" | "typing" | "visible";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ReviewBubble({
  review,
  index,
}: {
  review: ResenaItem;
  index: number;
}) {
  // Reduced motion users see the final bubble immediately — no typing
  // cascade, no staggered delay. JS-driven animations (setTimeout) don't
  // get the free respect that CSS @media (prefers-reduced-motion) gives,
  // so we skip them explicitly.
  const [state, setState] = useState<BubbleState>(() =>
    prefersReducedMotion() ? "visible" : "hidden"
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;

    console.log(
      `[V5-Resenas] 🎬 Bubble #${index} "${review.sender}" — ` +
        `typing @${index * STAGGER_MS}ms, visible @${index * STAGGER_MS + TYPING_MS}ms`
    );

    const typingTimeout = setTimeout(() => {
      setState("typing");
    }, index * STAGGER_MS);
    const visibleTimeout = setTimeout(() => {
      setState("visible");
    }, index * STAGGER_MS + TYPING_MS);

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(visibleTimeout);
    };
    // sender included for diagnostics consistency; index drives timing.
  }, [index, review.sender]);

  if (state === "hidden") {
    return (
      <div
        className={`${styles.row} ${review.side === "right" ? styles.rowRight : ""}`}
        aria-hidden="true"
      />
    );
  }

  const slideClass =
    review.side === "right" ? styles.slideRight : styles.slideLeft;

  return (
    <div
      className={`${styles.row} ${review.side === "right" ? styles.rowRight : ""} ${slideClass} ${styles.inView}`}
    >
      {state === "typing" ? (
        <div className={styles.typing} aria-label="Escribiendo…">
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
        </div>
      ) : (
        <div className={styles.bubble}>
          <div>
            <span className={styles.senderName}>{review.sender}</span>
            <span className={styles.location}>{review.location}</span>
          </div>
          <p className={styles.message}>{review.text}</p>
          <span className={styles.time}>{review.time}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Placeholder row rendered while the section is out of view. Preserves
 * the chat's vertical rhythm so re-entering doesn't cause a layout jump.
 */
function ChatPlaceholderRow({ side }: { side: ResenaItem["side"] }) {
  return (
    <div
      className={`${styles.row} ${side === "right" ? styles.rowRight : ""}`}
      aria-hidden="true"
    />
  );
}

export interface V5ResenasProps {
  id?: string;
  items?: ReadonlyArray<ResenaItem>;
}

export default function V5Resenas({
  id = "resenas",
  items = RESENAS,
}: V5ResenasProps) {
  /* Header entrance animation is fire-once — the title should not
     replay on every re-entry, only the chat typing does. */
  const [headerRef, isHeaderRevealed] = useSectionReveal(0.2);

  /* Chat replay uses a repeatable hook — BRD 4.5 wants the typing
     cascade to play every time the user scrolls in. */
  const [chatRef, isChatVisible] = useSectionVisible(
    0.2,
    "0px 0px -5% 0px"
  );

  /* The conditional render (ReviewBubble when visible, ChatPlaceholderRow
     when not) handles reset for free: leaving the viewport unmounts the
     bubbles, re-entering mounts new ones with fresh state + fresh timers.
     No cycle counter, no manual state reset — React's unmount/mount does
     the work. */

  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby="v4-resenas-heading"
    >
      <div
        ref={headerRef}
        className={`${styles.sectionHeader} ${anim.revealTarget} ${
          isHeaderRevealed ? anim.revealTargetVisible : ""
        }`}
      >
        <h2 id="v4-resenas-heading" className={styles.heading}>
          Lo que dicen{" "}
          <span className={styles.headingAccent}>nuestros clientes.</span>
        </h2>
        <p className={styles.sub}>
          Reseñas reales de personas a quienes acompañamos desde la primera
          visita hasta la firma.
        </p>
      </div>

      <div
        ref={chatRef}
        className={styles.chat}
        role="log"
        aria-label="Reseñas de clientes de DOSXM2"
      >
        {items.map((review, index) =>
          isChatVisible ? (
            <ReviewBubble
              key={review.id}
              review={review}
              index={index}
            />
          ) : (
            <ChatPlaceholderRow key={review.id} side={review.side} />
          )
        )}
      </div>

      <div className={styles.reviewCtaWrap}>
        <a
          className={styles.reviewCta}
          href="https://www.google.com/maps/place/DOSxM2+(Dos+por+metro+cuadrado)/@40.525282,-3.8160298,17z/data=!3m1!4b1!4m7!3m6!1s0x8c306f10183749f7:0x1d04dbc6b38dacd6!8m2!3d40.525282!4d-3.8160298!9m1!1b1!16s%2Fg%2F11zbhj00jx"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GoogleGIcon />
          Ver más reseñas y deja la tuya en Google
        </a>
      </div>
    </section>
  );
}

function GoogleGIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 7.1 29.3 5 24 5 16.3 5 9.7 9 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2c-2 1.5-4.5 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.3 5.2c-.4.4 6.7-4.9 6.7-14.8 0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
